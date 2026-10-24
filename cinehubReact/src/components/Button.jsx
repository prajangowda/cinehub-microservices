export function Button({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full bg-[#ff243d] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/40 transition hover:bg-[#df1c32] focus:outline-none focus:ring-2 focus:ring-[#ff6571] focus:ring-offset-2 focus:ring-offset-[#080808] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
