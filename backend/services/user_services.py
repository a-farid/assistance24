from typing import Annotated
from fastapi import Depends, HTTPException, status
from tools.jwt_token import SEKRET_KEY_ADMIN, get_hashed_password, verify_cookie_token, verify_password
from tools.pydantic_types import T_TokenData, T_User, T_UserInDbAdmin, T_UserInDb
from tools.models import Client, User, Worker
from tools.Bd_BaseModel import DB_BaseModel

sessionDb = DB_BaseModel.get_session()


def create_user(user: T_UserInDb):
    # Check if user already exists
    check_user = sessionDb.query(User).filter_by(username=user.username).first()
    if check_user is not None:
        raise HTTPException(status_code=400, detail="User already exists")

    check_email = sessionDb.query(User).filter_by(email=user.email).first()
    if check_email is not None:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Prevent creation of admin users
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="You can't create an admin user")

    # Hash the password before saving
    user.hashed_password = get_hashed_password(user.hashed_password)

    # Remove the ID before inserting into DB
    del user.id

    # Create a new user record
    new_user = User(**user.model_dump())
    sessionDb.add(new_user)
    sessionDb.commit()
    sessionDb.refresh(new_user)

    # Add to Worker or Client table based on the role
    if user.role == "worker":
        new_worker = Worker(user_id=new_user.id)
        sessionDb.add(new_worker)
        sessionDb.commit()
        sessionDb.refresh(new_worker)

    elif user.role == "client":
        new_client = Client(user_id=new_user.id)
        sessionDb.add(new_client)
        sessionDb.commit()
        sessionDb.refresh(new_client)

    # Close the session
    sessionDb.close()

    # Return the user as a response
    return T_UserInDb(**new_user.to_dict())


def create_admin(user: T_UserInDbAdmin):
    chec_user = sessionDb.query(User).filter_by(username=user.username).first()
    if chec_user is not None:
        raise HTTPException(status_code=400, detail="User already exists")
    check_email = sessionDb.query(User).filter_by(email=user.email).first()
    if check_email is not None:
        raise HTTPException(status_code=400, detail="Email already exists")
    if not verify_password(user.admin_key, SEKRET_KEY_ADMIN):
        raise HTTPException(status_code=400, detail="Incorrect admin key")
    user.hashed_password = get_hashed_password(user.hashed_password)
    user.is_admin = True
    user.role = "admin"
    new_user = User(**user.model_dump())
    sessionDb.add(new_user)
    sessionDb.commit()
    sessionDb.refresh(new_user)
    sessionDb.close()
    return T_User(**new_user.to_dict())

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    return T_User(**user.model_dump())

def get_user(username: str):
    user = sessionDb.query(User).filter_by(username=username).first()

    if user is None: raise HTTPException(status_code=404, detail="User not found")

    return T_UserInDb(**user.to_dict())

def get_all_users():
    users = sessionDb.query(User).all()
    return users

async def get_user_from_token(payload: T_TokenData = Depends(verify_cookie_token)) -> T_UserInDb:
    username = payload.get("username")
    print("Username from token", username)
    user = get_user(username)
    if user is None:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return T_UserInDb(**user.model_dump())

async def get_current_active_user(current_user: Annotated[User, Depends(get_user_from_token)]):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

