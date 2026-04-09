import structlog
import re
from huggingface_hub import AsyncInferenceClient
from huggingface_hub.errors import HfHubHTTPError
from app.config import get_settings

logger = structlog.get_logger(__name__)

# The schema definition helps the LLM ground its generation accurately.
# We limit it to core tables needed for analytics.
DB_SCHEMA_PROMPT = """
You are an expert PostgreSQL data analyst. Your job is to translate a natural language question into a valid, read-only PostgreSQL SELECT query.

Database Schema:
1. topics (id UUID, name VARCHAR)
2. authors (id UUID, first_name VARCHAR, last_name VARCHAR, email VARCHAR)
3. articles (id UUID, title VARCHAR, slug VARCHAR, author_id UUID, topic_id UUID, published_at TIMESTAMPTZ, is_published BOOLEAN)
4. article_views (id UUID, article_id UUID, view_date DATE, view_count INT, unique_visitors INT, avg_time_on_page_seconds INT)
5. article_engagement (id UUID, article_id UUID, likes_count INT, comments_count INT, shares_count INT, bookmarks_count INT)

Rules:
1. ONLY return the raw SQL code. DO NOT include markdown formatting like ```sql or ```.
2. DO NOT include any explanations or apologies.
3. ONLY write SELECT statements. Do not write INSERT/UPDATE/DELETE/DROP.
4. Always end the query with a semicolon.
5. Limit the maximum response size by appending "LIMIT 100" to unaggregated queries.
6. Use appropriate JOINs based on the foreign keys.

Given the schema, generate the SQL for the following question:
"""

class QueryTranslator:
    """Service for converting Natural Language into safe SQL using LLM Inference."""
    
    def __init__(self) -> None:
        settings = get_settings()
        # Initialize an async HTTP client connecting to HF serverless inference
        self._client = AsyncInferenceClient(
            model=settings.HF_MODEL_ID,
            token=settings.HF_TOKEN
        )

    async def translate_to_sql(self, natural_language_query: str) -> str:
        """
        Sends the prompt to a Hugging Face LLM and extracts the SQL.
        """
        logger.info("Translating NL to SQL", original_prompt=natural_language_query)
        
        full_prompt = f"{DB_SCHEMA_PROMPT}\nQuestion: {natural_language_query}\nSQL Query:"
        
        try:
            # We use chat completion layout as instruct models generally prefer it,
            # but wrapping it carefully to ensure raw SQL output.
            messages = [
                {"role": "system", "content": "You output only valid PostgreSQL SELECT queries. No markdown, no explanations."},
                {"role": "user", "content": full_prompt}
            ]
            
            response = await self._client.chat_completion(
                messages,
                max_tokens=300,
                temperature=0.1,  # Low temp for deterministic syntax
                seed=42
            )
            
            # Extract content from response choice
            raw_output = response.choices[0].message.content.strip()
            
            # Cleanup step: if the model leaked markdown backticks despite instructions, strip them
            clensed_sql = re.sub(r'```[sS][qQ][lL]?\s*', '', raw_output)
            clensed_sql = re.sub(r'```\s*$', '', clensed_sql)
            
            final_sql = clensed_sql.strip()
            logger.info("Translation successful", length=len(final_sql))
            return final_sql
            
        except HfHubHTTPError as e:
            logger.exception("HuggingFace Inference API error", detail=str(e))
            raise RuntimeError("LLM translation service is currently unavailable.") from e
        except Exception as e:
            logger.exception("Unexpected error during query translation")
            raise RuntimeError("Failed to translate the query into SQL.") from e

# Instance for DI
translator_service = QueryTranslator()
