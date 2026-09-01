import uuid
import datetime
from typing import Dict, Any, Optional

def generate_consent_code() -> str:
    """Generates a unique official consent authorization code."""
    year = datetime.datetime.utcnow().year
    rand_hex = uuid.uuid4().hex[:6].upper()
    return f"CONSENT-{year}-{rand_hex}"

def build_consent_dossier(damage_record: Any, officer: Any) -> Dict[str, Any]:
    """Builds structured formal consent dossier for official sign-off."""
    code = damage_record.official_consent_code or generate_consent_code()
    
    return {
        "official_consent_code": code,
        "issued_at": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "officer": {
            "id": officer.id if officer else None,
            "name": officer.name if officer else "Chief Infrastructure Consent Officer",
            "title": officer.title if officer else "Senior Executive Engineer",
            "department": officer.department if officer else "Public Works & Highways Authority",
            "email": officer.email if officer else "officer@roadvision.ai",
            "jurisdiction": officer.jurisdiction_district if officer else "Central Infrastructure Sector"
        },
        "road_details": {
            "damage_id": damage_record.id,
            "road_name": damage_record.road_name,
            "formatted_address": damage_record.formatted_address or f"{damage_record.road_name}, Metro Zone",
            "district": damage_record.district or "District 1",
            "landmark": damage_record.landmark or "Transit Junction",
            "coordinates": {
                "latitude": damage_record.latitude,
                "longitude": damage_record.longitude,
                "accuracy_meters": damage_record.gps_accuracy or 5.0,
                "source_type": damage_record.location_source_type or "GPS"
            },
            "traffic_level": damage_record.traffic_level,
            "road_importance": damage_record.road_importance
        },
        "ai_inspection_summary": {
            "damage_type": damage_record.damage_type,
            "confidence": damage_record.confidence,
            "severity_score": damage_record.severity_score,
            "damage_area_m2": damage_record.damage_area,
            "priority_score": damage_record.priority_score,
            "priority_level": damage_record.priority_level,
            "bounding_box": damage_record.bounding_box,
            "photo_url": f"/uploads/{damage_record.image_path}"
        },
        "financial_estimate": {
            "min_cost_inr": damage_record.estimated_cost_min,
            "max_cost_inr": damage_record.estimated_cost_max,
            "avg_cost_inr": (damage_record.estimated_cost_min + damage_record.estimated_cost_max) / 2.0
        },
        "consent_status": damage_record.consent_status,
        "officer_notes": damage_record.officer_notes,
        "consent_sent_at": damage_record.consent_sent_at.strftime("%Y-%m-%d %H:%M:%S") if damage_record.consent_sent_at else None,
        "consent_responded_at": damage_record.consent_responded_at.strftime("%Y-%m-%d %H:%M:%S") if damage_record.consent_responded_at else None,
        "digital_signature_hash": f"SIG-SHA256-{uuid.uuid4().hex[:16].upper()}" if damage_record.consent_status == "APPROVED" else None
    }
