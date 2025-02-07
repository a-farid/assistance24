from fastapi import Body, Cookie, HTTPException, Depends, APIRouter, Response
from jose import jwt
from requests import session
from services.user_services import authenticate_user, create_admin, get_user, get_user_from_token
from tools.Bd_BaseModel import DB_BaseModel
from tools.cach_redis import redis_delete, redis_set, redis_get
from tools.jwt_token import ALGORITHM, SECRET_KEY, create_refresh_access_tokens, get_hashed_password, verify_cookie_token, verify_password
from tools.models import User
from tools.pydantic_types import T_Login_User, T_Token, T_User, T_UserInDb, T_UserInDbAdmin
from tools.standarization import StandardResponse


router = APIRouter()
sessionDb = DB_BaseModel.get_session()

@router.post("/register", response_model=StandardResponse[T_User], description="Register a new user.")
async def register_user(body: T_UserInDbAdmin = Body(...)):
    new_user = create_admin(body)
    return {"success": True, "data": new_user}


@router.post("/login", description="Login the user and return the access token.")
async def login_for_access_token(login: T_Login_User = Body(...)) -> T_Token:
    user = authenticate_user(**login.model_dump())
    redis_set(user.id, user)
    return create_refresh_access_tokens(user)


@router.post("/logout", status_code=200, description="Logout the user by clearing the authentication cookie.")
async def logout(response: Response, access_token = Depends(verify_cookie_token)):
    """
    Logout the user by clearing the authentication cookie.
    """
    response.delete_cookie("access_token")  # Remove token from cookies
    response.delete_cookie("refresh_token")
    redis_delete(access_token.get("user_id"))
    return {"success": True, "message": "Successfully logged out"}


@router.put("/change_password", response_model=StandardResponse[bool], description="Change the user's password.")
async def change_password(
    old_password: str = Body(...),
    new_password: str = Body(...),
    user: T_UserInDb = Depends(get_user_from_token)
):
    """
    Change the user's password.
    """
    if not verify_password(old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid old password")

    user.hashed_password = get_hashed_password(new_password)

    updated_user = User.update(user.id, **user.model_dump())
    sessionDb.add(updated_user)
    sessionDb.commit()
    sessionDb.refresh(updated_user)


    return {"success": True, "data": True}

@router.post("/refresh")
async def refresh_access_token(refresh_token: str = Cookie(None)):
    token = refresh_token.replace("Bearer ", "")
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    user = redis_get(payload.get("user_id"), T_UserInDb)
    if user is None:
        user = get_user(payload.get("username"))
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        redis_set(user.id, user)

    return create_refresh_access_tokens(user)
