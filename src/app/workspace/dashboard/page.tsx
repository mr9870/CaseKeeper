'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  ArrowLeftRight, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  ChevronRight,
  Scale,
  Trash2,
  MessageSquare,
  Phone,
  Mail,
  User,
  FolderPlus,
  Sparkles,
  AlertTriangle,
  Layers,
  ShieldCheck,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { CaseItem, Handoff, CaseTask, Contradiction, EvidenceGap } from '@/lib/types';
import { 
  getStoredCases, 
  getStoredHandoffs, 
  getStoredTasks, 
  toggleTaskStatus,
  getCaseContradictions,
  getCaseEvidenceGaps,
  getCaseReadiness,
  resetDemoCase
} from '@/lib/caseStore';
import { getStoredEnquiries, updateEnquiryStatus, convertEnquiryToCase, ClientEnquiry } from '@/lib/enquiryStore';
import { getAuthUser } from '@/lib/authStore';
import { DEMO_CASE_ID, PRIMARY_DEMO_CASE } from '@/lib/demoCaseData';

export default function WorkspaceDashboard() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [tasks, setTasks] = useState<CaseTask[]>([]);
  const [enquiries, setEnquiries] = useState<ClientEnquiry[]>([]);
  const [lawyerName, setLawyerName] = useState('Advocate');
  const [barNumber, setBarNumber] = useState('');
  const [demoContradictionsCount, setDemoContradictionsCount] = useState(2);
  const [demoGapsCount, setDemoGapsCount] = useState(3);
  const [demoReadinessScore, setDemoReadinessScore] = useState(82);

  const loadData = () => {
    const storedCases = getStoredCases();
    setCases(storedCases);
    setHandoffs(getStoredHandoffs());
    setTasks(getStoredTasks());

    // Calculate live integrity engine stats for demo case or portfolio
    const demoCase = storedCases.find(c => c.id === DEMO_CASE_ID) || PRIMARY_DEMO_CASE;
    const contradictions = getCaseContradictions(demoCase.id);
    const gaps = getCaseEvidenceGaps(demoCase.id);
    const readiness = getCaseReadiness(demoCase.id);
    
    setDemoContradictionsCount(contradictions.filter(c => c.resolutionStatus === 'unresolved').length);
    setDemoGapsCount(gaps.filter(g => g.status === 'missing').length);
    setDemoReadinessScore(readiness.overallScore);

    const auth = getAuthUser();
    let email = '';
    let id = '';
    if (auth && auth.role === 'lawyer') {
      if (auth.name) setLawyerName(auth.name);
      if (auth.barNumber) setBarNumber(auth.barNumber);
      email = auth.email || '';
      id = auth.id || '';
    }

    setEnquiries(getStoredEnquiries(id, email));

    try {
      const rawProfile = localStorage.getItem('casekeeper_lawyer_profile');
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile);
        if (parsed.name) setLawyerName(parsed.name);
        if (parsed.barNumber) setBarNumber(parsed.barNumber);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('auth_changed', loadData);
    window.addEventListener('casekeeper_enquiry_submitted', loadData);
    window.addEventListener('casekeeper_enquiries_updated', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('auth_changed', loadData);
      window.removeEventListener('casekeeper_enquiry_submitted', loadData);
      window.removeEventListener('casekeeper_enquiries_updated', loadData);
    };
  }, []);

  const activeCasesCount = cases.filter(c => c.status === 'active').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;
  const upcomingHearingsCount = cases.filter(c => c.nextHearingDate).length;
  const pendingEnquiriesCount = enquiries.filter(e => e.status === 'pending').length;

  const handleConvertToCase = (enquiry: ClientEnquiry) => {
    convertEnquiryToCase(enquiry);
    loadData();
  };

  const handleStatusChange = (id: string, status: ClientEnquiry['status']) => {
    updateEnquiryStatus(id, status);
    loadData();
  };

  const handleResetDemo = () => {
    if (confirm('Reset hackathon demo case (Sharma v. Horizon Developers) to pristine benchmark state?')) {
      resetDemoCase();
      loadData();
    }
  };

  return (
    <AppShell activeNav="dashboard" breadcrumb="Advocate Command Center">
      <div className="space-y-6">
        
        {/* Welcome & Primary CTA Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Advocate Command Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">Welcome back, {lawyerName} • Bar Enrollment {barNumber || 'D/2018/BAR-DEL'}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors"
              title="Reset synthetic benchmark case to clean state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>

            <Link
              href="/workspace/cases/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Case</span>
            </Link>
          </div>
        </div>

        {/* HACKATHON BENCHMARK DEMO CASE BANNER (P0 GUARANTEE: NEVER EMPTY DASHBOARD) */}
        <div className="bg-gradient-to-r from-[#0A2540] via-[#0F172A] to-[#1E293B] text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>National Hackathon Benchmark Case</span>
                </span>
                <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                  {DEMO_CASE_ID}
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  Readiness: {demoReadinessScore}%
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
                {PRIMARY_DEMO_CASE.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Client purchased Flat 402; builder unilaterally delayed possession by 107 days and demanded ₹4,20,000 escalation. 9 synthetic dockets pre-loaded with cross-document contradictions and source pins.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span><strong>{demoContradictionsCount}</strong> Discrepancies Flagged</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-300">
                  <Layers className="w-4 h-4" />
                  <span><strong>{demoGapsCount}</strong> Evidence Gaps</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-300">
                  <Calendar className="w-4 h-4" />
                  <span>Next Hearing: <strong>{PRIMARY_DEMO_CASE.nextHearingDate}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <Link
                href={`/workspace/cases/${DEMO_CASE_ID}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-sm shadow-lg shadow-blue-900/60 transition-all border border-blue-400/30 text-center"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Open Case Intelligence Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <div className="flex gap-2">
                <Link
                  href={`/workspace/cases/${DEMO_CASE_ID}?tab=contradictions`}
                  className="flex-1 text-center px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                >
                  Contradictions ({demoContradictionsCount})
                </Link>
                <Link
                  href={`/workspace/cases/${DEMO_CASE_ID}?tab=handoff`}
                  className="flex-1 text-center px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-purple-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                >
                  Secure Handoff
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Key Metric Cards (Calculated from Actual Portfolio & Integrity Engine) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Active Litigation Cases</p>
              <h3 className="text-2xl font-black text-[#0F172A] mt-1">{activeCasesCount}</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Ready for Review</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1B4FD8] flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Unresolved Contradictions</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{demoContradictionsCount}</h3>
              <p className="text-[11px] text-amber-700 font-medium mt-1">Cross-Docket Discrepancies</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Upcoming Hearings</p>
              <h3 className="text-2xl font-black text-[#0F172A] mt-1">{upcomingHearingsCount}</h3>
              <p className="text-[11px] text-blue-600 font-medium mt-1">Listed Benches</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <Link href="/workspace/enquiries" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between hover:border-amber-400 transition-colors">
            <div>
              <p className="text-xs font-semibold text-slate-500">Citizen Enquiries</p>
              <h3 className="text-2xl font-black text-[#0F172A] mt-1">{pendingEnquiriesCount}</h3>
              <p className="text-[11px] text-amber-600 font-medium mt-1">
                {pendingEnquiriesCount > 0 ? 'Pending Review' : 'From Public Portal'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* INCOMING CLIENT ENQUIRIES SECTION */}
        {enquiries.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-amber-300 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-amber-100 bg-amber-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                  <span>Public Portal Client Consultation Enquiries</span>
                  {pendingEnquiriesCount > 0 && (
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-extrabold uppercase">
                      {pendingEnquiriesCount} New
                    </span>
                  )}
                </h2>
                <p className="text-xs text-amber-800">
                  Direct consultation enquiries submitted by citizens from your verified advocate profile.
                </p>
              </div>
              <Link
                href="/workspace/enquiries"
                className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
              >
                <span>View All ({enquiries.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {enquiries.slice(0, 3).map((enquiry) => (
                <div key={enquiry.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {enquiry.id}
                      </span>
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>{enquiry.clientName}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        {enquiry.caseCategory}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        enquiry.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        enquiry.status === 'converted' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {enquiry.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      {enquiry.clientPhone && (
                        <a href={`tel:${enquiry.clientPhone}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{enquiry.clientPhone}</span>
                        </a>
                      )}
                      {enquiry.clientEmail && (
                        <a href={`mailto:${enquiry.clientEmail}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline font-mono">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{enquiry.clientEmail}</span>
                        </a>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(enquiry.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 line-clamp-2">
                      "{enquiry.message}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {enquiry.status !== 'converted' ? (
                      <button
                        onClick={() => handleConvertToCase(enquiry)}
                        className="px-3 py-1.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                        title="Create active litigation case from this enquiry"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                        <span>Convert to Case</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>Case Created</span>
                      </span>
                    )}

                    {enquiry.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(enquiry.id, 'accepted')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-Column Split: Recent Cases Table (Left 65%) + Hearings & Tasks (Right 35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Recent Cases Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">Registered Litigation Cases</h2>
                  <p className="text-xs text-slate-500">Directly launch the 3-Panel Case Intelligence Workspace for any docket.</p>
                </div>
                <Link
                  href="/workspace/cases"
                  className="text-xs font-bold text-[#1B4FD8] hover:underline flex items-center gap-1"
                >
                  <span>View All ({cases.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {cases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Case Title & Reference</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Readiness / Status</th>
                        <th className="py-3 px-4">Next Hearing</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cases.slice(0, 5).map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <Link 
                                href={`/workspace/cases/${c.id}`} 
                                className="font-bold text-[#0F172A] hover:text-[#1B4FD8] flex items-center gap-1.5"
                              >
                                <span>{c.title}</span>
                                {c.id === DEMO_CASE_ID && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase">
                                    Demo
                                  </span>
                                )}
                              </Link>
                              {c.notes && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold shrink-0" title={c.notes}>
                                  Note
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-slate-400 block">{c.referenceNumber}</span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-600">
                            {c.category}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                c.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {c.status}
                              </span>
                              {c.id === DEMO_CASE_ID && (
                                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                  {demoReadinessScore}%
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {c.nextHearingDate || 'TBD'}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <Link
                              href={`/workspace/cases/${c.id}`}
                              className="text-[#1B4FD8] hover:underline font-bold text-[11px] inline-flex items-center gap-0.5"
                            >
                              <span>Workspace</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-2">
                  <p className="text-xs text-slate-500">No cases currently in portfolio.</p>
                  <Link
                    href="/workspace/cases/new"
                    className="inline-block text-xs font-bold text-[#1B4FD8] hover:underline"
                  >
                    + Register your first case matter
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions Strip */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm">Need to transfer a case to co-counsel?</h4>
                <p className="text-xs text-slate-300 mt-0.5">Use Secure Lawyer Handoff with client consent verification and instant revocation.</p>
              </div>
              <Link
                href="/workspace/handoffs"
                className="px-4 py-2 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow transition-colors shrink-0"
              >
                Handoff Center →
              </Link>
            </div>
          </div>

          {/* Right Column: Upcoming Hearings & Tasks */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Upcoming Hearings */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Upcoming Hearings</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Scheduled</span>
              </div>

              <div className="space-y-3">
                {cases.filter(c => c.nextHearingDate).slice(0, 3).map((c) => (
                  <div key={c.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-700 font-mono">{c.nextHearingDate}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold truncate max-w-[120px]">{c.referenceNumber}</span>
                    </div>
                    <Link href={`/workspace/cases/${c.id}`} className="text-xs font-bold text-slate-800 hover:text-blue-600 block truncate">
                      {c.title}
                    </Link>
                    <p className="text-[11px] text-slate-500 truncate">{c.court || c.jurisdiction}</p>
                  </div>
                ))}
                {cases.filter(c => c.nextHearingDate).length === 0 && (
                  <p className="text-xs text-slate-400 italic">No upcoming hearings scheduled.</p>
                )}
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Pending Action Items</span>
                </h3>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  {pendingTasksCount} Tasks
                </span>
              </div>

              <div className="space-y-2.5">
                {tasks.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors flex items-start gap-2.5 text-xs">
                    <input 
                      type="checkbox" 
                      checked={t.status === 'completed'}
                      onChange={() => {
                        toggleTaskStatus(t.id);
                        setTasks(getStoredTasks());
                      }}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                    <div className="flex-1">
                      <p className={`font-semibold leading-tight ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-slate-500">Due: {t.dueDate}</span>
                        {t.isSuggestion && (
                          <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 rounded font-semibold">
                            AI Suggestion
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No pending tasks. Register a case with hearing date to auto-schedule tasks.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
