from uuid import uuid4

from app.models.file import File


def create_file(
    db,
    *,
    owner,
    folder,
    original_name="test.txt",
    mime_type="text/plain",
    size=1024,
):
    file = File(
        original_name=original_name,
        stored_name=f"{uuid4().hex}.txt",
        file_path=f"/tmp/{uuid4().hex}.txt",
        mime_type=mime_type,
        file_size=size,
        owner_id=owner.id,
        folder_id=folder.id,
    )

    db.add(file)
    db.commit()
    db.refresh(file)

    return file
