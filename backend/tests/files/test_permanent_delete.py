from tests.factories.file_factory import create_file
from tests.factories.folder_factory import create_folder


def test_permanent_delete_success(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    file = create_file(
        db=db,
        owner=db_user,
        folder=folder,
        size=2048,
    )

    file.is_deleted = True
    db_user.storage_used = file.file_size
    db.commit()
    db.refresh(file)
    db.refresh(db_user)

    response = client.delete(
        f"/files/permanent/{file.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["message"] == "File permanently deleted successfully"

    from app.models.file import File

    deleted = db.query(File).filter(File.id == file.id).first()

    assert deleted is None

    db.refresh(db_user)
    assert db_user.storage_used == 0


def test_permanent_delete_without_token(
    client,
    db,
    db_user,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    file = create_file(
        db=db,
        owner=db_user,
        folder=folder,
    )

    file.is_deleted = True
    db.commit()

    response = client.delete(
        f"/files/permanent/{file.id}",
    )

    assert response.status_code == 401


def test_permanent_delete_invalid_token(
    client,
    db,
    db_user,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    file = create_file(
        db=db,
        owner=db_user,
        folder=folder,
    )

    file.is_deleted = True
    db.commit()

    response = client.delete(
        f"/files/permanent/{file.id}",
        headers={
            "Authorization": "Bearer invalid_token",
        },
    )

    assert response.status_code == 401


def test_permanent_delete_file_not_found(
    client,
    auth_headers,
):
    response = client.delete(
        "/files/permanent/999999",
        headers=auth_headers,
    )

    assert response.status_code == 404
    assert response.json()["message"] == "File not found in trash"


def test_permanent_delete_file_not_in_trash(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    file = create_file(
        db=db,
        owner=db_user,
        folder=folder,
    )

    response = client.delete(
        f"/files/permanent/{file.id}",
        headers=auth_headers,
    )

    assert response.status_code == 404
    assert response.json()["message"] == "File not found in trash"


def test_storage_used_never_negative(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    file = create_file(
        db=db,
        owner=db_user,
        folder=folder,
        size=2048,
    )

    file.is_deleted = True
    db_user.storage_used = 1000  # Less than file size
    db.commit()

    response = client.delete(
        f"/files/permanent/{file.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    db.refresh(db_user)

    assert db_user.storage_used == 0
