'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Folder, 
  Scale, 
  FileCheck2, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  Sparkles, 
  Upload, 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  Send, 
  BookOpen, 
  HelpCircle, 
  Check, 
  TrendingUp, 
  ChevronDown,
  Layers,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { getAuthUser } from '@/lib/authStore';
import { getStoredCases, resetDemoCase } from '@/lib/caseStore';
import { DEMO_CASE_ID, PRIMARY_DEMO_CASE } from '@/lib/demoCaseData';

export default function WorkspaceDashboard() {
  const [advocateName, setAdvocateName] = useState('Adv. Arjun Mehta');
  const [activePrompt, setActivePrompt] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  useEffect(() => {
    const auth = getAuthUser();
    if (auth && auth.name) {
      setAdvocateName(auth.name);
    }
  }, []);

  const handleQuickPromptClick = (promptText: string) => {
    setActivePrompt(promptText);
    setChatInput(promptText);
    setIsProcessingAI(true);
    setChatResponse(null);

    setTimeout(() => {
      setIsProcessingAI(false);
      if (promptText.includes('Summarize')) {
        setChatResponse('Summary of Written_Submission.pdf: Petitioner disputes arbitrary interest calculation under Section 18 of RERA 2016. Verified 3 contractual annexures and established 107 days delay.');
      } else if (promptText.includes('precedents')) {
        setChatResponse('Relevant Landmark Judgments: 1. Pioneer Urban Land & Infrastructure Ltd. v. Govindan Raghavan (2019) 5 SCC 725 — One-sided clauses in builder-buyer agreement constitute unfair trade practice.');
      } else if (promptText.includes('notice')) {
        setChatResponse('Drafting Legal Notice under Section 18 RERA: Formal 15-day notice demanding immediate physical possession and statutory delayed interest at MCLR + 2%. Ready to export to Word.');
      } else {
        setChatResponse('Statutory Principle: Under Indian Contract Act Sec 73 & RERA Sec 18, delay penalties cannot be unilaterally waived by a developer through standard boilerplate clauses.');
      }
    }, 800);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setIsProcessingAI(true);
    setTimeout(() => {
      setIsProcessingAI(false);
      setChatResponse(`Grounded Response for "${chatInput}": Verified against CaseKeeper Indian Case Intelligence repository. Cross-referenced with HARERA precedents and e-Courts filings.`);
    }, 800);
  };

  return (
    <AppShell activeNav="dashboard" breadcrumb="Dashboard">
      <div className="space-y-6">

        {/* ========================================================================= */}
        {/* ROW 1: GREETING & LIVE DATE BAR                                          */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D0B26] tracking-tight flex items-center gap-2">
              <span>Good Morning, {advocateName}</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here&apos;s what&apos;s happening with your cases today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Date Badge */}
            <div className="bg-white border border-slate-200/90 rounded-2xl px-4 py-2 flex items-center gap-2 text-xs font-semibold text-slate-700 shadow-xs">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Tue, Jan 21, 2025</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: 4 METRIC STAT CARDS (EXACT METRICS FROM REFERENCE IMAGE)          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Active Cases */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Folder className="w-5 h-5 fill-purple-100" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span>↑</span>
                <span>+12%</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Active Cases</p>
            <h3 className="text-3xl font-black text-[#0D0B26] mt-0.5">24</h3>
          </div>

          {/* Card 2: Upcoming Hearings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                Next: Jan 24
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Upcoming Hearings</p>
            <h3 className="text-3xl font-black text-[#0D0B26] mt-0.5">5</h3>
          </div>

          {/* Card 3: Pending Tasks */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                <span>↑</span>
                <span>+3</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Pending Tasks</p>
            <h3 className="text-3xl font-black text-[#0D0B26] mt-0.5">18</h3>
          </div>

          {/* Card 4: Cases Resolved */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span>↑</span>
                <span>+28%</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Cases Resolved</p>
            <h3 className="text-3xl font-black text-[#0D0B26] mt-0.5">47</h3>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ROW 3: LARGE HERO BANNER (ANALYZE, SUMMARIZE & STRATEGIZE WITH AI)       */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#170E3B] via-[#2A1663] to-[#3B1C7E] text-white p-7 sm:p-9 shadow-xl border border-purple-500/20">
          {/* Subtle Ambient Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/25 border border-purple-400/30 text-purple-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>AI Legal Assistant</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Analyze, Summarize &amp; Strategize Your Cases with AI
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
                Upload case documents, get instant summaries, extract key arguments, find relevant precedents, and draft legal documents.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/workspace/cases/${DEMO_CASE_ID}?tab=evidence`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#170E3B] font-extrabold text-xs shadow-md transition-all"
                >
                  <Upload className="w-4 h-4 text-purple-700" />
                  <span>Analyze Document</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleQuickPromptClick('Explain the statutory grounds under Section 18 RERA')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-transparent hover:bg-white/10 text-white border border-white/30 font-semibold text-xs transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-purple-300" />
                  <span>Ask a Legal Question</span>
                </button>
              </div>
            </div>

            {/* Right Graphic: 3D Paper Mockup Stack */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                
                {/* Background Document Mockup (Case_Brief.pdf) */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-slate-200 text-xs shadow-lg transform -rotate-3 transition-transform hover:rotate-0">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <FileText className="w-4 h-4 text-purple-300" />
                    <span className="font-bold text-white">Case_Brief.pdf</span>
                    <span className="text-[10px] text-slate-400 ml-auto">12 pages • 4.2 MB</span>
                  </div>
                  <div className="space-y-1.5 opacity-60">
                    <div className="h-2 bg-white/40 rounded w-full" />
                    <div className="h-2 bg-white/30 rounded w-4/5" />
                    <div className="h-2 bg-white/30 rounded w-2/3" />
                  </div>
                </div>

                {/* Foreground Card: AI Summary */}
                <div className="absolute top-8 left-6 right-2 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border border-purple-100 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Summary</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span className="font-medium text-[11px]">Key Facts Extracted</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span className="font-medium text-[11px]">Legal Issues &amp; Liabilities</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span className="font-medium text-[11px]">Relevant Precedents (SC/HC)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                      <span className="font-medium text-[11px]">Suggested Next Steps</span>
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
          {/* LEFT COLUMN (8 COLS): UPCOMING HEARINGS, CHARTS & INSIGHTS                */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. UPCOMING HEARINGS CARD */}
            <div id="hearings" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-[#0D0B26] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Upcoming Hearings</span>
                </h3>
                <Link
                  href="/workspace/cases"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <span>View Calendar</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                
                {/* Hearing 1 */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3.5">
                    {/* Date Block */}
                    <div className="w-14 h-12 rounded-xl bg-purple-50/90 text-purple-700 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-purple-100">
                      <span className="text-[10px] text-purple-400 uppercase tracking-wider font-extrabold">JAN</span>
                      <span className="text-base font-black leading-none text-purple-900">24</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0D0B26] text-sm">State vs. R.K. Sharma</h4>
                      <p className="text-xs text-slate-500 font-medium">Criminal • Session Court, Delhi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                      Hearing
                    </span>
                    <span className="text-xs font-semibold text-slate-700 font-mono">11:00 AM</span>
                  </div>
                </div>

                {/* Hearing 2 */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-12 rounded-xl bg-purple-50/90 text-purple-700 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-purple-100">
                      <span className="text-[10px] text-purple-400 uppercase tracking-wider font-extrabold">JAN</span>
                      <span className="text-base font-black leading-none text-purple-900">27</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0D0B26] text-sm">Mehta &amp; Co. vs. Urban Buildtech</h4>
                      <p className="text-xs text-slate-500 font-medium">Civil • High Court, Delhi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      Arguments
                    </span>
                    <span className="text-xs font-semibold text-slate-700 font-mono">02:30 PM</span>
                  </div>
                </div>

                {/* Hearing 3 */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-12 rounded-xl bg-purple-50/90 text-purple-700 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-purple-100">
                      <span className="text-[10px] text-purple-400 uppercase tracking-wider font-extrabold">JAN</span>
                      <span className="text-base font-black leading-none text-purple-900">30</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0D0B26] text-sm">Aarti Verma vs. State</h4>
                      <p className="text-xs text-slate-500 font-medium">Constitutional • Supreme Court</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                      Mentioning
                    </span>
                    <span className="text-xs font-semibold text-slate-700 font-mono">10:00 AM</span>
                  </div>
                </div>

                {/* Hearing 4: Sharma v. Horizon Developers (Benchmark Hackathon Case) */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/40 hover:bg-amber-50/70 p-2 rounded-xl transition-colors border border-amber-200/50 mt-1">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-12 rounded-xl bg-amber-100 text-amber-900 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-amber-300">
                      <span className="text-[10px] text-amber-700 uppercase tracking-wider font-extrabold">FEB</span>
                      <span className="text-base font-black leading-none text-amber-950">14</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/workspace/cases/${DEMO_CASE_ID}`} className="font-bold text-[#0D0B26] hover:text-purple-600 text-sm">
                          {PRIMARY_DEMO_CASE.title}
                        </Link>
                        <span className="text-[9px] uppercase font-extrabold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                          Benchmark Case
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Property &amp; Consumer • Haryana RERA Bench</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <Link
                      href={`/workspace/cases/${DEMO_CASE_ID}`}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#1B4FD8] hover:bg-blue-600 text-white shadow-xs"
                    >
                      Open Workspace →
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. SUB-ROW: CASE DISTRIBUTION (DONUT) + QUICK INSIGHTS */}
            <div id="distribution" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 2A: Case Distribution Donut Chart */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-[#0D0B26]">Case Distribution</h3>
                  <button className="flex items-center gap-1 text-xs text-slate-500 font-medium hover:text-slate-800">
                    <span>This Quarter</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* SVG Donut Chart and Legend */}
                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                  {/* SVG Donut */}
                  <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Civil: 37% */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8B5CF6" strokeWidth="14" strokeDasharray="88 150" strokeDashoffset="0" />
                      {/* Criminal: 25% */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3B82F6" strokeWidth="14" strokeDasharray="60 178" strokeDashoffset="-88" />
                      {/* Corporate: 17% */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06B6D4" strokeWidth="14" strokeDasharray="40 198" strokeDashoffset="-148" />
                      {/* Constitutional: 13% */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#EC4899" strokeWidth="14" strokeDasharray="31 207" strokeDashoffset="-188" />
                      {/* Others: 8% */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="14" strokeDasharray="19 219" strokeDashoffset="-219" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xl font-black text-slate-900 block leading-tight">24</span>
                      <span className="text-[9px] text-slate-500 font-semibold uppercase">Active Cases</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span className="text-slate-600 font-medium w-24">Civil</span>
                      <span className="font-bold text-slate-800">37% (9)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-slate-600 font-medium w-24">Criminal</span>
                      <span className="font-bold text-slate-800">25% (6)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      <span className="text-slate-600 font-medium w-24">Corporate</span>
                      <span className="font-bold text-slate-800">17% (4)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                      <span className="text-slate-600 font-medium w-24">Constitutional</span>
                      <span className="font-bold text-slate-800">13% (3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-slate-600 font-medium w-24">Others</span>
                      <span className="font-bold text-slate-800">8% (2)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2B: Quick Insights */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-[#0D0B26]">Quick Insights</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      ↑
                    </span>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      <strong>3 cases</strong> moved to next hearing since last week.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex items-start gap-2.5">
                    <Calendar className="w-5 h-5 text-purple-600 shrink-0 p-0.5" />
                    <p className="text-slate-700 font-medium leading-relaxed">
                      <strong>5 deadlines</strong> this week for pleadings and written arguments.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
                    <Scale className="w-5 h-5 text-blue-600 shrink-0 p-0.5" />
                    <p className="text-slate-700 font-medium leading-relaxed">
                      <strong>2 new relevant judgments</strong> indexed for your ongoing property disputes.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. CASE PROGRESS SPLINE CHART */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-[#0D0B26]">Case Progress</h3>
                </div>
                <button className="flex items-center gap-1 text-xs text-slate-500 font-medium hover:text-slate-800">
                  <span>Last 6 Months</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Area Line Chart Visualization */}
              <div className="w-full h-44 relative pt-2">
                <svg viewBox="0 0 600 140" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="purpleAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="120" x2="600" y2="120" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="90" x2="600" y2="90" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="60" x2="600" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="30" x2="600" y2="30" stroke="#F1F5F9" strokeWidth="1" />

                  {/* Gradient Area under curve */}
                  <path
                    d="M 20 100 Q 120 70, 220 80 T 420 50 T 580 20 L 580 120 L 20 120 Z"
                    fill="url(#purpleAreaGradient)"
                  />

                  {/* Spline Line */}
                  <path
                    d="M 20 100 Q 120 70, 220 80 T 420 50 T 580 20"
                    fill="transparent"
                    stroke="#7C3AED"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  {[
                    { x: 20, y: 100, label: 'Aug', val: 12 },
                    { x: 130, y: 80, label: 'Sep', val: 18 },
                    { x: 240, y: 78, label: 'Oct', val: 22 },
                    { x: 350, y: 70, label: 'Nov', val: 26 },
                    { x: 460, y: 45, label: 'Dec', val: 35 },
                    { x: 580, y: 20, label: 'Jan', val: 47 }
                  ].map((pt, idx) => (
                    <g key={idx}>
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="3" className="hover:r-7 transition-all cursor-pointer" />
                      <text x={pt.x} y="136" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="500">
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN (4 COLS): AI LEGAL ASSISTANT WIDGET & RECENT DOCUMENTS       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. AI LEGAL ASSISTANT CHAT WIDGET */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-extrabold text-[#0D0B26]">AI Legal Assistant</h3>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Beta
                </span>
              </div>

              {/* Chat Bubble / Callout */}
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100/80 text-center">
                <p className="text-xs font-bold text-purple-950">
                  How can I help you today?
                </p>
              </div>

              {/* 4 Interactive Quick Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickPromptClick('Summarize a case document: Written_Submission.pdf')}
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/40 text-left flex items-center gap-2.5 text-xs font-medium text-slate-700 transition-all active:scale-[0.99]"
                >
                  <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Summarize a case document</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPromptClick('Find relevant precedents for RERA builder delay')}
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/40 text-left flex items-center gap-2.5 text-xs font-medium text-slate-700 transition-all active:scale-[0.99]"
                >
                  <Scale className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Find relevant precedents</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPromptClick('Draft a legal notice under Section 18 RERA')}
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/40 text-left flex items-center gap-2.5 text-xs font-medium text-slate-700 transition-all active:scale-[0.99]"
                >
                  <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Draft a legal notice</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPromptClick('Explain legal concept of Unfair Trade Practice in BBA')}
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/40 text-left flex items-center gap-2.5 text-xs font-medium text-slate-700 transition-all active:scale-[0.99]"
                >
                  <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Explain a legal concept</span>
                </button>
              </div>

              {/* AI Live Feedback Box if triggered */}
              {(isProcessingAI || chatResponse) && (
                <div className="p-3 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CaseKeeper Engine Response</span>
                  </div>
                  {isProcessingAI ? (
                    <div className="flex items-center gap-2 text-slate-400 py-1">
                      <div className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
                      <span>Retrieving statutory precedents...</span>
                    </div>
                  ) : (
                    <p className="text-slate-200 leading-relaxed text-[11px]">
                      {chatResponse}
                    </p>
                  )}
                </div>
              )}

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChat} className="relative pt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything about your case..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder-slate-400 bg-slate-50/60"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-3 p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs hover:opacity-90 transition-opacity"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>

            {/* 2. RECENT DOCUMENTS LIST */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-[#0D0B26] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Recent Documents</span>
                </h3>
                <Link
                  href={`/workspace/cases/${DEMO_CASE_ID}?tab=evidence`}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {/* Doc 1 */}
                <div className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-red-100">
                      PDF
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">Written_Submission.pdf</p>
                      <p className="text-[11px] text-slate-500 truncate">State vs. R.K. Sharma</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">2 min ago</span>
                </div>

                {/* Doc 2 */}
                <div className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-blue-100">
                      W
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">Legal_Notice.docx</p>
                      <p className="text-[11px] text-slate-500 truncate">Mehta &amp; Co. vs. Urban Buildtech</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">19 min ago</span>
                </div>

                {/* Doc 3 */}
                <div className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-red-100">
                      PDF
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">Case_Summary_AI.pdf</p>
                      <p className="text-[11px] text-slate-500 truncate">Aarti Verma vs. State</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">1 hr ago</span>
                </div>

                {/* Doc 4: Sharma v. Horizon Developers Agreement */}
                <div className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-purple-100">
                      PDF
                    </span>
                    <div className="truncate">
                      <Link href={`/workspace/cases/${DEMO_CASE_ID}`} className="font-bold text-purple-900 hover:underline truncate block">
                        Agreement_For_Sale_Flat_402.pdf
                      </Link>
                      <p className="text-[11px] text-slate-500 truncate">Sharma v. Horizon Developers</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold shrink-0">Pinned</span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
