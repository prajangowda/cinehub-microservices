export function Card({ children, className = '', variant = 'surface', ...props }) {
  const variants = {
    surface: 'rounded-3xl border border-slate-800 bg-[#111111] shadow-xl shadow-black/30',
    elevated: 'rounded-[2rem] border border-slate-800 bg-[#0d0d0d] shadow-2xl shadow-black/50',
    light: 'rounded-3xl border border-slate-800 bg-[#181818]'
  };

  return (
    <div className={`${variants[variant] ?? variants.surface} ${className}`} {...props}>
      {children}
    </div>
  );
}
