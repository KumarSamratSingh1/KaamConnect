import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Briefcase, CheckCircle2, Clock, TrendingUp, Bell, Zap,
  ShieldCheck, AlertCircle, ArrowRight
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { fetchMyBookings } from '../../store/slices/bookingSlice';
import { StatusBadge, VerifiedBadge } from '../../components/common/Badge';
import { BOOKING_STATUS_CONFIG, formatDate, formatCurrency } from '../../utils/helpers';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function WorkerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { workerProfile: profile } = useSelector(s => s.auth);
  const { list: bookings } = useSelector(s => s.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings({ limit: 10 }));
  }, [dispatch]);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const earnings = completedBookings.reduce((s, b) => s + (b.pricing?.basePrice || 0), 0);

  const toggleAvailability = async () => {
    const newStatus = profile?.availabilityStatus === 'available' ? 'offline' : 'available';
    try {
      await api.patch('/workers/availability', { status: newStatus });
      toast.success(`Availability updated to ${newStatus}`);
    } catch(e) {
      toast.error('Failed to update status');
    }
  };

  const STATS = [
    { label: 'Completed Jobs', value: completedBookings.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/60' },
    { label: 'Pending Requests', value: pendingBookings.length, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/60' },
    { label: 'Total Compensation', value: formatCurrency(earnings), icon: TrendingUp, color: 'text-emerald-700', bg: 'bg-emerald-50 dark:bg-emerald-950/60' },
    { label: 'Rating Score', value: `${(profile?.rating?.average || 4.9).toFixed(1)} ★`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/60' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-8 flex-1">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase mb-1.5">
              <ShieldCheck size={13} className="text-emerald-600" /> Professional Partner Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Namaste, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Manage your household assignments, earnings, and availability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {profile?.verificationStatus === 'verified' ? (
              <VerifiedBadge size="md" />
            ) : (
              <Link
                to="/worker/onboarding"
                className="btn-outline text-xs font-bold py-2 px-3 border-amber-300 text-amber-700 bg-amber-50/70 flex items-center gap-1.5"
              >
                <AlertCircle size={14} className="text-amber-600" />
                <span>Complete KYC</span>
              </Link>
            )}

            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                profile?.availabilityStatus === 'available'
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Zap size={14} className={profile?.availabilityStatus === 'available' ? 'fill-current' : ''} />
              <span>{profile?.availabilityStatus === 'available' ? 'Online & Available' : 'Go Online'}</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 border border-stone-200/80 dark:border-stone-800"
            >
              <div className={`w-11 h-11 ${s.bg} rounded-2xl flex items-center justify-center mb-3 shadow-inner`}>
                <s.icon size={20} className={s.color} />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                {s.value}
              </p>
              <p className="text-xs font-semibold text-stone-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Profile Completion Bar */}
        {(profile?.profileCompletion || 0) < 100 && (
          <div className="card p-5 mb-8 border-l-4 border-l-emerald-600 border border-stone-200/80 dark:border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                  Enhance Your Worker Profile
                </h3>
                <p className="text-xs text-stone-500">
                  Complete Aadhaar upload and skill verification to earn up to 40% higher bookings.
                </p>
              </div>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
                {profile?.profileCompletion || 70}%
              </span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 mb-3">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{ width: `${profile?.profileCompletion || 70}%` }}
              />
            </div>
            <Link
              to="/worker/onboarding"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Update KYC Documents & Experience Details</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Pending Booking Requests */}
        {pendingBookings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
                Pending Customer Requests ({pendingBookings.length})
              </h2>
            </div>

            <div className="space-y-3.5">
              {pendingBookings.map((b) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-5 border-l-4 border-l-amber-500 border border-stone-200/80 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-stone-900 dark:text-white capitalize">
                        {b.primaryService} Service ({b.type})
                      </p>
                      <span className="badge badge-amber text-[10px]">Action Required</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      Customer: <span className="font-semibold text-stone-900 dark:text-white">{b.customer?.name}</span> • Location: {b.serviceLocation?.city || 'Nearby'}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Scheduled: {formatDate(b.scheduledDate)} at {b.scheduledTime || '09:00 AM'}
                    </p>
                    {b.pricing?.totalAmount && (
                      <p className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm mt-1">
                        Compensation: {formatCurrency(b.pricing.totalAmount)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-auto">
                    <button
                      onClick={async () => {
                        await api.patch(`/bookings/${b._id}/respond`, { action: 'accept' });
                        dispatch(fetchMyBookings());
                        toast.success('Assignment accepted!');
                      }}
                      className="btn-primary text-xs font-bold py-2 px-4 shadow-sm"
                    >
                      Accept Assignment
                    </button>
                    <button
                      onClick={async () => {
                        await api.patch(`/bookings/${b._id}/respond`, { action: 'reject', reason: 'Unavailable' });
                        dispatch(fetchMyBookings());
                        toast.success('Assignment declined');
                      }}
                      className="btn-outline text-xs font-bold py-2 px-3 text-rose-600 hover:text-rose-700"
                    >
                      Decline
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Jobs History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
              Recent Job History
            </h2>
            <Link to="/worker/bookings" className="text-xs font-bold text-emerald-600 hover:underline">
              View All Jobs →
            </Link>
          </div>

          {bookings.filter(b => b.status !== 'pending').length === 0 ? (
            <div className="card p-10 text-center text-stone-400 text-xs">
              <Clock size={28} className="mx-auto mb-2 opacity-50" />
              <p>No past jobs logged yet. New requests will appear here once accepted.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.filter(b => b.status !== 'pending').slice(0, 5).map((b) => {
                const cfg = BOOKING_STATUS_CONFIG[b.status] || {};
                return (
                  <div
                    key={b._id}
                    className="card p-4 flex items-center justify-between gap-4 border border-stone-200/80 dark:border-stone-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-base shrink-0">
                        {cfg.icon || '🛠️'}
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 dark:text-white capitalize text-xs sm:text-sm">
                          {b.primaryService} Service
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {b.customer?.name} • {formatDate(b.scheduledDate || b.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`badge ${cfg.color || 'badge-amber'} text-[10px] font-bold block mb-1`}>
                        {cfg.label}
                      </span>
                      {b.pricing?.basePrice && (
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(b.pricing.basePrice)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
