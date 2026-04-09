import structlog
import time
from fastapi import Request
from fastapi.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Awaitable, Callable

from app.metrics import REQUESTS_TOTAL, REQUEST_DURATION

logger = structlog.get_logger(__name__)

class RequestLoggerMiddleware(BaseHTTPMiddleware):
    """
    Logs inbound execution paths via Structlog and tracks lifecycle latency metrics via Prometheus.
    """
    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable]) -> Response:
        
        # Don't clutter logs with intense load on probe paths
        if request.url.path in ("/health", "/metrics"):
            return await call_next(request)

        start_time = time.perf_counter()
        
        try:
            response = await call_next(request)
            process_time = time.perf_counter() - start_time
            
            logger.info(
                "Request handled",
                method=request.method,
                path=request.url.path,
                status=response.status_code,
                duration_sec=round(process_time, 4)
            )
            
            REQUESTS_TOTAL.labels(
                method=request.method,
                endpoint=request.url.path,
                status=response.status_code
            ).inc()
            
            REQUEST_DURATION.labels(endpoint=request.url.path).observe(process_time)
            
            return response
            
        except Exception as e:
            # Trapped by error handler right after, but log latency till crash
            process_time = time.perf_counter() - start_time
            logger.error("Request failed during processing", duration_sec=round(process_time, 4))
            
            REQUESTS_TOTAL.labels(
                method=request.method,
                endpoint=request.url.path,
                status=500
            ).inc()
            
            raise
