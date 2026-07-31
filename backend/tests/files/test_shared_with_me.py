from tests.factories.folder_factory import create_folder
from tests.factories.file_factory import create_file


def test_shared_with_me_success(
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

    file = create_file(
        db=db,
        owner=db_user,
        folder=folder,
        original_name="notes.pdf",
    )

    # Share the file
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
        "/files/shared-with-me",
        headers=second_auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["original_name"] == "notes.pdf"
    assert data[0]["owner_email"] == db_user.email
    assert data[0]["can_download"] is True