import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const statusLabels = {
  requested: 'Waiting for driver',
  accepted: 'Driver assigned',
  pickup: 'Driver at pickup',
  ongoing: 'Ride in progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.rides.getMy().then((res) => setRides(res.data || [])).finally(() => setLoading(false));
  }, []);

  const cancelRide = async (id) => {
    if (!window.confirm('Cancel this ride?')) return;
    try {
      await api.rides.updateStatus(id, 'cancelled');
      setRides((prev) => prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r)));
    } catch (e) {
      alert(e.message);
    }
  };

  const isRidePaid = (ride) => {
    const s = String(ride?.paymentStatus || ride?.payment?.status || '').toLowerCase();
    return ride?.isPaid === true || !!ride?.paidAt || ['paid', 'completed', 'success', 'succeeded'].includes(s);
  };

  const fetchRides = async () => {
    const res = await api.get("/rides/my");
    const payload = res?.data?.data ?? res?.data?.rides ?? [];
    setRides(Array.isArray(payload) ? payload : []);
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const canShowPayNow = (ride) => !isRidePaid(ride);

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
        <h1 className="text-2xl font-semibold text-jet-black mb-2">My rides</h1>
        <p className="text-slate-600 text-sm mb-8">Track and manage your cab bookings.</p>
        {rides.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-12 text-center">
            <p className="text-slate-600 mb-4">You have no rides yet.</p>
            <Link to="/book-cab" className="inline-flex items-center text-burnt-peach font-medium hover:underline">Book a cab →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-xl shadow-card border border-slate-200/80 p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-jet-black">{r.pickupLocation} → {r.dropLocation}</p>
                  <p className="text-sm text-slate-500 mt-0.5">₹{r.fare} · {statusLabels[r.status] || r.status}</p>
                  {r.driver?.user && (
                    <p className="text-sm text-dusk-blue mt-1">Driver: {r.driver.user.name} · {r.driver.user.phone}</p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <Link to={'/rides/' + r._id} className="text-dusk-blue font-medium text-sm hover:underline">Track</Link>
                  {['requested', 'accepted'].includes(r.status) && (
                    <button onClick={() => cancelRide(r._id)} className="text-red-600 text-sm font-medium hover:underline">Cancel</button>
                  )}
                  {r.status === 'completed' && canShowPayNow(r) && (
                    <button
                      type="button"
                      onClick={() => navigate(`/ride-payment/${r._id}`)}
                      className="btn btn-primary"
                    >
                      Pay Now
                    </button>
                  )}
                  {r.status === 'completed' && isRidePaid(r) && (
                    <span className="text-green-600 font-semibold">Paid</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
