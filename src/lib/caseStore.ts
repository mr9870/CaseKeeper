'use client';

import { 
  CaseItem, 
  CaseDocument, 
  BriefVersion, 
  CaseTask, 
  Handoff, 
  Contradiction, 
  EvidenceGap, 
  TimelineEvent, 
  FactVerification, 
  CaseReadiness 
} from './types';
import { 
  PRIMARY_DEMO_CASE, 
  DEMO_CASE_ID, 
  DEMO_DOCUMENTS, 
  DEMO_CONTRADICTIONS, 
  DEMO_EVIDENCE_GAPS, 
  DEMO_TIMELINE, 
  DEMO_FACT_VERIFICATIONS, 
  DEMO_CASE_READINESS, 
  DEMO_BRIEF, 
  DEMO_TASKS, 
  DEMO_HANDOFF 
} from './demoCaseData';

const CASES_STORAGE_KEY = 'casekeeper_cases_data';
const DOCUMENTS_STORAGE_KEY = 'casekeeper_documents_data';
const BRIEFS_STORAGE_KEY = 'casekeeper_briefs_data';
const TASKS_STORAGE_KEY = 'casekeeper_tasks_data';
const HANDOFFS_STORAGE_KEY = 'casekeeper_handoffs_data';
const CONTRADICTIONS_STORAGE_KEY = 'casekeeper_contradictions_data';
const EVIDENCE_GAPS_STORAGE_KEY = 'casekeeper_evidence_gaps_data';
const TIMELINE_STORAGE_KEY = 'casekeeper_timeline_data';
const VERIFICATIONS_STORAGE_KEY = 'casekeeper_verifications_data';
const PURGE_FLAG_KEY = 'casekeeper_dummy_data_purged_v3';

// Known legacy dummy IDs to strip out
const DUMMY_CASE_IDS = new Set(['case-101', 'case-102', 'case-103', 'case-104', 'case-105', 'case-106']);
const DUMMY_DOC_IDS = new Set(['doc-1', 'doc-2', 'doc-3']);
const DUMMY_TASK_IDS = new Set(['task-1', 'task-2', 'task-3', 'task-4']);
const DUMMY_HANDOFF_IDS = new Set(['ho-1', 'ho-2']);

/**
 * Initializes the Hackathon Demo Case so judges never encounter an empty screen.
 */
function initializeDemoCaseIfNeeded(cases: CaseItem[]): CaseItem[] {
  const hasDemo = cases.some(c => c.id === DEMO_CASE_ID || c.id === 'CK-2026-001');
  if (!hasDemo) {
    const updated = [PRIMARY_DEMO_CASE, ...cases];
    return updated;
  }
  return cases;
}

/**
 * Automatically purges legacy dummy/mock data from client localStorage.
 */
export function purgeLegacyDummyData(): void {
  if (typeof window === 'undefined') return;
  try {
    // Clean cases
    const rawCases = localStorage.getItem(CASES_STORAGE_KEY);
    if (rawCases) {
      const parsed: CaseItem[] = JSON.parse(rawCases);
      const cleanCases = parsed.filter(c => !DUMMY_CASE_IDS.has(c.id));
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(initializeDemoCaseIfNeeded(cleanCases)));
    } else {
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify([PRIMARY_DEMO_CASE]));
    }

    localStorage.setItem(PURGE_FLAG_KEY, 'true');
  } catch (e) {
    console.error('Error purging legacy dummy data:', e);
  }
}

// --- CASES STORAGE ---
export function getStoredCases(): CaseItem[] {
  if (typeof window === 'undefined') return [PRIMARY_DEMO_CASE];
  try {
    const raw = localStorage.getItem(CASES_STORAGE_KEY);
    if (!raw) {
      const initial = [PRIMARY_DEMO_CASE];
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: CaseItem[] = JSON.parse(raw);
    const clean = parsed.filter(c => !DUMMY_CASE_IDS.has(c.id));
    const withDemo = initializeDemoCaseIfNeeded(clean);
    return withDemo;
  } catch {
    return [PRIMARY_DEMO_CASE];
  }
}

export function saveStoredCases(cases: CaseItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = cases.filter(c => !DUMMY_CASE_IDS.has(c.id));
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(clean));
    window.dispatchEvent(new Event('casekeeper_cases_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save cases to localStorage', e);
  }
}

export function getCaseById(id: string): CaseItem | undefined {
  const cases = getStoredCases();
  return cases.find(c => c.id === id);
}

