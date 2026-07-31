from tests.factories.folder_factory import create_folder
from tests.factories.file_factory import create_file


def test_restore_file_success(
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

    file.is_deleted = True
    db.commit()
    db.refresh(file)

    response = client.put(
        f"/files/restore/{file.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["message"] == "File restored successfully"

    db.refresh(file)

    assert file.is_deleted is False
    assert file.deleted_at is None


def test_restore_without_token(
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

    response = client.put(
        f"/files/restore/{file.id}",
    )

    assert response.status_code == 401


def test_restore_invalid_token(
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

    response = client.put(
        f"/files/restore/{file.id}",
        headers={
            "Authorization": "Bearer invalid_token",
        },
    )

    assert response.status_code == 401


def test_restore_file_not_found(
    client,
    auth_headers,
):
    response = client.put(
        "/files/restore/999999",
        headers=auth_headers,
    )

    assert response.status_code == 404
    assert response.json()["message"] == "File not found in trash"


def test_restore_file_not_in_trash(
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

    # File is not deleted
    response = client.put(
        f"/files/restore/{file.id}",
        headers=auth_headers,
    )

    assert response.status_code == 404
    assert response.json()["message"] == "File not found in trash"