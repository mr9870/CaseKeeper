'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  ArrowRight, 
  Briefcase, 
  MessageSquare, 
  Building, 
  ShieldAlert, 
  Home, 
  Coins, 
  Sprout, 
  Users2, 
  HeartHandshake, 
  ExternalLink, 
  CheckCircle, 
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Share2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileSearch
} from 'lucide-react';
import { PublicNavbar, PublicFooter } from '@/components/PublicNav';
import { DEMO_RESOURCES } from '@/lib/mockData';
import { getLawyersDirectory } from '@/lib/lawyerStore';
import { Lawyer } from '@/lib/types';
import { DEMO_CASE_ID } from '@/lib/demoCaseData';

const CATEGORIES = [
  {
    id: 'property',
    title: 'Property & RERA',
    icon: Building,
    desc: 'Builder delay interest under RERA Sec 18, conveyance deeds, DTCP approvals, and title dispute tracking.',
    color: 'border-emerald-200 hover:border-emerald-500'
  },
  {
    id: 'consumer',
    title: 'Consumer Grievances',
    icon: Coins,
    desc: 'Defective goods, unfair trade practices, deficiency of service, and direct e-Jagriti & e-Daakhil filing.',
    color: 'border-amber-200 hover:border-amber-500'
  },
  {
    id: 'civil',
    title: 'Civil & Commercial',
    icon: Scale,
    desc: 'Contract breaches, specific performance, injunctions under CPC 1908, and debt recovery tribunals.',
    color: 'border-blue-200 hover:border-blue-500'
  },
  {
    id: 'criminal',
    title: 'Criminal & Bail',
    icon: ShieldAlert,
    desc: 'Bail petitions, FIR analysis, statutory bailable rights under Bharatiya Nagarik Suraksha Sanhita (BNSS).',
    color: 'border-red-200 hover:border-red-500'
  },
  {
    id: 'family',
    title: 'Family Law',
    icon: Home,
    desc: 'Mutual settlements, custody petitions, maintenance under BNSS Sec 144, and succession rights.',
    color: 'border-purple-200 hover:border-purple-500'
  },
  {
    id: 'agriculture',
    title: 'Agricultural Disputes',
    icon: Sprout,
    desc: 'PMFBY crop insurance localized damage (72-hr rule), Khasra-Khatauni records, and revenue appeals.',
    color: 'border-lime-200 hover:border-lime-500'
  },
  {
    id: 'cooperative',
    title: 'Cooperative Housing',
    icon: Users2,
    desc: 'RWA disputes, society maintenance audit transparency, and Registrar arbitration appeals.',
    color: 'border-cyan-200 hover:border-cyan-500'
  },
  {
    id: 'legalaid',
    title: 'Legal Aid & Lok Adalat',
    icon: HeartHandshake,
    desc: 'Free legal representation under NALSA Section 12, Pre-Litigation Lok Adalat, and DLSA empanelment.',
    color: 'border-indigo-200 hover:border-indigo-500'
  }
];

const FAQS = [
  {
    q: 'How does CaseKeeper ensure AI responses are not hallucinated?',
    a: 'CaseKeeper enforces strict Source Pinning. Every single factual claim, date, or monetary figure generated in an Intelligence Brief must be deterministically linked to an exact document name, page number, and text excerpt. Ungrounded assertions are mathematically prevented from receiving a certified score.'
  },
  {
    q: 'What is the Case Integrity Engine?',
    a: 'The Case Integrity Engine is CaseKeeper\'s core algorithmic innovation. It automatically cross-references every ingested docket to identify contradictory statements (e.g. conflicting possession dates or payment amounts), flags missing statutory evidence (e.g. Sanctioned Layouts or Occupancy Certificates), and constructs an uneditable chronological event timeline.'
  },
  {
    q: 'How does the Secure Handoff feature protect client privilege?',
    a: 'When transferring a case between advocates, the originating counsel can choose exactly which materials to include. Private trial strategy notes and privileged observations are automatically excluded by default. Handoff links require client consent acknowledgment, include cryptographic expiration, and can be instantly revoked with one click.'
  },
  {
    q: 'Can judges or advocates try CaseKeeper without registration?',
    a: 'Yes. CaseKeeper features a dedicated 1-Click Hackathon Demo Mode pre-populated with synthetic case records for Sharma v. Horizon Developers (CK-2026-001). Judges can inspect the 3-panel workspace, test contradiction resolution, and explore source pins immediately.'
  },
  {
    q: 'Is CaseKeeper compliant with Indian court procedures and data privacy?',
    a: 'Yes. CaseKeeper is designed specifically around Indian statutory frameworks (e-Courts CNR formats, BNS/BNSS, RERA 2016, Consumer Protection Act 2019, NALSA). Data processing operates under zero-retention parameters with strict compartmentalization between advocates.'
  },
  {
    q: 'How does the Public Legal Assistance portal relate to the Advocate Workspace?',
    a: 'The Public Portal serves as a complementary access layer for citizens and litigants to understand statutory procedures in simple Hindi or English. If a citizen requires formal legal representation, they can connect directly with verified empaneled advocates, seamlessly transferring preliminary consultation facts into a structured case docket.'
  }
];

