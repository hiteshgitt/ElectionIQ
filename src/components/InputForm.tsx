"use client";

import React, { useState } from 'react';
import { UserContext } from '@/utils/eligibility';
import { Send, MapPin, Calendar, UserCheck } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserContext) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [age, setAge] = useState<string>('');
  const [isFirstTimeVoter, setIsFirstTimeVoter] = useState<boolean>(true);
  const [state, setState] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age && state) {
      onSubmit({ age, isFirstTimeVoter, state });
    }
  };

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir"
  ].sort();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <UserCheck className="w-6 h-6 text-blue-600" />
        Your Details
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            Age
          </label>
          <input
            type="number"
            min="1"
            max="120"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            State / UT
          </label>
          <select
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="" disabled>Select your State</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
          <label className="text-sm font-semibold text-gray-700 cursor-pointer select-none" htmlFor="firstTimeVoter">
            Are you a first-time voter?
          </label>
          <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
            <input 
              type="checkbox" 
              name="toggle" 
              id="firstTimeVoter" 
              checked={isFirstTimeVoter}
              onChange={(e) => setIsFirstTimeVoter(e.target.checked)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-300 checked:translate-x-6 checked:border-blue-500"
              style={{ top: 0, bottom: 0, margin: 'auto' }}
            />
            <label 
              htmlFor="firstTimeVoter" 
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${isFirstTimeVoter ? 'bg-blue-500' : 'bg-gray-300'}`}
            ></label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Check Eligibility <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
