import os
from crewai import Agent
from crewai_tools import FileReadTool

# Initialize RAG document search tool targeting budget constraint data
data_file_path = os.path.join(os.path.dirname(__file__), 'data', 'r_and_d_budget_2026.txt')
file_search_tool = FileReadTool(file_path=data_file_path)

def create_governance_agents():
    """
    Creates and returns the 4 specialized AgentAccord governance agents.
    """
    # 1. Finance Lead
    finance_lead = Agent(
        role="Finance Lead",
        goal="Aggressively push for immediate cost reduction and strict financial discipline to protect company cash reserves.",
        backstory="A seasoned CFO focused strictly on fiscal health, expense reduction, and mitigating downside financial exposure.",
        verbose=True,
        allow_delegation=False
    )

    # 2. Market Intelligence Agent (RAG Attached)
    market_agent = Agent(
        role="Market Intelligence Agent",
        goal="Provide data-driven evidence from budget constraints and contract cancellation penalty documents to inform negotiation.",
        backstory="A meticulous data analyst who retrieves ground-truth financial facts and threshold rules before making proposals.",
        tools=[file_search_tool],
        verbose=True,
        allow_delegation=False
    )

    # 3. R&D Project Director
    rd_director = Agent(
        role="R&D Project Director",
        goal="Defend flagship AI and Quantum technology initiatives while conceding non-core Biotech projects if necessary.",
        backstory="A visionary technology leader dedicated to preserving core tech innovations and market differentiation.",
        verbose=True,
        allow_delegation=False
    )

    # 4. Ethics & Governance Officer
    ethics_officer = Agent(
        role="Ethics & Governance Officer",
        goal="Ensure budget cuts do not trigger unfair involuntary layoffs or violate labor compliance and employee well-being.",
        backstory="A principled governance official committed to ethical corporate practices, employee retention, and fair policy execution.",
        verbose=True,
        allow_delegation=False
    )

    return {
        "finance_lead": finance_lead,
        "market_agent": market_agent,
        "rd_director": rd_director,
        "ethics_officer": ethics_officer
    }
