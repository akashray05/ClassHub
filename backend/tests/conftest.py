import pytest

from fastapi.testclient import TestClient
from sqlalchemy import text

from app.main import app
from app.database.base import Base
from app.database.session import get_db

from tests.database import (
    engine,
    TestingSessionLocal,
)
from app.models.user import User
from tests.factories.folder_factory import create_folder


@pytest.fixture(scope="session", autouse=True)
def create_tables():
    """
    Create all tables once before the test session.
    Drop them after all tests finish.
    """
    Base.metadata.create_all(bind=engine)

    yield

    Base.metadata.drop_all(bind=engine)


@pytest.fixture(autouse=True)
def clean_database():
    """
    Clean every table before each test.
    """
    db = TestingSessionLocal()

    try:
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(
                text(f'TRUNCATE TABLE "{table.name}" RESTART IDENTITY CASCADE')
            )

        db.commit()

        yield

    finally:
        db.close()


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c



@pytest.fixture
def registered_user(client):
    email = "akash@example.com"
    password = "password123"

    response = client.post(
        "/users/register",
        json={
            "name": "Akash",
            "email": email,
            "password": password,
        },
    )

    assert response.status_code == 200

    user = response.json()

    user["password"] = password

    return user

@pytest.fixture
def login_response(client, registered_user):
    response = client.post(
        "/auth/login",
        data={
            "username": registered_user["email"],
            "password": registered_user["password"],
        },
    )

    assert response.status_code == 200

    return response.json()

@pytest.fixture
def access_token(login_response):
    return login_response["access_token"]


@pytest.fixture
def auth_headers(access_token):
    return {
        "Authorization": f"Bearer {access_token}"
    }


# @pytest.fixture
# def db_user(db):
#     user = User(
#         name="Akash",
#         email="akash@example.com",
#         password="hashed-password",  # Factory doesn't need a real password
#     )

#     db.add(user)
#     db.commit()
#     db.refresh(user)

#     return user

@pytest.fixture
def db_user(db, registered_user):
    return (
        db.query(User)
        .filter(User.email == registered_user["email"])
        .first()
    )

@pytest.fixture
def user_folder(db, db_user):
    return create_folder(
        db=db,
        owner=db_user,
    )

@pytest.fixture
def second_registered_user(client):
    email = "john@example.com"
    password = "password123"

    response = client.post(
        "/users/register",
        json={
            "name": "John",
            "email": email,
            "password": password,
        },
    )

    assert response.status_code == 200

    user = response.json()
    user["password"] = password

    return user


@pytest.fixture
def second_login_response(client, second_registered_user):
    response = client.post(
        "/auth/login",
        data={
            "username": second_registered_user["email"],
            "password": second_registered_user["password"],
        },
    )

    assert response.status_code == 200

    return response.json()


@pytest.fixture
def second_auth_headers(second_login_response):
    return {
        "Authorization": f"Bearer {second_login_response['access_token']}"
    }

@pytest.fixture
def second_user(db, second_registered_user):
    return (
        db.query(User)
        .filter(User.email == second_registered_user["email"])
        .first()
    )