from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.file import File
from ..models.shared_file import SharedFile
from ..models.user import User

from ..utils.file_utils import (
    get_file_by_id,
    get_owned_file,
)

from ..utils.permissions import (
    verify_download_permission,
)

from ..storage import get_storage

storage = get_storage()
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

        # return get_file_response(
        #     file_path=file.file_path,
        #     filename=file.original_name,
        #     mime_type=file.mime_type,
        # )
        return storage.get_file_response(
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

    return storage.get_file_response(
        file_path=file.file_path,
        filename=file.original_name,
        mime_type=file.mime_type,
    )



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