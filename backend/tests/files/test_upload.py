from io import BytesIO

from tests.factories.folder_factory import create_folder

from app.models.file import File


from app.models.user import User


def test_upload_success(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    response = client.post(
        f"/files/upload?folder_id={folder.id}",
        headers=auth_headers,
        files={
            "file": (
                "notes.txt",
                BytesIO(b"Hello ClassHub"),
                "text/plain",
            )
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["original_name"] == "notes.txt"
    assert data["folder_id"] == folder.id
    assert data["owner_id"] == db_user.id
    assert data["file_size"] > 0
    assert data["stored_name"] != ""


def test_upload_without_token(client):
    response = client.post(
        "/files/upload?folder_id=1",
        files={
            "file": (
                "notes.txt",
                BytesIO(b"hello"),
                "text/plain",
            )
        },
    )

    assert response.status_code == 401



def test_upload_invalid_token(client):
    response = client.post(
        "/files/upload?folder_id=1",
        headers={
            "Authorization": "Bearer invalidtoken"
        },
        files={
            "file": (
                "notes.txt",
                BytesIO(b"hello"),
                "text/plain",
            )
        },
    )

    assert response.status_code == 401



# def test_upload_folder_not_found(
#     client,
#     auth_headers,
# ):
#     response = client.post(
#         "/files/upload?folder_id=999999",
#         headers=auth_headers,
#         files={
#             "file": (
#                 "notes.txt",
#                 BytesIO(b"hello"),
#                 "text/plain",
#             )
#         },
#     )

#     assert response.status_code == 404
#     assert response.json()["detail"] == "Folder not found"
def test_upload_folder_not_found(
    client,
    auth_headers,
):
    response = client.post(
        "/files/upload?folder_id=999999",
        headers=auth_headers,
        files={
            "file": (
                "notes.txt",
                BytesIO(b"hello"),
                "text/plain",
            )
        },
    )

    print(response.status_code)
    print(response.text)

    assert response.status_code == 404



def test_upload_storage_quota_exceeded(
    client,
    db,
    db_user,
    auth_headers,
):
    from tests.factories.folder_factory import create_folder

    folder = create_folder(
        db=db,
        owner=db_user,
    )

    # Force user to have no free storage
    db_user.storage_used = db_user.storage_quota
    db.commit()
    db.refresh(db_user)

    response = client.post(
        f"/files/upload?folder_id={folder.id}",
        headers=auth_headers,
        files={
            "file": (
                "notes.txt",
                BytesIO(b"hello"),
                "text/plain",
            )
        },
    )

    assert response.status_code == 413
    assert response.json()["message"] == "Storage quota exceeded"    
    # print(response.status_code)
    # print(response.text)
# # or
# print(response.json())



def test_file_saved_in_database(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    filename = "database_test.txt"

    response = client.post(
        f"/files/upload?folder_id={folder.id}",
        headers=auth_headers,
        files={
            "file": (
                filename,
                BytesIO(b"Database Test"),
                "text/plain",
            )
        },
    )

    assert response.status_code == 200

    db_file = (
        db.query(File)
        .filter(File.original_name == filename)
        .first()
    )

    assert db_file is not None
    assert db_file.owner_id == db_user.id
    assert db_file.folder_id == folder.id



def test_storage_used_updated(
    client,
    db,
    db_user,
    auth_headers,
):
    folder = create_folder(
        db=db,
        owner=db_user,
    )

    before = db_user.storage_used

    response = client.post(
        f"/files/upload?folder_id={folder.id}",
        headers=auth_headers,
        files={
            "file": (
                "quota_test.txt",
                BytesIO(b"1234567890"),
                "text/plain",
            )
        },
    )

    assert response.status_code == 200

    db.refresh(db_user)

    assert db_user.storage_used > before