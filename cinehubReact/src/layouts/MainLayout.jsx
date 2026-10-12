import { useCallback } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Clapperboard } from "lucide-react";
import useAuth from "../hooks/useAuth.js";

function MainLayout() {
  const { user, signOut, isAdmin, isOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await signOut();
    navigate("/");
  }, [signOut, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-semibold text-white"
          >
            <Clapperboard className="h-6 w-6 text-brand-400" />
            CineHub
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 text-sm text-slate-300">

            <Link to="/" className="transition hover:text-white">
              Home
            </Link>

            <Link to="/movies" className="transition hover:text-white">
              Movies
            </Link>

            {/* Customer bookings */}
            {user && (
              <Link
                to="/my-bookings"
                className="transition hover:text-white"
              >
                My Bookings
              </Link>
            )}

            {/* Admin */}
            {isAdmin && (
              <Link to="/admin" className="transition hover:text-white">
                Admin
              </Link>
            )}

            {/* Theatre Owner */}
            {isOwner && (
              <Link to="/theatres" className="transition hover:text-white">
                Theatre Dashboard
              </Link>
            )}

            {user ? (
              <>
                {/* Register Theatre */}
                {!isOwner && (
                  <Link
                    to="/owner/request"
                    className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
                  >
                    Register Theatre
                  </Link>
                )}

                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 transition hover:border-brand-400 hover:text-white"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-300">
                    {String(
                      user?.name || user?.email || "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span className="max-w-[120px] truncate">
                    {user?.name || user?.email || "User"}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-slate-800 px-4 py-2 text-slate-200 transition hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-slate-800 px-4 py-2 text-slate-200 transition hover:bg-slate-700"
              >
                Sign In
              </Link>
            )}

          </nav>
        </div>
      </header>

      <main className="flex-1 bg-slate-950 px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/90 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CineHub. All rights reserved.
      </footer>
    </div>
  );
}

export default MainLayout;