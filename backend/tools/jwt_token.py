from jose import jwt, JWTError
import datetime
from fastapi import Header, HTTPException
from fastapi.security import OAuth2PasswordBearer


# Constants
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def create_jwt_token(data: dict, expires_in: int = 3600):
    payload = data.copy()
    payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


# Function to verify and decode JWT token
def verify_jwt_token(token: str = Header(None)):
    test_token = create_jwt_token({"user_id": "123e4567-e89b-12d3-a456-426614174000"})
    if token is None:
        raise HTTPException(status_code=401, detail="Token is required")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")
        if exp and datetime.datetime.utcnow() > datetime.datetime.utcfromtimestamp(exp):
            raise HTTPException(status_code=401, detail="Token has expired")
        return payload  # Return decoded payload for further use (e.g., user_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")