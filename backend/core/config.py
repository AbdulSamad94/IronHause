from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "IronHaus Backend API"
    DEBUG: bool = False
    OPENAI_API_KEY: str   # Required — OpenAI API key
    DATABASE_URL: str     # Required — Neon Postgres connection string
    API_AUTH_TOKEN: str   # Required — Shared secret between Next.js BFF and this backend
    RESEND_API_KEY: str = ""          # Optional — Resend API key for email notifications
    NOTIFICATION_EMAIL: str = ""      # Optional — Email address to receive lead/booking alerts

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

settings = Settings()
