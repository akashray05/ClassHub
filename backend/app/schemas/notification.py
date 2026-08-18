from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NotificationResponse(BaseModel):
    id: int
    type: str
    message: str
    is_read: bool
    actor_id: int | None = None
    file_id: int | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationListResponse(BaseModel):
    page: int
    limit: int
    total: int
    unread_count: int
    notifications: list[NotificationResponse]


class UnreadCountResponse(BaseModel):
    unread_count: int
