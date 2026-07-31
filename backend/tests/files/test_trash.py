from tests.factories.folder_factory import create_folder
from tests.factories.file_factory import create_file


def test_get_trash_success(
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
        original_name="trash.txt",
    )

    response = client.delete(
        f"/files/{file.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    response = client.get(
        "/files/trash",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert len(data["files"]) == 1
    assert data["files"][0]["original_name"] == "trash.txt"


def test_get_trash_empty(
    client,
    auth_headers,
):
    response = client.get(
        "/files/trash",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
    assert data["files"] == []


def test_get_trash_without_token(
    client,
):
    response = client.get("/files/trash")

    assert response.status_code == 401


def test_get_trash_invalid_token(
    client,
):
    response = client.get(
        "/files/trash",
        headers={
            "Authorization": "Bearer invalid_token",
        },
    )

    assert response.status_code == 401


def test_get_trash_only_current_user_files(
    client,
    db,
    db_user,
    second_user,
    auth_headers,
    second_auth_headers,
):
    folder1 = create_folder(db=db, owner=db_user)
    folder2 = create_folder(db=db, owner=second_user)

    file1 = create_file(
        db=db,
        owner=db_user,
        folder=folder1,
        original_name="mine.txt",
    )

    file2 = create_file(
        db=db,
        owner=second_user,
        folder=folder2,
        original_name="other.txt",
    )

    client.delete(
        f"/files/{file1.id}",
        headers=auth_headers,
    )

    client.delete(
        f"/files/{file2.id}",
        headers=second_auth_headers,
    )

    response = client.get(
        "/files/trash",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["files"][0]["original_name"] == "mine.txt"