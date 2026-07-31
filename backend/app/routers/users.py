from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..dependencies import get_current_user
from ..models.user import User
from ..schemas.user import UserCreate, UserResponse
from ..core.auth import hash_password
from ..core.auth import (
    hash_password,
    create_access_token
)

from ..database.session import get_db
from datetime import timedelta, timezone


from ..schemas.user import (
    UserCreate,
    UserResponse,
)
from app.schemas.user import StorageInfo
from app.services.user_service import get_storage_info

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
from app.services.email_verification_service import verify_email_service
from ..utils.tokens import (
    generate_secure_token,
    hash_token,
    verification_token_expiry,
)


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    verification_token = generate_secure_token()

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        is_verified=False,
        verification_token_hash=hash_token(verification_token),
        verification_token_expires_at=verification_token_expiry(),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Temporary: print verification link until SMTP is added
    print(
        f"\nEmail verification link:\n"
        f"http://localhost:8000/users/verify-email?token={verification_token}\n"
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

@router.get(
    "/storage",
    response_model=StorageInfo,
)
def get_storage(
    current_user: User = Depends(get_current_user),
):
    return get_storage_info(current_user)