import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const CATEGORY_ICONS = {
  Bike: '🏍️',
  Bus: '🚌',
  HatchBack: '🚗',
  Luxury: '✨',
  Sedan: '🚙',
  Small: '🚕',
  Suv: '🚐',
  Truck: '🚚',
  Van: '🚐',
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories.getAll().then((res) => setCategories(res.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex justify-center">
        <span className="text-dusk-blue">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="bg-page min-h-[60vh]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-jet-black">Browse by category</h1>
          <p className="text-slate-600 mt-2 max-w-lg mx-auto">Find the right type of vehicle for your trip.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={'/cars?category=' + cat._id}
              className="group bg-white rounded-xl p-6 shadow-card border border-slate-200/80 hover:shadow-card-hover hover:border-powder-blue/50 transition-all duration-300 text-center"
            >
              <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform" role="img" aria-hidden>
                {CATEGORY_ICONS[cat.name] || '🚗'}
              </span>
              <h2 className="font-semibold text-jet-black group-hover:text-dusk-blue transition-colors">{cat.name}</h2>
              {cat.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{cat.description}</p>}
              <span className="inline-block mt-3 text-sm font-medium text-burnt-peach group-hover:underline">Browse →</span>
            </Link>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-center text-slate-500 py-12">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
