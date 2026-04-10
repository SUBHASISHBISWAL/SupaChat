from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app
import structlog
import logging
from fastmcp import FastMCP

from app.config import get_settings
from app.routers import chat, history, health
from app.middleware.error_handler import GlobalErrorMiddleware
from app.middleware.request_logger import RequestLoggerMiddleware
from app.services.database_client import db_client

# -----------------------------------------------------------------------------
# Global Logger configuration (Structlog)
# -----------------------------------------------------------------------------
structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
)
logging.basicConfig(format="%(message)s", level=get_settings().LOG_LEVEL)
logger = structlog.get_logger(__name__)

# -----------------------------------------------------------------------------
# App Initialization
# -----------------------------------------------------------------------------
app = FastAPI(title="SupaChat API", version="1.0.0")
settings = get_settings()

# Middlewares
app.add_middleware(RequestLoggerMiddleware)
app.add_middleware(GlobalErrorMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core Routers
app.include_router(chat.router)
app.include_router(history.router)
app.include_router(health.router)

# -----------------------------------------------------------------------------
# Prometheus Metrics Endpoint
# -----------------------------------------------------------------------------
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# -----------------------------------------------------------------------------
# MCP Server Integration (Model Context Protocol) 
# Provides LLM tooling endpoint natively without JS bridges
# -----------------------------------------------------------------------------
mcp = FastMCP("SupaChat Database")

@mcp.tool()
async def query_blog_analytics_db(sql: str) -> list[dict]:
    """Execute a read-only SQL query against the blog analytics database to return JSON charts."""
    return db_client.execute_read_only_query(sql)

app.mount("/mcp", mcp.http_app())

logger.info("Application starting up...", environment=settings.ENVIRONMENT, port=settings.PORT)
