import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';

export default function CarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    api.categories.getAll().then((r) => setCategories(r.data || []));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.cars.getOne(id).then((r) => {
      const c = r.data;
      setValue('name', c.name);
      setValue('brand', c.brand);
      setValue('model', c.model);
      setValue('year', c.year);
      setValue('category', c.category?._id || c.category);
      setValue('pricePerDay', c.pricePerDay);
      setValue('availability', c.availability);
      setValue('description', c.description || '');
    });
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    setError('');
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('brand', data.brand);
    formData.append('model', data.model);
    formData.append('year', data.year);
    formData.append('category', data.category);
    formData.append('pricePerDay', data.pricePerDay);
    formData.append('availability', data.availability);
    if (data.description) formData.append('description', data.description);
    if (imageFile) formData.append('image', imageFile);
    try {
      if (isEdit) await api.cars.update(id, formData);
      else await api.cars.create(formData);
      navigate('/cars');
    } catch (e) {
      setError(e.message || 'Failed');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">{isEdit ? 'Edit Car' : 'Add Car'}</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4 bg-white p-6 rounded border border-slate-200">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
          <input {...register('name', { required: 'Required' })} className="w-full border border-slate-300 rounded px-3 py-2" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
            <input {...register('brand', { required: 'Required' })} className="w-full border border-slate-300 rounded px-3 py-2" />
            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Model *</label>
            <input {...register('model', { required: 'Required' })} className="w-full border border-slate-300 rounded px-3 py-2" />
            {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Year *</label>
            <input type="number" {...register('year', { required: 'Required', valueAsNumber: true })} className="w-full border border-slate-300 rounded px-3 py-2" />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
            <select {...register('category', { required: 'Required' })} className="w-full border border-slate-300 rounded px-3 py-2">
              <option value="">Select</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price per day *</label>
            <input type="number" {...register('pricePerDay', { required: 'Required', valueAsNumber: true })} className="w-full border border-slate-300 rounded px-3 py-2" />
            {errors.pricePerDay && <p className="text-red-500 text-xs mt-1">{errors.pricePerDay.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
            <select {...register('availability')} className="w-full border border-slate-300 rounded px-3 py-2">
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded px-3 py-2" />
          {isEdit && <p className="text-xs text-slate-500 mt-1">Leave empty to keep current image.</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea {...register('description')} rows={3} className="w-full border border-slate-300 rounded px-3 py-2" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-slate-700 text-white px-4 py-2 rounded font-medium hover:bg-slate-800">Save</button>
          <button type="button" onClick={() => navigate('/cars')} className="bg-slate-200 text-slate-700 px-4 py-2 rounded font-medium hover:bg-slate-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}
