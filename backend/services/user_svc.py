from fastapi import Depends, HTTPException
from pydantic import BaseModel
from database import redis_get, redis_set, db
from database.redis import redis_delete
from schemas.user_schemas import T_TokenData, T_User, T_UserInDb, T_Worker, T_Client
from services.jwt_svc import JWTService
from settings.mail import MailServices
from settings.standarization import format_paginated_response


jwt_svc = JWTService()
mail_svc = MailServices()

from typing import Any, Dict, Union
import random

async def get_user_model(data: Union[T_Worker, T_Client]) -> dict:
    """Fetch and return worker and client as T_Profile."""
    result = {}
    if data.user:
        result["user"] = T_User(**data.user.to_dict())
    return result


class UserServices:
    def __init__(self):
        pass

    async def create_user(self, user: T_UserInDb) -> T_User:
        """Create a new user in the database."""

        # Prevent admin user creation
        if user.role == "admin": raise HTTPException(status_code=400, detail="You can't create an admin user")

        # Remove ID if exists (optional, but ensures no conflicts)
        user_data = user.model_dump(exclude={"id"})
        image_name = f"{random.randint(1, 23)}.png"
        url_photo = f"images/{image_name}"
        user_data["url_photo"] = url_photo
        user_data["is_verified"] = True
        user_data["hashed_password"] = jwt_svc.get_hashed_password("Aqwzsx@123")
        # Create and save the new user (is_verified=True only for testing purposes)
        new_user = await db.user.create(unique_fields=["username", "email"], **user_data)

        # Assign role-specific data
        if user.role == "worker":
            await db.worker.create(unique_fields=["user_id"],user_id=new_user.id)
        elif user.role == "client":
            await db.client.create(unique_fields=["user_id"],user_id=new_user.id)
        user_data = T_User(**new_user.to_dict())

        # await mail_svc.send_verification_mail(user_data)

        return user_data

    async def update_user(self, user_id, body)-> T_User:
        updated_user = await db.user.update(user_id, **body.model_dump(exclude_unset=True))
        await redis_set(updated_user.id, T_UserInDb(**updated_user.to_dict()))
        return updated_user

    async def disable_user(self, user_id)-> T_User:
        updated_user = await db.user.update(user_id, disabled=True)
        await redis_delete(user_id)
        return updated_user

    async def delete_user(self, user_id)-> T_User:
        await db.user.delete(user_id)
        await redis_delete(user_id)
        return True

    async def update_email(self, user_id, new_email)-> T_User:
        # Check if email already exists
        if await db.user.filter_by_first(email=new_email):
            raise HTTPException(status_code=400, detail="Email already exists")

        updated_user = await db.user.update(user_id, email=new_email)
        await redis_set(updated_user.id, T_UserInDb(**updated_user.to_dict()))
        return updated_user

    async def get_all_users(self):
        result = await db.user.get_all()
        return await format_paginated_response(result, T_User)

    async def get_all_workers(self):
        result = await db.worker.filter_all(relationships=["user"])

        return await format_paginated_response(result, T_Worker, nested_user=True)

    async def get_all_clients(self):
        result = await db.client.filter_all(relationships=["user"])

        return await format_paginated_response(result, T_Client, nested_user=True)


    async def get_user(self, user_id) -> T_User:
        user_redis = await redis_get(user_id, T_User)

        if user_redis:
            if user_redis.disabled:
                raise HTTPException(status_code=400, detail="User is disabled, contact the administrator")
            return user_redis
        user = await db.user.filter_by_id(user_id)
        if user.disabled:
            raise HTTPException(status_code=400, detail="User is disabled, contact the administrator")
        await redis_set(user.id, T_User(**user.to_dict()))

        return T_User(**user.to_dict())

    async def get_user_from_token(self, payload: T_TokenData = Depends(jwt_svc.authorized_token)) -> T_UserInDb:
        user = await self.get_user(payload.get("user_id"))
        return T_User(**user.model_dump())

