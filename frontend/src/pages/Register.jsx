import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      });
      navigate('/cars');
    } catch (e) {
      setError(e.message || 'Registration failed');
    }
  };

  return (
    <div className="bg-page min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-jet-black mb-6">Register</h1>
          {error && <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-jet-black placeholder:text-slate-400"
                placeholder="Your name"
              />
              {errors.name && <p className="text-burnt-peach text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-jet-black placeholder:text-slate-400"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-burnt-peach text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-jet-black placeholder:text-slate-400"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-burnt-peach text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black mb-1.5">Phone <span className="text-slate-400">(optional)</span></label>
              <input type="tel" {...register('phone')} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-jet-black placeholder:text-slate-400" placeholder="+91 ..." />
            </div>
            <button type="submit" className="w-full bg-dusk-blue text-white py-3 rounded-lg font-medium hover:bg-dusk-blue/90 transition mt-2">
              Register
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
