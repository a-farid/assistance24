from typing import Annotated
from fastapi import Body, Cookie, HTTPException, Depends, status, APIRouter, Response
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import json
from jose import jwt, JWTError
from tools.cach_redis import redis_delete, redis_set, redis_get
from tools.jwt_token import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, REFRESH_TOKEN_EXPIRE_DAYS, SECRET_KEY, authenticate_user, create_token, create_user, get_user, verify_jwt_token_cookie
from tools.pydantic_types import T_Token, T_User, T_UserInDb


router = APIRouter()

@router.post("/register")
async def register_user(body: T_UserInDb = Body(...)):
    new_user = create_user(body)
    return new_user


@router.post("/login")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> T_Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    redis_set(user.id, user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    data={"username": user.username, "role": user.role, "user_id": user.id}

    access_token = create_token(data=data, expires_delta=access_token_expires)
    refresh_token = create_token(data=data, expires_delta=refresh_token_expires)
    # Create response with JSON and set cookie
    response = JSONResponse(content={"Success": True, "data": {"access_token": access_token, "refresh_token": refresh_token}})
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,  # Prevents JavaScript access for security
        secure=True,  # Send only over HTTPS
        samesite="Lax",  # Prevent CSRF attacks
    )
    response.set_cookie(
        key="refresh_token",
        value=f"Bearer {refresh_token}",
        httponly=True,  # Prevents JavaScript access for security
        secure=True,  # Send only over HTTPS
        samesite="Lax",  # Prevent CSRF attacks
    )
    return response


@router.post("/logout", status_code=200)
async def logout(response: Response, access_token = Depends(verify_jwt_token_cookie)):
    """
    Logout the user by clearing the authentication cookie.
    """
    response.delete_cookie("access_token")  # Remove token from cookies
    response.delete_cookie("refresh_token")
    redis_delete(access_token.get("user_id"))
    return {"success": True, "message": "Successfully logged out"}


@router.post("/refresh")
async def refresh_access_token(refresh_token: str = Cookie(None)):
    print("refresh_token", refresh_token)
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token is required")

    try:
        token = refresh_token.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("payload refresh_access_token", payload)
        user = redis_get(payload.get("user_id"), T_UserInDb)

        if not user:
            print("Request the DB")
            user = get_user(payload.get("username"))
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
            redis_set(user.id, user)
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        data={"username": user.username, "role": user.role, "user_id": user.id}

        access_token = create_token(data=data, expires_delta=access_token_expires)
        refresh_token = create_token(data=data, expires_delta=refresh_token_expires)
        # Create response with JSON and set cookie
        response = JSONResponse(content={"Success": True, "data": {"access_token": access_token, "refresh_token": refresh_token}})

        response.set_cookie(key="access_token", value=f"Bearer {access_token}",httponly=True, secure=True, samesite="Lax")
        response.set_cookie(key="refresh_token", value=f"Bearer {refresh_token}",httponly=True, secure=True, samesite="Lax")
        return response
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")