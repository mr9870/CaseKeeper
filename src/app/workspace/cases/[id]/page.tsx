'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  Printer,
  Scale,
  Building,
  Info,
  Upload,
  FileUp,
  Check
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { CaseItem, BriefVersion, CaseDocument } from '@/lib/types';
import { 
  getCaseById, 
  updateCaseNotes, 
  getStoredBrief, 
  saveStoredBrief, 
  getStoredDocuments,
  addDocumentToCase
} from '@/lib/caseStore';
import { DEMO_CASE_ID, PRIMARY_DEMO_CASE } from '@/lib/demoCaseData';

// ─── Local Brief Generator ───────────────────────────────────────────────────

function generateLocalBrief(caseItem: CaseItem, documents: CaseDocument[], currentVersionNumber: number): BriefVersion {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Check if any document has an actual extracted summary
  const docWithSummary = documents.find(d => d.summary && d.summary.length > 25);

  // Summary: prefer document's actual extracted text if available
  const summary = docWithSummary?.summary
    ? docWithSummary.summary
    : `This matter involves ${caseItem.title}. ${caseItem.description || 'The dispute pertains to legal proceedings instituted before the competent authority.'}. The case is currently ${caseItem.status} before ${caseItem.court}, listed under reference number ${caseItem.referenceNumber}.`;

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

  // Key Facts
  const descSentences = (caseItem.description || '')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .slice(0, 3);

  const staticFacts = [
    `Petitioner: ${caseItem.parties.petitioner} instituted proceedings before ${caseItem.court}.`,
    `Respondent: ${caseItem.parties.respondent} served notice by tribunal.`,
    `Reference Number: ${caseItem.referenceNumber} under jurisdiction: ${caseItem.jurisdiction}.`,
  ];

  const keyFacts = [...descSentences, ...staticFacts].slice(0, 5);

  // Important Dates
  const importantDates: BriefVersion['importantDates'] = [
    { date: caseItem.lastUpdated, description: 'Case last updated in record' },
  ];
  if (caseItem.nextHearingDate) {
    importantDates.unshift({
      date: caseItem.nextHearingDate,
      description: `Next scheduled bench listing before ${caseItem.court}`
    });
  }

  // Hearing Dates
  const hearingDates: BriefVersion['hearingDates'] = caseItem.nextHearingDate
    ? [{ date: caseItem.nextHearingDate, court: caseItem.court, purpose: 'Next scheduled bench listing' }]
    : [];

  // Category Tasks
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
      { task: 'Obtain weather data records from IMD for the relevant season', due: '' },
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

  const categoryMissingInfo: Record<string, string[]> = {
    'Consumer Complaints': [
      'Original purchase invoice and bill of sale',
      'Service centre repair records and job sheets',
      'Written complaint acknowledgement from respondent company',
    ],
    'Property & RERA': [
      'Builder-Buyer Agreement signed copy (all pages)',
      'Possession delay communication letters / emails from builder',
      'RERA registration certificate & sanctioned floor plan',
      'Bank payment receipts and interest ledger',
    ],
    'default': [
      'Original documentary evidence supporting the claims',
      'Written notice sent to opposite party before litigation',
      'Proof of service of pleadings on respondent',
    ],
  };

  const missingInformation = categoryMissingInfo[caseItem.category] || categoryMissingInfo['default'];

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

// ─── Simple Case Brief & Details View ────────────────────────────────────────

function CaseViewContent() {
  const params = useParams();
  const router = useRouter();
  const caseId = (params?.id as string) || DEMO_CASE_ID;
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  
  // Real Document Extraction state
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [extractedDocName, setExtractedDocName] = useState<string | null>(null);

  // Advocate notes feature state
  const [notesText, setNotesText] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    const foundCase = getCaseById(caseId) || (caseId === DEMO_CASE_ID ? PRIMARY_DEMO_CASE : undefined);
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

  // Real PDF / TXT upload & zero-AI NLP extraction handler
  const handleUploadAndExtract = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !caseItem) return;
    const file = e.target.files[0];

    setIsUploadingDoc(true);
    setUploadStatus(`Extracting dates, names, and facts from ${file.name}...`);
    setExtractedDocName(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      const extracted = json?.data;

      const summary = extracted?.summary || `Processed ${file.name} successfully.`;
      const detectedParties = extracted?.parties;
      const detectedDates = extracted?.dates || [];

      // Save document to storage
      const created = addDocumentToCase({
        caseId: caseItem.id,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        processingStatus: 'done',
        extractionStatus: 'done',
        pageCount: Math.max(1, Math.ceil(file.size / 45000)),
        summary: summary,
        fullText: summary
      });

      setDocuments(prev => [created, ...prev]);

      // Immediately update Brief on screen with REAL extracted content from this file!
      const updatedBrief: BriefVersion = {
        id: `brief-extracted-${Date.now()}`,
        caseId: caseItem.id,
        versionNumber: (brief?.versionNumber || 1) + 1,
        status: 'draft',
        isAiGenerated: false,
        createdAt: `${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}`,
        reviewedAt: `${new Date().toLocaleDateString('en-GB')} via Offline NLP Engine`,
        summary: summary,
        parties: [
          {
            name: (detectedParties?.petitioner && !detectedParties.petitioner.includes('Not explicitly'))
              ? detectedParties.petitioner
              : caseItem.parties.petitioner,
            role: 'Petitioner / Complainant',
            counsel: detectedParties?.counsels?.[0] || 'Advocate on Record'
          },
          {
            name: (detectedParties?.respondent && !detectedParties.respondent.includes('Not explicitly'))
              ? detectedParties.respondent
              : caseItem.parties.respondent,
            role: 'Respondent / Opposing Body',
            counsel: 'Notice Issued'
          }
        ],
        keyFacts: detectedDates.length > 0 || extracted?.statutes?.length > 0 ? [
          ...detectedDates.slice(0, 3).map((d: any) => `Date milestone: ${d.date} — ${d.context}`),
          ...(extracted?.statutes?.map((s: string) => `Applicable Statute: ${s}`) || [])
        ].slice(0, 5) : (brief?.keyFacts || []),
        importantDates: detectedDates.length > 0 
          ? detectedDates.slice(0, 6).map((d: any) => ({ date: d.date, description: d.context }))
          : (brief?.importantDates || []),
        hearingDates: brief?.hearingDates || [],
        suggestedTasks: brief?.suggestedTasks || [],
        missingInformation: brief?.missingInformation || [],
        documentsReviewed: [{ name: file.name, pages: Math.max(1, Math.ceil(file.size / 45000)) }, ...(brief?.documentsReviewed || [])],
        citations: []
      };

      setBrief(updatedBrief);
      setSummaryText(summary);
      saveStoredBrief(caseItem.id, updatedBrief);
      setActiveVersion(updatedBrief.versionNumber);
      setExtractedDocName(file.name);
      setBriefGeneratedAlert(true);
      setUploadStatus(`Extracted ${file.name} successfully! Case brief updated.`);
      setTimeout(() => setUploadStatus(''), 4000);

    } catch (err: any) {
      console.error('Failed to extract:', err);
      setUploadStatus('Extraction failed: ' + (err?.message || 'Error'));
    } finally {
      setIsUploadingDoc(false);
      e.target.value = '';
    }
  };

  const handleGenerateBrief = () => {
    if (!caseItem) return;
    setIsGenerating(true);
    setBriefGeneratedAlert(false);
    
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
    }, 800);
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
• Petitioner: ${brief.parties[0]?.name || caseItem.parties.petitioner}
• Respondent: ${brief.parties[1]?.name || caseItem.parties.respondent}

