import { useState } from 'react';
import { Input } from '../components/Input.jsx';
import { requestTheatreRole } from '../services/ownerService.js';

function RequestTheatrePage() {
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!businessName.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await requestTheatreRole({ businessName, phone, address, gstNumber });
      setSuccess('Your theatre request was submitted. The admin will review it shortly.');
      setBusinessName('');
      setPhone('');
      setAddress('');
      setGstNumber('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cinehub-page relative overflow-hidden rounded-3xl border border-[#303030] bg-[#111111] p-6 shadow-2xl shadow-black/40 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-700 via-brand-500 to-transparent" />
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">Partner with CineHub</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Register Theatre</h1>
        <p className="mt-2 text-slate-400">Request theatre owner access so an admin can approve your role.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="rounded-2xl bg-red-950/60 px-4 py-3 text-sm text-red-300">{error}</p>}
        {success && <p className="rounded-2xl bg-emerald-950/60 px-4 py-3 text-sm text-emerald-300">{success}</p>}

        <Input
          label="Business name"
          required
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          placeholder="Enter your theatre or business name"
        />

        <Input
          label="Phone"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Enter a contact phone number"
          type="tel"
        />

        <Input
          label="Address"
          required
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Enter your theatre address"
        />

        <Input
          label="GST number"
          value={gstNumber}
          onChange={(event) => setGstNumber(event.target.value)}
          placeholder="Enter your GST number (optional)"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
}

export default RequestTheatrePage;
