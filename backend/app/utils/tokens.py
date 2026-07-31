import hashlib
import secrets
from datetime import datetime, timedelta, timezone


def generate_secure_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure URL-safe token.
    """
    return secrets.token_urlsafe(length)


def hash_token(token: str) -> str:
    """
    Return SHA-256 hash of a token.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def verification_token_expiry(hours: int = 24) -> datetime:
    """
    Verification links expire after 24 hours by default.
    """
    return datetime.now(timezone.utc) + timedelta(hours=hours)

def generate_hashed_token():
    """
    Generate a secure token and its SHA-256 hash.

    Returns:
        tuple[str, str]: (raw_token, token_hash)
    """
    raw_token = generate_secure_token()
    token_hash = hash_token(raw_token)

    return raw_token, token_hash