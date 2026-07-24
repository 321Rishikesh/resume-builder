from app.services.bullet_improver import improve_bullets
from app.services.section_detector import detect_missing_sections
from app.services.skill_recommender import recommend_skills
from app.services.wording_suggester import generate_suggestions


def analyze_resume(role: str, resume_text: str) -> dict:
    cleaned_text = resume_text.strip()

    return {
        "improved_points": improve_bullets(cleaned_text),
        "suggestions": generate_suggestions(role, cleaned_text),
        "missing_sections": detect_missing_sections(cleaned_text),
        "recommended_skills": recommend_skills(role, cleaned_text),
    }
