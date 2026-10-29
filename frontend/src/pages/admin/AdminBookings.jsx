import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, Calendar } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../utils/api';
import { BOOKING_STATUS_CONFIG, formatDate, formatCurrency } from '../../utils/helpers';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/admin/bookings', { params: { status, limit: 30 } })
      .then(r => {
        setBookings(r.data.data.bookings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/admin" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                <ArrowLeft size={13} /> Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Master Booking Log
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Comprehensive ledger of customer appointments, statuses, and settlements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input text-xs sm:text-sm w-auto py-2"
            >
              <option value="">All Statuses ({bookings.length})</option>
              {Object.entries(BOOKING_STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400 text-sm">
            Loading bookings...
          </div>
        ) : (
          <div className="card overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200/80 dark:border-stone-700">
                  <tr>
                    {['Booking Ref', 'Customer', 'Assigned Pro', 'Category', 'Lifecycle State', 'Total Bill', 'Logged Date'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[11px] font-bold text-stone-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {bookings.map((b) => {
                    const cfg = BOOKING_STATUS_CONFIG[b.status] || {};
                    return (
                      <tr
                        key={b._id}
                        className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors"
                      >
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-stone-700 dark:text-stone-300">
                          {b.bookingId || b._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-stone-900 dark:text-white">
                          {b.customer?.name || '—'}
                        </td>
                        <td className="px-4 py-3.5 text-stone-600 dark:text-stone-300">
                          {b.worker?.name || '—'}
                        </td>
                        <td className="px-4 py-3.5 capitalize text-stone-600 dark:text-stone-300">
                          {b.primaryService || 'Service'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`badge ${cfg.color || 'badge-amber'} text-[11px] font-bold`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-extrabold text-emerald-700 dark:text-emerald-400">
                          {b.pricing?.totalAmount ? formatCurrency(b.pricing.totalAmount) : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-stone-400 text-xs">
                          {formatDate(b.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
