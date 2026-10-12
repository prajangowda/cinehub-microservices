import { Outlet, Link } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/90 px-6 py-4 text-center text-sm text-slate-300">
        <Link to="/" className="font-semibold text-white hover:text-brand-300">
          Back to CineHub
        </Link>
      </header>
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