export function registerNewCase(newCase: Omit<CaseItem, 'id' | 'lastUpdated'>): CaseItem {
  const cases = getStoredCases();
  const created: CaseItem = {
    ...newCase,
    id: `case-${Date.now()}`,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  const updated = [created, ...cases];
  saveStoredCases(updated);

  // Automatically create initial hearing task if nextHearingDate is provided
  if (created.nextHearingDate) {
    addTask({
      caseId: created.id,
      title: `Attend bench hearing for ${created.title}`,
      dueDate: created.nextHearingDate,
      status: 'pending',
      isSuggestion: false,
      priority: 'high'
    });
  }

  return created;
}

export function updateCaseNotes(caseId: string, notes: string): void {
  const cases = getStoredCases();
  const updated = cases.map(c => 
    c.id === caseId 
      ? { ...c, notes, lastUpdated: new Date().toISOString().split('T')[0] } 
      : c
  );
  saveStoredCases(updated);
}

export function deleteCase(caseId: string): void {
  const cases = getStoredCases();
  const updated = cases.filter(c => c.id !== caseId);
  saveStoredCases(updated);

  // Also clean related documents & tasks
  if (typeof window !== 'undefined') {
    try {
      const docs = getStoredDocuments().filter(d => d.caseId !== caseId);
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(docs));

      const tasks = getStoredTasks().filter(t => t.caseId !== caseId);
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));

      localStorage.removeItem(`${BRIEFS_STORAGE_KEY}_${caseId}`);
    } catch (e) {}
  }
}

export function clearDemoCases(): void {
  saveStoredCases([]);
}

// --- DOCUMENTS STORAGE ---
export function getStoredDocuments(caseId?: string): CaseDocument[] {
  if (typeof window === 'undefined') {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_DOCUMENTS : [];
  }
  try {
    const raw = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    let allDocs: CaseDocument[] = raw ? JSON.parse(raw) : [];
    
    // Filter out legacy dummy docs
    allDocs = allDocs.filter(d => !DUMMY_DOC_IDS.has(d.id));

    // If case is Demo case, ensure synthetic demo documents are present
    if (caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' || !caseId) {
      const demoDocIds = new Set(allDocs.map(d => d.id));
      const missingDemoDocs = DEMO_DOCUMENTS.filter(d => !demoDocIds.has(d.id));
      if (missingDemoDocs.length > 0) {
        allDocs = [...missingDemoDocs, ...allDocs];
      }
    }

    return caseId ? allDocs.filter(d => d.caseId === caseId) : allDocs;
  } catch {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_DOCUMENTS : [];
  }
}

export function addDocumentToCase(doc: Omit<CaseDocument, 'id' | 'uploadDate'>): CaseDocument {
  const current = getStoredDocuments();
  const created: CaseDocument = {
    ...doc,
    id: `doc-${Date.now()}`,
    uploadDate: new Date().toISOString().split('T')[0]
  };
  const updated = [created, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('casekeeper_documents_updated'));
    window.dispatchEvent(new Event('storage'));
  }
  return created;
}

export function deleteDocument(docId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const allDocs = getStoredDocuments();
    const updated = allDocs.filter(d => d.id !== docId);
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('casekeeper_documents_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to delete document', e);
  }
}

export function updateDocumentExtraction(docId: string, status: 'done' | 'processing' | 'failed'): void {
  if (typeof window === 'undefined') return;
  try {
    const allDocs = getStoredDocuments();
    const updated = allDocs.map(d => d.id === docId ? { ...d, extractionStatus: status } : d);
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to update document extraction', e);
  }
}

// --- CONTRADICTIONS & DISCREPANCIES ENGINE ---
export function getCaseContradictions(caseId: string): Contradiction[] {
  if (typeof window === 'undefined') {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_CONTRADICTIONS : [];
  }
  try {
    const raw = localStorage.getItem(`${CONTRADICTIONS_STORAGE_KEY}_${caseId}`);
    if (raw) return JSON.parse(raw);
    if (caseId === DEMO_CASE_ID || caseId === 'CK-2026-001') {
      localStorage.setItem(`${CONTRADICTIONS_STORAGE_KEY}_${caseId}`, JSON.stringify(DEMO_CONTRADICTIONS));
      return DEMO_CONTRADICTIONS;
    }
    return [];
  } catch {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_CONTRADICTIONS : [];
  }
}

