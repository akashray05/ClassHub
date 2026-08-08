from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..models.file import File
from ..models.folder import Folder
from ..models.shared_file import SharedFile
from ..models.user import User


def _with_counts(db: Session, user: User) -> User:
    user.file_count = (
        db.query(func.count(File.id))
        .filter(
            File.owner_id == user.id,
            File.is_deleted == False,  # noqa: E712
        )
        .scalar()
        or 0
    )

    user.folder_count = (
        db.query(func.count(Folder.id))
        .filter(Folder.owner_id == user.id)
        .scalar()
        or 0
    )

    return user


def list_users_service(db: Session, page: int, limit: int):
    query = db.query(User).order_by(User.created_at.desc())

    total = query.count()

    users = (
        query.offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    users = [_with_counts(db, user) for user in users]

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "pages": (total + limit - 1) // limit if limit else 0,
        "users": users,
    }


def get_user_detail_service(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return _with_counts(db, user)


def update_user_status_service(
    db: Session,
    admin: User,
    user_id: int,
    is_active: bool,
):
    if admin.id == user_id and not is_active:
        raise HTTPException(
            status_code=400,
            detail="You can't deactivate your own account.",
        )

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = is_active
    db.commit()
    db.refresh(user)

    return _with_counts(db, user)


def update_user_role_service(
    db: Session,
    admin: User,
    user_id: int,
    is_admin: bool,
):
    if admin.id == user_id and not is_admin:
        raise HTTPException(
            status_code=400,
            detail="You can't remove your own admin access.",
        )

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_admin = is_admin
    db.commit()
    db.refresh(user)

    return _with_counts(db, user)


def delete_user_service(db: Session, admin: User, user_id: int):
    if admin.id == user_id:
        raise HTTPException(
            status_code=400,
            detail="You can't delete your own account.",
        )

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": f'User "{user.email}" has been deleted.'}


def get_admin_stats_service(db: Session) -> dict:
    total_users = db.query(func.count(User.id)).scalar() or 0
    active_users = (
        db.query(func.count(User.id))
        .filter(User.is_active == True)  # noqa: E712
        .scalar()
        or 0
    )
    verified_users = (
        db.query(func.count(User.id))
        .filter(User.is_verified == True)  # noqa: E712
        .scalar()
        or 0
    )
    admin_users = (
        db.query(func.count(User.id))
        .filter(User.is_admin == True)  # noqa: E712
        .scalar()
        or 0
    )

    total_folders = db.query(func.count(Folder.id)).scalar() or 0

    total_files = (
        db.query(func.count(File.id))
        .filter(File.is_deleted == False)  # noqa: E712
        .scalar()
        or 0
    )

    total_storage_used = db.query(func.sum(User.storage_used)).scalar() or 0
    total_storage_quota = db.query(func.sum(User.storage_quota)).scalar() or 0

    total_shares = db.query(func.count(SharedFile.id)).scalar() or 0

    return {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": total_users - active_users,
        "verified_users": verified_users,
        "admin_users": admin_users,
        "total_folders": total_folders,
        "total_files": total_files,
        "total_storage_used": total_storage_used,
        "total_storage_quota": total_storage_quota,
        "total_shares": total_shares,
    }
