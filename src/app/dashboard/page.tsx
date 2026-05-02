"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, User, Upload, FileText, CheckCircle, ClipboardList, MapPin, Calendar, Loader2 } from 'lucide-react';
import { db, storage } from '@/utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({ fullName: '', dob: '', state: '', address: '', phone: '', age: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [docSubmitted, setDocSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'documents'>('details');

  // Load saved profile from Firebase (fallback to localStorage)
  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.email) return;

      try {
        // 1. Try Firebase first
        const docRef = doc(db, "users", session.user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(prev => ({ ...prev, ...docSnap.data() }));
        } else {
          // 2. Fallback to localStorage
          const saved = localStorage.getItem('electioniq_profile');
          if (saved) {
            const parsed = JSON.parse(saved);
            setFormData(prev => ({ ...prev, ...parsed }));
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
    
    if (status === 'authenticated') {
      loadProfile();
    }
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">
          <LayoutDashboard className="w-14 h-14 text-indigo-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Access Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to access your personal election dashboard.</p>
          <button onClick={() => router.push('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">
            Go to Home & Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-bl-full"></div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-indigo-200 text-sm font-medium">Welcome back</p>
              <h1 className="text-3xl font-extrabold">{session.user?.name}</h1>
              <p className="text-indigo-200 text-sm">{session.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/60 p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'details' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            <ClipboardList className="w-4 h-4" /> My Details
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'documents' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            <Upload className="w-4 h-4" /> Documents
          </button>
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-500" /> Personal Details
            </h2>
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Details Saved!</h3>
                <p className="text-gray-500">Your voter profile has been updated successfully.</p>
              </div>
            ) : (
                <form 
                  onSubmit={async (e) => { 
                    e.preventDefault(); 
                    if (!session?.user?.email) return;
                    setIsSaving(true);
                    try {
                      // Save to Firestore
                      await setDoc(doc(db, "users", session.user.email), {
                        ...formData,
                        updatedAt: new Date().toISOString()
                      }, { merge: true });
                      
                      // Also sync to localStorage
                      localStorage.setItem('electioniq_profile', JSON.stringify(formData));
                      setSubmitted(true);
                    } catch (err) {
                      console.error("Error saving profile:", err);
                    } finally {
                      setIsSaving(false);
                    }
                  }} 
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-indigo-400" /> Full Name
                      </label>
                      <input
                        type="text" required value={formData.fullName}
                        onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                        placeholder="As per Aadhaar/PAN"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-400" /> Date of Birth
                      </label>
                      <input
                        type="date" required value={formData.dob}
                        onChange={e => setFormData(p => ({ ...p, dob: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-400" /> State / UT
                      </label>
                      <input
                        type="text" required value={formData.state}
                        onChange={e => setFormData(p => ({ ...p, state: e.target.value }))}
                        placeholder="e.g. Maharashtra"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-gray-700">Phone Number</label>
                      <input
                        type="tel" value={formData.phone}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-gray-700">Residential Address</label>
                    <textarea
                      required value={formData.address}
                      onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                      placeholder="Full address for voter registration"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm resize-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save My Details
                  </button>
                </form>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-500" /> Upload Documents
            </h2>
            <p className="text-gray-500 text-sm mb-6">Upload your ID proof for voter registration assistance. Accepted: Aadhaar, PAN, Passport.</p>

            <div
              className="border-2 border-dashed border-indigo-200 rounded-2xl p-10 text-center bg-indigo-50/50 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer mb-6"
              onClick={() => document.getElementById('doc-upload')?.click()}
            >
              <FileText className="w-14 h-14 text-indigo-300 mx-auto mb-3" />
              {selectedFile ? (
                <>
                  <p className="text-lg font-bold text-indigo-600 mb-1">{selectedFile.name}</p>
                  <p className="text-sm text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 font-semibold mb-1">Click to upload your document</p>
                  <p className="text-sm text-gray-400">PDF, JPG, PNG — Max 5MB</p>
                </>
              )}
              <input id="doc-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
            </div>

            <button
              onClick={async () => {
                if (!selectedFile || !session?.user?.email) return;
                setIsUploading(true);
                try {
                  const storageRef = ref(storage, `documents/${session.user.email}/${selectedFile.name}`);
                  await uploadBytes(storageRef, selectedFile);
                  const downloadURL = await getDownloadURL(storageRef);
                  
                  // Save file metadata to Firestore
                  await setDoc(doc(db, "users", session.user.email), {
                    documentUrl: downloadURL,
                    documentName: selectedFile.name,
                    documentUploadedAt: new Date().toISOString()
                  }, { merge: true });
                  
                  setDocSubmitted(true);
                } catch (err) {
                  console.error("Error uploading document:", err);
                } finally {
                  setIsUploading(false);
                }
              }}
              disabled={!selectedFile || isUploading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {docSubmitted ? '✅ Document Submitted!' : 'Submit Document'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
