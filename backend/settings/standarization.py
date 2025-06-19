from typing import Generic, Type, TypeVar, Optional
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from datetime import datetime, date
from uuid import UUID
from fastapi.encoders import jsonable_encoder
from typing import Any, Dict, Union

from schemas.user_schemas import T_Client, T_User, T_Worker


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

async def get_user_model(data: Union[T_Worker, T_Client]) -> dict:
    """Fetch and return worker and client as T_Profile."""
    result = {}
    if data.user:
        # user_dict = data.user.to_dict() # Before types verification
        user_dict = data.user.model_dump()
        result["user"] = T_User(**user_dict)
    return result

async def format_paginated_response(result: Dict[str, Any], model: Type[BaseModel], nested_user: bool = False):
    """Formats paginated response, converting the given data into a Pydantic model list."""
    items = result.get("data", [])

    # Convert SQLAlchemy objects to dictionaries if necessary
    formatted_items = []
    for item in items:
            item_dict = item.to_dict()

            # If the item has a user and we need to nest it, handle it here
            if nested_user:
                item_dict = await get_user_model(item)  # Await the result of get_user_model

            # Convert the cleaned-up dictionary to the Pydantic model
            formatted_items.append(model.model_validate(item_dict))

    return {
        "data": formatted_items,
        "total_records": result.get("total_records"),
        "total_pages": result.get("total_pages"),
        "current_page": result.get("current_page"),
        "limit": result.get("limit"),
    }


from fastapi import Query

def pagination_params(page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    """Dependency to handle pagination parameters for all routes."""
    return {"page": page, "limit": limit}



def json_response(data=None,  current_page=None, total_pages=None, total_records=None, limit=None,status_code=200, message=None):
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

    response_content = {"success": True}

    # Add optional pagination details only if provided
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
