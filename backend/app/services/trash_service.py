from datetime import UTC, datetime, timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.file import File as FileModel
from ..storage import get_storage

storage = get_storage()


def delete_file_service(
    db: Session,
    current_user,
    file_id: int,
):
    db_file = (
        db.query(FileModel)
        .filter(
            FileModel.id == file_id,
            FileModel.owner_id == current_user.id,
        )
        .first()
    )

    if db_file is None:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    db_file.is_deleted = True
    db_file.deleted_at = datetime.now(UTC)

    db.commit()
    db.refresh(db_file)

    return {"message": "File moved to trash successfully"}


def restore_file_service(
    db: Session,
    current_user,
    file_id: int,
):
    db_file = (
        db.query(FileModel)
        .filter(
            FileModel.id == file_id,
            FileModel.owner_id == current_user.id,
            FileModel.is_deleted == True,
        )
        .first()
    )

    if db_file is None:
        raise HTTPException(
            status_code=404,
            detail="File not found in trash",
        )

    db_file.is_deleted = False
    db_file.deleted_at = None

    db.commit()
    db.refresh(db_file)

    return {"message": "File restored successfully"}


def permanently_delete_file_service(
    db: Session,
    current_user,
    file_id: int,
):
    db_file = (
        db.query(FileModel)
        .filter(
            FileModel.id == file_id,
            FileModel.owner_id == current_user.id,
            FileModel.is_deleted == True,
        )
        .first()
    )

    if db_file is None:
        raise HTTPException(
            status_code=404,
            detail="File not found in trash",
        )

    # Delete the physical file

    current_user.storage_used -= db_file.file_size

    # Safety check
    if current_user.storage_used < 0:
        current_user.storage_used = 0
    storage.delete_file(db_file.file_path)

    # Delete the database record
    db.delete(db_file)
    db.commit()

    return {"message": "File permanently deleted successfully"}
