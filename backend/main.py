import traceback
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from routers import users, pointers, auth
from tools.Bd_BaseModel import check_db

app = FastAPI()

@app.on_event("startup")
def startup_event(): check_db()

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
            "exception": error_location,
            "path": request.url.path,
        })

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


# Custom handler for Pydantic validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Extracting the first validation error
    error_details = exc.errors()[0] if exc.errors() else {}

    return JSONResponse(
        status_code=422,  # Validation errors usually return 422
        content={
            "detail": error_details.get("msg", "Validation error"),
            "status_code": 422,
            "exception": error_details.get("loc", "Unknown location"),
            "path": request.url.path,
        },
    )
# Root endpoint
@app.get("/", description="Root endpoint for the API")
def read_root():
    return {"Hello": "World"}

