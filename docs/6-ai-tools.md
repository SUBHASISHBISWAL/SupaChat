# AI Tools & Logic Setup

SupaChat utilizes serverless, lightweight Language Models via Hugging Face to convert Natural Language (NL) context directly into actionable PostgreSQL syntax mapped against Supabase.

## Primary Model
- **Model Hosted:** `Qwen/Qwen2.5-72B-Instruct`
- **Provider:** Hugging Face Inference API
- **Reasoning:** Fast response time, high instruction-following adherence, and strong capabilities for translating raw English constraints into targeted `JOIN` querying without hallucination.

## The Chatbot Workflow
1. User formulates a natural language query in the React UI (e.g. "Show me the top 5 blog posts by total view counts").
2. The UI sends a `POST` request to the FastAPI `/api/chat` endpoint.
3. The server translates this intent via the Hugging Face LLM, providing a system prompt alongside the current Postgres DB Schema layout. 
4. The output generated is a strict SQL string. 
5. The backend safely injects the SQL string to Supabase utilizing a read-only role limit.
6. The compiled results, string summary, and `recharts` optimized config format are streamed back to the frontend.

## FastMCP Integration
SupaChat integrates robustly with the **Model Context Protocol (MCP)** using `FastMCP`.
This exposes server-level tools to LLM interfaces natively (e.g., executing the Read-Only Supabase SQL query function direct from IDEs without Javascript intermediating bridges).
