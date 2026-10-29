import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle2, Play, Check, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import EmptyState from '../../components/common/EmptyState';
import { fetchMyBookings } from '../../store/slices/bookingSlice';
import { BOOKING_STATUS_CONFIG, formatDate, formatCurrency } from '../../utils/helpers';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function WorkerBookings() {
  const dispatch = useDispatch();
  const { list: bookings, loading } = useSelector(s => s.bookings);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/bookings/${id}/${action}`);
      toast.success(`Service status updated to ${action}!`);
      dispatch(fetchMyBookings());
    } catch (e) {
      toast.error('Failed to update job status.');
    }
  };

  const filtered = bookings.filter(b => {
    if (filter === 'active') return ['pending', 'accepted', 'in_progress'].includes(b.status);
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Domestic Tasks
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mt-1">
              My Job Assignments
            </h1>
          </div>

          <div className="flex gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700">
            {[
              { id: 'all', label: `All (${bookings.length})` },
              { id: 'active', label: 'Active Jobs' },
              { id: 'completed', label: 'Completed' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === tab.id
                    ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400 text-sm">
            Loading your job schedule...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="💼"
            title="No job assignments in this view"
            description="Keep your profile active and online to receive new customer requests."
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((b, i) => {
              const cfg = BOOKING_STATUS_CONFIG[b.status] || {};
              return (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl shrink-0 shadow-inner">
                      {cfg.icon || '🛠️'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <p className="font-extrabold text-base text-stone-900 dark:text-white capitalize">
                          {b.primaryService} Service
                        </p>
                        <span className={`badge ${cfg.color || 'badge-amber'} text-xs font-bold`}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">
                          #{b.bookingId || b._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 flex-wrap mt-2">
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          Customer: {b.customer?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-stone-400" />
                          {formatDate(b.scheduledDate || b.createdAt)}
                        </span>
                        {b.scheduledTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-stone-400" />
                            {b.scheduledTime}
                          </span>
                        )}
                        {b.serviceLocation?.city && (
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-stone-400" />
                            {b.serviceLocation.address ? `${b.serviceLocation.address}, ` : ''}{b.serviceLocation.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800 shrink-0">
                    {b.pricing?.basePrice && (
                      <p className="font-extrabold text-lg text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(b.pricing.basePrice)} <span className="text-xs text-stone-400 font-normal">earnings</span>
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      {b.status === 'accepted' && (
                        <button
                          onClick={() => handleAction(b._id, 'start')}
                          className="btn-primary text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
                        >
                          <Play size={12} className="fill-current" />
                          <span>Start Job (OTP)</span>
                        </button>
                      )}

                      {b.status === 'in_progress' && (
                        <button
                          onClick={() => handleAction(b._id, 'complete')}
                          className="btn-primary text-xs font-bold py-1.5 px-3 flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700"
                        >
                          <Check size={13} />
                          <span>Complete & Settle</span>
                        </button>
                      )}

                      {b.status === 'pending' && (
                        <>
                          <button
                            onClick={async () => {
                              await api.patch(`/bookings/${b._id}/respond`, { action: 'accept' });
                              dispatch(fetchMyBookings());
                              toast.success('Assignment accepted!');
                            }}
                            className="btn-primary text-xs font-bold py-1.5 px-3"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async () => {
                              await api.patch(`/bookings/${b._id}/respond`, { action: 'reject' });
                              dispatch(fetchMyBookings());
                            }}
                            className="btn-outline text-xs font-bold py-1.5 px-3 text-rose-600"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
