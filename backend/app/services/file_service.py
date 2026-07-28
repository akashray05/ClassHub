from ..utils.pagination import paginate
from ..core.logger import logger
from pathlib import Path
import shutil
import uuid
from datetime import datetime

from ..utils.file_utils import get_file_by_id, get_owned_file
from ..utils.permissions import verify_download_permission

from ..models.shared_file import SharedFile
from ..models.user import User

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

def share_file_service(
    db: Session,
    file_id: int,
    owner: User,
    shared_with_id: int,
    can_download: bool,
):
    # Find the file
    file = (
        db.query(File)
        .filter(
            File.id == file_id,
            File.owner_id == owner.id,
            File.is_deleted == False,
        )
        .first()
    )

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    # Check recipient exists
    recipient = (
        db.query(User)
        .filter(User.id == shared_with_id)
        .first()
    )

    if not recipient:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # Prevent sharing with yourself
    if recipient.id == owner.id:
        raise HTTPException(
            status_code=400,
            detail="You already own this file",
        )

    # Prevent duplicate share
    existing = (
        db.query(SharedFile)
        .filter(
            SharedFile.file_id == file.id,
            SharedFile.shared_with_id == shared_with_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="File already shared with this user",
        )

    share = SharedFile(
        file_id=file.id,
        owner_id=owner.id,
        shared_with_id=shared_with_id,
        can_download=can_download,
    )

    db.add(share)
    db.commit()
    db.refresh(share)

    return {
        "message": "File shared successfully"
    }

# def get_shared_with_me_service(
#     db: Session,
#     current_user: User,
# ):
#     results = (
#         db.query(SharedFile, File, User)
#         .join(File, SharedFile.file_id == File.id)
#         .join(User, SharedFile.owner_id == User.id)
#         .filter(
#             SharedFile.shared_with_id == current_user.id,
#             File.is_deleted == False,
#         )
#         .all()
#     )

#     response = []

#     for share, file, owner in results:
#         response.append({
#             "file_id": file.id,
#             "original_name": file.original_name,
#             "file_size": file.file_size,
#             "owner_name": owner.name,
#             "owner_email": owner.email,
#             "shared_at": share.created_at,
#             "can_download": share.can_download,
#         })

#     return response

def get_shared_with_me_service(
    db: Session,
    current_user: User,
):
    results = (
        db.query(SharedFile, File, User)
        .join(File, SharedFile.file_id == File.id)
        .join(User, SharedFile.owner_id == User.id)
        .filter(
            SharedFile.shared_with_id == current_user.id,
            File.is_deleted == False,
        )
        .all()
    )

    shared_files = []

    for share, file, owner in results:
        shared_files.append(
            {
                "file_id": file.id,
                "original_name": file.original_name,
                "file_size": file.file_size,
                "owner_name": owner.name,
                "owner_email": owner.email,
                "shared_at": share.created_at,
                "can_download": share.can_download,
            }
        )

    return shared_files

def get_shared_by_me_service(
    db: Session,
    current_user: User,
):
    files = (
        db.query(File)
        .filter(
            File.owner_id == current_user.id,
            File.is_deleted == False,
        )
        .all()
    )

    result = []

    for file in files:

        shares = (
            db.query(SharedFile, User)
            .join(User, SharedFile.shared_with_id == User.id)
            .filter(SharedFile.file_id == file.id)
            .all()
        )

        shared_users = []

        for share, user in shares:
            shared_users.append(
                {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                }
            )

        result.append(
            {
                "file_id": file.id,
                "original_name": file.original_name,
                "shared_with": shared_users,
            }
        )

    return result

def download_shared_file_service(
    db: Session,
    current_user: User,
    file_id: int,
):
    try:
        file = get_owned_file(
            db=db,
            file_id=file_id,
            owner_id=current_user.id,
        )

        return get_file_response(
            file_path=file.file_path,
            filename=file.original_name,
            mime_type=file.mime_type,
        )

    except HTTPException:
        pass

    verify_download_permission(
        db=db,
        file_id=file_id,
        user_id=current_user.id,
    )

    file = get_file_by_id(
        db=db,
        file_id=file_id,
    )

    return get_file_response(
        file_path=file.file_path,
        filename=file.original_name,
        mime_type=file.mime_type,
    )


# def download_shared_file_service(
#     db: Session,
#     current_user: User,
#     file_id: int,
# ):
#     # Owner can always download
#     file = (
#         db.query(File)
#         .filter(
#             File.id == file_id,
#             File.owner_id == current_user.id,
#             File.is_deleted == False,
#         )
#         .first()
#     )

#     if file:
#         return get_file_response(
#             file_path=file.file_path,
#             filename=file.original_name,
#             mime_type=file.mime_type,
#         )

#     # Check if shared with current user
#     shared = (
#         db.query(SharedFile)
#         .filter(
#             SharedFile.file_id == file_id,
#             SharedFile.shared_with_id == current_user.id,
#             SharedFile.can_download == True,
#         )
#         .first()
#     )

#     if not shared:
#         raise HTTPException(
#             status_code=403,
#             detail="You do not have permission to download this file.",
#         )

#     file = (
#         db.query(File)
#         .filter(
#             File.id == file_id,
#             File.is_deleted == False,
#         )
#         .first()
#     )

#     if not file:
#         raise HTTPException(
#             status_code=404,
#             detail="File not found.",
#         )

#     return get_file_response(
#         file_path=file.file_path,
#         filename=file.original_name,
#         mime_type=file.mime_type,
#     )

def remove_share_service(
    db: Session,
    current_user: User,
    file_id: int,
    user_id: int,
):
    file = (
        db.query(File)
        .filter(
            File.id == file_id,
            File.owner_id == current_user.id,
            File.is_deleted == False,
        )
        .first()
    )

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found or you are not the owner.",
        )

    share = (
        db.query(SharedFile)
        .filter(
            SharedFile.file_id == file_id,
            SharedFile.shared_with_id == user_id,
        )
        .first()
    )

    if not share:
        raise HTTPException(
            status_code=404,
            detail="Share record not found.",
        )

    db.delete(share)
    db.commit()

    return {"message": "Access revoked successfully."}


def update_share_permission_service(
    db: Session,
    current_user: User,
    file_id: int,
    user_id: int,
    can_download: bool,
):
    # Verify ownership
    file = (
        db.query(File)
        .filter(
            File.id == file_id,
            File.owner_id == current_user.id,
            File.is_deleted == False,
        )
        .first()
    )

    if not file:
        raise HTTPException(
            status_code=404,
            detail="File not found or you are not the owner.",
        )

    share = (
        db.query(SharedFile)
        .filter(
            SharedFile.file_id == file_id,
            SharedFile.shared_with_id == user_id,
        )
        .first()
    )

    if not share:
        raise HTTPException(
            status_code=404,
            detail="Share record not found.",
        )

    share.can_download = can_download

    db.commit()
    db.refresh(share)

    return {
        "message": "Share permission updated successfully.",
        "can_download": share.can_download,
    }