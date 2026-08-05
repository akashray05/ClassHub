from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ..core.auth import get_current_user
from ..database.session import get_db
from ..models.folder import Folder
from ..models.user import User
from ..schemas.folder import FolderCreate, FolderResponse, FolderUpdate

router = APIRouter(
    prefix="/folders",
    tags=["Folders"],
)


@router.post("/", response_model=FolderResponse)
def create_folder(
    folder: FolderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_folder = Folder(
        name=folder.name,
        description=folder.description,
        owner_id=current_user.id,
    )

    db.add(new_folder)
    db.commit()
    db.refresh(new_folder)

    return new_folder


@router.get("/", response_model=list[FolderResponse])
def get_folders(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    folders = (
        db.query(Folder)
        .filter(Folder.owner_id == current_user.id)
        .order_by(Folder.created_at.desc())
        .all()
    )

    return folders


@router.put("/{folder_id}", response_model=FolderResponse)
def update_folder(
    folder_id: int,
    folder: FolderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_folder = (
        db.query(Folder)
        .filter(Folder.id == folder_id, Folder.owner_id == current_user.id)
        .first()
    )

    if db_folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")

    db_folder.name = folder.name

    db.commit()
    db.refresh(db_folder)

    return db_folder


from fastapi.responses import JSONResponse


@router.delete("/{folder_id}")
def delete_folder(
    folder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    db.delete(folder)
    db.commit()

    return JSONResponse(
        status_code=200,
        content={"message": "Folder deleted successfully"},
    )
