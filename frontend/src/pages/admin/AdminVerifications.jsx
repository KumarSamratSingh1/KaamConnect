import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, XCircle, ArrowLeft, FileText, User, ExternalLink } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDate, getInitials } from '../../utils/helpers';

export default function AdminVerifications() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/admin/verifications')
      .then(r => {
        setProfiles(r.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleVerify = async (userId, status) => {
    try {
      await api.patch(`/admin/workers/${userId}/verify`, {
        status,
        badges: ['aadhaar', 'address_proof', 'background_check']
      });
      toast.success(`Worker verification status set to: ${status}`);
      load();
    } catch (e) {
      toast.error('Failed to update verification status.');
    }
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
              KYC & Verification Queue ({profiles.length})
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Review government Aadhaar documents, Word resumes, and verification filings.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400 text-sm">
            Loading verification queue...
          </div>
        ) : profiles.length === 0 ? (
          <div className="card p-12 text-center text-stone-400 border border-stone-200/80 dark:border-stone-800 shadow-sm">
            <ShieldCheck size={36} className="mx-auto mb-3 text-emerald-600 opacity-60" />
            <p className="font-bold text-base text-stone-800 dark:text-stone-200">
              All Verification Requests Cleared!
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              There are currently no domestic worker applications pending manual review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs font-extrabold text-emerald-800 dark:text-emerald-300 shrink-0">
                    {getInitials(p.user?.name)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                        {p.user?.name}
                      </p>
                      <span className="badge badge-amber text-[10px] uppercase font-bold">
                        Pending Verification
                      </span>
                    </div>

                    <p className="text-xs text-stone-500">
                      {p.user?.email} • {p.user?.phone}
                    </p>

                    <p className="text-xs text-stone-400 mt-1">
                      Submitted: {formatDate(p.createdAt)} • Experience: {p.experience || 0} years • Skills: {p.skills?.join(', ') || 'General Domestic'}
                    </p>

                    {/* Uploaded Documents List */}
                    <div className="flex gap-2 mt-2.5 flex-wrap">
                      {p.documents && p.documents.length > 0 ? (
                        p.documents.map((d, idx) => (
                          <a
                            key={idx}
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition-all shadow-xs"
                            title={`Open ${d.name || d.type}`}
                          >
                            <FileText size={13} className="text-emerald-600" />
                            <span className="capitalize">{d.name || `${d.type?.replace('_', ' ')} Document`}</span>
                            <ExternalLink size={11} className="opacity-70" />
                          </a>
                        ))
                      ) : (
                        <>
                          <span className="badge badge-emerald text-[11px] font-semibold">
                            <FileText size={11} /> Aadhaar Record
                          </span>
                          <span className="badge badge-stone text-[11px] font-semibold">
                            <FileText size={11} /> Address Proof
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => handleVerify(p.user?._id, 'verified')}
                    className="btn-primary text-xs font-bold py-2 px-4 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve & Grant Badge</span>
                  </button>

                  <button
                    onClick={() => handleVerify(p.user?._id, 'rejected')}
                    className="btn-outline text-xs font-bold py-2 px-3 text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
