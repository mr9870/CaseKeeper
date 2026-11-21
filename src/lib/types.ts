export interface Lawyer {
  id: string;
  name: string;
  title: string;
  barNumber: string;
  verified: boolean;
  city: string;
  state: string;
  experienceYears: number;
  languages: string[];
  practiceAreas: string[];
  rating: number;
  reviewsCount: number;
  bio: string;
  phone: string;
  email: string;
  isRegisteredUser?: boolean;
  isDummy?: boolean;
}

export interface OfficialResource {
  id: string;
  title: string;
  authority: string;
  category: string;
  description: string;
  url: string;
  jurisdiction: string;
  lastReviewed: string;
  type: string;
}

export interface CaseItem {
  id: string;
  title: string;
  referenceNumber: string;
  category: string;
  jurisdiction: string;
  status: 'active' | 'pending' | 'archived' | 'closed';
  court: string;
  parties: {
    petitioner: string;
    respondent: string;
  };
  nextHearingDate?: string;
  lastUpdated: string;
  description: string;
  notes?: string;
  clientDetails?: {
    name: string;
    phone: string;
    email: string;
    address?: string;
  };
  cnrNumber?: string;
  assignedAdvocate?: string;
  isDemo?: boolean;
}

export interface CaseDocument {
  id: string;
  caseId: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  processingStatus: 'done' | 'processing' | 'failed';
  extractionStatus: 'done' | 'processing' | 'failed' | 'unsupported';
  pageCount: number;
  summary?: string;
  sha256?: string;
  mimeType?: string;
  category?: 'Agreement' | 'Financial' | 'Notice' | 'Pleading' | 'Correspondence';
  fullText?: string;
  pages?: { pageNumber: number; text: string }[];
}

export interface SourcePin {
  docId: string;
  docName: string;
  pageNumber: number;
  excerpt: string;
  charOffset?: number;
  fileHash?: string;
  extractionMethod?: 'native_pdf' | 'ocr_tesseract' | 'manual';
  confidenceScore?: number;
}

export interface Contradiction {
  id: string;
  caseId: string;
  title: string;
  category: 'contradiction' | 'subsequent_update' | 'ambiguous' | 'possible_amendment';
  explanation: string;
  significance: 'high' | 'medium' | 'low';
  valueA: {
    statement: string;
    source: SourcePin;
  };
  valueB: {
    statement: string;
    source: SourcePin;
  };
  resolutionStatus: 'unresolved' | 'confirmed' | 'dismissed_false_positive' | 'legitimate_update';
  advocateNotes?: string;
  updatedAt?: string;
}

export interface EvidenceGap {
  id: string;
  caseId: string;
  itemTitle: string;
  category: string;
  reason: string;
  missingType: 'checklist' | 'reference_detected';
  referencedInDoc?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'missing' | 'uploaded' | 'waived' | 'not_applicable';
  suggestedAction: string;
  advocateNotes?: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  date: string;
  title: string;
  details: string;
  eventType: 'agreement' | 'payment' | 'notice' | 'hearing' | 'filing' | 'communication';
  dateType: 'actual' | 'expected' | 'deadline' | 'revised';
  datePrecision: 'exact' | 'estimated' | 'uncertain';
  source?: SourcePin;
  reviewStatus: 'verified' | 'pending' | 'flagged';
  associatedDocuments?: string[];
}

export interface FactVerification {
  id: string;
  caseId: string;
  factText: string;
  category: 'party_assertion' | 'financial' | 'possession' | 'statutory_ground';
  status: 'pending_review' | 'verified' | 'corrected' | 'rejected' | 'unsupported';
  source: SourcePin;
  reviewerName?: string;
  reviewTimestamp?: string;
  correctedText?: string;
  correctionReason?: string;
}

export interface CaseReadiness {
  overallScore: number;
  sourceReferenceCoverage: number; // 40%
  checklistCoverage: number;       // 25%
  advocateReviewCompletion: number;// 20%
  discrepancyResolution: number;   // 15%
  totalFactsCount: number;
  verifiedFactsCount: number;
  unresolvedDiscrepancyCount: number;
  missingChecklistCount: number;
  disclaimer: string;
}

export interface BriefVersion {
  id: string;
  caseId: string;
  versionNumber: number;
  status: 'reviewed' | 'draft';
  isAiGenerated: boolean;
  createdAt: string;
  reviewedAt?: string;
  summary: string;
  parties: { name: string; role: string; counsel: string }[];
  keyFacts: string[];
  materialAssertions?: {
    id: string;
    assertion: string;
    source: SourcePin;
    status: 'verified' | 'pending' | 'unsupported';
  }[];
  importantDates: { date: string; description: string }[];
  hearingDates: { date: string; court: string; purpose: string }[];
  suggestedTasks: { task: string; isSuggestion: boolean; due?: string }[];
  missingInformation: string[];
  documentsReviewed: { name: string; pages: number }[];
  citations: { doc: string; page: number; excerpt: string }[];
  confidentialNotesExcluded?: boolean;
}

export interface CaseTask {
  id: string;
  caseId: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed';
  isSuggestion: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface CaseEvent {
  id: string;
  caseId: string;
  title: string;
  date: string;
  type: 'hearing' | 'filing' | 'notice' | 'order';
  source: 'manual' | 'extracted';
  confirmed: boolean;
  details: string;
}

export interface Handoff {
  id: string;
  caseId: string;
  caseTitle: string;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'revoked';
  sentDate: string;
  expiryDate?: string;
  briefVersionId: string;
  selectedDocuments: string[];
  includeTimeline?: boolean;
  includeDiscrepancies?: boolean;
  includeGaps?: boolean;
  includeTasks?: boolean;
  notes: string;
  clientConsentRecorded?: boolean;
  clientConsentTimestamp?: string;
  accessLog?: { accessedAt: string; ip: string; action: string }[];
}
