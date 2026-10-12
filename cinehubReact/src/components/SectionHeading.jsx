import { Typography } from './Typography.jsx';

export function SectionHeading({ label, title, description }) {
  return (
    <div className="space-y-3">
      {label && <Typography variant="label">{label}</Typography>}
      {title && <Typography variant="heading" as="h2">{title}</Typography>}
      {description && <Typography variant="body" className="max-w-2xl">{description}</Typography>}
    </div>
  );
}
