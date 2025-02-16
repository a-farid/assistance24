from fastapi import FastAPI
from routers import  auth_routes, contract_routes, user_routes
from settings import register_all_errors, register_middleware
from db.main import check_db

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await check_db()

register_all_errors(app)
register_middleware(app)

# Root endpoint
@app.get("/", description="Root endpoint for the API")
def read_root(): return {"success": True, "detail":"Test API is running"}

# Include the routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/api/users", tags=["Users"])
app.include_router(contract_routes.router, prefix="/api/contracts", tags=["Contracts"])
