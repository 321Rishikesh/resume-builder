const KNOWN_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Python',
  'Java', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'HTML', 'CSS',
  'Figma', 'REST APIs', 'GraphQL', 'Tailwind CSS', 'Machine Learning', 'Agile',
];

const clean = (value = '') => value.replace(/\s+/g, ' ').replace(/[.;,]+$/, '').trim();

function afterLabel(text, labels) {
  const expression = new RegExp(`(?:${labels.join('|')})\\s*[:\\-]\\s*([^\\n]+)`, 'i');
  return clean(text.match(expression)?.[1] || '');
}

function splitList(value) {
  return value
    .split(/,|\s+and\s+/i)
    .map(clean)
    .filter(Boolean)
    .slice(0, 12);
}

function generateResumeFromCommand(command = '') {
  const text = command.trim();
  const lower = text.toLowerCase();
  const fullName = clean(
    afterLabel(text, ['name', 'full name']) ||
    text.match(/(?:my name is|name is|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})(?=\s+(?:with|as|who|from|based|at)|,|\.)/i)?.[1] || ''
  );
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0] || '';
  const phone = text.match(/(?:\+?\d[\d ()-]{8,}\d)/)?.[0]?.trim() || '';
  const location = afterLabel(text, ['location']) || clean(text.match(/(?:based in|located in|from)\s+([^,.]+?)(?=\s+(?:with|and|at|for)|,|\.|$)/i)?.[1] || '');
  const role = afterLabel(text, ['role', 'target role', 'position', 'job title']) ||
    (lower.match(/(?:software|frontend|front-end|backend|back-end|full[- ]stack|web|mobile|data|product|ui\/ux|ux|devops|cloud)\s+(?:engineer|developer|designer|scientist|analyst|manager)/i)?.[0] || 'Professional');
  const years = text.match(/(\d+)\+?\s+years?/i)?.[1] || '';
  const company = afterLabel(text, ['company', 'employer']) || clean(text.match(/(?:worked at|at)\s+([A-Z][\w&.-]*(?:\s+[A-Z][\w&.-]*){0,2})(?=\s+(?:with|as|based|in|for)|,|\.|$)/)?.[1] || '');
  const educationText = afterLabel(text, ['education', 'degree', 'studied at']);
  const projectText = afterLabel(text, ['project', 'projects']);
  const summary = afterLabel(text, ['summary', 'about me', 'profile']);

  const explicitSkills = afterLabel(text, ['skills', 'technologies', 'tech stack']);
  const detectedSkills = KNOWN_SKILLS.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  });
  const skills = Array.from(new Set([...splitList(explicitSkills), ...detectedSkills])).slice(0, 12);

  const experience = company || years || lower.includes('experience')
    ? [{
        company: company || 'Add company name',
        position: role,
        location,
        startDate: '',
        endDate: '',
        current: true,
        description: [
          `• Contributed as a ${role} to deliver reliable, high-quality work.`,
          `• Collaborated with teammates and stakeholders to turn requirements into practical solutions.`,
          '• Add your strongest measurable achievement here.',
        ].join('\n'),
      }]
    : [];

  const education = educationText
    ? [{ institution: educationText, degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }]
    : [];

  const projects = projectText
    ? [{ name: projectText, link: '', technologies: skills.slice(0, 5).join(', '), description: 'Add the problem, your contribution, and the outcome of this project.' }]
    : [];

  return {
    title: role === 'Professional' ? 'My Resume' : `${role} Resume`,
    template: 'modern',
    targetRole: role,
    sectionOrder: ['experience', 'education', 'skills', 'projects'],
    personalInfo: {
      fullName: fullName || 'Your Name',
      email,
      phone,
      location,
      linkedin: '',
      github: '',
      website: '',
      summary: summary || `${years ? `${years} years of ` : ''}${role} experience focused on delivering thoughtful solutions, collaborating effectively, and creating meaningful results.`,
    },
    education,
    skills,
    projects,
    experience,
  };
}

const resumeSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'targetRole', 'template', 'sectionOrder', 'personalInfo', 'education', 'skills', 'projects', 'experience'],
  properties: {
    title: { type: 'string' },
    targetRole: { type: 'string' },
    template: { type: 'string', enum: ['modern', 'classic', 'minimal', 'card', 'creative'] },
    sectionOrder: { type: 'array', items: { type: 'string' } },
    personalInfo: {
      type: 'object',
      additionalProperties: false,
      required: ['fullName', 'email', 'phone', 'location', 'linkedin', 'github', 'website', 'summary'],
      properties: {
        fullName: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' },
        location: { type: 'string' }, linkedin: { type: 'string' }, github: { type: 'string' },
        website: { type: 'string' }, summary: { type: 'string' },
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['institution', 'degree', 'field', 'startDate', 'endDate', 'gpa', 'description'],
        properties: {
          institution: { type: 'string' }, degree: { type: 'string' }, field: { type: 'string' },
          startDate: { type: 'string' }, endDate: { type: 'string' }, gpa: { type: 'string' }, description: { type: 'string' },
        },
      },
    },
    skills: { type: 'array', items: { type: 'string' } },
    projects: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['name', 'link', 'technologies', 'description'],
        properties: { name: { type: 'string' }, link: { type: 'string' }, technologies: { type: 'string' }, description: { type: 'string' } },
      },
    },
    experience: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['company', 'position', 'location', 'startDate', 'endDate', 'current', 'description'],
        properties: {
          company: { type: 'string' }, position: { type: 'string' }, location: { type: 'string' },
          startDate: { type: 'string' }, endDate: { type: 'string' }, current: { type: 'boolean' }, description: { type: 'string' },
        },
      },
    },
  },
};

async function generateResumeWithAI(command) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return generateResumeFromCommand(command);

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: [
      'You are an expert resume writer and career coach.',
      'Create a complete, polished, ATS-friendly resume from the user command.',
      'Return only the requested structured resume object.',
      'Use only facts supplied by the user. Never invent employers, dates, degrees, contact details, metrics, or achievements.',
      'When information is missing, use an empty string or a clear editable placeholder such as [Add company] or [Add achievement].',
      'Write a strong 2-3 sentence summary, role-specific skills, and concise experience/project bullets.',
      'Use one bullet per line in description fields. Keep the resume concise but complete.',
      ].join(' '),
      input: command,
      text: { format: { type: 'json_schema', name: 'resume_draft', strict: true, schema: resumeSchema } },
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || 'OpenAI request failed');
  }

  const outputText = payload.output
    ?.flatMap((item) => item.content || [])
    ?.find((item) => item.type === 'output_text')?.text;

  if (!outputText) throw new Error('OpenAI returned an empty resume');
  return JSON.parse(outputText);
}

module.exports = { generateResumeFromCommand, generateResumeWithAI };
