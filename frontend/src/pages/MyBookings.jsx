import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  completed: 'bg-slate-100 text-slate-700 border-slate-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.bookings.getMy().then((res) => setBookings(res.data || [])).finally(() => setLoading(false));
  }, []);

  const cancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.bookings.cancel(bookingId);
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b)));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-page min-h-[60vh] flex items-center justify-center">
        <span className="text-dusk-blue">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-page min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-jet-black mb-2">My Bookings</h1>
        <p className="text-slate-600 text-sm mb-8">View and manage your reservations.</p>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-12 text-center">
            <p className="text-slate-600 mb-4">You have no bookings yet.</p>
            <Link to="/cars" className="inline-flex items-center text-burnt-peach font-medium hover:underline">Browse cars →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl shadow-card border border-slate-200/80 p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-jet-black">{b.car?.name}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-dusk-blue font-medium mt-2">₹{b.totalPrice} total</p>
                  <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded border ${statusStyles[b.status] || 'bg-slate-50 text-slate-700'}`}>
                    {b.status}
                  </span>
                </div>
                {['pending', 'confirmed'].includes(b.status) && (
                  <button
                    onClick={() => cancel(b._id)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
