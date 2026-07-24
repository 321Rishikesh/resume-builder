from app.nlp.text_utils import (
    contains_number,
    detect_passive_voice,
    extract_bullet_points,
    starts_with_weak_opener,
    top_repeated_words,
    word_count,
)


def generate_suggestions(role: str, resume_text: str) -> list[str]:
    suggestions: list[str] = []
    bullets = extract_bullet_points(resume_text)

    if len(bullets) < 3:
        suggestions.append(
            "Add more achievement-focused bullet points under each role (aim for 3–5 per position)."
        )

    bullets_without_metrics = [b for b in bullets if not contains_number(b)]
    if bullets_without_metrics:
        suggestions.append(
            "Quantify impact where possible (e.g., 'Reduced load time by 35%' or 'Managed team of 6')."
        )

    passive_bullets = [b for b in bullets if detect_passive_voice(b)]
    if passive_bullets:
        suggestions.append(
            "Rewrite passive phrases into active, results-driven statements starting with strong action verbs."
        )

    weak_openers = [b for b in bullets if starts_with_weak_opener(b)]
    if weak_openers:
        suggestions.append(
            "Avoid starting bullets with 'I', 'My', or 'We'. Lead with action verbs instead."
        )

    if word_count(resume_text) < 120:
        suggestions.append(
            "Resume content looks brief. Expand experience bullets with scope, tools used, and outcomes."
        )

    repeated = top_repeated_words(resume_text)
    if repeated:
        suggestions.append(
            f"Reduce repetition of words like {', '.join(repeated[:3])}; vary vocabulary for stronger impact."
        )

    role_lower = role.lower()
    if "developer" in role_lower or "engineer" in role_lower:
        if "project" not in resume_text.lower():
            suggestions.append(
                "Consider adding a Projects section to showcase hands-on technical work."
            )

    if not suggestions:
        suggestions.append(
            "Strong foundation. Tailor keywords to the job description and keep bullets concise (1–2 lines each)."
        )

    return suggestions[:6]
