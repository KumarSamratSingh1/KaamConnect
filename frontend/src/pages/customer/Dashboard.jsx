import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Search, Calendar, Clock, Star, ArrowRight, Zap, Bell,
  ShieldCheck, Sparkles, UserCheck, ChevronRight
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import WorkerCard from '../../components/worker/WorkerCard';
import { fetchFeatured } from '../../store/slices/workerSlice';
import { fetchMyBookings } from '../../store/slices/bookingSlice';
import { SKILLS, BOOKING_STATUS_CONFIG, formatDate } from '../../utils/helpers';

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { featured } = useSelector(s => s.workers);
  const { list: bookings } = useSelector(s => s.bookings);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchMyBookings({ limit: 5 }));
  }, [dispatch]);

  const activeBooking = bookings.find(b => ['pending', 'accepted', 'in_progress'].includes(b.status));

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-8 flex-1">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase mb-2">
              <Sparkles size={13} className="text-emerald-600" /> Customer Portal
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              {greeting()}, {user?.name?.split(' ')[0] || 'Friend'}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Find verified domestic professionals, monitor ongoing tasks, and book home care.
            </p>
          </div>

          <Link
            to="/search"
            className="btn-primary text-xs font-bold py-2.5 px-5 shadow-sm shadow-emerald-600/20 shrink-0 self-start sm:self-auto"
          >
            <Search size={15} />
            <span>Search Helpers</span>
          </Link>
        </motion.div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              to: '/search',
              icon: Search,
              label: 'Find Verified Help',
              desc: 'Browse Aadhaar-screened helpers',
              gradient: 'from-emerald-700 to-teal-800',
              accent: 'bg-emerald-600/30',
            },
            {
              to: '/search?urgency=urgent',
              icon: Zap,
              label: 'Instant / Urgent Placement',
              desc: 'Rapid matching for urgent needs',
              gradient: 'from-amber-600 to-orange-700',
              accent: 'bg-amber-600/30',
            },
            {
              to: '/customer/bookings',
              icon: Calendar,
              label: 'Booking History',
              desc: `${bookings.length} assignments scheduled`,
              gradient: 'from-stone-800 to-stone-900',
              accent: 'bg-stone-700/40',
            },
          ].map((action, i) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={action.to}
                className={`block p-6 rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${action.accent} flex items-center justify-center`}>
                    <action.icon size={20} />
                  </div>
                  <ArrowRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="font-extrabold text-base tracking-tight mb-1">{action.label}</p>
                <p className="text-xs text-stone-200/90 font-medium">{action.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Active Booking Live Banner */}
        {activeBooking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-5 mb-8 border-l-4 border-l-emerald-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/40 dark:bg-emerald-950/20"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Bell size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-stone-900 dark:text-white text-sm">Active Booking in Progress</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                    Live
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {BOOKING_STATUS_CONFIG[activeBooking.status]?.icon} {BOOKING_STATUS_CONFIG[activeBooking.status]?.label} · Scheduled for {formatDate(activeBooking.scheduledDate || activeBooking.createdAt)}
                </p>
              </div>
            </div>
            <Link
              to="/customer/bookings"
              className="btn-secondary text-xs font-bold py-2 px-4 shrink-0"
            >
              <span>Track Schedule</span>
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}

        {/* Service Quick-Select Grid */}
        <div className="card p-6 mb-8 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
              What service are you looking for?
            </h2>
            <Link to="/search" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
            {SKILLS.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <Link
                  to={`/search?service=${skill.id}`}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-stone-100 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-all group text-center"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{skill.icon}</span>
                  <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 truncate max-w-full">
                    {skill.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Bookings & Timeline */}
        {bookings.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
                Your Recent Bookings
              </h2>
              <Link to="/customer/bookings" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View All Bookings →
              </Link>
            </div>

            <div className="space-y-3">
              {bookings.slice(0, 3).map((b) => {
                const cfg = BOOKING_STATUS_CONFIG[b.status] || {};
                return (
                  <div
                    key={b._id}
                    className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-stone-200/80 dark:border-stone-800"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-lg shrink-0">
                        {cfg.icon || '📅'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900 dark:text-white capitalize">
                          {b.primaryService || 'Domestic Service'}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-0.5">
                          <Clock size={12} />
                          <span>Scheduled: {formatDate(b.scheduledDate || b.createdAt)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className={`badge ${cfg.color || 'badge-amber'} font-semibold text-xs`}>
                        {cfg.label || b.status}
                      </span>
                      <Link
                        to="/customer/bookings"
                        className="btn-ghost text-xs font-bold py-1.5 px-3"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top-Rated Verified Workers Near You */}
        {featured.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
                  Top-Rated Domestic Pros Near You
                </h2>
                <p className="text-xs text-stone-500">Highest rated background-cleared professionals</p>
              </div>
              <Link
                to="/search"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.slice(0, 4).map((w, i) => (
                <WorkerCard key={w._id} worker={w} index={i} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
