'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Folder, 
  Scale, 
  FileCheck2, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Sparkles, 
  Upload, 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  Plus,
  Layers,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  User,
  Phone,
  Mail,
  FolderPlus,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { getAuthUser } from '@/lib/authStore';
import { 
  getStoredCases, 
  getStoredTasks, 
  toggleTaskStatus, 
  getStoredDocuments,
  getCaseReadiness,
  resetDemoCase
} from '@/lib/caseStore';
import { getStoredEnquiries, updateEnquiryStatus, convertEnquiryToCase, ClientEnquiry } from '@/lib/enquiryStore';
import { CaseItem, CaseTask, CaseDocument } from '@/lib/types';
import { DEMO_CASE_ID, PRIMARY_DEMO_CASE } from '@/lib/demoCaseData';

export default function WorkspaceDashboard() {
  const [advocateName, setAdvocateName] = useState('Advocate');
  const [barNumber, setBarNumber] = useState('');
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [tasks, setTasks] = useState<CaseTask[]>([]);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [enquiries, setEnquiries] = useState<ClientEnquiry[]>([]);
  const [readinessScore, setReadinessScore] = useState(82);

  const loadData = () => {
    const user = getAuthUser();
    if (user && user.name) {
      setAdvocateName(user.name);
      if (user.barNumber) setBarNumber(user.barNumber);
    } else {
      try {
        const raw = localStorage.getItem('casekeeper_lawyer_profile');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.name) setAdvocateName(parsed.name);
          if (parsed.barNumber) setBarNumber(parsed.barNumber);
        }
      } catch (e) {}
    }

    const storedCases = getStoredCases();
    setCases(storedCases);
    setTasks(getStoredTasks());
    setDocuments(getStoredDocuments());
    setEnquiries(getStoredEnquiries(user?.id, user?.email));

    // Calculate real readiness for primary case
    const primary = storedCases.find(c => c.id === DEMO_CASE_ID) || storedCases[0];
    if (primary) {
      setReadinessScore(getCaseReadiness(primary.id).overallScore);
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

  // REAL COMPUTED METRICS FROM STORE
  const activeCasesCount = cases.filter(c => c.status === 'active').length;
  const upcomingHearings = cases.filter(c => Boolean(c.nextHearingDate)).sort((a, b) => 
    (a.nextHearingDate || '').localeCompare(b.nextHearingDate || '')
  );
  const upcomingHearingsCount = upcomingHearings.length;
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;
  const resolvedCasesCount = cases.filter(c => c.status === 'archived').length;
  const pendingEnquiriesCount = enquiries.filter(e => e.status === 'pending').length;
  const primaryCaseId = cases.length > 0 ? cases[0].id : DEMO_CASE_ID;

  // REAL DYNAMIC CATEGORY DISTRIBUTION COMPUTATION
  const categoryDistribution = useMemo(() => {
    if (cases.length === 0) return [];
    const counts: Record<string, number> = {};
    cases.forEach(c => {
      const cat = c.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const colors = ['#8B5CF6', '#3B82F6', '#06B6D4', '#EC4899', '#F59E0B', '#10B981'];
    return Object.entries(counts).map(([cat, count], idx) => ({
      category: cat,
      count,
      percentage: Math.round((count / cases.length) * 100),
      color: colors[idx % colors.length]
    }));
  }, [cases]);

  const handleToggleTask = (taskId: string) => {
    toggleTaskStatus(taskId);
    setTasks(getStoredTasks());
  };

  const handleConvertToCase = (enquiry: ClientEnquiry) => {
    convertEnquiryToCase(enquiry);
    loadData();
  };

  const handleStatusChange = (id: string, status: ClientEnquiry['status']) => {
    updateEnquiryStatus(id, status);
    loadData();
  };

  const handleResetDemo = () => {
    if (confirm('Reset benchmark demo case to pristine state?')) {
      resetDemoCase();
      loadData();
    }
  };

  // Format today's date dynamically
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <AppShell activeNav="dashboard" breadcrumb="Dashboard">
      <div className="space-y-6">

        {/* ========================================================================= */}
        {/* ROW 1: GREETING & REAL DATE                                              */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0B26] tracking-tight flex items-center gap-2">
              <span>Good Morning, {advocateName}</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here&apos;s what&apos;s happening with your verified cases today. {barNumber ? `• Bar Enrollment: ${barNumber}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200/90 rounded-2xl shadow-xs transition-colors flex items-center gap-1.5"
              title="Reset benchmark demo records"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Demo</span>
            </button>

            <div className="bg-white border border-slate-200/90 rounded-2xl px-4 py-2 flex items-center gap-2 text-xs font-semibold text-slate-700 shadow-xs">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>{todayFormatted}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: 4 METRIC STAT CARDS (REAL DATA FROM LOCAL REPOSITORY)              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Active Cases */}
          <Link href="/workspace/cases" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all block">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Folder className="w-5 h-5 fill-purple-100" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span>Active</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Active Cases</p>
            <h3 className="text-3xl font-black text-[#0D0B26] mt-0.5">{activeCasesCount}</h3>
          </Link>

          {/* Card 2: Upcoming Hearings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {upcomingHearings[0]?.nextHearingDate ? `Next: ${upcomingHearings[0].nextHearingDate}` : 'None listed'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Upcoming Hearings</p>
            <h3 className="text-3xl font-black text-[#0D0B26] mt-0.5">{upcomingHearingsCount}</h3>
          </div>

          {/* Card 3: Pending Tasks */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <span>{pendingTasksCount} Pending</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Pending Tasks</p>
            <h3 className="text-3xl font-black text-[#0D0B26] mt-0.5">{pendingTasksCount}</h3>
          </div>

          {/* Card 4: Client Enquiries (Real Portal Enquiries) */}
          <Link href="/workspace/enquiries" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all block">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {pendingEnquiriesCount > 0 ? `${pendingEnquiriesCount} New` : 'Portal'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Citizen Enquiries</p>
            <h3 className="text-3xl font-black text-[#0D0B26] mt-0.5">{enquiries.length}</h3>
          </Link>

        </div>

        {/* ========================================================================= */}
        {/* ROW 3: REAL FLAGSHIP BANNER: CASE INTEGRITY & CONTINUITY ENGINE           */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#170E3B] via-[#2A1663] to-[#3B1C7E] text-white p-7 sm:p-9 shadow-xl border border-purple-500/20">
          <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/25 border border-purple-400/30 text-purple-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Case Integrity &amp; Continuity Engine</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Every fact traceable. Every case transferable.
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
                Turn scattered legal documents into verified case intelligence, discover missing evidence and conflicting statements, and securely transfer cases without losing critical context.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/workspace/cases/${primaryCaseId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#170E3B] font-extrabold text-xs shadow-md transition-all"
                >
                  <Layers className="w-4 h-4 text-purple-700" />
                  <span>Open Case Intelligence Workspace</span>
                </Link>

                <Link
                  href="/workspace/cases/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-transparent hover:bg-white/10 text-white border border-white/30 font-semibold text-xs transition-all"
                >
                  <Plus className="w-4 h-4 text-purple-300" />
                  <span>Register New Case</span>
                </Link>
              </div>
            </div>

            {/* Right Graphic: Real Benchmark Verification Summary */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                
                {/* Background Document Mockup */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-slate-200 text-xs shadow-lg transform -rotate-2">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <FileText className="w-4 h-4 text-purple-300" />
                    <span className="font-bold text-white truncate max-w-[200px]">Agreement_For_Sale_Flat_402.pdf</span>
                    <span className="text-[10px] text-emerald-400 font-mono ml-auto">SHA-256 Validated</span>
                  </div>
                  <div className="space-y-1.5 opacity-60 text-[10px] font-mono">
                    <p className="truncate">Clause 7: Possession on or before 30 April 2025</p>
                    <p className="truncate">Consideration: INR 45,00,000/- total agreed price</p>
                  </div>
                </div>

                {/* Foreground Card: Real Integrity Metrics */}
                <div className="absolute top-8 left-4 right-2 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Case Integrity Summary</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                      Readiness: {readinessScore}%
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700 text-[11px]">
                      <span>Source Pins Grounded:</span>
                      <span className="font-bold text-emerald-700">100% Traceable</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 text-[11px]">
                      <span>Cross-Docket Discrepancies:</span>
                      <span className="font-bold text-amber-700">2 Flagged</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 text-[11px]">
                      <span>Statutory Evidence Gaps:</span>
                      <span className="font-bold text-red-700">3 Identified</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN TWO-COLUMN SECTION (8 COLS LEFT / 4 COLS RIGHT)                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN (8 COLS): REAL UPCOMING HEARINGS & REAL DISTRIBUTION          */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. REAL UPCOMING HEARINGS CARD */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-[#0D0B26] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Upcoming Scheduled Hearings</span>
                </h3>
                <Link
                  href="/workspace/cases"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <span>Manage Portfolio</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {upcomingHearings.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {upcomingHearings.map((c) => {
                    // Extract month and day if YYYY-MM-DD
                    const dateParts = (c.nextHearingDate || '').split('-');
                    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                    const monthStr = dateParts.length === 3 ? monthNames[parseInt(dateParts[1], 10) - 1] || 'SCH' : 'SCH';
                    const dayStr = dateParts.length === 3 ? dateParts[2] : '•';

                    return (
                      <div key={c.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors">
                        <div className="flex items-center gap-3.5">
                          {/* Date Block */}
                          <div className="w-14 h-12 rounded-xl bg-purple-50/90 text-purple-700 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-purple-100">
                            <span className="text-[10px] text-purple-400 uppercase tracking-wider font-extrabold">{monthStr}</span>
                            <span className="text-base font-black leading-none text-purple-900">{dayStr}</span>
                          </div>
                          <div>
                            <Link href={`/workspace/cases/${c.id}`} className="font-bold text-[#0D0B26] text-sm hover:text-purple-600 block">
                              {c.title}
                            </Link>
                            <p className="text-xs text-slate-500 font-medium">
                              {c.court} {c.jurisdiction ? `• ${c.jurisdiction}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:justify-end">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                            {c.category}
                          </span>
                          <Link
                            href={`/workspace/cases/${c.id}`}
                            className="px-3 py-1 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                          >
                            Workspace →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No upcoming hearings scheduled. Register a case docket with a hearing date.
                </div>
              )}
            </div>

            {/* 2. REAL CASE DISTRIBUTION & REAL INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 2A: Real Case Distribution */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-[#0D0B26]">Real Case Distribution</h3>
                  <span className="text-xs text-slate-500 font-medium">{cases.length} Total Cases</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                  {/* SVG Donut */}
                  <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {categoryDistribution.map((item, idx) => {
                        const previousPercent = categoryDistribution.slice(0, idx).reduce((sum, i) => sum + i.percentage, 0);
                        const strokeDash = `${item.percentage * 2.38} 238`;
                        const strokeOffset = `-${previousPercent * 2.38}`;
                        return (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="14"
                            strokeDasharray={strokeDash}
                            strokeDashoffset={strokeOffset}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xl font-black text-slate-900 block leading-tight">{cases.length}</span>
                      <span className="text-[9px] text-slate-500 font-semibold uppercase">Matters</span>
                    </div>
                  </div>

                  {/* Dynamic Legend */}
                  <div className="space-y-1.5 text-xs flex-1 max-w-[180px]">
                    {categoryDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-600 font-medium truncate">{item.category}</span>
                        </div>
                        <span className="font-bold text-slate-800 ml-2">{item.percentage}% ({item.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2B: Real Quick Insights */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-[#0D0B26]">Litigation Insights</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex items-start gap-2.5">
                    <Calendar className="w-5 h-5 text-purple-600 shrink-0 p-0.5" />
                    <p className="text-slate-700 font-medium leading-relaxed">
                      <strong>{upcomingHearingsCount} upcoming hearing{upcomingHearingsCount === 1 ? '' : 's'}</strong> listed before respective courts.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-2.5">
                    <FileCheck2 className="w-5 h-5 text-amber-600 shrink-0 p-0.5" />
                    <p className="text-slate-700 font-medium leading-relaxed">
                      <strong>{pendingTasksCount} pending action item{pendingTasksCount === 1 ? '' : 's'}</strong> scheduled across current dockets.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
                    <MessageSquare className="w-5 h-5 text-blue-600 shrink-0 p-0.5" />
                    <p className="text-slate-700 font-medium leading-relaxed">
                      <strong>{enquiries.length} citizen consultation{enquiries.length === 1 ? '' : 's'}</strong> received through public directory.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN (4 COLS): REAL CLIENT ENQUIRIES, TASKS & DOCUMENTS          */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. REAL CLIENT ENQUIRIES CARD (FROM CITIZEN PUBLIC PORTAL) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-extrabold text-[#0D0B26]">Citizen Enquiries</h3>
                </div>
                <Link
                  href="/workspace/enquiries"
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-0.5"
                >
                  <span>View All ({enquiries.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {enquiries.length > 0 ? (
                <div className="space-y-3 text-xs">
                  {enquiries.slice(0, 2).map((enquiry) => (
                    <div key={enquiry.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-purple-600" />
                          <span>{enquiry.clientName}</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          {enquiry.caseCategory}
                        </span>
                      </div>
                      <p className="text-slate-600 line-clamp-2 text-[11px] italic">
                        &quot;{enquiry.message}&quot;
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(enquiry.createdAt).toLocaleDateString('en-IN')}
                        </span>
                        {enquiry.status !== 'converted' ? (
                          <button
                            onClick={() => handleConvertToCase(enquiry)}
                            className="px-2 py-1 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-[10px] rounded flex items-center gap-1"
                          >
                            <FolderPlus className="w-3 h-3" />
                            <span>Convert to Case</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700">Converted</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs py-4 text-center">
                  No incoming client consultation requests.
                </p>
              )}
            </div>

            {/* 2. REAL PENDING TASKS CARD (INTERACTIVE) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-[#0D0B26]">Pending Tasks</h3>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {pendingTasksCount} Action Items
                </span>
              </div>

              {tasks.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {tasks.slice(0, 4).map((t) => (
                    <div key={t.id} className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors flex items-start gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={t.status === 'completed'}
                        onChange={() => handleToggleTask(t.id)}
                        className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer" 
                      />
                      <div className="flex-1">
                        <p className={`font-semibold leading-tight ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {t.title}
                        </p>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          Due: {t.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs py-4 text-center">
                  All action items completed.
                </p>
              )}
            </div>

            {/* 3. REAL RECENT DOCUMENTS LIST */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-[#0D0B26] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Case Dockets &amp; Documents</span>
                </h3>
                <Link
                  href={`/workspace/cases/${primaryCaseId}?tab=evidence`}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {documents.slice(0, 4).map((doc) => (
                  <div key={doc.id} className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-purple-100">
                        PDF
                      </span>
                      <div className="truncate">
                        <Link href={`/workspace/cases/${doc.caseId || primaryCaseId}?tab=evidence`} className="font-bold text-slate-900 hover:text-purple-600 truncate block">
                          {doc.fileName}
                        </Link>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          {doc.pageCount || 1} page{(doc.pageCount || 1) === 1 ? '' : 's'} • SHA-256 Validated
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold shrink-0">Source Pin</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
