import { Navigate, Route, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';
import { useAuth } from './AuthContext.jsx';
import Landing from './pages/Landing.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import ProviderDashboard from './pages/ProviderDashboard.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';

const RequireAuth = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="portal-shell">
      <header className="portal-header">
        <div className="portal-header-inner">
          <Link to="/" className="portal-header-brand">
            Wellness &amp; Preventive Care
          </Link>
          <nav className="portal-header-nav">
            {!user && (
              <>
                <Link to="/login">
                  Login
                </Link>
                <Link to="/register">
                  Register
                </Link>
              </>
            )}
            {user && (
              <>
                {user.role === 'patient' && (
                  <Link to="/dashboard/patient">
                    My Dashboard
                  </Link>
                )}
                {user.role === 'provider' && (
                  <Link to="/dashboard/provider">
                    Provider Dashboard
                  </Link>
                )}
                <Link to="/profile">
                  Profile
                </Link>
                <Link to="/settings">
                  Settings
                </Link>
                <button
                  onClick={logout}
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    border: '1px solid #d1d5db',
                    background: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="portal-main">{children}</main>
    </div>
  );
};

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/patient"
          element={
            <RequireAuth roles={['patient']}>
              <PatientDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/provider"
          element={
            <RequireAuth roles={['provider']}>
              <ProviderDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth roles={['patient', 'provider']}>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth roles={['patient', 'provider']}>
              <Settings />
            </RequireAuth>
          }
        />
      </Routes>
    </AppLayout>
  );
}

export default App;
