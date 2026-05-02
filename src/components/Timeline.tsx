"use client";

import React from 'react';
import { CheckCircle2, Clock, CalendarDays } from 'lucide-react';

interface TimelineStep {
  phase: string;
  status: string;
  date?: string;
}

interface TimelineProps {
  timeline: TimelineStep[];
}

export default function Timeline({ timeline }: TimelineProps) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100 mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-indigo-600" />
        Your Election Journey Timeline
      </h3>
      
      <div className="relative border-l-2 border-indigo-200 ml-3 md:ml-4 space-y-8">
        {timeline.map((step, index) => {
          const isComplete = step.status.toLowerCase() === 'complete' || step.status.toLowerCase() === 'completed';
          
          return (
            <div key={index} className="relative pl-6 sm:pl-8 group">
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors duration-300 ${isComplete ? 'bg-green-500' : 'bg-indigo-400 group-hover:bg-indigo-600'}`}>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                  <h4 className="text-lg font-bold text-gray-800">{step.phase}</h4>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    isComplete 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {isComplete ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {step.status}
                  </span>
                </div>
                {step.date && (
                  <p className="text-sm text-gray-500 font-medium">{step.date}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
