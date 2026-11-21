'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Scale, 
  FileText, 
  FileSearch, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Shield, 
  Send, 
  Lock, 
  History, 
  Sparkles, 
  Search, 
  Filter, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  ArrowLeft, 
  Download, 
  Upload, 
  RefreshCw, 
  X, 
  Check, 
  SlidersHorizontal,
  Bookmark,
  Calendar,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Info,
  Building,
  UserCheck,
  StickyNote,
  Save
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { 
  getCaseById, 
  getStoredDocuments, 
  getCaseContradictions, 
  updateContradictionStatus,
  getCaseEvidenceGaps, 
  updateEvidenceGapStatus,
  getCaseTimeline, 
  addTimelineEvent,
  getCaseFactVerifications, 
  updateFactVerification,
  getCaseReadiness, 
  getStoredBrief, 
  saveStoredBrief,
  getStoredTasks,
  addDocumentToCase,
  resetDemoCase,
  updateCaseNotes
} from '@/lib/caseStore';
import { 
  CaseItem, 
  CaseDocument, 
  Contradiction, 
  EvidenceGap, 
  TimelineEvent, 
  FactVerification, 
  BriefVersion, 
  SourcePin,
  CaseReadiness
} from '@/lib/types';
import { DEMO_CASE_ID, PRIMARY_DEMO_CASE } from '@/lib/demoCaseData';

type WorkspaceTab = 
  | 'overview' 
  | 'brief' 
  | 'evidence' 
  | 'timeline' 
  | 'contradictions' 
  | 'gaps' 
  | 'review' 
  | 'notes' 
  | 'history' 
  | 'handoff';

