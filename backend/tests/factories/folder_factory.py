from app.models.folder import Folder


def create_folder(
    db,
    *,
    owner,
    name="Test Folder",
    description=None,
):
    folder = Folder(
        name=name,
        description=description,
        owner_id=owner.id,
    )

    db.add(folder)
    db.commit()
    db.refresh(folder)

    return folder