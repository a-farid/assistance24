from fastapi import APIRouter, Body, Depends, HTTPException, Path
from services.user_services import create_user, get_all_users, get_user_from_token
from tools.Bd_BaseModel import DB_BaseModel
from tools.cach_redis import redis_set
from tools.crud_op import get_db, update_record
from tools.models import User
from tools.pydantic_types import T_Profile, T_User, T_UserInDb
from tools.standarization import StandardResponse
from tools.jwt_token import is_owner, roles_allowed
from sqlalchemy.orm import Session


router = APIRouter()
sessionDb = DB_BaseModel.get_session()

@router.get("/me", response_model=StandardResponse[T_User])
async def read_connected_user(current_user= Depends(get_user_from_token)):
    return {"success": True, "data": current_user}

@router.put("/me", response_model=StandardResponse[T_User], description="Update the connected user.")
def update_connected_user(body: T_Profile = Body(...), current_user=Depends(get_user_from_token)):

    updated_user = User.update(current_user.id, **body.model_dump())
    sessionDb.add(updated_user)
    sessionDb.commit()
    sessionDb.refresh(updated_user)

    redis_set(current_user.id, T_UserInDb(**updated_user.to_dict()))

    return {"success": True, "data": updated_user}

@router.put("/me/email", response_model=StandardResponse[T_User], description="Update an email of the connected user.")
def update_email_connected(new_email: str = Body(...), current_user=Depends(get_user_from_token)):

    updated_user = User.update(current_user.id, email=new_email)
    sessionDb.add(updated_user)
    sessionDb.commit()
    sessionDb.refresh(updated_user)

    redis_set(current_user.id, T_UserInDb(**updated_user.to_dict()))

    return {"success": True, "data": updated_user}


@router.get("/all", status_code=200, response_model=StandardResponse[list[T_User]])
async def get_users(tk=Depends(roles_allowed(["admin"]))):
    print('decoded_token', tk)
    users_list = get_all_users()
    return {"success": True, "data": users_list}

@router.post("/create", response_model=StandardResponse[T_User], description="Create a new user [admin]")
async def create_new_user(body: T_UserInDb = Body(...), dt=Depends(roles_allowed(["admin"]))):
    new_user = create_user(body)
    return {"success": True, "data": new_user}

@router.delete("/delete/{user_id}", response_model=StandardResponse[None], description="Delete a user.")
def delete_user(
    user_id: str = Path(..., description="User ID to delete"),
    __: dict = Depends(roles_allowed(["admin"]))  # Verifies admin role
):
    user = sessionDb.query(User).filter_by(id=user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    sessionDb.delete(user)
    sessionDb.commit()

    redis_set(user_id, None)  # Remove user from cache

    return {"success": True, "data": None}

# @router.put("/update/{user_id}", response_model=StandardResponse[T_User], description="Update a user.")
# def update_user(
#     user_id: str = Path(..., description="User ID to update"),
#     body: T_Profile = Body(...),
#     _: dict = Depends(is_owner),  # Verifies user ownership
#     __: dict = Depends(roles_allowed(["admin"]))  # Verifies admin role
# ):
#     user = sessionDb.query(User).filter_by(id=user_id).first()
#     if user is None: raise HTTPException(status_code=404, detail="User not found")

#     for key, value in body.model_dump().items():
#         setattr(user, key, value)

#     sessionDb.commit()  # ✅ Save changes
#     sessionDb.refresh(user)  # ✅ Ensure user is up-to-date in session

#     redis_set(user_id, T_UserInDb(**user.to_dict()))  # ✅ Cache updated user

#     return {"success": True, "data": user}

@router.put("/update/{user_id}", response_model=StandardResponse[T_User], description="Update a user.")
def update_user(
    user_id: str = Path(..., description="User ID to update"),
    body: T_Profile = Body(...),
    db = Depends(get_db),  # Inject session
    _: dict = Depends(is_owner),
    __: dict = Depends(roles_allowed(["admin"]))
):
    updated_user = update_record(db, User, user_id, body.model_dump())
    print("updated_user dict", updated_user.to_dict())
    redis_set(user_id, T_UserInDb(**updated_user.to_dict()))

    return {"success": True, "data": updated_user}



