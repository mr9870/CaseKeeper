'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  ArrowRight, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Building, 
  ShieldAlert, 
  Home, 
  Coins, 
  Sprout, 
  Users2, 
  HeartHandshake, 
  ExternalLink, 
  CheckCircle, 
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PublicNavbar, PublicFooter } from '@/components/PublicNav';
import { DEMO_RESOURCES } from '@/lib/mockData';
import { getLawyersDirectory } from '@/lib/lawyerStore';
import { Lawyer } from '@/lib/types';

const CATEGORIES = [
  {
    id: 'civil',
    title: 'Civil Disputes',
    icon: Scale,
    desc: 'Contract breaches, money recovery, injunctions, and specific relief under CPC.',
    color: 'border-blue-100 hover:border-blue-500'
  },
  {
    id: 'criminal',
    title: 'Criminal Matters',
    icon: ShieldAlert,
    desc: 'Bail applications, FIR protocols, cognizable offenses under Bharatiya Nyaya Sanhita (BNS).',
    color: 'border-red-100 hover:border-red-500'
  },
  {
    id: 'family',
    title: 'Family Law',
    icon: Home,
    desc: 'Mutual/contested divorce, child custody, maintenance under Sec 125, and succession rights.',
    color: 'border-purple-100 hover:border-purple-500'
  },
  {
    id: 'property',
    title: 'Property & RERA',
    icon: Building,
    desc: 'Builder delay compensation under RERA Sec 18, title searches, registry mutations, and partition suits.',
    color: 'border-emerald-100 hover:border-emerald-500'
  },
  {
    id: 'consumer',
    title: 'Consumer Grievances',
    icon: Coins,
    desc: 'Defective products, service deficiency, misleading advertisements, and e-Daakhil filing.',
    color: 'border-amber-100 hover:border-amber-500'
  },
  {
    id: 'agriculture',
    title: 'Agricultural Disputes',
    icon: Sprout,
    desc: 'PMFBY crop insurance claims, Khasra-Khatauni records, tenancy laws, and Revenue Court appeals.',
    color: 'border-lime-100 hover:border-lime-500'
  },
  {
    id: 'cooperative',
    title: 'Cooperative Societies',
    icon: Users2,
    desc: 'RWA disputes, society maintenance levies, CRCS arbitration, and bye-law violation appeals.',
    color: 'border-cyan-100 hover:border-cyan-500'
  },
  {
    id: 'legalaid',
    title: 'Legal Aid & Lok Adalat',
    icon: HeartHandshake,
    desc: 'Free representation eligibility under NALSA Section 12, pre-litigation settlement, and DLSA counsel.',
    color: 'border-indigo-100 hover:border-indigo-500'
  }
];

