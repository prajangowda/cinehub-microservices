import { Link, Outlet } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark.jsx';

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#090909] text-slate-100">
      <div className="border-b border-[#292929] bg-[#090909]/95 px-4 py-4 shadow-lg shadow-black/20 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/admin" aria-label="CineHub admin dashboard" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">
            <BrandMark className="text-base sm:text-xl" iconClassName="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
          <Link to="/" className="text-sm text-slate-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">
            Return to site
          </Link>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
