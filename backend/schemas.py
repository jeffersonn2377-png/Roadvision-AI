from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str
    user_email: str
    user_role: str


# Location & Geocoding Schemas
class ReverseGeocodeRequest(BaseModel):
    latitude: float
    longitude: float


class ReverseGeocodeResponse(BaseModel):
    road_name: str
    formatted_address: str
    district: str
    city: str
    pincode: str
    landmark: str
    highway_code: Optional[str] = None
    accuracy_meters: float = 5.0


# Consent Officer Schemas
class ConsentOfficerBase(BaseModel):
    name: str
    title: str
    department: str
    email: str
    phone: Optional[str] = None
    jurisdiction_district: str
    is_active: Optional[int] = 1


class ConsentOfficerCreate(ConsentOfficerBase):
    pass


class ConsentOfficerResponse(ConsentOfficerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class DispatchConsentRequest(BaseModel):
    damage_id: int
    consent_officer_id: int
    dispatch_notes: Optional[str] = None
    urgency: Optional[str] = "HIGH"


class ReviewConsentRequest(BaseModel):
    status: str  # APPROVED, REJECTED, MORE_INFO_REQUESTED
    officer_notes: Optional[str] = None


# Scan / Analysis Request
class AnalyzeRequest(BaseModel):
    road_name: Optional[str] = "MG Road"
    latitude: Optional[float] = 12.9716
    longitude: Optional[float] = 77.5946
    formatted_address: Optional[str] = None
    district: Optional[str] = None
    landmark: Optional[str] = None
    gps_accuracy: Optional[float] = 5.0
    location_source_type: Optional[str] = "REVERSE_GEOCODED"
    location_source: Optional[str] = "Demo Location"
    traffic_level: Optional[str] = "HIGH"
    road_importance: Optional[str] = "Arterial"
    sample_preset: Optional[str] = None


# Damage Record Schemas
class DamageRecordBase(BaseModel):
    road_name: str
    damage_type: str
    confidence: float
    severity_score: float
    damage_area: float
    latitude: float
    longitude: float
    formatted_address: Optional[str] = None
    district: Optional[str] = None
    landmark: Optional[str] = None
    gps_accuracy: Optional[float] = 5.0
    location_source_type: Optional[str] = "REVERSE_GEOCODED"
    traffic_level: str
    road_importance: str
    risk_level: str
    priority_score: float
    priority_level: str
    estimated_cost_min: float
    estimated_cost_max: float
    image_path: str
    bounding_box: Optional[str] = None
    status: str = "Pending"
    consent_status: Optional[str] = "DRAFT"
    consent_officer_id: Optional[int] = None
    consent_sent_at: Optional[datetime] = None
    consent_responded_at: Optional[datetime] = None
    officer_notes: Optional[str] = None
    official_consent_code: Optional[str] = None


class DamageRecordResponse(DamageRecordBase):
    id: int
    scan_id: Optional[int] = None
    detected_at: datetime
    consent_officer: Optional[ConsentOfficerResponse] = None

    class Config:
        from_attributes = True


# Maintenance Schemas
class MaintenanceUpdate(BaseModel):
    status: str
    assigned_to: Optional[str] = None
    scheduled_date: Optional[str] = None
    completed_date: Optional[str] = None
    notes: Optional[str] = None


class MaintenanceResponse(BaseModel):
    id: int
    damage_id: int
    status: str
    assigned_to: str
    estimated_cost: float
    scheduled_date: Optional[str] = None
    completed_date: Optional[str] = None
    notes: Optional[str] = None
    damage_record: Optional[DamageRecordResponse] = None

    class Config:
        from_attributes = True


# Dashboard Summary Schema
class DashboardSummary(BaseModel):
    roads_scanned_km: float
    total_damage_count: int
    critical_count: int
    high_count: int
    moderate_count: int
    minor_count: int
    pending_consent_count: int = 0
    approved_consent_count: int = 0
    estimated_total_cost_lakh: float
    overall_road_health: float
    health_status: str
    damage_distribution: Dict[str, int]
    recent_detections: List[DamageRecordResponse]
    top_recommendation: str
    ai_mode_notice: str = "DEMO AI MODE — Detection results are simulated unless a trained YOLO model is configured."


# Analytics Response Schema
class AnalyticsSummary(BaseModel):
    damage_by_type: List[Dict[str, Any]]
    severity_distribution: List[Dict[str, Any]]
    road_health_trend: List[Dict[str, Any]]
    damage_growth: List[Dict[str, Any]]


# Prediction Response Schema
class PredictionResponse(BaseModel):
    road_name: str
    current_health: float
    predicted_30d_health: float
    risk_level: str
    recommendation: str
    historical_points: List[Dict[str, Any]]
    projected_points: List[Dict[str, Any]]
    disclaimer: str = "Prototype prediction — based on historical trend data."


# Priority Calculation Request/Response
class PriorityCalculateRequest(BaseModel):
    severity_score: float
    damage_area: float
    traffic_level: str  # HIGH, MEDIUM, LOW
    road_importance: str  # Highway, Arterial, Collector, Local


class PriorityCalculateResponse(BaseModel):
    priority_score: float
    priority_level: str
    breakdown: Dict[str, float]
    recommendation: str
