import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.rides.getAll().then((r) => setRides(r.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">Rides</h1>
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="bg-white rounded border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">User</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Pickup → Drop</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Fare</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Driver</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((r) => (
                <tr key={r._id} className="border-b border-slate-100">
                  <td className="px-4 py-2 text-slate-800">{r.user?.name} ({r.user?.email})</td>
                  <td className="px-4 py-2 text-slate-600">{r.pickupLocation} → {r.dropLocation}</td>
                  <td className="px-4 py-2 text-slate-600">₹{r.fare}</td>
                  <td className="px-4 py-2 text-slate-600">{r.driver?.user?.name || '–'}</td>
                  <td className="px-4 py-2 text-slate-600">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rides.length === 0 && <p className="p-4 text-slate-500 text-center">No rides.</p>}
        </div>
      )}
    </div>
  );
}
