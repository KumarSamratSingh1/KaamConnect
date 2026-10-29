import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, MapPin, ChevronRight, Loader2,
  CheckCircle2, ShieldCheck, ArrowRight
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { createBooking } from '../../store/slices/bookingSlice';
import { fetchWorker } from '../../store/slices/workerSlice';
import { SKILLS, formatCurrency } from '../../utils/helpers';

const STEPS = ['Select Service', 'Schedule', 'Service Location', 'Review & Pay'];

export default function BookingPage() {
  const { workerId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected } = useSelector(s => s.workers);
  const { loading } = useSelector(s => s.bookings);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    services: [],
    primaryService: '',
    type: 'scheduled',
    scheduledDate: '',
    scheduledTime: '09:00',
    duration: 4,
    serviceLocation: { address: '', city: '', pincode: '' },
    specialInstructions: '',
    urgency: 'normal'
  });

  useEffect(() => {
    dispatch(fetchWorker(workerId));
  }, [dispatch, workerId]);

  const worker = selected?.worker;
  const profile = selected?.profile;

  const totalPrice = form.services.reduce((s, svc) => s + (svc.price || 0), 0);
  const platformFee = Math.round(totalPrice * 0.05); // 5% fair tech fee
  const gst = Math.round(totalPrice * 0.18);

  const handleSubmit = async () => {
    const res = await dispatch(createBooking({
      ...form,
      workerId,
      pricing: {
        basePrice: totalPrice,
        platformFee,
        tax: gst,
        totalAmount: totalPrice + platformFee + gst
      }
    }));
    if (createBooking.fulfilled.match(res)) {
      navigate(`/payment/${res.payload._id}`);
    }
  };

  const toggleService = (skill) => {
    const exists = form.services.find(s => s.name === skill.label);
    if (exists) {
      setForm({
        ...form,
        services: form.services.filter(s => s.name !== skill.label)
      });
    } else {
      const price = profile?.services?.find(s => s.name === skill.label)?.price || 500;
      setForm({
        ...form,
        services: [...form.services, { name: skill.label, price, duration: form.duration }],
        primaryService: form.services.length === 0 ? skill.id : form.primaryService
      });
    }
  };

  if (!worker) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-8 max-w-4xl mx-auto flex-1">
        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Secure Booking Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mt-1">
            Book Service with {worker.name}
          </h1>
        </div>

        {/* Multi-step Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 bg-white dark:bg-stone-900 p-3 sm:p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-x-auto">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center gap-2 shrink-0 cursor-pointer ${
                  i <= step ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400'
                }`}
                onClick={() => i < step && setStep(i)}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                    i < step
                      ? 'bg-emerald-600 text-white'
                      : i === step
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-600'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                  }`}
                >
                  {i < step ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className="text-xs sm:text-sm font-bold">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 min-w-[20px] h-0.5 ${
                    i < step ? 'bg-emerald-500' : 'bg-stone-200 dark:bg-stone-800'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Step Form Body */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm"
            >
              {/* STEP 0: SERVICES */}
              {step === 0 && (
                <div>
                  <h2 className="text-base font-bold text-stone-900 dark:text-white mb-2">
                    1. What tasks do you require?
                  </h2>
                  <p className="text-xs text-stone-500 mb-4">Select all services needed for this booking.</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {SKILLS.map((skill) => {
                      const selected = form.services.some(s => s.name === skill.label);
                      return (
                        <button
                          key={skill.id}
                          onClick={() => toggleService(skill)}
                          type="button"
                          className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                            selected
                              ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 shadow-sm'
                              : 'border-stone-200 dark:border-stone-700 hover:border-emerald-300'
                          }`}
                        >
                          <span className="text-2xl">{skill.icon}</span>
                          <span className="text-xs font-bold">{skill.label}</span>
                          <span className="text-[10px] text-stone-500 font-semibold">₹500 / shift</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                      Booking Frequency
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'instant', icon: '⚡', label: 'Instant (Today)' },
                        { id: 'scheduled', icon: '📅', label: 'Scheduled Date' },
                        { id: 'recurring', icon: '🔄', label: 'Recurring Plan' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setForm({ ...form, type: t.id })}
                          type="button"
                          className={`p-3 rounded-xl border text-center transition-all text-xs font-bold ${
                            form.type === t.id
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                          }`}
                        >
                          <div className="text-base mb-0.5">{t.icon}</div>
                          <div>{t.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: SCHEDULE */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-stone-900 dark:text-white mb-1">
                      2. Choose Date & Time
                    </h2>
                    <p className="text-xs text-stone-500">Pick when you would like the service to commence.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        Service Date
                      </label>
                      <input
                        type="date"
                        value={form.scheduledDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                        className="input text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={form.scheduledTime}
                        onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                        className="input text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                      Shift Duration (Hours)
                    </label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {[2, 4, 6, 8].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setForm({ ...form, duration: h })}
                          className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            form.duration === h
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'border-stone-200 dark:border-stone-700 text-stone-600'
                          }`}
                        >
                          {h} Hours
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                      Urgency Level
                    </label>
                    <select
                      value={form.urgency}
                      onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                      className="input text-xs sm:text-sm"
                    >
                      <option value="normal">Standard (Normal schedule)</option>
                      <option value="urgent">Urgent (Within 2-3 hours)</option>
                      <option value="emergency">Emergency (Within 30-45 minutes)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-stone-900 dark:text-white mb-1">
                      3. Service Location
                    </h2>
                    <p className="text-xs text-stone-500">Where should the helper report for work?</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                      House / Flat / Street Address
                    </label>
                    <input
                      value={form.serviceLocation.address}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          serviceLocation: { ...form.serviceLocation, address: e.target.value },
                        })
                      }
                      className="input text-xs sm:text-sm"
                      placeholder="e.g. Flat 402, Sterling Palms, Arera Colony"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        City
                      </label>
                      <input
                        value={form.serviceLocation.city}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            serviceLocation: { ...form.serviceLocation, city: e.target.value },
                          })
                        }
                        className="input text-xs sm:text-sm"
                        placeholder="e.g. Bhopal"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        Pincode
                      </label>
                      <input
                        value={form.serviceLocation.pincode}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            serviceLocation: { ...form.serviceLocation, pincode: e.target.value },
                          })
                        }
                        className="input text-xs sm:text-sm"
                        placeholder="462016"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                      Special Access or Task Instructions (Optional)
                    </label>
                    <textarea
                      value={form.specialInstructions}
                      onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
                      className="input resize-none text-xs sm:text-sm"
                      rows={3}
                      placeholder="e.g. Ring bell 402, vegetarian kitchen only, pets present..."
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIRMATION & INVOICE */}
              {step === 3 && (
                <div>
                  <h2 className="text-base font-bold text-stone-900 dark:text-white mb-1">
                    4. Review & Confirm Booking
                  </h2>
                  <p className="text-xs text-stone-500 mb-4">Inspect the complete booking details before payment.</p>

                  <div className="space-y-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 text-xs text-stone-700 dark:text-stone-300 mb-5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Professional</span>
                      <span className="font-bold text-stone-900 dark:text-white">{worker.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Selected Tasks</span>
                      <span className="font-bold text-stone-900 dark:text-white">{form.services.map(s => s.name).join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Schedule</span>
                      <span className="font-bold text-stone-900 dark:text-white">{form.scheduledDate || 'Today'} at {form.scheduledTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Duration</span>
                      <span className="font-bold text-stone-900 dark:text-white">{form.duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Location</span>
                      <span className="font-bold text-stone-900 dark:text-white">{form.serviceLocation.address}, {form.serviceLocation.city}</span>
                    </div>

                    <div className="border-t border-stone-200 dark:border-stone-700 pt-3 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Worker Compensation</span>
                        <span>{formatCurrency(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">KaamConnect Safety & Tech Fee (5%)</span>
                        <span>{formatCurrency(platformFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">GST (18%)</span>
                        <span>{formatCurrency(gst)}</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-sm text-stone-900 dark:text-white pt-2 border-t border-stone-200">
                        <span>Total Payable</span>
                        <span className="text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(totalPrice + platformFee + gst)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex gap-3 mt-6 pt-5 border-t border-stone-100 dark:border-stone-800">
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="btn-outline flex-1 text-xs font-bold py-2.5"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    disabled={step === 0 && form.services.length === 0}
                    className="btn-primary flex-1 text-xs font-bold py-2.5 flex items-center justify-center gap-2"
                  >
                    <span>Continue</span>
                    <ChevronRight size={15} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex-1 text-xs font-bold py-3 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    <span>{loading ? 'Confirming Booking...' : 'Proceed to Payment'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Sticky Summary Card */}
          <div className="card p-5 h-fit sticky top-24 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900 dark:text-white uppercase tracking-wider">
              Booking Overview
            </h3>

            <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                {worker.name[0]}
              </div>
              <div>
                <p className="font-bold text-sm text-stone-900 dark:text-white">{worker.name}</p>
                <p className="text-xs text-stone-500">{worker.location?.city || 'Local Helper'}</p>
              </div>
            </div>

            {form.services.length > 0 ? (
              <div className="space-y-2 text-xs">
                {form.services.map((s) => (
                  <div key={s.name} className="flex justify-between text-stone-600 dark:text-stone-300">
                    <span>{s.name}</span>
                    <span className="font-bold">{formatCurrency(s.price)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-extrabold text-sm text-stone-900 dark:text-white pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span>Estimated Total</span>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(totalPrice + platformFee + gst)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">No tasks selected yet.</p>
            )}

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400 space-y-1">
              <p className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                <ShieldCheck size={13} /> KaamConnect Escrow Safe
              </p>
              <p>Direct worker payment released only after OTP service confirmation.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
