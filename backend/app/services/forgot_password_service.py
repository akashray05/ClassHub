from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.tokens import (
    generate_hashed_token,
    verification_token_expiry,
)
from app.services.notification_service import (
    send_password_reset_email,
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
        token, token_hash = generate_hashed_token()

        user.password_reset_token_hash = token_hash
        user.password_reset_token_expires_at = (
            verification_token_expiry()
        )

        db.commit()

        # print(
        #     "\nPassword reset link:\n"
        #     f"http://localhost:8000/users/reset-password?token={token}\n"
        # )

        send_password_reset_email(
            user.email,
            token,
        )

    return {
        "message": (
            "If an account with that email exists, "
            "a password reset link has been sent."
        )
    }
