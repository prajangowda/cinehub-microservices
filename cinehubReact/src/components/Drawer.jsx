export function Drawer({ open, onClose, title, placement = 'right', children, className = '', footer, ...props }) {
  const placementStyles = {
    right: 'right-0 top-0 h-full w-full max-w-sm',
    left: 'left-0 top-0 h-full w-full max-w-sm',
    bottom: 'bottom-0 left-0 w-full max-h-[70vh]'
  };

  return (
    <div className={`fixed inset-0 z-40 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-slate-950/70 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`absolute ${placementStyles[placement] ?? placementStyles.right} flex flex-col overflow-hidden rounded-t-[2rem] border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/40 transition-transform duration-300 ${
          open ? 'translate-x-0 translate-y-0' : placement === 'bottom' ? 'translate-y-full' : placement === 'left' ? '-translate-x-full' : 'translate-x-full'
        } ${className}`}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5">{children}</div>
        {footer && <div className="border-t border-slate-800 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
