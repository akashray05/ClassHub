def test_get_me_success(client, auth_headers):
    response = client.get(
        "/users/me",
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Akash"
    assert data["email"] == "akash@example.com"
    assert "id" in data


def test_get_me_without_token(client):
    response = client.get("/users/me")

    assert response.status_code == 401


def test_get_me_invalid_token(client):
    response = client.get(
        "/users/me",
        headers={
            "Authorization": "Bearer invalid-token"
        },
    )

    assert response.status_code == 401