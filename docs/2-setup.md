# Local Setup Guide

Follow these steps to configure and run SupaChat in your local development environment.

## Prerequisites
- **Node.js** v20+
- **Python** v3.12+
- **Docker & Docker Compose**
- **Supabase Account** with an active project

## 1. Database Provisioning
1. Open the SQL editor in your Supabase dashboard.
2. Execute the contents of `database/schema.sql` to lay down the relational foundations.
3. Execute the contents of `database/seed.sql` to populate 120 days of simulated blog analytics data.

## 2. Environment Configuration
Copy the `.env.example` file to `.env` in the root repository and populate the secrets:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_KEY"

# AI Inference Layer
HUGGING_FACE_API_KEY="YOUR_HUGGING_FACE_TOKEN"

# Environment
ENVIRONMENT="development"
PORT="4000"
CORS_ORIGINS="*"
LOG_LEVEL="DEBUG"
```

## 3. Running Locally (Without Docker)

### Backend Services
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 4000
```

### Frontend Services
```bash
cd frontend
npm install
npm run dev
```

Visit the application at `http://localhost:5173`.

## 4. Running Locally (With Docker)
Deploy the entire stack natively:
```bash
docker-compose up --build
```
Access the application at `http://localhost`.
