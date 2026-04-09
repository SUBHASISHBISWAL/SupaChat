from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    """
    Application configuration settings.
    Automatically loads from environment variables or .env file.
    """
    # Environment
    ENVIRONMENT: str = "development"
    PORT: int = 4000
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost"]

    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str

    # Hugging Face Configuration
    HF_TOKEN: str
    HF_MODEL_ID: str = "Qwen/Qwen2.5-72B-Instruct"
    
    # Model configuration for validation and parsing
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

def get_settings() -> Settings:
    """
    Factory function to instantiate and return the application settings.
    Uses lru_cache in a real deployment, but kept simple here for standard initialization.
    """
    return Settings()
