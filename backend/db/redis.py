import os
import redis.asyncio as aioredis
import json
from typing import Type, TypeVar, Optional
from pydantic import BaseModel
from settings import Config

# Determine environment
ENV = os.getenv("ENV", "development")

if ENV == "production":
    rd_async = aioredis.Redis(
        host=Config.REDIS_HOST,
        port=Config.REDIS_PORT,
        password=Config.REDIS_PASSWORD,
        ssl=True,
        ssl_cert_reqs=None,
    )
else:
    rd_async = aioredis.Redis(
        host="localhost",
        port=6379,
        password=None,
        ssl=False
    )

T = TypeVar("T", bound=BaseModel)

async def redis_set(key: str, value: BaseModel, expire: int = 3600*12) -> None:
    """Store a Pydantic model in Redis as JSON."""
    await rd_async.set(
        str(key),
        json.dumps(value.model_dump(), default=str),
        ex=expire
    )
    print("redis_set success:", key)

async def redis_get(key: str, model: Type[T]) -> Optional[T]:
    """Retrieve a JSON object from Redis and convert it back to a Pydantic model."""
    data = await rd_async.get(key)

    if data:
        print("redis_get success:", key)
        return model(**json.loads(data.decode("utf-8")))

    print("redis_get key not found:", key)
    return None

async def redis_delete(key: str) -> None:
    """Delete a key from Redis."""
    await rd_async.delete(str(key))

async def close_redis():
    """Close Redis connection when the app shuts down."""
    await rd_async.close()
