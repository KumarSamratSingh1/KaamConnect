import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, MessageCircle, CreditCard, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import EmptyState from '../../components/common/EmptyState';
import { fetchMyBookings } from '../../store/slices/bookingSlice';
import { BOOKING_STATUS_CONFIG, formatDate, formatCurrency } from '../../utils/helpers';

export default function CustomerBookings() {
  const dispatch = useDispatch();
  const { list: bookings, loading } = useSelector(s => s.bookings);
  const [filterTab, setFilterTab] = useState('all');

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter(b => {
    if (filterTab === 'active') return ['pending', 'accepted', 'in_progress'].includes(b.status);
    if (filterTab === 'completed') return b.status === 'completed';
    if (filterTab === 'cancelled') return ['cancelled', 'rejected'].includes(b.status);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Household Services
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mt-1">
              My Bookings & Schedules
            </h1>
          </div>

          <Link to="/search" className="btn-primary text-xs font-bold py-2.5 px-4 shadow-sm self-start sm:self-auto">
            Book New Helper
          </Link>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex gap-2 p-1 bg-stone-100 dark:bg-stone-900 rounded-2xl w-fit mb-6 border border-stone-200/60 dark:border-stone-800">
          {[
            { id: 'all', label: `All (${bookings.length})` },
            { id: 'active', label: 'Active Tasks' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === tab.id
                  ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400 text-sm">
            Loading your bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No bookings match your filter"
            description="Explore background-verified domestic workers in your city and book anytime."
            action={
              <Link to="/search" className="btn-primary text-xs font-bold">
                Find Help Now
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b, i) => {
              const cfg = BOOKING_STATUS_CONFIG[b.status] || {};
              return (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl shrink-0 shadow-inner">
                      {cfg.icon || '🛠️'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <p className="font-extrabold text-base text-stone-900 dark:text-white capitalize tracking-tight">
                          {b.primaryService || 'Domestic Service'}
                        </p>
                        <span className={`badge ${cfg.color || 'badge-amber'} text-xs font-bold`}>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">
                          ID: {b.bookingId || b._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 flex-wrap mt-2">
                        {b.worker?.name && (
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            Helper: {b.worker.name}
                          </span>
                        )}
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
                            {b.serviceLocation.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800 shrink-0">
                    {b.pricing?.totalAmount && (
                      <p className="font-extrabold text-lg text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(b.pricing.totalAmount)}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      {b.status === 'accepted' && (
                        <Link
                          to={`/payment/${b._id}`}
                          className="btn-primary text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
                        >
                          <CreditCard size={13} />
                          <span>Pay Now</span>
                        </Link>
                      )}

                      <Link
                        to={`/chat?booking=${b._id}`}
                        className="btn-outline text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <MessageCircle size={13} className="text-emerald-600" />
                        <span>Chat</span>
                      </Link>
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
