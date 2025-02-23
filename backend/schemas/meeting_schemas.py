from datetime import date, time
from typing import Optional
import uuid
from pydantic import BaseModel, Field, field_validator
from enum import Enum


class T_StatusEnum(str, Enum):
    """Enum class for meeting
    """
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"

class T_Meeting(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    date_meeting: date = Field(examples=["2021-01-01"])
    time_start: time = Field(examples=["08:00"])
    time_end: time = Field(examples=["17:00"])
    comment: Optional[str] = Field(default=None, max_length=255, examples=["Meeting about the contract"])
    status: Optional[str] = Field(default="pending", examples=["pending", "accepted", "rejected"])
    contract_id: Optional[str]

    @field_validator("time_end")
    def check_time_end(cls, v, values):
        if v <= values.data["time_start"]:
            raise ValueError("time_end must be after time_start")
        return v

    @field_validator("status")
    def parse_role(cls, v):
        if isinstance(v, str): return T_StatusEnum(v)
        return v

class T_MeetingUpdate(BaseModel):
    date_meeting: Optional[date] = Field(examples=["2021-01-01"])
    time_start: Optional[time] = Field(examples=["08:00"])
    time_end: Optional[time] = Field(examples=["17:00"])
    comment: Optional[str] = Field(max_length=255, examples=["Meeting about the contract"])

    @field_validator("time_end")
    def check_time_end(cls, v, values):
        if v <= values.data["time_start"]:
            raise ValueError("time_end must be after time_start")
        return v
