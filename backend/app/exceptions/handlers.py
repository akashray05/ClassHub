from datetime import UTC, datetime

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from ..core.logger import logger


def register_exception_handlers(app: FastAPI):
    """
    Register all global exception handlers.
    """

    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request,
        exc: HTTPException,
    ):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "status": exc.status_code,
                "message": exc.detail,
                "timestamp": datetime.now(UTC).isoformat(),
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "status": 422,
                "message": "Validation failed",
                "errors": exc.errors(),
                "timestamp": datetime.now(UTC).isoformat(),
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(
        request: Request,
        exc: Exception,
    ):
        # This used to swallow every unhandled exception silently —
        # no console output, nothing in logs/classhub.log. Now it's
        # logged with a full traceback before the generic 500 goes
        # back to the client, so future crashes are actually visible.
        logger.error(
            f"Unhandled exception on {request.method} {request.url.path}",
            exc_info=exc,
        )

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "status": 500,
                "message": "Internal Server Error",
                "timestamp": datetime.now(UTC).isoformat(),
            },
        )
