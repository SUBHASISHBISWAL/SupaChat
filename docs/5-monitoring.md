# Monitoring Stack

SupaChat comes bundled with an industry-standard monitoring and observability layer encapsulating metrics, logs, and alerting systems.

## Stack Technologies
- **Prometheus**: Aggregates metric data via the FastAPI `/metrics` endpoint.
- **Grafana**: Web interface mapped to `:3000` for visual representation of metric and log data.
- **Loki**: Horizontally scalable log aggregation system that ingests log streams.
- **Promtail**: A logging agent scraping Docker container logs and passing them to Loki.

## Starting the Stack
The monitoring environment operates in a separate `docker-compose` topology:

```bash
docker compose -f docker-compose.monitoring.yml up -d
```

## Key Metrics Captured
- `supachat_requests_total`: Tracks the volume of HTTP requests processed by endpoint and status code.
- `supachat_request_duration_seconds`: Histogram of endpoint latency and operational lag.
- `supachat_llm_duration_seconds`: Isolated duration metrics specific to the Hugging Face API NL-to-SQL logic block handling.
- `supachat_query_duration_seconds`: Tracks Supabase database interaction times exclusively.

## Prometheus Alerts
Prometheus actively evaluates rules configured via `/etc/prometheus/alert_rules.yml`:
1. `BackendDown`: Triggered when the FastAPI backend is unresponsive for over 60s.
2. `HighRequestLatency`: Triggered when API p95 latency exceeds 2 seconds.
3. `HighLLMLatency`: Triggered when LLM translation latency exceeds 15 seconds.
4. `HighErrorRate`: Triggered when 5xx errors make up over 5% of API requests.
5. `HighActiveRequests`: Warns when >20 concurrent requests are trapped processing simultaneously. 
