from typing import Generic, Type, TypeVar, Optional
from pydantic import BaseModel # pyrefly: ignore [missing-import]
from fastapi.responses import JSONResponse # pyrefly: ignore [missing-import]
from datetime import datetime, date
from uuid import UUID
from fastapi.encoders import jsonable_encoder # pyrefly: ignore [missing-import]
from typing import Any, Dict
from fastapi import Query # pyrefly: ignore [missing-import]


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

async def format_paginated_response(result: Dict[str, Any], model: Type[BaseModel]):
    """Formats paginated response, converting the given data into a Pydantic model list."""
    items = result.get("data", [])

    formatted_items = []
    for item in items:
        item_dict = item.to_dict()
        formatted_items.append(model.model_validate(item_dict))

    return {
        "data": formatted_items,
        "total_records": result.get("total_records"),
        "total_pages": result.get("total_pages"),
        "current_page": result.get("current_page"),
        "limit": result.get("limit"),
    }


def pagination_params(page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    """Dependency to handle pagination parameters for all routes."""
    return {"page": page, "limit": limit}


def json_response(data=None, current_page=None, total_pages=None, total_records=None, limit=None, status_code=200, message=None):
    """
    Standardized JSON response with optional pagination details.

    Args:
        data (optional): The response data (can be a list, dict, or any serializable type).
        status_code (int): HTTP status code for the response.
        message (str, optional): A short description of the response.
        current_page (int, optional): The current page number.
        total_pages (int, optional): The total number of pages.
        total_records (int, optional): The total number of records.
        limit (int, optional): The maximum number of items returned.

    Returns:
        JSONResponse: A FastAPI JSON response with a consistent structure.
    """

    serialized_data = serialize_data(data)

    response_content = {"success": True}

    if message is not None:
        response_content["message"] = message
    if current_page is not None:
        response_content["current_page"] = current_page
    if total_pages is not None:
        response_content["total_pages"] = total_pages
    if total_records is not None:
        response_content["total_records"] = total_records
    if limit is not None:
        response_content["limit"] = limit
    if data is not None:
        response_content["data"] = jsonable_encoder(serialized_data)

    return JSONResponse(content=response_content, status_code=status_code)
