import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.users.getAll().then((r) => setUsers(r.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">Users</h1>
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="bg-white rounded border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Name</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Email</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Phone</th>
                <th className="px-4 py-2 text-sm font-medium text-slate-600">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-100">
                  <td className="px-4 py-2 font-medium text-slate-800">{u.name}</td>
                  <td className="px-4 py-2 text-slate-600">{u.email}</td>
                  <td className="px-4 py-2 text-slate-600">{u.phone || '–'}</td>
                  <td className="px-4 py-2 text-slate-600">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="p-4 text-slate-500 text-center">No users.</p>}
        </div>
      )}
    </div>
  );
}
