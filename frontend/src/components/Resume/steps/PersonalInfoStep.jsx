import { validatePersonalInfo } from '../../../utils/validation';

export default function PersonalInfoStep({ data, onChange, errors, setErrors }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = () => {
    setErrors(validatePersonalInfo(data));
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h3 className="text-lg font-semibold text-surface-900">Personal Information</h3>
        <p className="text-sm text-surface-500">Tell us about yourself</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label-text">Full Name *</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onBlur={handleBlur}
            className={`input-field ${errors.fullName ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
            placeholder="John Doe"
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>

        <div>
          <label className="label-text">Email *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={handleBlur}
            className={`input-field ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="label-text">Phone</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="input-field"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label className="label-text">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="input-field"
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label className="label-text">LinkedIn</label>
          <input
            type="url"
            value={data.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="input-field"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label className="label-text">GitHub</label>
          <input
            type="url"
            value={data.github}
            onChange={(e) => handleChange('github', e.target.value)}
            className="input-field"
            placeholder="github.com/johndoe"
          />
        </div>

        <div>
          <label className="label-text">Website</label>
          <input
            type="url"
            value={data.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="input-field"
            placeholder="johndoe.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label-text">Professional Summary</label>
          <textarea
            value={data.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            className="input-field min-h-[120px] resize-y"
            placeholder="A brief summary of your professional background and career goals..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
