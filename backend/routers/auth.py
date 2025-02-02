from fastapi import Header, HTTPException, Depends, status, APIRouter
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from datetime import datetime, timedelta
from passlib.context import CryptContext


router = APIRouter()

# Constants
SECRET_KEY = "mysecretkeyfortesting"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Fake in-memory database
fake_db = {
    "user1": {
        "username": "user1",
        "full_name": "John Doe",
        "email": "john.doe@example.com",
        "hashed_password": get_hashed_password("password1"),
        "disabled": False,
    },
    "user2": {
        "username": "user2",
        "full_name": "Jane Smith",
        "email": "jane.smith@example.com",
        "hashed_password": get_hashed_password("password2"),
        "disabled": False,
    },
    "user3": {
        "username": "user3",
        "full_name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "hashed_password": get_hashed_password("password3"),
        "disabled": True,
    },
    "user4": {
        "username": "user4",
        "full_name": "Bob Brown",
        "email": "bob.brown@example.com",
        "hashed_password": get_hashed_password("password4"),
        "disabled": False,
    },
}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str
    full_name: str | None = None
    disabled: bool | None = None

class UserInDb(User):
    hashed_password: str

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDb(**user_dict)

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    return user

def create_jwt_token(data: dict, expires_in: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    if expires_in:
        expire = datetime.utcnow() + timedelta(minutes=expires_in)
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(fake_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user