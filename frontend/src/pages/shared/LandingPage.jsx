import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, ShieldCheck, Zap, CheckCircle2, Award,
  Users, TrendingUp, MapPin, ArrowRight, Sparkles, Clock,
  Lock, HeartHandshake, ChevronRight, UserCheck, Check,
  Bot, HelpCircle, ArrowUpRight
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import WorkerCard from '../../components/worker/WorkerCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import { SKILLS, INDIAN_CITIES } from '../../utils/helpers';
import api from '../../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
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
    desc: 'State your requirements in plain English or Hindi — e.g. "Full-time vegetarian cook for family of 4 in Arera Colony".',
    icon: '📝',
    badge: '1 Min',
  },
  {
    step: '02',
    title: 'AI Smart Match',
    desc: 'Our Gemini AI engine parses diet, timings, and location to shortlist pre-vetted professionals.',
    icon: '⚡',
    badge: 'Instant',
  },
  {
    step: '03',
    title: 'Review Credentials & Chat',
    desc: 'Inspect verified Aadhaar verification, past ratings, wage expectations, and chat directly.',
    icon: '💬',
    badge: 'Direct',
  },
  {
    step: '04',
    title: 'Secure OTP Start & Escrow',
    desc: 'Dual OTP authentication confirms job start. Funds remain in secure escrow until satisfactory delivery.',
    icon: '🛡️',
    badge: 'Protected',
  },
];

const SAMPLE_AI_QUERIES = [
  'Full-time North Indian cook in Bhopal',
  'Elderly companion with nursing experience',
  'Part-time morning maid for 3 BHK flat',
  'Experienced babysitter for 2-year old child',
  'Live-in housekeeper with cooking skills in Indore'
];

