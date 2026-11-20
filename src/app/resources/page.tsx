'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ExternalLink, Calendar, ShieldCheck, BookOpen, Building, CheckCircle } from 'lucide-react';
import { PublicNavbar, PublicFooter } from '@/components/PublicNav';
import { DEMO_RESOURCES } from '@/lib/mockData';

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Court Services', 'Legal Aid', 'Consumer Complaints', 'Agricultural Support', 'Cooperative Societies'];

  const filtered = DEMO_RESOURCES.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Official Government Portals & Statutory Schemes</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Official Resources Directory</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Curated repository of official portals from the Supreme Court e-Committee, Ministry of Cooperation, Ministry of Agriculture, and Department of Justice.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by scheme name, authority, or keyword (e.g., e-Courts, PMFBY, NALSA)..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold shrink-0">Filter by Domain:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#1B4FD8] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <div key={res.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {res.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {res.type}
                  </span>
                </div>

                <h3 className="font-bold text-[#0F172A] text-base mb-1">{res.title}</h3>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{res.authority}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {res.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Jurisdiction: {res.jurisdiction}</span>
                  <span>Rev: {res.lastReviewed}</span>
                </div>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-[#1B4FD8] font-bold text-xs rounded-lg border border-slate-200 hover:border-blue-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Open Official Gov Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No official resources matching "{searchTerm}"</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for keywords like "crop", "consumer", "housing", or "legal aid".</p>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
