from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.services.notification_service import send_verification_email
from app.utils.tokens import generate_hashed_token, verification_token_expiry


def resend_verification_service(
    db: Session,
    email: str,
):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.is_verified:
        return {"message": "Email already verified"}

    token, token_hash = generate_hashed_token()

    user.verification_token_hash = token_hash
    user.verification_token_expires_at = verification_token_expiry()

    db.commit()

    # print(
    #     f"\nVerification link:\n"
    #     f"http://localhost:8000/users/verify-email?token={token}\n"
    # )

    send_verification_email(
        user.email,
        token,
    )

    return {"message": "Verification email sent"}
