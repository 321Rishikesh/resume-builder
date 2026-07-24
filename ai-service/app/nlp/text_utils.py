import re
from collections import Counter


BULLET_PATTERN = re.compile(
    r"^\s*(?:[-•*▪▸►]|\d+[.)])\s*(.+)$",
    re.MULTILINE,
)

SECTION_HEADER_PATTERN = re.compile(
    r"^([A-Za-z][A-Za-z\s/&-]{2,40})$",
    re.MULTILINE,
)

NUMBER_PATTERN = re.compile(r"\d+(?:\.\d+)?%?|\$[\d,]+|[\d,]+\+?")


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def extract_bullet_points(resume_text: str) -> list[str]:
    bullets = BULLET_PATTERN.findall(resume_text)
    if bullets:
        return [normalize_text(b) for b in bullets if len(b.strip()) > 8]

    # Fallback: treat short multi-clause lines as bullets
    lines = [
        normalize_text(line)
        for line in resume_text.splitlines()
        if line.strip() and not line.strip().endswith(":")
    ]
    return [line for line in lines if 20 <= len(line) <= 220]


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z']+", text.lower())


def word_count(text: str) -> int:
    return len(tokenize(text))


def contains_number(text: str) -> bool:
    return bool(NUMBER_PATTERN.search(text))


def starts_with_weak_opener(text: str) -> bool:
    lowered = text.lower().lstrip()
    weak_openers = (
        "i ",
        "my ",
        "we ",
        "the ",
        "a ",
        "an ",
        "this ",
        "that ",
    )
    return any(lowered.startswith(opener) for opener in weak_openers)


def detect_passive_voice(text: str) -> bool:
    tokens = tokenize(text)
    passive_markers = {"was", "were", "been", "being"}
    past_participle_suffixes = ("ed", "en", "nt")

    for index, token in enumerate(tokens):
        if token in passive_markers and index + 1 < len(tokens):
            next_token = tokens[index + 1]
            if any(next_token.endswith(suffix) for suffix in past_participle_suffixes):
                return True
    return False


def extract_existing_skills(resume_text: str) -> set[str]:
    tokens = set(tokenize(resume_text))
    known = {
        "python",
        "javascript",
        "java",
        "react",
        "node",
        "sql",
        "docker",
        "kubernetes",
        "aws",
        "azure",
        "git",
        "typescript",
        "html",
        "css",
        "mongodb",
        "postgres",
        "redis",
        "agile",
        "scrum",
    }
    return {skill for skill in known if skill in tokens}


def resume_lower(resume_text: str) -> str:
    return resume_text.lower()


def top_repeated_words(text: str, min_length: int = 5) -> list[str]:
    tokens = [t for t in tokenize(text) if len(t) >= min_length]
    counts = Counter(tokens)
    return [word for word, count in counts.items() if count >= 3]
