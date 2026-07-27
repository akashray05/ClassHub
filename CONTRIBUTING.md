# Contributing to ClassHub

Thank you for your interest in contributing.

## Development Setup

Clone the repository

```bash
git clone <repository-url>
```

Create virtual environment

```bash
python -m venv backend/venv
```

Activate

Linux

```bash
source backend/venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run server

```bash
uvicorn backend.app.main:app --reload
```

---

## Coding Standards

- Follow PEP8
- Use type hints
- Keep business logic inside services
- Keep routers lightweight
- Add docstrings
- Write reusable functions

---

## Git Workflow

Create a feature branch

```bash
git checkout -b feature/new-feature
```

Commit clearly

Example

```
feat: add refresh token authentication
```

---

## Pull Requests

Every PR should include

- Description
- Screenshots (if frontend)
- Testing steps
- Related issue