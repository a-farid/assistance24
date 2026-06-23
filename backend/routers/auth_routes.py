from fastapi import Body, Cookie, HTTPException, Depends as Ds, APIRouter, Path, Query
from fastapi.responses import JSONResponse
from jose import jwt
from schemas.user_schemas import T_Email, T_FCMToken, T_PasswordUpdate, T_ResetPassword, T_User, T_UserInDbAdmin, T_Login_User
from services.auth_svc import AuthServices
from services.jwt_svc import JWTService
from database import redis_delete
from settings.standarization import ApiEmailResponse, ApiResponseOne, json_response_one
from settings import Config

router = APIRouter()
auth_svc = AuthServices()
jwt_s = JWTService()


@router.post("/register", response_model=ApiResponseOne[T_User], description="Register a new admin.")
async def register(body: T_UserInDbAdmin = Body(...)):
    body_dict = body.model_dump(exclude={"id"})
    body = T_UserInDbAdmin(**body_dict)
    new_user = await auth_svc.create_admin(body)
    return await jwt_s.create_refresh_access_tokens(new_user)

@router.get("/check_email/{email}", response_model=ApiResponseOne[T_User], description="Check if the email exists.")
async def check_email(email: str = Path(...)):
    result=await auth_svc.check_email(email)
    if result:
        return json_response_one(message="The email already exists on DB", item=result)
    else:
        return json_response_one(message="The email does not exist on DB", status_code=404, item=result)

@router.get("/check_username/{username}", response_model=ApiResponseOne[T_User], description="Check if the username exists.")
async def check_username(username: str = Path(...)):
    result=await auth_svc.check_username(username)
    if result:
        return json_response_one(message="The username already exists on DB", item=result)
    else:
        return json_response_one(message="The username does not exist on DB", status_code=404, item=result)

@router.post("/login", response_model=ApiResponseOne[T_User], description="Login the user and return the access token.")
async def login_for_access_token(body: T_Login_User = Body(...), _= Ds(jwt_s.verify_login)):
    user = await auth_svc.authenticate_user(**body.model_dump())
    return await jwt_s.create_refresh_access_tokens(user)

@router.post("/logout", status_code=200, response_model=ApiResponseOne[str], description="Logout the user by clearing the authentication cookie.")
async def logout(access_token=Ds(jwt_s.authorized_refresh_token)):
    """
    Logout the user by clearing the authentication cookie.
    """
    response = JSONResponse(content={"success": True, "message": "Logged out successfully"})

    # Architectural Shift: Explicitly targeting the shared root domain to wipe the session
    response.delete_cookie(
        "access_token", 
        path="/", 
        domain=Config.COOKIE_DOMAIN,    # Crucial: Tells browser to clear the subdomain pool
        httponly=True,                  # Aligned with login security profile
        secure=Config.COOKIE_SECURE,    # Aligned with local development environment
        samesite="lax"                  # Aligned with our updated First-Party configuration
    )
    
    response.delete_cookie(
        "refresh_token", 
        path="/", 
        domain=Config.COOKIE_DOMAIN,    # Crucial: Tells browser to clear the subdomain pool
        httponly=True,                  # Aligned with login security profile
        secure=Config.COOKIE_SECURE,    # Aligned with local development environment
        samesite="lax"                  # Aligned with our updated First-Party configuration
    )

    # Evict the user's active session from the Redis caching layer
    await redis_delete(access_token.get("user_id"))
    print("Logout success back")
    return response

@router.get("/me", response_model=ApiResponseOne[T_User], description="Get the connected user.")
async def read_connected_user(current_user= Ds(auth_svc.get_user_from_token)):
    return json_response_one(item=current_user, message="Connected user retrieved succesfully")

@router.put("/change_password", response_model=ApiResponseOne[str], description="Change the user's password.")
async def change_password(body: T_PasswordUpdate = Body(...),user: T_User = Ds(auth_svc.get_user_from_token)):
    await auth_svc.change_password(body.model_dump(), user)
    return json_response_one(message="Password changed successfully")

@router.put("/set_password_activation", response_model=ApiResponseOne[None], description="Set the user's password.")
async def set_password_activation(new_password: str = Body(...), email=Ds(jwt_s.decode_activation_token)):
    user = await auth_svc.set_password(email, new_password)
    return await jwt_s.create_refresh_access_tokens(user)

@router.get("/verify_email", response_model=ApiEmailResponse, description="Verify the user's email using the activation token.")
async def verify_email_activation(email: str = Query(...), token: str = Query(...)):
    activated_user = await auth_svc.verify_email(email, token)
    return jwt_s.create_email_activation_tokens(activated_user)

@router.post("/refresh", response_model=ApiResponseOne[T_User], description="Refresh the access token using the refresh token.")
async def refresh_access_token(refresh_token: str = Cookie(None)):
    """
    Refresh the access token using the refresh token.
    """
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token is required")
    payload = jwt.decode(refresh_token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
    user = await auth_svc.get_user(payload.get("user_id"))

    return await jwt_s.create_refresh_access_tokens(user)

@router.put("/fcm-token", response_model=ApiResponseOne[T_User], description="Update the user's Firebase Cloud Messaging (FCM) token.")
async def update_fcm_token(body: T_FCMToken= Body(...), _: dict = Ds(jwt_s.authorized_token)):
    """Store the Firebase Cloud Messaging (FCM) token for the user."""
    updated_user = await auth_svc.set_fcm_token(body)
    return json_response_one(item=updated_user, message="FCM token updated succesfully")

@router.post("/forgot_password", response_model=ApiResponseOne[None], description="Initiate the password reset process.")
async def forgot_password(body: T_Email= Body(...)):
    """Store the Firebase Cloud Messaging (FCM) token for the user."""
    body_dict = body.model_dump()
    email = body_dict.get("email")
    if email is None:
        raise HTTPException(status_code=422, detail="Email is required")
    updated_user = await auth_svc.forgot_password(email)
    return json_response_one(item=updated_user, message="FCM token updated succesfully")

@router.post("/reset_password", response_model=ApiResponseOne[T_User], description="Reset the user's password using the reset token.")
async def reset_password(body: T_ResetPassword= Body(...)):
    """Store the Firebase Cloud Messaging (FCM) token for the user."""
    body_dict = body.model_dump()
    print("body reset password", body_dict)
    updated_user = await auth_svc.reset_password(body_dict)
    return await jwt_s.create_refresh_access_tokens(updated_user)
