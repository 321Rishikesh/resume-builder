import { TEMPLATES } from '../../utils/constants';

export default function TemplateSelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onChange(template.id)}
          className={`group rounded-2xl border p-3 text-left transition-all duration-200 ${
            selected === template.id
              ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/15'
              : 'border-surface-200/80 bg-white/80 hover:border-surface-300 hover:bg-surface-50'
          }`}
        >
          <div className={`mb-2 h-16 rounded-lg ${template.preview}`} />
          <p className="text-sm font-semibold text-surface-900">{template.name}</p>
          <p className="text-xs text-surface-500">{template.description}</p>
        </button>
      ))}
    </div>
  );
}
