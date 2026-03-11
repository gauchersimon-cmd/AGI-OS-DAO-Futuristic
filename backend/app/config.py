from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # API Configuration
    debug: bool = True
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]

    # Ollama Configuration (Optional - for local AI)
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "mistral"

    # Database
    database_url: str = "sqlite:///./agi_os.db"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Celery
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/0"

    # Supabase
    supabase_url: str = ""
    supabase_api_key: str = ""

    # Agent Configuration
    max_agent_workers: int = 5
    agent_timeout: int = 300

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

