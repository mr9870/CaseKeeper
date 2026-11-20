'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Scale, Globe, ArrowRight, Briefcase, Shield, BookOpen, Users, LogOut, LogIn, UserPlus } from 'lucide-react';
import { getAuthUser, clearAuth, AuthUser } from '@/lib/authStore';
import { getAppLanguage, setAppLanguage, AppLanguage } from '@/lib/langStore';
import { useRouter } from 'next/navigation';

export function PublicNavbar() {
  const [lang, setLang] = useState<AppLanguage>('EN');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setLang(getAppLanguage());
    const updateAuth = () => setAuthUser(getAuthUser());
    updateAuth();

    const onLangChanged = (e: any) => {
      if (e.detail) setLang(e.detail);
      else setLang(getAppLanguage());
    };

    window.addEventListener('casekeeper_lang_changed', onLangChanged);
    window.addEventListener('storage', onLangChanged);
    window.addEventListener('storage', updateAuth);
    window.addEventListener('auth_changed', updateAuth);
    return () => {
      window.removeEventListener('casekeeper_lang_changed', onLangChanged);
      window.removeEventListener('storage', onLangChanged);
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('auth_changed', updateAuth);
    };
  }, []);

  const handleLangToggle = (newLang: AppLanguage) => {
    setLang(newLang);
    setAppLanguage(newLang);
  };

  const handleLogout = () => {
    clearAuth();
    setAuthUser(null);
    window.dispatchEvent(new Event('auth_changed'));
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A] text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-md bg-white p-0.5 group-hover:opacity-95 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="CaseKeeper Logo" 
              width={38} 
              height={38} 
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight font-sans">CaseKeeper</span>
              <span className="text-[10px] bg-blue-900/80 text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-700/50 uppercase">India</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none">Legal Aid & Justice Portal</p>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/chat" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI Legal Assistant
          </Link>
          <Link href="/resources" className="hover:text-white transition-colors flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-400" />
            Official Schemes
          </Link>
          <Link href="/lawyers" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            Find a Lawyer
          </Link>
        </nav>

        {/* Right Nav */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => handleLangToggle('EN')}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === 'EN' ? 'bg-[#1B4FD8] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLangToggle('HI')}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === 'HI' ? 'bg-[#1B4FD8] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Auth-aware actions */}
          {mounted && authUser ? (
            <div className="flex items-center gap-2.5 animate-fade-in">
              {authUser.role === 'lawyer' ? (
                <Link
                  href="/workspace/dashboard"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1B4FD8] hover:bg-blue-600 text-white shadow-md hover:shadow-blue-500/20 transition-all text-xs font-semibold btn-interactive"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Advocate Workspace</span>
                </Link>
              ) : (
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-blue-500 hover:text-white transition-all text-xs font-semibold btn-interactive"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {authUser.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[110px] truncate">{authUser.name}</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all text-xs font-semibold btn-interactive"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/login?mode=register"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1B4FD8] hover:bg-blue-600 text-white shadow-sm hover:shadow-blue-500/25 transition-all text-xs font-semibold btn-interactive"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white p-0.5 shadow-sm">
                <Image 
                  src="/logo.png" 
                  alt="CaseKeeper Logo" 
                  width={30} 
                  height={30} 
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-bold text-white text-base">CaseKeeper India</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs mb-3">
              CaseKeeper is an open access digital legal enablement platform designed for citizens and practitioners in India. Powered by verified statutory sources, e-Courts integrations, and secure case briefing protocols.
            </p>
            <div className="p-2.5 bg-slate-800/60 rounded border border-slate-700/60 text-[11px] text-amber-300/90 flex items-start gap-2">
              <Shield className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>Bar Council Compliance Notice:</strong> In adherence with Bar Council of India Rule 36, this platform operates strictly as a digital administrative conduit and civic legal literacy resource, not an advertising or solicitation forum.
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Direct Portals</h4>
            <ul className="space-y-2">
              <li><Link href="/chat" className="hover:text-white">AI Legal Chatbot (24/7)</Link></li>
              <li><Link href="/resources" className="hover:text-white">PMFBY & Crop Insurance</Link></li>
              <li><Link href="/resources" className="hover:text-white">Multi-State Cooperatives (CRCS)</Link></li>
              <li><Link href="/resources" className="hover:text-white">e-Daakhil Consumer Claims</Link></li>
              <li><Link href="/resources" className="hover:text-white">NALSA Legal Aid (Sec 12)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Emergency Helplines</h4>
            <ul className="space-y-2 text-slate-300">
              <li>NALSA Legal Aid: <span className="font-bold text-white">15100</span></li>
              <li>National Consumer Helpline: <span className="font-bold text-white">1915</span></li>
              <li>Kisan Call Centre (PMFBY): <span className="font-bold text-white">1800-180-1551</span></li>
              <li>Women Helpline: <span className="font-bold text-white">181</span></li>
              <li>Cyber Crime Reporting: <span className="font-bold text-white">1930</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 CaseKeeper Prototype. Managed Next.js Architecture.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy Safeguards</Link>
            <Link href="/terms" className="hover:text-white">Terms of Guidance</Link>
            <Link href="/disclaimer" className="hover:text-white">Statutory Disclaimers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
