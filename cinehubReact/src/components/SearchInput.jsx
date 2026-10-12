export function SearchInput({ placeholder = 'Search', className = '', ...props }) {
  return (
    <div className={`w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 ${className}`}>
      <input
        type="search"
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
        {...props}
      />
    </div>
  );
}