export function updateContradictionStatus(
  caseId: string, 
  contradictionId: string, 
  resolutionStatus: Contradiction['resolutionStatus'],
  advocateNotes?: string
): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getCaseContradictions(caseId);
    const updated = list.map(c => 
      c.id === contradictionId 
        ? { ...c, resolutionStatus, advocateNotes: advocateNotes ?? c.advocateNotes, updatedAt: new Date().toISOString() } 
        : c
    );
    localStorage.setItem(`${CONTRADICTIONS_STORAGE_KEY}_${caseId}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('casekeeper_contradictions_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to update contradiction', e);
  }
}

// --- EVIDENCE GAPS ENGINE ---
export function getCaseEvidenceGaps(caseId: string): EvidenceGap[] {
  if (typeof window === 'undefined') {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_EVIDENCE_GAPS : [];
  }
  try {
    const raw = localStorage.getItem(`${EVIDENCE_GAPS_STORAGE_KEY}_${caseId}`);
    if (raw) return JSON.parse(raw);
    if (caseId === DEMO_CASE_ID || caseId === 'CK-2026-001') {
      localStorage.setItem(`${EVIDENCE_GAPS_STORAGE_KEY}_${caseId}`, JSON.stringify(DEMO_EVIDENCE_GAPS));
      return DEMO_EVIDENCE_GAPS;
    }
    return [];
  } catch {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_EVIDENCE_GAPS : [];
  }
}

export function updateEvidenceGapStatus(
  caseId: string,
  gapId: string,
  status: EvidenceGap['status'],
  advocateNotes?: string
): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getCaseEvidenceGaps(caseId);
    const updated = list.map(g => 
      g.id === gapId 
        ? { ...g, status, advocateNotes: advocateNotes ?? g.advocateNotes } 
        : g
    );
    localStorage.setItem(`${EVIDENCE_GAPS_STORAGE_KEY}_${caseId}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('casekeeper_gaps_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to update evidence gap', e);
  }
}

// --- CHRONOLOGY / TIMELINE ENGINE ---
export function getCaseTimeline(caseId: string): TimelineEvent[] {
  if (typeof window === 'undefined') {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_TIMELINE : [];
  }
  try {
    const raw = localStorage.getItem(`${TIMELINE_STORAGE_KEY}_${caseId}`);
    if (raw) return JSON.parse(raw);
    if (caseId === DEMO_CASE_ID || caseId === 'CK-2026-001') {
      localStorage.setItem(`${TIMELINE_STORAGE_KEY}_${caseId}`, JSON.stringify(DEMO_TIMELINE));
      return DEMO_TIMELINE;
    }
    return [];
  } catch {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_TIMELINE : [];
  }
}

export function addTimelineEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
  const current = getCaseTimeline(event.caseId);
  const created: TimelineEvent = {
    ...event,
    id: `time-${Date.now()}`
  };
  const updated = [created, ...current].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${TIMELINE_STORAGE_KEY}_${event.caseId}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('casekeeper_timeline_updated'));
    window.dispatchEvent(new Event('storage'));
  }
  return created;
}

// --- HUMAN VERIFICATION ENGINE ---
export function getCaseFactVerifications(caseId: string): FactVerification[] {
  if (typeof window === 'undefined') {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_FACT_VERIFICATIONS : [];
  }
  try {
    const raw = localStorage.getItem(`${VERIFICATIONS_STORAGE_KEY}_${caseId}`);
    if (raw) return JSON.parse(raw);
    if (caseId === DEMO_CASE_ID || caseId === 'CK-2026-001') {
      localStorage.setItem(`${VERIFICATIONS_STORAGE_KEY}_${caseId}`, JSON.stringify(DEMO_FACT_VERIFICATIONS));
      return DEMO_FACT_VERIFICATIONS;
    }
    return [];
  } catch {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_FACT_VERIFICATIONS : [];
  }
}

