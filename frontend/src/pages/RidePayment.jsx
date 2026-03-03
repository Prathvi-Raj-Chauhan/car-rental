import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';

export default function RidePayment() {
  const { id, rideId } = useParams();
  const effectiveRideId = id || rideId;
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    api.rides.getOne(effectiveRideId).then((res) => setRide(res.data)).catch(() => setRide(null));
  }, [effectiveRideId]);

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await api.payments.create({
        rideId: effectiveRideId,
        amount: ride.fare,
        method: data.method,
        transactionId: data.transactionId || undefined,
      });
      navigate('/receipt/' + res.data._id);
    } catch (e) {
      setError(e.message || 'Payment failed');
    }
  };

  if (!effectiveRideId) {
    return <div className="p-4 text-red-600">Invalid ride id.</div>;
  }

  if (!ride) return <div className="bg-page min-h-[60vh] flex items-center justify-center"><span className="text-dusk-blue">Loading...</span></div>;
  if (ride.status !== 'completed') {
    return (
      <div className="bg-page min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-600">Ride must be completed before payment.</p>
      </div>
    );
  }

  return (
    <div className="bg-page min-h-[60vh] py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-6">
          <h1 className="text-xl font-semibold text-jet-black mb-2">Pay for ride</h1>
          <p className="text-slate-600 mb-6">Amount: ₹{ride.fare}</p>
          {error && <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Payment method</label>
              <select {...register('method', { required: true })} className="w-full border border-slate-300 rounded-lg px-3 py-2.5">
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Transaction ID (optional)</label>
              <input {...register('transactionId')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="e.g. TXN123" />
            </div>
            <button type="submit" className="w-full bg-dusk-blue text-white py-3 rounded-lg font-medium hover:bg-dusk-blue/90 transition">
              Confirm payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
