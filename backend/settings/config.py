import os

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    APP_URL: str = os.getenv("APP_URL", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "")
    COOKIE_DOMAIN: str = os.getenv("COOKIE_DOMAIN", ".dev.local")
    COOKIE_SECURE: bool = ENVIRONMENT.lower() == "production"

    # Redis Infrastructure
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

    # Mail Communications
    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD", "")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", "587"))
    MAIL_SERVER: str = os.getenv("MAIL_SERVER", "")
    MAIL_FROM_NAME: str = os.getenv("MAIL_FROM_NAME", "")
    MAIL_FROM: str = os.getenv("MAIL_FROM", "")
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    # Cryptography & Core Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    SEKRET_KEY_ADMIN: str = os.getenv("SEKRET_KEY_ADMIN", "")

    EMAIL_VERIFICATION_SECRET: str = os.getenv("EMAIL_VERIFICATION_SECRET", "")

    # REMOVED: env_file references to enforce environment-agnostic execution
    model_config = SettingsConfigDict(
        env_file_encoding="utf-8", 
        extra="ignore"
    )

# Instantiate the configuration mapping
Config = Settings()