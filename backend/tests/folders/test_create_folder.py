def test_create_folder_success(client, auth_headers):
    response = client.post(
        "/folders/",
        headers=auth_headers,
        json={
            "name": "Semester 1",
            "description": "My first folder",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Semester 1"
    assert data["description"] == "My first folder"
    assert "id" in data


def test_create_folder_without_token(client):
    response = client.post(
        "/folders/",
        json={
            "name": "Semester 1",
            "description": "Folder",
        },
    )

    assert response.status_code == 401


def test_create_folder_invalid_token(client):
    response = client.post(
        "/folders/",
        headers={"Authorization": "Bearer invalid-token"},
        json={
            "name": "Semester 1",
            "description": "Folder",
        },
    )

    assert response.status_code == 401


def test_create_folder_missing_name(client, auth_headers):
    response = client.post(
        "/folders/",
        headers=auth_headers,
        json={
            "description": "Folder",
        },
    )

    assert response.status_code == 422
