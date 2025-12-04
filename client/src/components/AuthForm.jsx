import { useState } from 'react';

export const AuthForm = ({ mode, onSubmit, loading = false }) => {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    consentGiven: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-md p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-2 text-center">
        {isRegister ? 'Create your account' : 'Sign in'}
      </h2>
      {isRegister && (
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full border rounded px-3 py-2"
            value={form.name}
            onChange={handleChange}
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full border rounded px-3 py-2"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          name="password"
          type="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          required
          className="w-full border rounded px-3 py-2"
          value={form.password}
          onChange={handleChange}
        />
      </div>
      {isRegister && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Register as</label>
            <select
              name="role"
              className="w-full border rounded px-3 py-2"
              value={form.role}
              onChange={handleChange}
            >
              <option value="patient">Patient</option>
              <option value="provider">Provider</option>
            </select>
          </div>
          <div className="flex items-start gap-2">
            <input
              id="consent"
              name="consentGiven"
              type="checkbox"
              required
              checked={form.consentGiven}
              onChange={handleChange}
              className="mt-1"
            />
            <label htmlFor="consent" className="text-xs text-gray-700">
              I consent to the processing of my health and wellness data for the purposes of care
              coordination and preventive reminders.
            </label>
          </div>
        </>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded mt-2 disabled:opacity-60"
      >
        {loading ? 'Submitting...' : isRegister ? 'Create account' : 'Sign in'}
      </button>
    </form>
  );
};

export default AuthForm;

