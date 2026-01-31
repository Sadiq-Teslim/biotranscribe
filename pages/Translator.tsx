import React, { useState } from 'react';
import { SequenceType, AminoAcid } from '../types';
import { processInput } from '../services/bioService';
import { SequenceVisualizer } from '../components/SequenceVisualizer';
import { analyzeProtein } from '../services/geminiService';
import { saveRecord } from '../services/storageService';
import { Play, RotateCcw, Save, Sparkles, AlertCircle, Copy, Dna, ArrowDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Translator: React.FC = () => {
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [inputType, setInputType] = useState<SequenceType>(SequenceType.DNA);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  
  const [result, setResult] = useState<{
    originalSequence: string;
    rnaSequence: string;
    proteinSequence: AminoAcid[];
  } | null>(null);

  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Handle translation
  const handleTranslate = () => {
    setError(null);
    setResult(null);
    setAiAnalysis(null);
    setIsSaved(false);

    try {
      const res = processInput(input, inputType);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle AI analysis
  const handleAnalyze = async () => {
    if (!result) return;
    setIsAnalyzing(true);
    const proteinString = result.proteinSequence.map(p => p.code).join('');
    const analysis = await analyzeProtein(proteinString, name);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  // Handle Save
  const handleSave = () => {
    if (!result) return;
    saveRecord({
      name: name || `Sequence ${new Date().toLocaleTimeString()}`,
      type: inputType,
      inputSequence: result.originalSequence,
      rnaSequence: result.rnaSequence,
      proteinSequenceString: result.proteinSequence.map(p => p.code).join(''),
      aiAnalysis: aiAnalysis || undefined
    });
    setIsSaved(true);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Dna size={18} />
              </div>
              Input Sequence
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hemoglobin Beta Chain"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sequence Type</label>
                <div className="flex bg-slate-50 p-1.5 rounded-xl">
                  {Object.values(SequenceType).map((type) => (
                    <button
                      key={type}
                      onClick={() => setInputType(type)}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                        inputType === type 
                          ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Raw Sequence 
                </label>
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste sequence (A, T, G, C)..."
                    className="w-full h-48 px-4 py-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none text-slate-600 leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-mono bg-white px-2 py-1 rounded border border-slate-100">
                    {input.replace(/\s/g, '').length} bp
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleTranslate}
                  disabled={!input.trim()}
                  className="flex-1 bg-primary hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Play size={18} fill="currentColor" /> Translate
                </button>
                <button
                  onClick={() => { setInput(''); setInputType(SequenceType.DNA); setResult(null); setError(null); setIsSaved(false); setAiAnalysis(null); }}
                  className="px-4 bg-white border border-slate-200 text-slate-500 hover:text-accent hover:border-accent rounded-xl transition-colors"
                  aria-label="Reset"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-6"
              >
                {/* Visualization Card */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Translation Result</h2>
                      <p className="text-slate-500 text-sm mt-1">Successfully decoded {result.proteinSequence.length} codons</p>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={handleSave}
                         disabled={isSaved}
                         className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${
                           isSaved 
                             ? 'bg-primary/5 text-primary border-primary/20' 
                             : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                         }`}
                       >
                         {isSaved ? <Check size={16} /> : <Save size={16} />} {isSaved ? 'Saved to History' : 'Save Result'}
                       </button>
                    </div>
                  </div>

                  <SequenceVisualizer 
                    rnaSequence={result.rnaSequence} 
                    proteinSequence={result.proteinSequence} 
                  />

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* Raw Output Cards */}
                     {[
                       { label: `Input (${inputType})`, val: result.originalSequence, id: 'orig' },
                       { label: 'Protein Sequence', val: result.proteinSequence.map(p => p.code).join(''), id: 'prot' }
                     ].map((item) => (
                       <div key={item.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-colors">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                            <button 
                              onClick={() => copyToClipboard(item.val, item.id)} 
                              className="text-slate-400 hover:text-primary transition-colors"
                            >
                              {copied === item.id ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                          <p className="font-mono text-xs break-all text-slate-600 leading-relaxed max-h-24 overflow-y-auto">
                            {item.val}
                          </p>
                       </div>
                     ))}
                  </div>
                </div>

                {/* AI Analysis Card */}
                <div className="relative overflow-hidden bg-emerald-950 text-white p-8 rounded-3xl shadow-2xl shadow-emerald-900/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <Sparkles size={20} className="text-accent" />
                          Gemini AI Analysis
                        </h3>
                        <p className="text-emerald-200/70 text-sm mt-1">Deep learning insights for protein structure & function.</p>
                      </div>
                      {!aiAnalysis && (
                        <button 
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/50 disabled:opacity-50 disabled:shadow-none"
                        >
                          {isAnalyzing ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              Processing...
                            </span>
                          ) : 'Generate Analysis'}
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {aiAnalysis && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="prose prose-invert prose-sm max-w-none bg-white/5 p-6 rounded-2xl border border-white/10"
                        >
                          <pre className="whitespace-pre-wrap font-sans text-emerald-100 leading-relaxed">{aiAnalysis}</pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50"
              >
                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                  <ArrowDown size={32} className="text-slate-300 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Ready to Transcribe</h3>
                <p className="text-slate-500 max-w-sm mt-2">Enter a DNA or RNA sequence on the left panel to begin the visualization process.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};