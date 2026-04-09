from prometheus_client import Counter, Histogram, Gauge

# Request volume and status
REQUESTS_TOTAL = Counter(
    "supachat_requests_total",
    "Total number of HTTP requests",
    ["method", "endpoint", "status"]
)

# Latency tracking
REQUEST_DURATION = Histogram(
    "supachat_request_duration_seconds",
    "HTTP request latency across all endpoints",
    ["endpoint"]
)

LLM_DURATION = Histogram(
    "supachat_llm_duration_seconds",
    "Latency for the HuggingFace NL to SQL Translation",
    buckets=[0.5, 1.0, 2.5, 5.0, 7.5, 10.0, 15.0, 30.0]
)

QUERY_DURATION = Histogram(
    "supachat_query_duration_seconds",
    "Latency for executing the generated SQL against Supabase"
)

ACTIVE_REQUESTS = Gauge(
    "supachat_active_requests",
    "Current number of requests being processed"
)
