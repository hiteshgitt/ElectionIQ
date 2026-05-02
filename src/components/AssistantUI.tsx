"use client";

import React from 'react';
import { AssistantResponse } from '@/ai/vertex';
import Timeline from './Timeline';
import { CheckCircle, AlertTriangle, Lightbulb, Info, ArrowRight } from 'lucide-react';

interface AssistantUIProps {
  data: AssistantResponse;
}

export default function AssistantUI({ data }: AssistantUIProps) {
  const isEligible = !data.eligibility.toLowerCase().includes("not eligible");

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Eligibility Card */}
      <div className={`p-6 rounded-2xl shadow-lg border relative overflow-hidden ${isEligible ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${isEligible ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
            {isEligible ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${isEligible ? 'text-green-800' : 'text-orange-800'}`}>
              {isEligible ? "You're Eligible!" : "Not Yet Eligible"}
            </h2>
            <p className={`text-lg ${isEligible ? 'text-green-700' : 'text-orange-700'}`}>
              {data.eligibility}
            </p>
          </div>
        </div>
      </div>

      {/* Explanation Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          What you need to know
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          {data.explanation}
        </p>
      </div>

      {/* Conditional Rendering for Eligible Users */}
      {isEligible && data.steps && data.steps.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-indigo-500" />
            Your Action Plan
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {data.steps.map((step, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">{step.title}</h4>
                </div>
                <p className="text-gray-600 ml-11">{step.description}</p>
              </div>
            ))}
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
