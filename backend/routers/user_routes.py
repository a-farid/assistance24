from fastapi import APIRouter, Body, Depends as Ds, Path # pyrefly: ignore [missing-import]
from schemas.user_schemas import T_Email, T_Profile, T_UserInDb, T_Username
from services.user_svc import UserServices
from services.jwt_svc import JWTService
from settings.standarization import json_response_pagination, json_response_one


router = APIRouter()
user_service = UserServices()
jwt_s = JWTService()


@router.post("/create", description="Create a new user [admin]")
async def create_new_user(body: T_UserInDb = Body(...), dt=Ds(jwt_s.roles_allowed(["admin"]))):
    new_user = await user_service.create_user(body)
    return json_response_one(item=new_user, message="User created succesfully")

@router.get("/all", status_code=200, description="Get all users [admin]")
async def get_users(page: int = 1, limit: int = 5, _=Ds(jwt_s.roles_allowed(["admin"]))):
    users_list = await user_service.get_all_users(page=page, limit=limit)
    print("Users list:", users_list)
    return json_response_pagination(**users_list, message="All users retrieved")

@router.get("/workers/all", status_code=200, description="Get all workers [admin]")
async def get_all_workers(page: int = 1, limit: int = 5, _=Ds(jwt_s.roles_allowed(["admin"]))):
    workers_list = await user_service.get_all_workers(page=page, limit=limit)
    return json_response_pagination(**workers_list, message="All workers retrieved")

@router.get("/clients/all", status_code=200, description="Get all clients [admin]")
async def get_all_clients(page: int = 1, limit: int = 5, _=Ds(jwt_s.roles_allowed(["admin"]))):
    clients_list = await user_service.get_all_clients(page=page, limit=limit)
    return json_response_pagination(**clients_list, message="All clients retrieved")

@router.get("/{user_id}", status_code=200, description="Get user by ID [admin]")
async def get_user_by_id(user_id: str = Path(...), _=Ds(jwt_s.roles_allowed(["admin"]))):
    user = await user_service.get_user_admin(user_id)
    return json_response_one(item=user, message="User returned succesfully")

@router.put("/me/email", description="Update the connected user email [owner]")
async def update_connected_user_email(body: T_Email = Body(...), current_user=Ds(user_service.get_user_from_token)):
    updated_user = await user_service.update_connected_email(current_user.id, body.email)
    return json_response_one(item=updated_user, message="Email updated succesfully")

@router.put("/me/username", description="Update the connected user username [owner]")
async def update_connected_user_username(body: T_Username = Body(...), current_user=Ds(user_service.get_user_from_token)):
    updated_user = await user_service.update_connected_username(current_user.id, body.username)
    return json_response_one(item=updated_user, message="Username updated succesfully")

@router.put("/me", description="Update the connected user [owner]")
async def update_connected_user(body: T_Profile = Body(...), current_user=Ds(user_service.get_user_from_token)):
    updated_user = await user_service.update_connected_user(current_user.id, body)
    return json_response_one(item=updated_user, message="Connected user updated succesfully")

@router.put("/{user_id}", description="Update a user [admin]")
async def update_user(user_id: str = Path(...), body: T_Profile = Body(...), _: dict = Ds(jwt_s.roles_allowed(["admin"]))):
    updated_user = await user_service.update_user(user_id, body)
    return json_response_one(item=updated_user, message="User updated succesfully")

@router.put("/{user_id}/toggle_status", description="Toggle user active/disabled status [admin]")
async def disable_user(user_id: str = Path(...), _: dict = Ds(jwt_s.roles_allowed(["admin"]))):
    updated_user = await user_service.toggle_user_status(user_id)
    return json_response_one(item=updated_user, message="User status updated succesfully")

@router.put("/{user_id}/enable", description="Enable a disabled user [admin]")
async def enable_user(user_id: str = Path(...), _: dict = Ds(jwt_s.roles_allowed(["admin"]))):
    updated_user = await user_service.enable_user(user_id)
    return json_response_one(item=updated_user, message="User enabled succesfully")

@router.delete("/{user_id}", description="Delete a user [admin]")
async def delete_user(user_id: str = Path(...), _: dict = Ds(jwt_s.roles_allowed(["admin"]))):
    await user_service.delete_user(user_id)
    return json_response_one(status_code=200, message="User deleted succesfully")
