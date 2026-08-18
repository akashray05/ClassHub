from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models.notification import Notification
from ..models.user import User


def create_notification(
    db: Session,
    user_id: int,
    message: str,
    type: str = "file_shared",
    actor_id: int | None = None,
    file_id: int | None = None,
):
    """
    Create a notification. Called from inside other services (e.g.
    right after a successful share) — does not commit on its own,
    the caller's existing db.commit() picks it up too, but we commit
    here as well so a notification failure never depends on unrelated
    code committing correctly later.
    """
    notification = Notification(
        user_id=user_id,
        actor_id=actor_id,
        file_id=file_id,
        type=type,
        message=message,
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


def list_notifications_service(
    db: Session,
    current_user: User,
    page: int,
    limit: int,
):
    query = db.query(Notification).filter(
        Notification.user_id == current_user.id
    )

    total = query.count()

    unread_count = query.filter(Notification.is_read == False).count()

    offset = (page - 1) * limit

    notifications = (
        query.order_by(Notification.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "unread_count": unread_count,
        "notifications": notifications,
    }


def get_unread_count_service(db: Session, current_user: User):
    count = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False,
        )
        .count()
    )

    return {"unread_count": count}


def mark_notification_read_service(
    db: Session,
    current_user: User,
    notification_id: int,
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
        .first()
    )

    if notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.is_read = True
    db.commit()
    db.refresh(notification)

    return notification


def mark_all_notifications_read_service(db: Session, current_user: User):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    ).update({"is_read": True}, synchronize_session=False)

    db.commit()

    return {"message": "All notifications marked as read"}
