from abc import ABC, abstractmethod
from app.schemas.ai_schemas import PricePredictionRequest, PricePredictionResponse

class PricePredictor(ABC):
    @abstractmethod
    def predict(self, request: PricePredictionRequest) -> PricePredictionResponse:
        pass

class MockPricePredictor(PricePredictor):
    def predict(self, request: PricePredictionRequest) -> PricePredictionResponse:
        crop = request.crop.lower()
        base_price = 2500.0
        if "wheat" in crop:
            base_price = 2450.0
        elif "rice" in crop:
            base_price = 3200.0
        elif "tomato" in crop:
            base_price = 1800.0
        elif "potato" in crop:
            base_price = 1600.0

        min_price = round(base_price * 0.94, 2)
        max_price = round(base_price * 1.08, 2)
        suggested = round(base_price * 1.02, 2)

        return PricePredictionResponse(
            predictedPriceMin=min_price,
            predictedPriceMax=max_price,
            suggestedPrice=suggested,
            unit=request.unit,
            confidence=0.84,
            trend="increasing",
            factors=[
                "High regional buyer activity (+4.2%)",
                "Favorable harvest weather forecasts",
                "Low market arrivals in nearby mandi (Prayagraj)"
            ],
            provider="XGBoost Baseline Model"
        )
