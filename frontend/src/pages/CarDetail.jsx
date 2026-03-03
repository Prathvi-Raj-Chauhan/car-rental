import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_BASE = '';

function CarPlaceholder() {
  return (
    <div className="w-full h-full min-h-[320px] bg-gradient-to-br from-dusk-blue/15 to-powder-blue/25 flex items-center justify-center">
      <svg className="w-20 h-20 text-dusk-blue/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-8 4h8m-3-8v16m-4 0V7m4 0v10" />
      </svg>
    </div>
  );
}

export default function CarDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.cars
      .getOne(id)
      .then((res) => setCar(res.data))
      .catch(() => setCar(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <span className="text-dusk-blue">Loading...</span>
      </div>
    );
  }
  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-4">Car not found.</p>
        <Link to="/cars" className="text-burnt-peach font-medium hover:underline">Back to cars</Link>
      </div>
    );
  }

  return (
    <div className="bg-page min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-card border border-slate-200/80 overflow-hidden">
          <div className="aspect-[16/10] bg-slate-100">
            {car.image ? (
              <img src={API_BASE + car.image} alt={car.name} className="w-full h-full object-cover" />
            ) : (
              <CarPlaceholder />
            )}
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {car.category && (
                <span className="text-xs font-medium text-powder-blue bg-powder-blue/10 px-2.5 py-1 rounded">{car.category.name}</span>
              )}
              <span className="text-sm text-slate-500">{car.availability}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-jet-black">{car.name}</h1>
            <p className="text-slate-600 mt-1">{car.brand} · {car.model} · {car.year}</p>
            <p className="mt-4 text-slate-600 leading-relaxed">{car.description || 'No description.'}</p>
            <p className="mt-6 text-2xl font-semibold text-dusk-blue">₹{car.pricePerDay} <span className="text-base font-normal text-slate-500">per day</span></p>
            <div className="mt-8 flex flex-wrap gap-4">
              {user && car.availability === 'available' && (
                <Link
                  to={'/cars/' + car._id + '/book'}
                  className="inline-flex items-center bg-burnt-peach text-white px-6 py-3 rounded-lg font-medium hover:bg-burnt-peach/90 transition shadow-card"
                >
                  Book now
                </Link>
              )}
              {!user && (
                <p className="text-slate-600">
                  <Link to="/login" className="text-burnt-peach font-medium hover:underline">Login</Link> to book this car.
                </p>
              )}
              <Link to="/cars" className="inline-flex items-center text-slate-600 hover:text-dusk-blue transition text-sm font-medium">← Back to cars</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