export default function HomePage() {
  const [featuredLawyers, setFeaturedLawyers] = useState<(Lawyer & { isDummy?: boolean; isRegisteredUser?: boolean })[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const updateLawyers = () => {
      setFeaturedLawyers(getLawyersDirectory().slice(0, 3));
    };
    updateLawyers();

    window.addEventListener('lawyers_updated', updateLawyers);
    window.addEventListener('storage', updateLawyers);
    return () => {
      window.removeEventListener('lawyers_updated', updateLawyers);
      window.removeEventListener('storage', updateLawyers);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      <PublicNavbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO SECTION & INTERACTIVE WORKSPACE PREVIEW                    */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1A2F] via-[#0F223C] to-[#0A192F] text-white pt-16 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
          {/* Subtle Ambient Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Top Badge: Positioning */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono tracking-wide uppercase text-[11px]">Evidence-First Legal Intelligence & Case Continuity</span>
              </div>
            </div>

            {/* Main Headline & Supporting Text */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
                Every fact traceable. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-teal-200 to-amber-200">
                  Every case transferable.
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
                Turn scattered legal documents into verified case intelligence, discover missing evidence and conflicting statements, and securely transfer cases without losing critical context.
              </p>

              {/* Primary & Secondary Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Primary CTA: Experience Live Demo */}
                <Link
                  href={`/workspace/cases/${DEMO_CASE_ID}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-900/50 hover:shadow-blue-700/60 transition-all transform hover:-translate-y-0.5 border border-blue-400/30"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Experience Live Demo</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                {/* Secondary CTA: Enter Advocate Workspace */}
                <Link
                  href="/workspace/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm sm:text-base transition-all hover:border-slate-500"
                >
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span>Enter Advocate Workspace</span>
                </Link>

                {/* Secondary CTA: Public Legal Assistance */}
                <Link
                  href="/chat"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm sm:text-base transition-all hover:text-white"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Public Legal Aid</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-medium border-t border-slate-800/80 mt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Deterministic Source Pinning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cross-Document Conflict Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Consent-Governed Handoffs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero-Retention Private Inference</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: PROBLEMS ADDRESSED BY CASEKEEPER                               */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">The Litigation Reality in India</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
                Why Legal Matters Fail Before Trial Starts
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                Indian advocates manage hundreds of loose paper dockets, unstructured WhatsApp scans, and conflicting developer letters. Critical context is routinely lost during case transfers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg">Undetected Contradictions</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dates and payment sums in client letters often conflict directly with formal sale agreements. Opposing counsels exploit these discrepancies to derail arguments.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <FileSearch className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg">Last-Minute Evidence Gaps</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Critical statutory annexures (like RERA Sanction Plans or Postal Track receipts) are only noticed on the morning of admission hearings, causing costly adjournments.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1B4FD8] flex items-center justify-center font-bold">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg">Context Lost in Transitions</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When a client engages a new advocate or senior counsel, re-briefing takes weeks. Private strategy notes get accidentally leaked or vital nuances vanish entirely.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg">Hallucination Hazards</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generic AI chatbots fabricate Indian statutory citations and invent facts. Legal work product demands zero hallucination and 100% deterministic traceability.
                </p>
              </div>
            </div>
          </div>
        </section>





        {/* ========================================================================= */}
        {/* SECTION 5: END-TO-END CASE PREPARATION WORKFLOW                           */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Architectural Methodology</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
                The 4-Step Case Continuity Pipeline
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                How CaseKeeper guides legal teams from raw chaotic client documents to courtroom-ready, transferable case intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    01
                  </div>
                  <h3 className="font-bold text-[#0F172A] text-base">Ingest & Hash</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Upload agreements, notices, invoices, or scanned Hindi/English letters. CaseKeeper validates MIME types and computes cryptographic SHA-256 signatures for tamper proofing.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] font-mono text-blue-700">
                  Pipeline: Document Storage & OCR
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    02
                  </div>
                  <h3 className="font-bold text-[#0F172A] text-base">Triangulate & Flag</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The Case Integrity Engine extracts entities, dates, sums, and statutory terms. It performs cross-document consistency checks to flag conflicting statements and missing annexures.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] font-mono text-amber-700">
                  Engine: Contradiction & Gaps
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    03
                  </div>
                  <h3 className="font-bold text-[#0F172A] text-base">Advocate Verification</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Counsel reviews factual assertions via the Human-in-the-Loop interface. Confirm findings, dismiss false positives, and record private strategy notes locked to the firm.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] font-mono text-emerald-700">
                  Audit: Lawyer Verification Log
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    04
                  </div>
                  <h3 className="font-bold text-[#0F172A] text-base">Consent Handoff</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Transfer the entire structured case docket to co-counsel or senior advocate in 3 minutes. Exclude private strategy notes, verify client consent, and revoke anytime.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] font-mono text-purple-700">
                  Security: Revocable Handoff Link
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* ========================================================================= */}
        {/* SECTION 7: PUBLIC LEGAL ASSISTANCE & OFFICIAL SCHEMES                     */}
        {/* ========================================================================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Complementary Access Layer</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
              Public Legal Assistance & Citizen Rights
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Demystifying Indian law for citizens and small businesses. Grounded strictly in official statutes, government welfare portals, and free legal aid schemes.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/chat?category=${cat.id}`}
                  className={`group bg-white rounded-2xl p-5 border ${cat.color} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#1B4FD8] group-hover:bg-[#1B4FD8] group-hover:text-white transition-colors mb-4">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-[#0F172A] text-base mb-1.5 group-hover:text-[#1B4FD8] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1B4FD8]">
                    <span>Ask Legal Assistant</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Official Resources Sub-grid */}
          <div className="bg-slate-100/80 rounded-2xl p-6 sm:p-8 border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
              <div>
                <span className="text-xs font-bold text-[#1B4FD8] uppercase tracking-wider">Trusted Knowledge Base</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">Official Government & Judicial Portals</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">Direct access to official cause lists, grievance registrations, and statutory portals.</p>
              </div>
              <Link
                href="/resources"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4FD8] hover:underline"
              >
                <span>View All 15+ Portals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {DEMO_RESOURCES.slice(0, 3).map((res) => (
                <div key={res.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                        {res.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {res.jurisdiction}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#0F172A] text-sm mb-1">{res.title}</h4>
                    <p className="text-[11px] font-semibold text-slate-500 mb-2">{res.authority}</p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{res.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Reviewed {res.lastReviewed}</span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4FD8] hover:underline"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7.5: STATUTORY ADVOCATES DIRECTORY                                */}
        {/* ========================================================================= */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold text-[#1B4FD8] uppercase tracking-wider">Statutory Advocates</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">Verified Advocate Directory</h2>
                <p className="text-sm text-slate-600 mt-1">Search practitioners by jurisdiction, practice domain, and languages spoken.</p>
              </div>
              <Link
                href="/lawyers"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4FD8] hover:underline"
              >
                <span>Search All Advocates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredLawyers.map((lawyer) => (
                <div key={lawyer.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                  {lawyer.isRegisteredUser && (
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-bl-lg tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Newly Registered Advocate</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {lawyer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-[#0F172A] text-sm">{lawyer.name}</h3>
                            {lawyer.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-50" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{lawyer.city}, {lawyer.state}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {lawyer.experienceYears} Yrs Exp
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {lawyer.bio}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {lawyer.practiceAreas.slice(0, 3).map((area, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Languages: {lawyer.languages.join(', ')}
                    </span>
                    <Link
                      href={`/lawyers/${lawyer.id}`}
                      className="text-xs font-bold text-[#1B4FD8] hover:underline"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: DATA PRIVACY & RESPONSIBLE AI SAFEGUARDS                       */}
        {/* ========================================================================= */}
        <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">High-Security Governance</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
                Responsible AI & Client Privilege Safeguards
              </h2>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                Engineered from the ground up to respect advocate-client privilege under the Indian Evidence Act / BSA and international zero-retention privacy standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Zero Data Training Retention</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Confidential legal dockets and briefs are never used to train foundation models. Ingestion operates strictly in ephemeral inference sandboxes with immediate buffer flushes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Client Privilege Compartmentalization</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Lawyer notes, litigation strategy, and internal witness observations are tagged as <code>[Privileged]</code> and physically blocked from handoff bundles and external exports.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Mandatory Statutory Disclaimers</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Public AI guidance includes explicit statutory disclaimers under Advocates Act 1961 guidelines, directing citizens to verified legal practitioners and NALSA aid.
                </p>
              </div>
            </div>
          </div>
        </section>



        {/* ========================================================================= */}
        {/* SECTION 10: FREQUENTLY ASKED QUESTIONS (FAQ)                             */}
        {/* ========================================================================= */}
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Transparency & Clarifications</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-2 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Everything judges, advocates, and citizens need to know about CaseKeeper’s technology stack and legal admissibility.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-[#0F172A] text-sm sm:text-base hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Call to Action Box */}
            <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-[#0A2540] to-[#0F172A] text-white text-center space-y-4 shadow-xl">
              <h3 className="text-2xl font-black">Experience the Future of Indian Case Continuity</h3>
              <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
                Launch the interactive hackathon demo immediately. No registration or credit card required.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/workspace/cases/${DEMO_CASE_ID}`}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-900/50 flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Launch Live Demo Case (CK-2026-001)</span>
                </Link>
                <Link
                  href="/workspace/dashboard"
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm rounded-xl transition-all"
                >
                  <span>Enter Advocate Workspace</span>
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
