import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function SkillsStep({ data, onChange }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const skill = input.trim();
    if (skill && !data.includes(skill)) {
      onChange([...data, skill]);
      setInput('');
    }
  };

  const removeSkill = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h3 className="text-lg font-semibold text-surface-900">Skills</h3>
        <p className="text-sm text-surface-500">Add your technical and soft skills</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field"
          placeholder="e.g. JavaScript, React, Leadership"
        />
        <button type="button" onClick={addSkill} className="btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {data.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="rounded-full p-0.5 hover:bg-brand-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-surface-200 py-12 text-center">
          <p className="text-sm text-surface-500">No skills added yet. Type a skill and press Enter.</p>
        </div>
      )}

      <div className="rounded-xl bg-surface-50 p-4">
        <p className="text-xs font-medium text-surface-600 mb-2">Suggested skills</p>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'Communication', 'Problem Solving'].map(
            (skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => !data.includes(skill) && onChange([...data, skill])}
                className="rounded-full border border-surface-200 bg-white px-3 py-1 text-xs text-surface-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
              >
                + {skill}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
