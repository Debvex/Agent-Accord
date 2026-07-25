import os
import json
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from crew import run_negotiation_crew_stream

# Load environment variables from .env file if available
load_dotenv()

app = FastAPI(title="AgentAccord Governance API Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "application": "AgentAccord Server",
        "has_openai_key": bool(os.getenv("OPENAI_API_KEY") and not os.getenv("OPENAI_API_KEY").startswith("dummy"))
    }

@app.get("/negotiate")
async def negotiate(prompt: str = Query(default="We must cut 20% of R&D spend immediately")):
    """
    Streams multi-agent negotiation dialogue turns and final policy accord via Server-Sent Events (SSE).
    """
    async def event_generator():
        async for event_payload in run_negotiation_crew_stream(prompt):
            yield f"data: {json.dumps(event_payload)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
