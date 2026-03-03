import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import CarCard from '../components/CarCard';

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || '';
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categoryFromUrl);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    setCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    api.categories.getAll().then((res) => setCategories(res.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    api.cars
      .getAll(params)
      .then((res) => setCars(res.data || []))
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="bg-page min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-jet-black mb-2">Browse vehicles</h1>
        <p className="text-slate-600 text-sm mb-8">Search and filter to find your match.</p>

        <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-4 md:p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <input
              type="text"
              placeholder="Search name, brand, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm placeholder:text-slate-400"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-700"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min ₹/day"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm placeholder:text-slate-400"
            />
            <input
              type="number"
              placeholder="Max ₹/day"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={clearFilters}
              className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><span className="text-dusk-blue">Loading...</span></div>
        ) : cars.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center text-slate-500">
            No vehicles found. Try different filters or <button type="button" onClick={clearFilters} className="text-burnt-peach font-medium hover:underline">clear filters</button>.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
