'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  FolderOpen
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { CaseItem, CaseDocument } from '@/lib/types';
import { getCaseById, getStoredDocuments, addDocumentToCase, deleteDocument, updateDocumentExtraction } from '@/lib/caseStore';

function DocumentsContent() {
  const params = useParams();
  const caseId = (params?.id as string) || 'case-101';

  const [caseItem, setCaseItem] = useState<CaseItem | undefined>(undefined);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [extractingIds, setExtractingIds] = useState<string[]>([]);
  const [extractedPreviews, setExtractedPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    const found = getCaseById(caseId);
    setCaseItem(found);
    const docs = getStoredDocuments(caseId);
    setDocuments(docs);
    if (docs.length > 0) {
      setSelectedDocs(docs.slice(0, 2).map(d => d.id));
    }
  }, [caseId]);

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !caseItem) return;
    const file = e.target.files[0];

    setIsUploading(true);
    setTimeout(() => {
      const created = addDocumentToCase({
        caseId: caseItem.id,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        processingStatus: 'done' as const,
        extractionStatus: 'pending' as any,
        pageCount: Math.floor(Math.random() * 20) + 5,
        summary: undefined
      });
      setDocuments(prev => [created, ...prev]);
      setSelectedDocs(prev => [...prev, created.id]);
      setIsUploading(false);
      // reset input so same file can be re-uploaded
      e.target.value = '';
    }, 1500);
  };

  const handleDeleteDocument = (docId: string) => {
    deleteDocument(docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    setSelectedDocs(prev => prev.filter(id => id !== docId));
  };

  const handleExtractText = (doc: CaseDocument) => {
    if (extractingIds.includes(doc.id)) return;
    setExtractingIds(prev => [...prev, doc.id]);
    setTimeout(() => {
      updateDocumentExtraction(doc.id, 'done');
      setDocuments(prev =>
        prev.map(d => d.id === doc.id ? { ...d, extractionStatus: 'done' } : d)
      );
      setExtractedPreviews(prev => ({
        ...prev,
        [doc.id]: `Text extracted: ${doc.fileName} — ${doc.pageCount} pages processed.`
      }));
      setExtractingIds(prev => prev.filter(id => id !== doc.id));
    }, 2000);
  };

  const toggleSelectDoc = (id: string) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (!caseItem) {
    return (
      <AppShell activeNav="documents" breadcrumb="Case Documents">
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-4">
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
    <AppShell activeNav="documents" breadcrumb={`Case Documents • ${caseItem.referenceNumber}`}>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/workspace/cases" className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cases Portfolio</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-mono text-slate-500">{caseItem.referenceNumber}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Case Documents &amp; Extraction</h1>
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                {documents.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{caseItem.title}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/workspace/cases/${caseItem.id}/briefs`}
              className="px-4 py-2.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Brief from Selected ({selectedDocs.length})</span>
            </Link>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 p-8 text-center transition-colors shadow-sm">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            id="pdf-upload"
            onChange={handleSimulateUpload}
            className="hidden"
            disabled={isUploading}
          />
          <label htmlFor="pdf-upload" className={`cursor-pointer block space-y-3 ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1B4FD8] flex items-center justify-center mx-auto">
              {isUploading ? <Loader2 className="w-7 h-7 animate-spin" /> : <FileUp className="w-7 h-7" />}
            </div>
            <h3 className="font-bold text-sm text-[#0F172A]">
              {isUploading ? 'Uploading & Processing...' : 'Click to Upload Case Document or Drag & Drop'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Supports PDF, DOC, DOCX, PNG, JPG up to 50MB. Text layers are structured with page anchors.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Stored in Encrypted Private Supabase Bucket</span>
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
            <span className="text-xs text-slate-500">Select files to generate structured case brief</span>
          </div>

          {documents.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FolderOpen className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-600">No documents yet</p>
              <p className="text-xs text-slate-400">Upload your first case document to begin</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-10">Select</th>
                    <th className="py-3 px-4">Document Name</th>
                    <th className="py-3 px-4">Size &amp; Pages</th>
                    <th className="py-3 px-4">Storage Status</th>
                    <th className="py-3 px-4">Text Extraction</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => {
                    const isSelected = selectedDocs.includes(doc.id);
                    const isExtracting = extractingIds.includes(doc.id);
                    const extractedPreview = extractedPreviews[doc.id];
                    return (
                      <tr key={doc.id} className={isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'}>
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectDoc(doc.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                            <div>
                              <p className="font-bold text-[#0F172A]">{doc.fileName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Uploaded: {doc.uploadDate}</p>
                              {extractedPreview && (
                                <p className="text-[10px] text-emerald-600 mt-0.5 font-medium">{extractedPreview}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {doc.fileSize} • {doc.pageCount} Pages
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Encrypted
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {doc.extractionStatus === 'done' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                              <CheckCircle className="w-3 h-3 text-blue-600" />
                              Extracted
                            </span>
                          ) : isExtracting ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                              Extracting...
                            </span>
                          ) : (
                            <button
                              onClick={() => handleExtractText(doc)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                            >
                              <Sparkles className="w-3 h-3" />
                              Extract Text
                            </button>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/workspace/cases/${caseItem.id}/briefs`}
                              className="text-[#1B4FD8] hover:underline text-xs font-semibold"
                            >
                              View Brief
                            </Link>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

export default function DocumentUploadPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading documents...</div>}>
      <DocumentsContent />
    </Suspense>
  );
}
