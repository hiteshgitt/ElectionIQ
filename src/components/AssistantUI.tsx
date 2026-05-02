"use client";

import React, { useState } from 'react';
import { AssistantResponse } from '@/ai/vertex';
import Timeline from './Timeline';
import { CheckCircle, AlertTriangle, Lightbulb, Info, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface AssistantUIProps {
  data: AssistantResponse;
  profile?: { age?: string, state?: string, firstTime?: boolean };
}

export default function AssistantUI({ data, profile }: AssistantUIProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isEligible = !data.eligibility.toLowerCase().includes("not eligible");

  // Dynamically update eligibility text based on profile if available
  let eligibilityText = data.eligibility;
  if (profile?.age && profile?.state) {
    // If the text contains age/state patterns, try to update them
    // Example: "As a 34-year-old citizen living in Maharashtra..."
    eligibilityText = eligibilityText
      .replace(/\d+-year-old/g, `${profile.age}-year-old`)
      .replace(/living in [^,.]+/g, `living in ${profile.state}`);
  }

  return (
    <div 
      className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
      role="status"
      aria-live="polite"
    >
      
      {/* Eligibility Card */}
      <div className={`p-6 rounded-2xl shadow-lg border-2 relative overflow-hidden ${isEligible ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${isEligible ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {isEligible ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${isEligible ? 'text-green-900' : 'text-orange-900'}`}>
              {isEligible ? "You're Eligible!" : "Not Yet Eligible"}
            </h2>
            <p className={`text-lg font-medium ${isEligible ? 'text-green-800' : 'text-orange-800'}`}>
              {eligibilityText}
            </p>
          </div>
        </div>
      </div>

      {/* Explanation Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          What you need to know
        </h3>
        <p className="text-gray-800 leading-relaxed text-lg font-medium">
          {data.explanation}
        </p>
        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 mt-6">
          <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" /> Why your vote matters
          </h4>
          <p className="text-xs text-indigo-800 leading-relaxed">
            Voting is your fundamental right and power to shape the future of our democracy. 
            By participating, you ensure that your voice is heard in the legislative process 
            and contribute to the collective decision-making of the nation.
          </p>
        </div>
      </div>

      {/* Conditional Rendering for Eligible Users - Stepper UI */}
      {isEligible && data.steps && data.steps.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-indigo-500" />
              Your Action Plan
            </h3>
            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Step {currentStep + 1} of {data.steps.length}
            </span>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 border border-indigo-100 min-h-[200px] flex flex-col justify-center transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                {currentStep + 1}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-3">{data.steps[currentStep].title}</h4>
                <p className="text-gray-600 text-lg leading-relaxed">{data.steps[currentStep].description}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-700"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            
            <button 
              onClick={() => setCurrentStep(prev => Math.min(data.steps.length - 1, prev + 1))}
              disabled={currentStep === data.steps.length - 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
            >
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Timeline Visualization */}
      {isEligible && data.timeline && data.timeline.length > 0 && (
        <Timeline timeline={data.timeline} />
      )}

      {/* Tips Section */}
      {data.tips && data.tips.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100">
          <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Smart Tips
          </h3>
          <ul className="space-y-3">
            {data.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 font-medium">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
