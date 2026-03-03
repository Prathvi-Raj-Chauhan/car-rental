import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-jet-black text-white shadow-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-powder-blue hover:text-light-cyan transition">
          Car Rental
        </Link>
        <div className="flex items-center gap-1 md:gap-4">
          <Link to="/" className="px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition text-sm font-medium">Home</Link>
          <Link to="/cars" className="px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition text-sm font-medium">Cars</Link>
          <Link to="/categories" className="px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition text-sm font-medium">Categories</Link>
          {user ? (
            <>
              {user.role === 'driver' ? (
                <Link to="/driver/dashboard" className="px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition text-sm font-medium">Driver Dashboard</Link>
              ) : (
                <>
                  <Link to="/book-cab" className="px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition text-sm font-medium">Book Cab</Link>
                  <Link to="/rides" className="px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition text-sm font-medium">My Rides</Link>
                  <Link to="/bookings" className="px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition text-sm font-medium">My Bookings</Link>
                </>
              )}
              <span className="hidden sm:inline text-powder-blue/90 text-sm border-l border-white/20 pl-4 ml-1">{user.name}</span>
              <button onClick={handleLogout} className="bg-burnt-peach text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-burnt-peach/90 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-md text-slate-300 hover:text-white transition text-sm font-medium">Login</Link>
              <Link to="/register" className="px-3 py-2 rounded-md text-slate-300 hover:text-white transition text-sm font-medium">Register</Link>
              <Link to="/driver/register" className="bg-dusk-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-dusk-blue/90 transition">
                Drive with us
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
