# SupaChat Demo Video Plan 🎬

This plan outlines the "Mandatory 2-5 min Video Recording" (Requirement 13.a.iv) to showcase the full-stack conversational analytics capabilities.

## 🎞️ Shot List

| Time | Scene | Description | Key Feature |
|------|-------|-------------|-------------|
| 0:00-0:30 | **Architecture** | Flash the Mermaid diagram from the README. Briefly explain the FastAPI + React + Supabase stack. | System Design |
| 0:30-1:15 | **The Analyst Experience** | Start on the empty chat. Type: *"Show me the distribution of articles by topic"*. Watch the LLM generate SQL and render a **Pie Chart**. | NL-to-SQL |
| 1:15-2:00 | **Deep Dive** | Type: *"Plot the daily views trend for AI articles over the last 30 days"*. Show the **Area Chart** and toggle the "View SQL" dropdown to show clean PostgreSQL. | Recharts + SQL Transparency |
| 2:00-3:00 | **DevOps & Monitoring** | Open the Grafana Dashboard. Show the HTTP throughput and LLM latency graphs while the app is active. Show Loki logs live. | Ops & Monitoring |
| 3:00-3:45 | **The AI Agent** | Open terminal. Run `python scripts/devops_agent.py --logs backend.log`. Show the LLM interpreting a simulated error. | AI DevOps (Bonus) |
| 3:45-4:30 | **CI/CD** | Show a successful GitHub Actions run that deployed the latest build to EC2. | Deployment Lifecycle |
| 4:30-5:00 | **Conclusion** | Final view of the dashboard + query history sidebar. Show clearing history. | Clean UI / UX |

## 🛠️ Recording Tips
1.  **Resolution**: Record in 1080p for clear code visibility.
2.  **Audio**: Use a clear mic; if not possible, use professional text overlays.
3.  **Environment**: Ensure `.env` is set so there are no 502/500 errors during the live segments.
4.  **Seed Data**: Ensure `database/seed.sql` has been run so the charts are rich and meaningful.
