"""
Lead capture function tool.

Persists a prospect's contact details to Neon Postgres.
The input guardrail validates name and email before the DB write.
"""
import logging
from typing import Annotated

import psycopg
from agents import function_tool

from core.database import get_db_url
from services.email_service import notify_new_lead
from .guardrails import validate_lead_data

logger = logging.getLogger(__name__)

_INSERT_LEAD = """
    INSERT INTO leads (name, email, message, source)
    VALUES (%(name)s, %(email)s, %(message)s, %(source)s)
    RETURNING id
"""


@function_tool(tool_input_guardrails=[validate_lead_data])
async def capture_lead(
    name: Annotated[str, "The full name of the gym owner or prospect"],
    email: Annotated[str, "The email address of the gym owner or prospect"],
    message: Annotated[str, "A brief summary of what the prospect is looking for"],
) -> str:
    """
    Saves a new lead to the database when a gym owner expresses interest
    in IronHause services. Call this only after collecting name, email,
    and a description of their needs.
    """
    try:
        async with await psycopg.AsyncConnection.connect(get_db_url()) as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    _INSERT_LEAD,
                    {"name": name, "email": email, "message": message, "source": "ai_agent"},
                )
                result = await cur.fetchone()
                await conn.commit()

        lead_id = result[0] if result else None
        logger.info("Lead captured: id=%s email=%s", lead_id, email)
        await notify_new_lead(name, email, message, lead_id)
        return f"Lead saved! We'll follow up with {name} at {email} shortly."

    except Exception:
        logger.exception("Failed to capture lead for %s", email)
        return "I encountered an issue saving your details. Please try again or contact us directly."
