import { Plus, Trash2, GripVertical } from 'lucide-react';
import { emptyEducation } from '../../../utils/constants';

export default function EducationStep({ data, onChange }) {
  const addItem = () => {
    onChange([...data, { ...emptyEducation }]);
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
          <h3 className="text-lg font-semibold text-surface-900">Education</h3>
          <p className="text-sm text-surface-500">Add your academic background</p>
        </div>
        <button type="button" onClick={addItem} className="btn-secondary !py-2 !px-3">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-surface-200 py-12 text-center">
          <p className="text-sm text-surface-500">No education entries yet</p>
          <button type="button" onClick={addItem} className="btn-primary mt-4 !py-2">
            <Plus className="h-4 w-4" />
            Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-surface-500">
                  <GripVertical className="h-4 w-4" />
                  Education #{index + 1}
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
                <div className="sm:col-span-2">
                  <label className="label-text">Institution</label>
                  <input
                    type="text"
                    value={item.institution}
                    onChange={(e) => updateItem(index, 'institution', e.target.value)}
                    className="input-field"
                    placeholder="University of California"
                  />
                </div>
                <div>
                  <label className="label-text">Degree</label>
                  <input
                    type="text"
                    value={item.degree}
                    onChange={(e) => updateItem(index, 'degree', e.target.value)}
                    className="input-field"
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div>
                  <label className="label-text">Field of Study</label>
                  <input
                    type="text"
                    value={item.field}
                    onChange={(e) => updateItem(index, 'field', e.target.value)}
                    className="input-field"
                    placeholder="Computer Science"
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
                  />
                </div>
                <div>
                  <label className="label-text">GPA</label>
                  <input
                    type="text"
                    value={item.gpa}
                    onChange={(e) => updateItem(index, 'gpa', e.target.value)}
                    className="input-field"
                    placeholder="3.8"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="input-field min-h-[80px] resize-y"
                    placeholder="Relevant coursework, honors, activities..."
                    rows={3}
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
