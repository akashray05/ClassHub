from datetime import UTC, datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.auth import hash_password
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.utils.tokens import hash_token


def reset_password_service(
    db: Session,
    token: str,
    new_password: str,
):
    token_hash = hash_token(token)

    user = db.query(User).filter(User.password_reset_token_hash == token_hash).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid password reset token",
        )

    if (
        user.password_reset_token_expires_at
        and user.password_reset_token_expires_at < datetime.now(UTC)
    ):
        raise HTTPException(
            status_code=400,
            detail="Password reset token expired",
        )

    # Update password
    user.password = hash_password(new_password)

    # Clear reset token
    user.password_reset_token_hash = None
    user.password_reset_token_expires_at = None

    # Revoke every refresh token
    (
        db.query(RefreshToken)
        .filter(RefreshToken.user_id == user.id)
        .update(
            {"revoked": True},
            synchronize_session=False,
        )
    )

    db.commit()

    return {"message": "Password reset successful. Please log in again."}
