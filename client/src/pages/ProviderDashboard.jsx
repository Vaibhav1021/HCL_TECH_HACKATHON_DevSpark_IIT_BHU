import { useEffect, useState } from 'react';
import { api } from '../api.js';
import ProviderPatientCard from '../components/ProviderPatientCard.jsx';
import ReminderList from '../components/ReminderList.jsx';

const ProviderDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/provider/patients');
      setPatients(res.data.patients || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const loadPatientDetail = async (patient) => {
    setSelected(patient);
    setPatientDetail(null);
    try {
      setDetailLoading(true);
      const res = await api.get(`/provider/patients/${patient.id}`);
      setPatientDetail(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load patient details');
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  if (loading) return <div>Loading provider dashboard...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Provider dashboard</h1>
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-2">Assigned patients</h2>
          {patients.length === 0 && (
            <p className="text-sm text-slate-500">No assigned patients yet.</p>
          )}
          {patients.map((p) => (
            <ProviderPatientCard
              key={p.id}
              patient={p}
              onSelect={loadPatientDetail}
              isSelected={selected?.id === p.id}
            />
          ))}
        </div>
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Patient details</h2>
          {detailLoading && <p className="text-sm">Loading patient details...</p>}
          {!detailLoading && !patientDetail && (
            <p className="text-sm text-slate-500">Select a patient to view their details.</p>
          )}
          {patientDetail && (
            <div className="space-y-4">
              <div className="bg-white rounded shadow-sm p-4 text-sm">
                <p className="font-semibold">{patientDetail.name}</p>
                <p className="text-slate-600 text-xs mb-2">{patientDetail.email}</p>
                <p className="text-xs">
                  <span className="font-semibold">Allergies:</span>{' '}
                  {patientDetail.allergies || 'Not documented'}
                </p>
                <p className="text-xs">
                  <span className="font-semibold">Medications:</span>{' '}
                  {patientDetail.medications || 'Not documented'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">Goals</h3>
                <ul className="grid gap-2 md:grid-cols-2 text-xs">
                  {(patientDetail.goals || []).map((g) => (
                    <li key={g._id} className="bg-white rounded shadow-sm p-3">
                      <p className="font-semibold capitalize mb-1">{g.type}</p>
                      <p className="text-slate-700 mb-1">
                        Target: {g.target} {g.unit}
                      </p>
                      <p className="text-slate-500">
                        Logged entries: {g.logs ? g.logs.length : 0}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">Preventive reminders</h3>
                <ReminderList reminders={patientDetail.reminders || []} onComplete={() => {}} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;



