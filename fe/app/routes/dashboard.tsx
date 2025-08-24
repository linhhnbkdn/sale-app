import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Web Sale" },
    { name: "description", content: "Your dashboard" },
  ];
}

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Web Sale Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user?.first_name || user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to your Dashboard
                </h2>
                <p className="text-gray-600">
                  You are successfully authenticated with JWT!
                </p>
                <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="text-sm text-green-700">
                    <strong>User Info:</strong><br />
                    Email: {user?.email}<br />
                    Username: {user?.username}<br />
                    {user?.first_name && <>First Name: {user.first_name}<br /></>}
                    {user?.last_name && <>Last Name: {user.last_name}<br /></>}
                    ID: {user?.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}