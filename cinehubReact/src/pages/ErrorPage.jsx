import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div className="cinehub-page relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111111] p-8 text-center shadow-2xl shadow-black/40">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-700 via-brand-500 to-transparent" />
      <h1 className="text-3xl font-semibold text-white">Something went wrong</h1>
      <p className="mt-3 text-slate-400">We couldn't load this page. Try again or return home.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">
        Go back home
      </Link>
    </div>
  );
}

export default ErrorPage;
