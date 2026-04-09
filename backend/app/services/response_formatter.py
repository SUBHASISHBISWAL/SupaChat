import structlog
from typing import List, Dict, Any, Tuple
from app.models.schemas import ChartConfig

logger = structlog.get_logger(__name__)

class ResponseFormatter:
    """Analyzes PostgreSQL row data to recommend the optimal UI visualization."""
    
    def generate_response_config(self, original_query: str, data: List[Dict[str, Any]]) -> Tuple[str, ChartConfig]:
        """
        Determines the ChartConfig and a text summary based on data shape 
        and the original user intent.
        """
        if not data:
            return "Try adjusting your query, I found no data matching that request.", ChartConfig(chart_type="text")
            
        keys = list(data[0].keys())
        logger.info("Formatting response", num_rows=len(data), keys=keys)
        
        # 1. Single aggregate value (e.g., SELECT COUNT(*))
        if len(data) == 1 and len(keys) == 1:
            value = data[0][keys[0]]
            summary = f"The {keys[0].replace('_', ' ')} is **{value}**."
            return summary, ChartConfig(chart_type="text")
            
        summary = f"Found {len(data)} results for your analytical query."
        
        # 2. Extract potential axes types
        string_keys = [k for k in keys if isinstance(data[0][k], str)]
        num_keys = [k for k in keys if isinstance(data[0][k], (int, float))]
        
        # 3. Detect Time-series -> Line or Area Chart
        # Heuristic: the word "date", "time", or "day" in the x-axis, or user said "trend"
        # Since timestamps might be strings in JSON, we look at the key names
        is_time_series = any("date" in k.lower() or "time" in k.lower() for k in string_keys)
        
        if is_time_series and num_keys:
            x_axis = next((k for k in string_keys if "date" in k.lower() or "time" in k.lower()), string_keys[0])
            preferred = "line_chart" if len(data) > 30 else "area_chart"
            return summary, ChartConfig(
                chart_type=preferred,
                x_axis_key=x_axis,
                y_axis_keys=num_keys[:3] # Max 3 metrics for clarity
            )
            
        # 4. Detect Categorical Comparsion -> Bar or Pie Chart
        # Heuristic: one string (name/title), one or more numbers
        if len(string_keys) == 1 and len(num_keys) >= 1:
            x_axis = string_keys[0]
            # If multiple numbers, Bar charts are better for grouping
            if len(num_keys) > 1:
                return summary, ChartConfig(
                    chart_type="bar_chart",
                    x_axis_key=x_axis,
                    y_axis_keys=num_keys[:3]
                )
            else:
                # If one number, Pie vs Bar depends on row count
                if len(data) <= 6:
                    return summary, ChartConfig(
                        chart_type="pie_chart",
                        x_axis_key=x_axis,
                        y_axis_keys=[num_keys[0]]
                    )
                else:
                    return summary, ChartConfig(
                        chart_type="bar_chart",
                        x_axis_key=x_axis,
                        y_axis_keys=[num_keys[0]]
                    )

        # 5. Fallback -> Generic Table
        return summary, ChartConfig(chart_type="table")

# Singleton for DI
formatter_service = ResponseFormatter()
