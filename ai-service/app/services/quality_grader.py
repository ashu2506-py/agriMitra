from abc import ABC, abstractmethod
from app.schemas.ai_schemas import QualityAssessmentRequest, QualityAssessmentResponse

class QualityGrader(ABC):
    @abstractmethod
    def grade(self, request: QualityAssessmentRequest) -> QualityAssessmentResponse:
        pass

class MockQualityGrader(QualityGrader):
    def grade(self, request: QualityAssessmentRequest) -> QualityAssessmentResponse:
        crop = request.crop.lower()
        if "wheat" in crop or "rice" in crop:
            return QualityAssessmentResponse(
                grade="Grade A+",
                score=92,
                confidence=0.91,
                factors={
                    "appearance": 94,
                    "defects": 96,
                    "uniformity": 88,
                    "moistureContent": 90
                },
                provider="Mock Quality Grader Engine"
            )
        else:
            return QualityAssessmentResponse(
                grade="Grade A",
                score=87,
                confidence=0.88,
                factors={
                    "appearance": 90,
                    "defects": 85,
                    "uniformity": 86,
                    "colorIntegrity": 88
                },
                provider="Mock Quality Grader Engine"
            )
