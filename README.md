# AgentAccord: The Sentient Policy Weaver 🤖

> **Autonomous Multi-Agent Organizational Governance & Real-Time Policy Negotiation Platform**

[![Tech Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20CrewAI%20%7C%20NumPy%20%7C%20React%20%7C%20Three.js-blue.svg)](#tech-stack)
[![Real-Time](https://img.shields.io/badge/Streaming-Server--Sent%20Events%20(SSE)-green.svg)](#api-documentation)
[![Python](https://img.shields.io/badge/Python-3.10--3.13-blue.svg)](#prerequisites)

AgentAccord replaces one-sided corporate decision-making by filling "empty chairs at the table" with autonomous AI agents. During critical scenarios—such as sudden market downturns requiring budget reductions—agents representing opposing priorities (Finance, Market Intelligence, R&D, Ethics) query internal financial documents, negotiate compromise policies turn-by-turn, evaluate policy resilience using NumPy matrix shock models, and render the live dialogue on a 3D WebGL conference stage.

---

## ✨ Key Features

### 🎯 Multi-Agent Negotiation System
- **4 Specialized AI Agents**: Finance Lead, Market Intelligence Agent, R&D Project Director, Ethics & Governance Officer
- **Real-Time Streaming**: Server-Sent Events (SSE) for live negotiation updates
- **Session Management**: Track multiple concurrent negotiations with unique session IDs
- **User Interruption**: Inject messages during ongoing negotiations to influence agent decisions
- **Thinking Events**: Real-time feedback showing when agents are processing

### 📄 Document Management & RAG
- **File Upload System**: Upload company documents (txt, md, json, pdf, docx) for agent reference
- **Vector Search**: ChromaDB-powered semantic search over uploaded documents
- **Local Vector Store**: All embeddings stored locally in `backend/db/` (no external dependencies)
- **Automatic Indexing**: Documents are automatically embedded and indexed on upload

### 🛠️ Advanced Tool Stack
- **Budget RAG Search**: Query internal budget documents with semantic search
- **Web Search**: Live Google search via Serper API
- **Website Scraping**: Extract content from any URL discovered during negotiation
- **Data Folder Sync**: Custom tool for auditing and file synchronization

### 🎨 3D Visualization
- **Interactive 3D Stage**: React Three Fiber-powered conference table with floating agent orbs
- **Real-Time Animation**: Agents pulse and glow when speaking
- **Cinematic Lighting**: Ambient + directional + point lights with particle effects
- **Orbit Controls**: Zoom, pan, and rotate the 3D scene

### 🛡️ Fail-Safe Systems
- **Frontend Mock Mode**: Press `Ctrl + M` to run pre-scripted demo without backend
- **Backend Simulation**: Automatic fallback when API keys are missing
- **Retry Logic**: Exponential backoff for transient API failures

---

## 📁 Project Structure

```text
Agent Accord/
├── AGENTS.md                            # Detailed agent specifications & architecture
├── README.md                            # This file - project overview & guide
├── pyproject.toml                       # Project metadata (Python >=3.10,<3.14)
├── .python-version                      # Pinned Python version (3.12)
│
├── backend/
│   ├── .env.example                     # API key template (copy to .env)
│   ├── .env                             # Your API keys (gitignored)
│   │
│   ├── data/                            # Static knowledge base
│   │   └── r_and_d_budget_2026.txt     # Budget guidelines for RAG
│   │
│   ├── uploads/                         # User-uploaded documents (gitignored)
│   │   └── [your files here]
│   │
│   ├── db/                              # ChromaDB vector store (gitignored)
│   │   └── [auto-generated embeddings]
│   │
│   ├── main.py                          # FastAPI server + all endpoints
│   ├── crew.py                          # Negotiation orchestration & streaming
│   ├── agents.py                        # 4 CrewAI agent definitions
│   ├── tasks.py                         # Sequential negotiation tasks
│   ├── tools.py                         # Tool implementations (RAG, search, scrape)
│   ├── resilience.py                    # NumPy policy stress-testing
│   └── requirements.txt                 # Python dependencies
│
└── frontend/
    ├── package.json                     # React + Vite dependencies
    ├── vite.config.js                   # Vite configuration
    ├── index.html                       # HTML shell
    └── src/
        ├── main.jsx                     # React entry point
        ├── index.css                    # Tailwind CSS v4 styling
        ├── App.jsx                      # Main UI + SSE listener
        └── components/
            ├── Scene.jsx                # 3D stage canvas
            ├── AgentOrb.jsx             # Floating agent orbs
            ├── Sidebar.jsx              # Control panel + chat log
            └── DecisionLedger.jsx       # Final accord modal
```

---

## 🛠️ Tech Stack

### Backend
- **Python 3.10–3.13** (CrewAI/chromadb incompatible with 3.14)
- **FastAPI** - Modern async web framework
- **Uvicorn** - ASGI server
- **CrewAI 1.15.6** - Multi-agent orchestration
- **crewai-tools 1.15.6** - SerperDevTool, ScrapeWebsiteTool, TXTSearchTool
- **ChromaDB** - Local vector database for RAG
- **NumPy** - Policy resilience calculations
- **python-dotenv** - Environment variable management

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Utility-first styling
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Useful helpers for R3F
- **Lucide React** - Icon library

### Communication
- **Server-Sent Events (SSE)** - Real-time streaming from backend to frontend

---

## 📋 Prerequisites

### Required
- **Python ≥3.10 and <3.14** (3.12 recommended)
- **Node.js 18.x or higher**
- **OpenAI API Key** - For agent reasoning and RAG embeddings
- **Serper API Key** - For live web search (get free key at [serper.dev](https://serper.dev))

### Optional
- **uv** - Fast Python package manager (recommended over pip)
- **Git** - For version control

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Debvex/Agent-Accord.git
cd "Agent Accord"
```

### 2. Backend Setup

#### Option A: Using uv (Recommended)

```bash
cd backend

# Create virtual environment with Python 3.12
uv venv --python 3.12

# Install dependencies
uv pip install -r requirements.txt

# Configure API keys
copy .env.example .env    # Windows
# cp .env.example .env    # Linux/macOS

# Edit .env and add your API keys:
# OPENAI_API_KEY=sk-your-key-here
# SERPER_API_KEY=your-serper-key-here

# Start the server
uvicorn main:app --reload --port 8000
```

#### Option B: Using pip

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Configure API keys
copy .env.example .env    # Windows
# cp .env.example .env    # Linux/macOS

# Edit .env and add your API keys

# Start the server
uvicorn main:app --reload --port 8000
```

#### Verify Backend is Running

Open your browser to `http://localhost:8000` - you should see:
```json
{
  "status": "online",
  "application": "AgentAccord Server",
  "has_openai_key": true,
  "has_serper_key": true
}
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5173`

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Health Check
```http
GET /
```

**Response:**
```json
{
  "status": "online",
  "application": "AgentAccord Server",
  "has_openai_key": true,
  "has_serper_key": true
}
```

---

#### 2. Upload Documents
Upload company documents for agents to reference during negotiation.

```http
POST /upload
Content-Type: multipart/form-data
```

**Parameters:**
- `files` (required): One or more files to upload
  - Supported formats: `.txt`, `.md`, `.json`, `.pdf`, `.docx`
  - Maximum size: No limit (but large files take longer to embed)

**Example (curl):**
```bash
curl -X POST "http://localhost:8000/upload" \
  -F "files=@company_policy.txt" \
  -F "files=@budget_report.pdf"
```

**Example (PowerShell):**
```powershell
curl.exe -X POST "http://localhost:8000/upload" `
  -F "files=@company_policy.txt"
```

**Response:**
```json
{
  "status": "success",
  "message": "Successfully uploaded 2 file(s)",
  "files": [
    {
      "filename": "company_policy.txt",
      "size": 1234,
      "type": ".txt"
    },
    {
      "filename": "budget_report.pdf",
      "size": 56789,
      "type": ".pdf"
    }
  ]
}
```

**Notes:**
- Files are stored in `backend/uploads/` (gitignored)
- Documents are automatically embedded using OpenAI's `text-embedding-3-small` model
- Embeddings are persisted in `backend/db/` (ChromaDB)
- Agents can search these documents during negotiation using the Document Search Tool

---

#### 3. List Uploaded Files
```http
GET /uploaded-files
```

**Response:**
```json
{
  "files": [
    {
      "filename": "company_policy.txt",
      "size": 1234,
      "type": ".txt"
    },
    {
      "filename": "budget_report.pdf",
      "size": 56789,
      "type": ".pdf"
    }
  ]
}
```

---

#### 4. Delete Uploaded File
```http
DELETE /uploaded-files/{filename}
```

**Example:**
```bash
curl -X DELETE "http://localhost:8000/uploaded-files/company_policy.txt"
```

**Response:**
```json
{
  "status": "success",
  "message": "Deleted company_policy.txt"
}
```

---

#### 5. Start Negotiation (SSE Stream)
Start a multi-agent negotiation session with real-time streaming.

```http
POST /negotiate
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "We must cut 20% of R&D spend immediately",
  "session_id": "budget-cut-2026-q3"
}
```

**Parameters:**
- `prompt` (required): The negotiation mandate/scenario
- `session_id` (optional): Unique identifier for this negotiation (default: "default")

**Response:** Server-Sent Events stream

**SSE Event Types:**

##### a) Session Start
```
data: {"type": "session_start", "session_id": "budget-cut-2026-q3"}
```

##### b) Thinking (Agent Processing)
```
data: {
  "type": "thinking",
  "speaker": "Finance Lead",
  "color": "#ef4444",
  "message": "Finance Lead is analyzing and preparing response...",
  "turn_number": 1
}
```

##### c) Turn (Agent Speaking)
```
data: {
  "type": "turn",
  "speaker": "Finance Lead",
  "color": "#ef4444",
  "text": "We need to cut 20% across all R&D projects immediately...",
  "turn_number": 1
}
```

##### d) Interrupt Acknowledgment
```
data: {
  "type": "interrupt",
  "message": "Please consider employee morale impact",
  "timestamp": "2026-01-25T14:30:00",
  "acknowledged_by": "Market Intelligence Agent",
  "before_turn": 2
}
```

##### e) Accord (Final Agreement)
```
data: {
  "type": "accord",
  "title": "Living R&D Policy v2.1",
  "summary": "Consensus reached: AI 55%, Quantum 30%, Biotech 15%...",
  "resilience_score": 6.1,
  "fairness_score": 9.2,
  "session_id": "budget-cut-2026-q3"
}
```

##### f) Error
```
data: {
  "type": "error",
  "message": "Agent Finance Lead failed after 3 attempts: API rate limit exceeded",
  "speaker": "Finance Lead"
}
```

**Example (curl):**
```bash
curl -N -X POST "http://localhost:8000/negotiate" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "We must cut 20% of R&D spend", "session_id": "test1"}'
```

**Example (JavaScript):**
```javascript
const response = await fetch('http://localhost:8000/negotiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'We must cut 20% of R&D spend',
    session_id: 'test1'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const event = JSON.parse(line.slice(6));
      console.log(event);
    }
  }
}
```

---

#### 6. Interrupt Negotiation
Send a message to interrupt and influence ongoing negotiation.

```http
POST /interrupt
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Please also consider the impact on employee morale",
  "session_id": "budget-cut-2026-q3"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Interruption sent to agents",
  "session_id": "budget-cut-2026-q3"
}
```

**Notes:**
- Interrupts are queued and acknowledged before the next agent's turn
- Multiple interrupts can be sent during a negotiation
- Agents will incorporate interrupt messages into their reasoning

---

#### 7. Get Negotiation Status
Check the current status of an ongoing negotiation.

```http
GET /negotiate/status/{session_id}
```

**Example:**
```bash
curl "http://localhost:8000/negotiate/status/budget-cut-2026-q3"
```

**Response (Active):**
```json
{
  "status": "active",
  "session_id": "budget-cut-2026-q3",
  "current_speaker": "R&D Project Director",
  "turns_completed": 2,
  "started_at": "2026-01-25T14:30:00"
}
```

**Response (Not Found):**
```json
{
  "status": "not_found",
  "session_id": "budget-cut-2026-q3",
  "message": "No active negotiation found"
}
```

---

## 🎮 Usage Examples

### Example 1: Basic Negotiation

```bash
# Start backend
cd backend
uvicorn main:app --reload --port 8000

# Start frontend (in another terminal)
cd frontend
npm run dev

# Open browser to http://localhost:5173
# Click "Start Negotiation" button
```

### Example 2: Upload Documents Then Negotiate

```bash
# 1. Upload company documents
curl -X POST "http://localhost:8000/upload" \
  -F "files=@employee_handbook.txt" \
  -F "files=@quarterly_budget.xlsx"

# 2. Start negotiation (agents will reference uploaded docs)
curl -N -X POST "http://localhost:8000/negotiate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "We need to reduce operational costs by 15%",
    "session_id": "cost-reduction-q4"
  }'

# 3. Interrupt with additional context
curl -X POST "http://localhost:8000/interrupt" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Remember we have a hiring freeze in effect",
    "session_id": "cost-reduction-q4"
  }'
