import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Upload,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Loader2,
  FileText,
  Trash2,
  ExternalLink
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { SKILLS, LANGUAGES, WORK_TYPES } from '../../utils/helpers';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Skills & Experience', 'Availability', 'Compensation', 'KYC & Document Upload'];

export default function WorkerOnboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    skills: [],
    experience: 2,
    experienceDescription: '',
    workType: 'part-time',
    shifts: ['morning'],
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '07:00',
    endTime: '15:00',
    expectedSalary: { min: 8000, max: 15000, per: 'month' },
    serviceRadius: 15,
    languagesKnown: ['Hindi'],
    preferredAreas: []
  });

  const [uploadedDocs, setUploadedDocs] = useState({});
  const [uploadingKey, setUploadingKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-fill profile and uploaded documents if they exist
    api.get('/workers/my/profile')
      .then(res => {
        const p = res.data?.data;
        if (p) {
          setForm(f => ({
            ...f,
            skills: p.skills || f.skills,
            experience: p.experience !== undefined ? p.experience : f.experience,
            experienceDescription: p.experienceDescription || f.experienceDescription,
            workType: p.workType || f.workType,
            shifts: p.shifts?.length ? p.shifts : f.shifts,
            workDays: p.workDays?.length ? p.workDays : f.workDays,
            startTime: p.startTime || f.startTime,
            endTime: p.endTime || f.endTime,
            expectedSalary: p.expectedSalary?.min ? p.expectedSalary : f.expectedSalary,
            serviceRadius: p.serviceRadius || f.serviceRadius,
            languagesKnown: p.languagesKnown?.length ? p.languagesKnown : f.languagesKnown
          }));

          if (p.documents && Array.isArray(p.documents)) {
            const docMap = {};
            p.documents.forEach(d => {
              if (d.type) docMap[d.type] = d;
            });
            setUploadedDocs(docMap);
          }
        }
      })
      .catch(() => {});
  }, []);

  const toggleSkill = (id) =>
    setForm(f => ({
      ...f,
      skills: f.skills.includes(id) ? f.skills.filter(s => s !== id) : [...f.skills, id]
    }));

  const toggleLang = (l) =>
    setForm(f => ({
      ...f,
      languagesKnown: f.languagesKnown.includes(l) ? f.languagesKnown.filter(x => x !== l) : [...f.languagesKnown, l]
    }));

  const handleFileUpload = async (docKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      toast.error('Supported formats: PDF (.pdf), Word (.doc, .docx), and Images (.jpg, .png, .webp)');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size exceeds the 25MB limit.');
      return;
    }

    setUploadingKey(docKey);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('docType', docKey);

    try {
      const res = await api.post('/workers/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const returnedDoc = res.data?.data?.document || {
        type: docKey,
        name: file.name,
        url: res.data?.data?.document?.url
      };
      setUploadedDocs(prev => ({ ...prev, [docKey]: returnedDoc }));
      toast.success(`${file.name} uploaded successfully! 🎉`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Document upload failed. Please verify the file and try again.';
      toast.error(msg);
    } finally {
      setUploadingKey(null);
      e.target.value = '';
    }
  };

  const handleRemoveDoc = async (docKey) => {
    try {
      await api.delete(`/workers/document/${docKey}`);
      setUploadedDocs(prev => {
        const next = { ...prev };
        delete next[docKey];
        return next;
      });
      toast.success('Document removed.');
    } catch (err) {
      toast.error('Failed to remove document.');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/workers/profile', form);
      toast.success('Professional profile updated successfully! 🎉');
      navigate('/worker/dashboard');
    } catch(e) {
      toast.error('Failed to save profile. Please review fields.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 flex flex-col text-stone-900 dark:text-stone-100">
      <Navbar />

      <main className="page-container py-10 max-w-2xl mx-auto flex-1">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase mb-2">
            <ShieldCheck size={13} className="text-emerald-600" /> Professional Registration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Complete Your KaamConnect Partner Profile
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Verified partners receive up to 3x more direct booking requests.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  i <= step ? 'bg-emerald-600' : 'bg-stone-200 dark:bg-stone-800'
                }`}
              />
              <p
                className={`text-[11px] mt-1.5 text-center font-bold truncate ${
                  i === step
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-stone-400'
                }`}
              >
                {s}
              </p>
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-md"
        >
          {/* STEP 0: SKILLS */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-1">
                  1. Skills & Experience
                </h2>
                <p className="text-xs text-stone-500">Pick the domestic tasks you are experienced in providing.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SKILLS.map((skill) => {
                  const selected = form.skills.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                        selected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 shadow-sm'
                          : 'border-stone-200 dark:border-stone-700 hover:border-emerald-300 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="text-xs font-bold">{skill.label}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  Years of Professional Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) || 0 })}
                  className="input text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  About Your Work Experience & Specialities
                </label>
                <textarea
                  value={form.experienceDescription}
                  onChange={(e) => setForm({ ...form, experienceDescription: e.target.value })}
                  className="input resize-none text-xs sm:text-sm"
                  rows={3}
                  placeholder="e.g. 5 years experience cooking vegetarian North & South Indian meals, highly punctual, trusted by families in Bhopal..."
                />
              </div>
            </div>
          )}

          {/* STEP 1: AVAILABILITY */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-1">
                  2. Schedule & Working Hours
                </h2>
                <p className="text-xs text-stone-500">Specify your available shifts and communication languages.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                  Work Engagement Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {WORK_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm({ ...form, workType: t.id })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        form.workType === t.id
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Shift Start Time
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="input text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Shift End Time
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="input text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => toggleLang(l)}
                      className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                        form.languagesKnown.includes(l)
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SALARY & RADIUS */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-1">
                  3. Expected Compensation & Coverage
                </h2>
                <p className="text-xs text-stone-500">Set fair pricing and how far you can travel for assignments.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Minimum Monthly Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={form.expectedSalary.min}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        expectedSalary: { ...form.expectedSalary, min: parseInt(e.target.value) || 0 }
                      })
                    }
                    className="input text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Maximum Monthly Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={form.expectedSalary.max}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        expectedSalary: { ...form.expectedSalary, max: parseInt(e.target.value) || 0 }
                      })
                    }
                    className="input text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Travel Coverage Radius
                  </label>
                  <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400">
                    {form.serviceRadius} km
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={form.serviceRadius}
                  onChange={(e) => setForm({ ...form, serviceRadius: parseInt(e.target.value) })}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>1 km (Local ward)</span>
                  <span>50 km (Across city)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: KYC & DOCUMENT UPLOAD */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-1">
                  4. Government ID & Document Verification
                </h2>
                <p className="text-xs text-stone-500">
                  Upload your Aadhaar, Resume, or Address proof as PDF, Word (.doc, .docx), or Image files.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: 'aadhaar',
                    label: 'Aadhaar Card / Government ID',
                    icon: '🪪',
                    desc: 'Aadhaar, Voter ID, or Driving License'
                  },
                  {
                    key: 'resume',
                    label: 'Resume / Experience Certificate',
                    icon: '📄',
                    desc: 'Word document (.docx, .doc) or PDF resume'
                  },
                  {
                    key: 'address_proof',
                    label: 'Address Proof / Utility Bill',
                    icon: '🏠',
                    desc: 'Electricity bill, rent agreement, or ration card'
                  },
                  {
                    key: 'photo_id',
                    label: 'Recent Passport Photograph',
                    icon: '📸',
                    desc: 'Clear front-facing headshot'
                  }
                ].map((doc) => {
                  const uploaded = uploadedDocs[doc.key];
                  const isUploading = uploadingKey === doc.key;

                  return (
                    <div
                      key={doc.key}
                      className={`p-4 rounded-2xl border transition-all ${
                        uploaded
                          ? 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800'
                          : 'border-dashed border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs">
                            {doc.icon}
                          </span>
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                              {doc.label}
                            </p>
                            <p className="text-[11px] text-stone-400">
                              {doc.desc} • PDF, Word, JPG, PNG (Max 25MB)
                            </p>
                            {uploaded && (
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                                <CheckCircle2 size={13} className="text-emerald-600" />
                                <span className="truncate max-w-[200px] sm:max-w-xs">
                                  {uploaded.name || `${doc.key.toUpperCase()} Uploaded`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          {uploaded ? (
                            <>
                              {uploaded.url && (
                                <a
                                  href={uploaded.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-outline text-xs font-bold py-1.5 px-2.5 flex items-center gap-1 text-emerald-700 hover:text-emerald-800 border-emerald-300"
                                  title="View document"
                                >
                                  <ExternalLink size={12} />
                                  <span>View</span>
                                </a>
                              )}
                              <label className="btn-secondary text-xs font-bold py-1.5 px-3 cursor-pointer">
                                <span>Replace</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                                  onChange={(e) => handleFileUpload(doc.key, e)}
                                  disabled={isUploading}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleRemoveDoc(doc.key)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 transition-colors"
                                title="Remove file"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <label className="btn-secondary text-xs font-bold py-1.5 px-3.5 cursor-pointer flex items-center gap-1.5">
                              {isUploading ? (
                                <>
                                  <Loader2 size={13} className="animate-spin text-emerald-600" />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload size={13} className="text-emerald-600" />
                                  <span>Upload File</span>
                                </>
                              )}
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                                onChange={(e) => handleFileUpload(doc.key, e)}
                                disabled={isUploading}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  KaamConnect promises strict privacy. Your government documents, resumes, and identification files are encrypted and used exclusively for background verification.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="flex gap-3 mt-8 pt-5 border-t border-stone-100 dark:border-stone-800">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="btn-outline flex-1 text-xs font-bold py-2.5"
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="btn-primary flex-1 text-xs font-bold py-2.5 flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex-1 text-xs font-bold py-3 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                <span>{loading ? 'Submitting...' : 'Save & Publish Profile'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
