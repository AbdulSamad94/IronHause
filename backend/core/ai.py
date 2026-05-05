from openai import AsyncOpenAI
from agents import OpenAIResponsesModel, RunConfig
from core.config import settings

# Validation is now handled by Pydantic during settings initialization

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
model = OpenAIResponsesModel(openai_client=client, model="gpt-4o-mini")
run_config = RunConfig(model=model, model_provider=client, tracing_disabled=True)
