import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-10 max-w-lg mx-auto flex flex-col items-center justify-center text-center my-8"
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-3xl mb-4 shadow-inner">
        {icon || '🔍'}
      </div>
      <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  );
}
