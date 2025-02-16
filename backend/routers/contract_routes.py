from fastapi import APIRouter, Body, Depends as Ds, Path
from schemas.contract_schemas import T_Contract, T_ContractUpdate
from services import UserServices, JWTService, ContractServices
from settings.standarization import json_response


router = APIRouter()
user_service = UserServices()
jwt_s = JWTService()
contract_service = ContractServices()



@router.get("/my_contracts", description="Get contracts for the current user")
async def get_my_contracts(token: str = Ds(jwt_s.authorized_token)):
    contracts = await contract_service.get_my_contracts(token)
    return json_response(data=contracts, message="User contracts retrieved")

@router.get("/all", description="Get all contracts")
async def get_all_contracts(tet: dict =Ds(jwt_s.authorized_token)):
    contracts = await contract_service.get_all_contracts()
    return json_response(data=contracts, message="All contracts retrieved", count=len(contracts))

@router.get("/{contract_id}", description="Get a contract by id")
async def get_all_contracts(contract_id: str = Path(...),token=Ds(jwt_s.authorized_token)):
    contract = await contract_service.get_contract(contract_id, token)
    return json_response(data=contract, message="Contract retrieved")

@router.post("/create", description="Create a new contract [admin]")
async def create_new_contract(body: T_Contract = Body(...), _=Ds(jwt_s.roles_allowed(["admin"]))):
    new_contract = await contract_service.create_contract(body)
    return json_response(new_contract, 200)

@router.put("/{contract_id}/worker/{worker_id}", description="Assigne a worker to a contract [admin]")
async def assign_worker_to_contract(contract_id: str = Path(...), worker_id: str = Path(...), _=Ds(jwt_s.roles_allowed(["admin"]))):
    contract = await contract_service.att_worker_to_contract(contract_id, worker_id)
    return json_response(data=contract, status_code=201, message="Worker assigned to contract successfully")

@router.put("/{contract_id}/client/{client_id}", description="Assigne a client to a contract [admin]")
async def assign_client_to_contract(contract_id: str = Path(...), client_id: str = Path(...), _=Ds(jwt_s.roles_allowed(["admin"]))):
    contract = await contract_service.att_client_to_contract(contract_id, client_id)
    return json_response(data=contract, status_code=201, message="Client assigned to contract successfully")

@router.put("/{contract_id}", description="Update a contract [admin]")
async def update_contract(contract_id: str = Path(...), body: T_ContractUpdate = Body(...), _=Ds(jwt_s.roles_allowed(["admin"]))):
    contract = await contract_service.update_contract(contract_id, body)
    return json_response(data=contract, status_code=201, message="Contract updated successfully")

@router.delete("/{contract_id}", description="Delete a contract [admin]")
async def delete_contract(contract_id: str = Path(...), _=Ds(jwt_s.roles_allowed(["admin"]))):
    await contract_service.delete_contract(contract_id)
    return json_response(status_code=204)


@router.delete("/{contract_id}/worker", description="Remove worker from contract [admin]")
async def detach_worker_from_contract(contract_id: str = Path(...), _=Ds(jwt_s.roles_allowed(["admin"]))):
    contract = await contract_service.update_contract(contract_id, T_ContractUpdate(worker_id=None))
    return json_response(data=contract, status_code=201, message="Worker removed successfully")

@router.delete("/{contract_id}/client", description="Remove client from contract [admin]")
async def detach_client_from_contract(contract_id: str = Path(...), _=Ds(jwt_s.roles_allowed(["admin"]))):
    contract = await contract_service.update_contract(contract_id, T_ContractUpdate(client_id=None))
    return json_response(data=contract, status_code=201, message="Client removed successfully")
