import { X } from 'lucide-react';

export function Modal({ open, title, onClose, children, footer, className = '', ...props }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-2xl overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/40 ${className}`}
        onClick={(event) => event.stopPropagation()}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white"
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
