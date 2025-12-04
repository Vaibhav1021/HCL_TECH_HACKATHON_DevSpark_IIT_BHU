import { useMemo, useState } from 'react';

const GoalCard = ({ goal, onLog }) => {
  const [value, setValue] = useState('');
  const latestLog = goal.logs?.[goal.logs.length - 1];

  const percent = useMemo(() => {
    if (!latestLog || !goal.target) return 0;
    const raw = (latestLog.value / goal.target) * 100;
    return Math.max(0, Math.min(100, Math.round(raw)));
  }, [latestLog, goal.target]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    onLog(goal._id, Number(value));
    setValue('');
  };

  const title =
    goal.type === 'steps'
      ? 'Steps'
      : goal.type === 'water'
      ? 'Water'
      : goal.type === 'sleep'
      ? 'Sleep'
      : goal.type;

  return (
    <div className="goal-card text-sm">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            {latestLog ? latestLog.value : 0}/{goal.target} {goal.unit}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#6b7280' }}>
          <div>Now</div>
          <div style={{ marginTop: '0.15rem', height: '26px', width: '80px', borderRadius: '999px', background: '#e5e7eb' }} />
        </div>
      </div>
      <div className="goal-progress-bar" style={{ marginTop: '0.4rem' }}>
        <div className="goal-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#4b5563' }}>{percent}%</div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '80px',
            borderRadius: '999px',
            border: '1px solid #d1d5db',
            padding: '0.25rem 0.6rem',
            fontSize: '0.75rem',
          }}
          placeholder="Today"
        />
        <button
          type="submit"
          style={{
            borderRadius: '999px',
            border: 'none',
            padding: '0.25rem 0.8rem',
            fontSize: '0.75rem',
            background: '#2563eb',
            color: '#f9fafb',
          }}
        >
          Log
        </button>
      </form>
    </div>
  );
};

export default GoalCard;



