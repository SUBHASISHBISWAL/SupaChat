import sys
import os
import asyncio
import httpx
import argparse
from huggingface_hub import AsyncInferenceClient
from dotenv import load_dotenv

# Load env vars for HF token
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL_ID = os.getenv("HF_MODEL_ID", "Qwen/Qwen2.5-72B-Instruct")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:4000")

class DevOpsAgent:
    def __init__(self):
        if not HF_TOKEN:
            print("Error: HF_TOKEN not found in environment.")
            sys.exit(1)
        self.client = AsyncInferenceClient(model=HF_MODEL_ID, token=HF_TOKEN)

    async def get_health(self):
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(f"{BACKEND_URL}/health")
                return resp.json()
            except Exception as e:
                return {"status": "unreachable", "error": str(e)}

    async def analyze_logs(self, log_snippet: str):
        prompt = f"""
        You are a Senior DevOps Engineer. Analyze the following application logs and:
        1. Identify any critical errors or warnings.
        2. Suggest the most likely root cause.
        3. Provide a step-by-step fix.

        Logs:
        {log_snippet}

        Analysis and Fix:
        """
        
        response = await self.client.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.1
        )
        return response.choices[0].message.content

    async def run_diagnostic(self, logs: str = None):
        print("🚀 Starting AI DevOps Diagnostic...")
        
        health = await self.get_health()
        print(f"📡 Backend Health: {health.get('status', 'unknown')}")
        
        if logs:
            print("🧠 Analyzing logs with AI...")
            analysis = await self.analyze_logs(logs)
            print("\n" + "="*50)
            print("AI ANALYSIS")
            print("="*50)
            print(analysis)
            print("="*50)
        else:
            print("ℹ️ No logs provided for deep analysis. Use --logs flag.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SupaChat AI DevOps Agent")
    parser.add_argument("--logs", help="Path to a log file or a raw log string to analyze")
    parser.add_argument("--health-only", action="store_true", help="Only perform health check")
    
    args = parser.parse_args()
    
    agent = DevOpsAgent()
    
    if args.health_only:
        asyncio.run(agent.get_health())
    else:
        # Example: can read from a file or stdin
        log_data = ""
        if args.logs:
            if os.path.exists(args.logs):
                with open(args.logs, 'r') as f:
                    log_data = f.read()
            else:
                log_data = args.logs
        
        asyncio.run(agent.run_diagnostic(log_data))
