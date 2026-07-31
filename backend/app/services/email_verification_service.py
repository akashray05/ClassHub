from datetime import datetime, UTC

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.tokens import hash_token


def verify_email_service(db: Session, token: str):
    token_hash = hash_token(token)

    user = (
        db.query(User)
        .filter(User.verification_token_hash == token_hash)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid verification token",
        )

    if user.is_verified:
        return {
            "message": "Email already verified"
        }

    if (
        user.verification_token_expires_at
        and user.verification_token_expires_at < datetime.now(UTC)
    ):
        raise HTTPException(
            status_code=400,
            detail="Verification token expired",
        )

    user.is_verified = True
    user.verification_token_hash = None
    user.verification_token_expires_at = None

    db.commit()

    return {
        "message": "Email verified successfully"
    }