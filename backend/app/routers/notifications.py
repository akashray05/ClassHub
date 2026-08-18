from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..schemas.notification import (NotificationListResponse,
                                    NotificationResponse,
                                    UnreadCountResponse)
from ..services.notification_data_service import (
    get_unread_count_service, list_notifications_service,
    mark_all_notifications_read_service, mark_notification_read_service)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.get("/", response_model=NotificationListResponse)
def list_notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_notifications_service(db, current_user, page, limit)


@router.get("/unread-count", response_model=UnreadCountResponse)
def unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_unread_count_service(db, current_user)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return mark_notification_read_service(db, current_user, notification_id)


@router.post("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return mark_all_notifications_read_service(db, current_user)
