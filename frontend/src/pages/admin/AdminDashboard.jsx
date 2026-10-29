import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, TrendingUp, ShieldCheck, AlertTriangle,
  CheckCircle2, BarChart2, ShieldAlert, ArrowRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => {
        setStats(r.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 text-stone-400 text-sm">
          Loading platform metrics...
        </div>
        <Footer />
      </div>
    );
  }

  const COLORS = ['#059669', '#10b981', '#f59e0b', '#0284c7', '#8b5cf6'];
  const pieData = stats?.topServices?.map(s => ({ name: s._id, value: s.count })) || [];

  const STAT_CARDS = [
    { label: 'Registered Users', value: stats?.users?.total || 0, icon: Users, color: 'text-emerald-700', bg: 'bg-emerald-50 dark:bg-emerald-950/60' },
    { label: 'Active Workers', value: stats?.users?.workers || 0, icon: Briefcase, color: 'text-teal-700', bg: 'bg-teal-50 dark:bg-teal-950/60' },
    { label: 'Total Bookings', value: stats?.bookings?.total || 0, icon: BarChart2, color: 'text-indigo-700', bg: 'bg-indigo-50 dark:bg-indigo-950/60' },
    { label: 'Platform Volume', value: formatCurrency(stats?.revenue?.total || 0), icon: TrendingUp, color: 'text-emerald-700', bg: 'bg-emerald-50 dark:bg-emerald-950/60' },
    { label: 'KYC Verifications', value: stats?.pendingVerifications || 0, icon: ShieldCheck, color: 'text-amber-700', bg: 'bg-amber-50 dark:bg-amber-950/60' },
    { label: 'Suspended Accounts', value: stats?.users?.blocked || 0, icon: AlertTriangle, color: 'text-rose-700', bg: 'bg-rose-50 dark:bg-rose-950/60' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-8 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase mb-1.5">
              <ShieldCheck size={13} className="text-emerald-600" /> Platform Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              KaamConnect Control Center
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Real-time platform operations, verification queue, and transaction health.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { to: '/admin/users', label: 'Manage Users' },
              { to: '/admin/bookings', label: 'All Bookings' },
              { to: '/admin/verifications', label: 'KYC Reviews' }
            ].map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="btn-outline text-xs font-bold py-2 px-3 hover:border-emerald-300"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 6 Stats Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
          {STAT_CARDS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4 border border-stone-200/80 dark:border-stone-800 shadow-sm"
            >
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3 shadow-inner`}>
                <s.icon size={17} className={s.color} />
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                {s.value}
              </p>
              <p className="text-[11px] font-semibold text-stone-500 mt-0.5 uppercase tracking-wide truncate">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Monthly Trend */}
          <div className="lg:col-span-2 card p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm">
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white mb-4 tracking-tight">
              Monthly Booking Trends & Revenue Velocity
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    stats?.monthlyTrend?.map(d => ({
                      name: `${d._id.month}/${d._id.year}`,
                      bookings: d.count,
                      revenue: d.revenue
                    })) || []
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1917',
                      borderColor: '#44403C',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Line type="monotone" dataKey="bookings" stroke="#059669" strokeWidth={2.5} dot={false} name="Bookings" />
                  <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} dot={false} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Services Breakdown */}
          <div className="card p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white mb-4 tracking-tight">
              Service Distribution
            </h3>
            {pieData.length > 0 ? (
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={75} dataKey="value">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1C1917',
                        borderColor: '#44403C',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-stone-400 text-xs">
                No categorical data logged yet
              </div>
            )}
            <div className="space-y-1.5 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
              {pieData.slice(0, 4).map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="capitalize text-stone-600 dark:text-stone-300 font-medium">{d.name}</span>
                  </div>
                  <span className="font-bold text-stone-900 dark:text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Quick Action Navigation Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              to: '/admin/verifications',
              icon: '🪪',
              title: `${stats?.pendingVerifications || 0} Pending Verifications`,
              desc: 'Review Aadhaar, address proofs, and background filings.',
              alert: stats?.pendingVerifications > 0,
            },
            {
              to: '/admin/users',
              icon: '👥',
              title: 'User Management',
              desc: 'Inspect customer and partner accounts, manage suspension states.',
              alert: false,
            },
            {
              to: '/admin/bookings',
              icon: '📋',
              title: 'Master Booking Audit',
              desc: `${stats?.bookings?.total || 0} lifetime service requests on KaamConnect.`,
              alert: false,
            },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="card card-hover p-5 flex items-start gap-4 border border-stone-200/80 dark:border-stone-800"
            >
              <div className="text-3xl shrink-0">{a.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-stone-900 dark:text-white text-sm truncate">{a.title}</p>
                  {a.alert && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
