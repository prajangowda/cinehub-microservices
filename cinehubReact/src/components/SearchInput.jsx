export function SearchInput({ placeholder = 'Search', className = '', ...props }) {
  return (
    <div className={`w-full min-w-0 rounded-2xl border border-slate-800 bg-[#111111] px-4 py-3 shadow-inner shadow-black/30 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15 ${className}`}>
      <input
        type="search"
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
        {...props}
      />
    </div>
  );
}
