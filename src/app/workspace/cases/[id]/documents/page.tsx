'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileUp, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Trash2, 
  Eye, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Loader2,
  FolderOpen,
  Calendar,
  Users,
  Check
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { CaseItem, CaseDocument, BriefVersion } from '@/lib/types';
import { 
  getCaseById, 
  getStoredDocuments, 
  addDocumentToCase, 
  deleteDocument, 
  updateDocumentExtraction,
  getStoredBrief,
  saveStoredBrief
} from '@/lib/caseStore';

function DocumentsContent() {
  const params = useParams();
  const router = useRouter();
  const caseId = (params?.id as string) || 'case-101';

  const [caseItem, setCaseItem] = useState<CaseItem | undefined>(undefined);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [extractingIds, setExtractingIds] = useState<string[]>([]);
  const [extractedPreviews, setExtractedPreviews] = useState<Record<string, string>>({});
  const [lastUploadedSummary, setLastUploadedSummary] = useState<string | null>(null);

  useEffect(() => {
    const found = getCaseById(caseId);
    setCaseItem(found);
    const docs = getStoredDocuments(caseId);
    setDocuments(docs);
    if (docs.length > 0) {
      setSelectedDocs(docs.slice(0, 2).map(d => d.id));
    }
  }, [caseId]);

  const handleRealUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !caseItem) return;
    const file = e.target.files[0];

    setIsUploading(true);
    setUploadStatus(`Reading and extracting text from ${file.name} via offline NLP engine...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      const extracted = json?.data;

      const summaryText = extracted?.summary || `Document ${file.name} parsed successfully.`;
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
        summary: summaryText,
        fullText: summaryText
      });

      setDocuments(prev => [created, ...prev]);
      setSelectedDocs(prev => [...prev, created.id]);
      setExtractedPreviews(prev => ({
        ...prev,
        [created.id]: summaryText
      }));
      setLastUploadedSummary(summaryText);

      // CRITICAL: Update the Case Brief with the REAL extracted summary and parties from this PDF!
      if (summaryText && summaryText.length > 20) {
        const existingBrief = getStoredBrief(caseItem.id, caseItem);
        const updatedBrief: BriefVersion = {
          ...existingBrief,
          versionNumber: existingBrief.versionNumber + 1,
          summary: summaryText,
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
          keyFacts: extracted?.statutes?.length > 0 || detectedDates.length > 0 ? [
            ...detectedDates.slice(0, 3).map((d: any) => `Date reference: ${d.date} — ${d.context}`),
            ...(extracted?.statutes?.map((s: string) => `Applicable Statutory Ground: ${s}`) || [])
          ].slice(0, 5) : existingBrief.keyFacts,
          importantDates: detectedDates.length > 0 
            ? detectedDates.slice(0, 6).map((d: any) => ({ date: d.date, description: d.context }))
            : existingBrief.importantDates,
          reviewedAt: `${new Date().toLocaleDateString('en-GB')} via Document NLP Extraction`,
          status: 'draft'
        };

        saveStoredBrief(caseItem.id, updatedBrief);
      }

      setUploadStatus(`Extracted ${file.name} successfully! Case brief updated.`);
      setTimeout(() => setUploadStatus(''), 4000);

    } catch (err: any) {
      console.error('Document upload/extraction failed:', err);
      setUploadStatus('Upload error: ' + (err?.message || 'Failed to extract'));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteDocument = (docId: string) => {
    deleteDocument(docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    setSelectedDocs(prev => prev.filter(id => id !== docId));
  };

  const toggleSelectDoc = (id: string) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (!caseItem) {
    return (
      <AppShell activeNav="cases" breadcrumb="Case Documents">
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-4 max-w-xl mx-auto my-12">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
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
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeNav="cases" breadcrumb={`Documents • ${caseItem.referenceNumber}`}>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/workspace/cases/${caseItem.id}`} className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Case Overview</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-mono text-slate-500">{caseItem.referenceNumber}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Case Documents &amp; NLP Extraction</h1>
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                {documents.length} Files
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{caseItem.title}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/workspace/cases/${caseItem.id}`}
              className="px-4 py-2.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>View Updated Case Brief</span>
            </Link>
          </div>
        </div>

        {/* Success Banner if document was just extracted */}
        {lastUploadedSummary && (
          <div className="p-4 bg-emerald-50 border border-emerald-400 rounded-xl text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-2">
                  <span>Document Extracted Successfully!</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold uppercase font-mono">Real NLP</span>
                </h4>
                <p className="text-xs text-emerald-800 mt-1 line-clamp-2 leading-relaxed">
                  "{lastUploadedSummary}"
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Summary, dates, and parties have been automatically updated in your Case Brief.
                </p>
              </div>
            </div>
            <Link
              href={`/workspace/cases/${caseItem.id}`}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shrink-0 text-center transition-colors shadow-xs"
            >
              View In Case Brief →
            </Link>
          </div>
        )}

        {/* Upload Dropzone */}
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 p-8 text-center transition-colors shadow-sm">
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            id="pdf-upload"
            onChange={handleRealUpload}
            className="hidden"
            disabled={isUploading}
          />
          <label htmlFor="pdf-upload" className={`cursor-pointer block space-y-3 ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1B4FD8] flex items-center justify-center mx-auto">
              {isUploading ? <Loader2 className="w-7 h-7 animate-spin" /> : <FileUp className="w-7 h-7" />}
            </div>
            <h3 className="font-bold text-sm text-[#0F172A]">
              {isUploading ? uploadStatus || 'Extracting Text & Facts...' : 'Click to Upload Document (PDF / TXT) for Zero-AI NLP Extraction'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Extracts dates, litigating parties, monetary claims, statutes, and a concise summary in milliseconds using local TF-IDF processing.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Offline Processing — No Data Sent to Third-Party AI APIs</span>
            </div>
          </label>
        </div>

        {/* Document Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
              Case Documents
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                {documents.length}
              </span>
            </h2>
            <span className="text-xs text-slate-500">Uploaded documents are indexed and linked to your brief</span>
          </div>

          {documents.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FolderOpen className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-600">No documents uploaded yet</p>
              <p className="text-xs text-slate-400">Upload your PDF above to extract facts and generate brief</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-10">Select</th>
                    <th className="py-3 px-4">Document Name</th>
                    <th className="py-3 px-4">Size &amp; Pages</th>
                    <th className="py-3 px-4">NLP Extraction Summary</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => {
                    const isSelected = selectedDocs.includes(doc.id);
                    const hasExtractedSummary = doc.summary && doc.summary.length > 20;
                    return (
                      <tr key={doc.id} className={isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'}>
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectDoc(doc.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <p className="font-bold text-[#0F172A]">{doc.fileName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Uploaded: {doc.uploadDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {doc.fileSize} • {doc.pageCount} Pages
                        </td>
                        <td className="py-3.5 px-4 max-w-md">
                          {hasExtractedSummary ? (
                            <div className="p-2 bg-slate-50 rounded border border-slate-200">
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded mr-1.5">
                                Extracted
                              </span>
                              <span className="text-slate-700 text-[11px] line-clamp-2 leading-relaxed">
                                {doc.summary}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Extraction pending</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded cursor-pointer transition-colors"
                            title="Delete document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading documents...</div>}>
      <DocumentsContent />
    </Suspense>
  );
}
