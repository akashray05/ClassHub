# ClassHub API Documentation

## Authentication

POST /users/register

Registers a new user.

---

POST /auth/login

Returns

- Access Token
- Refresh Token

---

GET /users/me

Returns current logged-in user.

---

GET /users/storage

Returns

- Used Storage
- Available Storage
- Quota
- Usage Percentage

---

## Files

POST /files/upload

Upload file.

GET /files/

List files.

GET /files/{id}/download

Download file.

DELETE /files/{id}

Move file to trash.

POST /files/{id}/restore

Restore deleted file.

DELETE /files/{id}/permanent

Permanently delete file.