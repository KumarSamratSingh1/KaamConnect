import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  MapPin, Star, Briefcase, Phone, Clock, ShieldCheck,
  ArrowLeft, Zap, MessageCircle, Calendar, CheckCircle2, Award
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { fetchWorker } from '../../store/slices/workerSlice';
import { VerifiedBadge, StatusBadge } from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import { SKILLS, formatCurrency, formatDate, getInitials } from '../../utils/helpers';

export default function WorkerProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected, loading } = useSelector(s => s.workers);
  const { user: currentUser } = useSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    dispatch(fetchWorker(id));
  }, [dispatch, id]);

  if (loading || !selected) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col">
        <Navbar />
        <div className="page-container py-12 flex justify-center flex-1">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="skeleton h-64 rounded-3xl" />
            <div className="skeleton h-48 rounded-3xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { worker, profile, reviews } = selected;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-8 flex-1">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost text-xs font-bold flex items-center gap-1.5 mb-6 text-stone-600 dark:text-stone-400 hover:text-emerald-600"
        >
          <ArrowLeft size={15} />
          <span>Back to Browse</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-md"
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 border border-emerald-200/70 dark:border-emerald-800/70 flex items-center justify-center shadow-md">
                    {worker.profilePhoto?.url ? (
                      <img src={worker.profilePhoto.url} alt={worker.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-extrabold text-3xl text-emerald-800 dark:text-emerald-300">
                        {getInitials(worker.name)}
                      </span>
                    )}
                  </div>
                  {profile?.availabilityStatus === 'available' && (
                    <span
                      title="Available Now"
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white dark:border-stone-900 shadow-sm"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                        {worker.name}
                      </h1>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {profile?.verificationStatus === 'verified' && <VerifiedBadge size="md" />}
                        {profile?.availabilityStatus && <StatusBadge status={profile.availabilityStatus} />}
                      </div>
                    </div>

                    {profile?.expectedSalary?.min && (
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(profile.expectedSalary.min)}
                        </p>
                        <p className="text-xs text-stone-400">per {profile.expectedSalary.per || 'month'}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 flex-wrap">
                    <span className="flex items-center gap-1.5 font-bold">
                      <StarRating rating={profile?.rating?.average || 0} size={15} />
                      <span className="text-stone-900 dark:text-white font-extrabold">
                        {(profile?.rating?.average || 0).toFixed(1)}
                      </span>
                      <span className="text-stone-400 font-normal">({profile?.rating?.count || 0} reviews)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={14} className="text-stone-400" />
                      <span>{profile?.experience || 0} yrs experience</span>
                    </span>
                    {worker.location?.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-stone-400" />
                        <span>{worker.location.city}, {worker.location.state || 'India'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Pill Badges */}
              {profile?.skills?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                    Verified Capabilities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s) => {
                      const sk = SKILLS.find((sk) => sk.id === s);
                      return (
                        <span
                          key={s}
                          className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"
                        >
                          <span>{sk?.icon || '✦'}</span>
                          <span>{sk?.label || s}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Profile Navigation Tabs */}
            <div className="flex gap-2 border-b border-stone-200 dark:border-stone-800">
              {[
                { id: 'about', label: 'Overview & Bio' },
                { id: 'reviews', label: `Reviews (${reviews?.length || 0})` },
                { id: 'work_history', label: 'Work Details' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold tracking-tight transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                      : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: About */}
            {activeTab === 'about' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {profile?.experienceDescription && (
                  <div className="card p-6 border border-stone-200/80 dark:border-stone-800">
                    <h3 className="font-bold text-base text-stone-900 dark:text-white mb-2">
                      Professional Background
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-line">
                      {profile.experienceDescription}
                    </p>
                  </div>
                )}

                <div className="card p-6 grid grid-cols-2 sm:grid-cols-3 gap-5 border border-stone-200/80 dark:border-stone-800">
                  {[
                    { label: 'Work Preference', value: profile?.workType?.replace('-', ' ') || 'Full / Part time' },
                    { label: 'Total Experience', value: `${profile?.experience || 0} years` },
                    { label: 'Response Time', value: `~${profile?.responseTime || 15} mins` },
                    { label: 'Jobs Completed', value: `${profile?.completedBookings || 0} bookings` },
                    { label: 'Service Coverage', value: `${profile?.serviceRadius || 15} km radius` },
                    { label: 'Languages Spoken', value: profile?.languagesKnown?.join(', ') || 'Hindi, English' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs font-semibold text-stone-400 mb-1">{item.label}</p>
                      <p className="font-bold text-sm text-stone-900 dark:text-white capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {reviews?.length === 0 ? (
                  <div className="card p-8 text-center text-stone-400 text-sm">
                    No reviews yet. Be the first household to book and rate {worker.name.split(' ')[0]}!
                  </div>
                ) : (
                  reviews?.map((review) => (
                    <div key={review._id} className="card p-5 border border-stone-200/80 dark:border-stone-800">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                            {getInitials(review.reviewer?.name)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-stone-900 dark:text-white">
                              {review.reviewer?.name || 'Verified Customer'}
                            </p>
                            <span className="text-[11px] text-stone-400">{formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size={13} />
                      </div>
                      {review.comment && (
                        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed italic">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* Tab: Work History */}
            {activeTab === 'work_history' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 border border-stone-200/80 dark:border-stone-800 space-y-4">
                <h3 className="font-bold text-base text-stone-900 dark:text-white mb-2">Verified Track Record</h3>
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/70 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  ✓ Verified identity through Aadhaar and certified background check.<br />
                  ✓ Over {profile?.completedBookings || 5} domestic assignments successfully completed on KaamConnect.<br />
                  ✓ 100% on-time attendance record in the current quarter.
                </div>
              </motion.div>
            )}
          </div>

          {/* Sticky Right Booking Actions */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6 sticky top-24 border border-stone-200/80 dark:border-stone-800 shadow-xl"
            >
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-white mb-2 tracking-tight">
                Hire {worker.name.split(' ')[0]}
              </h3>

              {profile?.availabilityStatus === 'available' ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold mb-5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60">
                  <Zap size={14} className="fill-current text-emerald-600" />
                  <span>Available for immediate placement</span>
                </div>
              ) : (
                <div className="badge badge-amber mb-5">Currently {profile?.availabilityStatus}</div>
              )}

              <div className="space-y-2.5 mb-6 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
                  <span>Standard Shift</span>
                  <span className="font-bold text-stone-900 dark:text-white">Morning / Evening</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-800">
                  <span>Service Area</span>
                  <span className="font-bold text-stone-900 dark:text-white">{worker.location?.city || 'Local Area'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Safety Deposit</span>
                  <span className="font-bold text-emerald-600">₹0 (Zero Brokerage)</span>
                </div>
              </div>

              {currentUser ? (
                <div className="space-y-3">
                  <Link
                    to={`/book/${worker._id}`}
                    className="btn-primary w-full text-center py-3 text-sm font-bold shadow-md shadow-emerald-600/20"
                  >
                    Confirm Booking
                  </Link>
                  <Link
                    to="/chat"
                    className="btn-secondary w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
                  >
                    <MessageCircle size={15} />
                    <span>Direct Message</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="btn-primary w-full text-center py-3 text-sm font-bold shadow-md shadow-emerald-600/20"
                  >
                    Log In to Book Worker
                  </Link>
                  <Link
                    to="/register?intent=customer"
                    className="btn-outline w-full text-center py-2.5 text-xs font-bold"
                  >
                    Register New Account
                  </Link>
                </div>
              )}

              {/* Verified Badges */}
              <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Verified Trust Checks
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Aadhaar Identity Verified</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Physical Address Confirmed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Criminal Background Clear</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
