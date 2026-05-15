"""
Intro session booking function tool.

Persists a booking request to Neon Postgres with a 'pending' status.
The IronHause team is then expected to confirm the exact time slot.
"""
import logging
from typing import Annotated

import psycopg
from agents import function_tool

from core.database import get_db_url

logger = logging.getLogger(__name__)

_INSERT_BOOKING = """
    INSERT INTO bookings (preferred_date, notes, status)
    VALUES (%(preferred_date)s, %(notes)s, %(status)s)
    RETURNING id
"""


@function_tool
async def book_intro_session(
    preferred_date: Annotated[
        str, "The preferred date or time slot, e.g. 'Monday morning' or '2025-05-10'"
    ],
    notes: Annotated[str, "Any additional notes or preferences from the prospect"] = "",
) -> str:
    """
    Books an intro session for a prospect. Call this only when the user
    explicitly asks to book, schedule, or reserve a session with IronHause.
    """
    try:
        async with await psycopg.AsyncConnection.connect(get_db_url()) as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    _INSERT_BOOKING,
                    {
                        "preferred_date": preferred_date,
                        "notes": notes,
                        "status": "pending",
                    },
                )
                result = await cur.fetchone()
                await conn.commit()

        booking_id = result[0] if result else None
        logger.info("Booking created: id=%s date=%s", booking_id, preferred_date)
        return (
            f"Booking confirmed! Your intro session request for '{preferred_date}' "
            f"has been received (Booking #{booking_id}). Our team will reach out to confirm the time."
        )

    except Exception:
        logger.exception("Failed to create booking")
        return "I had trouble booking that session. Please contact us directly and we'll get you sorted."
