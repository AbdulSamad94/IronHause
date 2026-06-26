import re
import logging
import json
from agents import tool_input_guardrail, ToolGuardrailFunctionOutput

logger = logging.getLogger(__name__)


def is_valid_email(email: str) -> bool:
    pattern = r"^[\w.+\-]+@[\w.-]+\.\w+$"
    return re.match(pattern, email) is not None


def is_valid_phone(phone: str) -> bool:
    # Allow +, digits, spaces, dashes, parentheses — minimum 7 digits
    digits = re.sub(r"\D", "", phone)
    return len(digits) >= 7 and bool(re.match(r"^[\+\d][\d\s\-\(\)\.]{5,}$", phone.strip()))


@tool_input_guardrail
def validate_lead_data(data):
    """
    Validates lead capture data before the tool is executed.
    Requires valid name, email, and phone number.
    """
    try:
        args = json.loads(data.context.tool_arguments or "{}")
    except json.JSONDecodeError:
        logger.warning("Failed to parse tool_arguments JSON in guardrail")
        args = {}

    name  = str(args.get("name", "")).strip()
    email = str(args.get("email", "")).strip()
    phone = str(args.get("phone", "")).strip()

    if len(name) < 2:
        return ToolGuardrailFunctionOutput.reject_content(
            "The name provided is too short. Please ask the user for their full name."
        )

    if not is_valid_email(email):
        return ToolGuardrailFunctionOutput.reject_content(
            f"The email '{email}' appears invalid. Please ask the user to provide a correct email address."
        )

    if not phone:
        return ToolGuardrailFunctionOutput.reject_content(
            "Phone number is missing. Please ask the user for their phone number before proceeding."
        )

    if not is_valid_phone(phone):
        return ToolGuardrailFunctionOutput.reject_content(
            f"The phone number '{phone}' doesn't look valid. Please ask the user to provide a valid phone number."
        )

    return ToolGuardrailFunctionOutput.allow()
