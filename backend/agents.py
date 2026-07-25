from crewai import Agent
from tools import (
    DataFolderSyncTool,
    DocumentSearchTool,
    create_budget_rag_tool,
    create_scrape_website_tool,
    create_web_search_tool,
)


def create_governance_agents():
    """
    Creates and returns the 4 specialized AgentAccord governance agents.

    Every agent is equipped with the full default CrewAI tool stack:
      - Budget RAG Search (TXTSearchTool over backend/data, local ChromaDB at backend/db)
      - SerperDevTool (live Google search, requires SERPER_API_KEY)
      - ScrapeWebsiteTool (on-demand website scraping)
      - DataFolderSyncTool (custom local file sync/audit)
      - DocumentSearchTool (search uploaded company documents)

    All agents use OpenAI GPT-4o-mini as the LLM (requires OPENAI_API_KEY).
    """
    shared_tools = [
        create_budget_rag_tool(),
        create_web_search_tool(),
        create_scrape_website_tool(),
        DataFolderSyncTool(),
        DocumentSearchTool(),
    ]

    # Explicit OpenAI LLM configuration for all agents
    openai_llm = "openai/gpt-4o-mini"

    # 1. Finance Lead (Red #ef4444)
    finance_lead = Agent(
        role="Finance Lead",
        goal="Aggressively push for immediate cost reduction (20% target) and strict financial discipline to protect cash reserves.",
        backstory="A seasoned CFO focused strictly on bottom-line fiscal health, expense reduction, and downside financial risk mitigation.",
        tools=shared_tools,
        llm=openai_llm,
        verbose=True,
        allow_delegation=False
    )

    # 2. Market Intelligence Agent (Blue #3b82f6)
    market_agent = Agent(
        role="Market Intelligence Agent",
        goal="Provide evidence-based quantitative analysis from internal budget constraints, contract cancellation penalties, and external market benchmarks.",
        backstory="A meticulous data analyst who retrieves ground-truth financial rules via RAG search and live market data before making proposals.",
        tools=shared_tools,
        llm=openai_llm,
        verbose=True,
        allow_delegation=False
    )

    # 3. R&D Project Director (Green #22c55e)
    rd_director = Agent(
        role="R&D Project Director",
        goal="Defend flagship AI and Quantum technology initiatives while conceding non-core Biotech projects if necessary to satisfy savings goals.",
        backstory="A visionary technology leader dedicated to preserving core tech breakthroughs, technical moat, and strategic differentiation.",
        tools=shared_tools,
        llm=openai_llm,
        verbose=True,
        allow_delegation=False
    )

    # 4. Ethics & Governance Officer (Purple #a855f7)
    ethics_officer = Agent(
        role="Ethics & Governance Officer",
        goal="Ensure budget cuts maintain workforce stability, avoid involuntary layoffs, and adhere to labor regulation and fair policy standards.",
        backstory="A principled legal and human governance officer committed to ethical corporate practices, employee retention, and fair policy execution.",
        tools=shared_tools,
        llm=openai_llm,
        verbose=True,
        allow_delegation=False
    )

    return {
        "finance_lead": finance_lead,
        "market_agent": market_agent,
        "rd_director": rd_director,
        "ethics_officer": ethics_officer
    }
