'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, FileText, CheckCircle, Scale, Database, EyeOff, Server } from 'lucide-react';
import { PublicNavbar, PublicFooter } from '@/components/PublicNav';

export default function PrivacyPolicyPage() {
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

        {/* Title Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDP Act 2023 & IT Act 2000 Certified Safeguards</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Privacy Policy & Data Safeguards
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Effective Date: January 1, 2026 • Version 2.4 (Statutory Indian Jurisdiction)
          </p>
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            CaseKeeper operates as a digital civic enablement and legal literacy conduit under Indian legal principles. We adhere strictly to the <strong>Digital Personal Data Protection Act (DPDP Act), 2023</strong>, the <strong>Information Technology Act, 2000</strong>, and statutory attorney-client confidentiality rules.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">

          {/* Section 1 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 card-hover-lift">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>1. Information We Collect and Process</span>
            </h2>
            <p>
              We collect only the minimum necessary information required to facilitate civic legal guidance and case briefing workflows:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 pl-2">
              <li><strong>Citizen Account Data:</strong> Name, optional contact number, city/jurisdiction, and user-initiated chat queries regarding statutory rights.</li>
              <li><strong>Advocate Credentials:</strong> Full legal name, State Bar Council enrollment number (e.g., D/1420/2008), designated practice courts, and office correspondence details for verification.</li>
              <li><strong>Litigation Dockets & Case Documents:</strong> PDF pleadings, orders, and case briefs uploaded into private advocate workspaces.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 card-hover-lift">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-indigo-600" />
              <span>2. Strict Compartmentalization & Zero Data Scraping</span>
            </h2>
            <p>
              CaseKeeper respects the sacrosanct nature of legal proceedings:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <p className="font-bold text-slate-800 mb-1">Client Confidentiality</p>
                <p className="text-slate-600">Case dockets and client names are never shared across accounts or sold to third-party data aggregators.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <p className="font-bold text-slate-800 mb-1">No AI Model Training</p>
                <p className="text-slate-600">Your uploaded case documents and strategy notes are never used to train public machine learning or foundation models.</p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 card-hover-lift">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>3. Cryptographic Storage & Security Measures</span>
            </h2>
            <p>
              In accordance with Section 43A of the Information Technology Act (Reasonable Security Practices):
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 pl-2">
              <li>All web traffic is transmitted via high-assurance TLS 1.3 encryption in transit.</li>
              <li>Case materials in advocate workspaces utilize Row-Level Security (RLS) ensuring strict tenant isolation.</li>
              <li>User sessions are cryptographically signed with strict token invalidation upon sign-out.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 card-hover-lift">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              <span>4. Citizen Rights Under DPDP Act 2023</span>
            </h2>
            <p>
              As a Data Principal under Indian law, you possess the right to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 pl-2">
              <li><strong>Right to Access:</strong> View all active cases, briefs, and consultations registered in your profile.</li>
              <li><strong>Right to Correction & Erasure:</strong> Delete your uploaded case materials or purge local storage cache at any time using workspace controls.</li>
              <li><strong>Right to Grievance Redressal:</strong> Submit privacy concerns directly to our Designated Grievance Officer at <code>privacy@casekeeper.in</code>.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3 card-hover-lift">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600" />
              <span>5. Data Sovereignty & Hosting</span>
            </h2>
            <p className="text-xs text-slate-600">
              All infrastructure and database services supporting CaseKeeper are deployed in certified data centers adhering to Indian data localization norms and standard MeitY security guidelines.
            </p>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Need legal privacy assistance? Contact grievance desk: support@casekeeper.in</span>
          <Link href="/terms" className="text-[#1B4FD8] font-bold hover:underline">
            Read Terms of Guidance →
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
