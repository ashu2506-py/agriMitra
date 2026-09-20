from abc import ABC, abstractmethod
from app.schemas.ai_schemas import DiseaseDetectionRequest, DiseaseDetectionResponse

class DiseaseDetector(ABC):
    @abstractmethod
    def detect(self, request: DiseaseDetectionRequest) -> DiseaseDetectionResponse:
        pass

class MockDiseaseDetector(DiseaseDetector):
    def detect(self, request: DiseaseDetectionRequest) -> DiseaseDetectionResponse:
        crop_lower = request.crop.lower()
        if "tomato" in crop_lower:
            return DiseaseDetectionResponse(
                detected=True,
                crop="Tomato",
                disease="Early Blight (Alternaria solani)",
                confidence=0.92,
                severity="Medium",
                recommendations=[
                    "Remove and destroy infected lower leaves.",
                    "Apply copper-based fungicide or Neem oil solution every 7-10 days.",
                    "Ensure adequate space between plants for ventilation and avoid overhead irrigation."
                ],
                provider="Mock/Development Disease Detector"
            )
        elif "wheat" in crop_lower:
            return DiseaseDetectionResponse(
                detected=False,
                crop="Wheat",
                disease="Healthy (No pathogens detected)",
                confidence=0.95,
                severity="None",
                recommendations=[
                    "Crop appears healthy. Continue standard nitrogen application.",
                    "Monitor soil moisture level before upcoming irrigation cycle."
                ],
                provider="Mock/Development Disease Detector"
            )
        else:
            return DiseaseDetectionResponse(
                detected=True,
                crop=request.crop.capitalize(),
                disease="Minor Leaf Spot / Nutrient Deficiency",
                confidence=0.86,
                severity="Low",
                recommendations=[
                    "Ensure balanced NPK fertilization.",
                    "Inspect under leaf surfaces for early aphid or mite activity."
                ],
                provider="Mock/Development Disease Detector"
            )
