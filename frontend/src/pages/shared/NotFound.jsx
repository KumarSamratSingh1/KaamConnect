import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
            🔍
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Error 404
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1 mb-3 text-stone-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or may have been relocated. Let's get you back to finding trusted home help.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/" className="btn-primary text-xs font-bold py-2.5 px-6 shadow-sm flex items-center gap-2">
              <Home size={15} />
              <span>Back to Home</span>
            </Link>
            <Link to="/search" className="btn-outline text-xs font-bold py-2.5 px-5">
              Browse Helpers
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
