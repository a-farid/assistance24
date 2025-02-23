from fastapi import APIRouter, Body, Depends as Ds, Path
from schemas.meeting_schemas import T_Meeting
from services import UserServices, JWTService, MeetingServices
from settings.standarization import json_response


router = APIRouter()
user_service = UserServices()
jwt_s = JWTService()
meeting_service = MeetingServices()

#contract_id: ec5743c5-e4a9-4c6f-9754-97bbcfdd515d

@router.post("/create", description="Create a new meeting [worker]")
async def create_new_meeting(body: T_Meeting = Body(...),user=Ds(jwt_s.roles_allowed(["worker", "admin"]))):
    new_meeting = await meeting_service.create_meeting(body, user)
    return json_response(new_meeting, 200)

@router.put("/{meeting_id}/accept", description="Create a new meeting [client]")
async def accept_meeting(meeting_id: str = Path(...),user=Ds(jwt_s.roles_allowed(["client", "admin"]))):
    new_meeting = await meeting_service.confirm_meeting(meeting_id, user)
    return json_response(new_meeting, 200)

@router.put("/{meeting_id}/reject", description="Create a new meeting [client]")
async def reject_a_meeting(meeting_id: str = Path(...),user=Ds(jwt_s.roles_allowed(["client", "admin"]))):
    new_meeting = await meeting_service.reject_meeting(meeting_id, user)
    return json_response(new_meeting, 200)

@router.get("/{meeting_id}", description="Create a new meeting [client]")
async def get_one_meeting(meeting_id: str = Path(...),token=Ds(jwt_s.roles_allowed(["client", "worker", "admin"]))):
    new_meeting = await meeting_service.get_meeting(meeting_id, token)
    return json_response(new_meeting, 200)

