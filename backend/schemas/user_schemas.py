from datetime import date
import re
from typing import Literal, Optional
import uuid
from pydantic import BaseModel, EmailStr, Field, StrictStr, field_validator
from enum import Enum
from pydantic import BaseModel



class RoleEnum(str, Enum):
    worker = "worker"
    admin = "admin"
    client = "client"

class T_Contract_Out(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    num_contract: str = Field(min_length=3, max_length=50, examples=["170"])
    date_contract: date = Field(examples=["2021-01-01"])
    date_start: date = Field(examples=["2021-01-01"])
    date_end: date = Field(examples=["2021-01-01"])
    type_contract: str = Field(min_length=3, max_length=50, examples=["CDI"])
    hours_count: int = Field(ge=0, examples=[35])
    hours_confirmed: int = Field(0, ge=0, examples=[35])
    client_id: Optional[uuid.UUID] = Field(default=None, examples=["123e4567-e89b-12d3-a456-426614174000"])
    worker_id: Optional[uuid.UUID] = Field(default=None, examples=["123e4567-e89b-12d3-a456-426614174000"])

class T_Token(BaseModel):
    access_token: str
    token_type: str

class T_TokenData(BaseModel):
    user_id: str
    username: str
    role: Optional[str] = None

class T_FCMToken(BaseModel):
    id: Optional[str]
    user_id: Optional[str]
    token: str
    status: Literal["valid", "expired"]


    class Config:
        from_attributes = True

class T_Login_User(BaseModel):
    username: StrictStr = Field(..., min_length=3,max_length=50, examples=["user1"])
    password: StrictStr = Field(..., examples=["Aqwzsx@123"])

class T_Profile(BaseModel):
    adress: Optional[StrictStr] = Field(None, max_length=100, examples=[
                                        "Calle 123 Rue 456 Paris"])
    first_name: Optional[StrictStr] = Field(
        None, max_length=50, examples=["John"])
    last_name: Optional[StrictStr] = Field(
        None, max_length=50, examples=["Doe"])
    url_photo: Optional[str] = None
    phone: Optional[StrictStr] = Field(
        None, max_length=20, examples=["+1234567890"])

class T_Email(BaseModel):
    email: EmailStr = Field(..., examples=["user1@mail.com"])

class T_User(T_Profile):
    id: Optional[str] = Field(None, examples=["123e4567-e89b-12d3-a456-426614174000"])
    username: StrictStr = Field(..., min_length=3, max_length=50, examples=["user1"])
    email: EmailStr = Field(..., examples=["user1@mail.com"])
    disabled: Optional[bool] = False
    is_verified: Optional[bool] = False
    role: Optional[str] = Field(None, examples=["worker", "admin", "client"])

    @field_validator("role")
    def parse_role(cls, v):
        if isinstance(v, str): return RoleEnum(v)
        return v

class T_Client_Contract(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    user: T_Profile

class T_PassUpdate(BaseModel):
    old_password: str = Field(..., examples=["Aqwzsx@123"])
    new_password: str = Field(..., examples=["Aqwzsx@123"])

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, password: str) -> str:
        """
        Ensures the password meets the security criteria.
        """
        if not re.search(r"[A-Z]", password):
            raise ValueError(
                "Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", password):
            raise ValueError(
                "Password must contain at least one lowercase letter")
        if not re.search(r"\d", password):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise ValueError(
                "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)")

        return password  # Return validated password
class T_UserInDb(T_User):
    hashed_password: str = Field(..., min_length=8,
                                 max_length=100, examples=["Aqwzsx@123"])

    @field_validator("hashed_password")
    @classmethod
    def validate_password(cls, password: str) -> str:
        """
        Ensures the password meets the security criteria.
        """
        if not re.search(r"[A-Z]", password):
            raise ValueError(
                "Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", password):
            raise ValueError(
                "Password must contain at least one lowercase letter")
        if not re.search(r"\d", password):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise ValueError(
                "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)")

        return password  # Return validated password


class T_UserInDbAdmin(T_UserInDb):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    is_admin: bool = True
    admin_key: str

class T_Worker(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    user: T_User
    contracts: Optional[list[T_Contract_Out]] = None

class T_Client(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    user: T_User
    contracts: Optional[list[T_Contract_Out]] = None
