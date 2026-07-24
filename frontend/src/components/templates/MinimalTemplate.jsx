import { formatDate } from '../../utils/validation';

const orderedDefault = ['experience', 'education', 'skills', 'projects'];

export default function MinimalTemplate({ data }) {
  const { personalInfo, education, skills, projects, experience } = data;
  const orderedSections = Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0 ? data.sectionOrder : orderedDefault;

  return (
    <div className="min-h-[1056px] bg-white p-10 text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="mb-8">
        <h1 className="text-4xl font-light tracking-tight">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-emerald-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-8">
          <p className="text-sm leading-relaxed text-gray-600">{personalInfo.summary}</p>
        </section>
      )}

      {orderedSections.map((sectionKey) => {
        if (sectionKey === 'experience' && experience?.length > 0) {
          return (
            <section key={sectionKey} className="mb-8">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Experience</h2>
              <div className="space-y-5">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium">{exp.position}</h3>
                      <span className="text-xs text-gray-400">
                        {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{exp.company}</p>
                    {exp.description && (
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'education' && education?.length > 0) {
          return (
            <section key={sectionKey} className="mb-8">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Education</h2>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium">{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</h3>
                      <span className="text-xs text-gray-400">
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'skills' && skills?.length > 0) {
          return (
            <section key={sectionKey} className="mb-8">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <span key={i} className="text-sm text-gray-700">{skill}</span>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects?.length > 0) {
          return (
            <section key={sectionKey}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Projects</h2>
              <div className="space-y-4">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <h3 className="font-medium">{proj.name}</h3>
                    {proj.description && (
                      <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{proj.description}</p>
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
  );
}
