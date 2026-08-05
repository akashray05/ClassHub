def test_logout_all_success(client, auth_headers, login_response):
    response = client.post(
        "/auth/logout-all",
        headers=auth_headers,
    )

    assert response.status_code == 200

    # Old refresh token should no longer work
    refresh = client.post(
        "/auth/refresh",
        json={"refresh_token": login_response["refresh_token"]},
    )

    assert refresh.status_code == 401


def test_logout_all_without_token(client):
    response = client.post("/auth/logout-all")

    assert response.status_code == 401


def test_logout_all_invalid_token(client):
    response = client.post(
        "/auth/logout-all",
        headers={"Authorization": "Bearer invalid-token"},
    )

    assert response.status_code == 401