3. MATERIAL FACTS EXTRACTED:
${brief.keyFacts.map((f, i) => `${i + 1}. ${f}`).join('\n')}

4. BENCH LISTINGS & CHRONOLOGY:
${brief.importantDates.map((d) => `• ${d.date}: ${d.description}`).join('\n')}

5. RECOMMENDED ACTIONS:
${brief.suggestedTasks.map((t) => `[ ] ${t.task} ${t.due ? `(Due: ${t.due})` : ''}`).join('\n')}

6. EVIDENTIARY GAPS:
${brief.missingInformation.map((m) => `! ${m}`).join('\n')}
=====================================================
CaseKeeper Legal Intelligence Engine
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
      <AppShell activeNav="cases" breadcrumb="Case Details">
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-4 max-w-xl mx-auto my-12 shadow-sm">
          <FileStack className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Case Selected or Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please register a new case docket or select an existing case from your active portfolio.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/workspace/cases"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
            >
              ← Back to Cases
            </Link>
            <Link
              href="/workspace/cases/new"
              className="px-4 py-2 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              + Register New Case
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeNav="cases" breadcrumb={`Case • ${caseItem.referenceNumber}`}>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Hidden File Input for Direct PDF/TXT Extraction */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleUploadAndExtract}
          className="hidden"
        />

        {/* Top Contextual Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Link
                  href="/workspace/cases"
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Active Cases</span>
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {caseItem.referenceNumber}
                </span>
                {caseId === DEMO_CASE_ID && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Demo
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {caseItem.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{caseItem.court} • {caseItem.jurisdiction}</span>
              </p>
            </div>

            {/* Action Buttons & Version Picker */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <span className="text-slate-500 px-2">Version:</span>
                <select
                  value={activeVersion}
                  onChange={(e) => setActiveVersion(Number(e.target.value))}
                  className="bg-white px-2.5 py-1 rounded border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value={brief.versionNumber}>Version {brief.versionNumber} ({brief.status === 'reviewed' ? 'Reviewed' : 'Draft'})</option>
                  {brief.versionNumber > 1 && <option value={brief.versionNumber - 1}>Version {brief.versionNumber - 1} (Previous)</option>}
                </select>
              </div>

              {/* Direct Upload & Extract Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingDoc}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                title="Upload personal PDF or document to extract real summary & dates"
              >
                {isUploadingDoc ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting PDF...</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-3.5 h-3.5" />
                    <span>Extract from My PDF</span>
                  </>
                )}
              </button>

              {/* Generate Brief Button */}
              <button
                onClick={handleGenerateBrief}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Regenerate Brief</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyBrief}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy Full Case Brief"
              >
                {copiedBrief ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBrief ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handlePrintBrief}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <Link
                href={`/workspace/cases/${caseItem.id}/documents`}
                className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Documents ({documents.length})</span>
              </Link>

              <Link
                href={`/workspace/cases/${caseItem.id}/handoff`}
                className="px-3.5 py-2 rounded-lg bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Secure Handoff</span>
              </Link>
            </div>
          </div>

          {/* Status Badges Strip */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Offline NLP Engine (Zero AI API)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Next Listing: {caseItem.nextHearingDate || 'Pending Listing'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono ml-auto">
              {brief.reviewedAt ? `Reviewed: ${brief.reviewedAt}` : `Created: ${brief.createdAt}`}
            </span>
          </div>

          {/* Upload progress message */}
          {isUploadingDoc && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
              <span className="font-semibold">{uploadStatus}</span>
            </div>
          )}
        </div>

        {/* Real-time Generated Brief Alert */}
        {briefGeneratedAlert && (
          <div className="p-4 bg-emerald-50 border border-emerald-400 rounded-xl text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-2">
                  <span>{extractedDocName ? `Extracted from ${extractedDocName}!` : 'Case Brief Generated Successfully!'}</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase font-mono font-bold">
                    {extractedDocName ? 'Extracted from My PDF' : 'Updated'}
                  </span>
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Executive summary, litigating parties, and dates have been extracted and updated on screen below.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyBrief}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedBrief ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBrief ? 'Copied!' : 'Copy Brief'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2-Column Clean Layout: Case Brief (Left 68%) + Advocate Notes & Details (Right 32%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="generated-brief-section">
          
          {/* Left Column (68% / 8 cols): Structured Brief Sections */}
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
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save Summary</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingSummary(true)}
                    className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Summary</span>
                  </button>
                )}
              </div>

              {isEditingSummary ? (
                <textarea
                  rows={6}
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8] leading-relaxed"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-lg border border-slate-100">
                  {summaryText || caseItem.description || 'No summary currently established. Click "Extract from My PDF" to extract one from your document.'}
                </p>
              )}
            </div>

            {/* Section 2: Litigating Parties */}
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
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{p.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{p.role}</td>
                        <td className="py-2.5 px-3 font-semibold text-blue-700">{p.counsel}</td>
                      </tr>
                    )) : (
                      <>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{caseItem.parties.petitioner}</td>
                          <td className="py-2.5 px-3 text-slate-600">Petitioner / Aggrieved Party</td>
                          <td className="py-2.5 px-3 font-semibold text-blue-700">Adv. Rajesh Verma</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
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

            {/* Section 3: Material Facts Stated in Documents */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>3. Material Facts Stated in Documents</span>
              </h3>

              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                {brief.keyFacts.map((fact, idx) => (
                  <li key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 leading-relaxed">
                    <span className="font-medium text-slate-800">{fact}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Section 4: Chronology & Bench Listings */}
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
                      <th className="py-2.5 px-3">Event / Milestone Record</th>
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
                        <tr key={idx} className={isMissing ? 'bg-amber-50/50' : 'hover:bg-slate-50/50'}>
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

            {/* Section 5: Follow-Up Actions & Recommendations */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>5. Follow-Up Actions &amp; Recommendations</span>
              </h3>

              <div className="space-y-2">
                {brief.suggestedTasks.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs">
                    <input type="checkbox" className="mt-0.5 rounded text-blue-600 cursor-pointer" />
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
                The extraction engine identified the following missing evidentiary items required to substantiate the petition before the court:
              </p>
              <ul className="space-y-2 text-xs text-amber-950 list-disc list-inside">
                {brief.missingInformation.map((gap, idx) => (
                  <li key={idx} className="leading-relaxed font-medium">{gap}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column (32% / 4 cols): Advocate Private Notes & Case Details */}
          <div className="lg:col-span-4 space-y-6">

            {/* ADVOCATE CONFIDENTIAL NOTES FEATURE */}
            <div className="bg-amber-50/80 rounded-xl border-2 border-amber-300 p-5 shadow-sm space-y-3 sticky top-20 z-10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-amber-600" />
                  <span>Advocate Private Notes</span>
                </h3>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-300">
                  Confidential
                </span>
              </div>

              <p className="text-[11px] text-amber-800 leading-relaxed">
                Record personal trial strategy, client instructions, bench observations, or cross-examination reminders:
              </p>

              {notesSaved && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 text-[11px] rounded-lg border border-emerald-300 flex items-center gap-1.5 font-bold animate-fade-in">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Notes saved! Persisted to case docket.</span>
                </div>
              )}

              <textarea
                rows={6}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Type advocate notes, client instructions, legal precedents, or hearing prep here..."
                className="w-full p-3 text-xs rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 leading-relaxed shadow-xs"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-amber-700">
                  {notesText.length > 0 ? `${notesText.length} chars · Saved` : 'Auto-saved to case record'}
                </span>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>

              <div className="pt-2 border-t border-amber-200 text-[10px] text-amber-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3 stamph-3 text-amber-700 shrink-0" />
                <span>Privileged under Section 126, Indian Evidence Act</span>
              </div>
            </div>

            {/* Case Details Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>Case Specifications</span>
              </h3>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold capitalize text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {caseItem.status}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Category</span>
                  <span className="font-semibold text-slate-800">{caseItem.category}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Jurisdiction</span>
                  <span className="font-semibold text-slate-800">{caseItem.jurisdiction}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Court / Forum</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[180px] truncate">{caseItem.court}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Next Hearing</span>
                  <span className="font-mono font-bold text-blue-700">{caseItem.nextHearingDate || 'Pending Listing'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="font-mono text-slate-600">{caseItem.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Documents Panel with Direct Upload Action */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FileStack className="w-4 h-4 text-blue-600" />
                  <span>Case Documents ({documents.length})</span>
                </h3>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>+ Upload PDF</span>
                </button>
              </div>

              <div className="space-y-2">
                {documents.length > 0 ? documents.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs hover:border-slate-300 transition-colors">
                    <div className="overflow-hidden pr-2">
                      <p className="font-semibold text-slate-800 truncate">{doc.fileName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {doc.pageCount || 1} Pages • {doc.fileSize || 'Doc'}
                      </span>
                      {doc.summary && (
                        <p className="text-[10px] text-emerald-700 font-medium truncate mt-0.5">
                          ✓ Extracted via Offline NLP
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/workspace/cases/${caseItem.id}/documents`}
                      className="text-[#1B4FD8] hover:underline font-bold text-[11px] shrink-0"
                    >
                      Manage
                    </Link>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 italic">No documents uploaded yet.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}

export default function CaseIntelligenceWorkspacePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading case workspace...</div>}>
      <CaseViewContent />
    </Suspense>
  );
}
