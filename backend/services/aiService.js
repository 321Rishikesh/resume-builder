const BULLET_PATTERN = /^\s*(?:[-•*▪▸►]|\d+[.)])\s*(.+)$/gm;
const NUMBER_PATTERN = /\d+(?:\.\d+)?%?|\$[\d,]+|[\d,]+\+?/;

const WEAK_VERBS = new Set([
  "did",
  "made",
  "worked",
  "helped",
  "handled",
  "responsible",
  "assisted",
  "used",
  "was",
  "were",
  "got",
  "had",
  "did work on",
  "in charge of",
]);

const STRONG_VERB_REPLACEMENTS = {
  "did": "executed",
  "made": "developed",
  "worked": "collaborated",
  "helped": "supported",
  "handled": "managed",
  "responsible for": "oversaw",
  "responsible": "led",
  "assisted": "facilitated",
  "used": "leveraged",
  "was": "served as",
  "were": "served as",
  "got": "achieved",
  "had": "maintained",
  "in charge of": "oversaw",
};

const PREFERRED_ACTION_VERBS = [
  "achieved",
  "architected",
  "automated",
  "built",
  "collaborated",
  "delivered",
  "designed",
  "developed",
  "engineered",
  "implemented",
  "improved",
  "increased",
  "launched",
  "led",
  "managed",
  "optimized",
  "reduced",
  "spearheaded",
  "streamlined",
];

const RESUME_SECTIONS = {
  "summary": [
    "summary",
    "profile",
    "objective",
    "about me",
    "professional summary",
  ],
  "experience": [
    "experience",
    "work history",
    "employment",
    "professional experience",
    "work experience",
  ],
  "education": [
    "education",
    "academic",
    "qualifications",
    "degrees",
  ],
  "skills": [
    "skills",
    "technical skills",
    "core competencies",
    "technologies",
    "tools",
  ],
  "projects": [
    "projects",
    "portfolio",
    "personal projects",
  ],
  "certifications": [
    "certifications",
    "certificates",
    "licenses",
  ],
};

const ROLE_SKILL_MAP = {
  "software developer": [
    "Python",
    "JavaScript",
    "Git",
    "REST APIs",
    "SQL",
    "Docker",
    "Unit Testing",
    "Agile/Scrum",
  ],
  "software engineer": [
    "Python",
    "Java",
    "System Design",
    "Data Structures",
    "CI/CD",
    "Cloud (AWS/GCP)",
    "Microservices",
    "Debugging",
  ],
  "frontend developer": [
    "React",
    "TypeScript",
    "HTML/CSS",
    "Responsive Design",
    "Webpack/Vite",
    "Accessibility",
    "Performance Optimization",
    "REST APIs",
  ],
  "backend developer": [
    "Node.js",
    "Python",
    "PostgreSQL",
    "Redis",
    "API Design",
    "Authentication",
    "Docker",
    "Message Queues",
  ],
  "data scientist": [
    "Python",
    "Pandas",
    "Machine Learning",
    "Statistics",
    "SQL",
    "Data Visualization",
    "Scikit-learn",
    "Experiment Design",
  ],
  "product manager": [
    "Roadmapping",
    "User Research",
    "Stakeholder Management",
    "Agile",
    "Analytics",
    "PRD Writing",
    "Prioritization",
    "Go-to-Market",
  ],
  "devops engineer": [
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Terraform",
    "Linux",
    "Monitoring",
    "AWS/Azure",
    "Infrastructure as Code",
  ],
  "qa engineer": [
    "Test Automation",
    "Selenium/Cypress",
    "API Testing",
    "Regression Testing",
    "Bug Tracking",
    "Test Plans",
    "Performance Testing",
    "Agile",
  ],
};

const DEFAULT_SKILLS = [
  "Communication",
  "Problem Solving",
  "Team Collaboration",
  "Time Management",
  "Critical Thinking",
];

// Helper functions
function normalizeText(text) {
  return text.trim().replace(/\s+/g, " ");
}

