import { formatDate } from '../../utils/validation';

export default function ModernTemplate({ data }) {
  const { personalInfo, education, skills, projects, experience } = data;
  const orderedSections = Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0 ? data.sectionOrder : ['experience', 'education', 'skills', 'projects'];

  return (
    <div className="flex min-h-[1056px] bg-white text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="w-[35%] bg-brand-700 p-6 text-white">
        <h1 className="text-2xl font-bold leading-tight">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.summary && (
          <p className="mt-4 text-sm leading-relaxed text-brand-100">{personalInfo.summary}</p>
        )}

        <div className="mt-6 space-y-2 text-sm">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p className="truncate">{personalInfo.linkedin}</p>}
          {personalInfo.github && <p className="truncate">{personalInfo.github}</p>}
          {personalInfo.website && <p className="truncate">{personalInfo.website}</p>}
        </div>

        {skills?.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-200">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="rounded-full bg-brand-600 px-3 py-1 text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-[65%] p-6">
        {orderedSections.map((sectionKey) => {
          if (sectionKey === 'experience' && experience?.length > 0) {
            return (
              <section key={sectionKey} className="mb-6">
                <h2 className="mb-3 border-b-2 border-brand-600 pb-1 text-sm font-bold uppercase tracking-wider text-brand-700">
                  Experience
                </h2>
                {experience.map((exp, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{exp.position}</h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-brand-600">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    {exp.description && (
                      <p className="mt-1 text-sm leading-relaxed text-gray-600 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </section>
            );
          }

          if (sectionKey === 'education' && education?.length > 0) {
            return (
              <section key={sectionKey} className="mb-6">
                <h2 className="mb-3 border-b-2 border-brand-600 pb-1 text-sm font-bold uppercase tracking-wider text-brand-700">
                  Education
                </h2>
                {education.map((edu, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-brand-600">{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                    {edu.description && (
                      <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{edu.description}</p>
                    )}
                  </div>
                ))}
              </section>
            );
          }

          if (sectionKey === 'skills' && skills?.length > 0) {
            return (
              <section key={sectionKey} className="mb-6">
                <h2 className="mb-3 border-b-2 border-brand-600 pb-1 text-sm font-bold uppercase tracking-wider text-brand-700">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{skill}</span>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'projects' && projects?.length > 0) {
            return (
              <section key={sectionKey}>
                <h2 className="mb-3 border-b-2 border-brand-600 pb-1 text-sm font-bold uppercase tracking-wider text-brand-700">
                  Projects
                </h2>
                {projects.map((proj, i) => (
                  <div key={i} className="mb-4">
                    <h3 className="font-semibold">
                      {proj.name}
                      {proj.link && <span className="ml-2 text-xs font-normal text-brand-600">{proj.link}</span>}
                    </h3>
                    {proj.technologies && (
                      <p className="text-xs text-gray-500">{proj.technologies}</p>
                    )}
                    {proj.description && (
                      <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{proj.description}</p>
                    )}
                  </div>
                ))}
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
