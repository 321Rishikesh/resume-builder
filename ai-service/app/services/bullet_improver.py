from app.data.action_verbs import (
    PREFERRED_ACTION_VERBS,
    STRONG_VERB_REPLACEMENTS,
    WEAK_VERBS,
)
from app.nlp.text_utils import (
    contains_number,
    detect_passive_voice,
    extract_bullet_points,
    starts_with_weak_opener,
    tokenize,
)


def improve_bullet_point(bullet: str) -> str:
    improved = bullet.strip()
    improved = _capitalize_first(improved)
    improved = _replace_weak_verbs(improved)
    improved = _ensure_action_verb_start(improved)
    improved = _fix_passive_voice(improved)
    improved = _trim_filler_words(improved)
    improved = _ensure_period(improved)
    return improved


def improve_bullets(resume_text: str) -> list[str]:
    bullets = extract_bullet_points(resume_text)
    if not bullets:
        return []

    improved = [improve_bullet_point(b) for b in bullets[:12]]
    # Return only bullets that changed meaningfully
    return [
        new
        for old, new in zip(bullets[:12], improved)
        if old.lower() != new.lower()
    ] or improved[:5]


def _capitalize_first(text: str) -> str:
    if not text:
        return text
    return text[0].upper() + text[1:]


def _replace_weak_verbs(text: str) -> str:
    lowered = text.lower()
    for weak, strong in sorted(STRONG_VERB_REPLACEMENTS.items(), key=lambda x: -len(x[0])):
        prefix = weak + " "
        if lowered.startswith(prefix):
            rest = text[len(prefix) :].lstrip()
            if rest.lower().startswith("for "):
                rest = rest[4:].lstrip()
            return f"{strong.capitalize()} {rest}"
    return text


def _ensure_action_verb_start(text: str) -> str:
    tokens = tokenize(text)
    if not tokens:
        return text

    first = tokens[0]
    if first in WEAK_VERBS or starts_with_weak_opener(text):
        verb = PREFERRED_ACTION_VERBS[len(text) % len(PREFERRED_ACTION_VERBS)]
        cleaned = text
        for prefix in ("I ", "My ", "We ", "The ", "A ", "An "):
            if cleaned.startswith(prefix):
                cleaned = cleaned[len(prefix) :]
                break
        return f"{verb.capitalize()} {cleaned[0].lower() + cleaned[1:] if cleaned else ''}".strip()
    return text


def _fix_passive_voice(text: str) -> str:
    if detect_passive_voice(text):
        return text.replace(" was ", " ").replace(" were ", " ").replace("  ", " ")
    return text


def _trim_filler_words(text: str) -> str:
    fillers = [
        " basically ",
        " actually ",
        " really ",
        " just ",
        " kind of ",
        " sort of ",
        " in order to ",
    ]
    result = f" {text.lower()} "
    for filler in fillers:
        result = result.replace(filler, " ")
    return _capitalize_first(result.strip())


def _ensure_period(text: str) -> str:
    return text if text.endswith(".") else f"{text}."
