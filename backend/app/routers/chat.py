from fastapi import APIRouter, HTTPException
import uuid
import time
import structlog

from app.models.schemas import ChatRequest, ChatResponse, HistoryEntry
from app.services.query_translator import translator_service
from app.services.database_client import db_client
from app.services.response_formatter import formatter_service
from app.services.history_store import history_service
from app.metrics import LLM_DURATION, QUERY_DURATION, ACTIVE_REQUESTS

logger = structlog.get_logger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("", response_model=ChatResponse)
async def process_chat_message(request: ChatRequest) -> ChatResponse:
    """
    Core pipeline:
    1. Triggers HF LLM to translate natural language into SQL.
    2. Runs the SQL generated safely against Supabase.
    3. Formats results into UI-consumable shape (Chart vs Table vs Text).
    4. Saves state to History Store.
    """
    interaction_id = str(uuid.uuid4())
    logger = structlog.get_logger(__name__).bind(interaction_id=interaction_id)
    ACTIVE_REQUESTS.inc()
    
    try:
        # Step 1: NL -> SQL using HuggingFace
        start_llm = time.perf_counter()
        sql_query = await translator_service.translate_to_sql(request.message)
        LLM_DURATION.observe(time.perf_counter() - start_llm)
        logger.info("Translation complete")
        
        # Step 2: Execute SQL in Supabase safely
        start_db = time.perf_counter()
        db_results = db_client.execute_read_only_query(sql_query)
        QUERY_DURATION.observe(time.perf_counter() - start_db)
        logger.info("Database execution complete")

        # Step 3: Heuristic-based response modeling
        summary_text, chart_config = formatter_service.generate_response_config(
            sql_query, 
            db_results
        )
        logger.info("Formatting complete", chart_type=chart_config.chart_type)

        # Build response schema
        response = ChatResponse(
            id=interaction_id,
            original_message=request.message,
            generated_sql=sql_query,
            summary_text=summary_text,
            data=db_results,
            chart_config=chart_config
        )

        # Step 4: Persist in history state
        history_service.add_entry(HistoryEntry(**response.model_dump()))

        return response
        
    except ValueError as ve:
        # Validation or Security Rejection
        logger.warning("Request rejected safely", reason=str(ve))
        raise HTTPException(status_code=400, detail=str(ve)) from ve
    except RuntimeError as re:
        # Downstream dependency failure
        logger.error("Downstream failure", reason=str(re))
        raise HTTPException(status_code=502, detail=str(re)) from re
    except Exception as e:
        logger.exception("Unexpected pipeline failure")
        raise HTTPException(status_code=500, detail="An internal processing error occurred.") from e
    finally:
        ACTIVE_REQUESTS.dec()
