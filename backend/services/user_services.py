from typing import Annotated
from fastapi import Depends, HTTPException, status
from db.redis import redis_get, redis_set
from schemas.user_schemas import T_TokenData, T_User, T_UserInDb, T_UserInDbAdmin
from services.jwt_services import JWTService
from db.models import Client, User, Worker
from settings import Config

jwt_s = JWTService()


class UserServices:
    def __init__(self):
        pass

    async def  create_user(self, user: T_UserInDb) -> User:
        """Create a new user in the database."""

        # Check if username already exists
        if await User.filter_by(username=user.username):
            raise HTTPException(status_code=400, detail="User already exists")

        # Check if email already exists
        if await User.filter_by(email=user.email):
            raise HTTPException(status_code=400, detail="Email already exists")

        # Prevent admin user creation
        if user.role == "admin":
            raise HTTPException(status_code=400, detail="You can't create an admin user")

        # Hash password
        user.hashed_password = jwt_s.get_hashed_password(user.hashed_password)

        # Remove ID if exists (optional, but ensures no conflicts)
        user_data = user.model_dump(exclude={"id"})

        # Create and save the new user
        new_user = await User.create(**user_data)

        # Assign role-specific data
        if user.role == "worker":
            await Worker.create(user_id=new_user.id)
        elif user.role == "client":
            await Client.create(user_id=new_user.id)

        return new_user

    async def create_admin(self, user: T_UserInDbAdmin) -> User:
        # Check if username already exists
        if await User.filter_by(username=user.username):
            raise HTTPException(status_code=400, detail="User already exists")

        # Check if email already exists
        if await User.filter_by(email=user.email):
            raise HTTPException(status_code=400, detail="Email already exists")

        if not jwt_s.verify_password(user.admin_key, Config.SEKRET_KEY_ADMIN):
            raise HTTPException(status_code=400, detail="Incorrect admin key")

        user.hashed_password = jwt_s.get_hashed_password(user.hashed_password)
        user.is_admin = True
        user.role = "admin"

        user_data = user.model_dump(exclude={"id"})

        new_user = await User.create(**user_data)

        return new_user

    async def authenticate_user(self, username: str, password: str) -> User:
        user = await User.filter_by(username=username)
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
        if not jwt_s.verify_password(password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect password")
        await redis_set(user.id, T_UserInDb(**user.to_dict()))
        return user

    async def get_user_id(self, user_id: str) -> T_User:
        user_redis = await redis_get(user_id, T_User)
        if user_redis:
            return user_redis
        user = await User.filter_by_id(user_id)
        print("user in get_user_id", user)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        await redis_set(user.id, T_UserInDb(**user.to_dict()))

        return user

    async def get_all_users(self):
        users = await User.get_all()
        return users

    async def get_all_workers(self):
        workers = await Worker.get_all()
        return workers

    async def get_all_clients(self):
        clients = await Client.get_all()
        return clients

    async def get_user_from_token(self, payload: T_TokenData = Depends(jwt_s.authorized_token)) -> T_UserInDb:
        user_id = payload.get("user_id")
        user_redis = await redis_get(user_id, T_UserInDb)
        if user_redis:
            return user_redis
        user = self.get_user_id(user_id)
        await redis_set(user_id, user)
        if user is None:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        return T_UserInDb(**user.model_dump())

    async def get_current_active_user(self, current_user: Annotated[User, Depends(get_user_from_token)]):
        if current_user.disabled:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user

