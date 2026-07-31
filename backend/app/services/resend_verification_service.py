from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.tokens import (
    generate_secure_token,
    hash_token,
    verification_token_expiry,
)


def resend_verification_service(
    db: Session,
    email: str,
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.is_verified:
        return {
            "message": "Email already verified"
        }

    token = generate_secure_token()

    user.verification_token_hash = hash_token(token)
    user.verification_token_expires_at = verification_token_expiry()

    db.commit()

    print(
        f"\nVerification link:\n"
        f"http://localhost:8000/users/verify-email?token={token}\n"
    )

    return {
        "message": "Verification email sent"
    }