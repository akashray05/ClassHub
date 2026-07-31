from tests.factories.folder_factory import create_folder
from tests.factories.file_factory import create_file


def test_shared_by_me_success(
    client,
    db,
    db_user,
    second_user,
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
        original_name="notes.pdf",
    )

    response = client.post(
        f"/files/{file.id}/share",
        headers=auth_headers,
        json={
            "shared_with_id": second_user.id,
            "can_download": True,
        },
    )

    assert response.status_code == 200

    response = client.get(
        "/files/shared-by-me",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["file_id"] == file.id
    assert data[0]["original_name"] == "notes.pdf"
    assert len(data[0]["shared_with"]) == 1
    assert data[0]["shared_with"][0]["email"] == second_user.email


def test_shared_by_me_without_token(
    client,
):
    response = client.get("/files/shared-by-me")

    assert response.status_code == 401


def test_shared_by_me_invalid_token(
    client,
):
    response = client.get(
        "/files/shared-by-me",
        headers={
            "Authorization": "Bearer invalid_token",
        },
    )

    assert response.status_code == 401


def test_shared_by_me_empty(
    client,
    auth_headers,
):
    response = client.get(
        "/files/shared-by-me",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json() == []