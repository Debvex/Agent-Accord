# pyrefly: ignore [missing-import]
import numpy as np
from typing import List

def calculate_resilience_score(policy_allocations: List[float]) -> float:
    """
    Calculates market resilience score using NumPy matrix stress-testing.
    
    :param policy_allocations: List of normalized project allocations [AI, Quantum, Biotech]
    :return: Normalized resilience score out of 10.0
    """
    if not policy_allocations or len(policy_allocations) < 3:
        # Default allocation ratio [AI=0.55, Quantum=0.30, Biotech=0.15]
        policy_allocations = [0.55, 0.30, 0.15]
        
    allocations = np.array(policy_allocations[:3], dtype=float)
    # Normalize if total does not sum to 1.0
    total = np.sum(allocations)
    if total > 0:
        allocations = allocations / total

    # Market shock scenario vector: AI high resilience (0.85), Quantum medium (0.40), Biotech (0.15)
    market_shock_weights = np.array([0.85, 0.40, 0.15])
    
    raw_score = float(np.dot(allocations, market_shock_weights))
    resilience_score = round(raw_score * 10.0, 1)
    
    return min(max(resilience_score, 0.0), 10.0)

if __name__ == "__main__":
    test_allocs = [0.55, 0.30, 0.15]
    score = calculate_resilience_score(test_allocs)
    print(f"Test Resilience Score for {test_allocs}: {score}/10.0")
