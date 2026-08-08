from datetime import timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user import StorageInfo
from app.services.notification_service import send_verification_email
from app.services.user_service import get_storage_info

from ..core.auth import create_access_token, hash_password, verify_password
from ..database.session import get_db
from ..dependencies import get_current_user
from ..models.refresh_token import RefreshToken
from ..models.user import User
from ..schemas.user import (ChangePasswordRequest, UserCreate,
                            UserLookupResponse, UserResponse,
                            UserUpdateRequest)

router = APIRouter(prefix="/users", tags=["Users"])
from app.schemas.user import (ForgotPasswordRequest, ResendVerificationRequest,
                              ResetPasswordRequest)
from app.services.email_verification_service import verify_email_service
from app.services.forgot_password_service import forgot_password_service
from app.services.resend_verification_service import \
    resend_verification_service
from app.services.reset_password_service import reset_password_service

from ..utils.tokens import generate_hashed_token, verification_token_expiry


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    verification_token, verification_token_hash = generate_hashed_token()
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        is_verified=False,
        verification_token_hash=verification_token_hash,
        verification_token_expires_at=verification_token_expiry(),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # # Temporary: print verification link until SMTP is added
    # print(
    #     f"\nEmail verification link:\n"
    #     f"http://localhost:8000/users/verify-email?token={verification_token}\n"
    # )

    send_verification_email(
        new_user.email,
        verification_token,
    )

    return new_user


@router.get("/verify-email")
def verify_email(
    token: str,
    db: Session = Depends(get_db),
):
    return verify_email_service(db, token)


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    request: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.name = request.name

    db.commit()
    db.refresh(current_user)

    return current_user


@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(request.current_password, current_user.password):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect.",
        )

    current_user.password = hash_password(request.new_password)

    # Revoke every refresh token so other sessions must re-authenticate
    # with the new password.
    db.query(RefreshToken).filter(
        RefreshToken.user_id == current_user.id,
        RefreshToken.revoked == False,  # noqa: E712
    ).update(
        {"revoked": True},
        synchronize_session=False,
    )

    db.commit()

    return {"message": "Password updated. Please log in again."}


@router.get(
    "/storage",
    response_model=StorageInfo,
)
def get_storage(
    current_user: User = Depends(get_current_user),
):
    return get_storage_info(current_user)


@router.get("/lookup", response_model=UserLookupResponse)
def lookup_user(
    email: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Look up another user's id by email, for use in the Share dialog.
    Requires authentication so this can't be used for open enumeration.
    """
    user = db.query(User).filter(User.email == email.lower()).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="No ClassHub user found with that email.",
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You can't share a file with yourself.",
        )

    return user


@router.post("/resend-verification")
def resend_verification(
    request: ResendVerificationRequest,
    db: Session = Depends(get_db),
):
    return resend_verification_service(
        db,
        request.email,
    )


@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    return forgot_password_service(
        db,
        request.email,
    )


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    return reset_password_service(
        db,
        request.token,
        request.new_password,
    )
