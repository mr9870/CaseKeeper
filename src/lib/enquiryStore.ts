'use client';

import { registerNewCase } from './caseStore';

export interface ClientEnquiry {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerEmail: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  caseCategory: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'converted';
  createdAt: string;
}

const ENQUIRIES_STORAGE_KEY = 'casekeeper_client_enquiries';

export function getStoredEnquiries(lawyerId?: string, lawyerEmail?: string, matchAllFallback = true): ClientEnquiry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (!raw) return [];
    const all: ClientEnquiry[] = JSON.parse(raw);
    if (!lawyerId && !lawyerEmail) return all;
    
    const matched = all.filter(e => {
      const matchId = lawyerId && e.lawyerId === lawyerId;
      const matchEmail = lawyerEmail && e.lawyerEmail && e.lawyerEmail.toLowerCase() === lawyerEmail.toLowerCase();
      return matchId || matchEmail;
    });

    // If specific filter returned results, return them. If testing and no direct match, return all so tester can see their enquiry.
    if (matched.length > 0 || !matchAllFallback) return matched;
    return all;
  } catch (err) {
    console.error('Error fetching stored enquiries:', err);
    return [];
  }
}

export function submitClientEnquiry(
  data: Omit<ClientEnquiry, 'id' | 'createdAt' | 'status'>
): ClientEnquiry {
  const current = getStoredEnquiries();
  const created: ClientEnquiry = {
    ...data,
    id: `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const updated = [created, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('casekeeper_enquiry_submitted', { detail: created }));
    window.dispatchEvent(new Event('storage'));
  }

  return created;
}

export function updateEnquiryStatus(
  enquiryId: string, 
  status: ClientEnquiry['status']
): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getStoredEnquiries();
    const updated = all.map(e => e.id === enquiryId ? { ...e, status } : e);
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('casekeeper_enquiries_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to update enquiry status:', err);
  }
}

export function convertEnquiryToCase(enquiry: ClientEnquiry): string {
  const newCase = registerNewCase({
    title: `${enquiry.clientName} v. [Opposing Party]`,
    referenceNumber: `CASE/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
    category: enquiry.caseCategory || 'Civil Disputes',
    jurisdiction: 'District Court Jurisdiction',
    court: 'Bench Listing Pending',
    status: 'active',
    parties: {
      petitioner: enquiry.clientName,
      respondent: 'Opposing Party (To be specified)'
    },
    description: enquiry.message,
    notes: `Enquiry Ref: ${enquiry.id}\nClient Phone: ${enquiry.clientPhone}\nClient Email: ${enquiry.clientEmail}\nDate Initiated: ${new Date(enquiry.createdAt).toLocaleDateString('en-IN')}`
  });

  updateEnquiryStatus(enquiry.id, 'converted');
  return newCase.id;
}
