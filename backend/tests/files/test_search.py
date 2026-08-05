from tests.factories.file_factory import create_file
from tests.factories.folder_factory import create_folder


def test_search_success(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(db=db, owner=db_user)

    create_file(
        db=db,
        owner=db_user,
        folder=folder,
        original_name="physics_notes.pdf",
    )

    create_file(
        db=db,
        owner=db_user,
        folder=folder,
        original_name="chemistry.pdf",
    )

    response = client.get(
        "/files/search?q=physics",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["files"][0]["original_name"] == "physics_notes.pdf"


def test_search_no_results(
    client,
    auth_headers,
):
    response = client.get(
        "/files/search?q=does_not_exist",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
    assert data["files"] == []


def test_search_without_token(
    client,
):
    response = client.get("/files/search?q=test")

    assert response.status_code == 401


def test_search_invalid_token(
    client,
):
    response = client.get(
        "/files/search?q=test",
        headers={
            "Authorization": "Bearer invalid_token",
        },
    )

    assert response.status_code == 401


def test_search_only_current_user_files(
    client,
    db,
    db_user,
    second_user,
    auth_headers,
    second_auth_headers,
):
    folder1 = create_folder(db=db, owner=db_user)
    folder2 = create_folder(db=db, owner=second_user)

    create_file(
        db=db,
        owner=db_user,
        folder=folder1,
        original_name="mine.pdf",
    )

    create_file(
        db=db,
        owner=second_user,
        folder=folder2,
        original_name="mine.pdf",
    )

    response = client.get(
        "/files/search?q=mine",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["files"][0]["owner_id"] == db_user.id


def test_search_excludes_deleted_files(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(db=db, owner=db_user)

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
        "/files/search?q=deleted",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
