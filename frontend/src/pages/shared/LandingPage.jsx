import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Star, ShieldCheck, Zap, CheckCircle2, Award,
  Users, TrendingUp, MapPin, ArrowRight, Sparkles, Clock,
  Lock, HeartHandshake, ChevronRight, UserCheck
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { SKILLS } from '../../utils/helpers';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

const STATS = [
  { value: '12,000+', label: 'Verified Workers', sub: 'Aadhaar & police screened', icon: UserCheck },
  { value: '45,000+', label: 'Homes Served', sub: 'Across Bhopal, Indore & MP', icon: CheckCircle2 },
  { value: '4.9 / 5.0', label: 'Average Trust Rating', sub: 'Over 30k verified reviews', icon: Star },
  { value: '15 Mins', label: 'Fast Matching Time', sub: 'Gemini AI semantic search', icon: Zap },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Describe Your Need',
    desc: 'Type your requirements in plain words or pick specific tasks — e.g. "Full-time vegetarian cook for family of 4".',
    icon: '📝',
  },
  {
    step: '02',
    title: 'AI Smart Match',
    desc: 'Our Gemini AI engine matches background-checked professionals matching your location, budget, and timing.',
    icon: '🤖',
  },
  {
    step: '03',
    title: 'Review & Chat Direct',
    desc: 'Inspect verified credentials, past employer ratings, and salary requirements. Chat directly before finalizing.',
    icon: '💬',
  },
  {
    step: '04',
    title: 'Start Service Safely',
    desc: 'Secure OTP-based service starts, transparent pricing breakdown, and safe online payment with zero hidden charges.',
    icon: '🛡️',
  },
];

