export function Button({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
