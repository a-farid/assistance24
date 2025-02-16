from datetime import date, time
import uuid
from fastapi import HTTPException
from db.models import Meeting
from schemas.meeting_schemas import T_Meeting, T_MeetingUpdate  # Assuming Pydantic Models

class MeetingServices:
    """Service class for managing meetings."""

    async def create_meeting(self, meeting_data: T_Meeting) -> dict:
        """Create a new meeting."""
        meeting = await Meeting.create(**meeting_data.model_dump())
        return meeting.to_dict()

    async def get_meeting(self, meeting_id: uuid.UUID) -> dict:
        """Retrieve a meeting by ID."""
        meeting = await Meeting.get_by_id(meeting_id)
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")
        return meeting.to_dict()

    async def get_meetings_by_contract(self, contract_id: uuid.UUID) -> list[dict]:
        """Retrieve all meetings related to a specific contract."""
        meetings = await Meeting.filter_all(contract_id=contract_id)
        return [meeting.to_dict() for meeting in meetings]

    async def update_meeting(self, meeting_id: uuid.UUID, update_data: T_MeetingUpdate) -> dict:
        """Update an existing meeting."""
        meeting = await Meeting.get_by_id(meeting_id)
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")
        updated_meeting = await Meeting.update(meeting_id, **update_data.model_dump(exclude_unset=True))
        return updated_meeting.to_dict()

    async def delete_meeting(self, meeting_id: uuid.UUID) -> bool:
        """Delete a meeting by ID."""
        meeting = await Meeting.get_by_id(meeting_id)
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")
        await Meeting.delete(meeting_id)
        return True
