from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    """Payload for submitting a natural language query."""
    message: str = Field(..., min_length=1, max_length=500, description="The natural language question to translate to SQL.")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "message": "Show top trending topics in last 30 days"
            }
        }
    )

class ChartConfig(BaseModel):
    """Configuration required by the frontend to render Recharts dynamically."""
    chart_type: str = Field(..., description="Type of chart: bar_chart, line_chart, pie_chart, table, or text")
    x_axis_key: Optional[str] = Field(None, description="The property to map to the X axis")
    y_axis_keys: Optional[List[str]] = Field(None, description="The properties to map to the Y axis/series")

class ChatResponse(BaseModel):
    """Payload sent back to the client after query execution."""
    id: str = Field(..., description="Unique identifier for the interaction")
    original_message: str = Field(..., description="The user's original natural language prompt")
    generated_sql: str = Field(..., description="The executed SQL query (SELECT only)")
    summary_text: str = Field(..., description="A brief plain English summary of the results")
    data: List[Dict[str, Any]] = Field(..., description="The raw JSON results from the database")
    chart_config: ChartConfig = Field(..., description="Details on how to visualize the data")
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class HistoryEntry(ChatResponse):
    """Extends ChatResponse to represent a stored historical interaction."""
    pass
