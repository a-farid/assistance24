import uuid
from fastapi import HTTPException
from database.models import Meeting
from schemas.contract_schemas import T_Contract
from schemas.meeting_schemas import T_Meeting, T_MeetingUpdate
from schemas.user_schemas import T_User
from database import db
from services.notification_svc import NotificationService
from settings.standarization import format_paginated_response

notification_svc = NotificationService()
acces_denied = "Access denied, please contact the administrator"

class MeetingServices:
    """Service class for managing meetings."""

    async def create_meeting(self, body: T_Meeting, user: T_User) -> dict:
        """Create a new meeting while ensuring uniqueness and minimizing database calls."""
        body_dict = body.model_dump(exclude={"id"})  # Let SQLAlchemy generate the ID

        # Fetch the contract in a single query and ensure the worker is assigned
        contract = await db.contract.filter_by_first(relationships=["worker", "client"], id=body_dict["contract_id"])
        worker = contract.worker
        client = contract.client

        if not worker or worker.id != user["cw_id"]:
            raise HTTPException(status_code=403, detail="You are not assigned to this contract")

        # Check for existing meeting with the same contract_id, date, and time
        existing_meeting = await Meeting.filter_by_first(
            contract_id=body_dict["contract_id"],
            date_meeting=body_dict["date_meeting"],
            time_start=body_dict["time_start"],
        )

        if existing_meeting:
            raise HTTPException(status_code=400, detail="A meeting already exists for this contract at the same time.")

        # Create the new meeting
        meeting = await db.meeting.create(**body_dict)

        await notification_svc.meeting_creation_to_client(
            client_id=client.id,
            worker_full_name=f"{worker.user.first_name} {worker.user.last_name}",
            date_meeting=body_dict["date_meeting"],
            time_start=body_dict["time_start"],
            meeting_id=meeting.id
        )

        return meeting.to_dict()

    async def check_contract_participation(self, contract_id: str, user: T_User) -> bool:
        """Check if the user is allowed to participate in the meeting."""
        contract = await db.contract.filter_by_id(contract_id, relationships=["client", "worker"])

        contract_data = contract.to_dict()
        role = user["role"]
        cw_id = user["cw_id"]
        if role == "admin":
            return contract_data
        elif role == "worker":
            if str(cw_id) == str(contract.worker_id):
                return contract_data
            else:
                raise HTTPException(status_code=403, detail=acces_denied)
        elif role == "client":
            if str(cw_id) == str(contract.client_id):
                return contract_data
            else:
                raise HTTPException(status_code=403, detail=acces_denied)
        else: raise HTTPException(status_code=403, detail=acces_denied)

    async def get_meeting(self, meeting_id: str, user: T_User) -> bool:
        """Check if the user is allowed to participate in the meeting."""
        meeting = await db.meeting.filter_by_id(meeting_id)
        if await self.check_contract_participation(meeting.contract_id, user):
            return T_Meeting(**meeting.to_dict())

    async def get_meetings_by_contract(self, contract_id: str, pagination) -> list[dict]:
        """Retrieve all meetings related to a specific contract."""
        result = await db.meeting.filter_all(contract_id=contract_id, **pagination)
        return await format_paginated_response(result, T_Contract, nested_user=False)

    async def confirm_meeting(self, meeting_id: str, user) -> dict:
        """Confirm an existing meeting."""
        # meeting = await db.meeting.update(meeting_id, status="accepted")
        meeting = await db.meeting.filter_by_id(meeting_id)

        contract = await self.check_contract_participation(meeting.contract_id, user)

        updated_meeting = await meeting.update(meeting.id, status="accepted")
        meeting_data = updated_meeting.to_dict()
        await notification_svc.meeting_accepted_to_worker(worker=contract["worker"],meeting=meeting_data)
        return meeting_data

    async def reject_meeting(self, meeting_id: str,user) -> dict:
        """Reject an existing meeting."""
        # meeting = await db.meeting.update(meeting_id, status="accepted")
        meeting = await db.meeting.filter_by_id(meeting_id)

        contract = await self.check_contract_participation(meeting.contract_id, user)

        updated_meeting = await meeting.update(meeting.id, status="rejected")
        meeting_data = meeting.to_dict()
        await notification_svc.meeting_rejected_to_worker(worker=contract["worker"],meeting=meeting_data)
        return meeting_data

    async def delete_meeting(self, meeting_id: uuid.UUID) -> bool:
        """Delete a meeting by ID."""
        meeting = await db.meeting.filter_by_id(meeting_id)
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")
        await Meeting.delete(meeting_id)
        return True
