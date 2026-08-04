import { formatDate } from '../../utils/validation';

export default function CardTemplate({ data }) {
  const { personalInfo, education, skills, projects, experience } = data;
  const orderedSections = Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0 ? data.sectionOrder : ['experience', 'education', 'skills', 'projects'];

  return (
    <div className="min-h-[1056px] bg-slate-50/30 p-8 text-slate-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top Banner Accent */}
      <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 mb-6" />

      {/* Profile & Contact Card Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
        {/* Profile Card */}
        <div className="md:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p className="mt-1 text-sm font-semibold text-teal-600 uppercase tracking-wider">{personalInfo.title}</p>
          )}
          {personalInfo.summary && (
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{personalInfo.summary}</p>
          )}
        </div>

        {/* Contact Info Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-center space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Details</h2>
          <div className="space-y-2 text-xs text-slate-600">
            {personalInfo.email && (
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Email:</span>
                <span className="truncate">{personalInfo.email}</span>
              </p>
            )}
            {personalInfo.phone && (
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Phone:</span>
                <span>{personalInfo.phone}</span>
              </p>
            )}
            {personalInfo.location && (
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Location:</span>
                <span>{personalInfo.location}</span>
              </p>
            )}
            {personalInfo.linkedin && (
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">LinkedIn:</span>
                <span className="truncate">{personalInfo.linkedin}</span>
              </p>
            )}
            {personalInfo.github && (
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">GitHub:</span>
                <span className="truncate">{personalInfo.github}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Section Content Cards */}
      <div className="space-y-6">
        {orderedSections.map((sectionKey) => {
          if (sectionKey === 'experience' && experience?.length > 0) {
            return (
              <div key={sectionKey} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, i) => (
                    <div key={i} className={i > 0 ? 'border-t border-slate-100 pt-4' : ''}>
                      <div className="flex flex-col justify-between sm:flex-row sm:items-baseline">
                        <div>
                          <h3 className="font-semibold text-slate-800">{exp.position}</h3>
                          <p className="text-sm font-medium text-teal-600">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                        </div>
                        <span className="text-xs font-medium text-slate-400 mt-1 sm:mt-0">
                          {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionKey === 'education' && education?.length > 0) {
            return (
              <div key={sectionKey} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  Education
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {education.map((edu, i) => (
                    <div key={i} className="rounded-xl border border-slate-50 bg-slate-50/50 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-800 text-sm">{edu.degree}</h3>
                          <p className="text-xs font-medium text-slate-500">{edu.field}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-teal-600 font-medium">{edu.institution}</p>
                      {edu.gpa && <p className="mt-1 text-[11px] text-slate-400">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionKey === 'skills' && skills?.length > 0) {
            return (
              <div key={sectionKey} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  Key Skills & Competencies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="rounded-xl bg-teal-50 border border-teal-100/50 px-3 py-1.5 text-xs font-medium text-teal-700 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionKey === 'projects' && projects?.length > 0) {
            return (
              <div key={sectionKey} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  Projects & Ventures
                </h2>
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <div key={i} className="rounded-xl border border-slate-50 bg-slate-50/50 p-4">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-slate-800 text-sm">{proj.name}</h3>
                        {proj.link && <span className="text-xs text-teal-600 hover:underline">{proj.link}</span>}
                      </div>
                      {proj.technologies && (
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">Tech: {proj.technologies}</p>
                      )}
                      {proj.description && (
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 whitespace-pre-line">{proj.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
