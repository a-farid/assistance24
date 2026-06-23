# pyrefly: ignore [missing-import]
from fastapi import Depends, HTTPException
from database.models import User
from database import redis_get, redis_set, db
from database.redis import redis_delete
from schemas.user_schemas import T_TokenData, T_User, T_UserInDb
from services.jwt_svc import JWTService
from settings.mail import MailServices
from settings.standarization import format_paginated_response
import random

jwt_svc = JWTService()
mail_svc = MailServices()


class UserServices:
    def __init__(self):
        pass

    async def get_user(self, user_id) -> T_User:
        user_redis = await redis_get(user_id, T_User)

        if user_redis:
            if user_redis.disabled:
                raise HTTPException(status_code=400, detail="User is disabled, contact the administrator")
            return user_redis
        user = await db.user.filter_by_id(user_id)
        if user.disabled:
            raise HTTPException(status_code=400, detail="User is disabled, contact the administrator")
        await redis_set(getattr(user, "id"), T_User(**user.to_dict()))
        return T_User(**user.to_dict())

    async def create_user(self, user: T_UserInDb) -> T_User:
        """Create a new user in the database."""

        if user.role == "admin":
            raise HTTPException(status_code=400, detail="You can't create an admin user")

        user_data = user.model_dump(exclude={"id"})
        user_data["url_photo"] = f"images/{random.randint(1, 22)}.png"
        user_data["is_verified"] = True
        user_data["hashed_password"] = jwt_svc.get_hashed_password("Aqwzsx@123")

        new_user = await db.user.create(unique_fields=["username", "email"], **user_data)
        if not new_user or not hasattr(new_user, "id"):
            raise HTTPException(status_code=400, detail="User already exists or invalid user object returned")

        return T_User(**new_user.to_dict())

    async def update_user(self, user_id, body) -> T_User:
        updated_user = await db.user.update(user_id, **body.model_dump(exclude_unset=True))
        await redis_set(getattr(updated_user, "id"), T_UserInDb(**updated_user.to_dict()))
        return T_User(**updated_user.to_dict())

    async def toggle_user_status(self, user_id) -> T_User:
        user = await db.user.filter_by_id(user_id)
        new_status = not user.disabled
        updated_user = await db.user.update(user_id, disabled=new_status)
        await redis_delete(user_id)
        return updated_user

    async def enable_user(self, user_id) -> T_User:
        updated_user = await db.user.update(user_id, disabled=False)
        await redis_delete(user_id)
        return updated_user

    async def delete_user(self, user_id) -> bool:
        await db.user.delete(user_id)
        await redis_delete(user_id)
        return True

    async def update_connected_email(self, user_id, new_email) -> T_User:
        if await User.filter_by_first(email=new_email):
            raise HTTPException(status_code=400, detail="Email already exists")
        updated_user = await db.user.update(user_id, email=new_email)
        await redis_set(getattr(updated_user, "id"), T_UserInDb(**updated_user.to_dict()))
        return T_User(**updated_user.to_dict())

    async def update_connected_username(self, user_id, new_username) -> T_User:
        if await User.filter_by_first(username=new_username):
            raise HTTPException(status_code=400, detail="username already exists")
        updated_user = await db.user.update(user_id, username=new_username)
        await redis_set(getattr(updated_user, "id"), T_UserInDb(**updated_user.to_dict()))
        return T_User(**updated_user.to_dict())

    async def update_connected_user(self, user_id, body) -> T_User:
        user_data = body.model_dump(exclude={"username", "email", "id", "disabled", "role", "is_verified", "hashed_password", "url_photo"})
        if not user_data == {'adress': None, 'first_name': None, 'last_name': None, 'phone': None}:
            updated_user = await db.user.update(user_id, **user_data)
            updated_user_dict = updated_user.to_dict()

            await redis_set(getattr(updated_user, "id"), T_UserInDb(**updated_user_dict))
            return T_User(**updated_user_dict)
        else:
            raise HTTPException(status_code=400, detail="No data provided, accepted fields : adress, first_name, last_name, phone")

    async def get_all_users(self, page: int, limit: int):
        result = await db.user.get_all(limit=limit, page=page)
        return await format_paginated_response(result, T_User)

    async def get_all_workers(self, page: int, limit: int):
        result = await db.user.filter_all(limit=limit, page=page, role="worker")
        return await format_paginated_response(result, T_User)

    async def get_all_clients(self, page: int, limit: int):
        result = await db.user.filter_all(limit=limit, page=page, role="client")
        return await format_paginated_response(result, T_User)

    async def get_user_admin(self, user_id) -> T_User:
        user_redis = await redis_get(user_id, T_User)
        if user_redis:
            return user_redis
        user = await db.user.filter_by_id(user_id)
        await redis_set(getattr(user, "id"), T_User(**user.to_dict()))
        return T_User(**user.to_dict())

    async def get_user_from_token(self, payload=Depends(jwt_svc.authorized_token)) -> T_User:
        payload_obj = T_TokenData(**payload)
        user = await self.get_user(payload_obj.user_id)
        return T_User(**user.model_dump())
