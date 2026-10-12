import { Badge } from './Badge.jsx';
import { Card } from './Card.jsx';

const statusStyles = {
  confirmed: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/20',
  pending: 'bg-amber-500/15 text-amber-200 border-amber-500/20',
  cancelled: 'bg-red-500/15 text-red-200 border-red-500/20'
};

export function BookingCard({ movie, theatre, time, date, seats, total, status = 'confirmed', className = '' }) {
  return (
    <Card className={`space-y-4 p-6 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">{theatre}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{movie}</h3>
          <p className="mt-1 text-sm text-slate-400">{date} · {time}</p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${statusStyles[status] ?? statusStyles.confirmed}`}>
          {status}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Seats</p>
          <p className="mt-1 text-sm font-medium text-white">{seats}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total</p>
          <p className="mt-1 text-sm font-medium text-white">${total}</p>
        </div>
      </div>
    </Card>
  );
}
