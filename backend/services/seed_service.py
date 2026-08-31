import json
import datetime
import hashlib
from sqlalchemy.orm import Session
from models import User, RoadScan, DamageRecord, RoadHistory, Maintenance
from services.severity_service import calculate_severity
from services.priority_service import calculate_priority
from services.cost_service import estimate_repair_cost

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()




def seed_database(db: Session):
    # Check if DB is already seeded
    if db.query(User).filter(User.email == "admin@roadvision.ai").first():
        return

    print("Seeding ROADVISION AI database with initial demo data...")

    # 1. Create Demo Admin User
    admin_user = User(
        name="Chief Infrastructure Engineer",
        email="admin@roadvision.ai",
        password_hash=hash_password("admin123"),
        role="Administrator"
    )
    db.add(admin_user)

    # 2. Seed Predefined Roads & Initial Damage Records (20+ records across 10 roads)
    sample_records_data = [
        # MG Road
        {
            "road_name": "MG Road",
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
            "maint_status": "Pending",
            "maint_assigned": "Zone 1 Maintenance Crew",
            "maint_notes": "Needs urgent cold-mix asphalt filling before monsoons."
        },
        {
            "road_name": "MG Road",
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
            "maint_status": "Assigned",
            "maint_assigned": "Road Maintenance Team Alpha",
            "maint_notes": "Scheduled for rubberized crack sealing."
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
            "maint_notes": "Excavation and base layer compaction in progress."
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
            "maint_notes": "Curb rebuilding required."
        },
        # Central Avenue
        {
            "road_name": "Central Avenue",
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
            "maint_notes": "Micro-surfacing overlay completed on 2026-08-20."
        },
        # Ring Road
        {
            "road_name": "Outer Ring Road",
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
            "maint_notes": "High speed lane defect. Requires immediate night shift repair."
        },
        {
            "road_name": "Outer Ring Road",
            "damage_type": "Damaged Road Marking",
            "confidence": 0.89,
            "damage_area": 1.2,
            "visual_severity": 38.0,
            "latitude": 13.0128,
            "longitude": 77.5905,
            "traffic_level": "HIGH",
            "road_importance": "Highway",
            "image_path": "sample_marking_1.jpg",
            "bbox": {"x": 40, "y": 50, "w": 30, "h": 35},
            "maint_status": "Assigned",
            "maint_assigned": "Traffic Safety Wing",
            "maint_notes": "Thermoplastic paint re-application."
        },
        # Market Road
        {
            "road_name": "Market Road",
            "damage_type": "Pothole",
            "confidence": 0.91,
            "damage_area": 2.1,
            "visual_severity": 82.0,
            "latitude": 12.9650,
            "longitude": 77.5780,
            "traffic_level": "HIGH",
            "road_importance": "Collector",
            "image_path": "sample_pothole_4.jpg",
            "bbox": {"x": 25, "y": 25, "w": 45, "h": 35},
            "maint_status": "Pending",
            "maint_assigned": "Unassigned",
            "maint_notes": "Heavy pedestrian area."
        },
        {
            "road_name": "Market Road",
            "damage_type": "Crack",
            "confidence": 0.85,
            "damage_area": 1.9,
            "visual_severity": 52.0,
            "latitude": 12.9655,
            "longitude": 77.5785,
            "traffic_level": "HIGH",
            "road_importance": "Collector",
            "image_path": "sample_crack_2.jpg",
            "bbox": {"x": 20, "y": 40, "w": 50, "h": 25},
            "maint_status": "Pending",
            "maint_assigned": "Unassigned",
            "maint_notes": "Longitudinal crack spreading."
        },
        # Hosur Road
        {
            "road_name": "Hosur Expressway",
            "damage_type": "Pothole",
            "confidence": 0.95,
            "damage_area": 2.9,
            "visual_severity": 89.0,
            "latitude": 12.9166,
            "longitude": 77.6101,
            "traffic_level": "HIGH",
            "road_importance": "Highway",
            "image_path": "sample_pothole_5.jpg",
            "bbox": {"x": 28, "y": 28, "w": 42, "h": 38},
            "maint_status": "Assigned",
            "maint_assigned": "NHAI Subcontractor",
            "maint_notes": "Bridge ramp transition pothole."
        },
        {
            "road_name": "Hosur Expressway",
            "damage_type": "Surface Deterioration",
            "confidence": 0.87,
            "damage_area": 3.6,
            "visual_severity": 61.0,
            "latitude": 12.9170,
            "longitude": 77.6105,
            "traffic_level": "HIGH",
            "road_importance": "Highway",
            "image_path": "sample_surface_2.jpg",
            "bbox": {"x": 18, "y": 30, "w": 60, "h": 40},
            "maint_status": "In Progress",
            "maint_assigned": "NHAI Subcontractor",
            "maint_notes": "Milling existing layer."
        },
        # Indiranagar 100ft Rd
        {
            "road_name": "Indiranagar 100ft Road",
            "damage_type": "Broken Road Edge",
            "confidence": 0.89,
            "damage_area": 2.2,
            "visual_severity": 68.0,
            "latitude": 12.9780,
            "longitude": 77.6380,
            "traffic_level": "HIGH",
            "road_importance": "Arterial",
            "image_path": "sample_edge_2.jpg",
            "bbox": {"x": 65, "y": 20, "w": 30, "h": 65},
            "maint_status": "Pending",
            "maint_assigned": "East Zone Team",
            "maint_notes": "Storm drain edge collapse."
        },
        {
            "road_name": "Indiranagar 100ft Road",
            "damage_type": "Crack",
            "confidence": 0.84,
            "damage_area": 1.1,
            "visual_severity": 45.0,
            "latitude": 12.9785,
            "longitude": 77.6385,
            "traffic_level": "HIGH",
            "road_importance": "Arterial",
            "image_path": "sample_crack_3.jpg",
            "bbox": {"x": 15, "y": 35, "w": 55, "h": 20},
            "maint_status": "Completed",
            "maint_assigned": "East Zone Team",
            "maint_notes": "Sealed on 2026-08-15."
        },
        # Bannerghatta Road
        {
            "road_name": "Bannerghatta Main Road",
            "damage_type": "Pothole",
            "confidence": 0.93,
            "damage_area": 3.4,
            "visual_severity": 87.0,
            "latitude": 12.8950,
            "longitude": 77.5980,
            "traffic_level": "HIGH",
            "road_importance": "Arterial",
            "image_path": "sample_pothole_6.jpg",
            "bbox": {"x": 22, "y": 32, "w": 48, "h": 36},
            "maint_status": "Pending",
            "maint_assigned": "South Zone Division",
            "maint_notes": "Near metro construction site."
        },
        {
            "road_name": "Bannerghatta Main Road",
            "damage_type": "Damaged Road Marking",
            "confidence": 0.87,
            "damage_area": 1.6,
            "visual_severity": 32.0,
            "latitude": 12.8955,
            "longitude": 77.5985,
            "traffic_level": "HIGH",
            "road_importance": "Arterial",
            "image_path": "sample_marking_2.jpg",
            "bbox": {"x": 30, "y": 55, "w": 40, "h": 30},
            "maint_status": "Pending",
            "maint_assigned": "Unassigned",
            "maint_notes": "Pedestrian crosswalk line faded."
        },
        # Old Airport Road
        {
            "road_name": "Old Airport Road",
            "damage_type": "Crack",
            "confidence": 0.91,
            "damage_area": 2.5,
            "visual_severity": 72.0,
            "latitude": 12.9580,
            "longitude": 77.6520,
            "traffic_level": "HIGH",
            "road_importance": "Arterial",
            "image_path": "sample_crack_4.jpg",
            "bbox": {"x": 12, "y": 38, "w": 70, "h": 22},
            "maint_status": "Assigned",
            "maint_assigned": "HAL Zone Crew",
            "maint_notes": "Alligator cracking network."
        },
        {
            "road_name": "Old Airport Road",
            "damage_type": "Surface Deterioration",
            "confidence": 0.85,
            "damage_area": 3.9,
            "visual_severity": 59.0,
            "latitude": 12.9585,
            "longitude": 77.6525,
            "traffic_level": "HIGH",
            "road_importance": "Arterial",
            "image_path": "sample_surface_3.jpg",
            "bbox": {"x": 20, "y": 22, "w": 55, "h": 45},
            "maint_status": "Pending",
            "maint_assigned": "Unassigned",
            "maint_notes": "Raveling surface layer."
        },
        # Residential Avenue
        {
            "road_name": "Greenwood Residential Avenue",
            "damage_type": "Pothole",
            "confidence": 0.89,
            "damage_area": 1.4,
            "visual_severity": 55.0,
            "latitude": 12.9820,
            "longitude": 77.6010,
            "traffic_level": "LOW",
            "road_importance": "Local",
            "image_path": "sample_pothole_7.jpg",
            "bbox": {"x": 35, "y": 35, "w": 30, "h": 30},
            "maint_status": "Pending",
            "maint_assigned": "Ward 42 Local Crew",
            "maint_notes": "Low speed residential street."
        },
        {
            "road_name": "Greenwood Residential Avenue",
            "damage_type": "Crack",
            "confidence": 0.82,
            "damage_area": 0.9,
            "visual_severity": 35.0,
            "latitude": 12.9825,
            "longitude": 77.6015,
            "traffic_level": "LOW",
            "road_importance": "Local",
            "image_path": "sample_crack_5.jpg",
            "bbox": {"x": 20, "y": 50, "w": 40, "h": 15},
            "maint_status": "Completed",
            "maint_assigned": "Ward 42 Local Crew",
            "maint_notes": "Completed during routine neighborhood patch."
        },
        # Tech Park Link Road
        {
            "road_name": "Tech Park Link Road",
            "damage_type": "Pothole",
            "confidence": 0.94,
            "damage_area": 2.7,
            "visual_severity": 86.0,
            "latitude": 12.9350,
            "longitude": 77.6910,
            "traffic_level": "HIGH",
            "road_importance": "Arterial",
            "image_path": "sample_pothole_8.jpg",
            "bbox": {"x": 24, "y": 30, "w": 46, "h": 36},
            "maint_status": "Pending",
            "maint_assigned": "IT Corridor Team",
            "maint_notes": "Heavy shuttle bus traffic area."
        }
    ]

    # Create dummy parent scan
    scan = RoadScan(
        filename="seed_batch_scan.zip",
        file_type="batch_image",
        latitude=12.9716,
        longitude=77.5946,
        location_source="Demo Batch",
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

        record = DamageRecord(
            scan_id=scan.id,
            road_name=item["road_name"],
            damage_type=item["damage_type"],
            confidence=item["confidence"],
            severity_score=sev_score,
            damage_area=item["damage_area"],
            latitude=item["latitude"],
            longitude=item["longitude"],
            traffic_level=item["traffic_level"],
            road_importance=item["road_importance"],
            risk_level=p_res["risk_level"],
            priority_score=p_res["priority_score"],
            priority_level=p_res["priority_level"],
            estimated_cost_min=cost_min,
            estimated_cost_max=cost_max,
            image_path=item["image_path"],
            bounding_box=json.dumps(item["bbox"]),
            status=item["maint_status"]
        )
        db.add(record)
        db.flush()

        # Add corresponding maintenance record
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

    # 3. Seed Historical Health Data for Predictive Maintenance
    historical_data = [
        {"road": "MG Road", "data": [("January", 94.0), ("February", 89.0), ("March", 84.0), ("April", 80.0), ("May", 74.0), ("June", 62.0)]},
        {"road": "Anna Nagar 2nd Avenue", "data": [("January", 91.0), ("February", 86.0), ("March", 81.0), ("April", 76.0), ("May", 70.0), ("June", 59.0)]},
        {"road": "Outer Ring Road", "data": [("January", 96.0), ("February", 92.0), ("March", 87.0), ("April", 81.0), ("May", 73.0), ("June", 60.0)]},
        {"road": "Central Avenue", "data": [("January", 88.0), ("February", 85.0), ("March", 82.0), ("April", 80.0), ("May", 78.0), ("June", 75.0)]}
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
    print("Database seeding completed successfully!")
