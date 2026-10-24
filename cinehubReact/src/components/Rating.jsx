import { Star } from 'lucide-react';

export function Rating({ value = 0, max = 5, className = '' }) {
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.5;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }).map((_, index) => {
        const position = index + 1;
        const isFilled = position <= fullStars;
        const isHalf = !isFilled && hasHalf && position === fullStars + 1;

        return (
          <Star
            key={position}
            className={`h-4 w-4 ${isFilled ? 'text-amber-300' : isHalf ? 'text-amber-300/70' : 'text-slate-700'}`}
            fill={isFilled || isHalf ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        );
      })}
      <span className="text-xs text-slate-400">{value.toFixed(1)}</span>
    </div>
  );
}
