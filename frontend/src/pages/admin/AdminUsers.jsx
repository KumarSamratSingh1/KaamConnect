import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Ban, CheckCircle2, UserCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDate, getInitials } from '../../utils/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [pagination, setPagination] = useState({});

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { search, role, limit: 20 } });
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [search, role]);

  const toggleBlock = async (id, isBlocked) => {
    await api.patch(`/admin/users/${id}/block`, { reason: 'Administrative review' });
    toast.success(isBlocked ? 'User account restored' : 'User account suspended');
    loadUsers();
  };

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
              User Accounts Directory
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Manage platform customers, verified professionals, and suspension states.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="card p-4 mb-6 flex gap-3 flex-wrap border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or mobile..."
              className="input pl-10 text-xs sm:text-sm"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input text-xs sm:text-sm w-auto py-2"
          >
            <option value="">All Account Roles</option>
            <option value="customer">Customers</option>
            <option value="worker">Domestic Workers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400 text-sm">
            Loading user profiles...
          </div>
        ) : (
          <div className="card overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200/80 dark:border-stone-700">
                  <tr>
                    {['Member', 'Role', 'Account Status', 'Joined Date', 'Actions'].map((h) => (
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
                  {users.map((u) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs font-extrabold text-emerald-800 dark:text-emerald-300 shrink-0">
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 dark:text-white">{u.name}</p>
                            <p className="text-[11px] text-stone-400">{u.email} • {u.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`badge ${
                            u.role === 'worker'
                              ? 'badge-emerald'
                              : u.role === 'admin'
                              ? 'badge-amber'
                              : 'badge-stone'
                          } text-[11px] font-bold uppercase`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`badge ${
                            u.isBlocked ? 'badge-red' : 'badge-emerald'
                          } text-[11px] font-bold`}
                        >
                          {u.isBlocked ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-stone-500 text-xs">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => toggleBlock(u._id, u.isBlocked)}
                          className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                            u.isBlocked
                              ? 'text-emerald-700 hover:bg-emerald-50 bg-emerald-50/60 dark:bg-emerald-950'
                              : 'text-rose-600 hover:bg-rose-50 bg-rose-50/60 dark:bg-rose-950'
                          }`}
                        >
                          {u.isBlocked ? (
                            <>
                              <CheckCircle2 size={13} />
                              <span>Reactivate</span>
                            </>
                          ) : (
                            <>
                              <Ban size={13} />
                              <span>Suspend</span>
                            </>
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
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
