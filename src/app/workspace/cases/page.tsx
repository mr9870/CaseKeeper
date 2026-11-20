'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Trash2,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { CaseItem } from '@/lib/types';
import { getStoredCases, deleteCase, updateCaseNotes } from '@/lib/caseStore';
import { getAuthUser } from '@/lib/authStore';
import { StickyNote, Check, Edit2 } from 'lucide-react';

export default function CasesListPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isClient, setIsClient] = useState(false);
  const [lawyerName, setLawyerName] = useState('Advocate');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  useEffect(() => {
    setIsClient(true);
    setCases(getStoredCases());
    const auth = getAuthUser();
    if (auth && auth.role === 'lawyer' && auth.name) {
      setLawyerName(auth.name);
    }
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('casekeeper_lawyer_profile');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.name) setLawyerName(parsed.name);
        }
      } catch (e) {}
    }
  }, []);

  const handleStartEditNote = (c: CaseItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingNoteId(c.id);
    setNoteDraft(c.notes || '');
  };

  const handleSaveInlineNote = (caseId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateCaseNotes(caseId, noteDraft);
    setEditingNoteId(null);
    setCases(getStoredCases());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this case docket?')) {
      deleteCase(id);
      setCases(getStoredCases());
    }
  };

  const handleClearAll = () => {
    if (confirm('Do you want to clear your registered cases?')) {
      cases.forEach(c => deleteCase(c.id));
      setCases([]);
    }
  };

  const categories = [
    'All', 
    'Civil Disputes',
    'Criminal Matters',
    'Family Law',
    'Property & RERA', 
    'Consumer Complaints', 
    'Agricultural Disputes', 
    'Cooperative Society',
    'Legal Aid / Lok Adalat'
  ];

  const filtered = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.court.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'All' || c.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <AppShell activeNav="cases" breadcrumb="Active Cases Portfolio">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Active Cases Portfolio</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Litigation dockets, hearing dates, and structured briefs for {lawyerName}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {cases.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
                title="Clear current cases portfolio"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Portfolio</span>
              </button>
            )}

            <Link
              href="/workspace/cases/new"
              className="px-4 py-2.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Case</span>
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by case title, CNR/reference number, or tribunal..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8] bg-white text-slate-700"
            >
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Practice Areas' : c}</option>)}
            </select>
          </div>
        </div>

        {/* Cases Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {c.referenceNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                        {c.status}
                      </span>
                      <button
                        onClick={(e) => handleDelete(c.id, e)}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                        title="Delete case"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-[#0F172A] text-base mb-1.5 leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-blue-700 font-medium mb-3">
                    {c.jurisdiction} • {c.court}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {c.description || 'No description provided.'}
                  </p>

                  {/* Notes Preview or Inline Editor */}
                  {editingNoteId === c.id ? (
                    <div className="mb-3 p-2.5 bg-amber-50 border border-amber-300 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                        <span>Edit Advocate Strategy Note</span>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="text-slate-400 hover:text-slate-600 text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Trial points, witness info, prep notes..."
                        className="w-full p-2 text-xs rounded border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                      />
                      <button
                        onClick={(e) => handleSaveInlineNote(c.id, e)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save Note</span>
                      </button>
                    </div>
                  ) : c.notes ? (
                    <div className="mb-3 p-2.5 bg-amber-50/80 border border-amber-200/70 rounded-lg text-[11px] text-amber-900 flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold flex items-center gap-1 text-amber-800 mb-0.5">
                          <StickyNote className="w-3 h-3" />
                          <span>Advocate Note:</span>
                        </span>
                        <p className="line-clamp-2 leading-relaxed">{c.notes}</p>
                      </div>
                      <button
                        onClick={(e) => handleStartEditNote(c, e)}
                        className="text-amber-700 hover:text-amber-900 p-1 hover:bg-amber-100 rounded shrink-0"
                        title="Edit note"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="mb-3 flex justify-end">
                      <button
                        onClick={(e) => handleStartEditNote(c, e)}
                        className="text-[10px] text-slate-400 hover:text-amber-700 flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-amber-50 transition-colors"
                      >
                        <StickyNote className="w-3 h-3" />
                        <span>+ Add Note</span>
                      </button>
                    </div>
                  )}

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Petitioner:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">{c.parties.petitioner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Respondent:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">{c.parties.respondent}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hearing: {c.nextHearingDate || 'Pending Listing'}</span>
                  </div>

                  <div className="flex items-center gap-2 font-bold">
                    <Link
                      href={`/workspace/cases/${c.id}/documents`}
                      className="text-slate-600 hover:text-blue-600 text-xs"
                    >
                      Documents
                    </Link>
                    <span className="text-slate-300">•</span>
                    <Link
                      href={`/workspace/cases/${c.id}/briefs`}
                      className="text-[#1B4FD8] hover:underline text-xs flex items-center gap-1"
                    >
                      <span>Brief & Notes</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Cases in Portfolio</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't registered any cases yet. Click "Register New Case" to create your first litigation docket with notes.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/workspace/cases/new"
                className="px-4 py-2 bg-[#1B4FD8] text-white font-bold text-xs rounded-lg shadow-sm"
              >
                + Register First Case
              </Link>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
