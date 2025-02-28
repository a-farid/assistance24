import traceback
from typing import Any, Callable
from fastapi import FastAPI, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError


class GlobalException(Exception):
    """Base class for all custom application errors."""
    pass


class InvalidToken(GlobalException):
    """User has provided an invalid or expired token."""
    pass


class RevokedToken(GlobalException):
    """User has provided a revoked token."""
    pass


class AccessTokenRequired(GlobalException):
    """Access token is required but a refresh token was provided."""
    pass


class RefreshTokenRequired(GlobalException):
    """Refresh token is required but an access token was provided."""
    pass


class UserAlreadyExists(GlobalException):
    """Email already exists during sign-up."""
    pass


class InvalidCredentials(GlobalException):
    """Invalid email or password during login."""
    pass


class InsufficientPermission(GlobalException):
    """User lacks required permissions."""
    pass


class BookNotFound(GlobalException):
    """Book not found."""
    pass


class TagNotFound(GlobalException):
    """Tag not found."""
    pass


class TagAlreadyExists(GlobalException):
    """Tag already exists."""
    pass


class UserNotFound(GlobalException):
    """User not found."""
    pass


class AccountNotVerified(GlobalException):
    """User account is not verified."""
    pass


def create_exception_handler(status_code: int, message: str, error_code: str) -> Callable:
    """Creates a standardized exception handler for specific error types."""

    async def exception_handler(request: Request, exc: GlobalException):
        return JSONResponse(
            status_code=status_code,
            content={
                "success": False,
                "message": message,
                "error_code": error_code,
                "info": str(exc),
            },
        )

    return exception_handler


def register_all_errors(app: FastAPI):
    """Registers all custom exception handlers to the FastAPI app."""

    error_mappings = [
        (UserAlreadyExists, 403, "User with email already exists", "user_exists"),
        (UserNotFound, 404, "User not found", "user_not_found"),
        (BookNotFound, 404, "Book not found", "book_not_found"),
        (InvalidCredentials, 400, "Invalid Email or Password", "invalid_credentials"),
        (InvalidToken, 401, "Token is invalid or expired", "invalid_token"),
        (RevokedToken, 401, "Token has been revoked", "revoked_token"),
        (AccessTokenRequired, 401, "Access token required", "access_token_required"),
        (RefreshTokenRequired, 403, "Refresh token required", "refresh_token_required"),
        (InsufficientPermission, 401, "Insufficient permissions", "insufficient_permissions"),
        (TagNotFound, 404, "Tag not found", "tag_not_found"),
        (TagAlreadyExists, 403, "Tag already exists", "tag_exists"),
        (AccountNotVerified, 403, "Account not verified", "account_not_verified"),
    ]

    for exc_class, status_code, message, error_code in error_mappings:
        app.add_exception_handler(exc_class, create_exception_handler(status_code, message, error_code))

    @app.exception_handler(SQLAlchemyError)
    async def database_error_handler(request: Request, exc: SQLAlchemyError):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": f"A database error: {str(exc)}",
                "error_code": "database_error",
                "info": str(exc),
            },
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        error_location = traceback.format_exc().splitlines()[-2] if traceback.format_exc().splitlines() else "No traceback"
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail,
                "status_code": exc.status_code,
                "error_code": "http_exception",
                "info": str(exc.detail),
                "path": request.url.path,
                "exception": error_location,
            },
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "An unexpected error occurred",
                "error_code": "unexpected_error",
                "info": str(exc),
                "path": request.url.path,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        error_details = exc.errors()[0] if exc.errors() else {}
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "message": "Validation error",
                "error_code": "validation_error",
                "info": error_details.get("msg", "Invalid input"),
                "path": request.url.path,
            },
        )
