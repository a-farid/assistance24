
from fastapi import APIRouter, Depends as Ds, HTTPException, Path
from schemas.notification_schemas import T_Notification
from services.jwt_svc import JWTService
from settings.standarization import format_paginated_response, json_response, pagination_params
from database import db


router = APIRouter()
jwt_s = JWTService()


@router.get("/unread")
async def get_unread_notifications(pagination = Ds(pagination_params),payload= Ds(jwt_s.authorized_token)):
    """Get all unread notifications for a user"""
    print("payload",payload.get("user_id"))
    # Get unread notifications
    unread_notifications = await db.notification.filter_all(receiver_id=payload.get("cw_id"), read=False, **pagination)

    result = await format_paginated_response(unread_notifications, T_Notification, nested_user=False)

    return json_response(**result, message="Unread notifications retrieved", status_code=200)

@router.put("/{notification_id}/read")
async def mark_notification_as_read(notification_id: str = Path(...), payload=Ds(jwt_s.authorized_token)):
    """Mark a notification as read"""
    # Find the notification
    notification = await db.notification.filter_by_id(notification_id)

    if notification.receiver_id != payload.get("cw_id"):
        raise HTTPException(status_code=400, detail="You are not the receiver of this notification")

    updated_notification = await db.notification.update(notification_id, read=True)

    return json_response(data=updated_notification, message="Notification marked as read", status_code=201)

@router.delete("/{notification_id}")
async def delete_notification(notification_id: str = Path(...), payload=Ds(jwt_s.authorized_token)):
    """Delete a notification"""
    # Find the notification
    notification = await db.notification.filter_by_id(notification_id)

    if notification.receiver_id != payload.get("cw_id"):
        raise HTTPException(status_code=400, detail="You are not the receiver of this notification")

    await db.notification.delete(notification_id)

    return json_response(message="Notification deleted", status_code=201)