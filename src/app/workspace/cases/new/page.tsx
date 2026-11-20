'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Briefcase, 
  Save, 
  Scale, 
  Building, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { registerNewCase } from '@/lib/caseStore';

export default function NewCasePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    referenceNumber: '',
    category: 'Civil Disputes',
    jurisdiction: '',
    court: '',
    petitioner: '',
    respondent: '',
    nextHearingDate: '',
    description: '',
    notes: '',
    status: 'active' as const
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Civil Disputes',
    'Criminal Matters',
    'Family Law',
    'Property & RERA',
    'Consumer Complaints',
    'Agricultural Disputes',
    'Cooperative Society',
    'Legal Aid / Lok Adalat'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);

    try {
      const created = registerNewCase({
        title: formData.title.trim(),
        referenceNumber: formData.referenceNumber.trim() || `CASE/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
        category: formData.category,
        jurisdiction: formData.jurisdiction.trim() || 'Jurisdiction District Court',
        court: formData.court.trim() || 'Court Room 1',
        status: formData.status,
        parties: {
          petitioner: formData.petitioner.trim() || 'Petitioner',
          respondent: formData.respondent.trim() || 'Respondent'
        },
        nextHearingDate: formData.nextHearingDate || undefined,
        description: formData.description.trim(),
        notes: formData.notes.trim()
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/workspace/cases/${created.id}/briefs`);
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell activeNav="cases" breadcrumb="Register New Case Docket">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link 
                href="/workspace/cases" 
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Cases</span>
              </Link>
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Register New Case Matter</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter court filing dockets, litigating parties, and confidential advocate strategy notes.
            </p>
          </div>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center gap-3 text-emerald-800 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Case Docket Registered Successfully!</p>
              <p className="text-[11px] text-emerald-700">Redirecting to your new case brief and document workspace...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          
          {/* SECTION 1: Case Identification */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>1. Case Matter & Docket Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Case Title / Cause of Action *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Ramesh Kumar vs. State of Delhi & Ors."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CNR / Reference / Filing Number</label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  placeholder="e.g. DLSW010023452024 or WP(C)/1102/2024"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Category / Practice Area *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jurisdiction / State Authority</label>
                <input
                  type="text"
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  placeholder="e.g. Delhi High Court / RERA Haryana"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Court Room / Bench / Judge</label>
                <input
                  type="text"
                  value={formData.court}
                  onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                  placeholder="e.g. Court Room 14, Hon'ble Division Bench"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Litigating Parties */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>2. Litigating Parties</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Petitioner / Plaintiff Name *</label>
                <input
                  type="text"
                  required
                  value={formData.petitioner}
                  onChange={(e) => setFormData({ ...formData, petitioner: e.target.value })}
                  placeholder="e.g. Suresh Kumar Sharma (Client)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Respondent / Defendant Name *</label>
                <input
                  type="text"
                  required
                  value={formData.respondent}
                  onChange={(e) => setFormData({ ...formData, respondent: e.target.value })}
                  placeholder="e.g. New Era Cooperative Housing Society Ltd."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Bench Date & Case Summary */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>3. Calendar & Pleadings Overview</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Next Scheduled Hearing Date</label>
                <input
                  type="date"
                  value={formData.nextHearingDate}
                  onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                >
                  <option value="active">Active (Pending Adjudication)</option>
                  <option value="pending">Pending Admission / Scrutiny</option>
                  <option value="archived">Archived / Disposed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Matter Summary / Dispute Overview</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of claims, statutory violations, or interim stay relief sought..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: LAWYER CONFIDENTIAL NOTES FEATURE (User Requested) */}
          <div className="pt-4 border-t border-slate-100 space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200/70">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>4. Advocate Confidential Strategy Notes (Editable)</span>
              </h2>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                Lawyer Only • Private
              </span>
            </div>

            <p className="text-[11px] text-amber-800 leading-relaxed">
              Write case strategy, client instructions, witness remarks, cross-examination points, or legal precedents here. These notes remain strictly private to your advocate workspace and can be updated anytime.
            </p>

            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Check Registry record room for 2023 AGM attendance register. Inquire if notice was sent via Registered AD or standard post. File stay application prior to next listing..."
              className="w-full p-3 text-xs rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 leading-relaxed font-sans"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/workspace/cases"
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Docket...' : 'Register Case Matter'}</span>
            </button>
          </div>

        </form>

      </div>
    </AppShell>
  );
}
