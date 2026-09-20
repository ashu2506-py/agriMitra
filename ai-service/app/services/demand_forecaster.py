from abc import ABC, abstractmethod
from app.schemas.ai_schemas import DemandForecastRequest, DemandForecastResponse
from datetime import datetime, timedelta

class DemandForecaster(ABC):
    @abstractmethod
    def forecast(self, request: DemandForecastRequest) -> DemandForecastResponse:
        pass

class MockDemandForecaster(DemandForecaster):
    def forecast(self, request: DemandForecastRequest) -> DemandForecastResponse:
        today = datetime.now()
        baseline = []
        for i in range(request.forecastDays):
            day_date = (today + timedelta(days=i)).strftime("%Y-%m-%d")
            volume = 4000 + (i * 120) + (150 if i % 2 == 0 else -80)
            baseline.append({"date": day_date, "predictedVolumeQuintals": volume})

        return DemandForecastResponse(
            crop=request.crop,
            location=request.location,
            forecastDays=request.forecastDays,
            predictedDemand=sum(b["predictedVolumeQuintals"] for b in baseline) / len(baseline),
            trend="increasing",
            confidence=0.79,
            historicalBaseline=baseline,
            provider="Time-Series Demand Forecaster"
        )
