from tests.factories.folder_factory import create_folder
from tests.factories.file_factory import create_file
from io import BytesIO
from pathlib import Path



def test_download_file_not_found(
    client,
    auth_headers,
):
    response = client.get(
        "/files/download/999999",
        headers=auth_headers,
    )

    assert response.status_code == 404
    assert response.json()["message"] == "File not found"




def test_download_success(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    # Upload a real file (creates both DB record and file on disk)
    upload = client.post(
        f"/files/upload?folder_id={folder.id}",
        headers=auth_headers,
        files={
            "file": (
                "download_test.txt",
                BytesIO(b"Hello Download"),
                "text/plain",
            )
        },
    )

    assert upload.status_code == 200

    file_id = upload.json()["id"]

    response = client.get(
        f"/files/download/{file_id}",
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.content == b"Hello Download"



def test_download_missing_file_from_storage(
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

    # Remove the physical file if it exists
    Path(file.file_path).unlink(missing_ok=True)

    response = client.get(
        f"/files/download/{file.id}",
        headers=auth_headers,
    )

    assert response.status_code == 404
    assert response.json()["message"] == "File missing from storage"