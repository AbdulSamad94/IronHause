"""
Intro session booking function tool.

Persists a booking request to Neon Postgres with a 'pending' status.
Requires name and email so the booking is always linked to a lead record.
Sends one combined notification email (contact + booking details).
"""
import logging
from typing import Annotated

import psycopg
from agents import function_tool

from core.database import get_db_url
from services.email_service import notify_new_booking
from .guardrails import validate_lead_data

logger = logging.getLogger(__name__)

_FIND_LEAD = "SELECT id FROM leads WHERE email = %(email)s LIMIT 1"

_INSERT_LEAD = """
    INSERT INTO leads (name, email, phone, message, source)
    VALUES (%(name)s, %(email)s, %(phone)s, %(message)s, %(source)s)
    RETURNING id
"""

_INSERT_BOOKING = """
    INSERT INTO bookings (lead_id, preferred_date, notes, status)
    VALUES (%(lead_id)s, %(preferred_date)s, %(notes)s, %(status)s)
    RETURNING id
"""


@function_tool(tool_input_guardrails=[validate_lead_data])
async def book_intro_session(
    name: Annotated[str, "The full name of the prospect"],
    email: Annotated[str, "The email address of the prospect"],
    preferred_date: Annotated[
        str, "The preferred date/time in plain English, e.g. 'Saturday morning' or 'tomorrow at 7am'. Do NOT use ISO format or timestamps."
    ],
    phone: Annotated[str, "The prospect's phone number — required before calling this tool"],
    notes: Annotated[str, "Any additional notes or preferences from the prospect"] = "",
) -> str:
    """
    Books an intro session for a prospect. Call this only when the user
    explicitly asks to book, schedule, or reserve a session with IronHause
    AND you have collected their name and email address.
    """
    try:
        async with await psycopg.AsyncConnection.connect(get_db_url()) as conn:
            async with conn.cursor() as cur:
                # Find existing lead or create one so booking always has a lead_id
                await cur.execute(_FIND_LEAD, {"email": email})
                row = await cur.fetchone()
                if row:
                    lead_id = row[0]
                else:
                    await cur.execute(
                        _INSERT_LEAD,
                        {
                            "name": name,
                            "email": email,
                            "phone": phone or None,
                            "message": f"Booking request for {preferred_date}",
                            "source": "ai_agent",
                        },
                    )
                    lead_row = await cur.fetchone()
                    lead_id = lead_row[0] if lead_row else None

                await cur.execute(
                    _INSERT_BOOKING,
                    {
                        "lead_id": lead_id,
                        "preferred_date": preferred_date,
                        "notes": notes,
                        "status": "pending",
                    },
                )
                result = await cur.fetchone()
                await conn.commit()

        booking_id = result[0] if result else None
        logger.info(
            "Booking created: id=%s date=%s lead_id=%s",
            booking_id, preferred_date, lead_id,
        )

        # One combined email: contact info + booking details
        await notify_new_booking(name, email, phone, booking_id, preferred_date, notes)
        return (
            f"Booking confirmed! Your intro session request for '{preferred_date}' "
            f"has been received (Booking #{booking_id}). Our team will reach out to confirm the time."
        )

    except Exception:
        logger.exception("Failed to create booking")
        return "I had trouble booking that session. Please contact us directly and we'll get you sorted."
