'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Trash2, 
  PlusCircle, 
  AlertCircle,
  FolderPlus
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { 
  getStoredEnquiries, 
  updateEnquiryStatus, 
  convertEnquiryToCase, 
  ClientEnquiry 
} from '@/lib/enquiryStore';
import { getAuthUser } from '@/lib/authStore';

export default function ClientEnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<ClientEnquiry[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'converted'>('all');
  const [activeLawyerEmail, setActiveLawyerEmail] = useState('');
  const [activeLawyerId, setActiveLawyerId] = useState('');

  const loadEnquiries = () => {
    const auth = getAuthUser();
    let email = '';
    let id = '';
    if (auth && auth.role === 'lawyer') {
      email = auth.email || '';
      id = auth.id || '';
      setActiveLawyerEmail(email);
      setActiveLawyerId(id);
    }
    const list = getStoredEnquiries(id, email);
    setEnquiries(list);
  };

  useEffect(() => {
    loadEnquiries();
    window.addEventListener('casekeeper_enquiry_submitted', loadEnquiries);
    window.addEventListener('casekeeper_enquiries_updated', loadEnquiries);
    window.addEventListener('storage', loadEnquiries);
    return () => {
      window.removeEventListener('casekeeper_enquiry_submitted', loadEnquiries);
      window.removeEventListener('casekeeper_enquiries_updated', loadEnquiries);
      window.removeEventListener('storage', loadEnquiries);
    };
  }, []);

  const handleStatusChange = (id: string, status: ClientEnquiry['status']) => {
    updateEnquiryStatus(id, status);
    loadEnquiries();
  };

  const handleConvertToCase = (enquiry: ClientEnquiry) => {
    const caseId = convertEnquiryToCase(enquiry);
    loadEnquiries();
    router.push(`/workspace/cases/${caseId}/briefs`);
  };

  const filtered = enquiries.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const pendingCount = enquiries.filter(e => e.status === 'pending').length;

  return (
    <AppShell activeNav="enquiries" breadcrumb="Client Consultation Enquiries">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Public Portal Inquiries</span>
              </span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold animate-pulse">
                  {pendingCount} New Pending
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Client Consultation Enquiries</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct enquiries submitted by citizens from the CaseKeeper public legal aid portal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/workspace/cases/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Register New Case</span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-[#1B4FD8] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              filter === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Pending Review</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
              {enquiries.filter(e => e.status === 'pending').length}
            </span>
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'accepted' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Accepted / Contacted ({enquiries.filter(e => e.status === 'accepted').length})
          </button>
          <button
            onClick={() => setFilter('converted')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'converted' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Converted to Case Matter ({enquiries.filter(e => e.status === 'converted').length})
          </button>
        </div>

        {/* Enquiries Stream */}
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((enquiry) => {
              const isPending = enquiry.status === 'pending';
              const isConverted = enquiry.status === 'converted';
              const isAccepted = enquiry.status === 'accepted';

              return (
                <div 
                  key={enquiry.id}
                  className={`bg-white rounded-xl border p-5 shadow-sm transition-all ${
                    isPending ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {enquiry.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          <span>{enquiry.clientName}</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                          {enquiry.caseCategory}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isPending ? 'bg-amber-100 text-amber-800' :
                          isConverted ? 'bg-purple-100 text-purple-800' :
                          isAccepted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {enquiry.status}
                        </span>
                      </div>

                      {/* Contact row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        {enquiry.clientPhone && (
                          <a 
                            href={`tel:${enquiry.clientPhone}`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline font-mono"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{enquiry.clientPhone}</span>
                          </a>
                        )}
                        {enquiry.clientEmail && (
                          <a 
                            href={`mailto:${enquiry.clientEmail}`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline font-mono"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{enquiry.clientEmail}</span>
                          </a>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          Received: {new Date(enquiry.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>

                      {/* Message body */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-800 leading-relaxed">
                        <p className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider mb-1">
                          Client Statement of Dispute:
                        </p>
                        <p className="whitespace-pre-line">{enquiry.message}</p>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex flex-row md:flex-col items-center gap-2 shrink-0 justify-end">
                      {!isConverted && (
                        <button
                          onClick={() => handleConvertToCase(enquiry)}
                          className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                          title="Convert this consultation into a real litigation case docket"
                        >
                          <FolderPlus className="w-3.5 h-3.5" />
                          <span>Convert to Case</span>
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={() => handleStatusChange(enquiry.id, 'accepted')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Mark Contacted</span>
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={() => handleStatusChange(enquiry.id, 'declined')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-bold text-xs rounded-lg transition-colors"
                        >
                          <span>Decline</span>
                        </button>
                      )}

                      {isConverted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-lg">
                          <CheckCircle className="w-3 h-3 text-purple-600" />
                          Active Case Created
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Consultation Enquiries Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When citizens visit your profile on the Public Portal and submit an enquiry, it will instantly appear here for your review and conversion to case matters.
            </p>
            <div className="pt-2">
              <Link
                href="/lawyers"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg"
              >
                <span>View Public Directory Listing</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
