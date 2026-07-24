import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Download,
  Eye,
  EyeOff,
  User,
  GraduationCap,
  Sparkles,
  FolderKanban,
  Briefcase,
  Check,
  Moon,
  SunMedium,
  Wand2,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react';
import api from '../api/axios';
import { emptyResume, WIZARD_STEPS, SECTION_LABELS } from '../utils/constants';
import { validatePersonalInfo, getErrorMessage } from '../utils/validation';
import { downloadResumePDF } from '../utils/pdfDownload';
import LivePreview from '../components/Resume/LivePreview';
import TemplateSelector from '../components/Resume/TemplateSelector';
import SectionOrderManager from '../components/Resume/SectionOrderManager';
import AiSuggestionsPanel from '../components/Resume/AiSuggestionsPanel';
import PersonalInfoStep from '../components/Resume/steps/PersonalInfoStep';
import EducationStep from '../components/Resume/steps/EducationStep';
import SkillsStep from '../components/Resume/steps/SkillsStep';
import ProjectsStep from '../components/Resume/steps/ProjectsStep';
import ExperienceStep from '../components/Resume/steps/ExperienceStep';

const cleanWord = (word) => word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();

const getSignificantWords = (text) => {
  const stopwords = new Set([
    'i', 'my', 'we', 'the', 'a', 'an', 'in', 'on', 'with', 'to', 'for', 'and', 'or', 'of',
    'at', 'by', 'from', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between',
    'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among',
    'worked', 'helped', 'responsible', 'assisted', 'handled', 'managed', 'led'
  ]);
  return text
    .split(/\s+/)
    .map(cleanWord)
    .filter(w => w.length > 1 && !stopwords.has(w));
};

const findBestMatchingField = (resume, rewrittenBullet) => {
  const rewrittenWords = getSignificantWords(rewrittenBullet);
  if (rewrittenWords.length === 0) return null;

  let bestMatch = null;
  let maxOverlap = 0;

  const scoreLine = (text, fieldPath, index) => {
    if (!text) return;
    const lines = text.split('\n');
    lines.forEach((line, lineIdx) => {
      const lineWords = getSignificantWords(line);
      const overlap = lineWords.filter(w => rewrittenWords.includes(w)).length;
      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        bestMatch = { fieldPath, index, lineIdx, originalLine: line };
      }
    });
  };

  scoreLine(resume.personalInfo?.summary, 'personalInfo.summary', null);

  if (Array.isArray(resume.experience)) {
    resume.experience.forEach((exp, idx) => {
      scoreLine(exp.description, 'experience', idx);
    });
  }

  if (Array.isArray(resume.projects)) {
    resume.projects.forEach((proj, idx) => {
      scoreLine(proj.description, 'projects', idx);
    });
  }

  return maxOverlap > 0 ? bestMatch : null;
};

const STEP_ICONS = {
  User,
  GraduationCap,
  Sparkles,
  FolderKanban,
  Briefcase,
};

