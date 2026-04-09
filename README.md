# SupaChat ⚡

> Conversational analytics for blog data — ask questions in plain English,
> get SQL, tables, and charts.

## 🎯 Features
- Natural language → SQL via Hugging Face (Qwen2.5-72B)
- Interactive chatbot UI with embedded Recharts visualizations
- Query history with replay
- Full DevOps lifecycle: Docker, Nginx, CI/CD, Monitoring
- MCP Integration for native IDE query tooling

## 🏗️ Architecture
The system employs a 2-tier containerized stack locally, scalable via ECS/EC2.
The frontend uses React and Vite as a lightweight SPA proxying to a FastAPI backend.
The database logic is wrapped heavily in Supabase RPCs bridging read-only queries securely.

## 🛠️ Tech Stack
| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | React 19, Vite, JavaScript, Recharts |
| Backend     | FastAPI, Python 3.12          |
| LLM         | Hugging Face Inference (Qwen) |
| Database    | Supabase PostgreSQL           |
| Infra       | Docker, Nginx, GitHub Actions |
| Monitoring  | Prometheus, Grafana, Loki     |

## 📚 Documentation
For a complete, in-depth breakdown of the project, please explore the `docs/` folder:
- [Architecture Details](docs/1-architecture.md)
- [Local Setup Guide](docs/2-setup.md)
- [Deployment (AWS EC2)](docs/3-deployment.md)
- [CI/CD Pipeline](docs/4-cicd.md)
- [Monitoring Stack](docs/5-monitoring.md)
- [AI Tools & NLP Logic](docs/6-ai-tools.md)

## 🚀 Quick Start
### Prerequisites
- Node.js > 20
- Python > 3.12 
- Docker Engine
- A provisioned Supabase Database

### Local Development (Non-Docker)
1. Clone repo, duplicate `.env.example` to `.env` and fill values.
2. In `/database`, execute `schema.sql` followed by `seed.sql` on Supabase.
3. Start backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 4000`
4. Start frontend: `cd frontend && npm install && npm run dev`
5. Open `http://localhost:5173`

### Production Docker
```bash
docker-compose up -d --build
```
Open `http://localhost`.
