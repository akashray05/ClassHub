from app.models.shared_file import SharedFile
from tests.factories.file_factory import create_file
from tests.factories.folder_factory import create_folder


def test_share_file_success(
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
    assert response.json()["message"] == "File shared successfully"

    share = (
        db.query(SharedFile)
        .filter(
            SharedFile.file_id == file.id,
            SharedFile.shared_with_id == second_user.id,
        )
        .first()
    )

    assert share is not None
    assert share.can_download is True


def test_share_without_token(
    client,
    db,
    db_user,
    second_user,
):
    folder = create_folder(db=db, owner=db_user)

    file = create_file(
        db=db,
        owner=db_user,
        folder=folder,
    )

    response = client.post(
        f"/files/{file.id}/share",
        json={
            "shared_with_id": second_user.id,
            "can_download": True,
        },
    )

    assert response.status_code == 401


def test_share_invalid_token(
    client,
    db,
    db_user,
    second_user,
):
    folder = create_folder(db=db, owner=db_user)

    file = create_file(
        db=db,
        owner=db_user,
        folder=folder,
    )

    response = client.post(
        f"/files/{file.id}/share",
        headers={
            "Authorization": "Bearer invalid_token",
        },
        json={
            "shared_with_id": second_user.id,
            "can_download": True,
        },
    )

    assert response.status_code == 401


def test_share_file_not_found(
    client,
    second_user,
    auth_headers,
):
    response = client.post(
        "/files/999999/share",
        headers=auth_headers,
        json={
            "shared_with_id": second_user.id,
            "can_download": True,
        },
    )

    assert response.status_code == 404
    assert response.json()["message"] == "File not found"


def test_share_user_not_found(
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
    )

    response = client.post(
        f"/files/{file.id}/share",
        headers=auth_headers,
        json={
            "shared_with_id": 999999,
            "can_download": True,
        },
    )

    assert response.status_code == 404
    assert response.json()["message"] == "User not found"


def test_share_with_yourself(
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
    )

    response = client.post(
        f"/files/{file.id}/share",
        headers=auth_headers,
        json={
            "shared_with_id": db_user.id,
            "can_download": True,
        },
    )

    assert response.status_code == 400
    assert response.json()["message"] == "You already own this file"


def test_share_duplicate(
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
    )

    payload = {
        "shared_with_id": second_user.id,
        "can_download": True,
    }

    first = client.post(
        f"/files/{file.id}/share",
        headers=auth_headers,
        json=payload,
    )

    assert first.status_code == 200

    second = client.post(
        f"/files/{file.id}/share",
        headers=auth_headers,
        json=payload,
    )

    assert second.status_code == 409
    assert second.json()["message"] == "File already shared with this user"
