from typing import Tuple, Dict

# Base cost per m^2 in INR (₹)
BASE_COST_PER_SQM = {
    "Pothole": 1500.0,
    "Broken Road Edge": 1200.0,
    "Surface Deterioration": 800.0,
    "Crack": 600.0,
    "Damaged Road Marking": 350.0
}

def estimate_repair_cost(damage_type: str, damage_area: float, severity_score: float) -> Tuple[float, float, str]:
    """
    Estimates min and max repair cost in INR (₹).
    Formula: Base Rate * Area * (1 + Severity/100)
    """
    base_rate = BASE_COST_PER_SQM.get(damage_type, 900.0)
    
    # Area scaling
    effective_area = max(damage_area, 0.5)
    
    severity_multiplier = 1.0 + (severity_score / 100.0)
    
    estimated_base = base_rate * effective_area * severity_multiplier
    
    cost_min = round(estimated_base * 0.9, -2)  # round to nearest 100
    cost_max = round(estimated_base * 1.25, -2)
    
    # Ensure minimum reasonable baseline
    if cost_min < 1200:
        cost_min = 1200.0
    if cost_max < 1600:
        cost_max = 1600.0

    disclaimer = "Prototype/model estimate — not an official engineering cost estimate."
    
    return cost_min, cost_max, disclaimer
