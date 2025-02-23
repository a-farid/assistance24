from fastapi import  HTTPException
from schemas.contract_schemas import T_Contract, T_ContractUpdate
from schemas.user_schemas import T_Profile
from database import db
from services.jwt_svc import JWTService
from database.models import Contract
from settings.standarization import format_paginated_response

jwt_s = JWTService()

acces_denied = "Access denied, please contact the administrator"

async def get_worker_and_client(contract: Contract) -> dict:
    """Fetch and return worker and client as T_Profile."""
    data = {}
    if contract.client:
        client_data = contract.client.to_dict()
        data["client"] = T_Profile(**client_data["user"].to_dict())
    if contract.worker:
        worker_data = contract.worker.to_dict()
        data["worker"] = T_Profile(**worker_data["user"].to_dict())
    return data




class ContractServices:
    def __init__(self):
        pass

    async def create_contract(self, contract: T_Contract) -> Contract:
        """Create a new contract in the database."""
        # Remove ID if exists (optional, but ensures no conflicts)
        contract_data = contract.model_dump(exclude={"id"})
        new_contract = await db.contract.create(**contract_data, unique_fields=["num_contract"])

        return new_contract

    async def get_contract_by_id(self, contract_id: str) -> Contract:
        """Get a contract from the database."""
        return await db.contract.filter_by_id(contract_id)

    async def get_all_contracts(self, pagination) -> list[Contract]:
        """Get all contracts from the database."""
        result = await db.contract.get_all(**pagination)
        # result = []
        # for contract in contracts["data"]:
        #     contract_data = contract.to_dict()

        #     # ✅ Ensure client exists before processing
        #     if contract.client:
        #         client_data = contract.client.to_dict()  # Convert Client object to dict
        #         contract_data["client"] = T_User(**(client_data["user"]).to_dict())

        #     # ✅ Ensure worker exists before processing
        #     if contract.worker:
        #         worker_data = contract.worker.to_dict()  # Convert Worker object to dict
        #         contract_data["worker"] = T_User(**(worker_data["user"]).to_dict())

        #     result.append(contract_data)
        return await format_paginated_response(result, T_Contract, nested_user=False)


    async def get_contract(self, contract_id: str, token) -> dict:
        """Get a contract by ID."""
        contract = await db.contract.filter_by_id(contract_id, relationships=["client", "worker"])
        contract_data = contract.to_dict()
        contract_data.update(await get_worker_and_client(contract))
        cw_id = token.get("cw_id")


        role = token.get("role")
        if role == "admin":
            pass
        elif role == "worker":
            if str(cw_id) != str(contract.worker_id):
                raise HTTPException(status_code=403, detail=acces_denied)
        elif role == "client":
            if str(cw_id) != str(contract.client_id):
                raise HTTPException(status_code=403, detail=acces_denied)
        else:
            raise HTTPException(status_code=403, detail=acces_denied)
        return contract_data


    async def get_my_contracts(self, token, pagination) -> list[dict]:
        """Retrieve contracts for the authenticated user."""
        cw_id = token.get("cw_id")
        role = token.get("role")

        # Determine contracts based on user role
        if role == "worker":
            my_contracts = await db.contract.filter_all(worker_id=cw_id, **pagination)
        elif role == "client":
            my_contracts = await db.contract.filter_all(client_id=cw_id, **pagination)
        else:
            raise HTTPException(status_code=403, detail=acces_denied)

        # Apply worker/client filtering
        return await format_paginated_response(my_contracts, T_Contract, nested_user=False)

    async def delete_contract(self, contract_id: str):
        """Delete a contract by ID."""
        return await db.contract.delete(contract_id)

    async def update_contract(self, contract_id: str, body: T_ContractUpdate) -> dict:
        """Update a contract and return updated data with worker and client."""
        updated_contract = await db.contract.update(contract_id, **body.model_dump(exclude_unset=True))
        contract_data = updated_contract.to_dict()
        contract_data.update(await get_worker_and_client(updated_contract))
        return contract_data

    async def att_worker_to_contract(self, contract_id: int, worker_id: int) -> Contract:
        """Assign a worker to a contract."""
        # Ensure contract and worker exist
        await db.contract.filter_by_id(contract_id)
        await db.worker.filter_by_id(worker_id)

        updated_contract = await db.contract.update(contract_id, worker_id=worker_id)

        return T_Contract(**updated_contract.to_dict())

    async def att_client_to_contract(self, contract_id: int, client_id: int) -> Contract:
        """Assign a client to a contract."""
        # Ensure contract and worker exist
        await db.contract.filter_by_id(contract_id)
        await db.client.filter_by_id(client_id)

        updated_contract = await db.contract.update(contract_id, client_id=client_id)

        return T_Contract(**updated_contract.to_dict())
