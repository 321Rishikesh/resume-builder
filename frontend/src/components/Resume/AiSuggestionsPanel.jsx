import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, CheckCircle2, ClipboardList, Loader2, Sparkles, Wand2, Plus, Copy, Check, FilePlus2 } from 'lucide-react';

function SkeletonLine({ className = '' }) {
  return <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />;
}

function CopyableBullet({ text, onApply }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <li className="group relative rounded-2xl bg-white/5 p-3 pr-20 leading-relaxed hover:bg-white/10 transition duration-150">
      <span>{text}</span>
      <div className="absolute right-3 top-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
        <button
          type="button"
          onClick={() => onApply(text)}
          className="text-slate-400 hover:text-brand-300 transition"
          title="Apply directly to resume"
        >
          <Wand2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition"
          title="Copy to clipboard"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </li>
  );
}

export default function AiSuggestionsPanel({
  open,
  loading,
  analysis,
  targetRole,
  setTargetRole,
  onAnalyze,
  onApplySkills,
  onApplyBullet,
  command,
  setCommand,
  onGenerateResume,
  generatingResume,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-y-0 right-0 z-30 flex h-[100dvh] w-full max-w-md flex-col overflow-hidden border-l border-white/20 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-2xl lg:sticky lg:top-0 lg:w-[390px]"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-100">
                <Sparkles className="h-3.5 w-3.5" />
                AI Assistant
              </div>
              <h3 className="mt-3 text-lg font-semibold">Improve with AI</h3>
              <p className="text-sm text-slate-300">Draft a complete resume or improve the one you have.</p>
            </div>
            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {loading ? 'Analyzing' : 'Improve'}
            </button>
          </div>

          <div className="panel-scroll min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="mb-4 rounded-3xl border border-brand-400/25 bg-brand-500/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-100">
              <FilePlus2 className="h-4 w-4" />
              Create from a command
            </div>
            <textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Create a frontend developer resume for Rahul Sharma with 3 years of React experience at Acme, based in Bengaluru. Skills: React, JavaScript, CSS."
              rows={4}
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm leading-6 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
            />
            <button
              type="button"
              onClick={onGenerateResume}
              disabled={generatingResume || !command.trim()}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 text-brand-600" />}
              {generatingResume ? 'Building your draft...' : 'Generate full resume'}
            </button>
            <p className="mt-2 text-[11px] leading-4 text-slate-400">Your command becomes an editable draft. Review details before saving.</p>
          </div>

          <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-inner">
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Target role</label>
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Frontend Engineer"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
            />
          </div>

          <div className="space-y-4 pb-10">
            {loading ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <SkeletonLine className="h-4 w-28" />
                  <SkeletonLine className="mt-4 h-10 w-full rounded-2xl" />
                  <SkeletonLine className="mt-3 h-10 w-5/6 rounded-2xl" />
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <SkeletonLine className="h-4 w-24" />
                  <SkeletonLine className="mt-4 h-20 w-full rounded-2xl" />
                </div>
              </div>
            ) : analysis ? (
              <>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-100">
                    <ClipboardList className="h-4 w-4" />
                    Missing sections
                  </div>
                  {analysis.missing_sections?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analysis.missing_sections.map((item) => (
                        <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300">No major sections are missing.</p>
                  )}
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-100">
                    <Brain className="h-4 w-4" />
                    Suggestions
                  </div>
                  <ul className="space-y-3 text-sm text-slate-200">
                    {(analysis.suggestions || []).map((item) => (
                      <li key={item} className="rounded-2xl bg-white/5 p-3 leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-100">
                    <Sparkles className="h-4 w-4" />
                    Recommended skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.recommended_skills || []).map((skill) => (
                      <span key={skill} className="rounded-full bg-brand-500/20 px-3 py-1 text-xs text-brand-50">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={onApplySkills}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-brand-400/30 bg-brand-500/15 px-4 py-2 text-sm font-semibold text-brand-50 transition hover:bg-brand-500/25"
                  >
                    <Plus className="h-4 w-4" />
                    Apply skills
                  </button>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-100">
                    <CheckCircle2 className="h-4 w-4" />
                    Bullet rewrites
                  </div>
                  <ul className="space-y-3 text-sm text-slate-200">
                    {(analysis.improved_points || []).map((item) => (
                      <CopyableBullet key={item} text={item} onApply={onApplyBullet} />
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-slate-300">
                Run an analysis to generate suggestions for the current resume.
              </div>
            )}
          </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
