from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from fastapi import HTTPException, Depends, status, Cookie
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional
from schemas.user_schemas import T_UserInDb
from database import redis_get, redis_set, db

from settings import Config


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class JWTService:
    def get_hashed_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    async def authorized_token(self, access_token: Optional[str] = Cookie(None)):
        if not access_token:
            raise HTTPException(status_code=401, detail="Token is required")

        token = access_token.replace("Bearer ", "")
        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
            return payload
        except JWTError:
            raise HTTPException(status_code=401, detail="Token expired or invalid")

    async def verify_login(self, access_token: Optional[str] = Cookie(None)):
        if not access_token: return

        try:
            token = access_token.replace("Bearer ", "")
            jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
            raise HTTPException(status_code=400, detail="You are already logged in.")
        except JWTError: return

    async def create_token(self, data: dict, token_type: str) -> str:
        """
        Create a JWT token (access or refresh).
        """
        token_expiry = {
            "access": timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES),
            "refresh": timedelta(days=Config.REFRESH_TOKEN_EXPIRE_DAYS),
            "activation": timedelta(days=1),
            "reset": timedelta(minutes=15),
        }

        if token_type not in token_expiry:
            raise ValueError("Invalid token type")

        data["exp"] = datetime.now(timezone.utc) + token_expiry[token_type]
        return jwt.encode(data, Config.SECRET_KEY, algorithm=Config.ALGORITHM)

    def authorize(self, condition: callable, error_detail: str) -> callable:
        """
        Generalized authorization function that checks if a given condition
        holds for the decoded JWT token and returns the decoded token if authorized.
        """

        # Define a function to check the condition on the decoded token
        def checker(decoded_token: dict = Depends(self.authorized_token)):
            if not condition(decoded_token):
                # If the condition fails, raise an HTTP 403 Forbidden exception
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=error_detail
                )
            return decoded_token  # Return the decoded token if authorized

        return checker

    def roles_allowed(self, required_roles: list[str]):
        """
        Checks if the user has one of the required roles in the JWT token and
        returns the decoded token if authorized.

        Returns:
            dict: The decoded JWT token if the user has one of the required roles.
        """

        # The lambda function checks if the token's 'role' is in the required roles
        condition = lambda token: token.get("role") in required_roles

        # Return the checker function with the given condition and error message
        return self.authorize(
            condition,
            f"Access denied. Required roles: {required_roles}"
        )

    def is_owner(self, user_id: str):
        return self.authorize(
            lambda token: str(token.get("user_id")) == user_id,
            "You are not the owner of this resource"
        )

    # async def create_refresh_access_tokens(self, user: T_UserInDb):
    #     """
    #     Create new access and refresh tokens and set them in HTTP-only cookies.
    #     """
    #     data = {"username": user.username, "role": user.role, "user_id": user.id}
    #     access_token = await self.create_token(data, "access")
    #     refresh_token = await self.create_token(data, "refresh")

    #     response = JSONResponse(content={"success": True, "data": {"access_token": access_token, "refresh_token": refresh_token}})
    #     response.set_cookie(key="access_token", value=f"Bearer {access_token}", httponly=True, secure=True, samesite="Lax")
    #     response.set_cookie(key="refresh_token", value=f"Bearer {refresh_token}", httponly=True, secure=True, samesite="Lax")

    #     return response

    async def create_refresh_access_tokens(self, user: T_UserInDb):
        """
        Create new access and refresh tokens and set them in HTTP-only cookies.
        """
        data = {"username": user.username, "role": user.role, "user_id": user.id}

        if user.role == "client":
            client_id = await db.client.get_id(user_id=user.id)
            data["cw_id"] = client_id
        elif user.role == "worker":
            worker_id = await db.worker.get_id(user_id=user.id)
            data["cw_id"] = worker_id
        else:
            data["cw_id"] = None

        access_token = await self.create_token(data, "access")
        refresh_token = await self.create_token({"user_id": user.id}, "refresh")

        response = JSONResponse(content={"success": True, "data": {"user": user.model_dump(),"access_token": access_token, "refresh_token": refresh_token}})
        response.set_cookie(key="access_token", value=f"Bearer {access_token}", httponly=False, secure=True, samesite="None")
        response.set_cookie(key="refresh_token", value=f"Bearer {refresh_token}", httponly=False, secure=True, samesite="None")

        return response

    def create_email_activation_tokens(self, user: T_UserInDb):
        """
        Create new access and refresh tokens and set them in HTTP-only cookies.
        """
        data = {"email": user.email}
        activation_token = self.create_token(data, "activation")

        response = JSONResponse(content={"success": True, "email": user.email, "activation_token": activation_token})
        response.set_cookie(key="activation_token", value=f"{activation_token}", httponly=True, secure=True, samesite="Lax")

        return response

    async def decode_activation_token(self, activation_token: Optional[str] = Cookie(None)):
        if not activation_token:
            raise HTTPException(status_code=401, detail="Activation token is required")

        try:
            payload = jwt.decode(activation_token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
            return payload.get("email")
        except JWTError:
            raise HTTPException(status_code=401, detail="Token expired or invalid")
