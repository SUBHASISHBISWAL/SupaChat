from fastapi import APIRouter
from pydantic import BaseModel

class HealthStatus(BaseModel):
    status: str
    version: str = "1.0.0"

router = APIRouter(tags=["health"])

@router.get("/health", response_model=HealthStatus)
async def check_health() -> HealthStatus:
    """Liveness probe for infrastructure routing."""
    return HealthStatus(status="healthy")
