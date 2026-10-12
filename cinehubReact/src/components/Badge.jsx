export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-brand-500/15 text-brand-100 border border-brand-500/20',
    success: 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-200 border border-amber-500/20',
    accent: 'bg-violet-500/15 text-violet-200 border border-violet-500/20'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${variants[variant] ?? variants.default} ${className}`}>
      {children}
    </span>
  );
}
