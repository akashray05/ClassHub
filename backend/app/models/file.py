

from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    BigInteger,
    Boolean,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database.base import Base


class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)

    # Original filename uploaded by the user
    original_name = Column(String(255), nullable=False)

    # Filename stored on disk
    stored_name = Column(String(255), nullable=False, unique=True)

    # uploads/user_1/folder_2/file.pdf
    file_path = Column(String, nullable=False)

    mime_type = Column(String(100), nullable=False)

    file_size = Column(BigInteger, nullable=False)

    owner_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    folder_id = Column(
        Integer,
        ForeignKey("folders.id", ondelete="CASCADE"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    owner = relationship(
        "User",
        back_populates="files",
    )

    folder = relationship(
        "Folder",
        back_populates="files",
    )

    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime, nullable=True)