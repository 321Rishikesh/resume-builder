import { formatDate } from '../../utils/validation';

const orderedDefault = ['experience', 'education', 'skills', 'projects'];

export default function ClassicTemplate({ data }) {
  const { personalInfo, education, skills, projects, experience } = data;
  const orderedSections = Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0 ? data.sectionOrder : orderedDefault;

  return (
    <div className="min-h-[1056px] bg-white p-8 text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
      <header className="border-b-2 border-gray-800 pb-4 text-center">
        <h1 className="text-3xl font-bold tracking-wide">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mt-5">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-800">Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700">{personalInfo.summary}</p>
        </section>
      )}

      {orderedSections.map((sectionKey) => {
        if (sectionKey === 'experience' && experience?.length > 0) {
          return (
            <section key={sectionKey} className="mt-5">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-800">Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{exp.position}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-sm italic text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  {exp.description && (
                    <p className="mt-1 text-sm leading-relaxed text-gray-700 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </section>
          );
        }

        if (sectionKey === 'education' && education?.length > 0) {
          return (
            <section key={sectionKey} className="mt-5">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-800">Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{edu.institution}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p className="text-sm italic text-gray-600">
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                  </p>
                </div>
              ))}
            </section>
          );
        }

        if (sectionKey === 'skills' && skills?.length > 0) {
          return (
            <section key={sectionKey} className="mt-5">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-800">Skills</h2>
              <p className="text-sm text-gray-700">{skills.join(' · ')}</p>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects?.length > 0) {
          return (
            <section key={sectionKey} className="mt-5">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-800">Projects</h2>
              {projects.map((proj, i) => (
                <div key={i} className="mb-3">
                  <h3 className="font-bold">{proj.name}</h3>
                  {proj.technologies && <p className="text-xs text-gray-500">{proj.technologies}</p>}
                  {proj.description && (
                    <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{proj.description}</p>
                  )}
                </div>
              ))}
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
