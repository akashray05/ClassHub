from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..models.user import User
from ..models.refresh_token import RefreshToken
from ..schemas.user import Token
from ..core.auth import (
    verify_password,
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
)
from ..core.config import settings

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {"sub": db_user.email}
    )


    access_token = create_access_token(
        {"sub": db_user.email}
    )

    # Revoke previous refresh tokens
    db.query(RefreshToken).filter(
        RefreshToken.user_id == db_user.id,
        RefreshToken.revoked == False,
    ).update(
        {"revoked": True},
        synchronize_session=False,
    )

    # Generate a new refresh token
    refresh_token = create_refresh_token()

    # Store hashed token



    # Generate refresh token
    # refresh_token = create_refresh_token()

    # Store hashed refresh token
    db_refresh_token = RefreshToken(
        user_id=db_user.id,
        token_hash=hash_refresh_token(refresh_token),
        expires_at=datetime.now(timezone.utc)
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )

    db.add(db_refresh_token)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

