import os
import json
import asyncio
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, Query, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from crew import run_negotiation_crew_stream, interrupt_negotiation
from tools import embed_document, DATA_DIR, UPLOAD_DIR

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

# Global state for managing active negotiations
active_negotiations = {}

class PromptRequest(BaseModel):
    prompt: str
    session_id: str = "default"

class InterruptRequest(BaseModel):
    message: str
    session_id: str = "default"

@app.on_event("startup")
async def startup_event():
    """
    On startup, embed all existing documents in data/ and uploads/ directories
    into the vector database if not already embedded.
    """
    print("[Startup] Checking for documents to embed...")
    
    total_embedded = 0
    
    # Embed documents from data/ directory
    if os.path.exists(DATA_DIR):
        for filename in os.listdir(DATA_DIR):
            file_path = os.path.join(DATA_DIR, filename)
            if os.path.isfile(file_path) and filename.endswith(('.txt', '.md', '.json')):
                try:
                    chunks = embed_document(file_path)
                    total_embedded += chunks
                    print(f"[Startup] Embedded {chunks} chunks from {filename}")
                except Exception as e:
                    print(f"[Startup] Warning: Failed to embed {filename}: {e}")
    
    # Embed documents from uploads/ directory
    if os.path.exists(UPLOAD_DIR):
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.isfile(file_path) and filename.endswith(('.txt', '.md', '.json')):
                try:
                    chunks = embed_document(file_path)
                    total_embedded += chunks
                    print(f"[Startup] Embedded {chunks} chunks from {filename}")
                except Exception as e:
                    print(f"[Startup] Warning: Failed to embed {filename}: {e}")
    
    print(f"[Startup] Total chunks embedded: {total_embedded}")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "application": "AgentAccord Server",
        "has_openai_key": bool(os.getenv("OPENAI_API_KEY") and not os.getenv("OPENAI_API_KEY").startswith("dummy")),
        "has_serper_key": bool(os.getenv("SERPER_API_KEY") and not os.getenv("SERPER_API_KEY").startswith("dummy"))
    }

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Upload company documents for RAG search.
    Accepts multiple files (txt, md, json, pdf, docx).
    Files are stored in backend/uploads/ and immediately embedded into the vector database.
    """
    upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    uploaded_files = []
    embedded_chunks = 0
    
    for file in files:
        # Validate file type
        allowed_extensions = {'.txt', '.md', '.json', '.pdf', '.docx'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file_ext} not supported. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Save file
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Embed document into vector database (only for text-based files)
        chunks_embedded = 0
        if file_ext in {'.txt', '.md', '.json'}:
            try:
                chunks_embedded = embed_document(file_path)
                embedded_chunks += chunks_embedded
            except Exception as e:
                print(f"[Upload] Warning: Failed to embed {file.filename}: {e}")
        
        uploaded_files.append({
            "filename": file.filename,
            "size": len(content),
            "type": file_ext,
            "chunks_embedded": chunks_embedded
        })
    
    return {
        "status": "success",
        "message": f"Successfully uploaded {len(uploaded_files)} file(s) and embedded {embedded_chunks} chunk(s) into vector database",
        "files": uploaded_files,
        "total_chunks_embedded": embedded_chunks
    }

@app.get("/uploaded-files")
def list_uploaded_files():
    """List all uploaded company documents."""
    upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
    
    if not os.path.exists(upload_dir):
        return {"files": []}
    
    files = []
    for filename in os.listdir(upload_dir):
        file_path = os.path.join(upload_dir, filename)
        if os.path.isfile(file_path):
            files.append({
                "filename": filename,
                "size": os.path.getsize(file_path),
                "type": os.path.splitext(filename)[1].lower()
            })
    
    return {"files": files}

@app.delete("/uploaded-files/{filename}")
def delete_uploaded_file(filename: str):
    """Delete an uploaded company document."""
    upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
    file_path = os.path.join(upload_dir, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File {filename} not found")
    
    os.remove(file_path)
    return {"status": "success", "message": f"Deleted {filename}"}

@app.post("/negotiate")
async def negotiate(request: PromptRequest):
    """
    Streams multi-agent negotiation dialogue turns and final policy accord via Server-Sent Events (SSE).
    Supports continuous prompting and interruption during negotiation.
    
    SSE Event Types:
    - turn: Agent speaking (speaker, color, text)
    - interrupt: User interruption acknowledged (message)
    - accord: Final policy agreement reached
    - error: Error occurred during negotiation
    """
    session_id = request.session_id
    
    async def event_generator():
        try:
            # Send session start event
            yield f"data: {json.dumps({'type': 'session_start', 'session_id': session_id})}\n\n"
            
            # Stream negotiation events
            async for event_payload in run_negotiation_crew_stream(request.prompt, session_id):
                yield f"data: {json.dumps(event_payload)}\n\n"
                
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
        finally:
            # Clean up session
            if session_id in active_negotiations:
                del active_negotiations[session_id]

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

@app.post("/interrupt")
async def interrupt_negotiation_endpoint(request: InterruptRequest):
    """
    Interrupt the ongoing negotiation with a user message.
    The agents will acknowledge the interruption and incorporate the message into their discussion.
    """
    session_id = request.session_id
    
    if session_id not in active_negotiations:
        raise HTTPException(
            status_code=404,
            detail=f"No active negotiation found for session {session_id}"
        )
    
    # Send interrupt signal to the crew
    await interrupt_negotiation(session_id, request.message)
    
    return {
        "status": "success",
        "message": "Interruption sent to agents",
        "session_id": session_id
    }

@app.get("/negotiate/status/{session_id}")
async def get_negotiation_status(session_id: str):
    """Get the current status of an ongoing negotiation."""
    if session_id not in active_negotiations:
        return {
            "status": "not_found",
            "session_id": session_id,
            "message": "No active negotiation found"
        }
    
    negotiation = active_negotiations[session_id]
    return {
        "status": "active",
        "session_id": session_id,
        "current_speaker": negotiation.get("current_speaker"),
        "turns_completed": negotiation.get("turns_completed", 0),
        "started_at": negotiation.get("started_at")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
