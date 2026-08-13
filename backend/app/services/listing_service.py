from math import ceil

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.file import File as FileModel
from ..models.folder import Folder
from ..models.user import User

from ..utils.pagination import paginate


SORT_COLUMNS = {
    "name": FileModel.original_name,
    "date": FileModel.created_at,
    "size": FileModel.file_size,
}


def _resolve_sort(sort_by: str, sort_order: str):
    column = SORT_COLUMNS.get(sort_by, FileModel.created_at)

    if sort_order == "asc":
        return column.asc()

    return column.desc()


def search_files_service(
    db: Session,
    current_user: User,
    query: str,
    page: int,
    limit: int,
    sort_by: str = "date",
    sort_order: str = "desc",
):

    search_query = (
        db.query(FileModel)
        .filter(
            FileModel.owner_id == current_user.id,
            FileModel.is_deleted == False,
            FileModel.original_name.ilike(f"%{query}%"),
        )
    )


    total = search_query.count()

    offset = (page - 1) * limit

    files = (
        search_query
        .order_by(_resolve_sort(sort_by, sort_order))
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
    current_user: User,
    folder_id: int,
    page: int,
    limit: int,
    sort_by: str = "date",
    sort_order: str = "desc",
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
        query.order_by(_resolve_sort(sort_by, sort_order)),
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
    current_user: User,
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


def get_dashboard_summary_service(db: Session, current_user: User):
    from ..models.shared_file import SharedFile

    total_files = (
        db.query(FileModel)
        .filter(
            FileModel.owner_id == current_user.id,
            FileModel.is_deleted == False,
        )
        .count()
    )

    total_folders = (
        db.query(Folder)
        .filter(Folder.owner_id == current_user.id)
        .count()
    )

    trash_count = (
        db.query(FileModel)
        .filter(
            FileModel.owner_id == current_user.id,
            FileModel.is_deleted == True,
        )
        .count()
    )

    shared_files_count = (
        db.query(SharedFile.file_id)
        .filter(SharedFile.owner_id == current_user.id)
        .distinct()
        .count()
    )

    recent_files = (
        db.query(FileModel)
        .filter(
            FileModel.owner_id == current_user.id,
            FileModel.is_deleted == False,
        )
        .order_by(FileModel.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_files": total_files,
        "total_folders": total_folders,
        "trash_count": trash_count,
        "shared_files_count": shared_files_count,
        "recent_files": recent_files,
    }
