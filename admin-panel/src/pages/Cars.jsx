import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.cars.getAll().then((r) => setCars(r.data || [])).finally(() => setLoading(false));
  }, []);

  const deleteCar = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.cars.delete(id);
      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Cars</h1>
        <Link to="/cars/new" className="bg-slate-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800">Add Car</Link>
      </div>
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="bg-white rounded border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Image</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Name</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Brand / Model</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Price/day</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Status</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id} className="border-b border-slate-100">
                  <td className="px-4 py-2">
                    {car.image ? (
                      <img src={car.image} alt="" className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <span className="text-slate-400 text-xs">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium text-slate-800">{car.name}</td>
                  <td className="px-4 py-2 text-slate-600">{car.brand} · {car.model}</td>
                  <td className="px-4 py-2 text-slate-600">₹{car.pricePerDay}</td>
                  <td className="px-4 py-2 text-slate-600">{car.availability}</td>
                  <td className="px-4 py-2">
                    <Link to={'/cars/' + car._id + '/edit'} className="text-slate-600 hover:underline text-sm mr-2">Edit</Link>
                    <button onClick={() => deleteCar(car._id, car.name)} className="text-red-600 hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cars.length === 0 && <p className="p-4 text-slate-500 text-center">No cars yet.</p>}
        </div>
      )}
    </div>
  );
}
