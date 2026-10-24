export function Input({ label, error, icon, className = '', containerClassName = '', ...props }) {
  return (
    <label className={`block text-sm text-slate-300 ${containerClassName}`}>
      {label && <span className="font-medium">{label}</span>}
      <div className="relative mt-2">
        {icon && <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">{icon}</span>}
        <input
          className={`w-full rounded-xl border border-slate-800 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${icon ? 'pl-12' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </label>
  );
}
