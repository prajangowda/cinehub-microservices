import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage = 1, totalPages = 1, onChange, className = '' }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={`flex items-center justify-center gap-2 rounded-full bg-slate-950/90 px-3 py-2 ${className}`} aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          className={`h-10 min-w-[2.5rem] rounded-full px-3 text-sm font-semibold transition ${
            page === currentPage ? 'bg-brand-500 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
