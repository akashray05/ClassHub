# ClassHub

A secure file management and sharing platform built with **FastAPI** and **PostgreSQL**.

ClassHub allows authenticated users to organize files into folders, securely share files with other users, search content, restore deleted files, and manage their own storage.

---

## Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 📁 Folder Management
- 📤 File Upload
- 📥 File Download
- ✏️ File Rename
- 🗑️ Soft Delete & Restore
- ❌ Permanent Delete
- 🔍 File Search
- 🤝 File Sharing
- 👥 Shared With Me
- 📤 Shared By Me
- 🔒 Download Permissions
- 📄 Swagger API Documentation
- ✅ Comprehensive Automated Test Suite

---

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication
- Passlib (bcrypt)

### Testing

- Pytest
- TestClient
- Factory-based Test Data

---

## Project Structure

```
ClassHub/
│
├── backend/
│   ├── app/
│   ├── tests/
│   ├── uploads/
│   └── requirements.txt
│
├── docs/
│
└── README.md
```

---

## Getting Started

### Clone Repository

```bash
git clone git@github.com:akashray05/ClassHub.git
cd ClassHub
```

### Create Virtual Environment

```bash
python -m venv venv
```

Linux/macOS

```bash
source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### Run the Server

```bash
uvicorn backend.app.main:app --reload
```

API Documentation:

```
http://127.0.0.1:8000/docs
```

---

## 🧪 Running Tests

Run all tests:

```bash
pytest
```

Run with coverage:

```bash
pytest --cov=app --cov-report=term-missing
```

---

## 📌 Current Status

- Backend Completed ✅
- Authentication Completed ✅
- File Management Completed ✅
- Sharing System Completed ✅
- Search Completed ✅
- Automated Tests Completed ✅

---

## 🚀 Future Improvements

- Docker
- GitHub Actions (CI/CD)
- React Frontend
- Admin Dashboard
- Email Notifications
- Storage Analytics
- Deployment with Nginx

---

## 👨‍💻 Author

**Akash Ray**

M.Sc. Applied Geophysics  
Indian Institute of Technology Bombay

GitHub:
https://github.com/akashray05

---

## 📄 License

This project is licensed under the MIT License.