# Architecture Decision Records

---

## ADR-001

Date: 2026-07-27

Decision

Use PostgreSQL instead of SQLite.

Reason

- Better concurrency
- Production ready
- Strong ACID compliance
- Better scalability
- Industry standard

Status

Accepted

---

## ADR-002

Date: 2026-07-27

Decision

Use JWT Access Tokens with Refresh Tokens.

Reason

- Stateless authentication
- Mobile friendly
- Easy API integration
- Supports multiple devices
- Better scalability

Status

Accepted

---

## ADR-003

Date: 2026-07-27

Decision

Store uploaded files on local disk using a storage abstraction layer.

Reason

Allows migration to AWS S3, MinIO, or Google Cloud Storage later without changing business logic.

Status

Accepted