export default function ResumeEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [resume, setResume] = useState({ ...emptyResume });
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (!isNew) {
      fetchResume();
    }
  }, [id]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchResume = async () => {
    try {
      const { data } = await api.get(`/resumes/${id}`);
      setResume(data);
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updateResume = useCallback((field, value) => {
    setResume((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }, []);

  const updateSectionOrder = useCallback((nextOrder) => {
    setResume((prev) => ({ ...prev, sectionOrder: nextOrder }));
    setSaved(false);
  }, []);

  const buildAnalyzePayload = useMemo(
    () => ({
      role: targetRole || resume.title || 'Resume optimization',
      resume,
    }),
    [resume, targetRole]
  );

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const { data } = await api.post('/ai/analyze', buildAnalyzePayload);
      setAnalysis(data);
      if (Array.isArray(data.recommended_skills) && data.recommended_skills.length > 0) {
        setResume((prev) => ({
          ...prev,
          skills: Array.from(new Set([...(prev.skills || []), ...data.recommended_skills])),
        }));
      }
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplySkills = () => {
    if (!analysis?.recommended_skills?.length) return;
    setResume((prev) => ({
      ...prev,
      skills: Array.from(new Set([...(prev.skills || []), ...analysis.recommended_skills])),
    }));
    setSaved(false);
  };

  const handleApplyBullet = (rewrittenBullet) => {
    const match = findBestMatchingField(resume, rewrittenBullet);
    if (!match) {
      alert("Could not automatically locate the matching bullet point in your resume to replace. You can still copy and paste it manually.");
      return;
    }

    setResume((prev) => {
      const next = { ...prev };
      if (match.fieldPath === 'personalInfo.summary') {
        const lines = (next.personalInfo?.summary || '').split('\n');
        lines[match.lineIdx] = rewrittenBullet;
        next.personalInfo = {
          ...next.personalInfo,
          summary: lines.join('\n'),
        };
      } else if (match.fieldPath === 'experience') {
        const expList = [...(next.experience || [])];
        const lines = (expList[match.index].description || '').split('\n');
        lines[match.lineIdx] = rewrittenBullet;
        expList[match.index] = {
          ...expList[match.index],
          description: lines.join('\n'),
        };
        next.experience = expList;
      } else if (match.fieldPath === 'projects') {
        const projList = [...(next.projects || [])];
        const lines = (projList[match.index].description || '').split('\n');
        lines[match.lineIdx] = rewrittenBullet;
        projList[match.index] = {
          ...projList[match.index],
          description: lines.join('\n'),
        };
        next.projects = projList;
      }
      return next;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    const personalErrors = validatePersonalInfo(resume.personalInfo);
    if (Object.keys(personalErrors).length > 0) {
      setErrors(personalErrors);
      setCurrentStep(0);
      return;
    }

    setSaving(true);
    try {
      if (isNew || !resume._id) {
        const { data } = await api.post('/resumes', resume);
        setResume(data);
        navigate(`/resume/${data._id}`, { replace: true });
      } else {
        const { data } = await api.put(`/resumes/${resume._id}`, resume);
        setResume(data);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const name = resume.personalInfo.fullName || resume.title || 'resume';
      await downloadResumePDF(`${name.replace(/\s+/g, '_')}.pdf`);
    } catch {
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 0) {
      const personalErrors = validatePersonalInfo(resume.personalInfo);
      if (Object.keys(personalErrors).length > 0) {
        setErrors(personalErrors);
        return;
      }
    }
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const renderStep = () => {
    switch (WIZARD_STEPS[currentStep].id) {
      case 'personal':
        return (
          <PersonalInfoStep
            data={resume.personalInfo}
            onChange={(val) => updateResume('personalInfo', val)}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 'education':
        return <EducationStep data={resume.education} onChange={(val) => updateResume('education', val)} />;
      case 'skills':
        return <SkillsStep data={resume.skills} onChange={(val) => updateResume('skills', val)} />;
      case 'projects':
        return <ProjectsStep data={resume.projects} onChange={(val) => updateResume('projects', val)} />;
      case 'experience':
        return <ExperienceStep data={resume.experience} onChange={(val) => updateResume('experience', val)} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50/40 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-16 animate-pulse rounded-3xl bg-white/80 shadow-sm" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4 rounded-3xl bg-white/80 p-4 shadow-sm">
              <div className="h-10 rounded-2xl bg-slate-100" />
              <div className="h-52 rounded-3xl bg-slate-100" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-24 rounded-2xl bg-slate-100" />
                <div className="h-24 rounded-2xl bg-slate-100" />
              </div>
            </div>
            <div className="rounded-3xl bg-white/80 p-4 shadow-sm">
              <div className="h-[700px] rounded-3xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const previewOrder = resume.sectionOrder?.length ? resume.sectionOrder : ['experience', 'education', 'skills', 'projects'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="btn-ghost !p-2 shrink-0">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <input
                type="text"
                value={resume.title}
                onChange={(e) => updateResume('title', e.target.value)}
                className="max-w-[220px] truncate border-none bg-transparent text-lg font-semibold text-slate-900 outline-none dark:text-white lg:max-w-xs"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Live preview updates as you type.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} className="btn-ghost !px-3">
              {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button onClick={() => setShowAiPanel((current) => !current)} className="btn-ghost !px-3">
              {showAiPanel ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              <span className="hidden sm:inline">AI Panel</span>
            </button>
            <button onClick={() => setShowPreview((current) => !current)} className="btn-ghost !px-3 lg:hidden">
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button onClick={handleAnalyze} disabled={analyzing} className="btn-secondary !py-2">
              {analyzing ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Wand2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{analyzing ? 'Analyzing...' : 'Improve with AI'}</span>
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-secondary !py-2">
              {saved ? <Check className="h-4 w-4 text-green-600" /> : <Save className="h-4 w-4" />}
              <span className="hidden sm:inline">{saved ? 'Saved' : saving ? 'Saving...' : 'Save'}</span>
            </button>
            <button onClick={handleDownload} disabled={downloading} className="btn-primary !py-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{downloading ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-[1800px] gap-4 p-4 lg:p-6">
        <motion.section
          layout
          className={`min-w-0 overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75 ${showPreview ? 'flex-[1.05]' : 'flex-1'}`}
        >
          <div className="border-b border-white/60 px-4 py-4 dark:border-white/10 lg:px-6">
            <div className="mb-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4 rounded-3xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <div>
                  <label className="label-text">Template</label>
                  <TemplateSelector
                    selected={resume.template}
                    onChange={(val) => updateResume('template', val)}
                  />
                </div>
                <SectionOrderManager order={previewOrder} onChange={updateSectionOrder} />
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Builder steps</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Navigate each resume section in sequence.</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  {WIZARD_STEPS.map((step, index) => {
                    const Icon = STEP_ICONS[step.icon];
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(index)}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-500/20 dark:text-brand-100'
                            : isCompleted
                            ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10'
                            : 'bg-transparent text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5'
                        }`}
                      >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                          isActive
                            ? 'bg-brand-600 text-white'
                            : isCompleted
                            ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/30 dark:text-brand-100'
                            : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300'
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </span>
                        <span>{step.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid min-h-[calc(100vh-290px)] grid-rows-[1fr_auto]">
            <div className="overflow-y-auto p-4 lg:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={WIZARD_STEPS[currentStep].id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-white/60 px-4 py-4 dark:border-white/10 lg:px-6">
              <button onClick={prevStep} disabled={currentStep === 0} className="btn-secondary !py-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
                  {SECTION_LABELS[previewOrder[0]] || 'Ordered sections'}
                </span>
              </div>
              {currentStep < WIZARD_STEPS.length - 1 ? (
                <button onClick={nextStep} className="btn-primary !py-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving} className="btn-primary !py-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Finish & Save'}
                </button>
              )}
            </div>
          </div>
        </motion.section>

        <motion.section
          layout
          className={`hidden min-w-0 overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75 lg:flex ${showPreview ? 'flex-[0.95]' : 'flex-1'}`}
        >
          <LivePreview data={resume} />
        </motion.section>

        <AiSuggestionsPanel
          open={showAiPanel}
          loading={analyzing}
          analysis={analysis}
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          onAnalyze={handleAnalyze}
          onApplySkills={handleApplySkills}
          onApplyBullet={handleApplyBullet}
        />
      </div>
    </div>
  );
}
