'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftRight, 
  Check, 
  Lock, 
  AlertOctagon 
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { getStoredHandoffs, updateHandoffStatus } from '@/lib/caseStore';
import { getAuthUser } from '@/lib/authStore';
import { Handoff } from '@/lib/types';

export default function HandoffsManagementPage() {
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    setHandoffs(getStoredHandoffs());
    const auth = getAuthUser();
    if (auth && auth.email) setUserEmail(auth.email);
  }, []);

  const handleRevoke = (id: string) => {
    updateHandoffStatus(id, 'revoked');
    setHandoffs(getStoredHandoffs());
  };

  const handleAccept = (id: string) => {
    updateHandoffStatus(id, 'accepted');
    setHandoffs(getStoredHandoffs());
  };

  const incoming = handoffs.filter(h => userEmail ? h.recipientEmail === userEmail : false);
  const outgoing = handoffs.filter(h => userEmail ? h.senderEmail === userEmail : true);

  return (
    <AppShell activeNav="handoffs" breadcrumb="Handoffs & Transfers">
      <div className="space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Secure Case Handoffs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming invitations and control outgoing transmittals with real-time access revocation.
          </p>
        </div>

        {/* SECTION 1: Incoming Handoffs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Incoming Handoffs (Received from Co-Counsels)</span>
              </h2>
              <p className="text-xs text-slate-500">You must formally accept before access to private PDFs is unlocked.</p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded font-bold">
              {incoming.length} Received
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {incoming.map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                      {item.id}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{item.caseTitle}</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Transmitted by: <strong>{item.senderName}</strong> ({item.senderEmail})
                  </p>
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                    "{item.notes}"
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">Dispatched: {item.sentDate}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'accepted' ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                        <Check className="w-3.5 h-3.5" />
                        Access Granted
                      </span>
                      <Link
                        href={`/workspace/cases/${item.caseId}/briefs`}
                        className="px-3 py-1.5 bg-[#1B4FD8] text-white text-xs font-bold rounded-lg hover:bg-blue-600"
                      >
                        Inspect Brief
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(item.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Unlock Materials</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {incoming.length === 0 && (
              <p className="p-8 text-center text-xs text-slate-400 italic">No incoming co-counsel invitations.</p>
            )}
          </div>
        </div>

        {/* SECTION 2: Outgoing Handoffs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Outgoing Handoffs (Transmitted by You)</span>
              </h2>
              <p className="text-xs text-slate-500">Revoking access instantly invalidates shared download tokens.</p>
            </div>
            <Link
              href="/workspace/cases"
              className="text-xs font-bold text-[#1B4FD8] hover:underline"
            >
              + Create from Active Case
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {outgoing.map((item) => {
              const isRevoked = item.status === 'revoked';
              return (
                <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                        {item.id}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{item.caseTitle}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isRevoked
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Sent to: <strong>{item.recipientName}</strong> ({item.recipientEmail})
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">Shared on: {item.sentDate}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isRevoked ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        <Lock className="w-3.5 h-3.5" />
                        Permissions Terminated
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRevoke(item.id)}
                        className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>Revoke Access</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {outgoing.length === 0 && (
              <p className="p-8 text-center text-xs text-slate-400 italic">No outgoing handoffs transmitted yet.</p>
            )}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
