import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';

const AdminLayout = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) return <Loader fullScreen />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex-shrink-0 p-4">
        <div className="mb-6">
          <span className="text-lg font-bold text-white">🎬 Cine<span className="text-red-500">Pass</span></span>
          <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
        </div>
        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass}>📊 Dashboard</NavLink>
          <NavLink to="/admin/movies" className={linkClass}>🎬 Movies</NavLink>
          <NavLink to="/admin/theaters" className={linkClass}>🏛️ Theaters</NavLink>
          <NavLink to="/admin/shows" className={linkClass}>🎟️ Shows</NavLink>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
