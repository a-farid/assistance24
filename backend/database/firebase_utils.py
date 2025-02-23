import firebase_admin
from firebase_admin import credentials, messaging

from database.models import FCMToken
from . import db

# Load Firebase credentials
cred = credentials.Certificate("serviceAccountKey.json")  # Firebase key file
firebase_admin.initialize_app(cred)


import firebase_admin
from firebase_admin import messaging
import logging

logger = logging.getLogger(__name__)

async def send_push_notification(receiver_id: str, title: str, message: str, link: str = None):
    """Store the notification in the database and send a push notification.

    Args:
        receiver_id (str): The user ID to receive the notification.
        title (str): The notification title.
        message (str): The notification message.
        link (str, optional): The notification link. Defaults to None.

    Returns:
        str: The Firebase Cloud Messaging response ID or None.
    """
    # Store the notification in the database
    new_notification = await db.notification.create(receiver_id=receiver_id, title=title, message=message, link=link)

    # Get the FCM token
    fcm_token_client = await FCMToken.filter_by_first(user_id=receiver_id)

    # Check if token exists and is valid
    if not fcm_token_client or fcm_token_client.token == "None":
        logger.warning(f"No valid FCM token found for user {receiver_id}")
        return None

    # Create FCM message
    fcm_message = messaging.Message(
        notification=messaging.Notification(title=title, body=message),
        token=fcm_token_client.token,
        data={"notification_id": str(new_notification.id)},
        webpush=messaging.WebpushConfig(
            notification=messaging.WebpushNotification(
                icon="https://cdn-icons-png.flaticon.com/512/3119/3119338.png",
                click_action=link
            )
        )
    )

    try:
        # Send push notification
        response = await messaging.send_async(fcm_message)  # Use async version
        return response

    except messaging.FirebaseError as e:
        error_msg = str(e)
        logger.error(f"FCM Error: {error_msg}")

        # Check if the token is invalid or expired
        if "registration-token-not-registered" in error_msg:
            logger.info(f"Invalid FCM token detected for user {receiver_id}, marking as expired.")
            await db.fcm_token.update(fcm_token_client.id, token="None", status="expired")

    return None
