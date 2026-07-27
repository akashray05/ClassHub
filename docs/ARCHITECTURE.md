# ClassHub Architecture

```
                FastAPI

                    │

          Authentication Router
             Users Router
             Files Router
            Folders Router

                    │

             Service Layer

      Auth Service
      File Service
      Storage Service

                    │

           SQLAlchemy ORM

                    │

              PostgreSQL
```

Storage

```
Client

↓

FastAPI

↓

Storage Service

↓

Local Disk
```

Future

```
Storage Service

↓

AWS S3

or

MinIO

or

Google Cloud Storage
```