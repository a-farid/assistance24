from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from jinja2 import Environment, FileSystemLoader
from settings import Config
from pathlib import Path

import time
from fastapi import HTTPException
from schemas.user_schemas import  T_User
from services.jwt_svc import JWTService
from settings import Config
import hashlib
import hmac
import urllib.parse

jwt_s = JWTService()

# Base directory
BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_DIR = (BASE_DIR / "templates").resolve()

# Mail configuration
mail_config = ConnectionConfig(
    MAIL_USERNAME=Config.MAIL_USERNAME,
    MAIL_PASSWORD=Config.MAIL_PASSWORD,
    MAIL_FROM=Config.MAIL_FROM,
    MAIL_PORT=587,
    MAIL_SERVER=Config.MAIL_SERVER,
    MAIL_FROM_NAME=Config.MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=str(TEMPLATE_DIR),  # Ensure it's a string
)

mail = FastMail(config=mail_config)

# Load Jinja environment
env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))  # ✅ Corrected path

async def send_email(recipients: list[str], subject: str, template_name: str, context: dict):
    """
    Send an email using an HTML template with dynamic data.
    """
    try:
        # Load the template
        template = env.get_template(template_name)
        body = template.render(context)  # Render with dynamic data

        # Create the message
        message = MessageSchema(recipients=recipients, subject=subject, body=body, subtype=MessageType.html)

        # Send the email
        mail = FastMail(mail_config)
        await mail.send_message(message)

        return True
    except Exception as e:
        print("Error:", e)
        return False

class MailServices:
    def __init__(self):
        pass
    async def send_verification_mail(self, user:T_User):

        # Generate a secure verification token (HMAC)
        secret_key = Config.EMAIL_VERIFICATION_SECRET.encode()

        # Add expiration timestamp (24 hours from now)
        expiration_timestamp = int(time.time()) + 86400  # 86400 seconds = 24 hours

        # Combine the email and expiration timestamp
        data_to_hash = f"{user.email}:{expiration_timestamp}".encode()

        # Create the HMAC signature of the combined data
        hmac_signature = hmac.new(secret_key, data_to_hash, hashlib.sha256).hexdigest()

        # Generate the verification token with the expiration timestamp and HMAC signature
        verification_token = f"{expiration_timestamp}:{hmac_signature}"

        verification_link = f"{Config.APP_URL}/api/auth/verify_email?email={urllib.parse.quote(user.email)}&token={verification_token}"

        result = await send_email(
            recipients=[user.email],
            subject=f"Hi {user.first_name}, Assistenz365 hat dich eingeladen beizutreten!",
            template_name="email_template.html",
            context={"username": user.username, "first_name": user.first_name, "verification_link": verification_link}
        )
        if not result:
            raise HTTPException(status_code=400, detail="Failed to send email")

        return result

    async def send_reset_password_mail(self, user:T_User):

        token = await jwt_s.create_token({"email": user.email}, "refresh")

        verification_link = f"{Config.FRONTEND_URL}/reset_password?token={token}"

        result = await send_email(
            recipients=[user.email],
            subject=f"Hi {user.first_name}, Passwort vergessen?? Klicken Sie auf den Link unten, um Ihr Passwort zurückzusetzen",
            template_name="reset_password.html",
            context={"username": user.username, "first_name": user.first_name, "verification_link": verification_link}
        )
        if not result:
            raise HTTPException(status_code=400, detail="Failed to send email")

        return result