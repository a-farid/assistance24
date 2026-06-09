from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Redis Infrastructure
    REDIS_URL: str  # Updated to match our streamlined single connection string pattern

    # Mail Communications
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_FROM_NAME: str
    MAIL_FROM: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    # Cryptography & Core Authentication
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    SEKRET_KEY_ADMIN: str
    APP_URL: str
    FRONTEND_URL: str
    EMAIL_VERIFICATION_SECRET: str

    # REMOVED: env_file references to enforce environment-agnostic execution
    model_config = SettingsConfigDict(
        env_file_encoding="utf-8", 
        extra="ignore"
    )

# Instantiate the configuration mapping
Config = Settings()