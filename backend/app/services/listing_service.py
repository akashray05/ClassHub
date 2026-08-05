from math import ceil

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.file import File as FileModel
from ..models.folder import Folder
from ..utils.pagination import paginate


def search_files_service(
    db: Session,
    current_user,
    query: str,
    page: int,
    limit: int,
):

    search_query = db.query(FileModel).filter(
        FileModel.owner_id == current_user.id,
        FileModel.is_deleted == False,
        FileModel.original_name.ilike(f"%{query}%"),
    )

    total = search_query.count()

    offset = (page - 1) * limit

    files = (
        search_query.order_by(FileModel.created_at.desc())
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

    query = db.query(FileModel).filter(
        FileModel.folder_id == folder_id,
        FileModel.owner_id == current_user.id,
        FileModel.is_deleted == False,
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


def get_trash_files_service(
    db: Session,
    current_user,
    page: int,
    limit: int,
):
    query = db.query(FileModel).filter(
        FileModel.owner_id == current_user.id,
        FileModel.is_deleted == True,
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
