import { formatDate } from '../../utils/validation';

export default function CreativeTemplate({ data }) {
  const { personalInfo, education, skills, projects, experience } = data;
  const orderedSections = Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0 ? data.sectionOrder : ['experience', 'education', 'skills', 'projects'];

  return (
    <div className="flex min-h-[1056px] flex-col bg-white text-slate-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top Creative Header */}
      <header className="bg-gradient-to-r from-indigo-700 via-violet-800 to-purple-800 p-8 text-white">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.title && (
              <p className="mt-1 text-lg font-medium text-violet-200">{personalInfo.title}</p>
            )}
          </div>
          <div className="flex flex-col space-y-1 text-left text-sm text-indigo-100 sm:text-right">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>
        
        {personalInfo.summary && (
          <div className="mt-6 border-t border-white/20 pt-4">
            <p className="max-w-3xl text-sm leading-relaxed text-indigo-50/90 italic">
              "{personalInfo.summary}"
            </p>
          </div>
        )}
      </header>

      {/* 2-Column Body */}
      <div className="flex flex-1 gap-8 p-8">
        {/* Left Main Column: Experience & Projects */}
        <div className="w-[62%] space-y-8">
          {orderedSections.map((sectionKey) => {
            if (sectionKey === 'experience' && experience?.length > 0) {
              return (
                <section key={sectionKey}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-6 w-1 rounded-full bg-violet-600" />
                    <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                      Professional Experience
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {experience.map((exp, i) => (
                      <div key={i} className="relative border-l border-slate-100 pl-4">
                        <div className="absolute -left-[4.5px] top-[6px] h-2 w-2 rounded-full bg-violet-500" />
                        <div className="flex items-baseline justify-between">
                          <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                          <span className="rounded bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-600">
                            {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm font-medium text-indigo-700">
                          {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                        </p>
                        {exp.description && (
                          <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (sectionKey === 'projects' && projects?.length > 0) {
              return (
                <section key={sectionKey}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-6 w-1 rounded-full bg-violet-600" />
                    <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                      Key Projects
                    </h2>
                  </div>
                  <div className="space-y-5">
                    {projects.map((proj, i) => (
                      <div key={i} className="pl-4">
                        <div className="flex items-baseline justify-between">
                          <h3 className="font-semibold text-slate-900">
                            {proj.name}
                          </h3>
                          {proj.link && (
                            <span className="text-xs text-violet-600 hover:underline">
                              {proj.link}
                            </span>
                          )}
                        </div>
                        {proj.technologies && (
                          <p className="mt-0.5 text-xs font-medium text-slate-500">
                            Tech: {proj.technologies}
                          </p>
                        )}
                        {proj.description && (
                          <p className="mt-1.5 text-sm text-slate-600 whitespace-pre-line">
                            {proj.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>

        {/* Right Sidebar: Education & Skills */}
        <div className="w-[38%] space-y-8">
          {orderedSections.map((sectionKey) => {
            if (sectionKey === 'skills' && skills?.length > 0) {
              return (
                <section key={sectionKey} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-6 w-1 rounded-full bg-indigo-600" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Expertise
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-indigo-100 bg-white px-2.5 py-1 text-xs font-medium text-indigo-700 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              );
            }

            if (sectionKey === 'education' && education?.length > 0) {
              return (
                <section key={sectionKey} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-6 w-1 rounded-full bg-indigo-600" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Education
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {education.map((edu, i) => (
                      <div key={i} className="text-sm">
                        <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                        <p className="text-xs font-medium text-slate-500">{edu.field}</p>
                        <p className="mt-1 text-xs text-indigo-700">{edu.institution}</p>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                          <span>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                          {edu.gpa && <span className="font-medium text-slate-500">GPA: {edu.gpa}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}

          {/* Social Links if present */}
          {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
            <section className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-6 w-1 rounded-full bg-indigo-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Links & Channels
                </h2>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                {personalInfo.linkedin && (
                  <p className="truncate">
                    <span className="block font-semibold text-slate-700">LinkedIn</span>
                    {personalInfo.linkedin}
                  </p>
                )}
                {personalInfo.github && (
                  <p className="truncate">
                    <span className="block font-semibold text-slate-700">GitHub</span>
                    {personalInfo.github}
                  </p>
                )}
                {personalInfo.website && (
                  <p className="truncate">
                    <span className="block font-semibold text-slate-700">Website</span>
                    {personalInfo.website}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
