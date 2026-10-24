import { Outlet, Link } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark.jsx';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#090909] text-slate-100">
      <header className="border-b border-[#292929] bg-[#090909]/95 px-4 py-4 text-sm text-slate-300 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" aria-label="CineHub home" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">
            <BrandMark className="text-base sm:text-xl" iconClassName="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
          <Link
            to="/"
            className="text-xs text-slate-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400 sm:text-sm"
          >
            Back to CineHub
          </Link>
        </div>
      </header>
      <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#080808] px-4 py-8 sm:py-12">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/35 to-transparent" />
        <div className="w-full max-w-md rounded-3xl border border-[#303030] bg-[#111111]/95 p-6 shadow-2xl shadow-black/50 sm:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