export default function HomePage() {
  const [featuredLawyers, setFeaturedLawyers] = useState<(Lawyer & { isDummy?: boolean; isRegisteredUser?: boolean })[]>([]);

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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Headlines & Actions */}
              <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span>Statutory Legal Enablement • Hindi & English Supported</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans text-white leading-tight">
                  Legal Assistance, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
                    Made Accessible
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                  Get grounded answers to your legal questions based on official Indian statutes, government schemes, and judicial procedures. No confusing jargon.
                </p>

                {/* Dual Gateway CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  {/* Public Assistant Gateway */}
                  <Link
                    href="/chat"
                    className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-900/40 transition-all group btn-interactive"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Ask Legal Assistant (Public)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Lawyer Workspace Gateway */}
                  <Link
                    href="/workspace/dashboard"
                    className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700 font-semibold text-sm transition-all group btn-interactive"
                  >
                    <Briefcase className="w-5 h-5 text-amber-400" />
                    <span>Advocate Case Workspace</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Verified Statutory Sources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Voice Input in Hindi / English</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Encrypted Client Compartmentalization</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Feature Box */}
              <div className="lg:col-span-5 animate-scale-in">
                <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-2xl backdrop-blur-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-mono text-slate-400 ml-2">Quick Guidance Preview</span>
                    </div>
                    <span className="text-[11px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded font-mono">Live Statutory Preview</span>
                  </div>

                  {/* Sample Query & Answer */}
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/50">
                      <p className="text-slate-400 text-[11px] mb-1 font-semibold uppercase tracking-wider">Citizen Asks:</p>
                      <p className="text-white font-medium">"My crop in Sangrur got damaged by floods. Under PMFBY, what is the deadline to report?"</p>
                    </div>

                    <div className="p-3 bg-blue-950/60 rounded-lg border border-blue-800/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-300 font-semibold flex items-center gap-1.5">
                          <Scale className="w-3.5 h-3.5" />
                          CaseKeeper Statutory Guidance
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">Verified Guideline</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed text-[11px]">
                        Under PMFBY Operational Guidelines (Section 15.3), localized calamity damage must be reported within <strong>72 hours</strong> to the insurance agency, bank branch, or via the <em>Crop Insurance App</em>.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          Source: PMFBY Portal
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          Toll-Free: 1800-180-1551
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/chat"
                    className="block text-center py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold rounded-lg border border-blue-500/40 transition-colors"
                  >
                    Open Full Interactive Chatbot →
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: LEGAL GUIDANCE CATEGORIES */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Legal Guidance Categories
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Select an area of law to explore statutory procedures, citizen rights, and verified government grievance routes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/chat?category=${cat.id}`}
                  className={`group bg-white rounded-xl p-5 border ${cat.color} shadow-sm card-hover-lift flex flex-col justify-between`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#1B4FD8] group-hover:bg-[#1B4FD8] group-hover:text-white transition-colors mb-4">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-[#0F172A] text-base mb-1.5 group-hover:text-[#1B4FD8] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1B4FD8]">
                    <span>Ask about this</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: FEATURED OFFICIAL RESOURCES */}
        <section className="py-14 bg-slate-100/70 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold text-[#1B4FD8] uppercase tracking-wider">Trusted Knowledge Base</span>
                <h2 className="text-2xl font-extrabold text-[#0F172A] mt-1">Official Government & Judicial Portals</h2>
                <p className="text-sm text-slate-600 mt-1">Verified databases for court cause lists, online complaints, and welfare schemes.</p>
              </div>
              <Link
                href="/resources"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4FD8] hover:text-blue-700"
              >
                <span>View All Official Portals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEMO_RESOURCES.slice(0, 3).map((res) => (
                <div key={res.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm card-hover-lift flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {res.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Reviewed: {res.lastReviewed}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#0F172A] text-sm mb-1">{res.title}</h3>
                    <p className="text-[11px] font-semibold text-slate-500 mb-2">{res.authority}</p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{res.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">{res.jurisdiction}</span>
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

        {/* SECTION 4: FIND A LAWYER PREVIEW */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-[#1B4FD8] uppercase tracking-wider">Statutory Advocates</span>
              <h2 className="text-2xl font-extrabold text-[#0F172A] mt-1">Verified Advocate Directory</h2>
              <p className="text-sm text-slate-600 mt-1">Search practitioners by jurisdiction, practice domain, and languages spoken.</p>
            </div>
            <Link
              href="/lawyers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4FD8] hover:text-blue-700"
            >
              <span>Search All Advocates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm card-hover-lift flex flex-col justify-between relative overflow-hidden">
                {lawyer.isRegisteredUser && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-bl-lg tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Newly Registered Advocate</span>
                  </div>
                )}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shadow-md">
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
        </section>

        {/* SECTION 5: ADVOCATE WORKSPACE BANNER */}
        <section className="bg-[#0F172A] text-white py-14 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-900/60 to-slate-800/80 rounded-2xl p-8 border border-blue-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-semibold">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>For Practicing Advocates & Legal Teams</span>
                </div>
                <h3 className="text-2xl font-bold">CaseKeeper Advocate Workspace</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Upload case dockets (PDFs), auto-extract key dates and citations, generate structured case briefs, and securely hand off case materials to co-counsels with revocable access permissions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/workspace/dashboard"
                  className="px-6 py-3 rounded-lg bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all text-center"
                >
                  Enter Workspace
                </Link>
                <Link
                  href="/workspace/cases/case-101/briefs"
                  className="px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all text-center"
                >
                  Inspect Case Brief
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
