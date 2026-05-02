"use client";

import React from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

const NEWS = [
  {
    title: "ECI Announces New Voter Registration Drive Across All States",
    summary: "The Election Commission of India has launched a nationwide campaign to register new voters aged 18+ ahead of the upcoming elections.",
    time: "2 hours ago",
    tag: "Registration",
    url: "https://eci.gov.in",
  },
  {
    title: "Voter ID Linking with Aadhaar: What You Need to Know",
    summary: "The government has made it easier to link your Voter ID with Aadhaar online via the NVSP portal. Here's a step-by-step guide.",
    time: "5 hours ago",
    tag: "Voter ID",
    url: "https://nvsp.in",
  },
  {
    title: "Mobile Voting App 'VoterHelpline' Updated for 2024 Elections",
    summary: "The ECI's official mobile app now supports real-time polling booth finder, status tracking, and document upload features.",
    time: "1 day ago",
    tag: "Technology",
    url: "https://eci.gov.in",
  },
  {
    title: "Supreme Court Upholds 18 as Minimum Voting Age, Dismisses Petition",
    summary: "The Supreme Court dismissed a petition seeking to lower the minimum voting age to 16, reaffirming the constitutional provision.",
    time: "2 days ago",
    tag: "Legal",
    url: "https://eci.gov.in",
  },
  {
    title: "How to Check Your Name on the Electoral Roll in 2 Minutes",
    summary: "Visit electoralsearch.eci.gov.in and enter your details to instantly verify if your name appears on the voter list.",
    time: "3 days ago",
    tag: "Guide",
    url: "https://electoralsearch.eci.gov.in",
  },
];

const TAG_COLORS: Record<string, string> = {
  Registration: "bg-green-100 text-green-700",
  "Voter ID": "bg-blue-100 text-blue-700",
  Technology: "bg-purple-100 text-purple-700",
  Legal: "bg-orange-100 text-orange-700",
  Guide: "bg-indigo-100 text-indigo-700",
};

export default function ElectionNews() {
  return (
    <div className="mt-16 w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-xl">
          <Newspaper className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Latest Election News</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {NEWS.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/90 backdrop-blur rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${TAG_COLORS[item.tag] || 'bg-gray-100 text-gray-600'}`}>
                {item.tag}
              </span>
              <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="font-bold text-gray-800 leading-snug group-hover:text-indigo-700 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{item.summary}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {item.time}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
