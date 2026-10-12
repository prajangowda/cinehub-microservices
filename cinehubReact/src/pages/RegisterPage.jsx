import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { extractUser, isAdminUser } from '../auth/AuthContext.jsx';
import { verifyOtp, resendOtp, getCurrentUser } from '../api/authApi.js';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpPhase, setOtpPhase] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendMessage, setResendMessage] = useState(null);
  const { signUp, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    // client-side validation
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    let navigated = false;

    try {
      const data = await signUp({ email, password, name });
      console.debug('RegisterPage signUp result:', data);

      if (data?.otpRequired) {
        setOtpPhase(true);
        // stop the loading state so the OTP form can be interacted with
        setIsSubmitting(false);
        return;
      }

      const maybeUser = extractUser(data);
      if (!maybeUser) {
        setError('Signup failed. Please try again.');
        return;
      }

      const isAdmin = isAdminUser(maybeUser);
      navigated = true;
      navigate(isAdmin ? '/admin' : '/');
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      if (!navigated) {
        setIsSubmitting(false);
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    // basic OTP validation
    if (!otpCode || otpCode.trim().length < 4) {
      setError('Please enter the OTP sent to your email.');
      return;
    }
    try {
      await verifyOtp({ email, otp: otpCode });
      // fetch current user and set in context
      const response = await getCurrentUser();
      const user = response?.user ?? response?.data ?? response ?? null;
      setUser(user);
      const isAdmin = isAdminUser(user);
      navigate(isAdmin ? '/admin' : '/');
    } catch (err) {
      setError(err.message || 'OTP verification failed.');
    }
  };

  const handleResend = async () => {
    setResendMessage(null);
    try {
      await resendOtp(email);
      setResendMessage('OTP resent. Check your email.');
    } catch (err) {
      setResendMessage('Failed to resend OTP.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Create account</h1>
        <p className="mt-2 text-slate-400">Join CineHub to start booking instantly.</p>
      </div>
      {!otpPhase ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <label className="block text-sm text-slate-300">
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-400"
            />
          </label>
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
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Sending OTP...' : 'Register'}
          </button>
          {isSubmitting && (
            <p className="text-sm text-slate-300">Sending OTP to your email. Please check your inbox.</p>
          )}
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4 mt-4">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <p className="text-sm text-slate-300">Enter the OTP sent to your email.</p>
          <label className="block text-sm text-slate-300">
            OTP
            <input
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              type="text"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand-400"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Resend
            </button>
          </div>
          {resendMessage && <p className="text-xs text-slate-400">{resendMessage}</p>}
        </form>
      )}
      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-300 hover:text-brand-200">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
