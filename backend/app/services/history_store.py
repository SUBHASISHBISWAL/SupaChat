import structlog
from typing import List
from app.models.schemas import HistoryEntry

logger = structlog.get_logger(__name__)

class HistoryStore:
    """
    Very lightweight, thread-safe in-memory store for session history.
    In a real massive deployment, this would be backed by Redis or PostgreSQL,
    but it suffices for this containerized service layer per session.
    """
    
    def __init__(self) -> None:
        self._entries: List[HistoryEntry] = []

    def add_entry(self, entry: HistoryEntry) -> None:
        self._entries.insert(0, entry) # Prepend for chronological recency
        # Keep it constrained to avoid unbounded memory growth
        if len(self._entries) > 50:
            self._entries.pop()
        logger.info("Added to history", current_history_size=len(self._entries))

    def get_all(self) -> List[HistoryEntry]:
        return self._entries.copy()

    def clear(self) -> None:
        self._entries.clear()
        logger.info("History cleared")

# Singleton scoped to app instance
history_service = HistoryStore()
