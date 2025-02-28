from fastapi import FastAPI
from routers import register_all_routes
from settings import register_all_errors, register_middleware
from database.Db_BaseModel import check_db
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await check_db()  # Runs at startuproot_path
    yield  # Runs the app

app = FastAPI(lifespan=lifespan, root_path="/api")

register_all_errors(app)
register_middleware(app)
register_all_routes(app)

# Root endpoint
@app.get("/", description="Root endpoint for the API")
def read_root():
    return {"success": True, "detail": "Test API is running"}


