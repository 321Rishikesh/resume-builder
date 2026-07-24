from app.data.role_skills import DEFAULT_SKILLS, ROLE_SKILL_MAP
from app.nlp.text_utils import extract_existing_skills, resume_lower


def recommend_skills(role: str, resume_text: str) -> list[str]:
    normalized_role = role.strip().lower()
    role_skills = ROLE_SKILL_MAP.get(normalized_role)

    if not role_skills:
        role_skills = _fuzzy_match_role(normalized_role) or DEFAULT_SKILLS

    existing = extract_existing_skills(resume_text)
    text = resume_lower(resume_text)

    recommendations: list[str] = []
    for skill in role_skills:
        skill_lower = skill.lower()
        if skill_lower in existing:
            continue
        if skill_lower in text:
            continue
        recommendations.append(skill)

    return recommendations[:8]


def _fuzzy_match_role(role: str) -> list[str] | None:
    for key, skills in ROLE_SKILL_MAP.items():
        if key in role or role in key:
            return skills

    role_tokens = set(role.split())
    best_match: list[str] | None = None
    best_score = 0

    for key, skills in ROLE_SKILL_MAP.items():
        key_tokens = set(key.split())
        score = len(role_tokens & key_tokens)
        if score > best_score:
            best_score = score
            best_match = skills

    return best_match if best_score > 0 else None
