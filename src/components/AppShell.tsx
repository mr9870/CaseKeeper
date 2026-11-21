'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Layers, 
  ArrowLeftRight, 
  MessageSquare, 
  User, 
  Scale, 
  Bell, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  ExternalLink,
  Search
} from 'lucide-react';
import { getAuthUser, clearAuth, AuthUser } from '@/lib/authStore';
import { getStoredCases } from '@/lib/caseStore';
import { getStoredEnquiries } from '@/lib/enquiryStore';
import { DEMO_CASE_ID } from '@/lib/demoCaseData';

interface AppShellProps {
  children: React.ReactNode;
  activeNav?: string;
  breadcrumb?: string;
}

export function AppShell({ children, activeNav = 'dashboard', breadcrumb = 'Dashboard' }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [authUser, setAuthUserLocal] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [pendingEnquiriesCount, setPendingEnquiriesCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const user = getAuthUser();
    setAuthUserLocal(user);

    const storedCases = getStoredCases();
    setCases(storedCases);

    const enquiries = getStoredEnquiries(user?.id, user?.email);
    setPendingEnquiriesCount(enquiries.filter(e => e.status === 'pending').length);

    const onAuth = () => {
      const u = getAuthUser();
      setAuthUserLocal(u);
      setPendingEnquiriesCount(getStoredEnquiries(u?.id, u?.email).filter(e => e.status === 'pending').length);
    };

    window.addEventListener('auth_changed', onAuth);
    window.addEventListener('storage', onAuth);
    return () => {
      window.removeEventListener('auth_changed', onAuth);
      window.removeEventListener('storage', onAuth);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    setAuthUserLocal(null);
    window.dispatchEvent(new Event('auth_changed'));
    router.push('/');
  };

  const primaryCaseId = cases.length > 0 ? cases[0].id : DEMO_CASE_ID;
  const displayName = authUser?.name ?? 'Adv. Rajeshwar Sharma';
  const displayRole = authUser?.barNumber ? `Bar: ${authUser.barNumber}` : 'High Court Advocate';

  // Real Navigation Items - ONLY original actual features, in the new midnight-purple design
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/workspace/dashboard', icon: LayoutDashboard },
    { 
      id: 'enquiries', 
      label: 'Client Enquiries', 
      href: '/workspace/enquiries', 
      icon: MessageSquare,
      badge: pendingEnquiriesCount > 0 ? pendingEnquiriesCount : undefined
    },
    { id: 'cases', label: 'Active Cases', href: '/workspace/cases', icon: Briefcase },
    { 
      id: 'workspace', 
      label: 'Case Intelligence', 
      href: `/workspace/cases/${primaryCaseId}`, 
      icon: Layers 
    },
    { 
      id: 'documents', 
      label: 'Case Documents', 
      href: `/workspace/cases/${primaryCaseId}/documents`, 
      icon: FileText 
    },
    { id: 'handoffs', label: 'Secure Handoffs', href: '/workspace/handoffs', icon: ArrowLeftRight },
    { id: 'profile', label: 'Advocate Profile', href: '/workspace/profile', icon: User },
  ];

  // Access Control Guard
  if (mounted && (!authUser || authUser.role !== 'lawyer')) {
    const isPublicUser = authUser?.role === 'public';
    return (
      <div className="min-h-screen bg-[#0D0B26] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#1A163B]/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mx-auto flex items-center justify-center mb-5">
            <Lock className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
            Advocate Portal
          </span>

          <h2 className="text-2xl font-bold text-white mb-2">
            Advocate Authorization Required
          </h2>

          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            {isPublicUser ? (
              <>
                You are currently signed in as a citizen. This workspace is reserved exclusively for registered advocates and legal counsel.
              </>
            ) : (
              <>
                Sign in or register with an Advocate account to access the CaseKeeper Advocate Command Center.
              </>
            )}
          </p>

          <div className="space-y-3">
            <Link
              href="/login?role=lawyer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-semibold rounded-xl text-sm shadow-lg shadow-purple-600/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Advocate Sign In / Register</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/"
              className="block w-full text-center py-2 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              &larr; Return to CaseKeeper Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFD] font-sans text-slate-900">
      {/* ========================================================================= */}
      {/* SIDEBAR: CLEAN MIDNIGHT-PURPLE THEME (NO PRO PLAN, NO QUICK ACTIONS)      */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-[#0D0B26] text-white flex flex-col justify-between shrink-0 border-r border-[#1D1945] shadow-2xl hidden md:flex fixed h-full z-30">
        <div className="overflow-y-auto flex-1">
          {/* Logo & Subtitle */}
          <div className="px-5 py-6">
            <Link href="/workspace/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-purple-600/30 text-white">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
                  CaseKeeper
                </span>
                <span className="text-[10px] text-purple-300 font-medium tracking-wide">
                  Case Continuity Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links: ONLY REAL FEATURES */}
          <nav className="px-3.5 space-y-1 text-xs">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeNav === item.id || (item.id === 'dashboard' && pathname === '/workspace/dashboard');

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#5B46EB] to-[#7952F3] text-white shadow-md shadow-indigo-900/40 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-900 leading-none">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Advocate Profile Strip at Bottom of Sidebar */}
        <div className="p-4 border-t border-[#1D1945] bg-[#0A0820]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-inner shrink-0">
                {displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{displayRole}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER (TOP HEADER + PAGE CONTENT)                                */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        
        {/* Top App Header */}
        <header className="h-18 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
          
          {/* Search Input Bar with ⌘K Badge */}
          <div className="flex-1 max-w-xl relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases, dockets, parties, CNR numbers..."
              className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder-slate-400 bg-slate-50/50 hover:bg-white transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold text-slate-500">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>

          {/* Right Header: Notification Bell + User Profile */}
          <div className="flex items-center gap-4">
            
            {/* Notification Bell with Real Pending Enquiries Dot */}
            <Link 
              href="/workspace/enquiries"
              className="relative p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              title="Citizen Enquiries"
            >
              <Bell className="w-5 h-5" />
              {pendingEnquiriesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white" />
              )}
            </Link>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-purple-100 overflow-hidden">
                  <span>{displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                    <span>{displayName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">{displayRole}</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-scale-in">
                  <div className="p-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{displayName}</p>
                    <p className="text-[10px] text-slate-500">{authUser?.email || 'advocate@casekeeper.in'}</p>
                  </div>
                  <Link
                    href="/workspace/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Advocate Profile</span>
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>Public Portal</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-red-600 hover:bg-red-50 font-medium text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 p-5 sm:p-7 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
