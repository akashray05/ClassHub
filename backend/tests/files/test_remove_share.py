from tests.factories.file_factory import create_file
from tests.factories.folder_factory import create_folder


def test_remove_share_success(
    client,
    db,
    db_user,
    second_user,
    auth_headers,
):
    folder = create_folder(db=db, owner=db_user)

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

    response = client.delete(
        f"/files/share/{file.id}/{second_user.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Access revoked successfully."


def test_remove_share_without_token(client):
    response = client.delete("/files/share/1/1")

    assert response.status_code == 401


def test_remove_share_invalid_token(client):
    response = client.delete(
        "/files/share/1/1",
        headers={"Authorization": "Bearer invalid_token"},
    )

    assert response.status_code == 401


def test_remove_share_not_found(
    client,
    auth_headers,
):
    response = client.delete(
        "/files/999/share/999",
        headers=auth_headers,
    )

    assert response.status_code in (404, 403)
