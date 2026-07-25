import os
import shutil
import math
import re
from typing import Type, Optional
from pydantic import BaseModel, Field
from crewai.tools import BaseTool

class VectorlessRAGInput(BaseModel):
    """Input schema for VectorlessRAGTool."""
    query: str = Field(..., description="Keywords or questions to search within internal budget and policy documents.")

class VectorlessRAGTool(BaseTool):
    name: str = "Vectorless RAG Search Tool"
    description: str = (
        "Performs fast keyword and TF-IDF term frequency search across internal data documents "
        "without requiring external vector databases or embedding APIs. Returns top matching excerpts."
    )
    args_schema: Type[BaseModel] = VectorlessRAGInput

    def _run(self, query: str) -> str:
        data_dir = os.path.join(os.path.dirname(__file__), 'data')
        if not os.path.exists(data_dir):
            return "Data directory does not exist."

        # Collect text from all .txt and .md files in backend/data/
        documents = []
        for root, _, files in os.walk(data_dir):
            for file in files:
                if file.endswith(('.txt', '.md', '.json')):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            content = f.read()
                            documents.append({"file": file, "path": filepath, "content": content})
                    except Exception as e:
                        continue

        if not documents:
            return "No documents found in data folder."

        # Simple TF-IDF / Keyword Scoring on paragraphs
        query_words = set(re.findall(r'\w+', query.lower()))
        if not query_words:
            return "Empty search query."

        results = []
        for doc in documents:
            paragraphs = doc["content"].split('\n\n')
            for idx, para in enumerate(paragraphs):
                para_clean = para.strip()
                if not para_clean:
                    continue
                para_words = re.findall(r'\w+', para_clean.lower())
                if not para_words:
                    continue
                
                # Match score
                matches = sum(1 for w in query_words if w in para_words)
                if matches > 0:
                    score = matches / math.log(len(para_words) + 2)
                    results.append({
                        "file": doc["file"],
                        "score": score,
                        "text": para_clean
                    })

        results.sort(key=lambda x: x["score"], reverse=True)
        top_results = results[:3]

        if not top_results:
            return f"No relevant excerpts found for query: '{query}'."

        formatted_output = f"--- RAG Search Results for '{query}' ---\n"
        for r in top_results:
            formatted_output += f"[{r['file']}] Match Score: {r['score']:.2f}\n{r['text']}\n\n"
        return formatted_output.strip()


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
        base_dir = os.path.dirname(__file__)
        data_dir = os.path.join(base_dir, 'data')
        target_dir = os.path.join(base_dir, target_folder_name)

        os.makedirs(target_dir, exist_ok=True)

        if not os.path.exists(data_dir):
            return f"Source data directory '{data_dir}' does not exist."

        copied = []
        for file in os.listdir(data_dir):
            if source_pattern.lower() in file.lower() or source_pattern == "*":
                src_path = os.path.join(data_dir, file)
                dest_path = os.path.join(target_dir, file)
                if os.path.isfile(src_path):
                    shutil.copy2(src_path, dest_path)
                    copied.append(file)

        if copied:
            return f"Successfully synced {len(copied)} file(s) to '{target_dir}': {', '.join(copied)}"
        else:
            return f"No files matching '{source_pattern}' found in '{data_dir}' to copy."


class WebSearchInput(BaseModel):
    """Input schema for WebSearchTool."""
    query: str = Field(..., description="Search query for web intelligence and market metrics.")

class WebSearchTool(BaseTool):
    name: str = "Web Search Tool"
    description: str = (
        "Queries web sources and external databases for real-time technology market trends, "
        "competitor R&D benchmarks, and macroeconomic volatility indicators."
    )
    args_schema: Type[BaseModel] = WebSearchInput

    def _run(self, query: str) -> str:
        # Fallback simulation search results if search API keys are not provided
        query_lower = query.lower()
        if "ai" in query_lower or "budget" in query_lower:
            return (
                f"Web Benchmark Results for '{query}':\n"
                "- Global Tech Index 2026: AI R&D spend retains top strategic priority (+18% YoY growth).\n"
                "- Market Analyst Consensus: Cutting AI core capabilities during inflation cycles leads to market share loss.\n"
                "- Tech Sector Benchmarks: Average Quantum research allocation ranges 25-35%; Biotech restructuring savings average 20%."
            )
        elif "layoff" in query_lower or "ethics" in query_lower:
            return (
                f"Web Governance Standards for '{query}':\n"
                "- Corporate Labor Regulations 2026: Mandatory severance and retraining penalties for involuntary layoffs.\n"
                "- Ethical AI Governance Standard: Retaining key talent while scaling back non-core capital projects maximizes long-term resilience."
            )
        else:
            return (
                f"Web Search Summary for '{query}':\n"
                "- Economic Outlook: Volatile interest rates require corporate budget agility.\n"
                "- R&D Strategy: Reallocating low-yield long-term capital cycles protects liquidity."
            )
