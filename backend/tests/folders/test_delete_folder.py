def test_delete_folder_success(client, auth_headers, user_folder):
    response = client.delete(
        f"/folders/{user_folder.id}",
        headers=auth_headers,
    )

    assert response.status_code == 200

    assert response.json()["message"] == "Folder deleted successfully"


def test_delete_folder_not_found(client, auth_headers):
    response = client.delete(
        "/folders/99999",
        headers=auth_headers,
    )

    assert response.status_code == 404
