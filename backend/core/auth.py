"""
Authentication dependency for FastAPI routes.

Validates the X-API-Key header against the API_AUTH_TOKEN setting,
ensuring only the authorised Next.js BFF can call this backend.
"""
import secrets
import logging
from fastapi import Header, HTTPException, Security, status
from fastapi.security.api_key import APIKeyHeader
from core.config import settings

logger = logging.getLogger(__name__)

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def verify_api_key(x_api_key: str | None = Security(_api_key_header)) -> None:
    """
    FastAPI dependency that validates the X-API-Key header.
    Uses a timing-safe comparison to prevent timing attacks.
    """
    if not x_api_key or not secrets.compare_digest(
        x_api_key.encode(), settings.API_AUTH_TOKEN.encode()
    ):
        logger.warning("Rejected request with invalid or missing API key.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied.",
        )
