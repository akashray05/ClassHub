from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..core.logger import logger
from ..models.file import File
from ..models.file import File as FileModel
from ..models.folder import Folder
from ..storage import get_storage

storage = get_storage()


async def upload_file_service(
    db: Session,
    current_user,
    folder_id: int,
    file: UploadFile,
):
    """
    Upload a file into a user's folder.
    """

    folder = (
        db.query(Folder)
        .filter(
            Folder.id == folder_id,
            Folder.owner_id == current_user.id,
        )
        .first()
    )

    if not folder:
        raise HTTPException(
            status_code=404,
            detail="Folder not found",
        )

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if current_user.storage_used + file_size > current_user.storage_quota:
        raise HTTPException(
            status_code=413,
            detail="Storage quota exceeded",
        )

    # stored_name, file_path, file_size = save_file(
    #     current_user=current_user,
    #     folder_id=folder_id,
    #     file=file,
    # )
    stored_name, file_path, file_size = storage.save_file(
        current_user=current_user,
        folder_id=folder_id,
        file=file,
    )

    db_file = File(
        original_name=file.filename,
        stored_name=stored_name,
        file_path=file_path,
        mime_type=file.content_type,
        file_size=file_size,
        owner_id=current_user.id,
        folder_id=folder_id,
    )

    # db.add(db_file)
    # db.commit()
    # db.refresh(db_file)

    # return db_file
    db.add(db_file)
    current_user.storage_used += file_size
    db.commit()
    db.refresh(db_file)

    logger.info(
        f"User {current_user.email} uploaded '{db_file.original_name}' "
        f"(ID: {db_file.id}) to folder {folder_id}"
    )

    return db_file


def rename_file_service(
    db: Session,
    current_user,
    file_id: int,
    original_name: str,
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

    db_file.original_name = original_name

    db.commit()
    db.refresh(db_file)

    return db_file
