"use client";

import React, { useState } from 'react';
import { Vote, LogIn, LogOut, User, LayoutDashboard, Newspaper, X, Mail, Lock } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setAuthError('Invalid credentials. Use any email & password for demo.');
    } else {
      // Send welcome/confirmation email
      try {
        await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: email.split('@')[0] }),
        });
      } catch (_) {
        // Email is best-effort — don't block login if it fails
      }
      setShowAuthModal(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-indigo-700 hover:text-indigo-800 transition-colors">
            <Vote className="w-6 h-6" />
            ElectionIQ
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/news" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <Newspaper className="w-4 h-4" /> News
            </Link>
            {session && (
              <Link href="/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            )}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                  <User className="w-4 h-4" />
                  {session.user?.name}
                </div>
                <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={() => signOut()} className="text-red-400 hover:text-red-600 text-sm font-semibold flex items-center gap-1 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" /> Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <Vote className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
              <h2 className="text-2xl font-extrabold text-gray-800">Welcome to ElectionIQ</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in or register to access your dashboard</p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-500" /> Email
                </label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-500" /> Password
                </label>
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
                Sign In / Register
              </button>
            </form>

            <div className="flex items-center gap-3 mb-5">
              <hr className="flex-1 border-gray-200" />
              <span className="text-gray-400 text-sm font-semibold">OR</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <button
              onClick={() => { signIn('google'); setShowAuthModal(false); }}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-3"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Demo mode: any email & password will work
            </p>
          </div>
        </div>
      )}
    </>
  );
}
