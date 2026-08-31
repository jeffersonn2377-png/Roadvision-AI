from typing import List, Dict, Any

def predict_road_health_trend(road_name: str, historical_records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Applies linear regression / decay model on historical health scores to project 30-day health.
    Historical sample: Jan (92), Feb (87), Mar (82), Apr (78), May (72), Jun (61)
    """
    if not historical_records:
        # Fallback default historical trend
        historical_records = [
            {"month": "January", "health": 92.0},
            {"month": "February", "health": 87.0},
            {"month": "March", "health": 82.0},
            {"month": "April", "health": 78.0},
            {"month": "May", "health": 72.0},
            {"month": "June", "health": 61.0}
        ]

    scores = [h["health"] for h in historical_records]
    n = len(scores)

    if n > 1:
        # Calculate average monthly decay rate
        total_drop = scores[0] - scores[-1]
        monthly_decay = total_drop / (n - 1)
    else:
        monthly_decay = 5.0

    current_health = scores[-1]
    predicted_30d = round(max(current_health - monthly_decay, 15.0), 1)

    if predicted_30d < 50.0:
        risk_level = "HIGH"
        recommendation = "Urgent preventive resurfacing & sealing recommended within 14 days."
    elif predicted_30d < 70.0:
        risk_level = "MODERATE"
        recommendation = "Preventive crack sealing and localized patching recommended."
    else:
        risk_level = "LOW"
        recommendation = "Routine quarterly monitoring. No immediate intervention needed."

    # Generate 3-month future projection points
    future_points = [
        {"month": "July (Proj)", "health": round(max(current_health - monthly_decay, 10.0), 1)},
        {"month": "August (Proj)", "health": round(max(current_health - (monthly_decay * 2), 10.0), 1)},
        {"month": "September (Proj)", "health": round(max(current_health - (monthly_decay * 3), 10.0), 1)}
    ]

    return {
        "road_name": road_name,
        "current_health": current_health,
        "predicted_30d_health": predicted_30d,
        "decay_rate_per_month": round(monthly_decay, 2),
        "risk_level": risk_level,
        "recommendation": recommendation,
        "historical_points": historical_records,
        "projected_points": future_points,
        "disclaimer": "Prototype prediction — based on historical trend data."
    }
