import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal, Sparkles, Loader2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import WorkerCard from '../../components/worker/WorkerCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { fetchWorkers, setFilters } from '../../store/slices/workerSlice';
import { SKILLS, WORK_TYPES, LANGUAGES } from '../../utils/helpers';
import api from '../../utils/api';

export default function SearchPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { list: workers, loading, pagination, filters } = useSelector(s => s.workers);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiParsed, setAiParsed] = useState(null);

  const doSearch = useCallback(() => {
    dispatch(fetchWorkers({
      ...filters,
      search,
      page,
      limit: 12,
      skills: filters.skills?.join(',') || searchParams.get('service') || searchParams.get('skills')
    }));
  }, [dispatch, filters, search, page, searchParams]);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && (!filters.skills || !filters.skills.includes(serviceParam))) {
      dispatch(setFilters({ skills: [serviceParam] }));
    } else {
      doSearch();
    }
  }, [doSearch, searchParams, dispatch]);

  const handleAISearch = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/parse-requirement', { text: aiQuery });
      const parsed = res.data.data;
      setAiParsed(parsed);
      dispatch(setFilters({
        skills: parsed.services || [],
        workType: parsed.workType || '',
        maxSalary: parsed.budget || ''
      }));
    } catch (e) {
      console.error(e);
    }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Verified Domestic Professionals
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-stone-900 dark:text-white">
                Find Your Trusted Home Helper
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                Aadhaar-verified domestic helpers, cooks, maids & caretakers with transparent ratings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500">
                {loading ? 'Searching...' : `${pagination?.total || workers.length} available helpers`}
              </span>
            </div>
          </div>

          {/* AI-Powered Smart Match Bar */}
          <div className="card p-4 sm:p-5 mb-5 bg-gradient-to-r from-emerald-50/60 via-white to-amber-50/30 dark:from-emerald-950/40 dark:via-stone-900 dark:to-stone-900 border-emerald-200/80 dark:border-emerald-800/80 shadow-md">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">
                  <Sparkles size={13} />
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300">
                  Gemini AI Semantic Requirement Parser
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hidden sm:inline">
                Natural Language Matching
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                placeholder="Describe your requirement (e.g. 'Looking for a vegetarian cook in Bhopal for 4 people with 5 years experience')..."
                className="input flex-1 text-xs sm:text-sm"
              />
              <button
                onClick={handleAISearch}
                disabled={aiLoading}
                className="btn-primary py-2.5 px-5 text-xs font-bold tracking-wide uppercase shadow-sm shrink-0 flex items-center justify-center gap-2"
              >
                {aiLoading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                <span>AI Parse</span>
              </button>
            </div>

            {aiParsed && (
              <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-900/60 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-500 font-semibold text-[11px]">AI Detected:</span>
                {aiParsed.services?.map((s) => (
                  <span key={s} className="badge badge-emerald capitalize font-bold">
                    ✓ {s}
                  </span>
                ))}
                {aiParsed.workType && (
                  <span className="badge badge-amber capitalize font-bold">
                    {aiParsed.workType}
                  </span>
                )}
                {aiParsed.location && (
                  <span className="badge badge-stone font-bold">
                    📍 {aiParsed.location}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                placeholder="Search by worker name, skill or city..."
                className="input pl-10 text-xs sm:text-sm"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary py-2.5 px-4 text-xs font-bold shrink-0 flex items-center justify-center gap-2 ${
                showFilters ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-400' : ''
              }`}
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {Object.values(filters).some((v) => v && v.length) && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              )}
            </button>

            <select
              className="input text-xs sm:text-sm w-full sm:w-auto py-2.5 shrink-0"
              onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
            >
              <option value="rating">Sort: Top Rated</option>
              <option value="salary_low">Sort: Lowest Salary</option>
              <option value="experience">Sort: Most Experienced</option>
            </select>
          </div>
        </div>

        {/* Expandable Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="card p-6 mb-8 overflow-hidden border border-emerald-200 dark:border-emerald-800 shadow-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-3">
                    Filter by Skills
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILLS.map((skill) => {
                      const selected = filters.skills?.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() =>
                            dispatch(
                              setFilters({
                                skills: selected
                                  ? filters.skills.filter((s) => s !== skill.id)
                                  : [...(filters.skills || []), skill.id],
                              })
                            )
                          }
                          className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all flex items-center gap-1.5 ${
                            selected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-300'
                          }`}
                        >
                          <span>{skill.icon}</span>
                          <span>{skill.label}</span>
                          {selected && <Check size={12} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                      Work Arrangement
                    </label>
                    <select
                      value={filters.workType || ''}
                      onChange={(e) => dispatch(setFilters({ workType: e.target.value }))}
                      className="input text-xs sm:text-sm"
                    >
                      <option value="">Any Work Type</option>
                      {WORK_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                      Minimum Rating
                    </label>
                    <select
                      value={filters.minRating || ''}
                      onChange={(e) => dispatch(setFilters({ minRating: e.target.value }))}
                      className="input text-xs sm:text-sm"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4.0+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                      Max Salary (₹/month)
                    </label>
                    <input
                      type="number"
                      value={filters.maxSalary || ''}
                      onChange={(e) => dispatch(setFilters({ maxSalary: e.target.value }))}
                      placeholder="e.g. 15000"
                      className="input text-xs sm:text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 dark:text-stone-300">
                      <input
                        type="checkbox"
                        checked={filters.verifiedOnly || false}
                        onChange={(e) => dispatch(setFilters({ verifiedOnly: e.target.checked }))}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                      />
                      <span>Verified Only</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 dark:text-stone-300">
                      <input
                        type="checkbox"
                        checked={filters.availableOnly || false}
                        onChange={(e) => dispatch(setFilters({ availableOnly: e.target.checked }))}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                      />
                      <span>Available Now</span>
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      dispatch(
                        setFilters({
                          skills: [],
                          minRating: '',
                          maxSalary: '',
                          workType: '',
                          verifiedOnly: false,
                          availableOnly: false,
                        })
                      );
                      setAiParsed(null);
                    }}
                    className="btn-ghost text-xs text-rose-600 hover:text-rose-700 p-0 font-bold flex items-center gap-1"
                  >
                    <X size={13} /> Reset All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Worker Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <SkeletonCard count={8} />
          </div>
        ) : workers.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No matching professionals found"
            description="Try clearing some filters or searching with different keywords."
            action={
              <button
                onClick={() => {
                  dispatch(setFilters({ skills: [], minRating: '', maxSalary: '', workType: '' }));
                  setSearch('');
                  setAiParsed(null);
                }}
                className="btn-primary text-xs"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {workers.map((w, i) => (
              <WorkerCard key={w._id || i} worker={w} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {Array.from({ length: pagination.pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                  page === i + 1
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
