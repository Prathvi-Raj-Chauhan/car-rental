import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const statusLabels = {
  requested: 'Requested',
  accepted: 'Accepted',
  pickup: 'At pickup',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function DriverDashboard() {
  const [profile, setProfile] = useState(null);
  const [availableRides, setAvailableRides] = useState([]);
  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      api.drivers.getProfile().then((r) => setProfile(r.data)).catch(() => setProfile(null)),
      api.drivers.getAvailableRides().then((r) => setAvailableRides(r.data || [])).catch(() => setAvailableRides([])),
      api.drivers.getMyRides().then((r) => setMyRides(r.data || [])).catch(() => setMyRides([])),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const acceptRide = async (rideId) => {
    try {
      await api.rides.accept(rideId);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const updateStatus = async (rideId, status) => {
    try {
      await api.rides.updateStatus(rideId, status);
      load();
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

  if (!profile) {
    return (
      <div className="bg-page min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-600">Driver profile not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-page min-h-[60vh] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-6 mb-8">
          <h1 className="text-xl font-semibold text-jet-black mb-2">Driver dashboard</h1>
          <p className="text-slate-600 text-sm">Welcome, {profile.user?.name}</p>
          <p className="mt-2 text-sm">
            Status: <span className={profile.verified ? 'text-green-600 font-medium' : 'text-amber-600'}>
              {profile.verified ? 'Verified' : 'Pending verification'}
            </span>
          </p>
          {!profile.verified && <p className="text-slate-500 text-xs mt-1">Admin will verify your profile. You can accept rides once verified.</p>}
        </div>

        {profile.verified && availableRides.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-jet-black mb-4">Available rides</h2>
            <div className="space-y-3">
              {availableRides.map((r) => (
                <div key={r._id} className="bg-white rounded-xl shadow-card border border-slate-200/80 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-jet-black">{r.pickupLocation} → {r.dropLocation}</p>
                    <p className="text-sm text-slate-500">₹{r.fare} · {r.user?.phone}</p>
                  </div>
                  <button onClick={() => acceptRide(r._id)} className="bg-dusk-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-dusk-blue/90">
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-jet-black mb-4">My rides</h2>
          {myRides.length === 0 ? (
            <p className="text-slate-500 text-sm">No rides yet.</p>
          ) : (
            <div className="space-y-3">
              {myRides.map((r) => (
                <div key={r._id} className="bg-white rounded-xl shadow-card border border-slate-200/80 p-4">
                  <p className="font-medium text-jet-black">{r.pickupLocation} → {r.dropLocation}</p>
                  <p className="text-sm text-slate-500">₹{r.fare} · {r.user?.name} · {r.user?.phone}</p>
                  <p className="text-sm mt-1">{statusLabels[r.status]}</p>
                  {['accepted', 'pickup', 'ongoing'].includes(r.status) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {r.status === 'accepted' && <button onClick={() => updateStatus(r._id, 'pickup')} className="bg-powder-blue text-jet-black px-3 py-1.5 rounded text-sm">At pickup</button>}
                      {r.status === 'pickup' && <button onClick={() => updateStatus(r._id, 'ongoing')} className="bg-powder-blue text-jet-black px-3 py-1.5 rounded text-sm">Start ride</button>}
                      {r.status === 'ongoing' && <button onClick={() => updateStatus(r._id, 'completed')} className="bg-burnt-peach text-white px-3 py-1.5 rounded text-sm">Complete</button>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
