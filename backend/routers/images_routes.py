import os
from fastapi import APIRouter, Depends as Ds, Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from database import db
from services.jwt_svc import JWTService
from settings.standarization import json_response

router = APIRouter()
jwt_s = JWTService()


@router.get("/{image_name}")
async def get_image(image_name: str):
    """
    Serve static images from assets/profiles directory
    """
    image_path = f"assets/profiles/{image_name}"

    # Check if the file exists
    if not os.path.exists(image_path):
        # return {"error": "Image not found", "image_path": image_path}
        print(f"Image not found at path: {image_path}")
        return FileResponse(
            path=f"assets/profiles/default.png",
            media_type="image/png",  # Adjust based on actual file type if needed
        )

    # Return FileResponse with media type detection
    try:
        return FileResponse(
            path=image_path,
            media_type="image/png",  # Adjust based on actual file type if needed
        )
    except Exception as e:
        return {"error": "Failed to serve image", "details": str(e)}

@router.put("/{image_name}")
async def update_image(image_name: str = Path(...), token =Ds(jwt_s.roles_allowed(["admin","worker", "client"]))):
    url_photo = f"assets/profiles/{image_name}.png"
    updated_user = await db.user.update(token.get("user_id"), url_photo=url_photo)
    return json_response(data=updated_user, status_code=201, message="Image updated successfully")

