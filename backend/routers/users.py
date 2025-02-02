from fastapi import APIRouter, Body, Depends
from pydantic import BaseModel, Field, EmailStr
from uuid import UUID
from tools.standarization import StandardResponse
from tools.jwt_token import verify_jwt_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwIiwiZXhwIjoxNzM4MDE3OTI5fQ.8PGV23UKTpZaeTgxKaRRZkwH-H65hbolLRP5u7hLjZw

router = APIRouter()

security_scheme = OAuth2PasswordBearer(tokenUrl="token")
# User model
class User(BaseModel):
    user_id: UUID = Field(..., description="Unique ID of the user")
    username: str | None = Field(None, max_length=20, examples=["user1"])
    email: EmailStr

# Example GET route (list of users)
@router.get("/", status_code=200, response_model=StandardResponse[list[User]])
async def get_users(decoded_token=Depends(verify_jwt_token), token:OAuth2PasswordRequestForm = Depends()):
    print('decoded_token', decoded_token)
    print('token', token)
    users_list = [
        {"user_id": UUID("123e4567-e89b-12d3-a456-426614174000"), "username": "user1", "email": "user1@example.com"},
        {"user_id": UUID("123e4567-e89b-12d3-a456-426614174001"), "username": "user2", "email": "user2@example.com"},
    ]
    return {
        "Success": True,
        "data": users_list,
    }

# Example POST route (create a new user)
@router.post("/", status_code=201, response_model=StandardResponse[User])
async def create_user(user: User = Body(..., embed=True), decoded_token=Depends(verify_jwt_token)):
    new_user = user.model_dump()
    return {
        "Success": True,
        "data": new_user,
    }
