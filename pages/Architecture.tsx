import React from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Layout, ShieldCheck, GitBranch } from 'lucide-react';

export const Architecture: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">System Architecture</h1>
        <p className="text-lg text-slate-500 max-w-3xl">
          Technical documentation outlining the frontend design, backend specifications, and database schema for the BioTranscribe system.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
            <Layout size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Frontend</h3>
          <p className="text-sm text-slate-500 mb-4">React + TypeScript</p>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>• Tailwind CSS Styling</li>
            <li>• Framer Motion API</li>
            <li>• Local Storage State</li>
            <li>• Google Gemini Integration</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-700 mb-4">
            <Server size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Backend (Spec)</h3>
          <p className="text-sm text-slate-500 mb-4">Python (Flask/FastAPI)</p>
          <ul className="text-sm text-slate-600 space-y-2">
             <li>• RESTful API Endpoints</li>
             <li>• Sequence Validation Logic</li>
             <li>• BioPython Integration</li>
             <li>• AI Model Proxy</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 mb-4">
            <Database size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Database</h3>
          <p className="text-sm text-slate-500 mb-4">MySQL</p>
          <ul className="text-sm text-slate-600 space-y-2">
             <li>• User Management Table</li>
             <li>• History Records Table</li>
             <li>• Analysis Results Table</li>
             <li>• CRUD Operations</li>
          </ul>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <GitBranch className="text-primary" /> Entity Relationship Diagram (ERD)
          </h2>
          <div className="bg-slate-900 rounded-3xl p-8 overflow-hidden relative">
             <div className="font-mono text-sm text-emerald-400 space-y-4">
                <div className="border border-emerald-800 p-4 rounded bg-emerald-950/50">
                   <div className="font-bold text-white border-b border-emerald-800 pb-2 mb-2">Table: translation_history</div>
                   <div className="grid grid-cols-2 gap-4">
                      <span>id</span> <span className="text-slate-400">UUID (PK)</span>
                      <span>sequence_name</span> <span className="text-slate-400">VARCHAR(255)</span>
                      <span>input_sequence</span> <span className="text-slate-400">TEXT</span>
                      <span>protein_sequence</span> <span className="text-slate-400">TEXT</span>
                      <span>analysis_data</span> <span className="text-slate-400">JSON</span>
                      <span>created_at</span> <span className="text-slate-400">TIMESTAMP</span>
                   </div>
                </div>
             </div>
          </div>
        </section>

        <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
           <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="text-accent" /> CRUD Implementation
           </h2>
           <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                 <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">CREATE</span>
                 <p className="mt-2 text-sm text-slate-600">POST /api/translate - Processes and saves new sequences.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">READ</span>
                 <p className="mt-2 text-sm text-slate-600">GET /api/history - Retrieves past translation records.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                 <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">UPDATE</span>
                 <p className="mt-2 text-sm text-slate-600">PUT /api/history/:id - Modifies sequence metadata.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                 <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">DELETE</span>
                 <p className="mt-2 text-sm text-slate-600">DELETE /api/history/:id - Removes a record permanently.</p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};