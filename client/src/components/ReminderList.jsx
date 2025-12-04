const ReminderList = ({ reminders, onComplete }) => {
  if (!reminders?.length) {
    return <p className="text-sm text-slate-500">No preventive reminders yet.</p>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {reminders.map((r) => (
        <li
          key={r._id}
          className="bg-white rounded shadow-sm p-3 flex items-center justify-between gap-3"
        >
          <div>
            <p className="font-semibold">{r.title}</p>
            {r.description && <p className="text-slate-700 text-xs">{r.description}</p>}
            {r.dueDate && (
              <p className="text-xs text-slate-500">
                Due: {new Date(r.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs mb-1">
              Status:{' '}
              <span className={r.completed ? 'text-green-700' : 'text-amber-700'}>
                {r.completed ? 'Completed' : 'Pending'}
              </span>
            </p>
            {!r.completed && (
              <button
                onClick={() => onComplete(r._id)}
                className="text-xs px-2 py-1 border border-green-600 text-green-700 rounded hover:bg-green-50"
              >
                Mark done
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ReminderList;



