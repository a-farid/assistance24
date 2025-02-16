from fastapi import HTTPException
from sqlalchemy.orm import Session
from tools.Bd_BaseModel import DB_BaseModel

# Dependency to get a new session for each request
def get_db():
    db = DB_BaseModel.get_session()
    try:
        yield db  # Provide the session
    finally:
        db.close()  # Close session after request

def update_record(db: Session, model, record_id: str, update_data: dict):
    """
    Updates a record in the database.

    :param db: SQLAlchemy session (injected per request)
    :param model: SQLAlchemy model class (e.g., User)
    :param record_id: ID of the record to update
    :param update_data: Dictionary of fields to update
    :return: Updated instance of the model
    """
    record = db.query(model).filter_by(id=record_id).first()
    if record is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")

    # Only update fields that are provided in update_data
    for key, value in update_data.items():
        if value is not None:  # Only update if the value is not None
            setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return record

def delete_record(db: Session, model, record_id: str):
    """
    Deletes a record in the database.

    :param db: SQLAlchemy session (injected per request)
    :param model: SQLAlchemy model class (e.g., User)
    :param record_id: ID of the record to delete
    """
    record = db.query(model).filter_by(id=record_id).first()
    if record is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")

    db.delete(record)
    db.commit()
