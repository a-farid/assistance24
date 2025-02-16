from datetime import date, time
from typing import Optional
import uuid
from pydantic import BaseModel, Field, field_validator
from schemas.user_schemas import T_User



class T_Client_Worker(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    user: T_User

class T_Contract(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    num_contract: str = Field(min_length=3, max_length=50, examples=["170"])
    date_contract: date = Field(examples=["2021-01-01"])
    date_start: date = Field(examples=["2021-01-01"])
    date_end: date = Field(examples=["2021-01-01"])
    type_contract: str = Field(min_length=3, max_length=50, examples=["CDI"])
    hours_count: int = Field(ge=0, examples=[35])
    hours_confirmed: int = Field(0, ge=0)
    client_id: Optional[uuid.UUID] = Field(default=None)
    worker_id: Optional[uuid.UUID] = Field(default=None)

    @field_validator("hours_confirmed")
    def check_hours_confirmed(cls, v, values):
        hours_count = values.data.get("hours_count")
        print("hours_count", hours_count)
        if hours_count is None:
            return v
        print("v", v)
        if hours_count is not None and v > hours_count:
            raise ValueError("hours_confirmed must be less than or equal to hours_count")
        return v

    @field_validator("date_end")
    def check_date_end(cls, v, values):
        date_start = values.data.get("date_start")  # Use `.get()` to avoid KeyError
        if date_start is not None and v < date_start:
            raise ValueError("date_end must be greater than or equal to date_start")
        return v

class T_ContractUpdate(BaseModel):
    """Model for contract update (all fields optional)."""
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    num_contract: Optional[str] = Field(None, min_length=3, max_length=50, examples=["170"])
    date_contract: Optional[date] = Field(None, examples=["2021-01-01"])
    date_start: Optional[date] = Field(None, examples=["2021-01-01"])
    date_end: Optional[date] = Field(None, examples=["2021-01-01"])
    type_contract: Optional[str] = Field(None, min_length=3, max_length=50, examples=["CDI"])
    hours_count: Optional[int] = Field(None, ge=0, examples=[35])
    hours_confirmed: int = Field(0, ge=0)
    client_id: Optional[uuid.UUID] = Field(default=None, examples=["123e4567-e89b-12d3-a456-426614174000"])
    worker_id: Optional[uuid.UUID] = Field(default=None, examples=["123e4567-e89b-12d3-a456-426614174000"])

    @field_validator("hours_confirmed")
    def check_hours_confirmed(cls, v, values):
        hours_count = values.data.get("hours_count")
        if hours_count is None:
            return v
        if hours_count is not None and v > hours_count:
            raise ValueError("hours_confirmed must be less than or equal to hours_count")
        return v

    @field_validator("date_end")
    def check_date_end(cls, v, values):
        date_start = values.data.get("date_start")  # Use .get() to avoid KeyError
        if date_start is not None and v < date_start:
            raise ValueError("date_end must be greater than or equal to date_start")
        return v

