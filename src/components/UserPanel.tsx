"use client";

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, LogIn, Mail, Lock, X } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function UserPanel() {
  const { data: session } = useSession();
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) setAuthError('Invalid credentials. Try any email and password.');
    else setShowAuth(false);
  };

  if (!session) {
    return (
      <div className="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <LogIn className="w-6 h-6 text-indigo-500" />
          <h3 className="text-lg font-bold text-gray-800">Save Your Journey & Submit Documents</h3>
        </div>
        <p className="text-gray-600 text-sm mb-5">
          Register or sign in to save your election journey, submit required documents, and get personalised reminders.
        </p>

        {!showAuth ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowAuth(true)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" /> Register / Sign In
            </button>
            <button
              onClick={() => signIn('google')}
              className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
              Continue with Google
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-5 border border-gray-200 relative">
            <button onClick={() => setShowAuth(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
            {authError && <p className="text-red-500 text-sm mb-3 font-medium">{authError}</p>}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password (any value for demo)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all text-sm">
                Sign In / Register
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <h3 className="text-lg font-bold text-gray-800">Welcome, {session.user?.name}! 👋</h3>
            <p className="text-sm text-gray-500">{session.user?.email}</p>
          </div>
        </div>
        <button onClick={() => signOut()} className="text-xs text-red-400 hover:text-red-600 font-semibold border border-red-200 px-3 py-1.5 rounded-lg transition-all">
          Sign Out
        </button>
      </div>

      {!submitted ? (
        <div>
          <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-500" /> Submit Your Voter Documents
          </h4>
          <p className="text-sm text-gray-500 mb-4">Upload your ID proof (Aadhaar / PAN / Passport) for voter registration assistance.</p>
          <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 text-center bg-white/60 hover:border-indigo-400 transition-colors cursor-pointer"
            onClick={() => document.getElementById('doc-upload')?.click()}>
            <FileText className="w-10 h-10 text-indigo-300 mx-auto mb-2" />
            {selectedFile ? (
              <p className="text-sm font-semibold text-indigo-600">{selectedFile.name}</p>
            ) : (
              <p className="text-sm text-gray-400">Click to upload your document (PDF, JPG, PNG)</p>
            )}
            <input id="doc-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
              onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
          <button
            onClick={() => selectedFile && setSubmitted(true)}
            disabled={!selectedFile}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md"
          >
            Submit Document
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
          <h4 className="text-xl font-bold text-gray-800 mb-2">Document Submitted!</h4>
          <p className="text-gray-500 text-sm">Your document has been received. Our team will review and send you an update on your registered email.</p>
        </div>
      )}
    </div>
  );
}
