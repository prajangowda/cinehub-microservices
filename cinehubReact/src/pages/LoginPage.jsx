import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(err.message || 'Unable to sign in. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Sign in</h1>
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
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-400"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-400"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
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
