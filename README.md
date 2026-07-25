# AgentAccord: The Sentient Policy Weaver 🤝✨

> **Autonomous Multi-Agent Organizational Governance & Real-Time Policy Negotiation Platform**

[![Tech Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20CrewAI%20%7C%20NumPy%20%7C%20React%20%7C%20Three.js-blue.svg)](#2-tech-stack)
[![Real-Time](https://img.shields.io/badge/Streaming-Server--Sent%20Events%20(SSE)-green.svg)](#4-real-time-streaming-protocol)

AgentAccord replaces one-sided corporate decision-making by filling "empty chairs at the table" with autonomous AI agents. During critical scenarios—such as sudden market downturns requiring budget reductions—agents representing opposing priorities (Finance, Market Intelligence, R&D, Ethics) query internal financial documents, negotiate compromise policies turn-by-turn, evaluate policy resilience using NumPy matrix shock models, and render the live dialogue on a 3D WebGL conference stage.

---

## 📁 Project Directory Structure

```text
Agent Accord/
├── AGENTS.md                            # Detailed implementable agent specs & architecture
├── README.md                            # Main project overview & quickstart guide
├── pyproject.toml                       # Project metadata (requires-python >=3.10,<3.14)
├── .python-version                      # Pinned interpreter for uv-managed venv
├── backend/
│   ├── .env.example                     # Template for API keys (copy to .env — gitignored)
│   ├── data/
│   │   └── r_and_d_budget_2026.txt      # Financial & R&D budget guidelines for RAG retrieval
│   ├── db/                              # Local ChromaDB vector store (gitignored, auto-created)
│   ├── requirements.txt                 # Python dependencies (fastapi, uvicorn, crewai, numpy)
│   ├── main.py                          # FastAPI server + SSE /negotiate endpoint
│   ├── crew.py                          # Negotiation orchestration + simulation fallback
│   ├── agents.py                        # 4 CrewAI agent definitions & shared tool wiring
│   ├── tasks.py                         # Sequential negotiation task workflows
│   ├── tools.py                         # SerperDevTool, ScrapeWebsiteTool, TXTSearchTool RAG, DataFolderSyncTool
│   └── resilience.py                    # NumPy matrix policy stress-testing calculation
└── frontend/
    ├── package.json                     # React, Vite, R3F, Drei, Tailwind dependencies
    ├── vite.config.js                   # Vite configuration
    ├── index.html                       # HTML application shell
    └── src/
        ├── main.jsx                     # React entry point
        ├── index.css                    # Tailwind CSS v4 styling & dark theme
        ├── App.jsx                      # Main UI layout, SSE listener & state management
        └── components/
            ├── Scene.jsx                # React Three Fiber 3D stage canvas
            ├── AgentOrb.jsx             # 3D floating orb mesh with pulsing/scaling shaders
            ├── Sidebar.jsx              # Control panel, user prompt input & live chat log
            └── DecisionLedger.jsx       # Golden Document final accord modal overlay
```

---

## ⚡ Tech Stack

* **Backend**: Python ≥3.10 and <3.14, FastAPI, Uvicorn, CrewAI, crewai-tools (SerperDevTool, ScrapeWebsiteTool, TXTSearchTool RAG with local ChromaDB persistence), NumPy.
* **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide Icons.
* **3D Visual Stage**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`).
* **Communication**: Real-time Server-Sent Events (SSE) streaming.

---

## 🚀 Quickstart & Installation Guide

### Prerequisites
* Python **≥3.10 and <3.14** (CrewAI/chromadb do not yet support 3.14)
* Node.js 18.x or higher
* OpenAI API Key and Serper API Key (or use the backend's automatic simulation fallback / frontend `useMockMode`)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (Python 3.10–3.13 required)
# With uv (recommended):
uv venv --python 3.12
uv pip install -r requirements.txt

# Or classic venv:
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS
pip install -r requirements.txt

# Configure API keys: copy .env.example to .env and fill in your keys
#   OPENAI_API_KEY  — required for live CrewAI reasoning + RAG embeddings
#   SERPER_API_KEY  — required for SerperDevTool live web search
cp .env.example .env         # Linux/macOS; on Windows: copy .env.example .env

# Start FastAPI server (loads .env automatically)
uvicorn main:app --reload --port 8000
```

> No valid `OPENAI_API_KEY`? The backend automatically streams its built-in simulation fallback — the frontend works either way.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🛡️ Hackathon Fail-Safes

AgentAccord has **two independent fail-safes** for reliable demos:

1. **Frontend Mock Mode (`Ctrl + M`)** — press `Ctrl + M` anywhere in the web app or toggle the **Mock Mode** switch in the sidebar. Bypasses external API/backend connections and streams pre-scripted multi-agent dialogue turns locally (every 2.5s).
2. **Backend Simulation Fallback** — if no valid `OPENAI_API_KEY` is configured (or live execution fails), the `/negotiate` endpoint automatically streams a dynamic simulation using the same SSE `turn`/`accord` event contract.

Both guarantee flawless 3D stage animation and Golden Document rendering in any environment.
