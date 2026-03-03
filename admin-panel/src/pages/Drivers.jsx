import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.drivers.getAll().then((r) => setDrivers(r.data || [])).finally(() => setLoading(false));
  }, []);

  const verify = async (id) => {
    try {
      await api.drivers.verify(id);
      setDrivers((prev) => prev.map((d) => (d._id === id ? { ...d, verified: true } : d)));
    } catch (e) {
      alert(e.message);
    }
  };

  const reject = async (id) => {
    try {
      await api.drivers.reject(id);
      setDrivers((prev) => prev.map((d) => (d._id === id ? { ...d, verified: false } : d)));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">Drivers</h1>
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="bg-white rounded border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Name</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Email</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">License</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Vehicle</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Verified</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d._id} className="border-b border-slate-100">
                  <td className="px-4 py-2 font-medium text-slate-800">{d.user?.name}</td>
                  <td className="px-4 py-2 text-slate-600">{d.user?.email}</td>
                  <td className="px-4 py-2 text-slate-600">{d.licenseNumber}</td>
                  <td className="px-4 py-2 text-slate-600">{d.vehicleType} · {d.vehicleNumber}</td>
                  <td className="px-4 py-2 text-slate-600">{d.verified ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">
                    {!d.verified ? (
                      <button onClick={() => verify(d._id)} className="text-green-600 hover:underline text-sm mr-2">Verify</button>
                    ) : (
                      <button onClick={() => reject(d._id)} className="text-amber-600 hover:underline text-sm">Unverify</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {drivers.length === 0 && <p className="p-4 text-slate-500 text-center">No drivers.</p>}
        </div>
      )}
    </div>
  );
}
