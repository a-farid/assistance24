import traceback
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from routers import users, pointers, auth
from pydantic import BaseModel

app = FastAPI()

# Include the routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(pointers.router, prefix="/api/pointers", tags=["Pointers"])


# Custom exception handler for HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
        # Extract traceback information
    tb = traceback.format_exc().splitlines()
    # Extract the most recent call from the traceback
    error_location = tb[-2] if len(tb) > 2 else "No traceback available"
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "exception": error_location,  # Includes the function and file info
            "path": request.url.path,  # Include the path where the error occurred
        },
    )


# Catch-all exception handler for unexpected errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "status_code": 500,
            "message": "An unexpected error occurred. Please try again later.",
        },
    )


# Root endpoint
@app.get("/", description="Root endpoint for the API")
def read_root():
    return {"Hello": "World"}
