from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..core.auth import (create_access_token, create_refresh_token,
                         hash_refresh_token, verify_password)
from ..core.config import settings
from ..database.session import get_db
from ..dependencies import get_current_user
from ..models.refresh_token import RefreshToken
from ..models.user import User
from ..schemas.user import RefreshTokenRequest, Token
from ..services.auth_service import (logout_all_service, logout_service,
                                     refresh_token_service)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": db_user.email})

    # Revoke previous refresh tokens
    db.query(RefreshToken).filter(
        RefreshToken.user_id == db_user.id,
        RefreshToken.revoked == False,
    ).update(
        {"revoked": True},
        synchronize_session=False,
    )

    refresh_token = create_refresh_token()

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


@router.post("/refresh", response_model=Token)
def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    return refresh_token_service(
        db=db,
        refresh_token=request.refresh_token,
    )


@router.post("/logout")
def logout(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    return logout_service(
        db=db,
        refresh_token=request.refresh_token,
    )


@router.post("/logout-all")
def logout_all(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return logout_all_service(
        db=db,
        user=current_user,
    )
