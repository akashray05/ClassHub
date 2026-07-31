from uuid import uuid4

from app.models.user import User


def create_user(
    db,
    *,
    name="Test User",
    email=None,
    password="hashed_password",
    is_admin=False,
):
    if email is None:
        email = f"{uuid4().hex}@example.com"

    user = User(
        name=name,
        email=email,
        password=password,
        is_admin=is_admin,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user