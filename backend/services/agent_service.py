from agents import Agent, Runner, SQLiteSession
from core.ai import model, run_config
from tools import capture_lead, book_intro_session
from prompts import IRON_HAUSE_SYSTEM_PROMPT
from typing import Optional

iron_hause_agent = Agent(
    name="IronHause Assistant",
    instructions=IRON_HAUSE_SYSTEM_PROMPT,
    model=model,
    tools=[capture_lead, book_intro_session],
)

SESSION_DB_PATH = "./data/sessions.db"


async def process_chat(message: str, session_id: Optional[str] = None) -> str:
    """
    Processes a chat message through the AI agent.
    Uses SQLiteSession for persistent conversation history when a session_id is provided.
    """
    session = SQLiteSession(session_id, db_path=SESSION_DB_PATH) if session_id else None

    result = await Runner.run(
        iron_hause_agent, message, run_config=run_config, session=session, max_turns=10
    )
    return result.final_output
