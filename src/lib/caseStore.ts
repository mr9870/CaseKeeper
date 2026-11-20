'use client';

import { CaseItem, CaseDocument, BriefVersion, CaseTask, Handoff } from './types';

const CASES_STORAGE_KEY = 'casekeeper_cases_data';
const DOCUMENTS_STORAGE_KEY = 'casekeeper_documents_data';
const BRIEFS_STORAGE_KEY = 'casekeeper_briefs_data';
const TASKS_STORAGE_KEY = 'casekeeper_tasks_data';
const HANDOFFS_STORAGE_KEY = 'casekeeper_handoffs_data';
const PURGE_FLAG_KEY = 'casekeeper_dummy_data_purged_v2';

// Known dummy IDs to strip out
const DUMMY_CASE_IDS = new Set(['case-101', 'case-102', 'case-103', 'case-104', 'case-105', 'case-106']);
const DUMMY_DOC_IDS = new Set(['doc-1', 'doc-2', 'doc-3']);
const DUMMY_TASK_IDS = new Set(['task-1', 'task-2', 'task-3', 'task-4']);
const DUMMY_HANDOFF_IDS = new Set(['ho-1', 'ho-2']);

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
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cleanCases));
    }

    // Clean documents
    const rawDocs = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (rawDocs) {
      const parsed: CaseDocument[] = JSON.parse(rawDocs);
      const cleanDocs = parsed.filter(d => !DUMMY_DOC_IDS.has(d.id) && !DUMMY_CASE_IDS.has(d.caseId));
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(cleanDocs));
    }

    // Clean tasks
    const rawTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (rawTasks) {
      const parsed: CaseTask[] = JSON.parse(rawTasks);
      const cleanTasks = parsed.filter(t => !DUMMY_TASK_IDS.has(t.id) && !DUMMY_CASE_IDS.has(t.caseId));
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(cleanTasks));
    }

    // Clean handoffs
    const rawHandoffs = localStorage.getItem(HANDOFFS_STORAGE_KEY);
    if (rawHandoffs) {
      const parsed: Handoff[] = JSON.parse(rawHandoffs);
      const cleanHandoffs = parsed.filter(h => !DUMMY_HANDOFF_IDS.has(h.id) && !DUMMY_CASE_IDS.has(h.caseId));
      localStorage.setItem(HANDOFFS_STORAGE_KEY, JSON.stringify(cleanHandoffs));
    }

    localStorage.setItem(PURGE_FLAG_KEY, 'true');
  } catch (e) {
    console.error('Error purging legacy dummy data:', e);
  }
}

// --- CASES STORAGE (REAL DATABASE ONLY) ---
export function getStoredCases(): CaseItem[] {
  if (typeof window === 'undefined') return [];
  try {
    // One-time purge check
    if (!localStorage.getItem(PURGE_FLAG_KEY)) {
      purgeLegacyDummyData();
    }
    const raw = localStorage.getItem(CASES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: CaseItem[] = JSON.parse(raw);
    return parsed.filter(c => !DUMMY_CASE_IDS.has(c.id));
  } catch {
    return [];
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

// --- DOCUMENTS STORAGE (REAL DATABASE ONLY) ---
export function getStoredDocuments(caseId?: string): CaseDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (!raw) return [];
    const allDocs: CaseDocument[] = JSON.parse(raw);
    const cleanDocs = allDocs.filter(d => !DUMMY_DOC_IDS.has(d.id) && !DUMMY_CASE_IDS.has(d.caseId));
    return caseId ? cleanDocs.filter(d => d.caseId === caseId) : cleanDocs;
  } catch {
    return [];
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

// --- TASKS STORAGE (REAL DATABASE ONLY) ---
export function getStoredTasks(caseId?: string): CaseTask[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return [];
    const allTasks: CaseTask[] = JSON.parse(raw);
    const cleanTasks = allTasks.filter(t => !DUMMY_TASK_IDS.has(t.id) && !DUMMY_CASE_IDS.has(t.caseId));
    return caseId ? cleanTasks.filter(t => t.caseId === caseId) : cleanTasks;
  } catch {
    return [];
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

// --- HANDOFFS STORAGE (REAL DATABASE ONLY) ---
export function getStoredHandoffs(): Handoff[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HANDOFFS_STORAGE_KEY);
    if (!raw) return [];
    const all: Handoff[] = JSON.parse(raw);
    return all.filter(h => !DUMMY_HANDOFF_IDS.has(h.id) && !DUMMY_CASE_IDS.has(h.caseId));
  } catch {
    return [];
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
    return buildEmptyBrief(caseId, caseItem);
  }
  try {
    const raw = localStorage.getItem(`${BRIEFS_STORAGE_KEY}_${caseId}`);
    if (raw) {
      return JSON.parse(raw);
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
