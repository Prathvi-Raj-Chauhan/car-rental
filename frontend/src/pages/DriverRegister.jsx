import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';

export default function DriverRegister() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await api.drivers.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        licenseNumber: data.licenseNumber,
        vehicleType: data.vehicleType,
        vehicleNumber: data.vehicleNumber,
      });
      localStorage.setItem('token', res.token);
      navigate('/driver/dashboard');
      window.location.reload();
    } catch (e) {
      setError(e.message || 'Registration failed');
    }
  };

  return (
    <div className="bg-page min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-jet-black mb-2">Driver registration</h1>
          <p className="text-slate-600 text-sm mb-6">Register as a cab driver. Admin will verify your profile.</p>
          {error && <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Name *</label>
              <input {...register('name', { required: 'Required' })} className="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="Your name" />
              {errors.name && <p className="text-burnt-peach text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Email *</label>
              <input type="email" {...register('email', { required: 'Required' })} className="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="you@example.com" />
              {errors.email && <p className="text-burnt-peach text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Password *</label>
              <input type="password" {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} className="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="••••••••" />
              {errors.password && <p className="text-burnt-peach text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Phone</label>
              <input type="tel" {...register('phone')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="+91 ..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">License number *</label>
              <input {...register('licenseNumber', { required: 'Required' })} className="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="DL number" />
              {errors.licenseNumber && <p className="text-burnt-peach text-xs mt-1">{errors.licenseNumber.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Vehicle type *</label>
              <input {...register('vehicleType', { required: 'Required' })} className="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="e.g. Sedan" />
              {errors.vehicleType && <p className="text-burnt-peach text-xs mt-1">{errors.vehicleType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Vehicle number *</label>
              <input {...register('vehicleNumber', { required: 'Required' })} className="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="MH 12 AB 1234" />
              {errors.vehicleNumber && <p className="text-burnt-peach text-xs mt-1">{errors.vehicleNumber.message}</p>}
            </div>
            <button type="submit" className="w-full bg-dusk-blue text-white py-3 rounded-lg font-medium hover:bg-dusk-blue/90 transition mt-2">
              Register as driver
            </button>
          </form>
          <p className="mt-6 text-center text-slate-600 text-sm">
            Already have an account? <Link to="/login" className="text-burnt-peach font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
