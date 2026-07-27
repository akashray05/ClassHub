from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..core.auth import (
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
)
from ..core.config import settings
from ..models.refresh_token import RefreshToken
from ..models.user import User

def refresh_token_service(db: Session, refresh_token: str):

    hashed_token = hash_refresh_token(refresh_token)

    db_token = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token_hash == hashed_token,
            RefreshToken.revoked == False,
        )
        .first()
    )

    if not db_token:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    if db_token.expires_at <= datetime.utcnow():
        raise HTTPException(
            status_code=401,
            detail="Refresh token expired",
        )

    user = db.query(User).filter(
        User.id == db_token.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    # Revoke the old refresh token
    db_token.revoked = True

    # Create new access token
    access_token = create_access_token(
        {"sub": user.email}
    )

    # Create new refresh token
    new_refresh_token = create_refresh_token()

    new_db_token = RefreshToken(
        user_id=user.id,
        token_hash=hash_refresh_token(new_refresh_token),
        expires_at=datetime.utcnow()
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        revoked=False,
        device_name=db_token.device_name,
        ip_address=db_token.ip_address,
    )

    db.add(new_db_token)
    db.commit()
    db.refresh(new_db_token)

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }

def logout_all_service(db: Session, user: User):

    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.revoked == False,
    ).update(
        {"revoked": True},
        synchronize_session=False,
    )

    db.commit()

    return {
        "message": "Logged out from all devices successfully"
    }


def logout_service(db: Session, refresh_token: str):
    hashed_token = hash_refresh_token(refresh_token)

    db_token = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token_hash == hashed_token,
            RefreshToken.revoked == False,
        )
        .first()
    )

    if not db_token:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    db_token.revoked = True
    db.commit()

    return {
        "message": "Logged out successfully"
    }