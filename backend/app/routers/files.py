

# from ..services.file_service import (
#     upload_file_service,
#     download_file_service,
#     get_folder_files_service,
#     rename_file_service,
#     delete_file_service,
#     search_files_service,
#     restore_file_service,
#     permanently_delete_file_service
# )

from ..schemas.file import SharedFileResponse
from ..services.file_service import get_shared_with_me_service
from ..schemas.file import ShareFileRequest
from ..services.file_service import share_file_service
from ..services.file_service import (
    upload_file_service,
    download_file_service,
    rename_file_service,
    delete_file_service,
    search_files_service,
    get_folder_files_service,
    get_trash_files_service,
    restore_file_service,
    permanently_delete_file_service,
)
from ..schemas.file import (
    FileResponse,
    FileRename,
    PaginatedFileResponse,
)

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
    Query,
)
from fastapi.responses import FileResponse as FastAPIFileResponse
from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
)
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..core.auth import get_current_user
from ..models.user import User
from ..models.folder import Folder
from ..models.file import File as FileModel
from ..schemas.file import FileResponse, FileRename

router = APIRouter(
    prefix="/files",
    tags=["Files"],
)

UPLOAD_DIR = Path("uploads")


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