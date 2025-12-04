import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import AuthForm from '../components/AuthForm.jsx';

const Register = () => {
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (form) => {
    setSubmitting(true);
    setError('');
    try {
      await register(form);
      // Redirect based on role
      if (form.role === 'provider') {
        navigate('/dashboard/provider');
      } else {
        navigate('/dashboard/patient');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {error && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
      <AuthForm mode="register" onSubmit={handleSubmit} loading={submitting} />
    </div>
  );
};

export default Register;



