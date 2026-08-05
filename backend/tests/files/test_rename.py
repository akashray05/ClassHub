from io import BytesIO

from app.models.file import File
from tests.factories.file_factory import create_file
from tests.factories.folder_factory import create_folder

# def test_rename_file_success(
#     client,
#     db,
#     db_user,
#     auth_headers,
# ):
#     folder = create_folder(
#         db=db,
#         owner=db_user,
#     )


#     upload = client.post(
#         f"/files/upload?folder_id={folder.id}",
#         headers=auth_headers,
#         files={
#             "file": (
#                 "old_name.txt",
#                 BytesIO(b"Hello"),
#                 "text/plain",
#             )
#         },
#     )

#     assert upload.status_code == 200

#     file_id = upload.json()["id"]

#     response = client.put(
#         f"/files/{file_id}",
#         headers=auth_headers,
#         json={
#             "original_name": "new_name.txt",
#         },
#     )

#     assert response.status_code == 200

#     data = response.json()

#     assert data["original_name"] == "new_name.txt"

#     db.refresh(
#         db.query(File).filter(File.id == file_id).first()
#     )

#     db_file = (
#         db.query(File)
#         .filter(File.id == file_id)
#         .first()
#     )

#     assert db_file.original_name == "new_name.txt"


def test_rename_file_success(
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

    response = client.put(
        f"/files/{file.id}",
        headers=auth_headers,
        json={
            "original_name": "new_name.txt",
        },
    )

    assert response.status_code == 200

    db.refresh(file)

    assert file.original_name == "new_name.txt"


def test_rename_without_token(
    client,
    db,
    db_user,
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

    response = client.put(
        f"/files/{file.id}",
        json={
            "original_name": "new_name.txt",
        },
    )

    assert response.status_code == 401
    # Upload won't work without auth, so create a file another way if needed.
    # Simpler approach: use an existing fixture later.


def test_rename_file_not_found(
    client,
    auth_headers,
):
    response = client.put(
        "/files/999999",
        headers=auth_headers,
        json={
            "original_name": "new.txt",
        },
    )

    assert response.status_code == 404
    assert response.json()["message"] == "File not found"


def test_rename_invalid_token(
    client,
):
    response = client.put(
        "/files/1",
        headers={
            "Authorization": "Bearer invalidtoken",
        },
        json={
            "original_name": "new.txt",
        },
    )

    assert response.status_code == 401
