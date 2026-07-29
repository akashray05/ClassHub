from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.file import File as FileModel

from .storage_service import (
    file_exists,
    get_file_response,
)



def download_file_service(
    db: Session,
    current_user,
    file_id: int,
):
    db_file = (
        db.query(FileModel)
        .filter(
            FileModel.id == file_id,
            FileModel.owner_id == current_user.id,
            FileModel.is_deleted == False,  # noqa: E712
        )
        .first()
    )

    if db_file is None:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    # path = Path(db_file.file_path)


    # )
    if not file_exists(db_file.file_path):
        raise HTTPException(
            status_code=404,
            detail="File missing from storage",
        )

    return get_file_response(
        file_path=db_file.file_path,
        filename=db_file.original_name,
        mime_type=db_file.mime_type,
    )
