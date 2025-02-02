from typing import Generic, TypeVar, Optional
from pydantic.generics import GenericModel


T = TypeVar("T")

class StandardResponse(GenericModel, Generic[T]):
    Success: bool
    data: Optional[T]

