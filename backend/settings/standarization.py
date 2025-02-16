from typing import Generic, TypeVar, Optional
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from datetime import datetime, date
from uuid import UUID
from fastapi.encoders import jsonable_encoder

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T]


def serialize_data(data):
    """Recursively apply custom serialization to handle special types."""
    if isinstance(data, (datetime, date)):
        return data.strftime("%Y-%m-%d")
    if isinstance(data, UUID):
        return str(data)
    if isinstance(data, dict):
        return {key: serialize_data(value) for key, value in data.items()}
    if isinstance(data, list):
        return [serialize_data(item) for item in data]
    return data


def json_response(data=None, status_code=200, message="Request passed succesfully", count=None, page=None, skip=None, limit=None):
    """
    Standardized JSON response with optional pagination details.

    Args:
        data (optional): The response data (can be a list, dict, or any serializable type).
        status_code (int): HTTP status code for the response.
        message (str, optional): A short description of the response. Defaults to "Success".
        count (int, optional): The total number of items (useful for pagination). Defaults to None.
        page (int, optional): The current page number (useful for pagination). Defaults to None.
        skip (int, optional): The number of items to skip (useful for pagination). Defaults to None.
        limit (int, optional): The maximum number of items to return (useful for pagination). Defaults to None.

    Returns:
        JSONResponse: A FastAPI JSON response with a consistent structure.
    """

    serialized_data = serialize_data(data)

    response_content = {"success": True, "message": message}

    # Add optional pagination details only if provided
    if count is not None:
        response_content["count"] = count
    if page is not None:
        response_content["page"] = page
    if skip is not None:
        response_content["skip"] = skip
    if limit is not None:
        response_content["limit"] = limit
    if data is not None:
        response_content["data"] = jsonable_encoder(serialized_data)

    return JSONResponse(content=response_content, status_code=status_code)
