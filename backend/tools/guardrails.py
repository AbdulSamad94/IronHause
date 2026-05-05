import re
import logging
import json
from agents import tool_input_guardrail, ToolGuardrailFunctionOutput

logger = logging.getLogger(__name__)

def is_valid_email(email: str) -> bool:
    """Simple regex for basic email validation."""
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(pattern, email) is not None

@tool_input_guardrail
def validate_lead_data(data):
    """
    Validates lead capture data before the tool is executed.
    Checks for a valid email format and minimum name length.
    """
    # Arguments are stored as a JSON string in context.tool_arguments
    args = json.loads(data.context.tool_arguments or "{}")
    name = args.get("name", "")
    email = args.get("email", "")

    if len(str(name)) < 2:
        return ToolGuardrailFunctionOutput.reject_content(
            "The name provided is too short. Please ask the user for their full name."
        )

    if not is_valid_email(str(email)):
        return ToolGuardrailFunctionOutput.reject_content(
            f"The email '{email}' appears invalid. Please ask the user to provide a correct email address."
        )

    return ToolGuardrailFunctionOutput.allow()
