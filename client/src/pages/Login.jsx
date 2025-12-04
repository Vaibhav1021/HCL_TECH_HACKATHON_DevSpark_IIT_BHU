import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import AuthForm from '../components/AuthForm.jsx';

const Login = () => {
  const { login, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async ({ email, password }) => {
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user?.role === 'provider') {
        navigate('/dashboard/provider');
      } else {
        navigate('/dashboard/patient');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <div className="auth-logo-placeholder">
          <span>150 × 150</span>
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}
        <AuthForm mode="login" onSubmit={handleSubmit} loading={submitting} />
        <div className="auth-links">
          <div style={{ marginBottom: '0.5rem' }}>Forgot Password?</div>
          <div>
            New user?{' '}
            <Link to="/register">
              Register here
            </Link>
          </div>
        </div>
      </div>
      <div className="health-info-panel">
        <div className="portal-header-bar" style={{ borderRadius: '12px 12px 0 0', padding: '1rem 1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Healthcare Portal</h2>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', display: 'flex', gap: '1rem' }}>
            <span>Home</span>
            <span>Health Topics</span>
            <span>Services</span>
            <span>Contact</span>
          </div>
        </div>
        <div style={{ background: '#ffffff', borderRadius: '0 0 12px 12px', padding: '1.5rem 1.75rem' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.05rem', marginBottom: '1rem' }}>
            Latest Health Information
          </h3>
          <div className="health-info-card">
            <strong>COVID-19 Updates</strong>
            <p>Stay informed about the latest COVID-19 guidelines and vaccination information.</p>
            <button type="button">Read More</button>
          </div>
          <div className="health-info-card">
            <strong>Seasonal Flu Prevention</strong>
            <p>Learn about steps you can take to prevent the seasonal flu and when to get vaccinated.</p>
            <button type="button">Read More</button>
          </div>
          <div className="health-info-card">
            <strong>Mental Health Awareness</strong>
            <p>Explore resources and support options for maintaining good mental health.</p>
            <button type="button">Read More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



