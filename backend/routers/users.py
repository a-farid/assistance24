from fastapi import APIRouter, Body, Depends
from uuid import UUID
from tools.Bd_BaseModel import DB_BaseModel
from tools.pydantic_types import T_User
from tools.standarization import StandardResponse
from tools.jwt_token import get_all_users, get_user_from_token, verify_role

router = APIRouter()

sessionDb = DB_BaseModel.get_session()


@router.get("/me", response_model=StandardResponse[T_User])
async def read_users_me(current_user= Depends(get_user_from_token)):
    return {"Success": True, "data": current_user}

# Example GET route (list of users)
@router.get("/all", status_code=200, response_model=StandardResponse[list[T_User]])
async def get_users(tk=Depends(verify_role(["admin"]))):
    print('decoded_token', tk)
    users_list = get_all_users()
    return {"Success": True, "data": users_list}

# Example POST route (create a new user)
@router.post("/create", status_code=201, response_model=StandardResponse[T_User])
async def create_user(user: T_User = Body(..., embed=True), decoded_token=Depends(verify_role(["admin"]))):
    new_user = user.model_dump()
    return { "Success": True, "data": new_user }
