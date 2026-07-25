import os
from crewai import Agent
from tools import VectorlessRAGTool, DataFolderSyncTool, WebSearchTool

# Instantiate shared tools for every agent
vectorless_rag_tool = VectorlessRAGTool()
data_sync_tool = DataFolderSyncTool()
web_search_tool = WebSearchTool()

def create_governance_agents():
    """
    Creates and returns the 4 specialized AgentAccord governance agents,
    equipped with vectorless RAG, data folder sync, and web search tools.
    """
    # 1. Finance Lead (Red #ef4444)
    finance_lead = Agent(
        role="Finance Lead",
        goal="Aggressively push for immediate cost reduction (20% target) and strict financial discipline to protect cash reserves.",
        backstory="A seasoned CFO focused strictly on bottom-line fiscal health, expense reduction, and downside financial risk mitigation.",
        tools=[vectorless_rag_tool, data_sync_tool, web_search_tool],
        verbose=True,
        allow_delegation=False
    )

    # 2. Market Intelligence Agent (Blue #3b82f6)
    market_agent = Agent(
        role="Market Intelligence Agent",
        goal="Provide evidence-based quantitative analysis from internal budget constraints, contract cancellation penalties, and external market benchmarks.",
        backstory="A meticulous data analyst who retrieves ground-truth financial rules and syncs data assets before making proposals.",
        tools=[vectorless_rag_tool, data_sync_tool, web_search_tool],
        verbose=True,
        allow_delegation=False
    )

    # 3. R&D Project Director (Green #22c55e)
    rd_director = Agent(
        role="R&D Project Director",
        goal="Defend flagship AI and Quantum technology initiatives while conceding non-core Biotech projects if necessary to satisfy savings goals.",
        backstory="A visionary technology leader dedicated to preserving core tech breakthroughs, technical moat, and strategic differentiation.",
        tools=[vectorless_rag_tool, data_sync_tool, web_search_tool],
        verbose=True,
        allow_delegation=False
    )

    # 4. Ethics & Governance Officer (Purple #a855f7)
    ethics_officer = Agent(
        role="Ethics & Governance Officer",
        goal="Ensure budget cuts maintain workforce stability, avoid involuntary layoffs, and adhere to labor regulation and fair policy standards.",
        backstory="A principled legal and human governance officer committed to ethical corporate practices, employee retention, and fair policy execution.",
        tools=[vectorless_rag_tool, data_sync_tool, web_search_tool],
        verbose=True,
        allow_delegation=False
    )

    return {
        "finance_lead": finance_lead,
        "market_agent": market_agent,
        "rd_director": rd_director,
        "ethics_officer": ethics_officer
    }
