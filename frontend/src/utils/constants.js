export const emptyPersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  website: '',
  summary: '',
};

export const emptyEducation = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  gpa: '',
  description: '',
};

export const emptyExperience = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
};

export const emptyProject = {
  name: '',
  link: '',
  technologies: '',
  description: '',
};

export const emptyResume = {
  title: 'Untitled Resume',
  template: 'modern',
  personalInfo: { ...emptyPersonalInfo },
  sectionOrder: ['experience', 'education', 'skills', 'projects'],
  education: [],
  skills: [],
  projects: [],
  experience: [],
};

export const SECTION_LABELS = {
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
};

export const WIZARD_STEPS = [
  { id: 'personal', label: 'Personal Info', icon: 'User' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'skills', label: 'Skills', icon: 'Sparkles' },
  { id: 'projects', label: 'Projects', icon: 'FolderKanban' },
  { id: 'experience', label: 'Experience', icon: 'Briefcase' },
];

export const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean layout with accent sidebar',
    preview: 'bg-gradient-to-br from-brand-600 to-brand-800',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional format',
    preview: 'bg-gradient-to-br from-gray-700 to-gray-900',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant typography',
    preview: 'bg-gradient-to-br from-emerald-600 to-teal-800',
  },
];
