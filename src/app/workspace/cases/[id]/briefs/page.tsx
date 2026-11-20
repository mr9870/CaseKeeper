'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  FileStack, 
  Download, 
  Edit3, 
  RotateCw, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  Users, 
  ExternalLink,
  ChevronDown,
  ArrowLeft,
  Share2,
  Clock,
  Save,
  StickyNote,
  Loader2,
  Sparkles,
  ClipboardList,
  Copy,
  Printer
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { CaseItem, BriefVersion, CaseDocument } from '@/lib/types';
import { getCaseById, updateCaseNotes, getStoredBrief, saveStoredBrief, getStoredDocuments } from '@/lib/caseStore';

// ─── Client-side Brief Generator (No API) ────────────────────────────────────

function generateLocalBrief(caseItem: CaseItem, documents: CaseDocument[], currentVersionNumber: number): BriefVersion {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Summary
  const summary = `This matter involves ${caseItem.title}. ${caseItem.description || 'The nature of the dispute pertains to legal proceedings initiated before the competent authority.'}. The case is currently ${caseItem.status} before ${caseItem.court}, and is listed under reference number ${caseItem.referenceNumber}.`;

  // Parties
  const parties: BriefVersion['parties'] = [
    {
      name: caseItem.parties.petitioner,
      role: 'Petitioner / Aggrieved Party',
      counsel: 'Adv. Rajesh Verma (Counsel on Record)'
    },
    {
      name: caseItem.parties.respondent,
      role: 'Respondent / Opposing Body',
      counsel: 'Notice Issued — Counsel details pending'
    }
  ];

  // Key Facts — extract sentences from description + static facts
  const descSentences = (caseItem.description || '')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .slice(0, 3);

  const staticFacts = [
    `Petitioner: ${caseItem.parties.petitioner} has instituted proceedings before ${caseItem.court}.`,
    `Respondent: ${caseItem.parties.respondent} has been served notice by the tribunal.`,
    `Reference Number: ${caseItem.referenceNumber} under jurisdiction: ${caseItem.jurisdiction}.`,
  ];

  const keyFacts = [...descSentences, ...staticFacts].slice(0, 5);

  // Important Dates
  const importantDates: BriefVersion['importantDates'] = [
    { date: caseItem.lastUpdated, description: 'Case last updated in the system' },
  ];
  if (caseItem.nextHearingDate) {
    importantDates.unshift({
      date: caseItem.nextHearingDate,
      description: `Next scheduled bench listing before ${caseItem.court}`
    });
  }

  // Hearing Dates
  const hearingDates: BriefVersion['hearingDates'] = caseItem.nextHearingDate
    ? [{ date: caseItem.nextHearingDate, court: caseItem.court, purpose: 'Next scheduled hearing / bench listing' }]
    : [];

  // Category-based Suggested Tasks
  const categoryTasks: Record<string, { task: string; due?: string }[]> = {
    'Consumer Complaints': [
      { task: 'File written consumer complaint with the District Consumer Forum', due: '' },
      { task: 'Collect purchase receipt, warranty card, and repair history documents', due: '' },
      { task: 'Obtain quotation for cost of repair or replacement from authorized service center', due: '' },
    ],
    'Property & RERA': [
      { task: 'Obtain certified copy of Builder-Buyer Agreement from registrar', due: '' },
      { task: 'File delay compensation claim under Section 18 RERA Act 2016', due: '' },
      { task: 'Gather possession delay correspondence and allotment letter', due: '' },
    ],
    'Cooperative Society': [
      { task: 'Obtain certified AGM/EGM attendance register from RCS record room', due: '' },
      { task: 'File interim application for stay on coercive recovery if applicable', due: '' },
      { task: 'Verify bye-law provisions governing disputed maintenance levy', due: '' },
    ],
    'Agricultural Disputes': [
      { task: 'Collect crop loss assessment report from local Patwari / Revenue Officer', due: '' },
      { task: 'File RTI for PMFBY claim status with Nodal Agency', due: '' },
      { task: 'Obtain weather data records from IMD for the relevant Kharif / Rabi season', due: '' },
    ],
    'Criminal Matters': [
      { task: 'Obtain certified copy of FIR and chargesheet from Police Station', due: '' },
      { task: 'File bail application with sessions court if accused is in custody', due: '' },
      { task: 'Prepare list of witnesses and arrange affidavits', due: '' },
    ],
    'Family Law': [
      { task: 'File maintenance petition under Section 125 CrPC if applicable', due: '' },
      { task: 'Obtain marriage certificate and other documentary proof of relationship', due: '' },
      { task: 'Draft child custody / visitation arrangement proposal for mediation', due: '' },
    ],
    'default': [
      { task: 'File case brief with competent court and serve copy on opposite party', due: '' },
      { task: 'Gather all documentary evidence and prepare indexed paper book', due: '' },
      { task: 'Draft written arguments and research relevant legal precedents', due: '' },
    ],
  };

  const tasksForCategory = categoryTasks[caseItem.category] || categoryTasks['default'];
  const nextHearing = caseItem.nextHearingDate || '';
  const suggestedTasks: BriefVersion['suggestedTasks'] = tasksForCategory.map(t => ({
    task: t.task,
    isSuggestion: true,
    due: nextHearing || undefined,
  }));

  // Category-based Missing Information
  const categoryMissingInfo: Record<string, string[]> = {
    'Consumer Complaints': [
      'Original purchase invoice and bill of sale',
      'Service centre repair records and job sheets',
      'Written complaint acknowledgement from respondent company',
      'Expert valuation or defect assessment report if applicable',
    ],
    'Property & RERA': [
      'Builder-Buyer Agreement signed copy (all pages)',
      'Possession delay communication emails/letters from builder',
      'RERA registration certificate of the project',
      'Bank loan sanction letter and EMI payment records',
    ],
    'Cooperative Society': [
      'Certified registered bye-laws of the cooperative society',
      'AGM notice dispatch proof (speed post / registered AD receipts)',
      'Society financial audit report for disputed period',
      'Written authorization of respondent representative before tribunal',
    ],
    'Agricultural Disputes': [
      'Khasra-Khatauni / Pahani (land records) for crop season in question',
      'PMFBY enrolment proof and premium payment receipts',
      'Crop cutting experiment (CCE) report from competent authority',
      'IMD rainfall data or drought declaration notification',
    ],
    'Criminal Matters': [
      'Original FIR copy and station diary extract',
      'Post-mortem report or medical certificate (if applicable)',
      'Witness statements and police investigation report',
      'CCTV / electronic evidence disclosure from prosecution',
    ],
    'Family Law': [
      'Marriage certificate or proof of solemnization',
      'Income / salary proof of both parties for maintenance computation',
      'Birth certificates of children (for custody matters)',
      'Medical / disability certificates if maintenance under special provisions',
    ],
    'default': [
      'Original documentary evidence supporting the claims',
      'Written notice sent to opposite party before litigation',
      'Expert / technical reports if the dispute involves specialized subject',
      'Proof of service of pleadings on respondent',
    ],
  };

  const missingInformation = categoryMissingInfo[caseItem.category] || categoryMissingInfo['default'];

  // Documents Reviewed — from the actual documents array
  const documentsReviewed: BriefVersion['documentsReviewed'] = documents.length > 0
    ? documents.map(d => ({ name: d.fileName, pages: d.pageCount || 0 }))
    : [{ name: 'No documents uploaded yet', pages: 0 }];

  return {
    id: `brief-local-${Date.now()}`,
    caseId: caseItem.id,
    versionNumber: currentVersionNumber + 1,
    status: 'draft',
    isAiGenerated: false,
    createdAt: `${dateStr} ${timeStr}`,
    reviewedAt: undefined,
    summary,
    parties,
    keyFacts,
    importantDates,
    hearingDates,
    suggestedTasks,
    missingInformation,
    documentsReviewed,
    citations: [],
  };
}

