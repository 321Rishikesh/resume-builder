from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    role: str = Field(..., min_length=1, examples=["Software Developer"])
    resume_text: str = Field(..., min_length=10, examples=["John Doe\nExperience\n- Built web apps"])


class AnalyzeResponse(BaseModel):
    improved_points: list[str]
    suggestions: list[str]
    missing_sections: list[str]
    recommended_skills: list[str]
