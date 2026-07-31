def test_register_success(client):
    response = client.post(
        "/users/register",
        json={
            "name": "Akash",
            "email": "akash@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "id" in data
    assert data["name"] == "Akash"
    assert data["email"] == "akash@example.com"

def test_register_duplicate_email(client):
    payload = {
        "name": "Akash",
        "email": "akash@example.com",
        "password": "password123",
    }

    first = client.post("/users/register", json=payload)
    assert first.status_code == 200

    second = client.post("/users/register", json=payload)

    assert second.status_code == 400

    data = second.json()

    assert data["success"] is False
    assert data["status"] == 400
    assert data["message"] == "Email already registered"

# def test_register_duplicate_email(client):
#     payload = {
#         "name": "Akash",
#         "email": "akash@example.com",
#         "password": "password123",
#     }

#     first = client.post("/users/register", json=payload)
#     assert first.status_code == 200

#     second = client.post("/users/register", json=payload)

#     assert second.status_code == 400
#     assert second.json()["detail"] == "Email already registered"


def test_register_invalid_email(client):
    response = client.post(
        "/users/register",
        json={
            "name": "Akash",
            "email": "not-an-email",
            "password": "password123",
        },
    )

    assert response.status_code == 422


def test_register_missing_name(client):
    response = client.post(
        "/users/register",
        json={
            "email": "akash@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 422


def test_register_missing_email(client):
    response = client.post(
        "/users/register",
        json={
            "name": "Akash",
            "password": "password123",
        },
    )

    assert response.status_code == 422


def test_register_missing_password(client):
    response = client.post(
        "/users/register",
        json={
            "name": "Akash",
            "email": "akash@example.com",
        },
    )

    assert response.status_code == 422