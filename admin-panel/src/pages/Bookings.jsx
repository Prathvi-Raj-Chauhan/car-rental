import { useState, useEffect } from 'react';
import { api } from '../services/api';

const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.bookings.getAll().then((r) => setBookings(r.data || [])).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.bookings.updateStatus(id, status);
      setBookings((prev) => prev.map((b) => (b._id === id ? res.data : b)));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">Bookings</h1>
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="bg-white rounded border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Car</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Customer</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Dates</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Total</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-slate-100">
                  <td className="px-4 py-2 font-medium text-slate-800">{b.car?.name}</td>
                  <td className="px-4 py-2 text-slate-600">{b.user?.name} ({b.user?.email})</td>
                  <td className="px-4 py-2 text-slate-600">
                    {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-slate-600">₹{b.totalPrice}</td>
                  <td className="px-4 py-2">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b._id, e.target.value)}
                      className="border border-slate-300 rounded px-2 py-1 text-sm"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p className="p-4 text-slate-500 text-center">No bookings.</p>}
        </div>
      )}
    </div>
  );
}
