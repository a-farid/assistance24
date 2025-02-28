from fastapi import FastAPI
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import time
import logging

logger = logging.getLogger("uvicorn.access")
logger.disabled = True


def register_middleware(app: FastAPI):
    @app.middleware("http")
    async def custom_logging(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        processing_time = time.time() - start_time
        print(f"{request.client.host}:{request.client.port} - {request.method} - {request.url.path} - {response.status_code} completed after {processing_time}s")
        return response

    origins = [
        "http://localhost:3000",  # Frontend (React, Next.js, etc.)
        "http://127.0.0.1:3000",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,  # Allow specific frontend origins
        allow_credentials=True,  # Allow sending cookies
        allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE)
        allow_headers=["*"],  # Allow all headers
    )

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1", "bookly-api-dc03.onrender.com", "0.0.0.0"],
    )




# def register_middleware(app: FastAPI):

#     @app.middleware("http")
#     async def custom_logging(request: Request, call_next):
#         start_time = time.time()

#         response = await call_next(request)
#         processing_time = time.time() - start_time

#         message = f"{request.client.host}:{request.client.port} - {request.method} - {request.url.path} - {response.status_code} completed after {processing_time}s"

#         print(message)
#         return response

#     app.add_middleware(
#         CORSMiddleware,
#         allow_origins=["*"],
#         allow_methods=["*"],
#         allow_headers=["*"],
#         allow_credentials=True,
#     )

#     app.add_middleware(
#         TrustedHostMiddleware,
#         allowed_hosts=["localhost", "127.0.0.1" ,"bookly-api-dc03.onrender.com","0.0.0.0"],
#     )