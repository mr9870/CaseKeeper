'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  CheckCircle, 
  MapPin, 
  Award, 
  Languages, 
  Send, 
  ArrowLeft, 
  ShieldCheck, 
  Briefcase, 
  Clock, 
  FileCheck 
} from 'lucide-react';
import { PublicNavbar, PublicFooter } from '@/components/PublicNav';
import { DEMO_LAWYERS } from '@/lib/mockData';
import { getLawyerById } from '@/lib/lawyerStore';
import { submitClientEnquiry } from '@/lib/enquiryStore';
import { Lawyer } from '@/lib/types';

function ProfileContent() {
  const params = useParams();
  const lawyerId = (params?.id as string) || 'lawyer-1';
  const [lawyer, setLawyer] = useState<Lawyer>(DEMO_LAWYERS[0]);

  React.useEffect(() => {
    const found = getLawyerById(lawyerId) || DEMO_LAWYERS.find(l => l.id === lawyerId) || DEMO_LAWYERS[0];
    setLawyer(found);
  }, [lawyerId]);

  const [enquirySent, setEnquirySent] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    caseCategory: 'Civil Disputes',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    const created = submitClientEnquiry({
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      lawyerEmail: lawyer.email,
      clientName: formData.name.trim(),
      clientEmail: formData.email.trim(),
      clientPhone: formData.phone.trim(),
      caseCategory: formData.caseCategory,
      message: formData.message.trim()
    });

    setSubmittedRefId(created.id);
    setEnquirySent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            href="/lawyers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#1B4FD8]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Advocate Directory</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Lawyer Profile Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
                <div className="w-20 h-20 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  {lawyer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">{lawyer.name}</h1>
                    {lawyer.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                        Verified Advocate
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-600">{lawyer.title}</p>
                  <p className="text-xs font-mono text-slate-400">Bar Enrollment: {lawyer.barNumber}</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 py-5 border-b border-slate-100 text-center">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Standing</p>
                  <p className="text-base font-extrabold text-[#0F172A]">{lawyer.experienceYears} Years</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Jurisdiction</p>
                  <p className="text-base font-extrabold text-[#0F172A]">{lawyer.city}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Rating</p>
                  <p className="text-base font-extrabold text-[#0F172A]">{lawyer.rating} / 5.0</p>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="py-5 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Professional Biography</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {lawyer.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Practice Areas & Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.practiceAreas.map((area, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-800 border border-blue-100 font-medium px-3 py-1 rounded-lg">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Languages for Consultation</h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    {lawyer.languages.join(' • ')}
                  </p>
                </div>
              </div>

              {/* Compliance Note */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Credentials and Bar Registration authenticated against official State Bar Council gazettes. Sending an enquiry initiates a private consultation request.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Case Consultation Enquiry Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-extrabold text-[#0F172A] mb-1">Send Consultation Enquiry</h2>
              <p className="text-xs text-slate-500 mb-6">
                Direct confidential enquiry sent to {lawyer.name}'s verified communication docket.
              </p>

              {enquirySent ? (
                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-emerald-900 text-sm">Enquiry Successfully Dispatched</h3>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Your consultation request has been sent to {lawyer.name}'s Advocate Workspace. Reference ID: <span className="font-mono font-bold bg-emerald-100 px-1.5 py-0.5 rounded">{submittedRefId || 'ENQ-2026-LIVE'}</span>.
                    The advocate will review your matter and contact you via phone or email.
                  </p>
                  <button
                    onClick={() => setEnquirySent(false)}
                    className="mt-2 text-xs font-bold text-emerald-800 underline"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@domain.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Case Category</label>
                    <select
                      value={formData.caseCategory}
                      onChange={(e) => setFormData({ ...formData, caseCategory: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8] bg-white text-slate-700"
                    >
                      <option value="Civil Disputes">Civil Disputes (Contract / Money / Injunction)</option>
                      <option value="Cooperative Societies">Cooperative Society / RWA Disputes</option>
                      <option value="Property & RERA">Property & RERA Complaints</option>
                      <option value="Consumer Complaints">Consumer Protection / e-Daakhil</option>
                      <option value="Agricultural Disputes">Agricultural / PMFBY Claims</option>
                      <option value="Criminal Matters">Criminal Defense / Bail</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Brief Description of Legal Issue *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your situation, dates of notice, or relief sought. Do not include bank passwords."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Consultation Enquiry</span>
                  </button>

                  <p className="text-[10px] text-slate-400 text-center leading-tight">
                    By submitting, you consent to sharing these contact details with {lawyer.name} for the purpose of scheduling a legal consultation.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

export default function LawyerProfilePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading advocate profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

