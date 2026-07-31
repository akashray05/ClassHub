from tests.factories.folder_factory import create_folder
from tests.factories.file_factory import create_file


def test_delete_file_success(
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
        f"/files/{file.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["message"] == "File moved to trash successfully"

    db.refresh(file)

    assert file.is_deleted is True
    assert file.deleted_at is not None

def test_delete_without_token(
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

    response = client.delete(
        f"/files/{file.id}",
    )

    assert response.status_code == 401

def test_delete_invalid_token(
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

    response = client.delete(
        f"/files/{file.id}",
        headers={
            "Authorization": "Bearer invalid_token",
        },
    )

    assert response.status_code == 401

def test_delete_file_not_found(
    client,
    auth_headers,
):
    response = client.delete(
        "/files/999999",
        headers=auth_headers,
    )

    assert response.status_code == 404
    assert response.json()["message"] == "File not found"