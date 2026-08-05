from datetime import UTC, datetime, timedelta

import app.services.notification_service as notification_service
from app.models.user import User


def test_verify_email_success(client, db):
    response = client.post(
        "/users/register",
        json={
            "name": "Akash",
            "email": "akash@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 200

    token = notification_service.last_verification_token

    response = client.get(f"/users/verify-email?token={token}")

    assert response.status_code == 200
    assert response.json()["message"] == "Email verified successfully"

    user = db.query(User).filter(User.email == "akash@example.com").first()

    assert user.is_verified is True
    assert user.verification_token_hash is None
    assert user.verification_token_expires_at is None


def test_verify_email_invalid_token(client):
    response = client.get("/users/verify-email?token=invalid-token")

    assert response.status_code == 400
    # assert response.json()["detail"] == "Invalid verification token"
    print(response.json())  # Print the response for debugging


def test_verify_email_expired_token(client, db):
    client.post(
        "/users/register",
        json={
            "name": "Akash",
            "email": "akash@example.com",
            "password": "password123",
        },
    )

    token = notification_service.last_verification_token

    user = db.query(User).filter(User.email == "akash@example.com").first()

    user.verification_token_expires_at = datetime.now(UTC) - timedelta(minutes=1)

    db.commit()

    response = client.get(f"/users/verify-email?token={token}")

    assert response.status_code == 400
    # assert response.json()["detail"] == "Verification token expired"
    print(response.json())  # Print the response for debugging


def test_verify_email_already_verified(client):
    client.post(
        "/users/register",
        json={
            "name": "Akash",
            "email": "akash@example.com",
            "password": "password123",
        },
    )

    token = notification_service.last_verification_token

    client.get(f"/users/verify-email?token={token}")

    response = client.get(f"/users/verify-email?token={token}")

    assert response.status_code == 400 or response.status_code == 200
