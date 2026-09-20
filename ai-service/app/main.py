from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.ai_schemas import (
    HealthResponse,
    DiseaseDetectionRequest, DiseaseDetectionResponse,
    QualityAssessmentRequest, QualityAssessmentResponse,
    PricePredictionRequest, PricePredictionResponse,
    DemandForecastRequest, DemandForecastResponse,
    RouteOptimizationRequest, RouteOptimizationResponse
)
from app.services.disease_detector import MockDiseaseDetector
from app.services.quality_grader import MockQualityGrader
from app.services.price_predictor import MockPricePredictor
from app.services.demand_forecaster import MockDemandForecaster

app = FastAPI(
    title="AGRI MITRA AI Service",
    description="AI Engine for crop health, quality grading, price prediction, demand forecasting, and logistics routing.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

disease_service = MockDiseaseDetector()
quality_service = MockQualityGrader()
price_service = MockPricePredictor()
demand_service = MockDemandForecaster()

@app.get("/health", response_model=HealthResponse)
@app.get("/ai/health", response_model=HealthResponse)
def health_check():
    return HealthResponse()

@app.post("/ai/crop/disease-detection", response_model=DiseaseDetectionResponse)
def detect_disease(payload: DiseaseDetectionRequest):
    return disease_service.detect(payload)

@app.post("/ai/crop/quality", response_model=QualityAssessmentResponse)
def grade_quality(payload: QualityAssessmentRequest):
    return quality_service.grade(payload)

@app.post("/ai/market/price-prediction", response_model=PricePredictionResponse)
def predict_price(payload: PricePredictionRequest):
    return price_service.predict(payload)

@app.post("/ai/market/demand-forecast", response_model=DemandForecastResponse)
def forecast_demand(payload: DemandForecastRequest):
    return demand_service.forecast(payload)

@app.post("/ai/logistics/optimize-route", response_model=RouteOptimizationResponse)
def optimize_route(payload: RouteOptimizationRequest):
    return RouteOptimizationResponse(
        totalDistanceKm=45.2,
        totalDurationMinutes=68.0,
        waypoints=[
            {"index": 0, "type": "pickup", "location": "Farm A - Prayagraj"},
            {"index": 1, "type": "pickup", "location": "Farm B - Phulpur"},
            {"index": 2, "type": "delivery", "location": "Central Wholesale Market - Varanasi"}
        ],
        optimizedSequence=[0, 1, 2],
        provider="Mock/OR-Tools Route Optimizer Engine"
    )