```

### Example 3: Multiple Concurrent Sessions

```bash
# Session 1: Budget cuts
curl -N -X POST "http://localhost:8000/negotiate" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Cut R&D budget by 20%", "session_id": "session-1"}' &

# Session 2: Hiring plan (in parallel)
curl -N -X POST "http://localhost:8000/negotiate" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Plan hiring for next quarter", "session_id": "session-2"}' &

# Check status of both sessions
curl "http://localhost:8000/negotiate/status/session-1"
curl "http://localhost:8000/negotiate/status/session-2"
```

### Example 4: Frontend with Mock Mode

```bash
# Start frontend only (no backend needed)
cd frontend
npm run dev

# Open browser to http://localhost:5173
# Press Ctrl+M to toggle Mock Mode
# Click "Start Negotiation" - runs pre-scripted demo
```

---

## 🏗️ Architecture

### Agent Flow

```
User Prompt
    ↓
[FastAPI Server] → POST /negotiate
    ↓
[CrewAI Orchestrator] → Creates 4 agents + 4 tasks
    ↓
[Sequential Execution]
    ├─→ Finance Lead (Turn 1)
    │   └─→ Tools: RAG Search, Web Search, Scrape, Document Search
    ├─→ Market Intelligence Agent (Turn 2)
    │   └─→ Tools: RAG Search, Web Search, Scrape, Document Search
    ├─→ R&D Project Director (Turn 3)
    │   └─→ Tools: RAG Search, Web Search, Scrape, Document Search
    └─→ Ethics & Governance Officer (Turn 4)
        └─→ Tools: RAG Search, Web Search, Scrape, Document Search
    ↓