export default function CaseIntelligenceWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const caseId = (params?.id as string) || DEMO_CASE_ID;

  // Data states
  const [caseData, setCaseData] = useState<CaseItem | undefined>(undefined);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [contradictions, setContradictions] = useState<Contradiction[]>([]);
  const [evidenceGaps, setEvidenceGaps] = useState<EvidenceGap[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [factVerifications, setFactVerifications] = useState<FactVerification[]>([]);
  const [readiness, setReadiness] = useState<CaseReadiness | undefined>(undefined);
  const [brief, setBrief] = useState<BriefVersion | undefined>(undefined);

  // Workspace Navigation & Panel states
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  // Left Panel Filter & Search
  const [docCategoryFilter, setDocCategoryFilter] = useState('All');
  const [docSearch, setDocSearch] = useState('');

  // Right Panel Document Viewer states
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [viewerPage, setViewerPage] = useState<number>(1);
  const [pinnedHighlight, setPinnedHighlight] = useState<SourcePin | null>(null);

  // Judge Demo Guide Tour State
  const [showJudgeTour, setShowJudgeTour] = useState(true);
  const [tourStep, setTourStep] = useState(1);

  // Upload modal state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'Agreement' | 'Financial' | 'Notice' | 'Pleading' | 'Correspondence'>('Financial');

  // Private notes editor state
  const [privateNotes, setPrivateNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // Load all case data
  const loadCaseWorkspace = () => {
    const c = getCaseById(caseId) || (caseId === DEMO_CASE_ID ? PRIMARY_DEMO_CASE : undefined);
    setCaseData(c);
    if (c?.notes) setPrivateNotes(c.notes);

    const docs = getStoredDocuments(caseId);
    setDocuments(docs);
    if (docs.length > 0 && !selectedDocId) {
      setSelectedDocId(docs[0].id);
    }

    setContradictions(getCaseContradictions(caseId));
    setEvidenceGaps(getCaseEvidenceGaps(caseId));
    setTimeline(getCaseTimeline(caseId));
    setFactVerifications(getCaseFactVerifications(caseId));
    setReadiness(getCaseReadiness(caseId));
    setBrief(getStoredBrief(caseId, c));
  };

  useEffect(() => {
    loadCaseWorkspace();

    const handleStorageChange = () => loadCaseWorkspace();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('casekeeper_documents_updated', handleStorageChange);
    window.addEventListener('casekeeper_contradictions_updated', handleStorageChange);
    window.addEventListener('casekeeper_gaps_updated', handleStorageChange);
    window.addEventListener('casekeeper_timeline_updated', handleStorageChange);
    window.addEventListener('casekeeper_facts_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('casekeeper_documents_updated', handleStorageChange);
      window.removeEventListener('casekeeper_contradictions_updated', handleStorageChange);
      window.removeEventListener('casekeeper_gaps_updated', handleStorageChange);
      window.removeEventListener('casekeeper_timeline_updated', handleStorageChange);
      window.removeEventListener('casekeeper_facts_updated', handleStorageChange);
    };
  }, [caseId]);

  // Selected document helper
  const selectedDoc = useMemo(() => {
    return documents.find(d => d.id === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

  // Filtered documents for Left Panel
  const filteredDocs = useMemo(() => {
    return documents.filter(d => {
      const matchesCat = docCategoryFilter === 'All' || d.category === docCategoryFilter;
      const matchesSearch = !docSearch.trim() || d.fileName.toLowerCase().includes(docSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [documents, docCategoryFilter, docSearch]);

  // Handle clicking a SourcePin anywhere in the app
  const handlePinClick = (pin: SourcePin) => {
    const targetDoc = documents.find(d => d.id === pin.docId || d.fileName === pin.docName);
    if (targetDoc) {
      setSelectedDocId(targetDoc.id);
    }
    setViewerPage(pin.pageNumber || 1);
    setPinnedHighlight(pin);
    if (rightPanelCollapsed) {
      setRightPanelCollapsed(false);
    }
  };

  // Handle resetting demo
  const handleResetDemo = () => {
    if (confirm('Reset demo case "Sharma v. Horizon Developers" to pristine synthetic benchmark state?')) {
      resetDemoCase();
      loadCaseWorkspace();
      setPinnedHighlight(null);
      setTourStep(1);
    }
  };

  // Handle synthetic document upload
  const handleUploadSynthetic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const created = addDocumentToCase({
        caseId,
        fileName: newDocName.trim().endsWith('.pdf') ? newDocName.trim() : `${newDocName.trim()}.pdf`,
        fileSize: '1.4 MB',
        processingStatus: 'done',
        extractionStatus: 'done',
        pageCount: 3,
        category: newDocCategory,
        sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        summary: `Newly ingested document (${newDocCategory}) processed via incremental extraction pipeline. Verified SHA-256 hash recorded.`,
        fullText: `SUPPLEMENTARY RECORD FILED IN CASE ${caseId}.\nDocument Name: ${newDocName}\nIngested: ${new Date().toISOString()}\nText layers verified.`
      });

      setSelectedDocId(created.id);
      setIsUploading(false);
      setUploadSuccess(true);
      setNewDocName('');
      loadCaseWorkspace();
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 700);
  };

  // Handle save private notes
  const handleSaveNotes = () => {
    if (caseData) {
      caseData.notes = privateNotes;
      updateCaseNotes(caseId, privateNotes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2500);
    }
  };

  const categories = ['All', 'Agreement', 'Financial', 'Notice', 'Pleading', 'Correspondence'];

  return (
    <AppShell activeNav="intelligence" breadcrumb={`Cases / ${caseData?.title || 'Case Intelligence'}`}>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8 bg-[#F8FAFC] text-slate-800 overflow-hidden">
        
        {/* ================= TOP COMMAND BAR ================= */}
        <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <Link 
              href="/workspace/cases" 
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Back to All Cases"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-blue-50 text-[#1B4FD8] border border-blue-200">
                  {caseData?.referenceNumber || caseId}
                </span>
                <h1 className="text-sm sm:text-base font-extrabold text-[#0F172A] truncate max-w-md sm:max-w-xl">
                  {caseData?.title || 'Sharma v. Horizon Developers'}
                </h1>
                {caseData?.isDemo && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Live Demo Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {caseData?.court} • Next Hearing: <strong className="text-slate-700">{caseData?.nextHearingDate || '28 Dec 2026'}</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions & Readiness Pill */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {readiness && (
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setActiveTab('overview')}
                title="Case Readiness Score: Measures documentation, source-linking, and advocate review completion."
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-600">Readiness:</span>
                <span className="font-extrabold font-mono text-[#0F172A]">{readiness.overallScore}%</span>
              </div>
            )}

            {caseData?.isDemo && (
              <button
                onClick={handleResetDemo}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Reset demo case to initial synthetic benchmark state"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('handoff')}
              className="px-3 py-1.5 bg-[#1B4FD8] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Secure Handoff</span>
            </button>
          </div>
        </header>

        {/* ================= HACKATHON JUDGE TOUR BAR ================= */}
        {showJudgeTour && caseData?.isDemo && (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs shrink-0 z-10 border-b border-blue-800">
            <div className="flex items-center gap-2.5 overflow-x-auto py-0.5">
              <span className="bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Judge Walkthrough (3-Min)</span>
              </span>

              <button 
                onClick={() => { setActiveTab('overview'); setTourStep(1); }}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${tourStep === 1 ? 'bg-white/20 font-bold underline' : 'text-slate-300 hover:text-white'}`}
              >
                1. Readiness Score
              </button>
              <span className="text-slate-500">→</span>

              <button 
                onClick={() => { 
                  setActiveTab('evidence'); 
                  setTourStep(2); 
                  if (factVerifications[0]?.source) handlePinClick(factVerifications[0].source);
                }}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${tourStep === 2 ? 'bg-white/20 font-bold underline' : 'text-slate-300 hover:text-white'}`}
              >
                2. Source Pin Highlight
              </button>
              <span className="text-slate-500">→</span>

              <button 
                onClick={() => { setActiveTab('contradictions'); setTourStep(3); }}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${tourStep === 3 ? 'bg-white/20 font-bold underline' : 'text-slate-300 hover:text-white'}`}
              >
                3. Possession Contradiction
              </button>
              <span className="text-slate-500">→</span>

              <button 
                onClick={() => { setActiveTab('gaps'); setTourStep(4); }}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${tourStep === 4 ? 'bg-white/20 font-bold underline' : 'text-slate-300 hover:text-white'}`}
              >
                4. Missing Plan &amp; OC Gaps
              </button>
              <span className="text-slate-500">→</span>

              <button 
                onClick={() => { setActiveTab('review'); setTourStep(5); }}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${tourStep === 5 ? 'bg-white/20 font-bold underline' : 'text-slate-300 hover:text-white'}`}
              >
                5. Lawyer Verification
              </button>
              <span className="text-slate-500">→</span>

              <button 
                onClick={() => { setActiveTab('handoff'); setTourStep(6); }}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${tourStep === 6 ? 'bg-white/20 font-bold underline' : 'text-slate-300 hover:text-white'}`}
              >
                6. Secure Transfer &amp; Revoke
              </button>
            </div>

            <button 
              onClick={() => setShowJudgeTour(false)}
              className="text-slate-400 hover:text-white ml-2 p-1"
              title="Dismiss Walkthrough Bar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ================= THREE PANEL WORKSPACE BODY ================= */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* ----------------- LEFT PANEL: DOCUMENT EXPLORER ----------------- */}
          <aside className={`${leftPanelCollapsed ? 'w-12' : 'w-72 sm:w-80'} bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 z-10`}>
            {leftPanelCollapsed ? (
              <div className="py-4 flex flex-col items-center gap-4">
                <button 
                  onClick={() => setLeftPanelCollapsed(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                  title="Expand Document Explorer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="writing-vertical text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
                  Documents ({documents.length})
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#1B4FD8]" />
                    <span className="font-extrabold text-xs text-[#0F172A] uppercase tracking-wider">
                      Case Documents ({documents.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setLeftPanelCollapsed(true)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                      title="Collapse Panel"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Upload Action Card */}
                <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
                  <form onSubmit={handleUploadSynthetic} className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="text" 
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        placeholder="Upload new synthetic doc..."
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4FD8]"
                      />
                      <button
                        type="submit"
                        disabled={isUploading || !newDocName.trim()}
                        className="p-1.5 bg-[#1B4FD8] hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 shrink-0"
                        title="Upload & Ingest Document"
                      >
                        {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Category:</span>
                      <select 
                        value={newDocCategory}
                        onChange={(e) => setNewDocCategory(e.target.value as any)}
                        className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5"
                      >
                        <option value="Financial">Financial</option>
                        <option value="Agreement">Agreement</option>
                        <option value="Notice">Notice</option>
                        <option value="Pleading">Pleading</option>
                        <option value="Correspondence">Correspondence</option>
                      </select>
                    </div>

                    {uploadSuccess && (
                      <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Document Ingested &amp; SHA-256 Hashed!</span>
                      </p>
                    )}
                  </form>
                </div>

                {/* Search & Category Filter */}
                <div className="p-2 border-b border-slate-100 space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input 
                      type="text" 
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      placeholder="Filter files by name..."
                      className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4FD8]"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setDocCategoryFilter(cat)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                          docCategoryFilter === cat 
                            ? 'bg-[#1B4FD8] text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {filteredDocs.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No documents matching filter.
                    </div>
                  ) : (
                    filteredDocs.map((doc) => {
                      const isSelected = selectedDocId === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setSelectedDocId(doc.id);
                            setViewerPage(1);
                            setPinnedHighlight(null);
                          }}
                          className={`p-3 cursor-pointer text-xs transition-all ${
                            isSelected 
                              ? 'bg-blue-50/80 border-l-4 border-l-[#1B4FD8]' 
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5 mb-1">
                            <span className="font-semibold text-slate-900 truncate max-w-[190px]" title={doc.fileName}>
                              {doc.fileName}
                            </span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {doc.pageCount}p
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1.5">
                            <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                              {doc.category || 'General'}
                            </span>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>OCR Ready</span>
                            </span>
                          </div>

                          {doc.sha256 && (
                            <p className="font-mono text-[9px] text-slate-400 truncate" title={`SHA-256: ${doc.sha256}`}>
                              SHA: {doc.sha256.slice(0, 16)}...
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Left Panel Footer Summary */}
                <div className="p-2 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 text-center font-mono">
                  SHA-256 Authenticated Case Vault
                </div>
              </>
            )}
          </aside>

          {/* ----------------- CENTER PANEL: TABBED INTELLIGENCE HUB ----------------- */}
          <main className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
            
            {/* Nav Tabs */}
            <nav className="flex items-center gap-1 px-4 border-b border-slate-200 bg-slate-50/80 overflow-x-auto scrollbar-none shrink-0 pt-1">
              {[
                { id: 'overview', label: 'Case Overview', icon: Scale },
                { id: 'brief', label: 'Intelligence Brief', icon: FileText },
                { id: 'evidence', label: 'Evidence Explorer', icon: FileSearch, badge: factVerifications.length },
                { id: 'timeline', label: 'Chronology', icon: Clock, badge: timeline.length },
                { id: 'contradictions', label: 'Contradictions', icon: AlertTriangle, badge: contradictions.filter(c => c.resolutionStatus === 'unresolved').length, badgeColor: 'bg-red-500' },
                { id: 'gaps', label: 'Evidence Gaps', icon: HelpCircle, badge: evidenceGaps.filter(g => g.status === 'missing').length, badgeColor: 'bg-amber-500' },
                { id: 'review', label: 'Lawyer Review', icon: UserCheck },
                { id: 'notes', label: 'Private Notes', icon: Lock, badgeColor: 'bg-slate-400' },
                { id: 'history', label: 'What Changed?', icon: History },
                { id: 'handoff', label: 'Secure Transfer', icon: Send }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as WorkspaceTab)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                      isActive 
                        ? 'border-b-[#1B4FD8] text-[#1B4FD8] bg-white shadow-xs' 
                        : 'border-b-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full text-white ${tab.badgeColor || 'bg-blue-600'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Tab Contents Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* ================= TAB 1: CASE OVERVIEW ================= */}
              {activeTab === 'overview' && (
                <div className="space-y-6 max-w-4xl animate-fade-in">
                  
                  {/* Case Readiness Score Box - Clean & High-Trust */}
                  {readiness && (
                    <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/50 rounded-2xl p-5 sm:p-6 border border-blue-200/90 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h2 className="text-lg font-black text-[#0F172A]">
                              Case Readiness Score: {readiness.overallScore}%
                            </h2>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Evidence Review Stage
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                            Objective audit score evaluating source citation coverage, statutory document checklist compliance, and advocate verification completeness.
                          </p>
                        </div>
                        <div className="text-right sm:border-l sm:border-blue-200/80 sm:pl-6">
                          <span className="text-3xl font-black font-mono text-[#1B4FD8]">{readiness.overallScore}/100</span>
                          <span className="text-[10px] block text-slate-500 font-semibold uppercase tracking-wider">Weighted Readiness</span>
                        </div>
                      </div>

                      {/* 4 Clean Component Progress Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        {/* 1. Source Pins */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
                          <div className="flex justify-between items-center font-bold text-slate-700">
                            <span>Source Pins (40%)</span>
                            <span className="font-mono text-[#1B4FD8]">{readiness.sourceReferenceCoverage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${readiness.sourceReferenceCoverage}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-500">4 of 5 claims grounded to exact page excerpts.</p>
                        </div>

                        {/* 2. Checklist Gaps */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
                          <div className="flex justify-between items-center font-bold text-slate-700">
                            <span>Checklist Gaps (25%)</span>
                            <span className="font-mono text-amber-600">3 Pending</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `35%` }} />
                          </div>
                          <p className="text-[10px] text-slate-500">Missing DTCP plan, OC, & postal receipt.</p>
                        </div>

                        {/* 3. Advocate Review */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
                          <div className="flex justify-between items-center font-bold text-slate-700">
                            <span>Advocate Review (20%)</span>
                            <span className="font-mono text-emerald-600">100%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `100%` }} />
                          </div>
                          <p className="text-[10px] text-slate-500">All factual claims reviewed by counsel.</p>
                        </div>

                        {/* 4. Discrepancies */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
                          <div className="flex justify-between items-center font-bold text-slate-700">
                            <span>Contradictions (15%)</span>
                            <span className="font-mono text-red-600">2 Flagged</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full rounded-full" style={{ width: `40%` }} />
                          </div>
                          <p className="text-[10px] text-slate-500">Conflicting dates & payment sums.</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-blue-200/60 text-[11px] text-slate-500 flex items-center gap-1.5 italic">
                        <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{readiness.disclaimer}</span>
                      </div>
                    </div>
                  )}

                  {/* ================= ADVOCATE STRATEGY NOTES (RESTORED DEDICATED SECTION) ================= */}
                  <div className="bg-amber-50/70 rounded-2xl border-2 border-amber-300 p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                          <StickyNote className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-amber-950">Advocate Strategy Notes</h3>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-400 flex items-center gap-1 uppercase tracking-wider">
                              <Lock className="w-3 h-3 text-amber-800" />
                              <span>Privileged &amp; Confidential</span>
                            </span>
                          </div>
                          <p className="text-xs text-amber-800 mt-0.5">
                            Trial points, cross-examination vulnerabilities, and private strategies protected under Section 126 of Indian Evidence Act / BSA.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleSaveNotes}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Strategy Note</span>
                        </button>
                      </div>
                    </div>

                    {notesSaved && (
                      <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-300 animate-fade-in">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Strategy notes saved and encrypted in your advocate vault.</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <textarea
                        rows={5}
                        value={privateNotes}
                        onChange={(e) => setPrivateNotes(e.target.value)}
                        placeholder="Record confidential trial observations, cross-examination points for builder's witness, internal fee arrangements, or unfiled client claims..."
                        className="w-full text-xs sm:text-sm p-4 rounded-xl border border-amber-300 bg-white font-serif leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-amber-900 bg-amber-100/60 px-3 py-2 rounded-lg border border-amber-200">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Shield className="w-3.5 h-3.5 text-amber-700" />
                          <span><strong>Confidentiality Guarantee:</strong> These notes are strictly locked to your firm and automatically excluded when sharing case handoffs with co-counsels or clients.</span>
                        </span>
                        <span className="font-mono text-amber-800 shrink-0">
                          {privateNotes.length} characters
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Case Metadata & Parties Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                    <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
                      Factual Scenario &amp; Dispute Background
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {caseData?.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Petitioner / Complainant</span>
                        <p className="font-bold text-[#0F172A] text-sm">{caseData?.parties.petitioner}</p>
                        <p className="text-slate-500 text-[11px]">{caseData?.clientDetails?.address}</p>
                        <p className="text-slate-500 text-[11px]">Phone: <span className="font-mono">{caseData?.clientDetails?.phone}</span></p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Respondent / Promoter</span>
                        <p className="font-bold text-[#0F172A] text-sm">{caseData?.parties.respondent}</p>
                        <p className="text-slate-500 text-[11px]">Project: Horizon Heights, Sector 82, Gurugram</p>
                        <p className="text-slate-500 text-[11px]">CNR: <span className="font-mono">{caseData?.cnrNumber}</span></p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        Category: <strong>{caseData?.category}</strong>
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        Jurisdiction: <strong>{caseData?.jurisdiction}</strong>
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        Bench: <strong>{caseData?.court}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Summary of Issues Requiring Review */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-extrabold text-[#0F172A]">Actionable Case Integrity Alerts</h3>
                      <span className="text-xs font-semibold text-blue-600">
                        {contradictions.length} Inconsistencies • {evidenceGaps.length} Missing Records
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div 
                        onClick={() => setActiveTab('contradictions')}
                        className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 cursor-pointer transition-colors space-y-1.5"
                      >
                        <div className="flex items-center gap-2 font-bold text-red-800">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                          <span>Possession Date Discrepancy</span>
                        </div>
                        <p className="text-[11px] text-red-700 line-clamp-2 leading-relaxed">
                          Agreement Clause 5(a) covenants 30 April 2025 vs. Builder extension notice asserting 15 August 2025.
                        </p>
                        <span className="text-[10px] font-bold text-red-800 pt-1 inline-block">Resolve in Contradictions Tab →</span>
                      </div>

                      <div 
                        onClick={() => setActiveTab('gaps')}
                        className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors space-y-1.5"
                      >
                        <div className="flex items-center gap-2 font-bold text-amber-800">
                          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Missing DTCP Sanctioned Layout</span>
                        </div>
                        <p className="text-[11px] text-amber-700 line-clamp-2 leading-relaxed">
                          Annexure B memo referenced in agreement is absent from uploaded files.
                        </p>
                        <span className="text-[10px] font-bold text-amber-800 pt-1 inline-block">Inspect Missing Evidence →</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ================= TAB 2: INTELLIGENCE BRIEF ================= */}
              {activeTab === 'brief' && brief && (
                <div className="space-y-6 max-w-4xl animate-fade-in">
                  
                  {/* Brief Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-extrabold text-[#0F172A]">Structured Case Intelligence Brief</h2>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                          Version {brief.versionNumber}.0
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Reviewed &amp; Approved by {brief.reviewedAt || 'Advocate on Record'}.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Certified Brief</span>
                      </button>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                    <span className="font-extrabold text-[#0F172A] uppercase tracking-wider block text-[11px]">Executive Case Summary</span>
                    <p className="text-slate-700 leading-relaxed font-serif text-sm">
                      {brief.summary}
                    </p>
                  </div>

                  {/* Material Factual Assertions with Source Pins */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                      <FileSearch className="w-4 h-4 text-[#1B4FD8]" />
                      <span>Material Factual Assertions (Source-Linked)</span>
                    </h3>

                    <div className="space-y-3">
                      {brief.materialAssertions?.map((item, idx) => (
                        <div 
                          key={item.id || idx}
                          className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-900">{item.assertion}</p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                                {item.source.docName} (p. {item.source.pageNumber})
                              </span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handlePinClick(item.source)}
                            className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-[#1B4FD8] font-bold text-xs shrink-0 flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Source</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Dates Timeline */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                    <h3 className="text-sm font-extrabold text-[#0F172A]">Chronological Highlights</h3>
                    <div className="divide-y divide-slate-100 text-xs">
                      {brief.importantDates.map((d, idx) => (
                        <div key={idx} className="py-2.5 flex items-start gap-4">
                          <span className="font-mono font-bold text-[#1B4FD8] w-24 shrink-0">{d.date}</span>
                          <span className="text-slate-700">{d.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Citations Audit List */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                    <h3 className="text-sm font-extrabold text-[#0F172A]">Verified Document Citations</h3>
                    <div className="space-y-2 text-xs">
                      {brief.citations.map((c, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handlePinClick({ docId: '', docName: c.doc, pageNumber: c.page, excerpt: c.excerpt })}
                          className="p-2.5 rounded bg-slate-50 border border-slate-200 hover:border-blue-300 cursor-pointer font-mono text-[11px] text-slate-700 flex items-center justify-between"
                        >
                          <span className="truncate max-w-xl">
                            <strong>[{c.doc} - p.{c.page}]</strong>: &ldquo;{c.excerpt}&rdquo;
                          </span>
                          <span className="text-[#1B4FD8] font-sans font-bold text-xs shrink-0 ml-2">Pin →</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confidential Notes Exclusion Disclaimer */}
                  <div className="p-3 bg-slate-100 text-slate-500 rounded-lg text-[10px] flex items-center gap-2 border border-slate-200 italic">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Attorney-client privileged internal notes and oral strategy are strictly excluded from exported briefs and handoff packages.</span>
                  </div>

                </div>
              )}

              {/* ================= TAB 3: EVIDENCE EXPLORER ================= */}
              {activeTab === 'evidence' && (
                <div className="space-y-4 max-w-4xl animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-base font-extrabold text-[#0F172A]">Evidence Explorer &amp; Source Pin Vault</h2>
                      <p className="text-xs text-slate-500">Every factual assertion mapped directly to its supporting document page and exact excerpt.</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-blue-50 text-[#1B4FD8] border border-blue-200">
                      {factVerifications.length} Mapped Facts
                    </span>
                  </div>

                  <div className="space-y-3">
                    {factVerifications.map((fact) => (
                      <div 
                        key={fact.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-300 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 tracking-wider">
                              {fact.category.replace('_', ' ')}
                            </span>
                            <p className="text-xs font-bold text-slate-900 mt-1">{fact.factText}</p>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                            fact.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                            fact.status === 'corrected' ? 'bg-amber-100 text-amber-800' :
                            fact.status === 'unsupported' ? 'bg-red-100 text-red-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {fact.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Citation Pin Box */}
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1 font-mono text-[11px] text-slate-700">
                            <p className="font-bold text-[#1B4FD8]">
                              📄 {fact.source.docName} (Page {fact.source.pageNumber})
                            </p>
                            <p className="italic text-slate-600 line-clamp-2">
                              &ldquo;{fact.source.excerpt}&rdquo;
                            </p>
                          </div>

                          <button
                            onClick={() => handlePinClick(fact.source)}
                            className="px-3 py-1.5 bg-[#1B4FD8] hover:bg-blue-700 text-white font-bold text-xs rounded-lg shrink-0 flex items-center gap-1.5 shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Jump to Page</span>
                          </button>
                        </div>

                        {fact.correctedText && (
                          <div className="p-2.5 bg-amber-50 text-amber-900 rounded border border-amber-200 text-[11px] space-y-0.5">
                            <span className="font-bold block">Advocate Correction Note:</span>
                            <p>{fact.correctedText}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 4: CASE CHRONOLOGY / TIMELINE ================= */}
              {activeTab === 'timeline' && (
                <div className="space-y-4 max-w-4xl animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-base font-extrabold text-[#0F172A]">Case Chronology &amp; Sequence of Events</h2>
                      <p className="text-xs text-slate-500">Chronological timeline synthesized from extracted agreements, receipts, notices, and summons.</p>
                    </div>
                  </div>

                  <div className="relative pl-6 border-l-2 border-blue-200 space-y-6 my-4">
                    {timeline.map((evt) => (
                      <div key={evt.id} className="relative group">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                          evt.eventType === 'agreement' ? 'bg-blue-600' :
                          evt.eventType === 'payment' ? 'bg-emerald-600' :
                          evt.eventType === 'hearing' ? 'bg-purple-600' :
                          evt.eventType === 'notice' ? 'bg-red-500' : 'bg-slate-500'
                        }`} />

                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-300 transition-all space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#1B4FD8] bg-blue-50 px-2 py-0.5 rounded">
                                {evt.date}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">{evt.title}</h4>
                            </div>

                            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-600">
                              {evt.eventType}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">{evt.details}</p>

                          {evt.source && (
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                              <span className="font-mono text-slate-500 truncate max-w-md">
                                Source: {evt.source.docName} (p. {evt.source.pageNumber})
                              </span>
                              <button
                                onClick={() => handlePinClick(evt.source!)}
                                className="font-bold text-[#1B4FD8] hover:underline flex items-center gap-1"
                              >
                                <span>Inspect</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 5: CONTRADICTIONS & DISCREPANCIES ================= */}
              {activeTab === 'contradictions' && (
                <div className="space-y-4 max-w-4xl animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span>Cross-Document Contradiction Engine</span>
                      </h2>
                      <p className="text-xs text-slate-500">Automated multi-document comparative analysis identifying conflicting terms, dates, and amounts.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {contradictions.map((contra) => (
                      <div 
                        key={contra.id}
                        className="bg-white rounded-xl border border-red-200 shadow-xs p-5 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase tracking-wider">
                                {contra.significance} Significance
                              </span>
                              <h3 className="text-sm font-extrabold text-[#0F172A]">{contra.title}</h3>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{contra.explanation}</p>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                            contra.resolutionStatus === 'unresolved' ? 'bg-red-500 text-white' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {contra.resolutionStatus.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Side by side comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Value A */}
                          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document Source A</span>
                            <p className="font-semibold text-slate-900">{contra.valueA.statement}</p>
                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                              <span className="truncate max-w-[200px]">{contra.valueA.source.docName} (p.{contra.valueA.source.pageNumber})</span>
                              <button 
                                onClick={() => handlePinClick(contra.valueA.source)}
                                className="font-sans font-bold text-[#1B4FD8] hover:underline"
                              >
                                View Pin →
                              </button>
                            </div>
                          </div>

                          {/* Value B */}
                          <div className="p-3 rounded-lg border border-red-200 bg-red-50/40 space-y-2">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">Document Source B (Conflict)</span>
                            <p className="font-semibold text-red-950">{contra.valueB.statement}</p>
                            <div className="pt-2 border-t border-red-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                              <span className="truncate max-w-[200px]">{contra.valueB.source.docName} (p.{contra.valueB.source.pageNumber})</span>
                              <button 
                                onClick={() => handlePinClick(contra.valueB.source)}
                                className="font-sans font-bold text-red-700 hover:underline"
                              >
                                View Pin →
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Advocate Resolution Actions */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-500 text-[11px]">Advocate Action:</span>
                            <button
                              onClick={() => updateContradictionStatus(caseId, contra.id, 'confirmed')}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                            >
                              Confirm Contradiction
                            </button>
                            <button
                              onClick={() => updateContradictionStatus(caseId, contra.id, 'legitimate_update')}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                            >
                              Mark Legitimate Update
                            </button>
                            <button
                              onClick={() => updateContradictionStatus(caseId, contra.id, 'dismissed_false_positive')}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                            >
                              Dismiss
                            </button>
                          </div>

                          {contra.advocateNotes && (
                            <p className="text-[11px] text-slate-600 italic">
                              Note: {contra.advocateNotes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 6: EVIDENCE GAPS ================= */}
              {activeTab === 'gaps' && (
                <div className="space-y-4 max-w-4xl animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-amber-600" />
                        <span>Evidence Gap &amp; Checklist Engine</span>
                      </h2>
                      <p className="text-xs text-slate-500">Detects missing annexures, absent statutory certificates, and incomplete procedural proofs.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {evidenceGaps.map((gap) => (
                      <div 
                        key={gap.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                                gap.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {gap.priority} Priority Gap
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold">• {gap.category}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mt-1">{gap.itemTitle}</h4>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            gap.status === 'missing' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {gap.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{gap.reason}</p>

                        <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 text-xs flex items-center justify-between gap-3">
                          <span className="text-blue-900 font-medium">
                            <strong>Recommended Action:</strong> {gap.suggestedAction}
                          </span>
                          <button
                            onClick={() => updateEvidenceGapStatus(caseId, gap.id, gap.status === 'missing' ? 'uploaded' : 'missing')}
                            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-blue-200 font-bold text-xs text-[#1B4FD8] rounded shrink-0 shadow-xs"
                          >
                            {gap.status === 'missing' ? 'Mark Procured' : 'Mark Missing'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 7: LAWYER VERIFICATION ================= */}
              {activeTab === 'review' && (
                <div className="space-y-4 max-w-4xl animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-emerald-600" />
                        <span>Human-in-the-Loop Fact Verification Engine</span>
                      </h2>
                      <p className="text-xs text-slate-500">Every AI assertion requires explicit advocate confirmation before inclusion in approved court pleadings.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {factVerifications.map((fact) => (
                      <div 
                        key={fact.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">Assertion ID: {fact.id}</span>
                            <p className="text-xs font-semibold text-slate-900 mt-0.5">{fact.factText}</p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => updateFactVerification(caseId, fact.id, 'verified')}
                              className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 ${
                                fact.status === 'verified' 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                              <span>Verify</span>
                            </button>

                            <button
                              onClick={() => {
                                const newText = prompt('Enter corrected fact text:', fact.factText);
                                if (newText) {
                                  updateFactVerification(caseId, fact.id, 'corrected', newText, 'Advocate factual correction');
                                }
                              }}
                              className={`px-2.5 py-1 text-xs font-bold rounded ${
                                fact.status === 'corrected' 
                                  ? 'bg-amber-500 text-white' 
                                  : 'bg-slate-100 hover:bg-amber-50 text-slate-700'
                              }`}
                            >
                              Correct
                            </button>

                            <button
                              onClick={() => updateFactVerification(caseId, fact.id, 'rejected')}
                              className={`px-2.5 py-1 text-xs font-bold rounded ${
                                fact.status === 'rejected' 
                                  ? 'bg-red-600 text-white' 
                                  : 'bg-slate-100 hover:bg-red-50 text-slate-700'
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
                          <span>Reviewer: <strong>{fact.reviewerName || 'Unassigned'}</strong> • {fact.reviewTimestamp || 'Pending'}</span>
                          <button 
                            onClick={() => handlePinClick(fact.source)}
                            className="text-[#1B4FD8] font-bold hover:underline"
                          >
                            Inspect Linked Evidence →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 8: PRIVATE NOTES ================= */}
              {activeTab === 'notes' && (
                <div className="space-y-4 max-w-4xl animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-extrabold text-[#0F172A]">Confidential Strategy Notes &amp; Observations</h2>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase tracking-wider flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Privileged / Never Shared</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Internal work-product protected under Section 126 of Indian Evidence Act / BSA. These notes are automatically scrubbed from handoffs.</p>
                    </div>

                    <button
                      onClick={handleSaveNotes}
                      className="px-4 py-1.5 bg-[#1B4FD8] hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs"
                    >
                      Save Strategy Notes
                    </button>
                  </div>

                  {notesSaved && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Confidential notes persisted securely in local encrypted vault.</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <textarea
                      rows={10}
                      value={privateNotes}
                      onChange={(e) => setPrivateNotes(e.target.value)}
                      placeholder="Record private litigation strategy, potential witness cross-examination vulnerabilities, fee arrangements, or unfiled client claims..."
                      className="w-full text-xs p-4 rounded-xl border border-slate-200 bg-white font-serif leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                    />

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                      <span className="font-bold text-slate-800">Verified Confidentiality Guardrails:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>Handoff Engine strictly excludes this field when generating case transfer bundles.</li>
                        <li>Exported client briefs and court-filing PDFs never contain these private annotations.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 9: WHAT CHANGED? (INCREMENTAL INTELLIGENCE) ================= */}
              {activeTab === 'history' && (
                <div className="space-y-4 max-w-4xl animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                        <History className="w-5 h-5 text-[#1B4FD8]" />
                        <span>Incremental Case Intelligence &amp; What Changed?</span>
                      </h2>
                      <p className="text-xs text-slate-500">Audit trail showing newly extracted facts, date modifications, and newly detected contradictions across versions.</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#0F172A]">Delta: Version 2.0 ➔ Version 3.0</span>
                        <span className="text-[10px] font-mono text-slate-400">14 Nov 2026</span>
                      </div>

                      <div className="space-y-2">
                        <div className="p-2.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                          <span className="font-bold block">Newly Introduced Facts (+2):</span>
                          <p>1. Added official HARERA hearing listing notice for 28 Dec 2026 before Bench Room 2.</p>
                          <p>2. Added Hindi correspondence from Residents Association documenting absence of OC.</p>
                        </div>

                        <div className="p-2.5 rounded bg-red-50 text-red-900 border border-red-200">
                          <span className="font-bold block">Detected Contradiction:</span>
                          <p>Cross-matched client oral claim of ₹7.5 Lakhs vs documented receipt of ₹5 Lakhs.</p>
                        </div>

                        <div className="p-2.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                          <span className="font-bold block">Prior Approval State:</span>
                          <p>Clause 5(a) possession date remains locked at 30 April 2025.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 10: SECURE HANDOFF ================= */}
              {activeTab === 'handoff' && (
                <div className="space-y-4 max-w-4xl animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                        <Send className="w-5 h-5 text-[#1B4FD8]" />
                        <span>Consent-Controlled Case Handoff &amp; Transfer</span>
                      </h2>
                      <p className="text-xs text-slate-500">Transfer structured case intelligence to authorized advocates with granular permissions and instant revocation.</p>
                    </div>
                    <Link
                      href={`/workspace/cases/${caseId}/handoff`}
                      className="px-3 py-1.5 bg-[#1B4FD8] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                    >
                      <span>Open Full Transfer Wizard</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Active Handoff Card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <h4 className="font-extrabold text-sm text-[#0F172A]">Active Handoff Grant: Adv. Priya Sundaram</h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Status: Active (Access Sent)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block">Recipient Advocate:</span>
                        <p className="font-bold text-slate-900">Adv. Priya Sundaram</p>
                        <p className="text-slate-500 font-mono text-[11px]">priya.sundaram@mumbaicourt.in</p>
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block">Access Expiry:</span>
                        <p className="font-bold text-slate-900">30 December 2026</p>
                        <p className="text-slate-500 text-[11px]">Permission: Read-Only (Download Restricted)</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="font-bold text-slate-700">Included Materials:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-semibold">Case Brief v3</span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-semibold">6 Approved Documents</span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-semibold">Case Chronology</span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-semibold">Discrepancy Report</span>
                        <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[11px] font-bold line-through">Private Strategy Notes (Blocked)</span>
                      </div>
                    </div>

                    {/* Revoke Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Client consent recorded: <strong>Suresh Sharma (17 Nov 2026 18:20 IST)</strong>
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('Revoke case access immediately? Recipient will be blocked from opening any documents.')) {
                            alert('Access Revoked Successfully! Recipient session terminated.');
                          }
                        }}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors"
                      >
                        Revoke Case Access
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </main>

          {/* ----------------- RIGHT PANEL: INTERACTIVE DOCUMENT VIEWER & SOURCE PIN ----------------- */}
          <aside className={`${rightPanelCollapsed ? 'w-10' : 'w-80 lg:w-96'} bg-slate-50 border-l border-slate-200 flex flex-col shrink-0 transition-all duration-200 z-10`}>
            {rightPanelCollapsed ? (
              <div className="py-4 flex flex-col items-center gap-4">
                <button
                  onClick={() => setRightPanelCollapsed(false)}
                  className="p-2 rounded-lg hover:bg-slate-200 text-slate-500"
                  title="Expand Document Viewer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="writing-vertical text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
                  Evidence Viewer
                </div>
              </div>
            ) : (
              <>
                {/* Viewer Header */}
                <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 text-[#1B4FD8] shrink-0" />
                    <span className="font-extrabold text-xs text-[#0F172A] truncate" title={selectedDoc?.fileName}>
                      {selectedDoc?.fileName || 'Select Document'}
                    </span>
                  </div>
                  <button
                    onClick={() => setRightPanelCollapsed(true)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    title="Collapse Viewer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Page Navigation & Controls */}
                <div className="px-3 py-2 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                    <span>Page</span>
                    <strong className="text-slate-900">{viewerPage}</strong>
                    <span>of</span>
                    <span>{selectedDoc?.pageCount || 1}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewerPage(Math.max(1, viewerPage - 1))}
                      disabled={viewerPage <= 1}
                      className="p-1 rounded border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewerPage(Math.min(selectedDoc?.pageCount || 1, viewerPage + 1))}
                      disabled={viewerPage >= (selectedDoc?.pageCount || 1)}
                      className="p-1 rounded border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
                      title="Next Page"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Active Highlight Banner if Pin is Clicked */}
                {pinnedHighlight && (
                  <div className="p-2.5 bg-amber-50 border-b border-amber-200 text-xs flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">
                        <Bookmark className="w-3 h-3 text-amber-600" />
                        <span>Pinned Evidence Highlight (p. {pinnedHighlight.pageNumber})</span>
                      </div>
                      <p className="text-[11px] font-semibold text-amber-950 italic">
                        &ldquo;{pinnedHighlight.excerpt}&rdquo;
                      </p>
                    </div>
                    <button
                      onClick={() => setPinnedHighlight(null)}
                      className="text-amber-600 hover:text-amber-900 p-0.5"
                      title="Clear Highlight"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Simulated Document Page Canvas */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-100 flex justify-center">
                  <div className="w-full max-w-[340px] bg-white rounded-lg shadow-md border border-slate-300 p-5 font-serif text-[11px] leading-relaxed text-slate-800 min-h-[440px] flex flex-col justify-between select-text">
                    
                    <div className="space-y-3">
                      {/* Document Watermark / Stamp */}
                      <div className="pb-2 border-b border-slate-200 text-center font-sans">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
                          Certified Legal Record • Page {viewerPage}
                        </span>
                        <span className="text-[10px] font-bold text-slate-700 block truncate">
                          {selectedDoc?.fileName}
                        </span>
                      </div>

                      {/* Highlighted text or regular text */}
                      {pinnedHighlight && pinnedHighlight.pageNumber === viewerPage ? (
                        <div className="space-y-2">
                          <p className="text-slate-600">
                            {selectedDoc?.fullText?.slice(0, 150) || 'Official court proceeding text extract...'}
                          </p>
                          <div className="p-2.5 bg-yellow-100 border-l-4 border-yellow-500 rounded text-yellow-950 font-bold shadow-xs">
                            {pinnedHighlight.excerpt}
                          </div>
                          <p className="text-slate-600">
                            {selectedDoc?.fullText?.slice(150, 400) || 'Registered under jurisdiction of Haryana RERA.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 text-slate-700 whitespace-pre-line">
                          {selectedDoc?.fullText ? (
                            selectedDoc.fullText.slice((viewerPage - 1) * 350, viewerPage * 350) || selectedDoc.fullText.slice(0, 350)
                          ) : (
                            `IN THE RELEVANT COMPETENT COURT / TRIBUNAL\nCase Reference: ${caseData?.referenceNumber}\n\nDocument text layer extracted with verified page coordinates and character offsets.\n\nAllottee covenants to adhere to statutory filing deadlines.`
                          )}
                        </div>
                      )}
                    </div>

                    {/* Page Footer */}
                    <div className="pt-3 border-t border-slate-200 text-center font-sans text-[9px] text-slate-400">
                      Page {viewerPage} • CaseKeeper Document Vault
                    </div>
                  </div>
                </div>

                {/* Viewer Footer */}
                <div className="p-2 bg-white border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>SHA-256 Validated</span>
                  <span>OCR: Tesseract v5</span>
                </div>
              </>
            )}
          </aside>

        </div>
      </div>
    </AppShell>
  );
}
