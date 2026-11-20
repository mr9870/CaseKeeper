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
  importantDates: { date: string; description: string }[];
  hearingDates: { date: string; court: string; purpose: string }[];
  suggestedTasks: { task: string; isSuggestion: boolean; due?: string }[];
  missingInformation: string[];
  documentsReviewed: { name: string; pages: number }[];
  citations: { doc: string; page: number; excerpt: string }[];
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
  briefVersionId: string;
  selectedDocuments: string[];
  notes: string;
}
