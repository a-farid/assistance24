from typing import Generic, TypeVar, Optional
from pydantic import BaseModel
T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    Success: bool
    data: Optional[T]

