import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import ProfileForm from '../components/ProfileForm.jsx';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);
      if (user?.role === 'patient') {
        const res = await api.get('/patient/profile');
        setProfile(res.data);
      } else {
        // For providers we reuse /auth/me
        const res = await api.get('/auth/me');
        setProfile(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (formData) => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      if (user?.role === 'patient') {
        const res = await api.put('/patient/profile', {
          name: formData.name,
          allergies: formData.allergies,
          medications: formData.medications,
        });
        setProfile(res.data);
      }
      setMessage('Profile updated successfully.');
    } catch (err) {
      console.error(err);
      setError('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>No profile data.</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      {message && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          {message}
        </div>
      )}
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
      <ProfileForm
        initial={{
          name: profile.name,
          email: profile.email,
          allergies: profile.allergies || '',
          medications: profile.medications || '',
        }}
        onSubmit={handleSave}
        submitting={saving}
      />
    </div>
  );
};

export default Profile;



