import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';

const TEMPLATE_MAP = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
};

export default function LivePreview({ data }) {
  const Template = TEMPLATE_MAP[data.template] || ModernTemplate;

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-surface-50 via-white to-brand-50/30 p-4 lg:p-6">
      <div
        id="resume-preview"
        className="mx-auto w-full max-w-[816px] overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
        style={{ aspectRatio: '8.5/11' }}
      >
        <Template data={data} />
      </div>
    </div>
  );
}

export { TEMPLATE_MAP };
