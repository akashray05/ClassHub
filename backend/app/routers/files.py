# Standard library
from pathlib import Path

# Third-party
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Query,
)
from sqlalchemy.orm import Session

# Local imports
from ..core.auth import get_current_user
from ..database.session import get_db
from ..models.user import User

from ..schemas.file import (
    FileResponse,
    FileRename,
    PaginatedFileResponse,
    ShareFileRequest,
    SharedFileResponse,
    SharedByMeResponse,
    UpdateSharePermissionRequest,
    SharedUser,
)

from ..services.upload_service import (
    upload_file_service,
    rename_file_service,
)
from ..services.download_service import (
    download_file_service,
)
from ..services.listing_service import (
    search_files_service,
    get_folder_files_service,
    get_trash_files_service,
)

from ..services.trash_service import (
    delete_file_service,
    restore_file_service,
    permanently_delete_file_service,
    
)

from ..services.share_service import (
    share_file_service,
    get_shared_with_me_service,
    get_shared_by_me_service,
    download_shared_file_service,
    remove_share_service,
    update_share_permission_service,
)

router = APIRouter(
    prefix="/files",
    tags=["Files"],
)



@router.post("/upload", response_model=FileResponse)
async def upload_file(
    folder_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await upload_file_service(
        db=db,
        current_user=current_user,
        folder_id=folder_id,
        file=file,
    )


@router.get("/download/{file_id}")
def download_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return download_file_service(
        db=db,
        current_user=current_user,
        file_id=file_id,
    )



@router.get("/folder/{folder_id}", response_model=PaginatedFileResponse)
def get_folder_files(
    folder_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_folder_files_service(
        db=db,
        current_user=current_user,
        folder_id=folder_id,
        page=page,
        limit=limit,
    )


@router.get(
    "/search",
    response_model=PaginatedFileResponse,
)
def search_files(
    q: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return search_files_service(
        db=db,
        current_user=current_user,
        query=q,
        page=page,
        limit=limit,
    )


@router.get(
    "/trash",
    response_model=PaginatedFileResponse,
)
def get_trash_files(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_trash_files_service(
        db=db,
        current_user=current_user,
        page=page,
        limit=limit,
    )

@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_file_service(
        db=db,
        current_user=current_user,
        file_id=file_id,
    )


@router.put(
    "/{file_id}",
    response_model=FileResponse,
)
def rename_file(
    file_id: int,
    file_data: FileRename,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return rename_file_service(
        db=db,
        current_user=current_user,
        file_id=file_id,
        original_name=file_data.original_name,
    )

@router.put("/restore/{file_id}")
def restore_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return restore_file_service(
        db=db,
        current_user=current_user,
        file_id=file_id,
    )

@router.delete("/permanent/{file_id}")
def permanently_delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return permanently_delete_file_service(
        db=db,
        current_user=current_user,
        file_id=file_id,
    )

@router.post("/{file_id}/share")
def share_file(
    file_id: int,
    request: ShareFileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return share_file_service(
        db=db,
        file_id=file_id,
        owner=current_user,
        shared_with_id=request.shared_with_id,
        can_download=request.can_download,
    )

@router.get("/shared-with-me")

def shared_with_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_shared_with_me_service(
        db,
        current_user,
    )

@router.get(
    "/shared-by-me",
    response_model=list[SharedByMeResponse],
)
def shared_by_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_shared_by_me_service(
        db=db,
        current_user=current_user,
    )

@router.get("/shared-download/{file_id}")
def download_shared_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return download_shared_file_service(
        db=db,
        current_user=current_user,
        file_id=file_id,
    )

@router.delete("/share/{file_id}/{user_id}")
def remove_share(
    file_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return remove_share_service(
        db=db,
        current_user=current_user,
        file_id=file_id,
        user_id=user_id,
    )
@router.patch("/share/{file_id}/{user_id}")
def update_share_permission(
    file_id: int,
    user_id: int,
    request: UpdateSharePermissionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_share_permission_service(
        db=db,
        current_user=current_user,
        file_id=file_id,
        user_id=user_id,
        can_download=request.can_download,
    )