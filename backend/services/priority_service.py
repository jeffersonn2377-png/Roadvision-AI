from typing import Tuple, Dict, Any

TRAFFIC_SCORES = {
    "HIGH": 100.0,
    "MEDIUM": 60.0,
    "LOW": 30.0
}

IMPORTANCE_SCORES = {
    "Highway": 100.0,
    "Arterial": 85.0,
    "Collector": 60.0,
    "Local": 35.0
}

def calculate_priority(
    severity_score: float,
    damage_area: float,
    traffic_level: str = "HIGH",
    road_importance: str = "Arterial"
) -> Dict[str, Any]:
    """
    Main Innovation Algorithm: Priority score calculated from:
    - Damage Severity: 35%
    - Damage Size/Risk: 30%
    - Traffic Level: 20%
    - Road Importance: 15%
    """
    traffic_val = TRAFFIC_SCORES.get(traffic_level.upper(), 60.0)
    importance_val = IMPORTANCE_SCORES.get(road_importance, 60.0)
    
    # Damage area / size risk score (normalized to 0-100)
    size_risk_score = min((damage_area / 4.0) * 80.0 + 20.0, 100.0)
    
    score_severity_part = severity_score * 0.35
    score_size_part = size_risk_score * 0.30
    score_traffic_part = traffic_val * 0.20
    score_importance_part = importance_val * 0.15
    
    total_priority = round(score_severity_part + score_size_part + score_traffic_part + score_importance_part, 1)
    total_priority = min(max(total_priority, 10.0), 100.0)

    if total_priority >= 81.0:
        level = "CRITICAL"
    elif total_priority >= 61.0:
        level = "HIGH"
    elif total_priority >= 41.0:
        level = "MEDIUM"
    else:
        level = "LOW"

    # Risk level classification
    if severity_score >= 80 or total_priority >= 80:
        risk_level = "HIGH"
    elif severity_score >= 50 or total_priority >= 50:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    return {
        "priority_score": total_priority,
        "priority_level": level,
        "risk_level": risk_level,
        "breakdown": {
            "severity_contrib": round(score_severity_part, 1),
            "size_risk_contrib": round(score_size_part, 1),
            "traffic_contrib": round(score_traffic_part, 1),
            "importance_contrib": round(score_importance_part, 1)
        }
    }


def generate_ai_recommendation(top_record_road: str, priority_score: float, damage_type: str, traffic_level: str) -> str:
    """
    Generates dynamic AI recommendation text based on highest priority damage record.
    """
    if not top_record_road:
        return "No critical road defects detected. Maintain routine inspection schedules."

    return (
        f"Repair {top_record_road} first because its combination of severe {damage_type.lower()} damage "
        f"(Priority Score: {priority_score}/100), {traffic_level.lower()} traffic volume, and elevated safety risk "
        f"makes it the highest priority candidate for immediate dispatch."
    )
