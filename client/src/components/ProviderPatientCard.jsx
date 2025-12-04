const statusColor = (status) => {
  if (status === 'Missed Preventive Checkup') return 'text-red-700';
  if (status === 'No Recent Activity') return 'text-amber-700';
  return 'text-green-700';
};

const ProviderPatientCard = ({ patient, onSelect, isSelected }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(patient)}
      className={`w-full text-left bg-white border rounded p-3 text-sm mb-2 hover:border-blue-500 ${
        isSelected ? 'border-blue-600 ring-1 ring-blue-200' : 'border-slate-200'
      }`}
    >
      <p className="font-semibold">{patient.name}</p>
      <p className="text-xs text-slate-600 mb-1">{patient.email}</p>
      <p className={`text-xs font-medium ${statusColor(patient.status)}`}>
        Status: {patient.status}
      </p>
    </button>
  );
};

export default ProviderPatientCard;



