import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import CarForm from './pages/CarForm';
import Categories from './pages/Categories';
import Bookings from './pages/Bookings';
import Drivers from './pages/Drivers';
import Rides from './pages/Rides';
import Users from './pages/Users';

function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-600">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
        <Route index element={<Dashboard />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/new" element={<CarForm />} />
        <Route path="cars/:id/edit" element={<CarForm />} />
        <Route path="categories" element={<Categories />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="rides" element={<Rides />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
