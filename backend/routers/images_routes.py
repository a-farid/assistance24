import os
from fastapi import APIRouter, Depends as Ds, Path
from fastapi.responses import FileResponse
from database import db
from services.jwt_svc import JWTService
from settings.standarization import json_response

router = APIRouter()
jwt_s = JWTService()


@router.get("/{image_name}")
async def get_image(image_name: str):
    image_path = f"assets/profiles/{image_name}"

    # Check if the file exists
    if not os.path.exists(image_path):
        print("Image path", image_path)
        return {"error": "Image not found", "Image path": image_path}

    return FileResponse(image_path)

@router.put("/{image_name}")
async def update_image(image_name: str = Path(...), token =Ds(jwt_s.roles_allowed(["admin","worker", "client"]))):
    url_photo = f"assets/profiles/{image_name}.png"
    updated_user = await db.user.update(token.get("user_id"), url_photo=url_photo)
    return json_response(data=updated_user, status_code=201, message="Image updated successfully")

