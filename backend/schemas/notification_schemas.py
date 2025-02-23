

from datetime import date, time
from typing import Optional
import uuid
from pydantic import BaseModel, Field, field_validator
from schemas.user_schemas import T_User



class T_Client_Worker(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    user: T_User

class T_Notification(BaseModel):
    id: str
    receiver_id: str
    title: str = Field(min_length=3, max_length=100, examples=["Notification title"])
    message: str = Field(min_length=3, max_length=255, examples=["Notification message"])
    read: bool = Field(default=False)
    link: Optional[str] = Field(default=None, max_length=255, examples=["https://example.com"])
