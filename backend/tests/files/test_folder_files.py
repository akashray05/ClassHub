from tests.factories.file_factory import create_file
from tests.factories.folder_factory import create_folder


def test_get_folder_files_success(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    create_file(
        db=db,
        owner=db_user,
        folder=folder,
        original_name="file1.pdf",
    )

    create_file(
        db=db,
        owner=db_user,
        folder=folder,
        original_name="file2.pdf",
    )

    response = client.get(
        f"/files/folder/{folder.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 2
    assert len(data["files"]) == 2


def test_get_folder_files_empty(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    response = client.get(
        f"/files/folder/{folder.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
    assert data["files"] == []


def test_get_folder_files_folder_not_found(
    client,
    auth_headers,
):
    response = client.get(
        "/files/folder/999999",
        headers=auth_headers,
    )

    assert response.status_code == 404


def test_get_folder_files_without_token(
    client,
):
    response = client.get("/files/folder/1")

    assert response.status_code == 401


def test_get_folder_files_invalid_token(
    client,
):
    response = client.get(
        "/files/folder/1",
        headers={
            "Authorization": "Bearer invalid_token",
        },
    )

    assert response.status_code == 401


def test_get_folder_files_excludes_deleted_files(
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
        original_name="deleted.pdf",
    )

    client.delete(
        f"/files/{file.id}",
        headers=auth_headers,
    )

    response = client.get(
        f"/files/folder/{folder.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
