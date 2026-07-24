# Resume Enhancement AI Service

FastAPI microservice that analyzes resume text and returns improved bullet points, wording suggestions, missing sections, and role-based skill recommendations.

## Features

- **Bullet improvement** — Rewrites weak verbs, passive voice, and filler words into professional action-led statements
- **Wording suggestions** — Flags missing metrics, repetition, brevity, and weak openers
- **Section detection** — Identifies common resume sections that are absent
- **Skill recommendations** — Suggests skills for the target role not already present in the resume

## Quick start

### 1. Create a virtual environment

```bash
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## API

### `POST /analyze`

**Request**

```json
{
  "role": "Software Developer",
  "resume_text": "John Doe\nExperience\n- worked on web apps using react\n- helped team with bugs\n- responsible for api design"
}
```

**Response**

```json
{
  "improved_points": [
    "Collaborated on web apps using react.",
    "Supported team with bugs.",
    "Led api design."
  ],
  "suggestions": [
    "Quantify impact where possible (e.g., 'Reduced load time by 35%' or 'Managed team of 6').",
    "Rewrite passive phrases into active, results-driven statements starting with strong action verbs."
  ],
  "missing_sections": ["Summary", "Education", "Skills", "Projects", "Certifications"],
  "recommended_skills": ["Python", "Git", "REST APIs", "SQL", "Docker", "Unit Testing", "Agile/Scrum"]
}
```

### `GET /health`

Returns `{"status": "ok"}` for uptime checks.

## Example curl

```bash
curl -X POST http://localhost:8000/analyze ^
  -H "Content-Type: application/json" ^
  -d "{\"role\": \"Software Developer\", \"resume_text\": \"Experience\\n- built REST APIs in Python\\n- improved page load by 40%\"}"
```

## Project structure

```
ai-service/
├── app/
│   ├── main.py              # FastAPI app entry
│   ├── schemas.py           # Request/response models
│   ├── data/                # Rule dictionaries (verbs, sections, skills)
│   ├── nlp/                 # Text parsing & NLP helpers
│   ├── routers/             # API routes
│   └── services/            # Business logic modules
├── requirements.txt
└── README.md
```

## Integration with existing app

This service runs independently from the Node.js backend on port **8000**. Point your frontend or Node proxy to:

```
POST http://localhost:8000/analyze
```

## Supported roles (skill mapping)

Software Developer, Software Engineer, Frontend Developer, Backend Developer, Data Scientist, Product Manager, DevOps Engineer, QA Engineer — plus fuzzy matching for similar titles.
