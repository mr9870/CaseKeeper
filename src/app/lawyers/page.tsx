'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, CheckCircle, Star, Phone, Mail, Award, Filter, ArrowRight, Sparkles } from 'lucide-react';
import { PublicNavbar, PublicFooter } from '@/components/PublicNav';
import { getLawyersDirectory } from '@/lib/lawyerStore';
import { Lawyer } from '@/lib/types';

export default function LawyerDirectoryPage() {
  const [lawyers, setLawyers] = useState<(Lawyer & { isDummy?: boolean; isRegisteredUser?: boolean })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedPractice, setSelectedPractice] = useState('All');

  useEffect(() => {
    const updateLawyers = () => {
      setLawyers(getLawyersDirectory());
    };
    updateLawyers();

    window.addEventListener('lawyers_updated', updateLawyers);
    window.addEventListener('storage', updateLawyers);
    return () => {
      window.removeEventListener('lawyers_updated', updateLawyers);
      window.removeEventListener('storage', updateLawyers);
    };
  }, []);

  const cities = ['All', 'New Delhi', 'Mumbai', 'Chandigarh', 'Kolkata', 'Bengaluru', 'Jaipur'];
  const practices = ['All', 'Civil Litigation', 'Consumer Disputes', 'Criminal Defense', 'Property & RERA', 'Agricultural Disputes'];

  const filtered = lawyers.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.practiceAreas.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity === 'All' || l.city === selectedCity;
    const matchesPractice = selectedPractice === 'All' || l.practiceAreas.includes(selectedPractice);
    return matchesSearch && matchesCity && matchesPractice;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-blue-700" />
            <span>State Bar Council Verified Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Verified Advocate Directory</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Discover verified practitioners across High Courts, District Courts, RERA, and consumer tribunals. Send a direct consultation enquiry.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by advocate name or keyword..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
            </div>

            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8] bg-white text-slate-700"
              >
                {cities.map(c => <option key={c} value={c}>{c === 'All' ? 'All Locations' : c}</option>)}
              </select>
            </div>

            <div>
              <select
                value={selectedPractice}
                onChange={(e) => setSelectedPractice(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8] bg-white text-slate-700"
              >
                {practices.map(p => <option key={p} value={p}>{p === 'All' ? 'All Practice Areas' : p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Directory List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lawyer) => (
            <div key={lawyer.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 card-hover-lift flex flex-col justify-between overflow-hidden relative">
              {lawyer.isRegisteredUser && (
                <div className="bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-3 py-1 tracking-wider shadow-sm flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Verified Real Practitioner</span>
                  </span>
                  <span className="font-mono text-[9px] bg-emerald-700/80 px-1.5 py-0.2 rounded">Live Enrolment</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-base shadow-sm">
                      {lawyer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-[#0F172A] text-sm sm:text-base leading-tight">{lawyer.name}</h3>
                        {lawyer.verified && (
                          <span title="Bar Council Verified">
                            <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-50" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{lawyer.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">Bar ID: {lawyer.barNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 mb-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lawyer.city}, {lawyer.state}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lawyer.experienceYears} Years Standing</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {lawyer.bio}
                </p>

                <div className="space-y-2 mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Practice Domains</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lawyer.practiceAreas.map((area, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  <strong>Languages:</strong> {lawyer.languages.join(', ')}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/lawyers/${lawyer.id}`}
                  className="w-full py-2 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg text-center shadow-xs transition-colors"
                >
                  View Profile & Send Enquiry
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <p className="text-sm font-bold text-slate-700">No advocates matching the selected criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting filters to "All Locations" and "All Practice Areas".</p>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
