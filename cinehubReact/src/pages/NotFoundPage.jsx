import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="cinehub-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="rounded-full border border-brand-500/25 bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">404</p>
      <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white">Page not found</h1>
      <p className="mt-3 max-w-xl text-slate-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
      >
        Return home
      </Link>
    </div>
  );
}

export default NotFoundPage;
