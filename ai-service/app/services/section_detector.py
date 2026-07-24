from app.data.section_keywords import RESUME_SECTIONS
from app.nlp.text_utils import resume_lower


def detect_missing_sections(resume_text: str) -> list[str]:
    text = resume_lower(resume_text)
    missing: list[str] = []

    for section, keywords in RESUME_SECTIONS.items():
        if not any(keyword in text for keyword in keywords):
            missing.append(section.replace("_", " ").title())

    return missing
