from fastapi import Body, Cookie, HTTPException, Depends as Ds, APIRouter, Path, Query, Response
from jose import jwt
from schemas.user_schemas import T_FCMToken, T_PassUpdate, T_User, T_UserInDb, T_UserInDbAdmin, T_Login_User
from services.auth_svc import AuthServices
from database.redis import redis_delete, redis_set
from services.jwt_svc import JWTService
from database.models import User
from settings.standarization import ApiResponse, json_response
from settings import Config
from database import db


router = APIRouter()
auth_svc = AuthServices()
jwt_s = JWTService()


@router.post("/register", response_model=ApiResponse[T_User], description="Register a new user.")
async def register_new_admin(body: T_UserInDbAdmin = Body(...)):
    body_dict = body.dict()
    body_dict.pop("id", None)
    body = T_UserInDbAdmin(**body_dict)
    new_user = await auth_svc.create_admin(body)
    return {"success": True, "data": new_user}

@router.post("/login", description="Login the user and return the access token.")
async def login_for_access_token(body: T_Login_User = Body(...), _= Ds(jwt_s.verify_login)):
    user = await auth_svc.authenticate_user(**body.model_dump())
    return await jwt_s.create_refresh_access_tokens(user)

@router.post("/logout", status_code=200, description="Logout the user by clearing the authentication cookie.")
async def logout(response: Response, access_token = Ds(jwt_s.authorized_token)):
    """
    Logout the user by clearing the authentication cookie.
    """
    response.delete_cookie("access_token")  # Remove token from cookies
    response.delete_cookie("refresh_token")
    await redis_delete(access_token.get("user_id"))
    return {"success": True, "message": "Successfully logged out"}

@router.get("/me", description="Get the connected user.")
async def read_connected_user(current_user= Ds(auth_svc.get_user_from_token)):
    return json_response(data=current_user)

@router.put("/change_password", description="Change the user's password.")
async def change_password(body: T_PassUpdate = Body(...),user: T_UserInDb = Ds(auth_svc.get_user_from_token)):
    """
    Change the user's password.
    """
    body_dict = body.model_dump()
    if not jwt_s.verify_password(body_dict.get("old_password"), user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid old password")

    new_hashed_password = jwt_s.get_hashed_password(body_dict.get("new_password"))

    new_user = await User.update(user.id, hashed_password=new_hashed_password)
    await redis_set(user.id, T_UserInDb(**new_user.to_dict()))

    return {"success": True, "data": "Password changed successfully"}


@router.put("/set_password_activation", description="Set the user's password.")
async def set_password_activation(new_password: str = Body(...), email=Ds(jwt_s.decode_activation_token)):
    """Set the user's password."""
    user = await auth_svc.set_password(email, new_password)
    return await jwt_s.create_refresh_access_tokens(user)

@router.get("/verify_email")
async def verify_email_activation(email: str = Query(...), token: str = Query(...)):
    """Verify email using HMAC hashed token"""
    avtivated_user = await auth_svc.verify_email(email, token)
    return jwt_s.create_email_activation_tokens(avtivated_user)

@router.get("/refresh")
async def refresh_access_token(refresh_token: str = Cookie(None)):
    """
    Refresh the access token using the refresh token.
    """
    print("refresh_token", refresh_token)
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    print("refresh_token", refresh_token)
    token = refresh_token.replace("Bearer ", "")
    payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
    print("payload", payload)
    user = user = await auth_svc.get_user(payload.get("user_id"))
    # Update FCM token if provided

    return await jwt_s.create_refresh_access_tokens(user)


@router.put("/fcm-token")
async def update_fcm_token(body: T_FCMToken= Body(...), _: dict = Ds(jwt_s.authorized_token)):
    """Store the Firebase Cloud Messaging (FCM) token for the user."""
    print("Route arrived")
    updated_user = await auth_svc.set_fcm_token(body)
    return json_response(data=updated_user, message="FCM token updated succesfully")
