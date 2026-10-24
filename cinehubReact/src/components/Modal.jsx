import { X } from 'lucide-react';

export function Modal({ open, title, onClose, children, footer, className = '', ...props }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-2xl overflow-hidden rounded-3xl border border-[#333333] bg-[#111111] shadow-2xl shadow-black/60 ${className}`}
        onClick={(event) => event.stopPropagation()}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-brand-500/10 hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-400"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-6 px-6 py-5 text-slate-200">{children}</div>
        {footer && <div className="border-t border-slate-800 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
