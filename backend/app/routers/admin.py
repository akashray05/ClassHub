from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..dependencies import get_current_admin
from ..models.user import User
from ..schemas.admin import (AdminStatsResponse, AdminUserListResponse,
                             AdminUserResponse, UpdateUserRoleRequest,
                             UpdateUserStatusRequest)
from ..services.admin_service import (delete_user_service,
                                      get_admin_stats_service,
                                      get_user_detail_service,
                                      list_users_service,
                                      update_user_role_service,
                                      update_user_status_service)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/dashboard")
def dashboard(
    admin: User = Depends(get_current_admin),
):
    return {"message": f"Welcome {admin.name}"}


@router.get("/stats", response_model=AdminStatsResponse)
def get_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return get_admin_stats_service(db)


@router.get("/users", response_model=AdminUserListResponse)
def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return list_users_service(db, page, limit)


@router.get("/users/{user_id}", response_model=AdminUserResponse)
def get_user(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return get_user_detail_service(db, user_id)


@router.patch("/users/{user_id}/status", response_model=AdminUserResponse)
def update_user_status(
    user_id: int,
    request: UpdateUserStatusRequest,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return update_user_status_service(
        db, admin, user_id, request.is_active
    )


@router.patch("/users/{user_id}/role", response_model=AdminUserResponse)
def update_user_role(
    user_id: int,
    request: UpdateUserRoleRequest,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return update_user_role_service(
        db, admin, user_id, request.is_admin
    )


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return delete_user_service(db, admin, user_id)
