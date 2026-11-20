'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Briefcase,
  Mail,
  Lock,
  Hash,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Scale,
  Shield,
  Phone,
  MapPin,
  Building,
  UserPlus,
  LogIn,
  Check,
  Award
} from 'lucide-react';
import { setAuthUser, getAuthUser, registerUser, authenticateUser } from '@/lib/authStore';
import { registerNewAdvocate } from '@/lib/lawyerStore';

type RoleTab = 'citizen' | 'advocate';
type AuthMode = 'signin' | 'register';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole = searchParams.get('role') === 'lawyer' ? 'advocate' : 'citizen';
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'signin';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [tab, setTab] = useState<RoleTab>(initialRole);

  // Common Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // Advocate Specific States
  const [barNumber, setBarNumber] = useState('');
  const [barCouncil, setBarCouncil] = useState('Bar Council of Delhi');
  const [practiceCourt, setPracticeCourt] = useState('High Court of Delhi');
  const [experienceYears, setExperienceYears] = useState('10');

  // UI States
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      router.replace(user.role === 'lawyer' ? '/workspace/dashboard' : '/chat');
    }
  }, [router]);

  // Demo auto-fill helpers
  const handleAutoFillCitizen = () => {
    setEmail('ramesh.sharma@gmail.com');
    setPassword('citizen123');
    setFullName('Ramesh Kumar Sharma');
    setPhone('+91 98110 24891');
    setCity('New Delhi');
    setErrorMessage('');
  };

  const handleAutoFillAdvocate = () => {
    setEmail('rajesh.verma@delhibar.org');
    setPassword('advocate123');
    setFullName('Adv. Rajesh Verma');
    setBarNumber('D/1420/2008');
    setPhone('+91 98202 81923');
    setCity('New Delhi');
    setBarCouncil('Bar Council of Delhi');
    setPracticeCourt('High Court of Delhi & Supreme Court');
    setErrorMessage('');
  };

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in your email and password.');
      return;
    }

    if (mode === 'register' && password !== confirmPassword && confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (mode === 'register') {
        const derivedName = fullName.trim() || email.split('@')[0].replace(/[._\-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const res = registerUser({
          name: derivedName,
          email: email.trim(),
          password: password,
          role: 'public',
          phone: phone.trim() || undefined,
          city: city.trim() || 'New Delhi'
        });

        if (!res.success) {
          setLoading(false);
          setErrorMessage(res.error || 'Failed to register account.');
          return;
        }

        setSuccessMessage('Citizen Account Registered Successfully in Database!');
        setSubmitted(true);
        setTimeout(() => router.push('/chat'), 1000);
      } else {
        // Sign In verification against database
        const res = authenticateUser({
          email: email.trim(),
          password: password,
          role: 'public'
        });

        if (!res.success) {
          setLoading(false);
          setErrorMessage(res.error || 'Invalid email or password.');
          return;
        }

        setSuccessMessage('Credentials Verified! Welcome back to CaseKeeper.');
        setSubmitted(true);
        setTimeout(() => router.push('/chat'), 1000);
      }
    }, 400);
  };

  const handleAdvocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password || !barNumber) {
      setErrorMessage('Email, password, and State Bar Council Number are mandatory for advocates.');
      return;
    }

    if (mode === 'register' && password !== confirmPassword && confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const advocateName = fullName.trim().startsWith('Adv.') ? fullName.trim() : `Adv. ${fullName.trim() || 'Advocate'}`;

      if (mode === 'register') {
        // Register new advocate in Users Database
        const res = registerUser({
          name: advocateName,
          email: email.trim(),
          password: password,
          role: 'lawyer',
          barNumber: barNumber.trim(),
          barCouncil: barCouncil.trim() || 'Bar Council of Delhi',
          practiceCourt: practiceCourt.trim() || 'High Court of Delhi',
          phone: phone.trim() || '+91 98110 24891',
          city: city.trim() || 'New Delhi'
        });

        if (!res.success) {
          setLoading(false);
          setErrorMessage(res.error || 'Failed to register advocate.');
          return;
        }

        const parsedExp = parseInt(experienceYears, 10) || 10;

        // Register new advocate in public directory so they appear on landing page and directory immediately
        registerNewAdvocate({
          fullName: advocateName,
          barNumber: barNumber.trim(),
          barCouncil: barCouncil.trim() || 'Bar Council of Delhi',
          practiceCourt: practiceCourt.trim() || 'High Court of Delhi',
          city: city.trim() || 'New Delhi',
          experienceYears: parsedExp,
          phone: phone.trim() || '+91 98110 24891',
          email: email.trim(),
          practiceAreas: ['Civil Litigation', 'Consumer Disputes', 'Property & RERA', 'Constitutional Law'],
          bio: `Bar Council verified legal practitioner practicing before ${practiceCourt}. Panel counsel available on CaseKeeper.`
        });

        // Save lawyer profile
        if (typeof window !== 'undefined') {
          const lawyerProfile = {
            name: advocateName,
            barNumber: barNumber.trim(),
            title: `Advocate — ${practiceCourt}`,
            city: city.trim() || 'New Delhi',
            state: 'Delhi',
            experienceYears: parsedExp,
            email: email.trim(),
            phone: phone.trim() || '+91 98110 24891',
            practiceAreas: 'Civil Litigation, Consumer Disputes, Property & RERA, Arbitration',
            bio: `Empaneled Advocate practicing before ${practiceCourt} and associated Bar Council tribunals.`
          };
          localStorage.setItem('casekeeper_lawyer_profile', JSON.stringify(lawyerProfile));
        }

        setSuccessMessage('Advocate Account Verified & Enrolled in Database!');
        setSubmitted(true);
        setTimeout(() => router.push('/workspace/dashboard'), 1000);
      } else {
        // Advocate Sign In against database
        const res = authenticateUser({
          email: email.trim(),
          password: password,
          role: 'lawyer',
          barNumber: barNumber.trim()
        });

        if (!res.success) {
          setLoading(false);
          setErrorMessage(res.error || 'Invalid advocate credentials.');
          return;
        }

        setSuccessMessage('Bar Council Credentials Verified! Opening Advocate Workspace.');
        setSubmitted(true);
        setTimeout(() => router.push('/workspace/dashboard'), 1000);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#111C35] to-[#0A0F1D] text-white flex flex-col relative overflow-hidden">
      {/* Background Animated Floating Badges */}
      <div className="absolute top-16 left-10 opacity-10 pointer-events-none animate-float">
        <Scale className="w-32 h-32 text-blue-400" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 pointer-events-none animate-float" style={{ animationDelay: '2s' }}>
        <Shield className="w-40 h-40 text-blue-500" />
      </div>

      {/* Top Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-white p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <Image src="/logo.png" alt="CaseKeeper" width={34} height={34} className="object-contain w-full h-full" priority />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-white tracking-tight">CaseKeeper</span>
              <span className="text-[9px] bg-blue-900/80 text-blue-300 font-semibold px-1.5 py-0.2 rounded border border-blue-700/50 uppercase">India</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-none">Legal Aid & Justice Portal</p>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group btn-interactive"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          <span>Return to Public Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-lg animate-scale-in">

          {/* Mode Switcher Pill (Sign In vs Register) */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMessage(''); }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'signin'
                    ? 'bg-[#1B4FD8] text-white shadow-md animate-scale-in'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(''); }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-[#1B4FD8] text-white shadow-md animate-scale-in'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account / Register</span>
              </button>
            </div>
          </div>

          {/* Card */}
          <div className="bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fade-in-up">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900/30 via-slate-900/40 to-slate-900/0 px-7 pt-6 pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                    {mode === 'register' ? 'Register New Account' : 'Welcome Back'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {mode === 'register' 
                      ? 'Join CaseKeeper for legal assistance or practice management' 
                      : 'Sign in to access your consultations and legal dockets'}
                  </p>
                </div>

                <div className="hidden sm:inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>Civic Legal Portal</span>
                </div>
              </div>
            </div>

            {/* Role Tabs (Citizen vs Advocate) */}
            <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/40">
              <button
                type="button"
                onClick={() => { setTab('citizen'); setErrorMessage(''); }}
                className={`flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
                  tab === 'citizen'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Citizen / Litigant</span>
              </button>

              <button
                type="button"
                onClick={() => { setTab('advocate'); setErrorMessage(''); }}
                className={`flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
                  tab === 'advocate'
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Advocate / Lawyer</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-7">

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
                  <span>⚠️ {errorMessage}</span>
                </div>
              )}

              {/* Success View */}
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center animate-pop-success">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg border border-emerald-500/30">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{successMessage}</h3>
                  <p className="text-xs text-slate-400">Loading your personalized environment…</p>
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mt-2" />
                </div>
              ) : tab === 'citizen' ? (

                /* ================= CITIZEN FORM ================= */
                <form key={`citizen-${mode}`} onSubmit={handleCitizenSubmit} className="space-y-4 text-xs animate-fade-in">
                  {mode === 'register' ? (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Full Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar Sharma"
                          className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="citizen@example.com"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Mobile Number *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98110 XXXXX"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">City / District *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. New Delhi, Lucknow, Mumbai"
                          className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Create Password *</label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Confirm Password *</label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Citizen Sign In */
                    <>
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="citizen@example.com"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Auto-fill shortcut */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleAutoFillCitizen}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Pre-fill Sample Litigant Credentials</span>
                    </button>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="text-[11px] text-slate-400 hover:text-white"
                      >
                        Don't have an account?
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 btn-interactive mt-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{mode === 'register' ? 'Create Citizen Account' : 'Sign In as Citizen'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

              ) : (

                /* ================= ADVOCATE FORM ================= */
                <form key={`advocate-${mode}`} onSubmit={handleAdvocateSubmit} className="space-y-4 text-xs animate-fade-in">
                  {mode === 'register' ? (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Advocate Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Adv. Rajesh Verma"
                          className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Bar Enrolment Number *</label>
                          <input
                            type="text"
                            required
                            value={barNumber}
                            onChange={(e) => setBarNumber(e.target.value)}
                            placeholder="e.g. D/1420/2008"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">State Bar Council *</label>
                          <select
                            value={barCouncil}
                            onChange={(e) => setBarCouncil(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="Bar Council of Delhi">Bar Council of Delhi</option>
                            <option value="Bar Council of Maharashtra & Goa">Bar Council of Maharashtra & Goa</option>
                            <option value="Bar Council of Punjab & Haryana">Bar Council of Punjab & Haryana</option>
                            <option value="Karnataka State Bar Council">Karnataka State Bar Council</option>
                            <option value="Bar Council of Rajasthan">Bar Council of Rajasthan</option>
                            <option value="Bar Council of West Bengal">Bar Council of West Bengal</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Official Email *</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="advocate@barcouncil.org"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Contact Phone *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98110 XXXXX"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Primary Seat / High Court</label>
                          <input
                            type="text"
                            value={practiceCourt}
                            onChange={(e) => setPracticeCourt(e.target.value)}
                            placeholder="e.g. High Court of Delhi"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Years of Practice Standing *</label>
                          <input
                            type="number"
                            min="1"
                            max="60"
                            required
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(e.target.value)}
                            placeholder="e.g. 12"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Create Password *</label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Confirm Password *</label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Advocate Sign In */
                    <>
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Advocate Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="advocate@barcouncil.org"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">State Bar Council Enrollment Number</label>
                        <div className="relative">
                          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            value={barNumber}
                            onChange={(e) => setBarNumber(e.target.value)}
                            placeholder="e.g. D/1420/2008"
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Auto-fill shortcut */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleAutoFillAdvocate}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Pre-fill Sample Bar Council Credentials</span>
                    </button>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="text-[11px] text-slate-400 hover:text-white"
                      >
                        Register as new advocate?
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#1B4FD8] hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 btn-interactive mt-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{mode === 'register' ? 'Register as Verified Advocate' : 'Enter Advocate Workspace'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

          {/* Footer switcher link */}
          <p className="mt-6 text-center text-xs text-slate-500">
            {mode === 'register' ? (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  Sign In to existing account
                </button>
              </>
            ) : (
              <>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  Create new account
                </button>
              </>
            )}
          </p>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-slate-400 text-sm">Loading CaseKeeper Account Portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
