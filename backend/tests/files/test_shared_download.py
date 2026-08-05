from io import BytesIO

from tests.factories.folder_factory import create_folder


def test_shared_download_success(
    client,
    db,
    db_user,
    second_user,
    auth_headers,
    second_auth_headers,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    upload = client.post(
        f"/files/upload?folder_id={folder.id}",
        headers=auth_headers,
        files={
            "file": (
                "shared.txt",
                BytesIO(b"Shared Content"),
                "text/plain",
            )
        },
    )

    assert upload.status_code == 200

    file_id = upload.json()["id"]

    response = client.post(
        f"/files/{file_id}/share",
        headers=auth_headers,
        json={
            "shared_with_id": second_user.id,
            "can_download": True,
        },
    )

    assert response.status_code == 200

    response = client.get(
        f"/files/shared-download/{file_id}",
        headers=second_auth_headers,
    )

    assert response.status_code == 200
    assert response.content == b"Shared Content"


def test_shared_download_without_token(
    client,
):
    response = client.get("/files/shared-download/1")

    assert response.status_code == 401


def test_shared_download_invalid_token(
    client,
):
    response = client.get(
        "/files/shared-download/1",
        headers={
            "Authorization": "Bearer invalid_token",
        },
    )

    assert response.status_code == 401


def test_shared_download_file_not_found(
    client,
    second_auth_headers,
):
    response = client.get(
        "/files/shared-download/999999",
        headers=second_auth_headers,
    )

    assert response.status_code == 403
