from datetime import datetime

from pydantic import BaseModel


class FolderCreate(BaseModel):
    name: str
    description: str | None = None


class FolderResponse(BaseModel):
    id: int
    name: str
    description: str | None
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class FolderUpdate(BaseModel):
    name: str
    description: str | None = None
    model_config = {"from_attributes": True}
