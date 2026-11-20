'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, ShieldAlert, Scale, CheckCircle2, PhoneCall, HelpCircle } from 'lucide-react';
import { PublicNavbar, PublicFooter } from '@/components/PublicNav';

export default function StatutoryDisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#1B4FD8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to CaseKeeper Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Important Statutory Advisory • Indian Legal Framework</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Statutory Disclaimers & Civic Legal Advisory
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Applicable to all public queries, advocate workspaces, and automated briefing outputs.
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">

          {/* Section 1 */}
          <div className="bg-white rounded-xl border-l-4 border-l-amber-500 border border-slate-200 p-6 shadow-sm space-y-3 card-hover-lift">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              <span>1. Not a Substitute for Formal Legal Counsel</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              CaseKeeper is a civic technological initiative aimed at bridging information asymmetry in the Indian justice delivery system. The content, conversational outputs, and automated briefing summaries generated on this platform:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 pl-2">
              <li>Do <strong>not</strong> constitute formal legal opinions, actionable legal counsel, or guaranteed outcomes.</li>
              <li>Do <strong>not</strong> establish an attorney-client relationship between CaseKeeper and any citizen or litigant.</li>
              <li>Must be independently reviewed by a licensed advocate registered with the relevant State Bar Council.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 card-hover-lift">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              <span>2. Limitation Periods & Statutory Deadlines</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Statutory deadlines under Indian law (including Limitation Act, 1963, Consumer Protection Act, 2019, RERA Act, 2016, and PMFBY Calamity Reporting Rules) can vary based on specific factual circumstances, court vacations, and executive notifications.
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              Citizens are strongly urged not to delay approaching legal forums or legal aid authorities based solely on automated timelines provided online.
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 card-hover-lift">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>3. Free Legal Aid Entitlement Notice (NALSA Sec 12)</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under <strong>Section 12 of the Legal Services Authorities Act, 1987</strong>, eligible citizens (including women, children, members of SC/ST communities, industrial workers, victims of trafficking, and individuals below statutory income thresholds) are entitled to <strong>free legal aid</strong> from National, State, and District Legal Services Authorities (NALSA/SLSA/DLSA).
            </p>
            <p className="text-xs text-slate-600">
              National Legal Aid Toll-Free Helpline: <strong>15100</strong> (Accessible 24/7 across India).
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 card-hover-lift">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <span>4. Automated Case Briefs & Document Extractions</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The automated brief generator in the Advocate Workspace operates via local deterministic extraction algorithms to summarize uploaded pleadings. While designed to accurately extract CNR numbers, bench listings, and parties, the Counsel on Record bears the sole ethical and legal obligation to review, amend, and sign off on all submissions made before courts of law.
            </p>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <Link href="/terms" className="text-slate-600 hover:underline">
            ← Terms of Guidance
          </Link>
          <Link href="/" className="text-[#1B4FD8] font-bold hover:underline">
            Back to CaseKeeper Home →
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
