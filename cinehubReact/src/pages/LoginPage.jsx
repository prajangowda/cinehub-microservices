import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await signIn({ email, password });
      navigate('/');
    } catch (err) {
      console.log(err.response)
      setError(err.response.data.message|| 'Unable to sign in. Please try again.');
    }
  };

  return (
    <div className="cinehub-page space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">Welcome back</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Sign in</h1>
        <p className="mt-2 text-slate-400">Access your CineHub account.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <label className="block text-sm text-slate-300">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-2 w-full rounded-xl border border-slate-800 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <span className="relative mt-2 block">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-xl border border-slate-800 bg-[#111111] px-4 py-3 pr-12 text-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
        >
          Continue
        </button>
      </form>
      
      <p className="text-center text-sm text-slate-500">
        New here?{' '}
        <Link to="/register" className="text-brand-300 hover:text-brand-200">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
