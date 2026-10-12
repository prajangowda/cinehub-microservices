import { Badge } from './Badge.jsx';
import { Button } from './Button.jsx';
import { Card } from './Card.jsx';
import { Rating } from './Rating.jsx';

export function MovieCard({ title, subtitle, rating, genre, year, image, tags = [], onAction }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 bg-slate-950/80 sm:h-72">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-900 text-sm text-slate-500">No image available</div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-400">{subtitle || `${genre ?? 'Genre'} · ${year ?? 'Year'}`}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Rating value={rating ?? 0} />
          <Button className="rounded-full px-4 py-2" onClick={onAction}>Book</Button>
        </div>
      </div>
    </Card>
  );
}
