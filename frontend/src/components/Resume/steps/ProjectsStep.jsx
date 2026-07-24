import { Plus, Trash2, GripVertical } from 'lucide-react';
import { emptyProject } from '../../../utils/constants';

export default function ProjectsStep({ data, onChange }) {
  const addItem = () => {
    onChange([...data, { ...emptyProject }]);
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
          <h3 className="text-lg font-semibold text-surface-900">Projects</h3>
          <p className="text-sm text-surface-500">Showcase your best work</p>
        </div>
        <button type="button" onClick={addItem} className="btn-secondary !py-2 !px-3">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-surface-200 py-12 text-center">
          <p className="text-sm text-surface-500">No projects added yet</p>
          <button type="button" onClick={addItem} className="btn-primary mt-4 !py-2">
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-surface-500">
                  <GripVertical className="h-4 w-4" />
                  Project #{index + 1}
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
                  <label className="label-text">Project Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    className="input-field"
                    placeholder="E-Commerce Platform"
                  />
                </div>
                <div>
                  <label className="label-text">Link</label>
                  <input
                    type="url"
                    value={item.link}
                    onChange={(e) => updateItem(index, 'link', e.target.value)}
                    className="input-field"
                    placeholder="github.com/user/project"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text">Technologies</label>
                  <input
                    type="text"
                    value={item.technologies}
                    onChange={(e) => updateItem(index, 'technologies', e.target.value)}
                    className="input-field"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-text">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="input-field min-h-[80px] resize-y"
                    placeholder="Describe the project, your role, and key achievements..."
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
