from fastapi import APIRouter, Depends

from ..dependencies.permissions import get_current_admin
from ..models.user import User

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/dashboard")
def dashboard(
    admin: User = Depends(get_current_admin),
):
    return {
        "message": f"Welcome {admin.name}"
    }