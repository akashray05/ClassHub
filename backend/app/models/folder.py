# from sqlalchemy import Column, Integer, String, ForeignKey
# from sqlalchemy.orm import relationship

# from ..database.base import Base


# class Folder(Base):
#     __tablename__ = "folders"

#     id = Column(Integer, primary_key=True, index=True)

#     name = Column(String, nullable=False)

#     owner_id = Column(Integer, ForeignKey("users.id"))

#     owner = relationship("User", back_populates="folders")

#     files = relationship("File", back_populates="folder")

from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from ..database.base import Base


class Folder(Base):
    __tablename__ = "folders"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    description = Column(String, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    owner = relationship("User", back_populates="folders")

    files = relationship(
        "File",
        back_populates="folder",
        cascade="all, delete-orphan",
    )

    