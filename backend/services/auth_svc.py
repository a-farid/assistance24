import time
from fastapi import Depends, HTTPException
from database import redis_get, redis_set, db
from database.firebase_utils import send_push_notification
from database.models import FCMToken, User
from schemas.user_schemas import T_FCMToken, T_TokenData, T_User, T_UserInDb, T_UserInDbAdmin
from services.jwt_svc import JWTService
from settings import Config
import hashlib
import hmac
from settings.mail import MailServices

jwt_s = JWTService()
mail_svc = MailServices()



class AuthServices:
    def __init__(self):
        pass

    async def notify_all_admins(self, title: str, message: str, link: str):
        admins_list = await db.user.filter_all(roles=["admin"])
        for admin in admins_list:
            await send_push_notification(admin.id, admin.fcm_token, title, message, link)

    async def create_admin(self, user: T_UserInDbAdmin) -> T_User:
        """
        Create a new admin user.
        :param user: User data
        :return: Created user
        """
        print("Creating admin user:", user)
        print("user.admin_key:", user.admin_key)
        print("Config.SEKRET_KEY_ADMIN:", Config.SEKRET_KEY_ADMIN)
        print("Config.SEKRET_KEY_ADMIN should be:", jwt_s.get_hashed_password("test"))
        print("jwt_s.verify_password:", jwt_s.verify_password(user.admin_key, Config.SEKRET_KEY_ADMIN))
        try:
            if not jwt_s.verify_password(user.admin_key, Config.SEKRET_KEY_ADMIN):
                raise HTTPException(status_code=400, detail="Incorrect admin key")
        except Exception as e:
            print("Error verifying admin key:", e)
            raise HTTPException(status_code=400, detail="Incorrect admin key")

        user.hashed_password = jwt_s.get_hashed_password(user.hashed_password)
        user.is_admin = True
        user.is_verified = True
        user.role = "admin"

        user_data = user.model_dump(exclude={"id"})

        new_user = await db.user.create(unique_fields=["username", "email"], **user_data)
        fcm_token = {"user_id": new_user.id, "status": "expired", "token": new_user.id}
        await db.fcm_token.create(**fcm_token)

        return T_User(**new_user.to_dict())

    async def forgot_password(self, email: str) -> T_User:
        user = await db.user.filter_by_first(email=email)
        await mail_svc.send_reset_password_mail(user)

    async def reset_password(self, body: dict) -> T_User:
        decoded_email = await jwt_s.decode_activation_token(body.get("token"))
        user = await db.user.filter_by_first(email=decoded_email)
        updated_user = await db.user.update(user.id, hashed_password=jwt_s.get_hashed_password(body.get("password")))
        return T_User(**updated_user.to_dict())

    async def verify_reset_password_email(self, email: str, token: str):
        """
        Verify email using HMAC hashed token with expiration check.

        :param email: Email address
        :param token: HMAC hashed token with expiration timestamp
        """

        # Split the token into expiration timestamp and HMAC signature
        try:
            expiration_timestamp_str, received_hmac_signature = token.split(':')
            expiration_timestamp = int(expiration_timestamp_str)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid verification token format")

        # Check if the token has expired (24 hours window)
        current_time = int(time.time())
        if current_time > expiration_timestamp:
            raise HTTPException(status_code=400, detail="Verification link has expired")

        # Generate the expected HMAC signature for the email and expiration timestamp
        secret_key = Config.EMAIL_VERIFICATION_SECRET.encode()
        data_to_hash = f"{email}:{expiration_timestamp}".encode()
        expected_hmac_signature = hmac.new(secret_key, data_to_hash, hashlib.sha256).hexdigest()

        # Check if the received HMAC signature matches the expected one
        if not hmac.compare_digest(received_hmac_signature, expected_hmac_signature):
            raise HTTPException(status_code=400, detail="Invalid or tampered verification link")

        # Check if the user has already activated their account
        user = await db.user.filter_by_first(email=email)

        await self.notify_all_admins("User Email Updated", f"{user.username} reseted their password.", f"/users/{user.id}")

        return user

    async def verify_email(self, email: str, token: str):
        """
        Verify email using HMAC hashed token with expiration check.

        :param email: Email address
        :param token: HMAC hashed token with expiration timestamp
        """

        # Split the token into expiration timestamp and HMAC signature
        try:
            expiration_timestamp_str, received_hmac_signature = token.split(':')
            expiration_timestamp = int(expiration_timestamp_str)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid verification token format")

        # Check if the token has expired (24 hours window)
        current_time = int(time.time())
        if current_time > expiration_timestamp:
            raise HTTPException(status_code=400, detail="Verification link has expired")

        # Generate the expected HMAC signature for the email and expiration timestamp
        secret_key = Config.EMAIL_VERIFICATION_SECRET.encode()
        data_to_hash = f"{email}:{expiration_timestamp}".encode()
        expected_hmac_signature = hmac.new(secret_key, data_to_hash, hashlib.sha256).hexdigest()

        # Check if the received HMAC signature matches the expected one
        if not hmac.compare_digest(received_hmac_signature, expected_hmac_signature):
            raise HTTPException(status_code=400, detail="Invalid or tampered verification link")

        # Check if the user has already activated their account
        user = await db.user.filter_by_first(email=email)
        if user.is_verified:
            raise HTTPException(status_code=400, detail="Email is already verified")

        # Mark user as verified
        await db.user.update(user.id, is_verified=True)
        await redis_set(user.id, T_UserInDb(**user.to_dict()))

        await self.notify_all_admins("User Email Updated", f"{user.username} changed their email.", f"/users/{user.id}")

        return user

    async def set_password(self, email: str, password: str):
        """Set the user's password."""
        new_hashed_password = jwt_s.get_hashed_password(password)
        user = await db.user.filter_by_first(email=email)
        updated_user = await db.user.update(user.id, hashed_password=new_hashed_password)
        await redis_set(user.id, T_UserInDb(**updated_user.to_dict()))
        return updated_user

    async def change_password(self, body: dict, token:T_User) -> T_User:
        user = await db.user.filter_by_id(token.id)
        if not jwt_s.verify_password(body.get("old_password"), user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid old password")

        new_hashed_password = jwt_s.get_hashed_password(body.get("new_password"))
        await db.user.update(user.id, hashed_password=new_hashed_password)

    async def set_fcm_token(self, body: T_FCMToken) -> T_FCMToken:
        """Store the Firebase Cloud Messaging (FCM) token for the user."""
        body_dict = body.model_dump()
        user_id = body_dict.get("user_id")

        # Check if a token exists for the user
        token_entry = await FCMToken.filter_by_first(user_id=user_id)

        if token_entry:
            # Update the existing token
            token_entry = await db.fcm_token.update(token_entry.id, token=body_dict["token"])
        else:
            # Create a new FCM token entry
            token_entry = await db.fcm_token.create(**body_dict)

        # Try caching in Redis
        try:
            await redis_set(token_entry.id, T_FCMToken(**token_entry.to_dict()))
        except Exception as e:
            print(f"⚠️ Redis update failed: {e}")  # Consider using proper logging

        return token_entry  # Return the final token object

    async def authenticate_user(self, username: str, password: str) -> T_User:
        user = await db.user.filter_by_first(username=username)

        if not jwt_s.verify_password(password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect password")
        if user.disabled:
            raise HTTPException(status_code=400, detail="User is disabled, contact the administrator")
        await redis_set(user.id, T_User(**user.to_dict()))
        return T_User(**user.to_dict())

    async def check_username(self, username: str) -> T_User:
        user = await User.filter_by_first(username=username)

        if user:
            return True
        else: return False

    async def check_email(self, email: str) -> T_User:
        user = await User.filter_by_first(email=email)
        if user:
            return True
        else: return False

    async def get_user_from_token(self, payload: T_TokenData = Depends(jwt_s.authorized_token)) -> T_User:
        user = await self.get_user(payload.get("user_id"))
        return T_User(**user.model_dump())

    async def get_user(self, user_id) -> T_User:
        user_redis = await redis_get(user_id, T_User)

        if user_redis:
            if user_redis.disabled:
                raise HTTPException(status_code=400, detail="User is disabled, contact the administrator")
            return user_redis
        user = await db.user.filter_by_id(user_id)
        if user.disabled:
            raise HTTPException(status_code=400, detail="User is disabled, contact the administrator")
        await redis_set(user.id, T_User(**user.to_dict()))

        return T_User(**user.to_dict())

