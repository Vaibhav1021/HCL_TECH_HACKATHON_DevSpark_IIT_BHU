import { useState, useEffect } from 'react';

const ProfileForm = ({ initial, onSubmit, submitting }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    allergies: '',
    medications: '',
  });

  useEffect(() => {
    if (initial) {
      setForm((prev) => ({ ...prev, ...initial }));
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '1.5rem',
        background: '#ffffff',
        borderRadius: '14px',
        padding: '1.5rem 1.75rem',
        boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
        maxWidth: '720px',
      }}
    >
      <div style={{ display: 'grid', gap: '0.9rem' }}>
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            name="name"
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            disabled
            className="w-full border rounded px-3 py-2 text-sm bg-slate-100"
            value={form.email}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Allergies</label>
          <textarea
            name="allergies"
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.allergies}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Current medications</label>
          <textarea
            name="medications"
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.medications}
            onChange={handleChange}
          />
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', color: '#4b5563', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Profile summary
          </h3>
          <p style={{ marginBottom: '0.4rem' }}>
            Keep your allergy and medication information up to date so your care team has the right
            context when reviewing your wellness data.
          </p>
          <p>Email changes are managed by your provider to keep your record linked correctly.</p>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              borderRadius: '999px',
              border: 'none',
              padding: '0.45rem 1.5rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              background: '#2563eb',
              color: '#f9fafb',
              cursor: 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;



