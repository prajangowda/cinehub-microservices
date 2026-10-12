import { Link, Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-950/90 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/admin" className="text-lg font-semibold text-white">
            Admin Dashboard
          </Link>
          <Link to="/" className="text-sm text-slate-300 transition hover:text-white">
            Return to site
          </Link>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
