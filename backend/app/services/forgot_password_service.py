from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.tokens import (
    generate_secure_token,
    hash_token,
    verification_token_expiry,
)


def forgot_password_service(
    db: Session,
    email: str,
):
    """
    Always return the same response to avoid
    revealing whether an email exists.
    """

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user:
        token = generate_secure_token()

        user.password_reset_token_hash = hash_token(token)
        user.password_reset_token_expires_at = (
            verification_token_expiry()
        )

        db.commit()

        print(
            "\nPassword reset link:\n"
            f"http://localhost:8000/users/reset-password?token={token}\n"
        )

    return {
        "message": (
            "If an account with that email exists, "
            "a password reset link has been sent."
        )
    }
    