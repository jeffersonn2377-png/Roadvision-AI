import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="Administrator")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class RoadScan(Base):
    __tablename__ = "road_scans"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), default="image")
    scan_date = Column(DateTime, default=datetime.datetime.utcnow)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_source = Column(String(50), default="Demo Location")
    status = Column(String(50), default="Processed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    damage_records = relationship("DamageRecord", back_populates="scan", cascade="all, delete-orphan")


class DamageRecord(Base):
    __tablename__ = "damage_records"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("road_scans.id"), nullable=True)
    road_name = Column(String(150), nullable=False)
    damage_type = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    severity_score = Column(Float, nullable=False)
    damage_area = Column(Float, nullable=False)  # in m^2
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    traffic_level = Column(String(50), default="HIGH")  # HIGH, MEDIUM, LOW
    road_importance = Column(String(50), default="Arterial")  # Highway, Arterial, Collector, Local
    risk_level = Column(String(50), default="HIGH")  # CRITICAL, HIGH, MODERATE, LOW
    priority_score = Column(Float, nullable=False)  # 0-100
    priority_level = Column(String(50), nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    estimated_cost_min = Column(Float, nullable=False)
    estimated_cost_max = Column(Float, nullable=False)
    image_path = Column(String(255), nullable=False)
    bounding_box = Column(Text, nullable=True)  # JSON string e.g. {"x": 20, "y": 30, "w": 40, "h": 35}
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50), default="Pending")  # Pending, Assigned, In Progress, Completed

    scan = relationship("RoadScan", back_populates="damage_records")
    maintenance = relationship("Maintenance", back_populates="damage_record", uselist=False, cascade="all, delete-orphan")


class RoadHistory(Base):
    __tablename__ = "road_history"

    id = Column(Integer, primary_key=True, index=True)
    road_name = Column(String(150), nullable=False)
    health_score = Column(Float, nullable=False)
    damage_count = Column(Integer, default=0)
    recorded_date = Column(String(20), nullable=False)  # YYYY-MM-DD or Month name e.g. "2026-01"


class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(Integer, primary_key=True, index=True)
    damage_id = Column(Integer, ForeignKey("damage_records.id"), nullable=False)
    status = Column(String(50), default="Pending")  # Pending, Assigned, In Progress, Completed
    assigned_to = Column(String(150), default="Unassigned")
    estimated_cost = Column(Float, nullable=False)
    scheduled_date = Column(String(20), nullable=True)
    completed_date = Column(String(20), nullable=True)
    notes = Column(Text, nullable=True)

    damage_record = relationship("DamageRecord", back_populates="maintenance")
