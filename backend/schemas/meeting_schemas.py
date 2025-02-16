from datetime import date, time
from typing import Optional
import uuid
from pydantic import BaseModel, Field, field_validator


class T_Meeting(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    date_meeting: date = Field(examples=["2021-01-01"])
    time_start: time = Field(examples=["08:00"])
    time_end: time = Field(examples=["17:00"])
    comment: Optional[str] = Field(default=None, max_length=255, examples=["Meeting about the contract"])
    confirmed: bool = Field(default=False, examples=[False])
    contract_id: uuid.UUID = Field(examples=["123e4567-e89b-12d3-a456-426614174000"])

    @field_validator("time_end")
    def check_time_end(cls, v, values):
        if v <= values.data["time_start"]:
            raise ValueError("time_end must be after time_start")
        return v

class T_MeetingUpdate(BaseModel):
    date_meeting: Optional[date] = Field(examples=["2021-01-01"])
    time_start: Optional[time] = Field(examples=["08:00"])
    time_end: Optional[time] = Field(examples=["17:00"])
    comment: Optional[str] = Field(max_length=255, examples=["Meeting about the contract"])
    confirmed: Optional[bool] = Field(examples=[False])

    @field_validator("time_end")
    def check_time_end(cls, v, values):
        if v <= values.data["time_start"]:
            raise ValueError("time_end must be after time_start")
        return v
