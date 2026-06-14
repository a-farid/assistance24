from fastapi import HTTPException
from schemas.contract_schemas import T_Contract, T_ContractUpdate
from schemas.user_schemas import T_Profile
from database import db
from services.jwt_svc import JWTService
from settings.standarization import format_paginated_response

jwt_s = JWTService()

acces_denied = "Access denied, please contact the administrator"


async def get_worker_and_client(contract) -> dict:
    """
    Fetch and return the client and worker User objects as T_Profile dicts.
    contract.client and contract.worker are now User instances directly.
    """
    data = {}
    if contract.client:
        data["client"] = T_Profile(**contract.client.to_dict())
    if contract.worker:
        data["worker"] = T_Profile(**contract.worker.to_dict())
    return data


class ContractServices:
    def __init__(self):
        pass

    async def create_contract(self, contract: T_Contract) -> T_Contract:
        """Create a new contract. client_id and worker_id are now user IDs directly."""
        contract_data = contract.model_dump(exclude={"id"})
        new_contract = await db.contract.create(**contract_data, unique_fields=["num_contract"])
        return new_contract

    async def get_contract_by_id(self, contract_id: str) -> T_Contract:
        """Get a contract from the database."""
        return await db.contract.filter_by_id(contract_id)

    async def get_all_contracts(self, pagination) -> list[T_Contract]:
        """Get all contracts from the database."""
        result = await db.contract.get_all(**pagination)
        return await format_paginated_response(result, T_Contract)

    async def get_contract(self, contract_id: str, token) -> dict:
        """Get a contract by ID, enforcing role-based access via user_id."""
        contract = await db.contract.filter_by_id(contract_id, relationships=["client", "worker"])
        contract_data = contract.to_dict()
        contract_data.update(await get_worker_and_client(contract))

        user_id = token.get("user_id")
        role = token.get("role")

        if role == "admin":
            pass
        elif role == "worker":
            if str(user_id) != str(contract.worker_id):
                raise HTTPException(status_code=403, detail=acces_denied)
        elif role == "client":
            if str(user_id) != str(contract.client_id):
                raise HTTPException(status_code=403, detail=acces_denied)
        else:
            raise HTTPException(status_code=403, detail=acces_denied)

        return contract_data

    async def get_my_contracts(self, token, pagination) -> list[dict]:
        """Retrieve contracts for the authenticated user using user_id directly."""
        user_id = token.get("user_id")
        role = token.get("role")

        if role == "worker":
            my_contracts = await db.contract.filter_all(worker_id=user_id, **pagination)
        elif role == "client":
            my_contracts = await db.contract.filter_all(client_id=user_id, **pagination)
        else:
            raise HTTPException(status_code=403, detail=acces_denied)

        return await format_paginated_response(my_contracts, T_Contract)

    async def delete_contract(self, contract_id: str):
        """Delete a contract by ID."""
        return await db.contract.delete(contract_id)

    async def update_contract(self, contract_id: str, body: T_ContractUpdate) -> dict:
        """Update a contract. client_id/worker_id are user IDs — no resolution needed."""
        update_data = body.model_dump(exclude_unset=True)
        updated_contract = await db.contract.update(contract_id, relationships=["client", "worker"], **update_data)
        contract_data = updated_contract.to_dict()
        print("updated_contract", contract_data)
        contract_data.update(await get_worker_and_client(updated_contract))
        return contract_data

    async def att_worker_to_contract(self, contract_id: str, worker_id: str) -> T_Contract:
        """Assign a worker (user_id) to a contract."""
        await db.contract.filter_by_id(contract_id)
        updated_contract = await db.contract.update(contract_id, worker_id=worker_id)
        return T_Contract(**updated_contract.to_dict())

    async def att_client_to_contract(self, contract_id: str, client_id: str) -> T_Contract:
        """Assign a client (user_id) to a contract."""
        await db.contract.filter_by_id(contract_id)
        updated_contract = await db.contract.update(contract_id, client_id=client_id)
        return T_Contract(**updated_contract.to_dict())
