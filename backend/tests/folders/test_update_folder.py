def test_update_folder_success(client, auth_headers, user_folder):
    response = client.put(
        f"/folders/{user_folder.id}",
        headers=auth_headers,
        json={
            "name": "Updated Folder"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Updated Folder"

def test_update_folder_not_found(client, auth_headers):
    response = client.put(
        "/folders/99999",
        headers=auth_headers,
        json={
            "name": "Folder"
        },
    )

    assert response.status_code == 404