from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FileResponse(BaseModel):
    id: int
    original_name: str
    stored_name: str
    file_size: int
    mime_type: str
    folder_id: int
    owner_id: int
    created_at: datetime
    # download_url: str
    

    model_config = ConfigDict(from_attributes=True)


class FileRename(BaseModel):
    original_name: str
    original_name: str = Field(
        min_length=1,
        max_length=255,
    )


class FileMove(BaseModel):
    folder_id: int


class PaginatedFileResponse(BaseModel):
    page: int
    limit: int
    total: int
    pages: int
    files: list[FileResponse]


class ShareFileRequest(BaseModel):
    shared_with_id: int
    can_download: bool = True


class SharedFileResponse(BaseModel):
    file_id: int
    original_name: str
    file_size: int
    owner_name: str
    owner_email: str
    shared_at: datetime
    can_download: bool

    model_config = ConfigDict(from_attributes=True)


class SharedUser(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class SharedByMeResponse(BaseModel):
    file_id: int
    original_name: str
    shared_with: list[SharedUser]


class UpdateSharePermissionRequest(BaseModel):
    can_download: bool

    model_config = ConfigDict(from_attributes=True)
