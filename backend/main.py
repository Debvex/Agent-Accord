import asyncio
import json
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from resilience import calculate_resilience_score

app = FastAPI(title="AgentAccord API Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "application": "AgentAccord Server"}

@app.get("/negotiate")
async def negotiate(prompt: str = Query(default="We must cut 20% of R&D spend immediately")):
    """
    Streams multi-agent negotiation dialogue turns and final policy accord via Server-Sent Events (SSE).
    """
    async def event_generator():
        turns = [
            {
                "type": "turn",
                "speaker": "Finance Lead",
                "color": "#ef4444",
                "text": f"Mandate received: '{prompt}'. Cash flow requires an immediate 20% reduction in total R&D expenditure to preserve margins."
            },
            {
                "type": "turn",
                "speaker": "Market Intelligence Agent",
                "color": "#3b82f6",
                "text": "Querying budget data... Document rules state AI threshold is 45% min, Quantum cancellation fee is $4.2M, and Biotech scaling saves $1.5M without structural default."
            },
            {
                "type": "turn",
                "speaker": "R&D Project Director",
                "color": "#22c55e",
                "text": "We cannot compromise our core AI technological moat. I propose keeping AI at 55%, Quantum at 30%, and reducing Biotech to 15%."
            },
            {
                "type": "turn",
                "speaker": "Ethics & Governance Officer",
                "color": "#a855f7",
                "text": "This reallocation absorbs the 20% total cost cut through project concessions while preserving 100% of core engineering headcount. Zero involuntary layoffs."
            }
        ]

        for turn in turns:
            yield f"data: {json.dumps(turn)}\n\n"
            await asyncio.sleep(2.5)

        # Calculate resilience score using NumPy engine
        allocations = [0.55, 0.30, 0.15]
        resilience_score = calculate_resilience_score(allocations)

        accord_payload = {
            "type": "accord",
            "title": "Living R&D Policy v2.1",
            "summary": "Consensus Accord reached: 20% budget reduction absorbed by reallocating AI (55%), Quantum (30%), and Biotech (15%) with zero involuntary layoffs.",
            "resilience_score": resilience_score,
            "fairness_score": 9.2
        }
        yield f"data: {json.dumps(accord_payload)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
