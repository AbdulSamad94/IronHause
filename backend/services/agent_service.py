from datetime import datetime
from typing import Optional, AsyncGenerator

from agents import Agent, Runner, SQLiteSession
from openai.types.responses import ResponseTextDeltaEvent

from core.ai import model, run_config, agent_settings
from tools import capture_lead, book_intro_session
from prompts import IRON_HAUSE_SYSTEM_PROMPT


def _instructions(ctx: object, agent: object) -> str:
    now = datetime.now()
    date_line = (
        f"IMPORTANT: The current date is {now.strftime('%A, %B %d, %Y')} "
        f"and the current time is {now.strftime('%I:%M %p')}. "
        f"Always use these values when answering date or time questions — "
        f"do not rely on any dates mentioned in conversation history.\n\n"
    )
    return date_line + IRON_HAUSE_SYSTEM_PROMPT


def _with_date(message: str) -> str:
    """Prepend live date to user message so it appears in the conversation context itself."""
    now = datetime.now()
    return (
        f"[Today is {now.strftime('%A, %B %d, %Y')} — time is {now.strftime('%I:%M %p')}]\n\n"
        f"{message}"
    )


iron_hause_agent = Agent(
    name="IronHause Assistant",
    instructions=_instructions,
    model=model,
    model_settings=agent_settings,
    tools=[capture_lead, book_intro_session],
)

SESSION_DB_PATH = "./data/sessions.db"


async def process_chat(message: str, session_id: Optional[str] = None) -> str:
    session = SQLiteSession(session_id, SESSION_DB_PATH) if session_id else None
    result = await Runner.run(
        iron_hause_agent, _with_date(message), run_config=run_config, session=session, max_turns=10
    )
    return result.final_output


async def stream_chat(
    message: str, session_id: Optional[str] = None
) -> AsyncGenerator[str, None]:
    """Yields text delta tokens as the agent generates its response."""
    session = SQLiteSession(session_id, SESSION_DB_PATH) if session_id else None
    result = Runner.run_streamed(
        iron_hause_agent, _with_date(message), run_config=run_config, session=session, max_turns=10
    )
    async for event in result.stream_events():
        if event.type == "raw_response_event" and isinstance(
            event.data, ResponseTextDeltaEvent
        ):
            yield event.data.delta
