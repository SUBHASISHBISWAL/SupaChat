import structlog
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Awaitable, Callable

logger = structlog.get_logger(__name__)

class GlobalErrorMiddleware(BaseHTTPMiddleware):
    """
    Catches completely unhandled exceptions, sanitizes them, 
    and logs them without leaking core abstractions to clients.
    """
    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable]) -> JSONResponse:
        try:
            return await call_next(request)
        except Exception as e:
            logger.exception("Unhandled server exception trapped globally", uri=str(request.url))
            return JSONResponse(
                status_code=500,
                content={"detail": "A secure internal error occurred and has been logged."}
            )
