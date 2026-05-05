from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "IronHaus Backend API"
    DEBUG: bool = False
    OPENAI_API_KEY: str # Required - Pydantic will validate this

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

settings = Settings()
