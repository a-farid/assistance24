
from fastapi import APIRouter, FastAPI
from . import  auth_routes, contract_routes, user_routes, notification_routes, meeting_routes, images_routes







def register_all_routes(app: FastAPI):
    # Include the routers
    app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
    app.include_router(user_routes.router, prefix="/users", tags=["Users"])
    app.include_router(contract_routes.router, prefix="/contracts", tags=["Contracts"])
    app.include_router(meeting_routes.router, prefix="/meetings", tags=["Meetings"])
    app.include_router(notification_routes.router, prefix="/notifications", tags=["Notifications"], include_in_schema=True)
    app.include_router(images_routes.router, prefix="/images", tags=["Notifications"], include_in_schema=False)

