import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage = 1, totalPages = 1, onChange, className = '' }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={`flex items-center justify-center gap-2 rounded-full border border-slate-800 bg-[#111111] px-3 py-2 shadow-lg shadow-black/25 ${className}`} aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#181818] text-slate-400 transition hover:bg-[#252525] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6571] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          className={`h-10 min-w-[2.5rem] rounded-full px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6571] ${
            page === currentPage ? 'bg-[#ff243d] text-white shadow-md shadow-red-950/50 hover:bg-[#df1c32]' : 'bg-[#181818] text-slate-300 hover:bg-[#252525] hover:text-white'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#181818] text-slate-400 transition hover:bg-[#252525] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6571] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
