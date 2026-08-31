from typing import List, Tuple, Dict

def calculate_road_health(damage_records: List[Dict]) -> Tuple[float, str]:
    """
    Calculates overall road network health score (0-100) from list of damage items.
    """
    if not damage_records:
        return 95.0, "Good"

    total_records = len(damage_records)
    total_severity = sum(d.get("severity_score", 50) for d in damage_records)
    critical_records = sum(1 for d in damage_records if d.get("severity_score", 0) >= 80)
    high_records = sum(1 for d in damage_records if 60 <= d.get("severity_score", 0) < 80)

    # Health deduction formula
    avg_severity = total_severity / total_records if total_records > 0 else 0
    penalty = (avg_severity * 0.4) + (critical_records * 4.0) + (high_records * 1.5)
    
    health_score = round(max(min(100.0 - penalty, 100.0), 20.0), 1)

    if health_score >= 80:
        status = "Good"
    elif health_score >= 60:
        status = "Moderate"
    elif health_score >= 40:
        status = "Poor"
    else:
        status = "Critical"

    return health_score, status
