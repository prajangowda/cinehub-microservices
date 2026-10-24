import { Button } from './Button.jsx';

export function MovieCard({ title, rating, genre, year, image, raw, onAction }) {
  const certificate = raw?.certificate;
  const language = raw?.language;

  return (
    <article className="group w-full max-w-[250px]">
      <div className="relative aspect-[3/5] overflow-hidden rounded-2xl bg-[#1b1b1b] shadow-lg shadow-black/25">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#1b1b1b] p-4 text-center text-sm text-slate-500">
            No image available
          </div>
        )}
        {rating > 0 && (
          <div
            aria-label={`Rating ${rating.toFixed(1)} out of 10`}
            className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/90 px-3 py-2 text-sm text-white"
          >
            <span className="text-[#ff4357]" aria-hidden="true">★</span>
            <span>{rating.toFixed(1)}/10</span>
          </div>
        )}
      </div>
      <div className="flex min-h-[142px] flex-col pt-3">
        <h3 className="line-clamp-2 text-lg font-semibold leading-6 !text-white">{title}</h3>
        <div className="mt-2 space-y-1 text-sm text-slate-400">
          {certificate && <p>{certificate}</p>}
          {(language || genre || year) && (
            <p>{[language, !language && genre, year].filter(Boolean).join(" · ")}</p>
          )}
        </div>
        <div className="mt-auto pt-3">
          <Button className="rounded-lg px-4 py-2" onClick={onAction}>Book</Button>
        </div>
      </div>
    </article>
  );
}
