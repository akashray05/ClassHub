from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..dependencies import get_current_user
from ..database import SessionLocal
from ..models.user import User
from ..schemas import UserCreate, UserResponse
from ..core.auth import hash_password
from fastapi.security import OAuth2PasswordRequestForm
from ..core.auth import (
    hash_password,
    verify_password,
    create_access_token
)
from datetime import datetime, timedelta, timezone

from backend.app.models.refresh_token import RefreshToken
from backend.app.core.auth import (
    create_refresh_token,
    hash_refresh_token,
)
from backend.app.core.config import settings
from ..schemas.user import (
    UserCreate,
    UserResponse,
    LoginRequest,
    Token
)
from backend.app.schemas.user import StorageInfo
from backend.app.services.user_service import get_storage_info

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    print("=== REGISTER REQUEST RECEIVED ===")
    print(user)

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    print("Existing user:", existing_user)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    print("Adding user to database...")

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    print("User created:", new_user.id)

    return new_user


# @router.post("/login", response_model=Token)
# def login(
#     form_data: OAuth2PasswordRequestForm = Depends(),
#     db: Session = Depends(get_db),
# ):

#     db_user = db.query(User).filter(
#         User.email == form_data.username
#     ).first()

#     if not db_user:
#         raise HTTPException(
#             status_code=401,
#             detail="Invalid email or password"
#         )

#     if not verify_password(
#         form_data.password,
#         db_user.password
#     ):
#         raise HTTPException(
#             status_code=401,
#             detail="Invalid email or password"
#         )

#     access_token = create_access_token(
#         {"sub": db_user.email}
#     )


#     access_token = create_access_token(
#         {"sub": db_user.email}
#     )

#     # Revoke previous refresh tokens
#     db.query(RefreshToken).filter(
#         RefreshToken.user_id == db_user.id,
#         RefreshToken.revoked == False,
#     ).update(
#         {"revoked": True},
#         synchronize_session=False,
#     )

#     # Generate a new refresh token
#     refresh_token = create_refresh_token()

#     # Store hashed token



#     # Generate refresh token
#     # refresh_token = create_refresh_token()

#     # Store hashed refresh token
#     db_refresh_token = RefreshToken(
#         user_id=db_user.id,
#         token_hash=hash_refresh_token(refresh_token),
#         expires_at=datetime.now(timezone.utc)
#         + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
#     )

#     db.add(db_refresh_token)
#     db.commit()

#     return {
#         "access_token": access_token,
#         "refresh_token": refresh_token,
#         "token_type": "bearer",
#     }


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