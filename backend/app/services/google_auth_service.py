import secrets
from datetime import UTC, datetime, timedelta

import httpx
from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..core.auth import create_access_token, create_refresh_token, hash_password, hash_refresh_token
from ..core.config import settings
from ..models.refresh_token import RefreshToken
from ..models.user import User

GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo"


def _verify_google_id_token(id_token: str) -> dict:
    """
    Verify a Google ID token by asking Google directly.

    This avoids any new third-party dependency (uses the httpx client
    already in requirements.txt) while still fully validating the
    token's signature, audience, and expiry server-side via Google.
    """
    try:
        response = httpx.get(
            GOOGLE_TOKENINFO_URL,
            params={"id_token": id_token},
            timeout=10.0,
        )
    except httpx.HTTPError:
        raise HTTPException(
            status_code=503,
            detail="Could not reach Google to verify this sign-in. Please try again.",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Google sign-in token.",
        )

    payload = response.json()

    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=500,
            detail="Google sign-in is not configured on this server.",
        )

    if payload.get("aud") != settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=401,
            detail="This sign-in token was not issued for this application.",
        )

    if payload.get("email_verified") not in ("true", True):
        raise HTTPException(
            status_code=401,
            detail="Your Google email address is not verified.",
        )

    email = payload.get("email", "")

    if not email.lower().endswith("@gmail.com"):
        raise HTTPException(
            status_code=403,
            detail="ClassHub only accepts sign-in with a genuine @gmail.com account.",
        )

    return payload


def google_login_service(db: Session, id_token: str):
    payload = _verify_google_id_token(id_token)

    email = payload["email"].lower()
    name = payload.get("name") or email.split("@")[0]

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        # New account, provisioned from a verified Google identity.
        # A random unusable password is stored to satisfy the existing
        # NOT NULL constraint; this account can only be accessed via
        # Google sign-in unless the user later sets a password.
        random_password = secrets.token_urlsafe(32)

        user = User(
            name=name,
            email=email,
            password=hash_password(random_password),
            is_verified=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.is_verified:
        # Google has already verified this email address, so trust it.
        user.is_verified = True
        db.commit()

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="This account has been deactivated.",
        )

    access_token = create_access_token({"sub": user.email})

    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.revoked == False,  # noqa: E712
    ).update(
        {"revoked": True},
        synchronize_session=False,
    )

    refresh_token = create_refresh_token()

    db_refresh_token = RefreshToken(
        user_id=user.id,
        token_hash=hash_refresh_token(refresh_token),
        expires_at=datetime.now(UTC)
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )

    db.add(db_refresh_token)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }
