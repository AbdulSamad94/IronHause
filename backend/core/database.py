"""
Shared database utilities.

Centralises connection-string retrieval so every tool imports from
one place — changing the source of the URL only requires updating
this module.
"""
from core.config import settings


def get_db_url() -> str:
    """Returns the validated Neon DATABASE_URL from application settings."""
    return settings.DATABASE_URL
