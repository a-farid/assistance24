from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from fastapi import HTTPException, Depends, status, Cookie
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from tools.pydantic_types import T_UserInDb
from .Bd_BaseModel import DB_BaseModel

sessionDb = DB_BaseModel.get_session()

# Constants
SECRET_KEY = "09d25e094faa6ca2556cf6f066b7a95cf63b87099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
SEKRET_KEY_ADMIN = '$2b$12$Sst4qYGTPiBttvrmcoidHu2UEZMZWRwBWWIsjd0lU3DMc3DavGvpy'

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def verify_cookie_token(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Token is required")
    token = access_token.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("payload verify_cookie_token", payload)

        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

def roles_allowed(required_roles: list[str]):
    def role_checker(decoded_token: dict = Depends(verify_cookie_token)):
        role = decoded_token.get("role")
        print("role_checker", role)
        if role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {required_roles}"
            )

        return decoded_token  # Return the token if authorized

    return role_checker

def create_token(data: dict, type: str):
    '''
    Create a new JWT token.
    Args:

        data (dict): The data to encode in the token.
        type (str): The type of token to create: [access] or [refresh].
    '''
    to_encode = data.copy()
    if type == "access":
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.now(timezone.utc) + expires_delta
    elif type == "refresh":
        expires_delta = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        raise ValueError("Invalid token type")

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def is_owner(user_id: str):
    def role_checker(decoded_token: dict = Depends(verify_cookie_token)):
        token_user_id = str(decoded_token.get("user_id"))  # Ensure it's a string
        if token_user_id != user_id:  # Check if the user owns the account
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not the owner of this resource"
            )
        return decoded_token  # Authorized, return decoded token

    return role_checker

def create_refresh_access_tokens(user: T_UserInDb):
    '''
    Create new access and refresh tokens from a valid refresh token.

    Args:
        user (T_UserInDb): The user to create the tokens for.
        '''
    try:
        data={"username": user.username, "role": user.role, "user_id": user.id}

        access_token = create_token(data, "access")
        refresh_token = create_token(data, "refresh")
        # Create response with JSON and set cookie
        response = JSONResponse(content={"success": True, "data": {"access_token": access_token, "refresh_token": refresh_token}})

        response.set_cookie(key="access_token", value=f"Bearer {access_token}",httponly=True, secure=True, samesite="Lax")
        response.set_cookie(key="refresh_token", value=f"Bearer {refresh_token}",httponly=True, secure=True, samesite="Lax")
        return response
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
