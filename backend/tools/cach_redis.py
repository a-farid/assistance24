import redis
import json
from typing import Type, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

rd = redis.Redis(
  host='literate-mallard-10581.upstash.io',
  port=6379,
  password='ASlVAAIjcDE0YjQwMWM2NDJmOGM0ZmQ3OWE4MjNiYmYxM2RmMjVkMXAxMA',
  ssl=True
)


def redis_set(key: str, value: BaseModel, expire: int = 3600*12) -> None:
    """Store a Pydantic model in Redis as JSON.

    Args:
        key (str): The key to store the JSON object under.
        value (BaseModel): The Pydantic model to store.
        expire (int, optional): The time in seconds until the key expires. Defaults to 3600.
    """
    if isinstance(value, BaseModel):
        rd.set(str(key), json.dumps(value.model_dump()), ex=expire)
    else:
        rd.set(str(key), value, ex=expire)


def redis_get(key: str, model: Type[T]) -> Optional[T]:
    """Retrieve a JSON object from Redis and convert it back to a Pydantic model."""
    data = rd.get(key)
    if data:
        print("data in redis_get", data)
        return model(**json.loads(data.decode("utf-8")))
    return None  # Key not found

def redis_delete(key: str) -> None:
    """Delete a key from Redis."""
    rd.delete(str(key))