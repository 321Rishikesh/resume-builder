const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  field: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gpa: { type: String, default: '' },
  description: { type: String, default: '' },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  link: { type: String, default: '' },
  technologies: { type: String, default: '' },
  description: { type: String, default: '' },
});

const personalInfoSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  website: { type: String, default: '' },
  summary: { type: String, default: '' },
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
      trim: true,
    },
    template: {
      type: String,
      enum: ['modern', 'classic', 'minimal', 'card', 'creative'],
      default: 'modern',
    },
    targetRole: {
      type: String,
      default: 'Software Developer',
      trim: true,
    },
    sectionOrder: {
      type: [String],
      default: ['experience', 'education', 'projects'],
    },
    personalInfo: {
      type: personalInfoSchema,
      default: () => ({}),
    },
    education: [educationSchema],
    skills: [{ type: String }],
    projects: [projectSchema],
    experience: [experienceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
