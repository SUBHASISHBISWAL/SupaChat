from supabase import create_client, Client
from pydantic import ValidationError
from typing import List, Dict, Any
import structlog
from app.config import get_settings

logger = structlog.get_logger(__name__)

class DatabaseClient:
    """Supabase client specifically tailored for safe, read-only analytics querying."""
    
    def __init__(self) -> None:
        settings = get_settings()
        self._supabase: Client = create_client(
            supabase_url=settings.SUPABASE_URL,
            supabase_key=settings.SUPABASE_SERVICE_KEY
        )

    def execute_read_only_query(self, sql_query: str) -> List[Dict[str, Any]]:
        """
        Executes a raw SQL statement against the Supabase database.
        Relies on the 'execute_readonly_query' RPC function deployed in Supabase
        which guarantees safety by preventing DML/DDL.
        """
        logger.info("Executing analytical query", query=sql_query)

        # Pre-validate structure before network request
        cleaned_query = sql_query.strip().strip(";")
        if not cleaned_query.lower().startswith("select"):
            logger.error("Query rejected before dispatch: Did not start with SELECT", query=cleaned_query)
            raise ValueError("Access Denied: Only SELECT analytics queries are permitted.")
            
        try:
            # We call our predefined stored procedure rather than trying unsupported direct execution
            response = self._supabase.rpc(
                "execute_readonly_query", 
                {"query_text": cleaned_query}
            ).execute()
            
            # The RPC is designed to always return JSON (or an array)
            results = response.data if response.data is not None else []
            logger.info("Query execution successful", result_count=len(results))
            return results
            
        except Exception as err:
            logger.exception("Database query execution failed", error_message=str(err))
            raise RuntimeError(f"Data Source Error: {err}") from err

# Singleton instance for dependency injection
db_client = DatabaseClient()
