from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class AdminUserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_admin: bool
    is_active: bool
    is_verified: bool
    storage_used: int
    storage_quota: int
    file_count: int
    folder_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUserListResponse(BaseModel):
    page: int
    limit: int
    total: int
    pages: int
    users: list[AdminUserResponse]


class AdminStatsResponse(BaseModel):
    total_users: int
    active_users: int
    inactive_users: int
    verified_users: int
    admin_users: int
    total_folders: int
    total_files: int
    total_storage_used: int
    total_storage_quota: int
    total_shares: int


class UpdateUserStatusRequest(BaseModel):
    is_active: bool


class UpdateUserRoleRequest(BaseModel):
    is_admin: bool
