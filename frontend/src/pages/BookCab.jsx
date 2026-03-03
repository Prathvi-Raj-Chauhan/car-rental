import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';

export default function BookCab() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [estimatedFare, setEstimatedFare] = useState(null);
  const { register, handleSubmit, watch } = useForm();
  const distance = watch('estimatedDistance');

  const fetchFare = () => {
    const km = parseFloat(distance) || 5;
    api.rides.estimateFare({ estimatedDistance: km }).then((res) => setEstimatedFare(res.data));
  };

  const onSubmit = async (data) => {
    setError('');
    const fare = estimatedFare?.fare ?? 50 + (parseFloat(data.estimatedDistance) || 5) * 15;
    try {
      const res = await api.rides.create({
        pickupLocation: data.pickupLocation,
        dropLocation: data.dropLocation,
        fare: Math.round(fare),
        estimatedDistance: data.estimatedDistance ? parseFloat(data.estimatedDistance) : null,
      });
      navigate('/rides/' + res.data._id);
    } catch (e) {
      setError(e.message || 'Failed to request ride');
    }
  };

  const getTodayLocalYMD = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const todayMin = getTodayLocalYMD();

  return (
    <div className="bg-page min-h-[60vh] py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-jet-black mb-6">Book a cab</h1>
          {error && <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Pickup location</label>
              <input
                {...register('pickupLocation', { required: 'Required' })}
                placeholder="Enter pickup address"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Drop location</label>
              <input
                {...register('dropLocation', { required: 'Required' })}
                placeholder="Enter drop address"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Estimated distance (km)</label>
              <input
                type="number"
                step="0.1"
                {...register('estimatedDistance')}
                placeholder="e.g. 5"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                onBlur={fetchFare}
              />
              {estimatedFare && (
                <p className="mt-2 text-dusk-blue font-medium">Estimated fare: ₹{estimatedFare.fare}</p>
              )}
            </div>
            <button type="submit" className="w-full bg-dusk-blue text-white py-3 rounded-lg font-medium hover:bg-dusk-blue/90 transition mt-2">
              Request ride
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
