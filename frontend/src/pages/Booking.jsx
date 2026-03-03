import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch } = useForm();
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    api.cars.getOne(id).then((res) => setCar(res.data)).catch(() => setCar(null));
  }, [id]);

  const getDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) || 0;
  };
  const days = getDays(startDate, endDate);
  const total = car ? days * car.pricePerDay : 0;

  const onSubmit = async (data) => {
    setError('');
    try {
      await api.bookings.create({
        carId: id,
        startDate: data.startDate,
        endDate: data.endDate,
      });
      navigate('/bookings');
    } catch (e) {
      setError(e.message || 'Booking failed');
    }
  };

  if (!car) {
    return (
      <div className="bg-page min-h-[60vh] flex items-center justify-center">
        <span className="text-dusk-blue">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-page min-h-[60vh] py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-6 md:p-8">
          <h1 className="text-xl font-semibold text-jet-black">Book: {car.name}</h1>
          <p className="text-slate-600 mt-1">₹{car.pricePerDay}/day</p>
          {error && <p className="text-red-600 text-sm mt-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Start date</label>
              <input
                type="date"
                {...register('startDate', { required: true })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">End date</label>
              <input
                type="date"
                {...register('endDate', { required: true })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
              />
            </div>
            {days > 0 && <p className="text-dusk-blue font-medium">Total: {days} day(s) · ₹{total}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-dusk-blue text-white py-3 rounded-lg font-medium hover:bg-dusk-blue/90 transition">
                Confirm booking
              </button>
              <Link to={'/cars/' + id} className="px-4 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
