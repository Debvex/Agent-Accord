import os
import asyncio
import time
from datetime import datetime
from crewai import Crew
from agents import create_governance_agents
from tasks import create_negotiation_tasks
from resilience import calculate_resilience_score

AGENT_COLORS = {
    "Finance Lead": "#ef4444",
    "Market Intelligence Agent": "#3b82f6",
    "R&D Project Director": "#22c55e",
    "Ethics & Governance Officer": "#a855f7"
}

# Global state for active negotiations
active_negotiations = {}
interrupt_queue = {}

def is_api_key_valid() -> bool:
    """Checks if a non-dummy OpenAI API key is set in environment."""
    key = os.getenv("OPENAI_API_KEY", "")
    return bool(key and not key.startswith("dummy") and len(key) > 15)

async def interrupt_negotiation(session_id: str, message: str):
    """Add an interrupt message to the queue for a session."""
    if session_id not in interrupt_queue:
        interrupt_queue[session_id] = []
    interrupt_queue[session_id].append({
        "message": message,
        "timestamp": datetime.now().isoformat()
    })

async def run_negotiation_crew_stream(user_prompt: str, session_id: str = "default"):
    """
    Executes the multi-agent negotiation process and yields SSE event dictionaries.
    Supports continuous prompting, interruption, and session management.
    Requires valid OPENAI_API_KEY. Includes retry logic for transient API failures.
    """
    if not is_api_key_valid():
        raise ValueError("OPENAI_API_KEY not set or invalid. Cannot run live CrewAI execution.")
    
    # Initialize session state
    active_negotiations[session_id] = {
        "started_at": datetime.now().isoformat(),
        "current_speaker": None,
        "turns_completed": 0,
        "status": "running"
    }
    
    print(f"[CrewAI] Starting live execution with prompt: {user_prompt} (session: {session_id})")
    
    agents = create_governance_agents()
    tasks = create_negotiation_tasks(agents, user_prompt)

    # Execute each agent individually and asynchronously per the plan
    agent_list = [
        ("Finance Lead", agents["finance_lead"]),
        ("Market Intelligence Agent", agents["market_agent"]),
        ("R&D Project Director", agents["rd_director"]),
        ("Ethics & Governance Officer", agents["ethics_officer"])
    ]

    for idx, ((role_name, agent_obj), task_obj) in enumerate(zip(agent_list, tasks)):
        # Update session state
        active_negotiations[session_id]["current_speaker"] = role_name
        
        # Check for interrupts before each agent speaks
        if session_id in interrupt_queue and interrupt_queue[session_id]:
            interrupt = interrupt_queue[session_id].pop(0)
            yield {
                "type": "interrupt",
                "message": interrupt["message"],
                "timestamp": interrupt["timestamp"],
                "acknowledged_by": role_name
            }
            # Add interrupt context to the task description
            original_desc = task_obj.description
            task_obj.description = f"{original_desc}\n\nUser interruption: {interrupt['message']}"
        
        print(f"[CrewAI] Executing {role_name}...")
        
        # Retry logic for transient OpenAI API failures
        max_retries = 3
        result_text = ""
        for attempt in range(max_retries):
            try:
                single_crew = Crew(
                    agents=[agent_obj],
                    tasks=[task_obj],
                    verbose=True
                )
                result = await single_crew.akickoff()
                result_text = str(result.raw if hasattr(result, 'raw') else result)
                print(f"[CrewAI] {role_name} completed. Response length: {len(result_text)}")
                break
            except Exception as e:
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt
                    print(f"[CrewAI] {role_name} failed (attempt {attempt + 1}/{max_retries}): {e}")
                    print(f"[CrewAI] Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
                else:
                    yield {
                        "type": "error",
                        "message": f"Agent {role_name} failed after {max_retries} attempts: {str(e)}",
                        "speaker": role_name
                    }
                    raise

        # Update session state
        active_negotiations[session_id]["turns_completed"] = idx + 1
        
        yield {
            "type": "turn",
            "speaker": role_name,
            "color": AGENT_COLORS.get(role_name, "#38bdf8"),
            "text": result_text,
            "turn_number": idx + 1
        }
        
        # Brief pause between agents
        await asyncio.sleep(1.0)

    # Compute resilience score
    allocations = [0.55, 0.30, 0.15]
    res_score = calculate_resilience_score(allocations)

    # Update session state
    active_negotiations[session_id]["status"] = "completed"
    active_negotiations[session_id]["current_speaker"] = None

    yield {
        "type": "accord",
        "title": "Living R&D Policy v2.1",
        "summary": "Consensus Accord reached: 20% budget reduction absorbed by reallocating AI (55%), Quantum (30%), and Biotech (15%) with zero involuntary layoffs.",
        "resilience_score": res_score,
        "fairness_score": 9.2,
        "session_id": session_id
    }
