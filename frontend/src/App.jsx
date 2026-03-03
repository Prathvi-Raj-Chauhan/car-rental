import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import BookCab from './pages/BookCab';
import MyRides from './pages/MyRides';
import RideDetail from './pages/RideDetail';
import RidePayment from './pages/RidePayment';
import Receipt from './pages/Receipt';
import DriverRegister from './pages/DriverRegister';
import DriverDashboard from './pages/DriverDashboard';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-page flex items-center justify-center"><span className="text-dusk-blue">Loading...</span></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function ProtectedDriver({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-page flex items-center justify-center"><span className="text-dusk-blue">Loading...</span></div>;
  if (!user || user.role !== 'driver') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="categories" element={<Categories />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/:id" element={<CarDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="driver/register" element={<DriverRegister />} />
        <Route path="driver/dashboard" element={<ProtectedDriver><DriverDashboard /></ProtectedDriver>} />
        <Route path="book-cab" element={<ProtectedRoute><BookCab /></ProtectedRoute>} />
        <Route path="rides" element={<ProtectedRoute><MyRides /></ProtectedRoute>} />
        <Route path="rides/:id" element={<ProtectedRoute><RideDetail /></ProtectedRoute>} />
        <Route path="rides/:id/pay" element={<ProtectedRoute><RidePayment /></ProtectedRoute>} />
        <Route path="receipt/:id" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
        <Route path="bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="cars/:id/book" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/ride-payment/:id" element={<RidePayment />} />
        <Route path="/ride-payment/:rideId" element={<RidePayment />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
