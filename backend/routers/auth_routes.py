from fastapi import Body, Cookie, HTTPException, Depends as Ds, APIRouter, Path, Query, Response
from fastapi.responses import JSONResponse
from jose import jwt
from schemas.user_schemas import T_Email, T_FCMToken, T_PassUpdate, T_ResetPassword, T_User, T_UserInDb, T_UserInDbAdmin, T_Login_User
from services.auth_svc import AuthServices
from services.jwt_svc import JWTService
from database import db,redis_delete, redis_set
from settings.standarization import ApiResponse, json_response
from settings import Config

router = APIRouter()
auth_svc = AuthServices()
jwt_s = JWTService()


@router.post("/signup", response_model=ApiResponse[T_User], description="Register a new admin.")
async def signup(body: T_UserInDbAdmin = Body(...)):
    body_dict = body.model_dump(exclude={"id"})
    body = T_UserInDbAdmin(**body_dict)
    new_user = await auth_svc.create_admin(body)
    return await jwt_s.create_refresh_access_tokens(new_user)

@router.get("/check_email/{email}", response_model=ApiResponse[T_User], description="Check if the email exists.")
async def check_email(email: str = Path(...)):
    result=await auth_svc.check_email(email)
    if result:
        return json_response(message="The email already exists on DB", data=result)
    else:
        return json_response(message="The email does not exist on DB", data=result)

@router.get("/check_username/{username}", response_model=ApiResponse[T_User], description="Check if the username exists.")
async def check_username(username: str = Path(...)):
    result=await auth_svc.check_username(username)
    if result:
        return json_response(message="The username already exists on DB", data=result)
    else:
        return json_response(message="The username does not exist on DB", data=result)

@router.post("/login", description="Login the user and return the access token.")
async def login_for_access_token(body: T_Login_User = Body(...), _= Ds(jwt_s.verify_login)):
    user = await auth_svc.authenticate_user(**body.model_dump())
    return await jwt_s.create_refresh_access_tokens(user)

@router.post("/logout", status_code=200, description="Logout the user by clearing the authentication cookie.")
async def logout(access_token=Ds(jwt_s.authorized_token)):
    """
    Logout the user by clearing the authentication cookie.
    """
    response = JSONResponse(content={"success": True, "message": "Logged out successfully"})

    response.delete_cookie("access_token", httponly=False, secure=True, path="/", samesite="none")
    response.delete_cookie("refresh_token", httponly=False, secure=True, path="/", samesite="none")

    await redis_delete(access_token.get("user_id"))

    return response


@router.get("/me", description="Get the connected user.")
async def read_connected_user(current_user= Ds(auth_svc.get_user_from_token)):
    return json_response(data=current_user)

@router.put("/change_password", description="Change the user's password.")
async def change_password(body: T_PassUpdate = Body(...),user: T_User = Ds(auth_svc.get_user_from_token)):
    """
    Change the user's password.
    """
    await auth_svc.change_password(body.model_dump(), user)
    return json_response(message="Password changed successfully")


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
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token is required")
    token = refresh_token.replace("Bearer ", "")
    payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
    user = await auth_svc.get_user(payload.get("user_id"))

    return await jwt_s.create_refresh_access_tokens(user)

@router.put("/fcm-token")
async def update_fcm_token(body: T_FCMToken= Body(...), _: dict = Ds(jwt_s.authorized_token)):
    """Store the Firebase Cloud Messaging (FCM) token for the user."""
    updated_user = await auth_svc.set_fcm_token(body)
    return json_response(data=updated_user, message="FCM token updated succesfully")

@router.post("/forgot_password")
async def forgot_password(body: T_Email= Body(...)):
    """Store the Firebase Cloud Messaging (FCM) token for the user."""
    body_dict = body.model_dump()
    email = body_dict.get("email")
    if email is None:
        raise HTTPException(status_code=422, detail="Email is required")
    updated_user = await auth_svc.forgot_password(email)
    return json_response(data=updated_user, message="FCM token updated succesfully")

@router.post("/reset_password")
async def reset_password(body: T_ResetPassword= Body(...)):
    """Store the Firebase Cloud Messaging (FCM) token for the user."""
    body_dict = body.model_dump()
    print("body reset password", body_dict)
    updated_user = await auth_svc.reset_password(body_dict)
    return await jwt_s.create_refresh_access_tokens(updated_user)
