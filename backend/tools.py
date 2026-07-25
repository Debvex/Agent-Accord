import os
import shutil
import time
from typing import Type, List, Optional

from crewai.tools import BaseTool
from crewai_tools import ScrapeWebsiteTool, SerperDevTool
from pydantic import BaseModel, Field
import chromadb
from chromadb.config import Settings
from openai import OpenAI

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
VECTOR_DB_DIR = os.path.join(BASE_DIR, "db")

# Initialize ChromaDB client for persistent vector storage
chroma_client = chromadb.PersistentClient(path=VECTOR_DB_DIR)

# Initialize OpenAI client for embeddings
openai_client = OpenAI()


def get_or_create_collection(collection_name: str = "company_documents"):
    """Get or create a ChromaDB collection for document embeddings."""
    return chroma_client.get_or_create_collection(
        name=collection_name,
        metadata={"hnsw:space": "cosine"}
    )


def embed_text(text: str) -> List[float]:
    """Embed text using OpenAI's text-embedding-3-small model."""
    response = openai_client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding


def embed_document(file_path: str, collection_name: str = "company_documents"):
    """
    Embed a document and store it in the vector database.
    Splits document into chunks for better retrieval.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Read file content
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into chunks (simple paragraph-based splitting)
    chunks = split_into_chunks(content, chunk_size=1000, overlap=200)
    
    # Get or create collection
    collection = get_or_create_collection(collection_name)
    
    # Embed and store each chunk
    ids = []
    embeddings = []
    documents = []
    metadatas = []
    
    for idx, chunk in enumerate(chunks):
        if len(chunk.strip()) < 50:  # Skip very small chunks
            continue
            
        chunk_id = f"{os.path.basename(file_path)}_chunk_{idx}"
        embedding = embed_text(chunk)
        
        ids.append(chunk_id)
        embeddings.append(embedding)
        documents.append(chunk)
        metadatas.append({
            "source": os.path.basename(file_path),
            "chunk_index": idx,
            "total_chunks": len(chunks)
        })
    
    # Add to collection
    if ids:
        collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )
    
    return len(ids)


def split_into_chunks(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """Split text into overlapping chunks."""
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
    
    return chunks


def search_vector_db(query: str, collection_name: str = "company_documents", 
                     n_results: int = 3, similarity_threshold: float = 0.8) -> List[dict]:
    """
    Search the vector database for relevant documents.
    Returns only results with similarity score above threshold.
    """
    collection = get_or_create_collection(collection_name)
    
    # Check if collection has any documents
    if collection.count() == 0:
        return []
    
    # Embed the query
    query_embedding = embed_text(query)
    
    # Search
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )
    
    # Filter by similarity threshold
    relevant_results = []
    if results and results['distances']:
        for idx, distance in enumerate(results['distances'][0]):
            # ChromaDB uses cosine distance, convert to similarity score
            similarity_score = 1 - distance
            
            if similarity_score >= similarity_threshold:
                relevant_results.append({
                    "content": results['documents'][0][idx],
                    "source": results['metadatas'][0][idx]['source'],
                    "similarity_score": similarity_score,
                    "chunk_index": results['metadatas'][0][idx]['chunk_index']
                })
    
    return relevant_results


def create_web_search_tool() -> SerperDevTool:
    """Default Serper.dev Google search tool (requires SERPER_API_KEY)."""
    return SerperDevTool(n_results=5)


def create_scrape_website_tool() -> ScrapeWebsiteTool:
    """Default website scraper; agents may scrape any URL discovered at runtime."""
    return ScrapeWebsiteTool()


class VectorDBSearchInput(BaseModel):
    """Input schema for VectorDBSearchTool."""
    query: str = Field(..., description="Search query to find relevant information in the vector database.")


class VectorDBSearchTool(BaseTool):
    name: str = "Vector Database Search Tool"
    description: str = (
        "Searches the vector database for relevant information from uploaded company documents. "
        "Returns results only if similarity score is above 0.8. "
        "If no relevant results are found, consider using the web search tool instead. "
        "Use this tool when you need context from company documents, policies, or uploaded files."
    )
    args_schema: Type[BaseModel] = VectorDBSearchInput

    def _run(self, query: str) -> str:
        """Search the vector database for relevant information."""
        try:
            results = search_vector_db(query, similarity_threshold=0.8)
            
            if not results:
                return "No relevant information found in the vector database. Consider using web search for this query."
            
            # Format results
            formatted_output = f"Found {len(results)} relevant document(s):\n\n"
            for idx, result in enumerate(results, 1):
                formatted_output += f"[{idx}] Source: {result['source']} (Similarity: {result['similarity_score']:.2f})\n"
                formatted_output += f"{result['content']}\n\n"
            
            return formatted_output.strip()
            
        except Exception as e:
            return f"Error searching vector database: {str(e)}"


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
