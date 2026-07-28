from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.file import File


def get_file_by_id(
    db: Session,
    file_id: int,
) -> File:
    file = (
        db.query(File)
        .filter(
            File.id == file_id,
            File.is_deleted == False,
        )
        .first()
    )

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found.",
        )

    return file


def get_owned_file(
    db: Session,
    file_id: int,
    owner_id: int,
) -> File:
    file = (
        db.query(File)
        .filter(
            File.id == file_id,
            File.owner_id == owner_id,
            File.is_deleted == False,
        )
        .first()
    )

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found or you are not the owner.",
        )

    return file