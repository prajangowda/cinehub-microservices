import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp, getCurrentUser } from '../api/authApi.js';
import useAuth from '../hooks/useAuth.js';
import { isAdminUser } from '../auth/AuthContext.jsx';

function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const email = location.state?.email ?? '';
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState(null);
  const [resendMessage, setResendMessage] = useState(null);

  const handleVerify = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await verifyOtp({ email, otp: otpCode });
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
        <h1 className="text-3xl font-semibold text-white">Verify OTP</h1>
        <p className="mt-2 text-slate-400">Enter the code sent to {email || 'your email'}.</p>
      </div>
      <form onSubmit={handleVerify} className="space-y-4">
        {error && <p className="text-sm text-red-400">{error}</p>}
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
    </div>
  );
}

export default VerifyOtpPage;
