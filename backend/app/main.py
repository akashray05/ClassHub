from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, auth

from .database.base import Base
from .database.session import engine
from .exceptions.handlers import register_exception_handlers
# import backend.app.models
from .models import file, folder, user
from .routers import files, folders, users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ClassHub API", version="1.0.0", description="Backend API for ClassHub"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register global exception handlers
register_exception_handlers(app)

# Routers

app.include_router(users.router)
app.include_router(folders.router)
app.include_router(files.router)
app.include_router(auth.router)
app.include_router(admin.router)


@app.get("/")
def home():
    return {"message": "Welcome to ClassHub 🚀"}


@app.get("/health")
def health():
    return {"status": "OK"}


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
