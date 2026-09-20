# AGRI MITRA - AI Intelligence Architecture

## Overview
The AI engine is implemented as an independent Python FastAPI service. It decouples machine learning inference from application backend logic.

## AI Service Components
1. **Disease Detector (`app.services.disease_detector`)**:
   - Provider abstraction: `DiseaseDetector` base class.
   - Implementations: `YOLODiseaseDetector` and `MockDiseaseDetector`.
   - Returns detected disease, confidence, severity, and agronomic treatment recommendations.

2. **Quality Grader (`app.services.quality_grader`)**:
   - Evaluates appearance, surface defects, uniformity, and color metrics to calculate a quality score (0-100) and grade (A+, A, B, C).

3. **Price Predictor (`app.services.price_predictor`)**:
   - Uses XGBoost / scikit-learn regression models based on crop, location, seasonality, weather, demand, and historical prices.

4. **Demand Forecaster (`app.services.demand_forecaster`)**:
   - Time-series baseline model predicting 7-day to 30-day demand volume and market trends.

5. **Route Optimizer (`app.services.route_optimizer`)**:
   - Multi-stop pickup and delivery optimization wrapper for Google OR-Tools / OSRM distance matrices.

6. **Contextual AI Assistant (`/api/assistant/chat`)**:
   - Structured context-aware assistant supplying market intelligence, pricing trends, and crop guidance.
