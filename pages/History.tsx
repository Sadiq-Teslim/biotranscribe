import React, { useEffect, useState } from 'react';
import { HistoryRecord } from '../types';
import { fetchHistoryAsync, deleteRecord } from '../services/storageService';
import { Search, Trash2, Calendar, Dna, FileText, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const History: React.FC = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data asynchronously to support both LocalStorage and Python Backend
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchHistoryAsync();
      // Normalize data from backend (snake_case to camelCase) and ensure all fields exist
      const normalizedData = data.map((record: any) => ({
        id: record.id || '',
        name: record.name || 'Untitled',
        date: record.date || new Date().toISOString(),
        type: record.type || 'DNA',
        inputSequence: record.input_sequence || record.inputSequence || '',
        rnaSequence: record.rna_sequence || record.rnaSequence || '',
        proteinSequenceString: record.protein_sequence || record.proteinSequenceString || '',
        aiAnalysis: record.ai_analysis || record.aiAnalysis || null,
      }));
      setRecords(normalizedData);
    } catch (error) {
      console.error('Error loading history:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, deleteRecord should probably return a promise
    deleteRecord(id);
    // Wait a bit for DB update or optimistically update UI
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    // Optionally reload to ensure sync
    // await loadData();
  };

  const filteredRecords = records.filter(r => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (r.name || '').toLowerCase().includes(searchLower) ||
      (r.rnaSequence || '').toLowerCase().includes(searchLower) ||
      (r.proteinSequenceString || '').toLowerCase().includes(searchLower)
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Translation History</h1>
          <p className="text-slate-500 mt-2">Access your saved sequences and AI insights.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm outline-none transition-all"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading history...</div>
        ) : (
        <AnimatePresence initial={false}>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <motion.div 
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => toggleExpand(record.id)}
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-5 overflow-hidden">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      record.type === 'DNA' 
                        ? 'bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/20' 
                        : 'bg-yellow-50 text-yellow-600 border-yellow-100 group-hover:bg-yellow-100'
                    }`}>
                      {record.type === 'DNA' ? <Dna size={22} /> : <FileText size={22} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate text-lg">{record.name}</h3>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1">
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(record.date).toLocaleDateString()}</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{(record.proteinSequenceString || '').length} AA</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => handleDelete(record.id, e)}
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className={`transition-transform duration-300 ${expandedId === record.id ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} className="text-slate-400" />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === record.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-slate-50/50"
                    >
                      <div className="p-6 grid gap-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Original Sequence</h4>
                            <div className="font-mono text-xs break-all bg-white p-4 rounded-xl border border-slate-200 text-slate-600 shadow-sm">
                              {record.inputSequence || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Protein Sequence</h4>
                            <div className="font-mono text-xs break-all bg-white p-4 rounded-xl border border-slate-200 text-primary shadow-sm">
                              {record.proteinSequenceString || 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        {record.aiAnalysis && (
                          <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                             <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">AI Analysis</h4>
                             <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                               {record.aiAnalysis}
                             </pre>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Search className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">No records found. Start translating!</p>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>
    </div>
  );
};