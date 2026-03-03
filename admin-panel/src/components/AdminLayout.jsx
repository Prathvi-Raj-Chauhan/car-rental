import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <span className="font-semibold text-slate-800">Admin</span>
        </div>
        <nav className="p-2 flex-1">
          <Link to="/" className="block px-3 py-2 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-800">Dashboard</Link>
          <Link to="/cars" className="block px-3 py-2 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-800">Cars</Link>
          <Link to="/categories" className="block px-3 py-2 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-800">Categories</Link>
          <Link to="/bookings" className="block px-3 py-2 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-800">Bookings</Link>
          <Link to="/drivers" className="block px-3 py-2 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-800">Drivers</Link>
          <Link to="/rides" className="block px-3 py-2 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-800">Rides</Link>
          <Link to="/users" className="block px-3 py-2 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-800">Users</Link>
        </nav>
        <div className="p-2 border-t border-slate-200">
          <span className="block px-3 py-2 text-sm text-slate-500">{user?.email}</span>
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-3 py-2 rounded text-slate-600 hover:bg-slate-100">Logout</button>
        </div>
      </aside>
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
