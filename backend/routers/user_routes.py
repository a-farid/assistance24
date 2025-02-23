from fastapi import APIRouter, Body, Depends as Ds, Path
from schemas.user_schemas import T_Email, T_Profile, T_User
from services.user_svc import UserServices
from services.jwt_svc import JWTService
from settings.standarization import json_response


router = APIRouter()
user_service = UserServices()
jwt_s = JWTService()


@router.post("/create", description="Create a new user [admin]")
async def create_new_user(body: T_User = Body(...), dt=Ds(jwt_s.roles_allowed(["admin"]))):
    new_user = await user_service.create_user(body)
    return {"success": True, "data": new_user}



@router.get("/all", status_code=200, description="Get all users.")
async def get_users(_=Ds(jwt_s.roles_allowed(["admin"]))):
    users_list = await user_service.get_all_users()
    return json_response(**users_list, message="All users retrieved")

@router.get("/workers/all", status_code=200)
async def get_all_workers(_=Ds(jwt_s.roles_allowed(["admin"]))):
    workers_list = await user_service.get_all_workers()
    return json_response(**workers_list, message="All workers retrieved")

@router.get("/clients/all", status_code=200)
async def get_all_clients(_=Ds(jwt_s.roles_allowed(["admin"]))):
    clients_list = await user_service.get_all_clients()
    return json_response(data=clients_list, message="All clients retrieved")

@router.put("/me/email", description="Update the connected user.")
async def update_connected_user(body: T_Email = Body(...), current_user=Ds(user_service.get_user_from_token)):
    updated_user = await user_service.update_email(current_user.id, body.email)
    return json_response(data=updated_user, message="Email updated succesfully")

@router.put("/{user_id}", description="Update a user.")
async def update_user(user_id: str = Path(...),body: T_Profile = Body(...),_: dict = Ds(jwt_s.roles_allowed(["admin"]))):
    updated_user = await user_service.update_user(user_id, body)
    return json_response(data=updated_user, message="User updated succesfully")

@router.put("/{user_id}/disable", description="Desactivate a user.")
async def disable_user(user_id: str = Path(...),_: dict = Ds(jwt_s.roles_allowed(["admin"]))):
    updated_user = await user_service.disable_user(user_id)
    return json_response(data=updated_user, message="User disabled succesfully")

@router.delete("/{user_id}", description="Delete a user.")
async def delete_user(user_id: str = Path(...),_: dict = Ds(jwt_s.roles_allowed(["admin"]))):
    await user_service.delete_user(user_id)
    return json_response(status_code=200, message="User deleted succesfully")
