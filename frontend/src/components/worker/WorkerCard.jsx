import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Zap, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { VerifiedBadge, StatusBadge } from '../common/Badge';
import { formatCurrency, getInitials, SKILLS } from '../../utils/helpers';
import StarRating from '../common/StarRating';

export default function WorkerCard({ worker, index = 0 }) {
  const {
    user,
    skills = [],
    rating,
    experience,
    expectedSalary,
    availabilityStatus,
    verificationStatus,
    workType
  } = worker;

  const skillLabels = skills.slice(0, 3).map(
    s => SKILLS.find(sk => sk.id === s) || { label: s, icon: '✦' }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card card-hover p-5 flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Top subtle decorative accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Worker Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm">
              {user?.profilePhoto?.url ? (
                <img src={user.profilePhoto.url} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-extrabold text-lg text-emerald-800 dark:text-emerald-300">
                  {getInitials(user?.name)}
                </span>
              )}
            </div>
            {availabilityStatus === 'available' && (
              <span
                title="Available Now"
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900 shadow-sm"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {user?.name || 'Verified Professional'}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {verificationStatus === 'verified' && <VerifiedBadge size="sm" />}
                  <StatusBadge status={availabilityStatus} />
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                  {expectedSalary?.min ? formatCurrency(expectedSalary.min) : 'Flexible'}
                </p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">
                  /{expectedSalary?.per || 'month'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating, Experience, Location Row */}
        <div className="flex items-center gap-3.5 py-2.5 px-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 mb-3.5 text-xs text-stone-600 dark:text-stone-300">
          <div className="flex items-center gap-1">
            <Star size={13} className="text-amber-500 fill-amber-500" />
            <span className="font-bold text-stone-900 dark:text-white">
              {(rating?.average || 0).toFixed(1)}
            </span>
            <span className="text-stone-400">({rating?.count || 0})</span>
          </div>

          <span className="text-stone-300 dark:text-stone-700">•</span>

          <div className="flex items-center gap-1">
            <Briefcase size={12} className="text-stone-400" />
            <span>{experience || 0} yrs exp</span>
          </div>

          {user?.location?.city && (
            <>
              <span className="text-stone-300 dark:text-stone-700">•</span>
              <div className="flex items-center gap-1 truncate">
                <MapPin size={12} className="text-stone-400 shrink-0" />
                <span className="truncate">{user.location.city}</span>
              </div>
            </>
          )}
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skillLabels.map(skill => (
            <span
              key={skill.id || skill.label}
              className="text-xs bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-lg font-medium flex items-center gap-1"
            >
              <span>{skill.icon}</span>
              <span>{skill.label}</span>
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-xs text-stone-400 dark:text-stone-500 px-2 py-0.5 font-medium">
              +{skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <Link
        to={`/workers/${user?._id}`}
        className="w-full btn-primary py-2.5 text-xs font-bold tracking-wide uppercase shadow-sm group-hover:shadow-md flex items-center justify-center gap-1.5"
      >
        <span>View Profile & Hire</span>
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </motion.div>
  );
}