export function updateFactVerification(
  caseId: string,
  factId: string,
  status: FactVerification['status'],
  correctedText?: string,
  correctionReason?: string,
  reviewerName: string = 'Adv. Rajeshwar Sharma'
): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getCaseFactVerifications(caseId);
    const updated = list.map(f => 
      f.id === factId 
        ? {
            ...f,
            status,
            correctedText: correctedText ?? f.correctedText,
            correctionReason: correctionReason ?? f.correctionReason,
            reviewerName,
            reviewTimestamp: new Date().toLocaleString('en-IN')
          } 
        : f
    );
    localStorage.setItem(`${VERIFICATIONS_STORAGE_KEY}_${caseId}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('casekeeper_facts_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to update fact verification', e);
  }
}

// --- EXPLAINABLE CASE READINESS SCORE ---
export function getCaseReadiness(caseId: string): CaseReadiness {
  if (caseId === DEMO_CASE_ID || caseId === 'CK-2026-001') {
    const facts = getCaseFactVerifications(caseId);
    const gaps = getCaseEvidenceGaps(caseId);
    const contradictions = getCaseContradictions(caseId);

    const totalFacts = facts.length || 1;
    const verifiedFacts = facts.filter(f => f.status === 'verified').length;
    const reviewedFacts = facts.filter(f => f.status !== 'pending_review').length;
    
    const totalGaps = gaps.length || 1;
    const resolvedGaps = gaps.filter(g => g.status === 'uploaded' || g.status === 'waived').length;

    const totalContra = contradictions.length || 1;
    const resolvedContra = contradictions.filter(c => c.resolutionStatus !== 'unresolved').length;

    // Component calculation:
    // 1. Source reference coverage: 40%
    const sourceCoverage = Math.round((verifiedFacts / totalFacts) * 100);
    // 2. Checklist coverage: 25%
    const checklistCoverage = Math.round(((totalGaps - gaps.filter(g => g.status === 'missing').length) / totalGaps) * 100);
    // 3. Advocate review completion: 20%
    const reviewCompletion = Math.round((reviewedFacts / totalFacts) * 100);
    // 4. Discrepancy resolution: 15%
    const contraResolution = Math.round((resolvedContra / totalContra) * 100);

    const overall = Math.round(
      (sourceCoverage * 0.40) +
      (checklistCoverage * 0.25) +
      (reviewCompletion * 0.20) +
      (contraResolution * 0.15)
    );

    return {
      overallScore: Math.min(100, Math.max(0, overall)),
      sourceReferenceCoverage: sourceCoverage,
      checklistCoverage,
      advocateReviewCompletion: reviewCompletion,
      discrepancyResolution: contraResolution,
      totalFactsCount: totalFacts,
      verifiedFactsCount: verifiedFacts,
      unresolvedDiscrepancyCount: contradictions.filter(c => c.resolutionStatus === 'unresolved').length,
      missingChecklistCount: gaps.filter(g => g.status === 'missing').length,
      disclaimer: DEMO_CASE_READINESS.disclaimer
    };
  }

  return {
    overallScore: 60,
    sourceReferenceCoverage: 70,
    checklistCoverage: 50,
    advocateReviewCompletion: 50,
    discrepancyResolution: 100,
    totalFactsCount: 4,
    verifiedFactsCount: 2,
    unresolvedDiscrepancyCount: 0,
    missingChecklistCount: 2,
    disclaimer: 'This score measures documentation completeness, source pin coverage, and advocate review readiness. It does not predict legal outcomes, case merit, or judicial probability of success.'
  };
}

// --- RESET DEMO CASE ---
export function resetDemoCase(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${CONTRADICTIONS_STORAGE_KEY}_${DEMO_CASE_ID}`);
    localStorage.removeItem(`${EVIDENCE_GAPS_STORAGE_KEY}_${DEMO_CASE_ID}`);
    localStorage.removeItem(`${TIMELINE_STORAGE_KEY}_${DEMO_CASE_ID}`);
    localStorage.removeItem(`${VERIFICATIONS_STORAGE_KEY}_${DEMO_CASE_ID}`);
    localStorage.removeItem(`${BRIEFS_STORAGE_KEY}_${DEMO_CASE_ID}`);
    
    // Reset stored cases with primary demo
    const cleanCases = getStoredCases().filter(c => c.id !== DEMO_CASE_ID);
    saveStoredCases([PRIMARY_DEMO_CASE, ...cleanCases]);

    // Reset demo documents
    const nonDemoDocs = getStoredDocuments().filter(d => d.caseId !== DEMO_CASE_ID);
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify([...DEMO_DOCUMENTS, ...nonDemoDocs]));

    window.dispatchEvent(new Event('casekeeper_cases_updated'));
    window.dispatchEvent(new Event('casekeeper_documents_updated'));
    window.dispatchEvent(new Event('casekeeper_contradictions_updated'));
    window.dispatchEvent(new Event('casekeeper_gaps_updated'));
    window.dispatchEvent(new Event('casekeeper_timeline_updated'));
    window.dispatchEvent(new Event('casekeeper_facts_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to reset demo case', e);
  }
}

// --- TASKS STORAGE ---
export function getStoredTasks(caseId?: string): CaseTask[] {
  if (typeof window === 'undefined') {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_TASKS : [];
  }
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    let allTasks: CaseTask[] = raw ? JSON.parse(raw) : [];
    allTasks = allTasks.filter(t => !DUMMY_TASK_IDS.has(t.id));

    if (caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' || !caseId) {
      const taskIds = new Set(allTasks.map(t => t.id));
      const missingDemo = DEMO_TASKS.filter(t => !taskIds.has(t.id));
      if (missingDemo.length > 0) {
        allTasks = [...missingDemo, ...allTasks];
      }
    }

    return caseId ? allTasks.filter(t => t.caseId === caseId) : allTasks;
  } catch {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_TASKS : [];
  }
}

