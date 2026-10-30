import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  FileText,
  User,
  ExternalLink,
  Download,
  X,
  Eye,
  FileDown,
  FileCode
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { formatDate, getInitials } from '../../utils/helpers';

export default function AdminVerifications() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);

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

  const getDocTypeLabel = (type) => {
    switch (type) {
      case 'aadhaar':
        return 'Aadhaar Card';
      case 'resume':
        return 'Resume / CV';
      case 'address_proof':
        return 'Address Proof';
      case 'photo_id':
        return 'Government Photo ID';
      default:
        return `${type?.replace('_', ' ') || 'Verification'} Document`;
    }
  };

  const getFileExtension = (doc) => {
    const raw = doc.name || doc.url || doc.publicId || '';
    return raw.split('.').pop().toLowerCase();
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
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs font-extrabold text-emerald-800 dark:text-emerald-300 shrink-0">
                    {getInitials(p.user?.name)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {p.documents && p.documents.length > 0 ? (
                        p.documents.map((d, idx) => {
                          const docUrl = d.viewUrl || d.url;
                          const ext = getFileExtension(d);
                          const isWord = ['doc', 'docx'].includes(ext);

                          return (
                            <div
                              key={idx}
                              className="inline-flex items-center rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 shadow-xs overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() => setPreviewDoc({ ...d, workerName: p.user?.name, url: docUrl, ext })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                                title={`Inspect ${d.name || d.type}`}
                              >
                                <Eye size={13} className="text-emerald-600" />
                                <span className="capitalize">{d.name || getDocTypeLabel(d.type)}</span>
                                <span className="text-[10px] uppercase px-1 py-0.2 bg-emerald-200/60 dark:bg-emerald-900 rounded font-mono">
                                  {ext}
                                </span>
                              </button>

                              <a
                                href={docUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200/50 dark:hover:bg-emerald-900 border-l border-emerald-200 dark:border-emerald-800 transition-colors"
                                title="Open full screen in new tab"
                              >
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex gap-2">
                          <span className="badge badge-emerald text-[11px] font-semibold">
                            <FileText size={11} /> Aadhaar Record
                          </span>
                          <span className="badge badge-stone text-[11px] font-semibold">
                            <FileText size={11} /> Address Proof
                          </span>
                        </div>
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

      {/* Interactive Document Inspection Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 sm:px-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 bg-stone-50/70 dark:bg-stone-900/70">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white truncate">
                        {previewDoc.name || getDocTypeLabel(previewDoc.type)}
                      </h3>
                      <span className="badge badge-emerald text-[10px] uppercase font-mono">
                        {previewDoc.ext || 'doc'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 truncate">
                      Worker: <span className="font-semibold text-stone-700 dark:text-stone-300">{previewDoc.workerName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={previewDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-xs font-bold py-1.5 px-3 flex items-center gap-1.5 text-stone-700 dark:text-stone-300"
                    title="Open in new window"
                  >
                    <ExternalLink size={13} />
                    <span className="hidden sm:inline">Open New Tab</span>
                  </a>

                  <a
                    href={previewDoc.url}
                    download={previewDoc.name || `document.${previewDoc.ext || 'pdf'}`}
                    className="btn-primary text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
                    title="Download document"
                  >
                    <Download size={13} />
                    <span className="hidden sm:inline">Download</span>
                  </a>

                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    title="Close preview"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body / Viewer */}
              <div className="p-3 sm:p-5 flex-1 overflow-auto bg-stone-100/50 dark:bg-stone-950 flex items-center justify-center min-h-[50vh]">
                {['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(previewDoc.ext) ? (
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.name || 'Worker Document'}
                    className="max-h-[70vh] w-auto max-w-full rounded-xl shadow-md border border-stone-200/80 dark:border-stone-800 object-contain mx-auto"
                  />
                ) : previewDoc.ext === 'pdf' ? (
                  <iframe
                    src={previewDoc.url}
                    title="PDF Document Preview"
                    className="w-full h-[70vh] rounded-xl border border-stone-200 dark:border-stone-800 bg-white"
                  />
                ) : ['doc', 'docx'].includes(previewDoc.ext) ? (
                  <div className="w-full h-[70vh] flex flex-col">
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewDoc.url)}&embedded=true`}
                      title="Word Document Preview"
                      className="w-full flex-1 rounded-xl border border-stone-200 dark:border-stone-800 bg-white"
                    />
                    <div className="mt-2 text-center text-xs text-stone-400">
                      Viewing Word file via Office / Google Docs viewer. You can also download it directly with the button above.
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={previewDoc.url}
                    title="Document Preview"
                    className="w-full h-[70vh] rounded-xl border border-stone-200 dark:border-stone-800 bg-white"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
