from crewai import Task

def create_negotiation_tasks(agents: dict, user_prompt: str) -> list[Task]:
    """
    Builds sequential negotiation tasks for the CrewAI crew based on the user's prompt.
    """
    finance_lead = agents["finance_lead"]
    market_agent = agents["market_agent"]
    rd_director = agents["rd_director"]
    ethics_officer = agents["ethics_officer"]

    task1 = Task(
        description=f"Analyze the budget mandate '{user_prompt}' and demand an aggressive cost reduction proposal highlighting initial savings targets.",
        expected_output="An initial stance from Finance demanding cost cuts across R&D verticals.",
        agent=finance_lead
    )

    task2 = Task(
        description="MANDATORY: Execute your search tool to query minimum budget constraints and contract penalties in the document before speaking. State explicit threshold rules and cancellation penalties.",
        expected_output="A data-backed report detailing minimum threshold constraints for AI, Quantum, and Biotech projects.",
        agent=market_agent
    )

    task3 = Task(
        description="Respond to Finance and Market Data by defending core AI budget (minimum 50%) and Quantum (30%), while agreeing to concession on Biotech (15%) to satisfy savings.",
        expected_output="A tech project defense proposal prioritizing AI/Quantum and accepting Biotech scale-down.",
        agent=rd_director
    )

    task4 = Task(
        description="Evaluate the compromise proposal to ensure zero involuntary layoffs, verifying labor compliance and framing the final accord balance.",
        expected_output="A final governance endorsement ensuring zero workforce layoffs and ethical balance.",
        agent=ethics_officer
    )

    return [task1, task2, task3, task4]
