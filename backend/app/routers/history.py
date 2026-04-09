from fastapi import APIRouter
from typing import List

from app.models.schemas import HistoryEntry
from app.services.history_store import history_service

router = APIRouter(prefix="/api/history", tags=["history"])

@router.get("", response_model=List[HistoryEntry])
async def get_chat_history() -> List[HistoryEntry]:
    """Retrieve all chat sessions maintained in the current active worker."""
    return history_service.get_all()

@router.delete("", status_code=204)
async def clear_chat_history() -> None:
    """Wipes the session history clean."""
    history_service.clear()
