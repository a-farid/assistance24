import os
import time
from fastapi import FastAPI
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

def register_middleware(app: FastAPI):
    
    # 1. High-Performance Operational Metric Interception Layer
    @app.middleware("http")
    async def custom_logging(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        processing_time = time.time() - start_time
        
        # Access client telemetry safely with fallbacks
        client_host = request.client.host if request.client else "unknown"
        client_port = request.client.port if request.client else "0"
        
        print(f"[{request.method}] {request.url.path} - Status: {response.status_code} | Telemetry Latency: {processing_time:.4f}s from {client_host}:{client_port}")
        return response

    # 2. Dynamic Domain Boundary Definitions
    origins = [
        "http://app.dev.local",
        "http://localhost",
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "http://app.dev.local") # Default to our domain configuration
    ]

    # 3. CORS Handshake Configuration Engine
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True, # Absolute prerequisite for credentialed browser cookie transit
        allow_methods=["*"],    # Permits full REST suite (GET, POST, PUT, DELETE, OPTIONS)
        allow_headers=["*"],    # Permits arbitrary request headers
    )

    # 4. TrustedHost Verification Layer
    # Architectural Adjustment: Strip ports completely to conform to standard host mapping specs
    hosts_only = ["localhost", "app.dev.local", "api.dev.local"]
    
    # Securely append production environment variables if they exist
    prod_frontend = os.getenv("FRONTEND_URL")
    if prod_frontend:
        # Extract purely the domain topology block, omitting schemas and trailing ports
        domain = prod_frontend.replace("http://", "").replace("https://", "").split(":")[0]
        hosts_only.append(domain)

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=hosts_only
    )