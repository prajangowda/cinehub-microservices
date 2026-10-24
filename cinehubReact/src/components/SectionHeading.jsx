import { Typography } from './Typography.jsx';

export function SectionHeading({
  label,
  title,
  description,
  labelClassName = '',
  titleClassName = '',
  descriptionClassName = '',
}) {
  return (
    <div className="space-y-3 border-b border-slate-800 pb-6">
      {label && <Typography variant="label" className={`flex items-center gap-3 before:h-px before:w-8 before:bg-brand-500 ${labelClassName}`}>{label}</Typography>}
      {title && <Typography variant="heading" as="h2" className={`tracking-tight ${titleClassName}`}>{title}</Typography>}
      {description && <Typography variant="body" className={`max-w-2xl ${descriptionClassName}`}>{description}</Typography>}
    </div>
  );
}
