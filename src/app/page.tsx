"use client";

import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import AssistantUI from '@/components/AssistantUI';
import { UserContext } from '@/utils/eligibility';
import { AssistantResponse } from '@/ai/vertex';
import { ShieldCheck, Vote, LogIn, LogOut } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
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

          <div className="mt-6 flex justify-center">
            {session ? (
              <div className="flex items-center gap-4 bg-white/80 px-6 py-3 rounded-full shadow-sm border border-gray-100">
                <span className="font-semibold text-gray-700">Hi, {session.user?.name}</span>
                <button onClick={() => signOut()} className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition">
                  Sign out <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => signIn("google")} 
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-8 rounded-full shadow-md border border-gray-200 transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Sign in with Google to Start
              </button>
            )}
          </div>
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
          <div className="text-center text-gray-500 mt-10 p-8 bg-white/50 backdrop-blur rounded-2xl border border-gray-100 max-w-2xl mx-auto shadow-sm">
            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Secure Access Required</h2>
            <p>Please sign in with your Google account to access your personalized election journey and our smart AI assistant.</p>
          </div>
        )}
      </main>
      
      <footer className="text-center py-8 text-gray-400 text-sm mt-12">
        <p>© {new Date().getFullYear()} ElectionIQ. Built for Indian Citizens.</p>
      </footer>
    </div>
  );
}
