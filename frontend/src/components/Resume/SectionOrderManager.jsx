import { Reorder } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { SECTION_LABELS } from '../../utils/constants';

export default function SectionOrderManager({ order, onChange }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur-xl">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Section order</h3>
          <p className="text-xs text-slate-700">Drag to reorder the main resume sections.</p>
        </div>
      </div>

      <Reorder.Group axis="y" values={order} onReorder={onChange} className="space-y-2">
        {order.map((sectionId) => (
          <Reorder.Item
            key={sectionId}
            value={sectionId}
            className="flex w-full cursor-grab items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-semibold text-slate-800 shadow-sm active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-slate-500" />
            <span>{SECTION_LABELS[sectionId] || sectionId}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