function tokenize(text) {
  return (text.toLowerCase().match(/[a-zA-Z']+/g) || []);
}

function wordCount(text) {
  return tokenize(text).length;
}

function containsNumber(text) {
  return NUMBER_PATTERN.test(text);
}

function startsWithWeakOpener(text) {
  const lowered = text.toLowerCase().trim();
  const weakOpeners = ["i ", "my ", "we ", "the ", "a ", "an ", "this ", "that "];
  return weakOpeners.some((opener) => lowered.startsWith(opener));
}

function detectPassiveVoice(text) {
  const tokens = tokenize(text);
  const passiveMarkers = new Set(["was", "were", "been", "being"]);
  const pastParticipleSuffixes = ["ed", "en", "nt"];

  for (let i = 0; i < tokens.length; i++) {
    if (passiveMarkers.has(tokens[i]) && i + 1 < tokens.length) {
      const nextToken = tokens[i + 1];
      if (pastParticipleSuffixes.some((suffix) => nextToken.endsWith(suffix))) {
        return true;
      }
    }
  }
  return false;
}

function extractExistingSkills(resumeText) {
  const tokens = new Set(tokenize(resumeText));
  const known = new Set([
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
  ]);
  const existing = new Set();
  for (const skill of known) {
    if (tokens.has(skill)) {
      existing.add(skill);
    }
  }
  return existing;
}

function topRepeatedWords(text, minLength = 5) {
  const tokens = tokenize(text).filter((t) => t.length >= minLength);
  const counts = {};
  for (const t of tokens) {
    counts[t] = (counts[t] || 0) + 1;
  }
  return Object.keys(counts).filter((word) => counts[word] >= 3);
}

function extractBulletPoints(resumeText) {
  const bullets = [];
  let match;
  // Reset regex
  BULLET_PATTERN.lastIndex = 0;
  while ((match = BULLET_PATTERN.exec(resumeText)) !== null) {
    const b = normalizeText(match[1]);
    if (b.length > 8) {
      bullets.push(b);
    }
  }
  if (bullets.length > 0) return bullets;

  // Fallback: treat short multi-clause lines as bullets
  const lines = resumeText
    .split(/\r?\n/)
    .map(normalizeText)
    .filter((line) => line && !line.endsWith(":"));
  return lines.filter((line) => line.length >= 20 && line.length <= 220);
}

// Logic implementations
function capitalizeFirst(text) {
  if (!text) return text;
  return text[0].toUpperCase() + text.slice(1);
}

function replaceWeakVerbs(text) {
  const lowered = text.toLowerCase();
  const sortedWeak = Object.keys(STRONG_VERB_REPLACEMENTS).sort(
    (a, b) => b.length - a.length
  );

  for (const weak of sortedWeak) {
    const prefix = weak + " ";
    if (lowered.startsWith(prefix)) {
      let rest = text.slice(prefix.length).trim();
      if (rest.toLowerCase().startsWith("for ")) {
        rest = rest.slice(4).trim();
      }
      const strong = STRONG_VERB_REPLACEMENTS[weak];
      return capitalizeFirst(strong) + " " + rest;
    }
  }
  return text;
}

function ensureActionVerbStart(text) {
  const tokens = tokenize(text);
  if (tokens.length === 0) return text;

  const first = tokens[0];
  if (WEAK_VERBS.has(first) || startsWithWeakOpener(text)) {
    const verb =
      PREFERRED_ACTION_VERBS[text.length % PREFERRED_ACTION_VERBS.length];
    let cleaned = text;
    const prefixes = ["I ", "My ", "We ", "The ", "A ", "An "];
    for (const prefix of prefixes) {
      if (cleaned.startsWith(prefix)) {
        cleaned = cleaned.slice(prefix.length);
        break;
      }
    }
    const cleanLower = cleaned
      ? cleaned[0].toLowerCase() + cleaned.slice(1)
      : "";
    return (capitalizeFirst(verb) + " " + cleanLower).trim();
  }
  return text;
}

function fixPassiveVoice(text) {
  if (detectPassiveVoice(text)) {
    return text
      .replace(/\swas\s/g, " ")
      .replace(/\swere\s/g, " ")
      .replace(/\s\s+/g, " ");
  }
  return text;
}

function trimFillerWords(text) {
  const fillers = [
    " basically ",
    " actually ",
    " really ",
    " just ",
    " kind of ",
    " sort of ",
    " in order to ",
  ];
  let result = " " + text.toLowerCase() + " ";
  for (const filler of fillers) {
    result = result.replace(new RegExp(filler, "g"), " ");
  }
  return capitalizeFirst(result.trim());
}

function ensurePeriod(text) {
  return text.endsWith(".") ? text : text + ".";
}

function improveBulletPoint(bullet) {
  let improved = bullet.trim();
  improved = capitalizeFirst(improved);
  improved = replaceWeakVerbs(improved);
  improved = ensureActionVerbStart(improved);
  improved = fixPassiveVoice(improved);
  improved = trimFillerWords(improved);
  improved = ensurePeriod(improved);
  return improved;
}

function improveBullets(resumeText) {
  const bullets = extractBulletPoints(resumeText);
  if (bullets.length === 0) return [];

  const subset = bullets.slice(0, 12);
  const improved = subset.map((b) => improveBulletPoint(b));

  const changed = [];
  for (let i = 0; i < subset.length; i++) {
    if (subset[i].toLowerCase() !== improved[i].toLowerCase()) {
      changed.push(improved[i]);
    }
  }
  return changed.length > 0 ? changed : improved.slice(0, 5);
}

function detectMissingSections(resumeText) {
  const text = resumeText.toLowerCase();
  const missing = [];
  for (const [section, keywords] of Object.entries(RESUME_SECTIONS)) {
    if (!keywords.some((keyword) => text.includes(keyword))) {
      missing.push(
        section.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      );
    }
  }
  return missing;
}

function fuzzyMatchRole(role) {
  for (const [key, skills] of Object.entries(ROLE_SKILL_MAP)) {
    if (key.includes(role) || role.includes(key)) {
      return skills;
    }
  }
  const roleTokens = new Set(role.split(/\s+/));
  let bestMatch = null;
  let bestScore = 0;

  for (const [key, skills] of Object.entries(ROLE_SKILL_MAP)) {
    const keyTokens = new Set(key.split(/\s+/));
    let score = 0;
    for (const token of roleTokens) {
      if (keyTokens.has(token)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = skills;
    }
  }
  return bestScore > 0 ? bestMatch : null;
}

function recommendSkills(role, resumeText) {
  const normalizedRole = role.trim().toLowerCase();
  let roleSkills = ROLE_SKILL_MAP[normalizedRole];

  if (!roleSkills) {
    roleSkills = fuzzyMatchRole(normalizedRole) || DEFAULT_SKILLS;
  }

  const existing = extractExistingSkills(resumeText);
  const text = resumeText.toLowerCase();

  const recommendations = [];
  for (const skill of roleSkills) {
    const skillLower = skill.toLowerCase();
    if (existing.has(skillLower)) continue;
    if (text.includes(skillLower)) continue;
    recommendations.push(skill);
  }
  return recommendations.slice(0, 8);
}

function generateSuggestions(role, resumeText) {
  const suggestions = [];
  const bullets = extractBulletPoints(resumeText);

  if (bullets.length < 3) {
    suggestions.push(
      "Add more achievement-focused bullet points under each role (aim for 3–5 per position)."
    );
  }

  const bulletsWithoutMetrics = bullets.filter((b) => !containsNumber(b));
  if (bulletsWithoutMetrics.length > 0) {
    suggestions.push(
      "Quantify impact where possible (e.g., 'Reduced load time by 35%' or 'Managed team of 6')."
    );
  }

  const passiveBullets = bullets.filter((b) => detectPassiveVoice(b));
  if (passiveBullets.length > 0) {
    suggestions.push(
      "Rewrite passive phrases into active, results-driven statements starting with strong action verbs."
    );
  }

  const weakOpeners = bullets.filter((b) => startsWithWeakOpener(b));
  if (weakOpeners.length > 0) {
    suggestions.push(
      "Avoid starting bullets with 'I', 'My', or 'We'. Lead with action verbs instead."
    );
  }

  if (wordCount(resumeText) < 120) {
    suggestions.push(
      "Resume content looks brief. Expand experience bullets with scope, tools used, and outcomes."
    );
  }

  const repeated = topRepeatedWords(resumeText);
  if (repeated.length > 0) {
    suggestions.push(
      `Reduce repetition of words like ${repeated
        .slice(0, 3)
        .join(", ")}; vary vocabulary for stronger impact.`
    );
  }

  const roleLower = role.toLowerCase();
  if (roleLower.includes("developer") || roleLower.includes("engineer")) {
    if (!resumeText.toLowerCase().includes("project")) {
      suggestions.push(
        "Consider adding a Projects section to showcase hands-on technical work."
      );
    }
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Strong foundation. Tailor keywords to the job description and keep bullets concise (1–2 lines each)."
    );
  }

  return suggestions.slice(0, 6);
}

function analyzeResume(role, resumeText) {
  const cleanedText = resumeText.trim();
  return {
    improved_points: improveBullets(cleanedText),
    suggestions: generateSuggestions(role, cleanedText),
    missing_sections: detectMissingSections(cleanedText),
    recommended_skills: recommendSkills(role, cleanedText),
  };
}

module.exports = {
  analyzeResume,
};
