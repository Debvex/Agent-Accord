# AgentAccord: The Sentient Policy Weaver

## 1. Project Overview & System Architecture

**AgentAccord: The Sentient Policy Weaver** is a multi-agent governance platform designed for adaptive organizational decision-making. In the primary scenario—*Adaptive R&D Budget Allocation in a Volatile Market*—four specialized AI agents engage in structured negotiation over resource cuts while adhering to real financial data retrieved via RAG and evaluated against a NumPy-based market shock model.

```
                  ┌─────────────────────────────────────────┐
                  │           FastAPI Backend Server        │
                  │         (backend/main.py / SSE)         │
                  └────────────────────┬────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
      ┌─────────▼──────────┐                       ┌──────────▼──────────┐
      │  CrewAI Agent Crew │                       │ NumPy Resilience    │
      │  (agents & tasks)  │                       │ Math Engine         │
      └─────────┬──────────┘                       └──────────┬──────────┘
                │                                             │
      ┌─────────▼──────────┐                                  │
      │  RAG Tool Stack    │                                  │
      │ (VectorDBSearch +  │                                  │
      │  local ChromaDB)   │                                  │
      └────────────────────┘                                  │
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       │ Real-time Event Stream
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │           React + Vite Frontend         │
                  │             (App.jsx / SSE)             │
                  └────────────────────┬────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
      ┌─────────▼──────────┐                       ┌──────────▼──────────┐
      │  3D WebGL Stage    │                       │ Auditable Decision  │
      │ (R3F Scene & Orbs) │                       │ Ledger Overlay      │
      └────────────────────┘                       └─────────────────────┘
```

**Runtime note (Python)**: CrewAI and ChromaDB currently require **Python ≥3.10 and <3.14**. Running on Python 3.14 breaks the live agent path (chromadb relies on Pydantic V1 internals); the backend then serves its simulation fallback instead of live CrewAI execution.

---

## 2. Agent Personas & Configuration (`backend/agents.py`)

Every agent is equipped with the full shared tool stack (`backend/tools.py`):

* **Vector Database Search** — `VectorDBSearchTool` performs semantic search over all uploaded documents and data files. Documents are embedded using OpenAI `text-embedding-3-small` and stored in a local ChromaDB vector store at `backend/db/` (gitignored). **Only returns results with similarity score ≥ 0.8**; if no relevant results found, agents fall back to web search.
* **Web Search** — `SerperDevTool` (live Google results; requires `SERPER_API_KEY` in `backend/.env`). Used when vector DB search returns no relevant results or when agents need external information.
* **Website Scraping** — `ScrapeWebsiteTool` (agents may scrape any URL discovered at runtime).
* **Data Folder Sync** — custom `DataFolderSyncTool` that copies matching files from `backend/data/` into `backend/synced_data/` for auditing.

**Document Embedding**: All documents in `backend/data/` and `backend/uploads/` are automatically embedded into the vector database on server startup and immediately upon upload. The LLM decides when to use vector DB search vs web search based on query relevance.

### Agent 1: Finance Lead

* **Role**: Chief Financial Officer / Cost Reduction Strategist
* **Goal**: Aggressively push for immediate 20% R&D budget reduction, minimize financial exposure, and protect cash reserves.
* **Backstory**: A veteran finance executive obsessed with bottom-line health and risk mitigation during economic downtowns.
* **Tone**: Analytical, direct, uncompromising on financial targets.
* **Color Representation**: Red (`#ef4444`)

### Agent 2: Market Intelligence Agent (RAG Enabled)

* **Role**: Chief Data Officer & Market Analyst
* **Goal**: Query internal budget documents for constraints, contract cancellation penalties, and minimum operating thresholds before recommending data-driven compromises.
* **Backstory**: An expert data scientist armed with real-time financial documents and market metrics.
* **Tools Attached**: Full shared stack above; primary user of the Vector Database Search (`VectorDBSearchTool`) against all uploaded and data documents.
* **Mandatory Constraint**: Must run search queries (e.g., *"minimum budget constraints and contract penalties"*) before contributing dialogue. If vector DB returns no relevant results (similarity < 0.8), must use web search.
* **Color Representation**: Blue (`#3b82f6`)

### Agent 3: R&D Project Director

* **Role**: Chief Technology Officer & Research Director
* **Goal**: Defend core AI and Quantum Computing initiatives at all costs; willing to concede Biotech funding if necessary to preserve long-term technical moat.
* **Backstory**: A visionary engineer who believes cutting flagship technology projects during a downturn is organizational suicide.
* **Tone**: Passionate, protective of high-ROI technological breakthroughs.
* **Color Representation**: Green (`#22c55e`)

### Agent 4: Ethics & Governance Officer

* **Role**: Chief Compliance & Ethics Officer
* **Goal**: Ensure budget reallocations maintain workforce stability, adhere to labor regulations, and avoid unfair involuntary layoffs.
* **Backstory**: A principled legal and human governance advocate dedicated to ethical AI deployment and fair corporate policy.
* **Tone**: Empathetic, balanced, safety-oriented.
* **Color Representation**: Purple (`#a855f7`)

