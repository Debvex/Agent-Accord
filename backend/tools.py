import os
import shutil
import time
from typing import Type, List

from crewai.tools import BaseTool
from crewai_tools import ScrapeWebsiteTool, SerperDevTool, TXTSearchTool
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
VECTOR_DB_DIR = os.path.join(BASE_DIR, "db")
BUDGET_DOC = os.path.join(DATA_DIR, "r_and_d_budget_2026.txt")


def create_budget_rag_tool(max_retries: int = 3) -> TXTSearchTool:
    """
    Default CrewAI RAG tool over the internal budget documents.
    Documents from backend/data are embedded and persisted in a local
    ChromaDB vector store inside the repo at backend/db/.
    
    Includes retry logic for transient OpenAI API failures.
    """
    os.makedirs(VECTOR_DB_DIR, exist_ok=True)
    
    for attempt in range(max_retries):
        try:
            return TXTSearchTool(
                txt=BUDGET_DOC,
                config={
                    "embedding_model": {
                        "provider": "openai",
                        "config": {"model_name": "text-embedding-3-small"},
                    },
                    "vectordb": {
                        "provider": "chromadb",
                        "config": {
                            "persist_directory": VECTOR_DB_DIR,
                        },
                    },
                },
            )
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt
                print(f"[RAG Tool] OpenAI API error (attempt {attempt + 1}/{max_retries}): {e}")
                print(f"[RAG Tool] Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise


def create_web_search_tool() -> SerperDevTool:
    """Default Serper.dev Google search tool (requires SERPER_API_KEY)."""
    return SerperDevTool(n_results=5)


def create_scrape_website_tool() -> ScrapeWebsiteTool:
    """Default website scraper; agents may scrape any URL discovered at runtime."""
    return ScrapeWebsiteTool()


class DataFolderSyncInput(BaseModel):
    """Input schema for DataFolderSyncTool."""
    source_pattern: str = Field(..., description="File name or wildcard pattern to search in backend/data folder.")
    target_folder_name: str = Field("synced_data", description="Destination folder inside backend to copy files into.")


class DataFolderSyncTool(BaseTool):
    name: str = "Data Folder Sync & Transfer Tool"
    description: str = (
        "Inspects files in backend/data and synchronizes/copies matching files or folders into a designated "
        "local folder for auditing, archiving, or downstream processing."
    )
    args_schema: Type[BaseModel] = DataFolderSyncInput

    def _run(self, source_pattern: str, target_folder_name: str = "synced_data") -> str:
        target_dir = os.path.join(BASE_DIR, target_folder_name)
        os.makedirs(target_dir, exist_ok=True)

        if not os.path.exists(DATA_DIR):
            return f"Source data directory '{DATA_DIR}' does not exist."

        copied = []
        for file in os.listdir(DATA_DIR):
            if source_pattern.lower() in file.lower() or source_pattern == "*":
                src_path = os.path.join(DATA_DIR, file)
                dest_path = os.path.join(target_dir, file)
                if os.path.isfile(src_path):
                    shutil.copy2(src_path, dest_path)
                    copied.append(file)

        if copied:
            return f"Successfully synced {len(copied)} file(s) to '{target_dir}': {', '.join(copied)}"
        return f"No files matching '{source_pattern}' found in '{DATA_DIR}' to copy."


class DocumentSearchInput(BaseModel):
    """Input schema for DocumentSearchTool."""
    query: str = Field(..., description="Search query to find relevant information in uploaded documents.")


class DocumentSearchTool(BaseTool):
    name: str = "Document Search Tool"
    description: str = (
        "Searches through uploaded company documents and files to find relevant information. "
        "Use this tool to query any documents that have been uploaded by the user."
    )
    args_schema: Type[BaseModel] = DocumentSearchInput

    def _run(self, query: str) -> str:
        """Search through uploaded documents using the RAG system."""
        if not os.path.exists(UPLOAD_DIR) or not os.listdir(UPLOAD_DIR):
            return "No documents have been uploaded yet. Please upload documents first."
        
        # Create a TXTSearchTool that searches all uploaded files
        try:
            # Get all text files from uploads directory
            uploaded_files = [
                os.path.join(UPLOAD_DIR, f) 
                for f in os.listdir(UPLOAD_DIR) 
                if f.endswith(('.txt', '.md', '.json'))
            ]
            
            if not uploaded_files:
                return "No searchable text documents found in uploads."
            
            # Use the first file for now (can be enhanced to search all)
            search_tool = TXTSearchTool(
                txt=uploaded_files[0],
                config={
                    "embedding_model": {
                        "provider": "openai",
                        "config": {"model_name": "text-embedding-3-small"},
                    },
                    "vectordb": {
                        "provider": "chromadb",
                        "config": {
                            "persist_directory": VECTOR_DB_DIR,
                        },
                    },
                },
            )
            
            result = search_tool.run(query=query)
            return result if result else f"No relevant information found for query: {query}"
            
        except Exception as e:
            return f"Error searching documents: {str(e)}"
