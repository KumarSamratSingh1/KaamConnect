import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, CheckCircle2, Loader2, Lock, ArrowRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await api.post('/payments/create-order', { bookingId });
      await new Promise(r => setTimeout(r, 1200));
      await api.post('/payments/verify', {
        bookingId,
        razorpayOrderId: `order_mock_${Date.now()}`,
        razorpayPaymentId: `pay_mock_${Date.now()}`
      });
      setPaid(true);
      toast.success('Payment verified successfully! 🎉');
      setTimeout(() => navigate('/customer/bookings'), 2200);
    } catch(e) {
      toast.error('Payment processing failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-12 max-w-lg mx-auto flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center w-full border border-stone-200/80 dark:border-stone-800 shadow-xl"
        >
          {paid ? (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                Payment Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
                Your domestic service assignment has been confirmed. Redirecting you to booking details...
              </p>
              <div className="pt-2 flex justify-center">
                <Loader2 size={18} className="animate-spin text-emerald-600" />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200/70 text-emerald-700 dark:text-emerald-300 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <CreditCard size={28} />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  Secure Checkout
                </span>
                <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight mt-1">
                  Complete Payment
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Your domestic worker booking will be locked immediately upon confirmation.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Platform Gateway</span>
                  <span className="font-bold text-stone-900 dark:text-white">Razorpay Secure Escrow</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Booking Reference</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {bookingId ? `GS-${bookingId.slice(-6).toUpperCase()}` : 'CONFIRMING'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200/60 dark:border-stone-700">
                  <span className="text-stone-500">Escrow Guarantee</span>
                  <span className="font-bold text-emerald-600">OTP Release on Service Start</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>256-bit Encrypted Bank Grade Security</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="btn-primary w-full py-3.5 text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Authorize Payment</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
