import shutil
import uuid
from pathlib import Path

from fastapi import UploadFile
from fastapi.responses import FileResponse

from ..core.constants import ALLOWED_EXTENSIONS, UPLOAD_DIR
from .base import StorageProvider


class LocalStorage(StorageProvider):
    def save_file(
        self,
        current_user,
        folder_id: int,
        file: UploadFile,
    ):
        extension = Path(file.filename).suffix.lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise ValueError(f"Files of type '{extension}' are not allowed.")

        user_folder = UPLOAD_DIR / f"user_{current_user.id}" / f"folder_{folder_id}"

        user_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        stored_name = f"{uuid.uuid4()}{extension}"

        file_path = user_folder / stored_name

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return (
            stored_name,
            str(file_path),
            file_path.stat().st_size,
        )

    def delete_file(self, file_path: str):
        """
        Permanently delete a file from storage.
        """

        path = Path(file_path)

        if path.exists():
            path.unlink()

    def file_exists(self, file_path: str) -> bool:
        """
        Check whether a file exists in storage.
        """

        return Path(file_path).exists()

    def get_file_response(
        self,
        file_path: str,
        filename: str,
        mime_type: str,
    ):
        """
        Return a downloadable response.
        """

        return FileResponse(
            path=file_path,
            filename=filename,
            media_type=mime_type,
        )
