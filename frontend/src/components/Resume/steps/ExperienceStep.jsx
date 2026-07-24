import { Plus, Trash2, GripVertical } from 'lucide-react';
import { emptyExperience } from '../../../utils/constants';

export default function ExperienceStep({ data, onChange }) {
  const addItem = () => {
    onChange([...data, { ...emptyExperience }]);
  };

  const removeItem = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-surface-900">Work Experience</h3>
          <p className="text-sm text-surface-500">Add your professional experience</p>
        </div>
        <button type="button" onClick={addItem} className="btn-secondary !py-2 !px-3">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-surface-200 py-12 text-center">
          <p className="text-sm text-surface-500">No experience entries yet</p>
          <button type="button" onClick={addItem} className="btn-primary mt-4 !py-2">
            <Plus className="h-4 w-4" />
            Add Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-surface-500">
                  <GripVertical className="h-4 w-4" />
                  Experience #{index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-text">Company</label>
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => updateItem(index, 'company', e.target.value)}
                    className="input-field"
                    placeholder="Google"
                  />
                </div>
                <div>
                  <label className="label-text">Position</label>
                  <input
                    type="text"
                    value={item.position}
                    onChange={(e) => updateItem(index, 'position', e.target.value)}
                    className="input-field"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="label-text">Location</label>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => updateItem(index, 'location', e.target.value)}
                    className="input-field"
                    placeholder="Mountain View, CA"
                  />
                </div>
                <div>
                  <label className="label-text">Start Date</label>
                  <input
                    type="month"
                    value={item.startDate}
                    onChange={(e) => updateItem(index, 'startDate', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">End Date</label>
                  <input
                    type="month"
                    value={item.endDate}
                    onChange={(e) => updateItem(index, 'endDate', e.target.value)}
                    className="input-field"
                    disabled={item.current}
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-surface-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.current}
                      onChange={(e) => updateItem(index, 'current', e.target.checked)}
                      className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                    />
                    Currently working here
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="input-field min-h-[100px] resize-y"
                    placeholder="Describe your responsibilities and achievements..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
