from fastapi import APIRouter, Body, Depends as Ds, HTTPException, Path
from schemas.user_schemas import T_Email, T_Profile, T_UserInDb, T_Worker, T_Client
from services.user_services import UserServices
from db.redis import redis_delete, redis_set
from db.models import User
from services.jwt_services import JWTService
from settings.standarization import json_response


router = APIRouter()
user_service = UserServices()
jwt_s = JWTService()

@router.get("/me", description="Get the connected user.")
async def read_connected_user(current_user= Ds(user_service.get_user_from_token)):
    return {"success": True, "data": current_user}

@router.get("/all", status_code=200, description="Get all users.")
async def get_users(tk=Ds(jwt_s.roles_allowed(["admin"]))):
    users_list = await user_service.get_all_users()
    return {"success": True, "data": users_list}

@router.get("/workers/all", status_code=200)
async def get_all_workers(tk=Ds(jwt_s.roles_allowed(["admin"]))):
    workers_list = await user_service.get_all_workers()

    return json_response(data=workers_list, message="All workers retrieved")

@router.get("/clients/all", status_code=200)
async def get_all_clients(tk=Ds(jwt_s.roles_allowed(["admin"]))):
    clients_list = await user_service.get_all_clients()
    return {"success": True, "data": clients_list}

@router.put("/me", description="Update the connected user.")
async def update_connected_user(body: T_Profile = Body(...), current_user=Ds(user_service.get_user_from_token)):
    updated_user = await User.update(current_user.id, **body.model_dump(exclude_unset=True))
    await redis_set(updated_user.id, T_UserInDb(**updated_user.to_dict()))

    return {"success": True, "data": updated_user}

@router.put("/me/email", description="Update the connected user.")
async def update_connected_user(body: T_Email = Body(...), current_user=Ds(user_service.get_user_from_token)):

    # Check if email already exists
    if await User.filter_by(email=body.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    updated_user = await User.update(current_user.id, email=body.email)

    await redis_set(updated_user.id, T_UserInDb(**updated_user.to_dict()))

    return {"success": True, "data": updated_user}

@router.put("/{user_id}", description="Update a user.")
async def update_user(user_id: str = Path(...),body: T_Profile = Body(...),_: dict = Ds(jwt_s.roles_allowed(["admin"]))):
    if not await User.filter_by_id(user_id):
        raise HTTPException(status_code=404, detail="User not found")

    updated_user = await User.update(user_id, **body.model_dump(exclude_unset=True))
    redis_set(user_id, T_UserInDb(**updated_user.to_dict()))

    return {"success": True, "data": updated_user}

@router.put("/{user_id}/disable", description="Desactivate a user.")
async def disable_user(user_id: str = Path(...),_: dict = Ds(jwt_s.roles_allowed(["admin"]))):
    if not await User.filter_by_id(user_id):
        raise HTTPException(status_code=404, detail="User not found")

    updated_user = await User.update(user_id, disabled=True)
    await redis_set(user_id, T_UserInDb(**updated_user.to_dict()))

    return {"success": True, "data": "User disabled successfully"}

@router.post("/create", description="Create a new user [admin]")
async def create_new_user(body: T_UserInDb = Body(...), dt=Ds(jwt_s.roles_allowed(["admin"]))):
    new_user = await user_service.create_user(body)
    return {"success": True, "data": new_user}

@router.delete("/{user_id}", description="Delete a user.")
async def delete_user(user_id: str = Path(...),_: dict = Ds(jwt_s.roles_allowed(["admin"]))):
    if not await User.filter_by_id(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    await User.delete(user_id)
    await redis_delete(user_id)

    return {"success": True, "data": "User deleted successfully"}

