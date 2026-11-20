'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  FileStack, 
  ArrowLeftRight, 
  User, 
  LogOut, 
  Scale, 
  Bell, 
  Search, 
  ChevronRight,
  ShieldCheck,
  Lock,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { getAuthUser, clearAuth, AuthUser } from '@/lib/authStore';
import { getStoredCases } from '@/lib/caseStore';
import { getStoredEnquiries } from '@/lib/enquiryStore';

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

  useEffect(() => {
    setMounted(true);
    setAuthUserLocal(getAuthUser());

    const onAuth = () => setAuthUserLocal(getAuthUser());
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

  // Derive initials for avatar
  const initials = authUser?.name
    ? authUser.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'RV';
  const displayName = authUser?.name ?? 'Adv. Rajesh Verma';
  const displaySub = authUser?.barNumber ? `Bar: ${authUser.barNumber}` : (authUser?.email ?? 'Senior Counsel');

  const cases = mounted ? getStoredCases() : [];
  const primaryCaseId = cases.length > 0 ? cases[0].id : null;
  const pendingEnquiriesCount = mounted 
    ? getStoredEnquiries(authUser?.id, authUser?.email).filter(e => e.status === 'pending').length 
    : 0;

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
      id: 'documents', 
      label: 'Case Documents', 
      href: primaryCaseId ? `/workspace/cases/${primaryCaseId}/documents` : '/workspace/cases', 
      icon: FileText 
    },
    { 
      id: 'briefs', 
      label: 'Brief Viewer', 
      href: primaryCaseId ? `/workspace/cases/${primaryCaseId}/briefs` : '/workspace/cases', 
      icon: FileStack 
    },
    { id: 'handoffs', label: 'Handoffs & Transfers', href: '/workspace/handoffs', icon: ArrowLeftRight },
    { id: 'profile', label: 'Advocate Profile', href: '/workspace/profile', icon: User },
  ];

  // Access Control Guard: Only authenticated lawyers can enter the Advocate Workspace
  if (mounted && (!authUser || authUser.role !== 'lawyer')) {
    const isPublicUser = authUser?.role === 'public';
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        {/* Animated backdrop glow */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-8 shadow-2xl relative z-10 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center mb-5 animate-float">
            <Lock className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
            Advocate Portal Restricted
          </span>

          <h2 className="text-2xl font-bold text-white mb-2">
            Advocate Authorization Required
          </h2>

          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            {isPublicUser ? (
              <>
                You are currently signed in as a <strong>Citizen account ({authUser?.name})</strong>. This workspace is reserved exclusively for registered Advocates and Legal Practitioners.
              </>
            ) : (
              <>
                Sign in or register with a Bar Council verified advocate account to access the Advocate Workspace.
              </>
            )}
          </p>

          <div className="space-y-3">
            <Link
              href="/login?role=lawyer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30 btn-interactive"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Advocate Sign In / Register</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/"
              className="block w-full text-center py-2 text-xs text-slate-400 hover:text-slate-200 transition pt-2"
            >
              &larr; Return to CaseKeeper Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Persistent Dark Navy Sidebar (Width 250px) */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col justify-between shrink-0 border-r border-slate-800 shadow-xl hidden md:flex fixed h-full z-30">
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white p-0.5 shadow-md">
                <Image 
                  src="/logo.png" 
                  alt="CaseKeeper Logo" 
                  width={30} 
                  height={30} 
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">CaseKeeper</span>
                <span className="block text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Advocate Portal</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Legal Workspace
            </div>

            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname.startsWith(item.href) || activeNav === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-[#1B4FD8] text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-900 leading-none">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Security Indicator */}
          <div className="mx-4 mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/60 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Private Storage Active</span>
            </div>
            RLS-Enforced Supabase bucket. Case dockets are strictly compartmentalized.
          </div>
        </div>

        {/* Advocate Profile Strip at Bottom */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{displaySub}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out to Public Portal"
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top App Bar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/workspace/dashboard" className="hover:text-blue-600">Workspace</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F172A] font-bold">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Public Link */}
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 hidden sm:inline"
            >
              Public Portal →
            </Link>

            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
            </button>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