const WHY_CHOOSE = [
  {
    icon: ShieldCheck,
    title: 'Comprehensive Verification',
    desc: 'Government Aadhaar KYC, physical address verification, and police background clearance for every professional.',
  },
  {
    icon: Sparkles,
    title: 'Gemini AI Matchmaking',
    desc: 'State-of-the-art AI understands nuanced family requirements like regional cuisines, dietary preferences, and pet handling.',
  },
  {
    icon: HeartHandshake,
    title: 'Fair Wages, Zero Middlemen',
    desc: 'Workers earn 100% of their quoted wages. We eliminate exploitative contractor commissions and middlemen markups.',
  },
  {
    icon: Lock,
    title: 'Secure Escrow Payments',
    desc: 'Bookings are backed by complete payment transparency with automated digital invoices and instant refunds for disputes.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Dr. Radhika Sen',
    location: 'Arera Colony, Bhopal',
    text: 'Found an exceptional North-Indian cook within 20 minutes of posting on KaamConnect. The Aadhaar verification and past reviews gave us total peace of mind.',
    role: 'Customer since 2025',
    service: 'Cooking • Full-time',
    rating: 5,
    avatar: 'RS',
  },
  {
    name: 'Vikram Joshi',
    location: 'Vijay Nagar, Indore',
    text: 'Our elderly parents needed a dedicated companion who understands patient care. KaamConnect matched us with an experienced caregiver who has been a blessing.',
    role: 'Customer since 2024',
    service: 'Elder Care • Live-in',
    rating: 5,
    avatar: 'VJ',
  },
  {
    name: 'Ananya & Rohit Sharma',
    location: 'Gulmohar, Bhopal',
    text: 'As two working IT professionals, managing home cleaning was stressful. The reliability and punctuality of workers on this platform is unmatched.',
    role: 'Customer since 2025',
    service: 'Housekeeping • Part-time',
    rating: 5,
    avatar: 'AS',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle Decorative Ambient Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-200/40 dark:bg-emerald-950/30 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-200/30 dark:bg-amber-950/20 rounded-full blur-[90px] pointer-events-none -z-10" />

        <div className="page-container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
              
              {/* Badge */}
              <motion.div variants={fadeUp} className="flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/80 border border-emerald-300/60 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold tracking-tight shadow-sm">
                  <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                  India's Premium Domestic Worker Marketplace
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-[1.12]"
              >
                Your Home. Your Help.{' '}
                <span className="text-gradient block mt-1">One Connection.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed"
              >
                Connect with background-verified cooks, maids, nannies, and caregivers. Powered by smart Gemini AI matching, instant hiring, and secure transparent payments.
              </motion.p>

              {/* Search Bar with AI Prompt Capability */}
              <motion.form
                variants={fadeUp}
                onSubmit={handleSearch}
                className="pt-2 max-w-2xl mx-auto"
              >
                <div className="bg-white dark:bg-stone-900 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-xl shadow-stone-200/50 dark:shadow-stone-950/50 border border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-2">
                  <div className="flex items-center gap-3 px-3.5 py-2 w-full flex-1">
                    <Search size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Try: 'Need a vegetarian cook for dinner in Arera Colony'..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm sm:text-base outline-none text-stone-900 dark:text-white placeholder:text-stone-400 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto btn-primary px-7 py-3 text-sm font-bold rounded-xl sm:rounded-2xl shrink-0 shadow-md shadow-emerald-600/25"
                  >
                    <span>Find Help</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.form>

              {/* Popular Quick Service Tags */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                <span className="text-stone-600 dark:text-stone-300 font-semibold mr-1">Popular services:</span>
                {SKILLS.slice(0, 6).map((skill) => (
                  <Link
                    key={skill.id}
                    to={`/search?service=${skill.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-medium hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 transition-all shadow-subtle"
                  >
                    <span>{skill.icon}</span>
                    <span>{skill.label}</span>
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUST METRICS BAR ─── */}
      <section className="py-10 bg-white dark:bg-stone-900/80 border-y border-stone-200/80 dark:border-stone-800">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300">{stat.label}</p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300">{stat.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR SERVICE CATEGORIES ─── */}
      <section id="services" className="py-20 md:py-24">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Verified Domestic Categories
              </span>
              <h2 className="section-title mt-1">Explore Household Services</h2>
              <p className="section-subtitle mt-2">
                Certified, experienced professionals ready for part-time, full-time, and live-in roles.
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 group"
            >
              <span>Browse all categories</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {SKILLS.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/search?service=${skill.id}`}
                  className="card card-hover p-5 flex flex-col items-center text-center group h-full justify-between"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                    {skill.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {skill.label}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-1">From ₹6,000/mo</p>
                  </div>
                  <span className="mt-3 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    View workers <ChevronRight size={12} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section id="how-it-works" className="py-20 bg-stone-100/70 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Effortless Onboarding
            </span>
            <h2 className="section-title mt-1">How KaamConnect Works</h2>
            <p className="section-subtitle mt-2 mx-auto">
              Skip weeks of searching via word-of-mouth. Hire verified help with complete transparency in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 flex flex-col justify-between relative group hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{step.icon}</span>
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                      STEP {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE KAAMCONNECT ─── */}
      <section id="why-us" className="py-20 md:py-24">
        <div className="page-container">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="badge badge-emerald mb-3">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  Trust & Security First
                </span>
                <h2 className="section-title">
                  Safe, Dignified, & Transparent For Every Household
                </h2>
                <p className="section-subtitle mt-3">
                  Traditional domestic hiring in India is broken with zero accountability, unverified backgrounds, and predatory brokers. KaamConnect changes that forever.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 pt-2">
                {WHY_CHOOSE.map((item) => (
                  <div key={item.title} className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                      <item.icon size={20} />
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Trust Card */}
            <div className="lg:col-span-6">
              <div className="card p-8 bg-gradient-to-br from-emerald-900 via-stone-900 to-stone-900 text-white border-stone-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xl">
                    KC
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">The KaamConnect Guarantee</h3>
                    <p className="text-xs text-emerald-300">Setting new standards for domestic care</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-stone-300">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white text-xs">Free Worker Replacement</p>
                      <p className="text-xs text-stone-400 mt-0.5">Not satisfied within 7 days? Get an instant rematch with another verified pro at no extra charge.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white text-xs">Aadhaar & Criminal Screening</p>
                      <p className="text-xs text-stone-400 mt-0.5">Biometric identity checks and judicial record verification before any profile goes live.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white text-xs">Direct Digital Wages</p>
                      <p className="text-xs text-stone-400 mt-0.5">Fair, predictable monthly compensation paid directly to workers' verified bank accounts.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-medium">Looking for immediate placement?</span>
                  <Link
                    to="/search"
                    className="btn-primary text-xs font-bold py-2 px-4 shadow-none bg-emerald-500 hover:bg-emerald-600 text-stone-950"
                  >
                    Find Verified Help
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CUSTOMER TESTIMONIALS ─── */}
      <section id="testimonials" className="py-20 bg-stone-100/70 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Community Stories
            </span>
            <h2 className="section-title mt-1">Trusted By Indian Households</h2>
            <p className="section-subtitle mt-2 mx-auto">
              Real experiences from families and professionals who found peace of mind through KaamConnect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={15} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {t.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-stone-900 dark:text-white truncate">{t.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{t.location} • <span className="text-emerald-700 dark:text-emerald-400 font-medium">{t.service}</span></p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ─── */}
      <section className="py-20 md:py-24">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card p-10 md:p-16 text-center bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white border-0 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-2xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-emerald-100">
                <Sparkles size={13} />
                Get Started in Under 2 Minutes
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to Experience Stress-Free Domestic Care?
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                Join thousands of verified households who trust KaamConnect for dependable, background-verified home assistance every day.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  to="/register?intent=customer"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Hire Verified Help</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/register?intent=worker"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 text-white font-bold text-sm border border-emerald-400/40 transition-all flex items-center justify-center gap-2"
                >
                  <span>Register as Worker</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Global Rebranded Footer */}
      <Footer />
    </div>
  );
}
