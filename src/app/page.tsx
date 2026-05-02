"use client";

import React, { useState, useEffect } from 'react';
import InputForm from '@/components/InputForm';
import AssistantUI from '@/components/AssistantUI';
import { UserContext } from '@/utils/eligibility';
import { AssistantResponse } from '@/ai/vertex';
import { ShieldCheck, Vote, RefreshCw, LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { db } from '@/utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const STORAGE_KEY = 'electioniq_last_result';
const USER_CONTEXT_KEY = 'electioniq_last_context';

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [userProfile, setUserProfile] = useState<{ age?: string, state?: string, firstTime?: boolean } | null>(null);

  // Load cached result and profile from Firebase (fallback to localStorage)
  useEffect(() => {
    async function loadData() {
      if (!session?.user?.email) {
        setResult(null);
        setUserProfile(null);
        return;
      }

      try {
        // 1. Fetch Profile
        const profileRef = doc(db, "users", session.user.email);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setUserProfile({
            age: profileData.age,
            state: profileData.state,
            firstTime: profileData.firstTime ?? true
          });
        }

        // 2. Fetch Result
        const resultRef = doc(db, "results", session.user.email);
        const resultSnap = await getDoc(resultRef);

        if (resultSnap.exists()) {
          setResult(resultSnap.data() as AssistantResponse);
        } else {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) setResult(JSON.parse(cached));
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    if (status === 'authenticated' || status === 'unauthenticated') {
      loadData();
    }
  }, [session, status]);

  const handleSubmit = async (data: UserContext) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setError(resData.error || "Something went wrong.");
      } else {
        setResult(resData.data);
        
        // Persist result + context
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resData.data));
        localStorage.setItem(USER_CONTEXT_KEY, JSON.stringify(data));
        
        // If logged in, save to Firestore
        if (session?.user?.email) {
          try {
            await setDoc(doc(db, "results", session.user.email), resData.data);
            
            // Also update profile state/age in Firestore
            await setDoc(doc(db, "users", session.user.email), {
              state: data.state,
              age: data.age,
              lastCheckedAt: new Date().toISOString()
            }, { merge: true });
          } catch (err) {
            console.error("Error saving to Firebase:", err);
          }
        }

        // Also pre-fill dashboard local cache
        const existing = JSON.parse(localStorage.getItem('electioniq_profile') || '{}');
        localStorage.setItem('electioniq_profile', JSON.stringify({
          ...existing,
          state: data.state,
          age: data.age,
        }));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_CONTEXT_KEY);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) setAuthError('Try any email & password for demo.');
    else {
      setShowAuthModal(false);
      // Welcome email
      try {
        await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: email.split('@')[0] }),
        });
      } catch (_) {}
    }
  };

  // Still loading session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-3xl -z-10 animate-pulse delay-1000"></div>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-md mb-6 border border-gray-100">
            <Vote className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight mb-4">
            ElectionIQ
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
            Your Smart Election Learning Assistant <ShieldCheck className="w-5 h-5 text-green-500" />
          </p>
        </header>

        {/* ── NOT LOGGED IN → Show form + Login/Register CTA ── */}
        {!session && (
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className={`transition-all duration-700 ease-in-out ${result ? 'md:col-span-4' : 'md:col-span-8 md:col-start-3'}`}>
              <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Login/Register CTA — only visible when NOT logged in */}
              <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-5 text-center">
                <p className="text-gray-600 text-sm mb-4 font-medium">
                  🔒 Sign in to save your journey, submit documents & get personalised updates
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button onClick={() => setShowAuthModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Sign In / Register
                  </button>
                  <button onClick={() => signIn('google')}
                    className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2">
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
                    Continue with Google
                  </button>
                </div>
              </div>
            </div>

            {result && (
              <div className="md:col-span-8 w-full">
                <AssistantUI data={result} />
              </div>
            )}
          </div>
        )}

        {/* ── LOGGED IN → Show Results + Form in two columns (Inner Page Feel) ── */}
        {session && (
          <div className="grid md:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Col: Form (Pre-filled from Dashboard) */}
            <div className={`transition-all duration-700 ease-in-out ${result ? 'md:col-span-4' : 'md:col-span-8 md:col-start-3'}`}>
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10"></div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" /> Your Details
                </h3>
                <InputForm 
                  onSubmit={handleSubmit} 
                  isLoading={isLoading} 
                  initialData={userProfile || undefined}
                />
              </div>
              
              <Link href="/dashboard" className="block w-full text-center py-3 bg-indigo-50 text-indigo-700 font-bold rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all text-sm">
                Edit Profile in Dashboard
              </Link>
            </div>

            {/* Right Col: Results */}
            {result && (
              <div className="md:col-span-8 w-full space-y-6">
                <div className="bg-white/60 p-4 rounded-2xl border border-gray-100 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-gray-800">Saved Journey for {session.user?.name?.split(' ')[0]}</p>
                  </div>
                  <button onClick={handleReset} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                    Clear Result
                  </button>
                </div>
                <AssistantUI data={result} />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-gray-400 text-sm mt-12">
        <p>© {new Date().getFullYear()} ElectionIQ. Built for Indian Citizens. 🇮🇳</p>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowAuthModal(false); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <Vote className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
              <h2 className="text-2xl font-extrabold text-gray-800">Welcome to ElectionIQ</h2>
              <p className="text-gray-500 text-sm mt-1">Any email & password works for demo</p>
            </div>
            {authError && <p className="text-red-500 text-sm mb-4 text-center font-medium bg-red-50 p-3 rounded-xl">{authError}</p>}
            <form onSubmit={handleEmailLogin} className="space-y-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-500" /> Email
                </label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-500" /> Password
                </label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all">
                Sign In / Register
              </button>
            </form>
            <div className="flex items-center gap-3 mb-5">
              <hr className="flex-1 border-gray-200" /><span className="text-gray-400 text-sm font-semibold">OR</span><hr className="flex-1 border-gray-200" />
            </div>
            <button onClick={() => { signIn('google'); setShowAuthModal(false); }}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
