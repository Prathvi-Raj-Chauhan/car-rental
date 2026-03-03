import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const load = () => api.categories.getAll().then((r) => setCategories(r.data || [])).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (data) => {
    setError('');
    try {
      await api.categories.create(data);
      reset();
      load();
    } catch (e) {
      setError(e.message || 'Failed');
    }
  };

  const deleteCat = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.categories.delete(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">Categories</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded border border-slate-200 p-6">
          <h2 className="font-medium text-slate-700 mb-4">Add category</h2>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input {...register('name', { required: 'Required' })} className="w-full border border-slate-300 rounded px-3 py-2" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input {...register('description')} className="w-full border border-slate-300 rounded px-3 py-2" />
            </div>
            <button type="submit" className="bg-slate-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800">Add</button>
          </form>
        </div>
        <div className="bg-white rounded border border-slate-200 overflow-hidden">
          <h2 className="font-medium text-slate-700 p-4 border-b border-slate-200">List</h2>
          {loading ? (
            <p className="p-4 text-slate-500">Loading...</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {categories.map((c) => (
                <li key={c._id} className="px-4 py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-slate-800">{c.name}</span>
                    {c.description && <p className="text-sm text-slate-500">{c.description}</p>}
                  </div>
                  <button onClick={() => deleteCat(c._id, c.name)} className="text-red-600 hover:underline text-sm">Delete</button>
                </li>
              ))}
            </ul>
          )}
          {!loading && categories.length === 0 && <p className="p-4 text-slate-500">No categories.</p>}
        </div>
      </div>
    </div>
  );
}
