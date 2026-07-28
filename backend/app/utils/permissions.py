from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.shared_file import SharedFile


def verify_download_permission(
    db: Session,
    file_id: int,
    user_id: int,
):
    share = (
        db.query(SharedFile)
        .filter(
            SharedFile.file_id == file_id,
            SharedFile.shared_with_id == user_id,
            SharedFile.can_download == True,
        )
        .first()
    )

    if not share:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this file.",
        )

    return share