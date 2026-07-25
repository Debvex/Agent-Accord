from crewai import Task

def create_negotiation_tasks(agents: dict, user_prompt: str) -> list[Task]:
    """
    Builds sequential negotiation tasks for the CrewAI crew based on the user's policy mandate prompt.
    Each task runs individually and asynchronously per agent (see crew.py).
    """
    finance_lead = agents["finance_lead"]
    market_agent = agents["market_agent"]
    rd_director = agents["rd_director"]
    ethics_officer = agents["ethics_officer"]

    task1 = Task(
        description=(
            f"Analyze the policy mandate '{user_prompt}'. Demands an aggressive 20% cost reduction "
            "across overall R&D spend. Outline initial cost targets and urge all department leads to cut budget."
        ),
        expected_output="An analytical demand from Finance calling for immediate 20% R&D budget cuts.",
        agent=finance_lead
    )

    task2 = Task(
        description=(
            "Search the vector database for information about minimum budget constraints "
            "and contract cancellation penalties. If no relevant results are found (similarity < 0.8), "
            "use the web search tool to find this information. Also execute the Data Folder Sync Tool "
            "to copy budget files to 'synced_data'. Report exact minimum allocation thresholds for AI, "
            "Quantum, and Biotech, and state termination penalty costs."
        ),
        expected_output="A data-backed report stating budget threshold constraints, contract penalties, and confirmation of file sync.",
        agent=market_agent
    )

    task3 = Task(
        description=(
            "Evaluate Finance's demand and Market Data's constraints. Defend core AI budget at minimum 55% "
            "and Quantum at 30%, while proposing a concession of Biotech to 15% to absorb the required budget cut."
        ),
        expected_output="A technological defense proposal prioritizing core AI/Quantum breakthroughs while conceding on Biotech.",
        agent=rd_director
    )

    task4 = Task(
        description=(
            "Evaluate the proposed reallocation (AI 55%, Quantum 30%, Biotech 15%). Verify that project scale-down "
            "absorbs the 20% cost reduction through non-labor concessions, ensuring zero involuntary workforce layoffs. "
            "Conclude with a final accord summary."
        ),
        expected_output="A final governance endorsement validating labor compliance, zero involuntary layoffs, and final accord balance.",
        agent=ethics_officer
    )

    return [task1, task2, task3, task4]
