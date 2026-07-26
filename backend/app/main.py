from fastapi import FastAPI

from .database.base import Base
from .database.session import engine
# import backend.app.models
from .models import user, folder, file
from .routers import files
from .routers import folders
from .routers import users

from .exceptions.handlers import register_exception_handlers

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ClassHub API",
    version="1.0.0",
    description="Backend API for ClassHub"
)

# Register global exception handlers
register_exception_handlers(app)

# Routers
app.include_router(users.router)
app.include_router(folders.router)
app.include_router(files.router)


@app.get("/")
def home():
    return {
        "message": "Welcome to ClassHub 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "OK"
    }

# from fastapi import FastAPI
# from .routers import files
# from .database.base import Base
# from .database.session import engine
# import backend.app.models
# from .routers import folders
# from .routers import users
# from .exceptions.handlers import register_exception_handlers
# Base.metadata.create_all(bind=engine)

# app = FastAPI(
#     title="ClassHub API",
#     version="1.0.0",
#     description="Backend API for ClassHub"
# )
# app.include_router(files.router)
# app.include_router(users.router)
# app.include_router(folders.router)

# @app.get("/")
# def home():
#     return {
#         "message": "Welcome to ClassHub 🚀"
#     }


# @app.get("/health")
# def health():
#     return {
#         "status": "OK"
#     }
