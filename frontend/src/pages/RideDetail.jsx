import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useNavigate } from "react-router-dom";

const STEPS = ['requested', 'accepted', 'pickup', 'ongoing', 'completed'];
const statusLabels = {
  requested: 'Requested',
  accepted: 'Driver assigned',
  pickup: 'At pickup',
  ongoing: 'On the way',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function RideDetail() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.rides.getOne(id).then((res) => setRide(res.data)).catch(() => setRide(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-page min-h-[60vh] flex items-center justify-center">
        <span className="text-dusk-blue">Loading...</span>
      </div>
    );
  }
  if (!ride) {
    return (
      <div className="bg-page min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-600">Ride not found.</p>
        <Link to="/rides" className="ml-2 text-burnt-peach font-medium">My rides</Link>
      </div>
    );
  }

  const isRidePaid = (ride) => {
    const s = String(ride?.paymentStatus || ride?.payment?.status || '').toLowerCase();
    return ride?.isPaid === true || !!ride?.paidAt || ['paid', 'completed', 'success', 'succeeded'].includes(s);
  };

  const fetchRide = async () => {
    const res = await api.get(`/rides/${id}`);
    const payload = res?.data?.data ?? res?.data?.ride ?? null;
    setRide(payload);
  };

  fetchRide();

  const currentIndex = STEPS.indexOf(ride.status);

  return (
    <div className="bg-page min-h-[60vh] py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-6">
          <h1 className="text-xl font-semibold text-jet-black mb-6">Ride tracking</h1>
          <div className="space-y-4 mb-8">
            <p><span className="text-slate-500">Pickup:</span> {ride.pickupLocation}</p>
            <p><span className="text-slate-500">Drop:</span> {ride.dropLocation}</p>
            <p><span className="text-slate-500">Fare:</span> ₹{ride.fare}</p>
            <p><span className="text-slate-500">Status:</span> {statusLabels[ride.status]}</p>
            {ride.driver?.user && (
              <p><span className="text-slate-500">Driver:</span> {ride.driver.user.name} · {ride.driver.user.phone}</p>
            )}
          </div>
          {/* Status steps */}
          <div className="border-l-2 border-powder-blue/50 pl-4 space-y-4">
            {STEPS.map((step, i) => (
              <div key={step} className="relative">
                <span className={`block font-medium ${i <= currentIndex ? 'text-dusk-blue' : 'text-slate-400'}`}>
                  {statusLabels[step]}
                </span>
                {i < STEPS.length - 1 && <div className="absolute -left-[21px] top-5 w-0.5 h-4 bg-powder-blue/50" />}
              </div>
            ))}
          </div>
          {!isRidePaid(ride) && (
            <button
              type="button"
              onClick={() => navigate(`/ride-payment/${ride._id}`)}
              className="btn btn-primary"
            >
              Pay Now
            </button>
          )}
          {isRidePaid(ride) && (
            <Link to={'/rides/' + ride._id + '/pay'} className="mt-8 inline-block bg-burnt-peach text-white px-6 py-2 rounded-lg font-medium hover:opacity-90">
              Pay & get receipt
            </Link>
          )}
          <Link to="/rides" className="block mt-4 text-slate-600 hover:text-dusk-blue text-sm">← My rides</Link>
        </div>
      </div>
    </div>
  );
}
