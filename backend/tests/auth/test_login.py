# def register_user(client):
#     client.post(
#         "/users/register",
#         json={
#             "name": "Akash",
#             "email": "akash@example.com",
#             "password": "password123",
#         },
#     )


def test_login_success(client, registered_user):
    response = client.post(
        "/auth/login",
        data={
            "username": registered_user["email"],
            "password": registered_user["password"],
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, registered_user):
    response = client.post(
        "/auth/login",
        data={
            "username": registered_user["email"],
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401


def test_login_unknown_email(client):
    response = client.post(
        "/auth/login",
        data={
            "username": "unknown@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 401


def test_login_missing_password(client, registered_user):
    response = client.post(
        "/auth/login",
        data={
            "username": registered_user["email"],
        },
    )

    assert response.status_code == 422


def test_login_missing_username(client):
    response = client.post(
        "/auth/login",
        data={
            "password": "password123",
        },
    )

    assert response.status_code == 422
