'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeftRight, 
  Send, 
  CheckCircle, 
  Lock, 
  FileText, 
  User, 
  ShieldAlert, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { CaseItem, Handoff } from '@/lib/types';
import { getCaseById, saveHandoff, getStoredDocuments } from '@/lib/caseStore';
import { getLawyersDirectory } from '@/lib/lawyerStore';

function HandoffContent() {
  const params = useParams();
  const caseId = (params?.id as string) || '';
  const [caseItem, setCaseItem] = useState<CaseItem | undefined>(undefined);
  const [lawyers, setLawyers] = useState(getLawyersDirectory());
  const [documents, setDocuments] = useState<any[]>([]);

  const [step, setStep] = useState(1);
  const [selectedLawyer, setSelectedLawyer] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [includeBrief, setIncludeBrief] = useState(true);
  const [notes, setNotes] = useState('');
  const [handoffSuccess, setHandoffSuccess] = useState(false);
  const [newHandoffId, setNewHandoffId] = useState('');

  useEffect(() => {
    const found = getCaseById(caseId);
    setCaseItem(found);
    const directory = getLawyersDirectory();
    setLawyers(directory);
    if (directory.length > 0) setSelectedLawyer(directory[0].id);

    const docs = getStoredDocuments(caseId);
    setDocuments(docs);
    if (docs.length > 0) setSelectedDocs([docs[0].id]);
  }, [caseId]);

  const recipient = lawyers.find(l => l.id === selectedLawyer);

  const handleSendHandoff = () => {
    if (!recipient || !caseItem) return;
    const generatedId = `HO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setNewHandoffId(generatedId);
    const newHandoff: Handoff = {
      id: generatedId,
      caseId: caseItem.id,
      caseTitle: caseItem.title,
      senderName: 'Advocate',
      senderEmail: 'advocate@casekeeper.in',
      recipientName: recipient.name,
      recipientEmail: recipient.email,
      status: 'sent',
      sentDate: new Date().toISOString().split('T')[0],
      briefVersionId: `brief-${caseItem.id}`,
      selectedDocuments: selectedDocs,
      notes: notes || 'Sharing verified case brief and documents for legal collaboration.'
    };
    saveHandoff(newHandoff);
    setHandoffSuccess(true);
  };

  if (!caseItem) {
    return (
      <AppShell activeNav="cases" breadcrumb="Case Handoff">
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-4">
          <ArrowLeftRight className="w-12 h-12 text-slate-300 mx-auto" />
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
    <AppShell activeNav="cases" breadcrumb={`Secure Handoff • ${caseItem.referenceNumber}`}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Wizard Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Secure Advocate Handoff Wizard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transfer case materials and AI brief summaries to an authorized co-counsel. Access is secured via private storage and can be revoked at any time.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 text-xs font-bold text-center">
          <div className={`p-2.5 rounded-lg border ${step >= 1 ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-white text-slate-400'}`}>
            1. Select Counsel
          </div>
          <div className={`p-2.5 rounded-lg border ${step >= 2 ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-white text-slate-400'}`}>
            2. Choose Materials
          </div>
          <div className={`p-2.5 rounded-lg border ${step >= 3 ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-white text-slate-400'}`}>
            3. Preview & Access
          </div>
          <div className={`p-2.5 rounded-lg border ${step >= 4 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-white text-slate-400'}`}>
            4. Dispatch
          </div>
        </div>

        {handoffSuccess ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Case Handoff Invitation Dispatched</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              An encrypted invitation token has been dispatched to <strong>{recipient?.name}</strong> ({recipient?.email}). Access to selected materials remains in <em>Pending Acceptance</em> status until confirmed.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg max-w-sm mx-auto text-left text-xs font-mono space-y-1 text-slate-600">
              <p>Handoff ID: <span className="text-[#1B4FD8]">{newHandoffId || 'HO-2026-8902'}</span></p>
              <p>Status: <span className="text-amber-600">Invitation Sent (Unaccepted)</span></p>
              <p>Revocation Rule: <span className="text-emerald-600">Enabled</span></p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/workspace/handoffs"
                className="px-4 py-2 bg-[#1B4FD8] text-white font-bold text-xs rounded-lg shadow-sm"
              >
                View Outgoing Handoffs
              </Link>
              <Link
                href="/workspace/dashboard"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            
            {/* STEP 1: Select Recipient */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                  Step 1: Select Receiving Advocate
                </h3>
                <div className="space-y-2">
                  {lawyers.map((l) => (
                    <label
                      key={l.id}
                      className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-colors ${
                        selectedLawyer === l.id ? 'bg-blue-50/60 border-blue-400' : 'hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="recipient"
                          checked={selectedLawyer === l.id}
                          onChange={() => setSelectedLawyer(l.id)}
                          className="text-blue-600"
                        />
                        <div>
                          <p className="font-bold text-xs text-slate-900">{l.name}</p>
                          <p className="text-[11px] text-slate-500">{l.title} • {l.city}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Bar: {l.barNumber}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        {l.experienceYears} Yrs Exp
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
                  >
                    <span>Next: Select Materials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Choose Documents & Briefs */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                  Step 2: Choose Case Materials to Share
                </h3>

                {/* Brief toggle */}
                <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeBrief}
                      onChange={(e) => setIncludeBrief(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-bold text-xs text-blue-900">Include Structured Case Brief (Version 3 — Reviewed)</span>
                  </label>
                  <p className="text-[11px] text-slate-600 pl-5">
                    Shares the full AI summary, key facts, bench dates, and citation anchors without granting edit rights.
                  </p>
                </div>

                {/* Document Selector */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Select Individual Case PDFs:</p>
                  {documents.length > 0 ? documents.map((doc) => (
                    <label
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => {
                            setSelectedDocs(prev => 
                              prev.includes(doc.id) ? prev.filter(x => x !== doc.id) : [...prev, doc.id]
                            );
                          }}
                          className="rounded text-blue-600"
                        />
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-800">{doc.fileName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{doc.fileSize}</span>
                    </label>
                  )) : (
                    <p className="text-xs text-slate-400 italic">No documents uploaded to this case yet.</p>
                  )}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
                  >
                    <span>Next: Review & Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Preview & Access */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                  Step 3: Preview Handoff Package & Instructions
                </h3>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Case Matter:</span>
                    <span className="font-bold text-slate-900">{caseItem.title}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Recipient Advocate:</span>
                    <span className="font-bold text-blue-700">{recipient?.name} ({recipient?.email})</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Materials Included:</span>
                    <span className="font-mono text-slate-700">
                      {includeBrief ? '1 Brief (v3) + ' : ''}{selectedDocs.length} Documents
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instructions / Transmittal Memo:
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Revocation Guarantee (PRD Section 5.8):</strong> The recipient cannot download files without an active session. Revoking this handoff immediately invalidates all signed URLs and blocks downstream access.
                  </span>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSendHandoff}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Handoff Invitation</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </AppShell>
  );
}

export default function HandoffWizardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading handoff wizard...</div>}>
      <HandoffContent />
    </Suspense>
  );
}