// ─── Brief Viewer Component ───────────────────────────────────────────────────

function BriefViewerContent() {
  const params = useParams();
  const caseId = (params?.id as string) || 'case-101';

  const [caseItem, setCaseItem] = useState<CaseItem | undefined>(undefined);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [brief, setBrief] = useState<BriefVersion | null>(null);
  const [activeVersion, setActiveVersion] = useState(1);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocalBrief, setIsLocalBrief] = useState(false);
  const [briefGeneratedAlert, setBriefGeneratedAlert] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  
  // Lawyer notes feature state
  const [notesText, setNotesText] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    const foundCase = getCaseById(caseId);
    setCaseItem(foundCase);
    if (foundCase) {
      setNotesText(foundCase.notes || '');
      const foundBrief = getStoredBrief(caseId, foundCase);
      setBrief(foundBrief);
      setSummaryText(foundBrief.summary);
      setIsLocalBrief(!foundBrief.isAiGenerated && foundBrief.id.startsWith('brief-local-'));
      setActiveVersion(foundBrief.versionNumber);
    }
    const docs = getStoredDocuments(caseId);
    setDocuments(docs);
  }, [caseId]);

  const handleSaveNotes = () => {
    if (!caseItem) return;
    updateCaseNotes(caseItem.id, notesText);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 3000);
  };

  const handleSaveSummary = () => {
    if (!brief) return;
    const updatedBrief: BriefVersion = {
      ...brief,
      summary: summaryText,
      reviewedAt: `${new Date().toLocaleDateString('en-GB')} by Advocate`,
      status: 'reviewed'
    };
    setBrief(updatedBrief);
    saveStoredBrief(caseId, updatedBrief);
    setIsEditingSummary(false);
  };

  const handleGenerateBrief = () => {
    if (!caseItem) return;
    setIsGenerating(true);
    setBriefGeneratedAlert(false);
    
    // Process local case extraction
    setTimeout(() => {
      const generated = generateLocalBrief(caseItem, documents, brief?.versionNumber || 1);
      setBrief(generated);
      setSummaryText(generated.summary);
      saveStoredBrief(caseId, generated);
      setIsLocalBrief(true);
      setIsGenerating(false);
      setActiveVersion(generated.versionNumber);
      setBriefGeneratedAlert(true);
      setTimeout(() => {
        document.getElementById('generated-brief-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1000);
  };

  const handleCopyBrief = () => {
    if (!caseItem || !brief) return;
    const text = `=====================================================
CASE BRIEF: ${caseItem.title}
=====================================================
Reference / CNR Number: ${caseItem.referenceNumber}
Forum / Court: ${caseItem.jurisdiction} — ${caseItem.court}
Category: ${caseItem.category}
Next Scheduled Listing: ${caseItem.nextHearingDate || 'Pending Listing'}

1. EXECUTIVE CASE SUMMARY:
${brief.summary}

2. LITIGATING PARTIES:
• Petitioner: ${caseItem.parties.petitioner}
• Respondent: ${caseItem.parties.respondent}

3. MATERIAL FACTS EXTRACTED:
${brief.keyFacts.map((f, i) => `${i + 1}. ${f}`).join('\n')}

4. BENCH LISTINGS & CHRONOLOGY:
${brief.importantDates.map((d) => `• ${d.date}: ${d.description}`).join('\n')}

5. RECOMMENDED ACTIONS:
${brief.suggestedTasks.map((t) => `[ ] ${t.task} ${t.due ? `(Due: ${t.due})` : ''}`).join('\n')}

6. EVIDENTIARY GAPS:
${brief.missingInformation.map((m) => `! ${m}`).join('\n')}
=====================================================
Prepared via CaseKeeper Legal Briefing Engine
`;
    navigator.clipboard.writeText(text);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 3000);
  };

  const handlePrintBrief = () => {
    window.print();
  };

  if (!caseItem || !brief) {
    return (
      <AppShell activeNav="briefs" breadcrumb="Case Brief Viewer">
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-4">
          <FileStack className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Case Selected or Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please register a new case docket or select an existing case from your active portfolio.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/workspace/cases"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg"
            >
              ← Back to Cases
            </Link>
            <Link
              href="/workspace/cases/new"
              className="px-4 py-2 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg"
            >
              + Register New Case
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeNav="briefs" breadcrumb={`Brief Viewer • ${caseItem.referenceNumber}`}>
      <div className="space-y-6">

        {/* Top Contextual Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href="/workspace/cases"
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cases Portfolio</span>
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-mono text-slate-500">{caseItem.referenceNumber}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {caseItem.title}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Forum: {caseItem.jurisdiction} • {caseItem.court}
              </p>
            </div>

            {/* Action Buttons & Version Picker */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <span className="text-slate-500 px-2">Version:</span>
                <select
                  value={activeVersion}
                  onChange={(e) => setActiveVersion(Number(e.target.value))}
                  className="bg-white px-2.5 py-1 rounded border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <option value={brief.versionNumber}>Version {brief.versionNumber} ({brief.status === 'reviewed' ? 'Reviewed' : 'Draft'})</option>
                  {brief.versionNumber > 1 && <option value={brief.versionNumber - 1}>Version {brief.versionNumber - 1} (Previous)</option>}
                </select>
              </div>

              {/* Generate Brief Button */}
              <button
                onClick={handleGenerateBrief}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors btn-interactive"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>{isLocalBrief ? 'Regenerate Brief' : 'Generate Brief'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyBrief}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors btn-interactive"
                title="Copy Full Case Brief"
              >
                {copiedBrief ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBrief ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handlePrintBrief}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors btn-interactive"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <Link
                href={`/workspace/cases/${caseItem.id}/documents`}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Documents</span>
              </Link>

              <Link
                href={`/workspace/cases/${caseItem.id}/handoff`}
                className="px-3.5 py-2 rounded-lg bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Secure Handoff</span>
              </Link>
            </div>
          </div>

          {/* Status Badges Strip */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            {isLocalBrief ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />
                📋 Auto-Generated Summary (No API Required)
              </span>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Advocate Verified &amp; Active
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                  <FileStack className="w-3.5 h-3.5 text-slate-500" />
                  Statutory Rule-Engine Extraction
                </span>
              </>
            )}
            <span className="text-[11px] text-slate-400 font-mono ml-auto">
              {brief.reviewedAt ? `Reviewed: ${brief.reviewedAt}` : `Created: ${brief.createdAt}`}
            </span>
          </div>

          {/* Generating overlay hint */}
          {isGenerating && (
            <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-800 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
              <span className="font-semibold">Extracting case facts, dates, and action items from case data... Screen will update immediately.</span>
            </div>
          )}
        </div>

        {/* Real-time Generated Brief Alert */}
        {briefGeneratedAlert && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pop-success">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-2">
                  <span>Case Brief Generated Successfully!</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase font-mono font-bold">Live on Screen</span>
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Executive summary, upcoming hearing chronology, and actionable tasks have been extracted and displayed below.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyBrief}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all btn-interactive"
              >
                {copiedBrief ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBrief ? 'Copied!' : 'Copy Brief'}</span>
              </button>
              <button
                onClick={handlePrintBrief}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all btn-interactive"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* 2-Column Main Layout: Structured Brief (Left 68%) + Notes & Citations (Right 32%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="generated-brief-section">
          
          {/* Left Column (68%): Structured Brief Sections */}
          <div className="lg:col-span-8 space-y-6">

            {/* Section 1: Executive Case Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>1. Executive Case Summary</span>
                </h3>
                {isEditingSummary ? (
                  <button
                    onClick={handleSaveSummary}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save Summary</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingSummary(true)}
                    className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Summary</span>
                  </button>
                )}
              </div>

              {isEditingSummary ? (
                <textarea
                  rows={5}
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-lg border border-slate-100">
                  {summaryText || caseItem.description || 'No summary currently established. Click "Generate Brief" to auto-generate one from case data.'}
                </p>
              )}
            </div>

            {/* Section 2: Parties Involved */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>2. Litigating Parties</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Party Name</th>
                      <th className="py-2.5 px-3">Role / Capacity</th>
                      <th className="py-2.5 px-3">Counsel on Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {brief.parties.length > 0 ? brief.parties.map((p, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{p.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{p.role}</td>
                        <td className="py-2.5 px-3 font-semibold text-blue-700">{p.counsel}</td>
                      </tr>
                    )) : (
                      <>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{caseItem.parties.petitioner}</td>
                          <td className="py-2.5 px-3 text-slate-600">Petitioner / Aggrieved Party</td>
                          <td className="py-2.5 px-3 font-semibold text-blue-700">Adv. Rajesh Verma</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{caseItem.parties.respondent}</td>
                          <td className="py-2.5 px-3 text-slate-600">Respondent / Opposing Body</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-500">Notice Issued</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Key Facts Extracted */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>3. Material Facts Stated in Documents</span>
              </h3>

              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                {brief.keyFacts.map((fact, idx) => (
                  <li key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span>{fact}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Section 4: Important Dates & Bench Hearings */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>4. Chronology &amp; Bench Listings</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Event / Benchmark Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {caseItem.nextHearingDate && (
                      <tr className="bg-blue-50/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{caseItem.nextHearingDate}</td>
                        <td className="py-2.5 px-3 text-slate-800 font-semibold">Scheduled Listing before {caseItem.court}</td>
                      </tr>
                    )}
                    {brief.importantDates.map((d, idx) => {
                      const isMissing = d.date.includes('Not found');
                      return (
                        <tr key={idx} className={isMissing ? 'bg-amber-50/50' : ''}>
                          <td className="py-2.5 px-3 font-mono font-bold whitespace-nowrap">
                            {isMissing ? (
                              <span className="italic text-slate-400 font-normal">
                                Not found in the provided documents
                              </span>
                            ) : (
                              <span className="text-blue-700">{d.date}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">{d.description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5: Suggested Action Items & Follow-up */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>5. Follow-Up Actions &amp; Recommendations</span>
              </h3>

              <div className="space-y-2">
                {brief.suggestedTasks.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs">
                    <input type="checkbox" className="mt-0.5 rounded text-blue-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{t.task}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {t.due && <span className="text-[10px] text-slate-500 font-mono">Suggested Due: {t.due}</span>}
                        {t.isSuggestion && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold border border-amber-200">
                            Suggestion — not a legal obligation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Evidentiary Gaps & Missing Information */}
            <div className="bg-[#FFFBEB] rounded-xl border border-amber-300 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>6. Evidentiary Gaps &amp; Unanswered Questions</span>
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                {isLocalBrief 
                  ? `The following information is typically required for ${caseItem.category} matters and should be collected before the next hearing:`
                  : 'The extraction engine identified the following missing evidentiary items required to substantiate the petition before the court:'}
              </p>
              <ul className="space-y-1.5 text-xs text-amber-950 list-disc list-inside">
                {brief.missingInformation.map((gap, idx) => (
                  <li key={idx} className="leading-relaxed">{gap}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column (32%): Lawyer Notes Feature + Citation Inspector */}
          <div className="lg:col-span-4 space-y-6">

            {/* LAWYER CONFIDENTIAL NOTES FEATURE */}
            <div className="bg-amber-50/70 rounded-xl border-2 border-amber-300 p-5 shadow-sm space-y-3 sticky top-20 z-10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-amber-600" />
                  <span>Advocate Private Notes</span>
                </h3>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                  Confidential
                </span>
              </div>

              <p className="text-[11px] text-amber-800 leading-relaxed">
                Record personal trial strategy, client communications, hearing dates, or cross-examination reminders for this case:
              </p>

              {notesSaved && (
                <div className="p-2 bg-emerald-100 text-emerald-800 text-[11px] rounded border border-emerald-300 flex items-center gap-1.5 font-bold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Notes saved! Persisted to case record.</span>
                </div>
              )}

              <textarea
                rows={6}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Type advocate notes, client instructions, legal precedents, or hearing prep here..."
                className="w-full p-3 text-xs rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-amber-700">
                  {notesText.length > 0 ? `${notesText.length} chars · Saved to localStorage` : 'Auto-saved to case record'}
                </span>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>

            {/* Documents Reviewed Panel */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileStack className="w-4 h-4 text-blue-600" />
                <span>Reviewed Source PDFs</span>
              </h3>

              <div className="space-y-2">
                {brief.documentsReviewed.length > 0 ? brief.documentsReviewed.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div className="overflow-hidden pr-2">
                      <p className="font-semibold text-slate-800 truncate">{doc.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{doc.pages} Pages Extracted</span>
                    </div>
                    <Link
                      href={`/workspace/cases/${caseItem.id}/documents`}
                      className="text-[#1B4FD8] hover:underline font-bold text-[11px] shrink-0"
                    >
                      Open PDF
                    </Link>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 italic">No documents uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Citation Inspector */}
            {brief.citations.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Document Citation Anchors</span>
                </h3>

                <div className="space-y-3">
                  {brief.citations.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:border-blue-300 transition-colors space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Page {c.page}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[130px]">{c.doc}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 italic border-l-2 border-blue-500 pl-2">
                        {c.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No citations hint for local briefs */}
            {brief.citations.length === 0 && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-center text-xs text-slate-400 space-y-1">
                <ShieldCheck className="w-6 h-6 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-500">No Citation Anchors</p>
                <p className="text-[11px]">Upload PDFs and use AI Brief generation to extract document citations.</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </AppShell>
  );
}

export default function BriefViewerPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading brief viewer...</div>}>
      <BriefViewerContent />
    </Suspense>
  );
}
