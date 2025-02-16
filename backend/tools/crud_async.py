from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from tools.Bd_BaseModel import DB_BaseModel

# Dependency to get a new async session for each request
async def get_db():
    async with DB_BaseModel.get_session() as db:
        yield db  # Provide the async session

async def update_record(db: AsyncSession, model, record_id: str, update_data: dict):
    """
    Asynchronously updates a record in the database.

    :param db: Async SQLAlchemy session (injected per request)
    :param model: SQLAlchemy model class (e.g., User)
    :param record_id: ID of the record to update
    :param update_data: Dictionary of fields to update
    :return: Updated instance of the model
    """
    result = await db.execute(select(model).filter_by(id=record_id))
    record = result.scalars().first()

    if record is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")

    # Only update fields that are provided in update_data
    for key, value in update_data.items():
        if value is not None:  # Only update if the value is not None
            setattr(record, key, value)

    await db.commit()
    await db.refresh(record)

    return record

async def delete_record(db: AsyncSession, model, record_id: str):
    """
    Asynchronously deletes a record in the database.

    :param db: Async SQLAlchemy session (injected per request)
    :param model: SQLAlchemy model class (e.g., User)
    :param record_id: ID of the record to delete
    """
    result = await db.execute(select(model).filter_by(id=record_id))
    record = result.scalars().first()

    if record is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")

    await db.delete(record)
    await db.commit()
    return {"message": f"{model.__name__} deleted successfully"}
