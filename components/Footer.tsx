import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 opacity-50">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
        </div>
        <p className="mb-2 font-medium text-slate-900">Group 2 Project</p>
        <p className="text-sm text-slate-500">RNA Transcription & Protein Translation System</p>
      </div>
    </footer>
  );
};