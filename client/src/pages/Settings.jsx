import { useAuth } from '../AuthContext.jsx';

const Settings = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-2xl font-bold">Account settings</h1>
      <div className="bg-white rounded shadow-md p-4 text-sm">
        <p className="mb-1">
          <span className="font-semibold">Signed in as:</span> {user?.name} ({user?.email})
        </p>
        <p className="mb-3">
          <span className="font-semibold">Role:</span> {user?.role}
        </p>
        <button
          onClick={logout}
          className="border border-red-600 text-red-700 hover:bg-red-50 text-sm font-medium px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;



