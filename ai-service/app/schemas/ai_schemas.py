from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "AGRI MITRA AI Service"
    version: str = "1.0.0"

class DiseaseDetectionRequest(BaseModel):
    crop: str
    imageUrl: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class DiseaseDetectionResponse(BaseModel):
    detected: bool
    crop: str
    disease: str
    confidence: float
    severity: str
    recommendations: List[str]
    provider: str = "Mock/YOLO Provider"

class QualityAssessmentRequest(BaseModel):
    crop: str
    imageUrl: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None

class QualityAssessmentResponse(BaseModel):
    grade: str
    score: int
    confidence: float
    factors: Dict[str, int]
    provider: str = "Mock/CV Quality Grader"

class PricePredictionRequest(BaseModel):
    crop: str
    location: str
    quantity: float
    unit: str = "quintal"
    season: Optional[str] = "Kharif"
    historicalPrice: Optional[float] = None
    weather: Optional[Dict[str, Any]] = None

class PricePredictionResponse(BaseModel):
    predictedPriceMin: float
    predictedPriceMax: float
    suggestedPrice: float
    unit: str
    confidence: float
    trend: str
    factors: List[str]
    provider: str = "XGBoost/scikit-learn Price Model"

class DemandForecastRequest(BaseModel):
    crop: str
    location: str
    forecastDays: int = 7

class DemandForecastResponse(BaseModel):
    crop: str
    location: str
    forecastDays: int
    predictedDemand: float
    trend: str
    confidence: float
    historicalBaseline: List[Dict[str, Any]]
    provider: str = "Demand Forecasting Engine"

class RouteOptimizationRequest(BaseModel):
    pickups: List[Dict[str, Any]]
    deliveries: List[Dict[str, Any]]
    vehicleCapacityKg: Optional[float] = 5000.0

class RouteOptimizationResponse(BaseModel):
    totalDistanceKm: float
    totalDurationMinutes: float
    waypoints: List[Dict[str, Any]]
    optimizedSequence: List[int]
    provider: str = "OR-Tools / OSRM Routing Engine"
