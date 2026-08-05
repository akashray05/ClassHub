from sqlalchemy import BigInteger, Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, nullable=False, index=True)

    password = Column(String(255), nullable=False)

    is_admin = Column(Boolean, default=False)

    is_active = Column(Boolean, default=True)

    is_verified = Column(
        Boolean,
        nullable=False,
        default=False,
    )
    verification_token_hash = Column(
        String(255),
        nullable=True,
    )

    verification_token_expires_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    password_reset_token_hash = Column(
        String(255),
        nullable=True,
    )

    password_reset_token_expires_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    verification_token_hash = Column(
        String(255),
        nullable=True,
    )

    verification_token_expires_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    storage_quota = Column(
        BigInteger,
        nullable=False,
        default=5 * 1024 * 1024 * 1024,  # 5 GB
    )

    storage_used = Column(
        BigInteger,
        nullable=False,
        default=0,
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    folders = relationship(
        "Folder", back_populates="owner", cascade="all, delete-orphan"
    )

    files = relationship(
        "File",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    refresh_tokens = relationship(
        "RefreshToken",
        back_populates="user",
        cascade="all, delete-orphan",
    )
