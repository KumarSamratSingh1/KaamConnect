import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Lock, Mail, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { login } from '../../store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (login.fulfilled.match(res)) {
      const role = res.payload.user.role;
      navigate(role === 'worker' ? '/worker/dashboard' : role === 'admin' ? '/admin' : '/customer/dashboard');
    }
  };

  const setDemoUser = (role) => {
    if (role === 'customer') {
      setForm({ email: 'customer@demo.com', password: 'Demo@123456' });
    } else if (role === 'worker') {
      setForm({ email: 'worker@demo.com', password: 'Demo@123456' });
    } else if (role === 'admin') {
      setForm({ email: 'admin@kaamconnect.com', password: 'Admin@123456' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col lg:flex-row">
      {/* Left Branding Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 p-12 lg:p-16 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center font-extrabold text-xl">
              KC
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white block">KaamConnect</span>
              <span className="text-[11px] text-emerald-200 tracking-wide uppercase font-semibold">
                Your Home. Your Help. One Connection.
              </span>
            </div>
          </Link>
        </div>

        <div className="relative max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-emerald-100">
            <Sparkles size={13} />
            Verified Household Network
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back to dignified, trusted domestic help.
          </h1>
          <p className="text-emerald-100 text-base leading-relaxed">
            Manage your service schedules, verify real-time status with workers, and process transparent digital payments with complete peace of mind.
          </p>

          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 border border-white/10 text-xs">
              <ShieldCheck size={18} className="text-emerald-300 shrink-0" />
              <span>Aadhaar ID Verified</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 border border-white/10 text-xs">
              <CheckCircle2 size={18} className="text-emerald-300 shrink-0" />
              <span>Zero Brokerage Markups</span>
            </div>
          </div>
        </div>

        <div className="relative text-xs text-emerald-200/80">
          © {new Date().getFullYear()} KaamConnect Marketplace. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Top Brand Header */}
          <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                KC
              </div>
              <span className="font-extrabold text-xl text-stone-900 dark:text-white">KaamConnect</span>
            </Link>
            <Link to="/" className="text-xs font-bold text-emerald-600">Back Home →</Link>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-1.5">
            Sign In to KaamConnect
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6">
            Enter your credentials to access your dashboard.
          </p>

          {/* Quick-Fill Demo Credentials Tool for Fast Evaluation */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                1-Click Demo Fill
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">Click to populate</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoUser('customer')}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/60 transition-colors shadow-subtle"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('worker')}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/60 transition-colors shadow-subtle"
              >
                Worker
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('admin')}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/60 transition-colors shadow-subtle"
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
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
              className="btn-primary w-full py-3 text-sm font-bold shadow-md shadow-emerald-600/20 mt-2"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-stone-500 dark:text-stone-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Create a free account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
