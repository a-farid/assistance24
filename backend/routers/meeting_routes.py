from fastapi import APIRouter, Body, Depends as Ds, Path
from schemas.contract_schemas import T_Contract, T_ContractUpdate
from services import UserServices, JWTService, ContractServices
from tools.standarization import json_response


router = APIRouter()
user_service = UserServices()
jwt_s = JWTService()
contract_service = ContractServices()



@router.post("/create", description="Create a new meeting [worker]")
async def create_new_contract(body: T_Contract = Body(...), _=Ds(jwt_s.roles_allowed(["worker"]))):
    new_contract = await contract_service.create_contract(body)
    return json_response(new_contract, 200)

