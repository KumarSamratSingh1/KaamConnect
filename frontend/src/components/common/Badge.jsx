import React from 'react';
import { ShieldCheck, CircleDot } from 'lucide-react';

export function VerifiedBadge({ size = 'sm' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-lg bg-emerald-100/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800 ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <ShieldCheck size={size === 'sm' ? 12 : 14} className="text-emerald-600 dark:text-emerald-400" />
      Verified
    </span>
  );
}

export function StatusBadge({ status }) {
  const cfg = {
    available: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    busy: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    offline: 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700',
    on_leave: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
  };

  const labels = {
    available: 'Available Now',
    busy: 'Currently Busy',
    offline: 'Offline',
    on_leave: 'On Leave',
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${cfg[status] || cfg.offline}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'available' ? 'bg-emerald-500 animate-pulse' : status === 'busy' ? 'bg-amber-500' : 'bg-stone-400'}`} />
      {labels[status] || status}
    </span>
  );
}
