import { useEffect, useState } from 'react';
import { api } from '../api.js';
import GoalCard from '../components/GoalCard.jsx';
import ReminderList from '../components/ReminderList.jsx';

const PatientDashboard = () => {
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patient/dashboard');
      setGoals(res.data.goals || []);
      setReminders(res.data.reminders || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLog = async (goalId, value) => {
    try {
      await api.post(`/patient/goals/${goalId}/log`, { value });
      await loadDashboard();
    } catch (err) {
      console.error(err);
      setError('Failed to log goal');
    }
  };

  const handleCompleteReminder = async (reminderId) => {
    try {
      await api.post(`/patient/reminders/${reminderId}/complete`);
      await loadDashboard();
    } catch (err) {
      console.error(err);
      setError('Failed to update reminder');
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <div className="dashboard-shell">
        <section>
          <h2 className="text-lg font-semibold mb-2">Wellness Goals</h2>
          <div className="space-y-3">
            {goals.map((g) => (
              <GoalCard key={g._id} goal={g} onLog={handleLog} />
            ))}
          </div>
          <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#6b7280' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Health Tip of the Day</h3>
            <p>Stay hydrated! Aim to drink at least 8 glasses of water per day.</p>
          </div>
        </section>
        <aside>
          <div className="dashboard-side-card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="text-lg font-semibold mb-2">Preventive Care Reminders</h2>
            <ReminderList reminders={reminders} onComplete={handleCompleteReminder} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PatientDashboard;