[Resilience Engine] → NumPy matrix stress-testing
    ↓
[Final Accord] → Policy agreement with scores
    ↓
[SSE Stream] → Real-time events to frontend
```

### RAG Pipeline

```
Document Upload
    ↓
[File Storage] → backend/uploads/
    ↓
[Text Extraction] → Parse txt/md/json/pdf/docx
    ↓
[Embedding] → OpenAI text-embedding-3-small
    ↓
[Vector Store] → ChromaDB (backend/db/)
    ↓
[Semantic Search] → Agents query during negotiation
```

---

## 🔧 Configuration

### Environment Variables

Create `backend/.env` with the following:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Required: Serper API Key (get free key at https://serper.dev)
SERPER_API_KEY=your-serper-api-key-here

# Optional: Model Configuration
OPENAI_MODEL_NAME=gpt-4o-mini
```

### Agent Configuration

Agents are defined in `backend/agents.py`. Each agent has:
- **Role**: Agent's job title
- **Goal**: What the agent is trying to achieve
- **Backstory**: Agent's personality and expertise
- **Tools**: List of tools available to the agent
- **LLM**: Language model (default: `openai/gpt-4o-mini`)

### Tool Configuration

Tools are defined in `backend/tools.py`:

```python
# Budget RAG Tool
TXTSearchTool(
    txt="backend/data/r_and_d_budget_2026.txt",
    config={
        "embedding_model": {"provider": "openai", "config": {"model_name": "text-embedding-3-small"}},
        "vectordb": {"provider": "chromadb", "config": {"persist_directory": "backend/db"}}
    }
)

# Web Search Tool
SerperDevTool(n_results=5)

# Website Scraper
ScrapeWebsiteTool()

# Document Search (for uploaded files)
DocumentSearchTool()
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Test document search
python test_document_search.py

# Test API endpoints manually
curl "http://localhost:8000/"
curl "http://localhost:8000/uploaded-files"
```

