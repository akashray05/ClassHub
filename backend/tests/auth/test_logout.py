def test_logout_success(client, login_response):
    response = client.post(
        "/auth/logout",
        json={
            "refresh_token": login_response["refresh_token"]
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "message" in data

def test_logout_invalid_token(client):
    response = client.post(
        "/auth/logout",
        json={
            "refresh_token": "invalid-token"
        },
    )

    assert response.status_code == 401

def test_logout_twice(client, login_response):
    first = client.post(
        "/auth/logout",
        json={
            "refresh_token": login_response["refresh_token"]
        },
    )

    assert first.status_code == 200

    second = client.post(
        "/auth/logout",
        json={
            "refresh_token": login_response["refresh_token"]
        },
    )

    assert second.status_code == 401


def test_logout_missing_token(client):
    response = client.post(
        "/auth/logout",
        json={}
    )

    assert response.status_code == 422
