from agents import Agent, Runner
from core.ai import model, run_config

iron_hause_agent = Agent(
    name="IronHause Assistant",
    instructions="""
    You are the IronHause AI Assistant. Your goal is to help gym owners automate their facility operations.
    You are professional, efficient, and forward-thinking.
    You can answer questions about:
    - Lead capture automation
    - 24/7 client support
    - Booking automation
    - Member onboarding
    
    Keep your responses concise and helpful.
    """,
    model=model,
)

async def process_chat(message: str) -> str:
    """Processes a chat message through the AI agent."""
    result = await Runner.run(
        iron_hause_agent, message, run_config=run_config
    )
    return result.final_output
