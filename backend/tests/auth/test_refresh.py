def test_refresh_success(client, login_response):
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": login_response["refresh_token"]},
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"

    # Token rotation
    assert data["refresh_token"] != login_response["refresh_token"]


def test_refresh_invalid_token(client):
    response = client.post(
        "/auth/refresh",
        json={"refresh_token": "invalid-token"},
    )

    assert response.status_code == 401


def test_refresh_missing_token(client):
    response = client.post(
        "/auth/refresh",
        json={},
    )

    assert response.status_code == 422


def test_refresh_reuse_old_token(client, login_response):
    first = client.post(
        "/auth/refresh",
        json={"refresh_token": login_response["refresh_token"]},
    )

    assert first.status_code == 200

    second = client.post(
        "/auth/refresh",
        json={"refresh_token": login_response["refresh_token"]},
    )

    assert second.status_code == 401
