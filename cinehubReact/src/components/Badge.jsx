export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-brand-500/10 text-brand-200 border border-brand-500/25',
    success: 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-200 border border-amber-500/20',
    accent: 'bg-brand-500/15 text-brand-100 border border-brand-500/25'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${variants[variant] ?? variants.default} ${className}`}>
      {children}
    </span>
  );
}