export function addTask(task: Omit<CaseTask, 'id'>): CaseTask {
  const current = getStoredTasks();
  const created: CaseTask = {
    ...task,
    id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
  const updated = [created, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('casekeeper_tasks_updated'));
    window.dispatchEvent(new Event('storage'));
  }
  return created;
}

export function toggleTaskStatus(taskId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const allTasks = getStoredTasks();
    const updated = allTasks.map(t => 
      t.id === taskId 
        ? { ...t, status: (t.status === 'pending' ? 'completed' : 'pending') as 'pending' | 'completed' } 
        : t
    );
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('casekeeper_tasks_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to toggle task status', e);
  }
}

export function deleteTask(taskId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const allTasks = getStoredTasks();
    const updated = allTasks.filter(t => t.id !== taskId);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('casekeeper_tasks_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to delete task', e);
  }
}

// --- HANDOFFS STORAGE ---
export function getStoredHandoffs(): Handoff[] {
  if (typeof window === 'undefined') return [DEMO_HANDOFF];
  try {
    const raw = localStorage.getItem(HANDOFFS_STORAGE_KEY);
    let all: Handoff[] = raw ? JSON.parse(raw) : [];
    all = all.filter(h => !DUMMY_HANDOFF_IDS.has(h.id));

    const hasDemo = all.some(h => h.id === DEMO_HANDOFF.id || h.caseId === DEMO_CASE_ID);
    if (!hasDemo) {
      all = [DEMO_HANDOFF, ...all];
    }

    return all;
  } catch {
    return [DEMO_HANDOFF];
  }
}

export function saveHandoff(handoff: Handoff): void {
  const all = getStoredHandoffs();
  const updated = [handoff, ...all.filter(h => h.id !== handoff.id)];
  if (typeof window !== 'undefined') {
    localStorage.setItem(HANDOFFS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  }
}

export function updateHandoffStatus(handoffId: string, status: Handoff['status']): void {
  const all = getStoredHandoffs();
  const updated = all.map(h => h.id === handoffId ? { ...h, status } : h);
  if (typeof window !== 'undefined') {
    localStorage.setItem(HANDOFFS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  }
}

// --- BRIEFS STORAGE ---
export function getStoredBrief(caseId: string, caseItem?: CaseItem): BriefVersion {
  if (typeof window === 'undefined') {
    return caseId === DEMO_CASE_ID || caseId === 'CK-2026-001' ? DEMO_BRIEF : buildEmptyBrief(caseId, caseItem);
  }
  try {
    const raw = localStorage.getItem(`${BRIEFS_STORAGE_KEY}_${caseId}`);
    if (raw) {
      return JSON.parse(raw);
    }
    if (caseId === DEMO_CASE_ID || caseId === 'CK-2026-001') {
      localStorage.setItem(`${BRIEFS_STORAGE_KEY}_${caseId}`, JSON.stringify(DEMO_BRIEF));
      return DEMO_BRIEF;
    }
  } catch (e) {}
  return buildEmptyBrief(caseId, caseItem);
}

export function saveStoredBrief(caseId: string, brief: BriefVersion): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${BRIEFS_STORAGE_KEY}_${caseId}`, JSON.stringify(brief));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save brief to localStorage', e);
  }
}

function buildEmptyBrief(caseId: string, c?: CaseItem): BriefVersion {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN');
  return {
    id: `brief-${caseId}-v1`,
    caseId,
    versionNumber: 1,
    status: 'draft',
    isAiGenerated: false,
    createdAt: dateStr,
    summary: c?.description ? c.description : 'Click "Generate Brief" above to create an automated summary and chronological timeline from registered case details and uploaded documents.',
    parties: c ? [
      { name: c.parties.petitioner, role: 'Petitioner / Aggrieved Party', counsel: 'Counsel on Record' },
      { name: c.parties.respondent, role: 'Respondent / Opposing Body', counsel: 'Notice Issued' }
    ] : [],
    keyFacts: c?.description ? [c.description] : ['No facts recorded yet. Add notes or upload case documents.'],
    importantDates: c?.nextHearingDate ? [{ date: c.nextHearingDate, description: `Next hearing scheduled at ${c.court}` }] : [],
    hearingDates: c?.nextHearingDate ? [{ date: c.nextHearingDate, court: c.court, purpose: 'Bench Listing' }] : [],
    suggestedTasks: [],
    missingInformation: [],
    documentsReviewed: [],
    citations: []
  };
}
