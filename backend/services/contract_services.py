from typing import Any, Dict, Optional
from fastapi import  HTTPException
from schemas.contract_schemas import T_Contract, T_ContractUpdate
from schemas.user_schemas import T_Profile, T_User
from services.jwt_services import JWTService
from db.models import Client, Worker, Contract

jwt_s = JWTService()


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
        new_contract = await Contract.create(**contract_data)

        return new_contract

    async def get_contract_by_id(self, contract_id: str) -> Contract:
        """Get a contract from the database."""

        contract = await Contract.filter_by_id(contract_id)
        if not contract:
            raise HTTPException(
                status_code=404, detail="Contract not found")

        return contract

    async def get_all_contracts(self) -> list[Contract]:
        """Get all contracts from the database."""
        contracts = await Contract.get_all()

        result = []
        for contract in contracts:
            contract_data = contract.to_dict()

            # ✅ Ensure client exists before processing
            if contract.client:
                client_data = contract.client.to_dict()  # Convert Client object to dict
                contract_data["client"] = T_User(**(client_data["user"]).to_dict())

            # ✅ Ensure worker exists before processing
            if contract.worker:
                worker_data = contract.worker.to_dict()  # Convert Worker object to dict
                contract_data["worker"] = T_User(**(worker_data["user"]).to_dict())

            result.append(contract_data)


        return result

    async def get_contract(self, contract_id: str, token) -> dict:
        """Get a contract by ID."""
        contract = await self.get_contract_by_id(contract_id)

        if not contract:
            raise HTTPException(status_code=404, detail="Contract not found")

        data = {"contract": contract}
        user_id = token.get("user_id")
        role = token.get("role")
        contract_worker_id = str(contract.worker_id)
        contract_client_id = str(contract.client_id)

        if role == "admin":
            client = await Client.filter_by_id(contract_client_id)
            if client:
                data["client"] = T_User(**client.user.to_dict())
            worker = await Worker.filter_by_id(contract_worker_id)
            if worker:
                data["worker"] = T_User(**worker.user.to_dict())
            return data

        if role == "worker":
            my_worker_id = await Worker.get_id(user_id=user_id)
            if not my_worker_id or str(my_worker_id) != contract_worker_id:
                raise HTTPException(status_code=403, detail="Access denied")

            client = await Client.filter_by_id(contract_client_id)
            if client:
                data["client"] = T_User(**client.user.to_dict())
            return data
        if role == "client":
            my_client_id = await Client.get_id(user_id=user_id)
            if not my_client_id or str(my_client_id) != contract_client_id:
                raise HTTPException(status_code=403, detail="Access denied")

            worker = await Worker.filter_by_id(contract_worker_id)
            if worker:
                data["worker"] = T_User(**worker.user.to_dict())
            return data

        raise HTTPException(status_code=403, detail="Access denied")

    async def get_contract(self, contract_id: str, token) -> dict:
        """Retrieve a contract by ID and enforce access control."""
        contract = await self.get_contract_by_id(contract_id)
        user_id = token.get("user_id")
        role = token.get("role")

        # Access control based on role
        if role == "admin":
            pass
        elif role == "worker":
            my_worker_id = await Worker.get_id(user_id=user_id)
            if not my_worker_id or str(my_worker_id) != str(contract.worker_id):
                raise HTTPException(status_code=403, detail="Access denied")
        elif role == "client":
            my_client_id = await Client.get_id(user_id=user_id)
            if not my_client_id or str(my_client_id) != str(contract.client_id):
                raise HTTPException(status_code=403, detail="Access denied")
        else:
            raise HTTPException(status_code=403, detail="Access denied")

        contract_data = contract.to_dict()
        contract_data.update(await get_worker_and_client(contract))
        return contract_data

    async def get_my_contracts(self, token) -> list[dict]:
        """Retrieve contracts for the authenticated user."""
        user_id = token.get("user_id")
        role = token.get("role")

        if role == "admin":
            # my_contracts = await Contract.get_all()
            raise HTTPException(status_code=400, detail="No contracts available for admin")

        # Determine contracts based on user role
        if role == "worker":
            my_worker_id = await Worker.get_id(user_id=user_id)
            my_contracts = await Contract.filter_all(worker_id=my_worker_id)
        elif role == "client":
            my_client_id = await Client.get_id(user_id=user_id)
            my_contracts = await Contract.filter_all(client_id=my_client_id)

        # Apply worker/client filtering
        result = []
        for contract in my_contracts:
            contract_data = contract.to_dict()
            contract_data.update(await get_worker_and_client(contract))
            result.append(contract_data)

        return result

    async def delete_contract(self, contract_id: str):
        """Delete a contract by ID."""
        contract = await self.get_contract_by_id(contract_id)
        await Contract.delete(contract_id)
        return True

    async def update_contract(self, contract_id: str, body: T_ContractUpdate) -> dict:
        """Update a contract and return updated data with worker and client."""
        contract = await self.get_contract_by_id(contract_id)
        updated_contract = await Contract.update(contract_id, **body.model_dump(exclude_unset=True))

        contract_data = updated_contract.to_dict()
        contract_data.update(await get_worker_and_client(updated_contract))
        return contract_data

    async def att_worker_to_contract(self, contract_id: int, worker_id: int) -> Contract:
        """Assign a worker to a contract."""
        if not await self.get_contract_by_id(contract_id):
            raise HTTPException(status_code=404, detail="Contract not found")

        if not await Worker.filter_by_id(worker_id):
            raise HTTPException(status_code=404, detail="Worker not found")

        updated_contract = await Contract.update(contract_id, worker_id=worker_id)

        return T_Contract(**updated_contract.to_dict())

    async def att_client_to_contract(self, contract_id: int, client_id: int) -> Contract:
        """Assign a client to a contract."""
        if not await self.get_contract_by_id(contract_id):
            raise HTTPException(status_code=404, detail="Contract not found")

        if not await Client.filter_by_id(client_id):
            raise HTTPException(status_code=404, detail="Client not found")

        updated_contract = await Contract.update(contract_id, client_id=client_id)

        return T_Contract(**updated_contract.to_dict())