const TESTIMONIALS = [
  {
    name: 'Dr. Radhika Sen',
    location: 'Arera Colony, Bhopal',
    text: 'Found an exceptional North-Indian cook within 20 minutes of searching on KaamConnect. The Aadhaar biometric verification and past employer reviews gave our family total peace of mind.',
    role: 'Verified Customer',
    service: 'Cooking • Full-time',
    rating: 5,
    avatar: 'RS',
  },
  {
    name: 'Vikram Joshi',
    location: 'Vijay Nagar, Indore',
    text: 'Our elderly parents needed a dedicated companion who understands patient care. KaamConnect matched us with an experienced caregiver who has been compassionate and utterly reliable.',
    role: 'Verified Customer',
    service: 'Elder Care • Live-in',
    rating: 5,
    avatar: 'VJ',
  },
  {
    name: 'Ananya & Rohit Sharma',
    location: 'Gulmohar, Bhopal',
    text: 'As two working IT professionals, finding dependable domestic help was exhausting. The transparent pricing, lack of middleman commission, and OTP start make KaamConnect world-class.',
    role: 'Verified Customer',
    service: 'Housekeeping • Part-time',
    rating: 5,
    avatar: 'AS',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchTab, setSearchTab] = useState('standard'); // 'standard' | 'ai'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [featuredWorkers, setFeaturedWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  // Fetch featured verified professionals
  useEffect(() => {
    let isMounted = true;
    const fetchTopWorkers = async () => {
      try {
        const res = await api.get('/workers?limit=4&sortBy=rating');
        if (isMounted) {
          if (res.data?.data?.workers?.length) {
            setFeaturedWorkers(res.data.data.workers);
          } else {
            setFeaturedWorkers([]);
          }
        }
      } catch (err) {
        console.error('Failed to load featured workers for landing page:', err);
      } finally {
        if (isMounted) setLoadingWorkers(false);
      }
    };
    fetchTopWorkers();
    return () => { isMounted = false; };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      if (searchTab === 'ai') {
        params.set('ai', searchQuery.trim());
      } else {
        params.set('q', searchQuery.trim());
      }
    }
    if (selectedCity) {
      params.set('city', selectedCity);
    }
    navigate(`/search?${params.toString()}`);
  };

  const handleChipClick = (query) => {
    setSearchQuery(query);
    setSearchTab('ai');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0F1512] flex flex-col text-stone-900 dark:text-stone-100 selection:bg-emerald-200 dark:selection:bg-emerald-800">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden pattern-grid">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-emerald-200/35 dark:bg-emerald-950/25 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-amber-200/25 dark:bg-amber-950/15 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="page-container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
              
              {/* Linear-Style Pill Announcement */}
              <motion.div variants={fadeUp} className="flex justify-center">
                <Link
                  to="/search"
                  className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-stone-900/90 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all duration-200"
                >
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Gemini AI Smart Matching v2.0</span>
                  <span className="text-stone-400 dark:text-stone-600 hidden sm:inline">•</span>
                  <span className="text-stone-600 dark:text-stone-300 hidden sm:inline">Find verified domestic help in seconds</span>
                  <ChevronRight size={14} className="text-stone-400 group-hover:translate-x-0.5 group-hover:text-emerald-600 transition-transform" />
                </Link>
              </motion.div>

              {/* Startup Hero Headline */}
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
                Connect with background-verified cooks, maids, nannies, and caregivers. Powered by Gemini AI matchmaking, instant hiring, and secure transparent payments.
              </motion.p>

              {/* Interactive Search Card with AI Mode Toggle */}
              <motion.div variants={fadeUp} className="pt-2 max-w-3xl mx-auto">
                <div className="card p-2 sm:p-2.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/90 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md">
                  
                  {/* Mode Selector Tabs */}
                  <div className="flex items-center justify-between px-3 pt-2 pb-2.5 border-b border-stone-100 dark:border-stone-800/80 mb-2">
                    <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 dark:bg-stone-800/80 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setSearchTab('standard')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                          searchTab === 'standard'
                            ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                        }`}
                      >
                        <Search size={13} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Standard Search</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchTab('ai')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                          searchTab === 'ai'
                            ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                        }`}
                      >
                        <Sparkles size={13} className="text-amber-500" />
                        <span>Smart AI Prompt</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                          Beta
                        </span>
                      </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                      <MapPin size={12} className="text-emerald-600" />
                      <span>Bhopal • Indore • Jabalpur</span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 p-1">
                    <div className="flex items-center gap-2.5 px-3 py-2 w-full flex-1">
                      {searchTab === 'ai' ? (
                        <Bot size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Search size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      <input
                        type="text"
                        placeholder={
                          searchTab === 'ai'
                            ? "Try: 'Need a North Indian vegetarian cook for 4 people in Arera Colony'..."
                            : "Search by skill (Cook, Maid, Nanny), area, or name..."
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-sm sm:text-base outline-none text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 font-medium"
                      />
                    </div>

                    {/* City Selector */}
                    <div className="w-full sm:w-44 shrink-0 px-2 sm:border-l border-stone-200 dark:border-stone-800">
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 outline-none py-2 cursor-pointer"
                      >
                        <option value="">All Locations</option>
                        {INDIAN_CITIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto btn-primary px-6 py-3 text-sm font-bold shrink-0 rounded-xl"
                    >
                      <span>{searchTab === 'ai' ? 'Smart Match' : 'Find Help'}</span>
                      <ArrowRight size={15} />
                    </button>
                  </form>

                  {/* Clickable AI Example Prompts */}
                  <div className="pt-2 pb-1 px-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
                    <span className="text-[11px] font-semibold text-stone-500 shrink-0">Try asking:</span>
                    {SAMPLE_AI_QUERIES.map((query) => (
                      <button
                        key={query}
                        type="button"
                        onClick={() => handleChipClick(query)}
                        className="shrink-0 text-[11px] font-medium text-stone-600 dark:text-stone-400 bg-stone-100/80 dark:bg-stone-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 px-2.5 py-1 rounded-lg transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                      >
                        "{query}"
                      </button>
                    ))}
                  </div>

                </div>
              </motion.div>

              {/* Dual Action CTA Buttons */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/search"
                  className="btn-primary px-6 py-3 text-sm font-bold rounded-xl shadow-md w-full sm:w-auto"
                >
                  <span>Find a Professional</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/register?intent=worker"
                  className="btn-outline px-6 py-3 text-sm font-bold rounded-xl w-full sm:w-auto"
                >
                  <Briefcase size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Join as a Partner</span>
                </Link>
              </motion.div>

              {/* Popular Quick Service Tags */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-semibold mr-1">Popular categories:</span>
                {SKILLS.slice(0, 6).map((skill) => (
                  <Link
                    key={skill.id}
                    to={`/search?service=${skill.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-medium hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
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

      {/* ─── TRUST METRICS STRIP ─── */}
      <section className="py-8 bg-white dark:bg-stone-900/90 border-y border-stone-200/80 dark:border-stone-800/80">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-stone-100 dark:divide-stone-800">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300 leading-tight">{stat.label}</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight mt-0.5">{stat.sub}</p>
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
                Certified, experienced professionals ready for part-time, full-time, and live-in roles across central India.
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 group shrink-0"
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
                  className="card card-hover p-5 flex flex-col items-center text-center group h-full justify-between border-stone-200/80 dark:border-stone-800"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                    {skill.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {skill.label}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">From ₹6,000/mo</p>
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

      {/* ─── FEATURED VERIFIED PROFESSIONALS ─── */}
      <section className="py-20 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={13} className="text-emerald-600" />
                Aadhaar & Police Screened
              </div>
              <h2 className="section-title">Featured Verified Professionals</h2>
              <p className="section-subtitle mt-2">
                Available domestic helpers with verified background checks and top customer ratings.
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 group"
            >
              <span>View all available workers</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingWorkers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : featuredWorkers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredWorkers.map((worker, i) => (
                <WorkerCard key={worker._id || worker.user?._id || i} worker={worker} index={i} />
              ))}
            </div>
          ) : (
            <div className="card p-10 text-center max-w-md mx-auto">
              <ShieldCheck size={40} className="mx-auto text-emerald-600 mb-3" />
              <h3 className="font-bold text-base text-stone-900 dark:text-white mb-1">
                Verified Helpers On Demand
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Explore our full registry of background-cleared workers across Central India.
              </p>
              <Link to="/search" className="btn-primary text-xs font-bold py-2 px-4 mx-auto">
                Search Helper Registry
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section id="how-it-works" className="py-20 md:py-24">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
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
                <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Speed:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{step.badge}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE KAAMCONNECT — BENTO GRID ─── */}
      <section id="why-us" className="py-20 md:py-24 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              The KaamConnect Advantage
            </span>
            <h2 className="section-title mt-1">Safe, Dignified, & Transparent</h2>
            <p className="section-subtitle mt-2 mx-auto">
              Traditional domestic hiring in India is broken with predatory brokers, zero background verification, and no recourse. We built the platform we wanted for our own families.
            </p>
          </div>

          {/* Asymmetric Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* Bento Card 1: 2-columns wide */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-8 md:col-span-2 bg-gradient-to-br from-white via-white to-emerald-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/50 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-6">
                  <ShieldCheck size={26} />
                </div>
                <span className="badge badge-emerald mb-2">100% Verified Identity</span>
                <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-3">
                  Government Biometric & Judicial Screening
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
                  Every helper undergoes official Aadhaar biometric ID checks, current address cross-verification, and police records screening before they can take their first booking.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
                <div>
                  <p className="font-extrabold text-emerald-700 dark:text-emerald-400">Aadhaar</p>
                  <p className="text-stone-500 text-[11px]">Direct UIDAI API</p>
                </div>
                <div>
                  <p className="font-extrabold text-emerald-700 dark:text-emerald-400">Police Check</p>
                  <p className="text-stone-500 text-[11px]">Record Clearance</p>
                </div>
                <div>
                  <p className="font-extrabold text-emerald-700 dark:text-emerald-400">Physical Check</p>
                  <p className="text-stone-500 text-[11px]">Address Visited</p>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 2: 1-column wide */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card p-8 md:col-span-1 lg:col-span-2 bg-gradient-to-br from-white to-amber-50/40 dark:from-stone-900 dark:to-amber-950/20 border-amber-200/60 dark:border-amber-900/40 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-6">
                  <Sparkles size={26} />
                </div>
                <span className="badge badge-amber mb-2">Next-Gen Intelligence</span>
                <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-3">
                  Gemini AI Semantic Matchmaker
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Understand natural household nuance: dietary preferences (pure veg, jain, non-veg), elderly patient handling, child psychology, and shift schedules.
                </p>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2">
                <span className="text-amber-500 font-bold">AI Insight:</span>
                <span className="truncate">"Matches cuisine, pet friendliness & shift radius"</span>
              </div>
            </motion.div>

            {/* Bento Card 3: 1-column wide */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="card p-8 md:col-span-1 lg:col-span-2 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-6">
                  <HeartHandshake size={26} />
                </div>
                <span className="badge badge-emerald mb-2">Fair Dignified Pay</span>
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-3">
                  Zero Broker Commission
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Workers receive 100% of their quoted wages. We eliminate middlemen markups and exploitation, ensuring motivated, loyal, and punctual staff.
                </p>
              </div>

              <ul className="mt-6 space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" /> Direct bank account payout
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" /> Automated digital payslips
                </li>
              </ul>
            </motion.div>

            {/* Bento Card 4: 2-columns wide */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card p-8 md:col-span-2 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-6">
                  <Lock size={26} />
                </div>
                <span className="badge badge-emerald mb-2">Dual Verification</span>
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-3">
                  Dual OTP Authentication & Escrow Protection
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Service starts strictly when you provide the 4-digit start OTP to the worker on-site. If you're dissatisfied within the trial week, we rematch you instantly at zero charge.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 text-xs">
                <span className="font-semibold text-stone-700 dark:text-stone-300">7-Day Free Replacement Guarantee</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Included on all hires</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── CUSTOMER TESTIMONIALS ─── */}
      <section id="testimonials" className="py-20 md:py-24">
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
                className="card p-6 flex flex-col justify-between border-stone-200/80 dark:border-stone-800"
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

      {/* Global Rebranded Footer */}
      <Footer />
    </div>
  );
}
