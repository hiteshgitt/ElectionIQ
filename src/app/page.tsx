"use client";

import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import AssistantUI from '@/components/AssistantUI';
import { UserContext } from '@/utils/eligibility';
import { AssistantResponse } from '@/ai/vertex';
import { ShieldCheck, Vote, LogIn, LogOut, Mail, Lock } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden selection:bg-indigo-200 selection:text-indigo-900">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-3xl -z-10 animate-pulse delay-1000"></div>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
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

          {session && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-4 bg-white/80 px-6 py-3 rounded-full shadow-sm border border-gray-100">
                <span className="font-semibold text-gray-700">Hi, {session.user?.name}</span>
                <button onClick={() => signOut()} className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition">
                  Sign out <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </header>

        {session ? (
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className={`transition-all duration-700 ease-in-out ${result ? 'md:col-span-4' : 'md:col-span-8 md:col-start-3'}`}>
              <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium animate-in fade-in">
                  {error}
                </div>
              )}
            </div>

            {result && (
              <div className="md:col-span-8 w-full">
                <AssistantUI data={result} />
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -z-10"></div>
            
            <div className="text-center mb-8">
              <ShieldCheck className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-2">Sign in to access your personalized election journey.</p>
            </div>

            {authError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium text-center">
                {authError}
              </div>
            )}

            <form 
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setAuthError('');
                const res = await signIn('credentials', { email, password, redirect: false });
                if (res?.error) {
                  setAuthError("Invalid email or password");
                }
              }}
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500" /> Email
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="demo@example.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-500" /> Password
                </label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Sign In with Email
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <hr className="w-full border-gray-200" />
              <span className="p-2 text-gray-400 text-sm font-semibold">OR</span>
              <hr className="w-full border-gray-200" />
            </div>

            <button 
              onClick={() => signIn("google")} 
              className="mt-6 w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl border border-gray-200 shadow-sm transition-all flex items-center justify-center gap-3"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </div>
        )}
      </main>
      
      <footer className="text-center py-8 text-gray-400 text-sm mt-12">
        <p>© {new Date().getFullYear()} ElectionIQ. Built for Indian Citizens.</p>
      </footer>
    </div>
  );
}
