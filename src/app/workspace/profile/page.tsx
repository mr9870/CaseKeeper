'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  CheckCircle, 
  ShieldCheck, 
  Save, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Award,
  AlertCircle
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { getAuthUser, setAuthUser } from '@/lib/authStore';
import { getLawyersDirectory, updateLawyerProfileInDirectory } from '@/lib/lawyerStore';

const LAWYER_PROFILE_KEY = 'casekeeper_lawyer_profile';

const DEFAULT_PROFILE = {
  name: 'Adv. Rajesh Verma',
  barNumber: 'D/1420/2008',
  title: 'Senior Advocate — High Court & Supreme Court',
  city: 'New Delhi',
  state: 'Delhi',
  experienceYears: 16,
  email: 'rajesh.verma@delhibar.org',
  phone: '+91 98110 24891',
  practiceAreas: 'Civil Litigation, Cooperative Societies, Arbitration, Property Law',
  bio: 'Extensive litigation experience across Delhi High Court, DRT, and National Consumer Disputes Redressal Commission (NCDRC). Panel counsel for multi-state housing societies.'
};

export default function LawyerProfileWorkspacePage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [activeLawyerId, setActiveLawyerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const auth = getAuthUser();
      const directory = getLawyersDirectory();
      
      const normalize = (s?: string) => (s || '').toLowerCase().replace(/^adv\.\s*/i, '').trim();

      // Check if there is already a saved profile in localStorage
      let localProfile: any = null;
      try {
        const raw = localStorage.getItem(LAWYER_PROFILE_KEY);
        if (raw) localProfile = JSON.parse(raw);
      } catch (err) {}

      // Find current advocate in public directory
      const directoryMatch = directory.find(l => 
        (auth?.barNumber && l.barNumber && l.barNumber.toLowerCase() === auth.barNumber.toLowerCase()) ||
        (auth?.email && l.email && l.email.toLowerCase() === auth.email.toLowerCase()) ||
        (auth?.name && normalize(l.name) === normalize(auth.name)) ||
        (l.isRegisteredUser === true) ||
        (l.id.startsWith('lawyer-reg-'))
      ) || directory[0];

      if (directoryMatch || localProfile) {
        if (directoryMatch) setActiveLawyerId(directoryMatch.id);

        const expVal = localProfile?.experienceYears !== undefined && !isNaN(Number(localProfile.experienceYears)) && Number(localProfile.experienceYears) > 0
          ? Number(localProfile.experienceYears)
          : (directoryMatch?.experienceYears !== undefined && !isNaN(Number(directoryMatch.experienceYears)) ? Number(directoryMatch.experienceYears) : 12);

        setProfile({
          name: localProfile?.name || directoryMatch?.name || (auth?.name ? (auth.name.startsWith('Adv.') ? auth.name : `Adv. ${auth.name}`) : 'Adv. Rakshit Sharma'),
          barNumber: localProfile?.barNumber || directoryMatch?.barNumber || auth?.barNumber || 'D/1420/2008',
          title: localProfile?.title || directoryMatch?.title || `Advocate — Bar Council Verified`,
          city: localProfile?.city || directoryMatch?.city || auth?.city || 'New Delhi',
          state: localProfile?.state || directoryMatch?.state || 'Delhi',
          experienceYears: expVal,
          email: localProfile?.email || directoryMatch?.email || auth?.email || 'advocate@casekeeper.in',
          phone: localProfile?.phone || directoryMatch?.phone || auth?.phone || '+91 98110 24891',
          practiceAreas: localProfile?.practiceAreas 
            ? (Array.isArray(localProfile.practiceAreas) ? localProfile.practiceAreas.join(', ') : localProfile.practiceAreas)
            : (directoryMatch?.practiceAreas ? (Array.isArray(directoryMatch.practiceAreas) ? directoryMatch.practiceAreas.join(', ') : directoryMatch.practiceAreas) : 'Civil Litigation, Consumer Protection'),
          bio: localProfile?.bio || directoryMatch?.bio || 'Empaneled Advocate practicing before High Court of Delhi.'
        });
      } else if (auth && auth.role === 'lawyer') {
        setProfile(prev => ({
          ...prev,
          name: auth.name || prev.name,
          email: auth.email || prev.email,
          barNumber: auth.barNumber || prev.barNumber,
          phone: auth.phone || prev.phone,
          city: auth.city || prev.city,
          title: `Advocate — Bar Council Verified`,
          bio: `Bar Council registered advocate practicing in ${auth.city || 'New Delhi'}.`
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const areasArray = profile.practiceAreas
        ? profile.practiceAreas.split(',').map(s => s.trim()).filter(Boolean)
        : ['Civil Litigation', 'Consumer Protection'];

      const parsedExp = isNaN(Number(profile.experienceYears)) ? 7 : Number(profile.experienceYears);

      // 1. Save to local profile key
      localStorage.setItem(LAWYER_PROFILE_KEY, JSON.stringify({
        ...profile,
        experienceYears: parsedExp,
        practiceAreas: areasArray
      }));

      // 2. Update Public Directory in lawyerStore so Landing Page & Directory update LIVE!
      updateLawyerProfileInDirectory({
        id: activeLawyerId,
        name: profile.name,
        barNumber: profile.barNumber,
        title: profile.title,
        city: profile.city,
        state: profile.state,
        experienceYears: parsedExp,
        practiceAreas: areasArray,
        bio: profile.bio,
        phone: profile.phone,
        email: profile.email
      });

      // 3. Update active AuthUser session
      const auth = getAuthUser();
      if (auth && auth.role === 'lawyer') {
        setAuthUser({
          ...auth,
          name: profile.name,
          email: profile.email,
          barNumber: profile.barNumber,
          phone: profile.phone,
          city: profile.city
        });
      }

      window.dispatchEvent(new Event('lawyers_updated'));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('auth_changed'));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <AppShell activeNav="profile" breadcrumb="Advocate Profile & Credentials">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Advocate Profile & Practice Settings</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your verified directory credentials and contact details visible to citizen litigants.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Bar Council Verified
            </span>
          </div>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile updates saved successfully! Live experience, bio, and practice areas are now updated on the Public Portal &amp; Directory.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-xl shadow-md">
              {(profile.name || 'Advocate').replace(/^Adv\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AR'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{profile.name}</h2>
              <p className="text-xs text-slate-500 font-mono">Enrollment No: {profile.barNumber}</p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>Active &amp; Verified in Public Directory</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name & Title</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">State Bar Council Enrollment Number</label>
              <input
                type="text"
                value={profile.barNumber}
                onChange={(e) => setProfile({ ...profile, barNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8] font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Gazette registered enrolment ID</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Primary Seat</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Years of Practice Standing</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={profile.experienceYears === 0 ? '' : profile.experienceYears}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                    setProfile({ ...profile, experienceYears: isNaN(val) ? 0 : val });
                  }}
                  placeholder="e.g. 12"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium pointer-events-none">Years Exp</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Practice Areas (Comma Separated)</label>
              <input
                type="text"
                value={profile.practiceAreas}
                onChange={(e) => setProfile({ ...profile, practiceAreas: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Professional Bio & Practice Overview</label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile & Settings</span>
            </button>
          </div>
        </form>

      </div>
    </AppShell>
  );
}
