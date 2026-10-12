import { useAuth } from '../hooks/useAuth.js';

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
      <h1 className="text-3xl font-semibold text-white">Your Profile</h1>
      <p className="mt-3 text-slate-400">Manage your account and bookings.</p>
      <div className="mt-6 space-y-4">
        <div className="rounded-3xl bg-slate-950/70 p-5 text-slate-200">
          <p className="text-sm text-slate-400">Name</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.name || 'Guest'}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/70 p-5 text-slate-200">
          <p className="text-sm text-slate-400">Email</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.email || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
