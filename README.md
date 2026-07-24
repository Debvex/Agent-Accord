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
├── Agent.md                             # Specification mirror reference
├── README.md                            # Main project overview & quickstart guide
├── backend/
│   ├── data/
│   │   └── r_and_d_budget_2026.txt      # Financial & R&D budget guidelines for RAG retrieval
│   ├── requirements.txt                 # Python dependencies (fastapi, uvicorn, crewai, numpy)
│   ├── main.py                          # FastAPI server + SSE /negotiate endpoint
│   ├── agents.py                        # 4 CrewAI agent definitions & RAG tool config
│   ├── tasks.py                         # Sequential negotiation task workflows
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

* **Backend**: Python 3.10+, FastAPI, Uvicorn, CrewAI, CrewAI Tools (Native RAG), NumPy.
* **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide Icons.
* **3D Visual Stage**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`).
* **Communication**: Real-time Server-Sent Events (SSE) streaming.

---

## 🚀 Quickstart & Installation Guide

### Prerequisites
* Python 3.10 or higher
* Node.js 18.x or higher
* OpenAI API Key (or set `useMockMode` on frontend)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY="your-openai-api-key"

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

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

## 🛡️ Hackathon Fail-Safe: Mock Mode (`Ctrl + M`)

AgentAccord features a built-in **Mock Mode** fail-safe for offline or network-constrained live demonstrations:
- Press **`Ctrl + M`** anywhere in the web app or toggle the **Mock Mode** switch in the sidebar.
- Bypasses external API/backend connections and streams pre-scripted multi-agent dialogue turns locally.
- Ensures flawless 3D stage animation and Golden Document rendering in any environment.
