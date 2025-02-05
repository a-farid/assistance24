from typing import Annotated
from jose import jwt, JWTError
from fastapi import HTTPException, Depends, status, Cookie
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from tools.pydantic_types import T_TokenData, T_User, T_UserInDb
from .models import User
from .Bd_BaseModel import DB_BaseModel

sessionDb = DB_BaseModel.get_session()

# Constants
SECRET_KEY = "09d25e094faa6ca2556cf6f066b7a95cf63b87099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(user: T_UserInDb):
    chec_user = sessionDb.query(User).filter_by(username=user.username).first()
    if chec_user is not None:
        raise HTTPException(status_code=400, detail="User already exists")
    user.hashed_password = get_hashed_password(user.hashed_password)
    new_user = User(**user.dict())
    sessionDb.add(new_user)
    sessionDb.commit()
    sessionDb.refresh(new_user)
    sessionDb.close()
    return new_user

def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user(username: str):
    user = sessionDb.query(User).filter_by(username=username).first()

    if user is None: raise HTTPException(status_code=404, detail="User not found")

    return T_UserInDb(**user.to_dict())

def get_all_users():
    users = sessionDb.query(User).all()
    return users

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    return T_User(**user.model_dump())

async def verify_jwt_token_cookie(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Token is required")
    token = access_token.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("payload verify_jwt_token_cookie", payload)

        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def verify_role(required_roles: list[str]):
    def role_checker(decoded_token: dict = Depends(verify_jwt_token_cookie)):
        role = decoded_token.get("role")

        if role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {required_roles}"
            )

        return decoded_token  # Return the token if authorized

    return role_checker

async def get_user_from_token(payload: T_TokenData = Depends(verify_jwt_token_cookie)):
    username = payload.get("username")
    user = get_user(username)
    if user is None:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return T_User(**user.model_dump())

async def get_current_active_user(current_user: Annotated[User, Depends(get_user_from_token)]):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def create_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
