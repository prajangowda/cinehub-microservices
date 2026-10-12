export function Card({ children, className = '', variant = 'surface', ...props }) {
  const variants = {
    surface: 'rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-slate-950/20',
    elevated: 'rounded-[2rem] border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/40',
    light: 'rounded-3xl bg-slate-800/90'
  };

  return (
    <div className={`${variants[variant] ?? variants.surface} ${className}`} {...props}>
      {children}
    </div>
  );
}
