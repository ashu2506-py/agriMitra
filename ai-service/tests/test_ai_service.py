from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "AGRI MITRA" in data["service"]

def test_disease_detection():
    response = client.post("/ai/crop/disease-detection", json={"crop": "Tomato"})
    assert response.status_code == 200
    data = response.json()
    assert data["crop"] == "Tomato"
    assert "disease" in data

def test_quality_grading():
    response = client.post("/ai/crop/quality", json={"crop": "Wheat"})
    assert response.status_code == 200
    data = response.json()
    assert "grade" in data
    assert data["score"] > 0

def test_price_prediction():
    response = client.post("/ai/market/price-prediction", json={
        "crop": "Wheat",
        "location": "Prayagraj",
        "quantity": 50
    })
    assert response.status_code == 200
    data = response.json()
    assert data["predictedPriceMin"] < data["predictedPriceMax"]

def test_demand_forecast():
    response = client.post("/ai/market/demand-forecast", json={
        "crop": "Rice",
        "location": "Varanasi",
        "forecastDays": 7
    })
    assert response.status_code == 200
    data = response.json()
    assert data["forecastDays"] == 7
    assert len(data["historicalBaseline"]) == 7
