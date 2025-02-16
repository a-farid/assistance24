from fastapi import Body, Cookie, HTTPException, Depends, APIRouter, Response
from jose import jwt
from schemas.user_schemas import T_User, T_UserInDb, T_UserInDbAdmin, T_Login_User
from services.user_services import UserServices
from db.redis import redis_delete, redis_set, redis_get
from services.jwt_services import JWTService
from db.models import User
from settings.standarization import ApiResponse
from settings import Config


router = APIRouter()
user_service = UserServices()
jwt_s = JWTService()


@router.post("/register", response_model=ApiResponse[T_User], description="Register a new user.")
async def register_new_admin(body: T_UserInDbAdmin = Body(...)):
    new_user = await user_service.create_admin(body)
    print(type(new_user))
    return {"success": True, "data": new_user}

@router.post("/login", response_model=ApiResponse[str or T_User], description="Login the user and return the access token.")
async def login_for_access_token(body: T_Login_User = Body(...), check = Depends(jwt_s.verify_login)):
    print("check", check)
    user = await user_service.authenticate_user(**body.model_dump())
    return jwt_s.create_refresh_access_tokens(user)

@router.post("/logout", status_code=200, description="Logout the user by clearing the authentication cookie.")
async def logout(response: Response, access_token = Depends(jwt_s.authorized_token)):
    """
    Logout the user by clearing the authentication cookie.
    """
    response.delete_cookie("access_token")  # Remove token from cookies
    response.delete_cookie("refresh_token")
    await redis_delete(access_token.get("user_id"))
    return {"success": True, "message": "Successfully logged out"}

@router.put("/change_password", response_model=ApiResponse[str], description="Change the user's password.")
async def change_password(
    old_password: str = Body(...),
    new_password: str = Body(...),
    user: T_UserInDb = Depends(user_service.get_user_from_token)
):
    """
    Change the user's password.
    """
    if not jwt_s.verify_password(old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid old password")

    new_hashed_password = jwt_s.get_hashed_password(new_password)

    new_user = await User.update(user.id, hashed_password=new_hashed_password)
    await redis_set(user.id, T_UserInDb(**new_user.to_dict()))

    return {"success": True, "data": "Password changed successfully"}

@router.get("/refresh")
async def refresh_access_token(refresh_token: str = Cookie(None)):
    token = refresh_token.replace("Bearer ", "")
    payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
    user = await redis_get(payload.get("user_id"), T_UserInDb)
    if user:
        return jwt_s.create_refresh_access_tokens(user)
    user = await user_service.get_user_id(payload.get("user_id"))
    await redis_set(user.id, T_UserInDb(**user.to_dict()))

    return jwt_s.create_refresh_access_tokens(user)
