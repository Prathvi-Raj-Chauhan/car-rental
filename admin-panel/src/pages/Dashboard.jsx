import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ cars: 0, bookings: 0, users: 0, categories: 0 });

  useEffect(() => {
    Promise.all([
      api.cars.getAll().then((r) => r.data?.length ?? 0),
      api.bookings.getAll().then((r) => r.data?.length ?? 0),
      api.users.getAll().then((r) => r.data?.length ?? 0),
      api.categories.getAll().then((r) => r.data?.length ?? 0),
    ]).then(([cars, bookings, users, categories]) => setStats({ cars, bookings, users, categories }));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-slate-500 text-sm">Cars</p>
          <p className="text-2xl font-semibold text-slate-800">{stats.cars}</p>
          <Link to="/cars" className="text-sm text-slate-600 hover:underline">View</Link>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-slate-500 text-sm">Bookings</p>
          <p className="text-2xl font-semibold text-slate-800">{stats.bookings}</p>
          <Link to="/bookings" className="text-sm text-slate-600 hover:underline">View</Link>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-slate-500 text-sm">Users</p>
          <p className="text-2xl font-semibold text-slate-800">{stats.users}</p>
          <Link to="/users" className="text-sm text-slate-600 hover:underline">View</Link>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-slate-500 text-sm">Categories</p>
          <p className="text-2xl font-semibold text-slate-800">{stats.categories}</p>
          <Link to="/categories" className="text-sm text-slate-600 hover:underline">View</Link>
        </div>
      </div>
    </div>
  );
}
