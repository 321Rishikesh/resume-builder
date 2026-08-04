import { useState, useRef, useEffect } from 'react';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import CardTemplate from '../templates/CardTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';

const TEMPLATE_MAP = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  card: CardTemplate,
  creative: CreativeTemplate,
};

export default function LivePreview({ data }) {
  const Template = TEMPLATE_MAP[data.template] || ModernTemplate;
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const padding = window.innerWidth >= 1024 ? 48 : 32;
      const containerWidth = container.clientWidth - padding;
      const targetWidth = 816;
      setScale(Math.min(containerWidth / targetWidth, 1));
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-auto bg-gradient-to-br from-surface-50 via-white to-brand-50/30 p-4 lg:p-6 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"
    >
      <div
        style={{
          height: `${1056 * scale}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          id="resume-preview"
          style={{
            width: '816px',
            height: '1056px',
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            position: 'absolute',
            left: '50%',
            marginLeft: '-408px',
          }}
          className="overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-white/10"
        >
          <Template data={data} />
        </div>
      </div>
    </div>
  );
}

export { TEMPLATE_MAP };

