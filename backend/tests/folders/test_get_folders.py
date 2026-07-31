from tests.factories.folder_factory import create_folder


def test_get_folders(client, auth_headers, db, db_user):
    create_folder(
        db=db,
        owner=db_user,
        name="Folder A",
    )

    create_folder(
        db=db,
        owner=db_user,
        name="Folder B",
    )

    response = client.get(
        "/folders/",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2