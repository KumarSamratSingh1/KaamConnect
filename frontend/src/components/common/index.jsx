import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle, Zap, ShieldCheck } from 'lucide-react';
import { formatCurrency, getInitials, SKILLS } from '../../utils/helpers';

// ─── Star Rating ────────────────────────────────────────────
export function StarRating({ rating = 0, size = 14, showCount, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-300 dark:text-stone-700'}
        />
      ))}
      {showCount && <span className="text-xs text-stone-500 ml-1">({count})</span>}
    </div>
  );
}

// ─── Skill Badge ─────────────────────────────────────────────
export function SkillBadge({ skill }) {
  const s = SKILLS.find(sk => sk.id === skill) || { label: skill, icon: '✦' };
  return (
    <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-emerald-200/70 dark:border-emerald-800/70">
      <span>{s.icon}</span> {s.label}
    </span>
  );
}

// ─── Worker Card ─────────────────────────────────────────────
export function WorkerCard({ profile, index = 0 }) {
  const worker = profile?.user || profile;
  const wp = profile?.user ? profile : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
    >
      <Link to={`/workers/${worker?._id}`} className="block card card-hover p-5 group relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative shrink-0">
            <div className="w-13 h-13 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 border border-emerald-200/60 dark:border-emerald-800/60">
              {worker?.profilePhoto?.url ? (
                <img src={worker.profilePhoto.url} alt={worker.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-bold text-base">
                  {getInitials(worker?.name)}
                </div>
              )}
            </div>
            {wp?.availabilityStatus === 'available' && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900 shadow-sm" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-bold text-stone-900 dark:text-white text-sm truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {worker?.name}
              </h3>
              {wp?.isVerified && <ShieldCheck size={14} className="text-emerald-600 shrink-0" />}
            </div>
            {wp && (
              <>
                <StarRating rating={wp.rating?.average} size={11} showCount count={wp.rating?.count} />
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{wp.experience || 0} yrs experience</p>
              </>
            )}
          </div>

          {wp?.availabilityStatus === 'available' && (
            <span className="badge badge-emerald text-[10px] shrink-0 font-bold">
              <Zap size={9} className="fill-current" /> Available
            </span>
          )}
        </div>

        {/* Skills */}
        {wp?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {wp.skills.slice(0, 3).map(s => <SkillBadge key={s} skill={s} />)}
            {wp.skills.length > 3 && <span className="text-xs text-stone-400 px-1 py-0.5">+{wp.skills.length - 3}</span>}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
          <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
            <MapPin size={12} className="text-stone-400" /> {worker?.location?.city || 'India'}
          </div>
          {wp?.expectedSalary?.min && (
            <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
              {formatCurrency(wp.expectedSalary.min)}<span className="text-xs font-normal text-stone-400">/mo</span>
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="skeleton w-14 h-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
      </div>
      <div className="flex gap-1.5 mb-3">
        <div className="skeleton h-6 w-20 rounded-lg" />
        <div className="skeleton h-6 w-16 rounded-lg" />
      </div>
      <div className="skeleton h-px w-full mb-3 rounded" />
      <div className="flex justify-between">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-4 w-24 rounded" />
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────
export function EmptyState({ icon = '🔍', title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-10 max-w-lg mx-auto flex flex-col items-center justify-center text-center my-6"
    >
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-stone-500 text-xs sm:text-sm max-w-sm mb-5 leading-relaxed">{description}</p>
      {action}
    </motion.div>
  );
}

// ─── Status Badge ────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    pending: { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-800 dark:text-amber-300', label: 'Pending', dot: 'bg-amber-500' },
    accepted: { bg: 'bg-sky-50 dark:bg-sky-950/60', text: 'text-sky-800 dark:text-sky-300', label: 'Accepted', dot: 'bg-sky-500' },
    confirmed: { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-800 dark:text-emerald-300', label: 'Confirmed', dot: 'bg-emerald-500' },
    in_progress: { bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-800 dark:text-purple-300', label: 'In Progress', dot: 'bg-purple-500' },
    completed: { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-800 dark:text-emerald-300', label: 'Completed', dot: 'bg-emerald-500' },
    cancelled: { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-800 dark:text-rose-300', label: 'Cancelled', dot: 'bg-rose-500' },
    rejected: { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-800 dark:text-rose-300', label: 'Rejected', dot: 'bg-rose-500' },
    under_review: { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-800 dark:text-amber-300', label: 'Under Review', dot: 'bg-amber-500' },
    verified: { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-800 dark:text-emerald-300', label: 'Verified', dot: 'bg-emerald-500' },
  };
  const cfg = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-stone-200/60 dark:border-stone-800 ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Stat Card ───────────────────────────────────────────────
export function StatCard({ icon, label, value, sub, color = 'emerald' }) {
  const colors = {
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    orange: 'from-orange-500 to-amber-600',
    blue: 'from-sky-500 to-blue-600',
    purple: 'from-purple-500 to-indigo-600',
    red: 'from-rose-500 to-red-600',
  };
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color] || colors.emerald} flex items-center justify-center text-white shrink-0 shadow-md`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">{value}</p>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{label}</p>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
