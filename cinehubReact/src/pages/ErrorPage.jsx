import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-xl shadow-slate-950/20">
      <h1 className="text-3xl font-semibold text-white">Something went wrong</h1>
      <p className="mt-3 text-slate-400">We couldn't load this page. Try again or return home.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">
        Go back home
      </Link>
    </div>
  );
}

export default ErrorPage;
