from openai import AsyncOpenAI
from agents import OpenAIResponsesModel, RunConfig, ModelSettings
from core.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
model = OpenAIResponsesModel(openai_client=client, model="gpt-4o-mini")
run_config = RunConfig(
    model=model,
    model_provider=client,
    tracing_disabled=True,
)

# Low temperature = less creative drift, fewer hallucinations for a sales/support agent
agent_settings = ModelSettings(temperature=0.3)
