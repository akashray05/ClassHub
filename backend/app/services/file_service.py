from ..utils.pagination import paginate
from ..core.logger import logger
from pathlib import Path
import shutil
import uuid
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
    
    # user_folder = (
    #     UPLOAD_DIR
    #     / f"user_{current_user.id}"
    #     / f"folder_{folder_id}"
    # )

    # user_folder.mkdir(parents=True, exist_ok=True)

    # extension = Path(file.filename).suffix

    # stored_name = f"{uuid.uuid4()}{extension}"

    # file_path = user_folder / stored_name

    # with open(file_path, "wb") as buffer:
    #     shutil.copyfileobj(file.file, buffer)

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
        )
        .first()
    )

    if db_file is None:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    # path = Path(db_file.file_path)

    # if not path.exists():
    #     raise HTTPException(
    #         status_code=404,
    #         detail="File missing from storage",
    #     )

    # return FastAPIFileResponse(
    #     path=str(path),
    #     filename=db_file.original_name,
    #     media_type=db_file.mime_type,
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

# def get_folder_files_service(
#     db: Session,
#     current_user,
#     folder_id: int,
# ):
#     folder = (
#         db.query(Folder)
#         .filter(
#             Folder.id == folder_id,
#             Folder.owner_id == current_user.id,
#         )
#         .first()
#     )

#     if folder is None:
#         raise HTTPException(
#             status_code=404,
#             detail="Folder not found",
#         )

#     return (
#         db.query(FileModel)
#         .filter(FileModel.folder_id == folder_id)
#         .order_by(FileModel.created_at.desc())
#         .all()
#     )

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
    delete_file(db_file.file_path)
    # file_path = Path(db_file.file_path)

    # if file_path.exists():
    #     file_path.unlink()

    db.delete(db_file)
    db.commit()

    return {
        "message": "File deleted successfully"
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
            FileModel.original_name.ilike(f"%{query}%"),
        )
    )

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
        .filter(FileModel.folder_id == folder_id)
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

    # total = query.count()

    # offset = (page - 1) * limit

    # files = (
    #     query.order_by(FileModel.created_at.desc())
    #     .offset(offset)
    #     .limit(limit)
    #     .all()
    # )

    # return {
    #     "page": page,
    #     "limit": limit,
    #     "total": total,
    #     "pages": ceil(total / limit) if total else 1,
    #     "files": files,
    # }