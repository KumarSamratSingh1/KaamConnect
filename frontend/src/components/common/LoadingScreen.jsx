import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#FAF8F5] dark:bg-stone-950 flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4"
      >
        <span className="text-white font-extrabold text-2xl tracking-tighter">KC</span>
      </motion.div>
      <p className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">KaamConnect</p>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