### Frontend Tests

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🐛 Troubleshooting

### Issue: "OPENAI_API_KEY not set or invalid"

**Solution:**
1. Check `backend/.env` exists and contains your API key
2. Verify the key is valid (not starting with "dummy")
3. Restart the backend server after adding the key

```bash
# Check if .env exists
ls backend/.env

# Check if key is set
grep OPENAI_API_KEY backend/.env
```

### Issue: "Error code: 500 - The server had an error processing your request"

**Solution:**
- This is an OpenAI API server error (not your code)
- The system has automatic retry logic (3 attempts with exponential backoff)
- Wait a few minutes and try again
- Check OpenAI status: https://status.openai.com/

### Issue: "Error code: 503 - Too many concurrent requests"

**Solution:**
- You've hit OpenAI's rate limit
- Wait 1-2 minutes before retrying
- Consider upgrading your OpenAI API tier for higher limits

### Issue: Python 3.14 compatibility error

**Solution:**
- CrewAI and ChromaDB do not support Python 3.14
- Use Python 3.10, 3.11, 3.12, or 3.13
- Recreate your virtual environment with the correct Python version:

```bash
# Remove old venv
rm -rf .venv  # Linux/macOS
# or: Remove-Item -Recurse -Force .venv  # Windows

# Create new venv with Python 3.12
uv venv --python 3.12
uv pip install -r requirements.txt
```

