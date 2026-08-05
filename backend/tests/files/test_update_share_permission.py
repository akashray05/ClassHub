from tests.factories.file_factory import create_file
from tests.factories.folder_factory import create_folder


def test_update_share_permission_success(
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
            "can_download": False,
        },
    )

    assert response.status_code == 200

    response = client.patch(
        f"/files/share/{file.id}/{second_user.id}",
        headers=auth_headers,
        json={
            "can_download": True,
        },
    )

    assert response.status_code == 200
    assert response.json()["can_download"] is True


def test_update_share_permission_without_token(
    client,
):
    response = client.patch(
        "/files/share/1/1",
        json={
            "can_download": True,
        },
    )

    assert response.status_code == 401


def test_update_share_permission_invalid_token(
    client,
):
    response = client.patch(
        "/files/share/1/1",
        headers={
            "Authorization": "Bearer invalid_token",
        },
        json={
            "can_download": True,
        },
    )

    assert response.status_code == 401


def test_update_share_permission_not_found(
    client,
    auth_headers,
):
    response = client.patch(
        "/files/share/999/999",
        headers=auth_headers,
        json={
            "can_download": True,
        },
    )

    assert response.status_code in (403, 404)
