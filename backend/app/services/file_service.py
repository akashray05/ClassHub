from ..utils.pagination import paginate
from ..core.logger import logger
from pathlib import Path
import shutil
import uuid
from datetime import datetime

from math import ceil
from .storage_service import save_file
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse as FastAPIFileResponse
from ..models.folder import Folder
from ..models.file import File

from fastapi.responses import FileResponse as FastAPIFileResponse
from ..models.file import File as FileModel
from .storage_service import (
    save_file,
    delete_file,
    file_exists,
    get_file_response,
)
UPLOAD_DIR = Path("uploads")


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
    

    stored_name, file_path, file_size = save_file(
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
    db_file.deleted_at = datetime.utcnow()

    db.commit()
    db.refresh(db_file)

    return {
        "message": "File moved to trash successfully"
    }

def search_files_service(
    db: Session,
    current_user,
    query: str,
    page: int,
    limit: int,
):

    search_query = (
        db.query(FileModel)
        .filter(
            FileModel.owner_id == current_user.id,
            FileModel.is_deleted == False,
            FileModel.original_name.ilike(f"%{query}%"),
        )
    )
    # search_query = (
    #     db.query(FileModel)
    #     .filter(
    #         FileModel.owner_id == current_user.id,
    #         FileModel.original_name.ilike(f"%{query}%"),
    #     )
    # )

    total = search_query.count()

    offset = (page - 1) * limit

    files = (
        search_query
        .order_by(FileModel.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "pages": ceil(total / limit) if total else 1,
        "files": files,
    }

def get_folder_files_service(
    db: Session,
    current_user,
    folder_id: int,
    page: int,
    limit: int,
):
    folder = (
        db.query(Folder)
        .filter(
            Folder.id == folder_id,
            Folder.owner_id == current_user.id,
        )
        .first()
    )

    if folder is None:
        raise HTTPException(
            status_code=404,
            detail="Folder not found",
        )

    query = (
        db.query(FileModel)
        .filter(
            FileModel.folder_id == folder_id,
            FileModel.owner_id == current_user.id,
            FileModel.is_deleted == False,
        )
    )
    result = paginate(
        query.order_by(FileModel.created_at.desc()),
        page,
        limit,
    )

    return {
        "page": result["page"],
        "limit": result["limit"],
        "total": result["total"],
        "pages": result["pages"],
        "files": result["items"],
    }


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

    return {
        "message": "File restored successfully"
    }

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
    delete_file(db_file.file_path)

    # Delete the database record
    db.delete(db_file)
    db.commit()

    return {
        "message": "File permanently deleted successfully"
    }

def get_trash_files_service(
    db: Session,
    current_user,
    page: int,
    limit: int,
):
    query = (
        db.query(FileModel)
        .filter(
            FileModel.owner_id == current_user.id,
            FileModel.is_deleted == True,
        )
    )

    result = paginate(
        query.order_by(FileModel.deleted_at.desc()),
        page,
        limit,
    )

    return {
        "page": result["page"],
        "limit": result["limit"],
        "total": result["total"],
        "pages": result["pages"],
        "files": result["items"],
    }