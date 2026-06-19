from settings.standarization import pagination_params, json_response_pagination # pyrefly: ignore [missing-import]
from fastapi import APIRouter, Body, Depends as Ds, Path # pyrefly: ignore [missing-import]
from schemas.meeting_schemas import T_Meeting
from services import UserServices, JWTService, MeetingServices

router = APIRouter()
user_service = UserServices()
jwt_s = JWTService()
meeting_service = MeetingServices()


@router.post("/create", description="Create a new meeting [worker]")
async def create_new_meeting(body: T_Meeting = Body(...),user=Ds(jwt_s.roles_allowed(["worker", "admin"]))):
    new_meeting = await meeting_service.create_meeting(body, user)
    return json_response_pagination(new_meeting, 200)

@router.get("/me", description="Get the current user's meeting [worker, client]")
async def get_my_meetings(pagination: dict = Ds(pagination_params),token =Ds(jwt_s.roles_allowed(["worker", "client"]))):
    response = await meeting_service.get_my_meetings(token, pagination)
    return json_response_pagination(**response, message="User meetings retrieved")

@router.get("/all", description="Get all meetings [admin]")
async def get_all_meetings(pagination: dict = Ds(pagination_params), _: dict =Ds(jwt_s.roles_allowed(["admin"]))):
    contracts = await meeting_service.get_all_meetings(pagination)
    return json_response_pagination(**contracts, message="All meetings retrieved")
    
@router.put("/{meeting_id}/accept", description="Accept a meeting [client]")
async def accept_meeting(meeting_id: str = Path(...),user=Ds(jwt_s.roles_allowed(["client", "admin"]))):
    new_meeting = await meeting_service.confirm_meeting(meeting_id, user)
    return json_response_pagination(new_meeting, 200)

@router.put("/{meeting_id}/reject", description="Reject a meeting [client]")
async def reject_a_meeting(meeting_id: str = Path(...),user=Ds(jwt_s.roles_allowed(["client", "admin"]))):
    new_meeting = await meeting_service.reject_meeting(meeting_id, user)
    return json_response_pagination(new_meeting, 200)

@router.get("/{meeting_id}", description="Get a specific meeting [client, worker, admin]")
async def get_one_meeting(meeting_id: str = Path(...),token=Ds(jwt_s.roles_allowed(["client", "worker", "admin"]))):
    new_meeting = await meeting_service.get_meeting(meeting_id, token)
    return json_response_pagination(new_meeting, 200)

