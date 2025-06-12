import hmac
import hashlib
import time

email = "fahizoune10@gmail.com"  # Ensure it's the exact email
secret_key = "test".encode()  # Replace with your actual secret key
email_encoded = email.encode()

expected_hashed_email = hmac.new(secret_key, email_encoded, hashlib.sha256).hexdigest()

expiration_timestamp = int(time.time()) + 86400  # 86400 seconds = 24 hours
verification_token = f"{expected_hashed_email}.{expiration_timestamp}"


print("✅ Expected Token:", verification_token)

