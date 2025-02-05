from datetime import date, time
from decimal import Decimal
from typing import Optional
import uuid
from pydantic import BaseModel, EmailStr, Field, StrictStr
from enum import Enum

class RoleEnum(str, Enum):
    admin = "admin"
    worker = "worker"
    client = "client"

class T_Token(BaseModel):
    access_token: str
    token_type: str

class T_TokenData(BaseModel):
    user_id: str
    username: str
    role: Optional[str] = None

class T_User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: StrictStr = Field(..., min_length=3, max_length=50, examples=["user1"])
    email: EmailStr = Field(..., examples=["user1@mail.com"])
    disabled: Optional[bool] = False
    adress: Optional[StrictStr] = Field(None, max_length=100, examples=["Calle 123 Rue 456 Paris"])
    is_admin: bool = False
    first_name: Optional[StrictStr] = Field(None, max_length=50, examples=["John"])
    last_name: Optional[StrictStr] = Field(None, max_length=50, examples=["Doe"])
    url_photo: Optional[str] = None
    phone: Optional[StrictStr] = Field(None, max_length=20, examples=["+1234567890"])
    role: Optional[RoleEnum] = Field(None, examples=["worker", "admin", "client"])

class T_UserInDb(T_User):
    hashed_password: str

class T_Contract(BaseModel):
    num_contract: str
    date_contract: date
    date_start: date
    date_end: date
    type_contract: str
    hours_count: int
    price_hour: Decimal
    price_total: Decimal
    hours_confirmed: int = 0
    client_id: str
    worker_id: str

class T_Client(BaseModel):
    user_id: str

class T_Worker(BaseModel):
    user_id: str

class T_Meeting(BaseModel):
    date_meeting: Optional[date] = None
    time_start: Optional[time] = None
    time_end: Optional[time] = None
    comment: Optional[str] = None
    confirmed: bool = False
    contract_id: str
