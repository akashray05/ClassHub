from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pathlib import Path
from sqlalchemy.orm import Session

from .config import settings
from ..database.session import get_db
from ..models.user import User

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="users/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise credentials_exception

    return user
# import os
# from pathlib import Path
# from dotenv import load_dotenv
# from datetime import datetime, timedelta, timezone

# from jose import jwt
# from passlib.context import CryptContext
# from .config import settings

# from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer
# from jose import JWTError

# from ..database.session import get_db
# from ..models.user import User
# from sqlalchemy.orm import Session

# BASE_DIR = Path(__file__).resolve().parent.parent
# load_dotenv(BASE_DIR / ".env")





# # Password hashing
# pwd_context = CryptContext(
#     schemes=["bcrypt"],
#     deprecated="auto"
# )

# SECRET_KEY = settings.SECRET_KEY
# ALGORITHM = settings.ALGORITHM
# ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# # JWT settings
# # SECRET_KEY = "CHANGE_THIS_TO_A_RANDOM_SECRET_KEY"
# # ALGORITHM = "HS256"
# # ACCESS_TOKEN_EXPIRE_MINUTES = 60

# # SECRET_KEY = os.getenv("SECRET_KEY")

# # ALGORITHM = os.getenv("ALGORITHM")

# # ACCESS_TOKEN_EXPIRE_MINUTES = int(
# #     os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
# # )


# def hash_password(password: str):
#     return pwd_context.hash(password)


# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(
#         plain_password,
#         hashed_password
#     )


# def create_access_token(data: dict):
#     to_encode = data.copy()

#     expire = datetime.now(timezone.utc) + timedelta(
#         minutes=ACCESS_TOKEN_EXPIRE_MINUTES
#     )

#     to_encode.update({"exp": expire})

#     return jwt.encode(
#         to_encode,
#         SECRET_KEY,
#         algorithm=ALGORITHM
#     )

#     oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


# def get_current_user(
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db),
# ):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )

#     try:
#         payload = jwt.decode(
#             token,
#             SECRET_KEY,
#             algorithms=[ALGORITHM],
#         )

#         user_id = payload.get("user_id")

#         if user_id is None:
#             raise credentials_exception

#     except JWTError:
#         raise credentials_exception

#     user = db.query(User).filter(User.id == user_id).first()

#     if user is None:
#         raise credentials_exception

#     return user

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")


# def get_current_user(
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db),
# ):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )

#     try:
#         payload = jwt.decode(
#             token,
#             SECRET_KEY,
#             algorithms=[ALGORITHM],
#         )

#         email = payload.get("sub")

#         if email is None:
#             raise credentials_exception

#     except JWTError:
#         raise credentials_exception

#     user = (
#         db.query(User)
#         .filter(User.email == email)
#         .first()
#     )

#     if user is None:
#         raise credentials_exception

#     return user