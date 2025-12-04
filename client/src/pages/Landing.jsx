import { useState } from 'react';

const Landing = () => {
  const [activeTab, setActiveTab] = useState('daily');

  const renderTabContent = () => {
    if (activeTab === 'daily') {
      return (
        <>
          <h2 className="font-semibold mb-1">Daily habits</h2>
          <p className="text-slate-700">
            Log simple habits like steps, water, and sleep to build a picture of your wellness over
            time. Small, consistent actions add up to meaningful change.
          </p>
        </>
      );
    }
    if (activeTab === 'preventive') {
      return (
        <>
          <h2 className="font-semibold mb-1">Preventive reminders</h2>
          <p className="text-slate-700">
            Never miss your annual checkups and screenings. Get gentle reminders when important
            preventive care is coming due.
          </p>
        </>
      );
    }
    return (
      <>
        <h2 className="font-semibold mb-1">Provider view</h2>
        <p className="text-slate-700">
          Providers see a simple snapshot of which patients are on track, who has missed preventive
          checkups, and where outreach can have the most impact.
        </p>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold mb-2">Stay ahead with preventive care</h1>
        <p className="text-sm text-slate-700 max-w-2xl">
          This simple wellness portal helps patients track daily goals like steps, water, and sleep,
          and keeps preventive checkups on your radar. Providers can quickly see which patients
          might need a nudge.
        </p>
      </section>
      <section style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
        <button
          type="button"
          onClick={() => (window.location.href = '/register')}
          style={{
            borderRadius: '999px',
            padding: '0.5rem 1.5rem',
            border: 'none',
            background: '#2563eb',
            color: '#f9fafb',
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          Get started
        </button>
        <button
          type="button"
          onClick={() => (window.location.href = '/login')}
          style={{
            borderRadius: '999px',
            padding: '0.5rem 1.5rem',
            border: '1px solid #2563eb',
            background: '#ffffff',
            color: '#2563eb',
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          I already have an account
        </button>
      </section>

    </div>
  );
};

export default Landing;



