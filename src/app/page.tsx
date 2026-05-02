"use client";

import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import AssistantUI from '@/components/AssistantUI';
import ElectionNews from '@/components/ElectionNews';
import UserPanel from '@/components/UserPanel';
import { UserContext } from '@/utils/eligibility';
import { AssistantResponse } from '@/ai/vertex';
import { ShieldCheck, Vote } from 'lucide-react';

export default function Home() {
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
        </header>

        {/* Main content — always visible, no auth required */}
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
            <div className="md:col-span-8 w-full space-y-0">
              <AssistantUI data={result} />
              {/* Auth + Document Upload panel appears inside results */}
              <UserPanel />
            </div>
          )}
        </div>

        {/* Election News — always visible */}
        <ElectionNews />
      </main>

      <footer className="text-center py-8 text-gray-400 text-sm mt-12">
        <p>© {new Date().getFullYear()} ElectionIQ. Built for Indian Citizens.</p>
      </footer>
    </div>
  );
}