---

## 3. Resilience Engine Specification (`backend/resilience.py`)

The resilience engine stress-tests negotiated allocations against market volatility vectors using NumPy matrix transformations. The implementation includes a default-allocation fallback and sum normalization:

```python
import numpy as np
from typing import List

def calculate_resilience_score(policy_allocations: List[float]) -> float:
    """
    Calculates market resilience score using NumPy matrix stress-testing.

    :param policy_allocations: List of normalized project allocations [AI, Quantum, Biotech]
    :return: Normalized resilience score out of 10.0
    """
    if not policy_allocations or len(policy_allocations) < 3:
        # Default allocation ratio [AI=0.55, Quantum=0.30, Biotech=0.15]
        policy_allocations = [0.55, 0.30, 0.15]

    allocations = np.array(policy_allocations[:3], dtype=float)
    # Normalize if total does not sum to 1.0
    total = np.sum(allocations)
    if total > 0:
        allocations = allocations / total

    # Market shock scenario vector: AI high resilience (0.85), Quantum medium (0.40), Biotech (0.15)
    market_shock_weights = np.array([0.85, 0.40, 0.15])

    raw_score = float(np.dot(allocations, market_shock_weights))
    resilience_score = round(raw_score * 10.0, 1)

    return min(max(resilience_score, 0.0), 10.0)
```

The module also ships a `__main__` smoke test printing the score for `[0.55, 0.30, 0.15]`.

---

## 4. Real-Time Streaming Protocol (`backend/main.py`)

### Endpoint: `GET /negotiate?prompt={user_text}`

* **Content-Type**: `text/event-stream`
* **Headers**: `Cache-Control: no-cache`, `Connection: keep-alive`, `X-Accel-Buffering: no`
* Default prompt when omitted: *"We must cut 20% of R&D spend immediately"*

### Execution modes (`backend/crew.py`)

1. **Live CrewAI mode** — used when a valid `OPENAI_API_KEY` is present. Each agent runs **individually and asynchronously** via `Crew.akickoff()` in negotiation order (Finance → Market → R&D → Ethics), streaming one `turn` event per agent.
2. **Simulation fallback** — used automatically when no valid key exists or live execution fails. The backend streams a built-in dynamic simulation with the identical event contract, so the frontend always renders.

### Stream Payload Event Types:

1. **Dialogue Turn (`turn`)**:

```json
data: {"type": "turn", "speaker": "Finance Lead", "color": "#ef4444", "text": "We need to cut 20% across all R&D projects immediately to protect operating margin."}
```

2. **Final Accord (`accord`)**:

```json
data: {"type": "accord", "title": "Living R&D Policy v2.1", "summary": "Compromise reached: AI budget retained at 55%, Quantum reduced to 30%, Biotech refocused to 15% with zero involuntary workforce layoffs.", "resilience_score": 8.4, "fairness_score": 9.2}
```

---

## 5. Frontend & 3D Stage Specifications (`frontend/src/`)

### Layout & State Management (`App.jsx`)

* `activeSpeaker`: String tracking current speaking agent (or `null`).
* `chatLog`: Array of turn objects `[{ speaker, color, text }]`.
* `accord`: Object containing final summary and scores (or `null`).
* `isRunning`: Boolean controlling execution state.
* `useMockMode`: Boolean triggerable via `Ctrl + M` or toggle switch.
* On SSE error / backend offline, the frontend automatically falls back to the local mock simulation.

### 3D Stage Component (`Scene.jsx` & `AgentOrb.jsx`)

* **Framework**: `@react-three/fiber` & `@react-three/drei`.
* **Lighting**: Ambient light + two directional lights (white key, cyan fill) + a cyan point light above the table, layered with a `<Stars />` backdrop and a rotating particle field for a sleek dark cinematic ambiance.
* **Table**: Central circular glass table mesh with emissive rim lighting.
* **Agent Orbs**: 4 `<AgentOrb />` meshes positioned at 90-degree intervals around the table.
* **Animation (`useFrame`)**: When `activeSpeaker === orbRole`, scale lerps up by 25% (1.25x), emissive intensity spikes (0.45 → 2.8), and the floating role label above the orb highlights with a `SPEAKING` badge (labels remain visible at all times).
* **Controls**: `<OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />` with gentle auto-rotate while no agent is speaking.

---

## 6. Hackathon Fail-Safe: Mock Mode (`Ctrl + M`)

When `useMockMode` is enabled:

* Bypasses FastAPI/CrewAI backend calls completely.
* Emits pre-scripted dialogue turns every 2.5 seconds using `setInterval`.
* Displays the Golden Accord card upon completion.
* Ensures 100% reliable live demonstrations regardless of network conditions or API limits.

**Two independent fail-safes exist**: the frontend *Mock Mode* (`Ctrl + M`, manual) and the backend *simulation fallback* (automatic, no valid API key). Both emit the same `turn`/`accord` event contract.
