# Current Milestone

## ClassHub v1.0 Development

Status: 🚧 In Development

Progress: ~45%

Completed

- User Authentication
- JWT Authentication
- Refresh Tokens
- User Profiles
- Storage Usage
- File Upload
- File Download
- Search
- Pagination
- Folder Management
- Trash System
- Storage Quota
- PostgreSQL Database
- SQLAlchemy ORM
- Alembic Migrations
- Service Layer
- Local Storage Backend

In Progress

- Refresh Endpoint
- Logout
- Session Management

Upcoming

- Password Reset
- Email Verification
- Admin Panel
- Notifications
- File Sharing



# Changelog

All notable changes to this project will be documented in this file.

---

## Version 0.1.0 (Current Development)

### Added

#### Authentication
- User registration
- JWT login
- Refresh token authentication
- Refresh token storage
- Refresh token hashing
- Automatic revocation of old refresh tokens
- OAuth2 Swagger authentication

#### User Management
- User profile endpoint
- Storage usage endpoint

#### File Management
- Upload files
- Download files
- Search files
- Pagination
- Storage abstraction layer

#### Folder Management
- Create folders
- List folders
- Delete folders

#### Trash
- Soft delete
- Restore files
- Permanent delete

#### Storage
- 5 GB storage quota
- Storage usage tracking
- Quota enforcement

#### Infrastructure
- PostgreSQL
- SQLAlchemy ORM
- Alembic migrations
- FastAPI
- Service layer architecture