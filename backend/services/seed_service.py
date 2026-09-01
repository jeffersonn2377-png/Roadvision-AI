import json
import datetime
import hashlib
from sqlalchemy.orm import Session
from models import User, RoadScan, DamageRecord, RoadHistory, Maintenance, ConsentOfficer
from services.severity_service import calculate_severity
from services.priority_service import calculate_priority
from services.cost_service import estimate_repair_cost
from services.location_service import reverse_geocode
from services.consent_service import generate_consent_code

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def seed_database(db: Session):
    # Check if DB is already seeded
    if db.query(User).filter(User.email == "admin@roadvision.ai").first():
        return

    print("Seeding ROADVISION AI database with initial demo data & Consent Officers...")

    # 1. Create Demo Admin User
    admin_user = User(
        name="Chief Infrastructure Engineer",
        email="admin@roadvision.ai",
        password_hash=hash_password("admin123"),
        role="Administrator"
    )
    db.add(admin_user)

    # 2. Create Initial Consent Officers
    officers_data = [
        {
            "name": "Er. Rajesh Sharma",
            "title": "Chief Executive Engineer",
            "department": "Public Works Department (PWD - Zone 1)",
            "email": "rajesh.sharma@pwd.gov.in",
            "phone": "+91 98765 43210",
            "jurisdiction_district": "Central Infrastructure District"
        },
        {
            "name": "Dr. Meera Nambiar",
            "title": "Senior Infrastructure Safety Inspector",
            "department": "Municipal Urban Roads Authority",
            "email": "meera.nambiar@municipal.gov.in",
            "phone": "+91 98123 45678",
            "jurisdiction_district": "North Zone Highway Sector"
        },
        {
            "name": "Mr. Ankit Verma",
            "title": "Regional Director & Approving Authority",
            "department": "National Highways Infrastructure Authority",
            "email": "ankit.verma@nhai.gov.in",
            "phone": "+91 99887 76655",
            "jurisdiction_district": "Expressway Transit Sector"
        }
    ]

    seeded_officers = []
    for off in officers_data:
        officer = ConsentOfficer(
            name=off["name"],
            title=off["title"],
            department=off["department"],
            email=off["email"],
            phone=off["phone"],
            jurisdiction_district=off["jurisdiction_district"],
            is_active=1
        )
        db.add(officer)
        db.flush()
        seeded_officers.append(officer)

    # 3. Seed Predefined Roads & Initial Damage Records
    sample_records_data = [
        # MG Road (High priority pothole - APPROVED BY CONSENT OFFICER)
        {
            "road_name": "MG Road Expressway",
            "damage_type": "Pothole",
            "confidence": 0.94,
            "damage_area": 2.4,
            "visual_severity": 91.0,
            "latitude": 12.9716,
            "longitude": 77.5946,
            "traffic_level": "HIGH",
            "road_importance": "Highway",
            "image_path": "sample_pothole_1.jpg",
            "bbox": {"x": 25, "y": 30, "w": 45, "h": 35},
            "maint_status": "Assigned",
            "maint_assigned": "Zone 1 Maintenance Crew",
            "maint_notes": "Needs urgent cold-mix asphalt filling before monsoons.",
            "consent_status": "APPROVED",
            "consent_officer": seeded_officers[0],
            "officer_notes": "Consent granted. Immediate night shift repair approved under emergency repair fund.",
            "consent_code": generate_consent_code()
        },
        {
            "road_name": "MG Road Expressway",
            "damage_type": "Crack",
            "confidence": 0.88,
            "damage_area": 1.5,
            "visual_severity": 58.0,
            "latitude": 12.9720,
            "longitude": 77.5950,
            "traffic_level": "HIGH",
            "road_importance": "Highway",
            "image_path": "sample_crack_1.jpg",
            "bbox": {"x": 10, "y": 45, "w": 65, "h": 20},
            "maint_status": "Pending",
            "maint_assigned": "Road Maintenance Team Alpha",
            "maint_notes": "Scheduled for rubberized crack sealing.",
            "consent_status": "PENDING_CONSENT",
            "consent_officer": seeded_officers[0],
            "officer_notes": "Under review by Chief Engineer. Traffic diversion plan requested.",
            "consent_code": None
        },
        # Anna Nagar
        {
            "road_name": "Anna Nagar 2nd Avenue",
            "damage_type": "Pothole",
            "confidence": 0.92,
            "damage_area": 3.1,
            "visual_severity": 85.0,
            "latitude": 13.0850,
            "longitude": 80.2101,
            "traffic_level": "HIGH",
            "road_importance": "Arterial",
            "image_path": "sample_pothole_2.jpg",
            "bbox": {"x": 20, "y": 25, "w": 50, "h": 40},
            "maint_status": "In Progress",
            "maint_assigned": "Metro Works Ltd.",
            "maint_notes": "Excavation and base layer compaction in progress.",
            "consent_status": "APPROVED",
            "consent_officer": seeded_officers[1],
            "officer_notes": "Official clearance issued for full lane resurfacing.",
            "consent_code": generate_consent_code()
        },
        {
            "road_name": "Anna Nagar 2nd Avenue",
            "damage_type": "Broken Road Edge",
            "confidence": 0.86,
            "damage_area": 2.8,
            "visual_severity": 74.0,
            "latitude": 13.0855,
            "longitude": 80.2108,
            "traffic_level": "HIGH",
            "road_importance": "Arterial",
            "image_path": "sample_edge_1.jpg",
            "bbox": {"x": 60, "y": 15, "w": 35, "h": 75},
            "maint_status": "Pending",
            "maint_assigned": "Unassigned",
            "maint_notes": "Curb rebuilding required.",
            "consent_status": "PENDING_CONSENT",
            "consent_officer": seeded_officers[1],
            "officer_notes": "Awaiting updated cost estimate validation.",
            "consent_code": None
        },
        # Outer Ring Road
        {
            "road_name": "Outer Ring Road Highway",
            "damage_type": "Pothole",
            "confidence": 0.96,
            "damage_area": 3.8,
            "visual_severity": 93.0,
            "latitude": 13.0123,
            "longitude": 77.5900,
            "traffic_level": "HIGH",
            "road_importance": "Highway",
            "image_path": "sample_pothole_3.jpg",
            "bbox": {"x": 30, "y": 30, "w": 40, "h": 40},
            "maint_status": "Pending",
            "maint_assigned": "Expressway Maintenance Team",
            "maint_notes": "High speed lane defect. Requires immediate night shift repair.",
            "consent_status": "PENDING_CONSENT",
            "consent_officer": seeded_officers[2],
            "officer_notes": "Expressway dispatch pending regional director clearance.",
            "consent_code": None
        },
        # Central Avenue
        {
            "road_name": "Central Avenue Corridor",
            "damage_type": "Surface Deterioration",
            "confidence": 0.90,
            "damage_area": 4.5,
            "visual_severity": 65.0,
            "latitude": 12.9784,
            "longitude": 77.6408,
            "traffic_level": "MEDIUM",
            "road_importance": "Arterial",
            "image_path": "sample_surface_1.jpg",
            "bbox": {"x": 15, "y": 20, "w": 65, "h": 50},
            "maint_status": "Completed",
            "maint_assigned": "Civic Infra Corp",
            "maint_notes": "Micro-surfacing overlay completed.",
            "consent_status": "APPROVED",
            "consent_officer": seeded_officers[0],
            "officer_notes": "Approved and signed off upon post-repair audit.",
            "consent_code": generate_consent_code()
        }
    ]

    scan = RoadScan(
        filename="seed_batch_scan.zip",
        file_type="batch_image",
        latitude=12.9716,
        longitude=77.5946,
        location_source="Demo Batch EXIF & Geocoded",
        status="Completed"
    )
    db.add(scan)
    db.flush()

    for item in sample_records_data:
        sev_score, sev_cat = calculate_severity(
            damage_type=item["damage_type"],
            confidence=item["confidence"],
            damage_area=item["damage_area"],
            visual_severity=item["visual_severity"]
        )
        
        p_res = calculate_priority(
            severity_score=sev_score,
            damage_area=item["damage_area"],
            traffic_level=item["traffic_level"],
            road_importance=item["road_importance"]
        )
        
        cost_min, cost_max, _ = estimate_repair_cost(
            damage_type=item["damage_type"],
            damage_area=item["damage_area"],
            severity_score=sev_score
        )

        geo = reverse_geocode(item["latitude"], item["longitude"])

        record = DamageRecord(
            scan_id=scan.id,
            road_name=item["road_name"],
            damage_type=item["damage_type"],
            confidence=item["confidence"],
            severity_score=sev_score,
            damage_area=item["damage_area"],
            latitude=item["latitude"],
            longitude=item["longitude"],
            formatted_address=geo["formatted_address"],
            district=geo["district"],
            landmark=geo["landmark"],
            gps_accuracy=geo["accuracy_meters"],
            location_source_type="REVERSE_GEOCODED",
            traffic_level=item["traffic_level"],
            road_importance=item["road_importance"],
            risk_level=p_res["risk_level"],
            priority_score=p_res["priority_score"],
            priority_level=p_res["priority_level"],
            estimated_cost_min=cost_min,
            estimated_cost_max=cost_max,
            image_path=item["image_path"],
            bounding_box=json.dumps(item["bbox"]),
            status=item["maint_status"],
            consent_status=item["consent_status"],
            consent_officer_id=item["consent_officer"].id if item.get("consent_officer") else None,
            consent_sent_at=datetime.datetime.utcnow() - datetime.timedelta(days=1) if item["consent_status"] != "DRAFT" else None,
            consent_responded_at=datetime.datetime.utcnow() if item["consent_status"] == "APPROVED" else None,
            officer_notes=item.get("officer_notes"),
            official_consent_code=item.get("consent_code")
        )
        db.add(record)
        db.flush()

        maint = Maintenance(
            damage_id=record.id,
            status=item["maint_status"],
            assigned_to=item["maint_assigned"],
            estimated_cost=(cost_min + cost_max) / 2.0,
            scheduled_date="2026-09-05" if item["maint_status"] in ["Assigned", "In Progress"] else None,
            completed_date="2026-08-20" if item["maint_status"] == "Completed" else None,
            notes=item["maint_notes"]
        )
        db.add(maint)

    # 4. Seed Historical Health Data
    historical_data = [
        {"road": "MG Road Expressway", "data": [("January", 94.0), ("February", 89.0), ("March", 84.0), ("April", 80.0), ("May", 74.0), ("June", 62.0)]},
        {"road": "Anna Nagar 2nd Avenue", "data": [("January", 91.0), ("February", 86.0), ("March", 81.0), ("April", 76.0), ("May", 70.0), ("June", 59.0)]},
        {"road": "Outer Ring Road Highway", "data": [("January", 96.0), ("February", 92.0), ("March", 87.0), ("April", 81.0), ("May", 73.0), ("June", 60.0)]},
        {"road": "Central Avenue Corridor", "data": [("January", 88.0), ("February", 85.0), ("March", 82.0), ("April", 80.0), ("May", 78.0), ("June", 75.0)]}
    ]

    for h_road in historical_data:
        road_name = h_road["road"]
        for month, score in h_road["data"]:
            history_entry = RoadHistory(
                road_name=road_name,
                health_score=score,
                damage_count=max(int((100 - score) / 5), 1),
                recorded_date=month
            )
            db.add(history_entry)

    db.commit()
    print("Database seeding completed with Consent Officers & Geocoded Records!")
