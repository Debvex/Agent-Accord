# AGENTS.md: AgentAccord System Specification & Implementation Blueprint

## 1. System Architecture Overview

**AgentAccord: The Sentient Policy Weaver** is a multi-agent governance platform designed for adaptive organizational decision-making. In the primary scenario—*Adaptive R&D Budget Allocation in a Volatile Market*—four specialized AI agents engage in structured negotiation over resource cuts while adhering to real financial data retrieved via RAG and evaluated against a NumPy-based market shock model.

```
                  ┌─────────────────────────────────────────┐
                  │           FastAPI Backend Server        │
                  │              (main.py / SSE)            │
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
      │ Native RAG Engine  │                                  │
      │ (PDFSearchTool)    │                                  │
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

---

## 2. Agent Personas & Configuration (`backend/agents.py`)

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
* **Tools Attached**: `PDFSearchTool(pdf='data/r_and_d_budget_2026.pdf')` or file search tool pointing to `data/r_and_d_budget_2026.txt`.
* **Mandatory Constraint**: Must run search queries (e.g., *"minimum budget constraints and contract penalties"*) before contributing dialogue.
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

The resilience engine stress-tests negotiated allocations against market volatility vectors using NumPy matrix transformations.

```python
import numpy as np

def calculate_resilience_score(policy_allocations: list[float]) -> float:
    """
    Stress-tests policy allocations against a market shock scenario.
    
    :param policy_allocations: List of normalized allocations [AI, Quantum, Biotech] summing to ~1.0
    :return: Resilience score between 0.0 and 10.0
    """
    allocations = np.array(policy_allocations, dtype=float)
    
    # Market shock resilience matrix (weights for resistance to sudden volatility)
    # AI: 0.85 (High market durability), Quantum: 0.40 (High risk/reward), Biotech: 0.15 (Long capital cycle)
    market_shock_weights = np.array([0.85, 0.40, 0.15])
    
    # Weighted dot product
    raw_score = np.dot(allocations, market_shock_weights)
    
    # Scale score to 0 - 10.0 range
    resilience_score = round(float(raw_score * 10.0), 1)
    return min(max(resilience_score, 0.0), 10.0)
```

---

## 4. Real-Time Streaming Protocol (`backend/main.py`)

### Endpoint: `GET /negotiate?prompt={user_text}`
* **Content-Type**: `text/event-stream`
* **Headers**: `Cache-Control: no-cache`, `Connection: keep-alive`

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

### 3D Stage Component (`Scene.jsx` & `AgentOrb.jsx`)
* **Framework**: `@react-three/fiber` & `@react-three/drei`.
* **Lighting**: Ambient light + point lights creating a sleek dark cinematic ambiance.
* **Table**: Central circular glass table mesh with emissive rim lighting.
* **Agent Orbs**: 4 `<AgentOrb />` meshes positioned at 90-degree intervals around the table.
* **Animation (`useFrame`)**: When `activeSpeaker === orbRole`, scale expands by 25% (1.25x), emissive intensity spikes, and a floating label appears above the orb.
* **Controls**: `<OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} />`.

---

## 6. Hackathon Fail-Safe: Mock Mode (`Ctrl + M`)

When `useMockMode` is enabled:
* Bypasses FastAPI/CrewAI backend calls completely.
* Emits pre-scripted dialogue turns every 3 seconds using `setInterval`.
* Displays the Golden Accord card upon completion.
* Ensures 100% reliable live demonstrations regardless of network conditions or API limits.
