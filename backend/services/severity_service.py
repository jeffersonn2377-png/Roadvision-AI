from typing import Tuple

DAMAGE_BASE_WEIGHTS = {
    "Pothole": 1.25,
    "Broken Road Edge": 1.15,
    "Surface Deterioration": 1.0,
    "Crack": 0.9,
    "Damaged Road Marking": 0.7
}

def calculate_severity(damage_type: str, confidence: float, damage_area: float, visual_severity: float = None) -> Tuple[float, str]:
    """
    Calculates severity score (0-100) based on damage type, confidence, visual area, and visual inspection score.
    Returns (severity_score, severity_category).
    """
    base_weight = DAMAGE_BASE_WEIGHTS.get(damage_type, 1.0)
    
    # Area weight factor (area in m^2)
    area_factor = min(damage_area / 4.0, 1.5)  # capped scaling
    
    if visual_severity is not None and visual_severity > 0:
        raw_score = (visual_severity * 0.6) + (area_factor * 25.0 * 0.25) + (confidence * 15.0 * 0.15)
    else:
        raw_score = (area_factor * 50.0) + (confidence * 50.0)
        
    final_score = round(min(max(raw_score * base_weight, 10.0), 100.0), 1)

    if final_score >= 81.0:
        category = "CRITICAL"
    elif final_score >= 61.0:
        category = "HIGH"
    elif final_score >= 31.0:
        category = "MODERATE"
    else:
        category = "MINOR"

    return final_score, category
