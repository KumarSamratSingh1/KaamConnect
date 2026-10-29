import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, User, Mail, Phone, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { register } from '../../store/slices/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { loading } = useSelector(s => s.auth);
  
  const initialRole = params.get('role') || (params.get('intent') === 'worker' ? 'worker' : 'customer');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: initialRole
  });
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (register.fulfilled.match(res)) {
      const role = res.payload.user.role;
      navigate(role === 'worker' ? '/worker/onboarding' : '/customer/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col justify-center items-center p-4 sm:p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Brand Header */}
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-600/20">
              KC
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-stone-900 dark:text-white block leading-tight">
                Kaam<span className="text-emerald-600 dark:text-emerald-400">Connect</span>
              </span>
              <span className="text-[10px] text-stone-600 dark:text-stone-300 font-semibold uppercase tracking-wider block">
                Your Home. Your Help. One Connection.
              </span>
            </div>
          </Link>
        </div>

        <div className="card p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Create Your KaamConnect Account
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Join verified households and certified domestic professionals across India.
            </p>
          </div>

          {/* Role Segmented Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 dark:bg-stone-800/80 rounded-2xl mb-6 border border-stone-200/60 dark:border-stone-700/60">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'customer' })}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                form.role === 'customer'
                  ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-sm border border-stone-200/60 dark:border-stone-700'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <span>🏠</span>
              <span>I Need Help</span>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'worker' })}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                form.role === 'worker'
                  ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-sm border border-stone-200/60 dark:border-stone-700'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <span>💼</span>
              <span>I Want to Work</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input pl-10"
                  placeholder="e.g. Priya Sharma"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input pl-10"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input pl-10"
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10"
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold shadow-md shadow-emerald-600/20 mt-3"
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-5 text-xs text-stone-500 dark:text-stone-400">
            Already registered on KaamConnect?{' '}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
