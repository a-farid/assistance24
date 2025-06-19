from fastapi import HTTPException
from typing import Type, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from functools import lru_cache
from database.Db_BaseModel import AsyncSessionLocal, DB_BaseModel
from database.models import Contract, Client, FCMToken, Worker, User, Meeting, Notification

class DataBaseService:
    model: Type[DB_BaseModel]

    @classmethod
    async def get_session(cls) -> AsyncSession:
        async with AsyncSessionLocal() as session:
            return session

    # @classmethod
    # async def get_all(cls, relationships: Optional[List[str]] = None):
    #     """Fetch all records with optional relationships."""
    #     data = await cls.model.get_all(relationships)
    #     return data  # No exception needed

    @classmethod
    async def get_id(cls, **criteria) -> str:
        """Fetch by ID and raise 404 if not found."""
        record_id = await cls.model.get_id(**criteria)
        if not record_id:
            raise HTTPException(status_code=404, detail=f"{cls.model.__name__} not found [get_id: {criteria}]")
        return record_id

    @classmethod
    async def filter_by_first(cls, relationships: Optional[List[str]] = None, **criteria):
        """Filter records and return the first match."""
        record = await cls.model.filter_by_first(relationships, **criteria)
        if not record:
            raise HTTPException(status_code=404, detail=f"{cls.model.__name__} not found [filter_by_first: {criteria}]")
        return record

    @classmethod
    async def filter_by_id(cls, id: str, relationships: Optional[List[str]] = None):
        """Filter record by ID and return the first match."""
        record = await cls.model.filter_by_id(id, relationships)
        if not record:
            raise HTTPException(status_code=404, detail=f"{cls.model.__name__} not found [filter_by_id: {id}]")
        return record

    @classmethod
    async def filter_all(cls, relationships: Optional[List[str]] = None, limit: int = 10, page: int = 1, **criteria):
        """Filter records and return paginated matches."""
        data = await cls.model.filter_all(relationships, limit=limit, page=page, **criteria)
        return data  # No exception needed


    @classmethod
    async def get_all(cls, relationships: Optional[List[str]] = None, limit: int = 10, page: int = 1):
        """Fetch all records with optional relationships and pagination."""
        data = await cls.model.get_all(relationships, limit=limit, page=page)
        return data  # No exception needed

    @classmethod
    async def create(cls, unique_fields: Optional[List[str]] = None, **kwargs) -> DB_BaseModel:
        """Create a new contract ensuring uniqueness."""
        if unique_fields:
            result = await cls.model.create(unique_fields=[*unique_fields], **kwargs)
        else:
            result = await cls.model.create(**kwargs)

        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        return result["data"]

    @classmethod
    async def update(cls, id: str, **kwargs):
        """Update a record and raise 404 if not found."""
        # raise HTTPException(status_code=40, detail=f"{cls.model.__name__} testing update method {id}")
        if not id:
            raise HTTPException(status_code=400, detail="ID is required for update")

        record = await cls.model.update(id, **kwargs)
        if not record:
            raise HTTPException(status_code=404, detail=f"{cls.model.__name__} not found for [update_ID: {id}]")
        return record

    @classmethod
    async def delete(cls, id: str):
        """Delete a record and raise 404 if not found."""
        success = await cls.model.delete(id)
        if not success:
            raise HTTPException(status_code=404, detail=f"{cls.model.__name__} not found [delete_ID: {id}]")
        return {"message": "Deleted successfully"}


class ContractDb(DataBaseService):
    model = Contract

class UserDb(DataBaseService):
    model = User

class ClientDb(DataBaseService):
    model = Client

class WorkerDb(DataBaseService):
    model = Worker

class MeetingDb(DataBaseService):
    model = Meeting

class NotificationDb(DataBaseService):
    model = Notification

class FCMTokenDb(DataBaseService):
    model = FCMToken

class DBService:
    contract = ContractDb()
    user = UserDb()
    client = ClientDb()
    worker = WorkerDb()
    meeting = MeetingDb()
    notification = NotificationDb()
    fcm_token = FCMTokenDb()

@lru_cache()
def get_db_service():
    return DBService()