### Issue: Frontend can't connect to backend

**Solution:**
1. Ensure backend is running on port 8000
2. Check CORS settings in `backend/main.py` (should allow all origins for development)
3. Verify no firewall is blocking localhost connections

```bash
# Test backend connectivity
curl "http://localhost:8000/"
```

### Issue: Document search returns "No documents found"

**Solution:**
1. Upload documents first: `POST /upload`
2. Check files are in `backend/uploads/`
3. Verify files are text-based (txt, md, json) - PDF/DOCX support may vary
4. Check `backend/db/` for ChromaDB files (auto-created on first search)

---

## 📊 Performance Notes

### API Costs
- **OpenAI Embeddings**: ~$0.0001 per 1K tokens (for RAG)
- **OpenAI Chat**: ~$0.001 per 1K tokens (GPT-4o-mini)
- **Serper Search**: Free tier available (2,500 searches/month)

### Typical Negotiation
- **Duration**: 30-60 seconds (4 agents × ~10 seconds each)
- **Token Usage**: ~10K-20K tokens total
- **Estimated Cost**: ~$0.02-0.04 per negotiation

### Vector Store
- **Storage**: ~1-5 MB per 100 documents
- **Embedding Time**: ~1-2 seconds per document
- **Search Time**: <100ms per query

---

## 🤝 Contributing

### Development Workflow

1. **Work on your feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally**

3. **Commit with conventional messages:**
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug"
   git commit -m "docs: update README"
   ```

4. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   # Create pull request on GitHub
   ```

### Code Style
- **Backend**: Follow PEP 8, use type hints
- **Frontend**: Use ESLint + Prettier (configured)
- **Commits**: Conventional Commits format

---

## 📄 License

This project is created for hackathon demonstration purposes.

---

## 🙏 Acknowledgments

- **CrewAI** - Multi-agent orchestration framework
- **OpenAI** - LLM and embedding APIs
- **Serper** - Google Search API
- **React Three Fiber** - 3D rendering for React
- **FastAPI** - Modern Python web framework

---

## 📞 Support

For issues and questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review [AGENTS.md](AGENTS.md) for detailed agent specifications
3. Open an issue on GitHub

---

## 🗺️ Roadmap

- [ ] Support for PDF and DOCX document parsing
- [ ] Multi-language support for agents
- [ ] Custom agent creation via UI
- [ ] Export negotiation transcripts
- [ ] Persistent negotiation history
- [ ] WebSocket support for bidirectional communication
- [ ] Agent memory across sessions
- [ ] Custom tool creation interface

---

**Built with ❤️ for the future of organizational decision-making**
