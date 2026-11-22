const { analyzeResume } = require('../services/aiService');
const { generateResumeWithAI } = require('../services/resumeGenerator');

function buildResumeText(resume = {}) {
  const personalInfo = resume.personalInfo || {};
  const lines = [];

  if (personalInfo.fullName) lines.push(`Name: ${personalInfo.fullName}`);
  if (resume.title) lines.push(`Target role: ${resume.title}`);
  if (personalInfo.summary) lines.push(`Summary: ${personalInfo.summary}`);

  if (Array.isArray(resume.experience) && resume.experience.length > 0) {
    lines.push('Experience:');
    resume.experience.forEach((item) => {
      lines.push(
        `- ${item.position || 'Role'} at ${item.company || 'Company'}${item.location ? `, ${item.location}` : ''}${item.current ? ' (Present)' : ''}`
      );
      if (item.description) lines.push(`  ${item.description}`);
    });
  }

  if (Array.isArray(resume.education) && resume.education.length > 0) {
    lines.push('Education:');
    resume.education.forEach((item) => {
      lines.push(`- ${item.degree || 'Degree'} at ${item.institution || 'Institution'}`);
      if (item.description) lines.push(`  ${item.description}`);
    });
  }

  if (Array.isArray(resume.projects) && resume.projects.length > 0) {
    lines.push('Projects:');
    resume.projects.forEach((item) => {
      lines.push(`- ${item.name || 'Project'}${item.technologies ? ` | ${item.technologies}` : ''}`);
      if (item.description) lines.push(`  ${item.description}`);
    });
  }

  if (Array.isArray(resume.skills) && resume.skills.length > 0) {
    lines.push(`Skills: ${resume.skills.join(', ')}`);
  }

  return lines.join('\n').trim();
}

exports.analyzeResume = async (req, res) => {
  try {
    const { role, resume_text, resume } = req.body;
    const resolvedResumeText = resume_text?.trim() || buildResumeText(resume);

    if (!role?.trim() || !resolvedResumeText) {
      return res.status(400).json({ message: 'role and resume_text or resume are required' });
    }

    const data = analyzeResume(role.trim(), resolvedResumeText);
    res.json(data);
  } catch (error) {
    console.error('AI analysis error:', error.message);
    res.status(500).json({ message: 'Failed to analyze resume' });
  }
};

exports.generateResume = async (req, res) => {
  try {
    const { command } = req.body;
    if (!command?.trim()) {
      return res.status(400).json({ message: 'A resume command is required' });
    }

    res.json(await generateResumeWithAI(command));
  } catch (error) {
    console.error('Resume generation error:', error.message);
    res.status(502).json({ message: `AI generation failed: ${error.message}` });
  }
};
