import React from 'react';
import { motion } from 'framer-motion';
import { Dna, ArrowRight, FileText } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Biological Concepts</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Understanding the Central Dogma of Molecular Biology: From DNA to RNA to Protein.
        </p>
      </motion.div>

      <div className="space-y-16">
        {/* Section 1: Central Dogma */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
              <Dna size={14} /> The Central Dogma
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Flow of Genetic Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The central dogma of molecular biology explains the flow of genetic information within a biological system. It is often stated as "DNA makes RNA, and RNA makes protein".
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <span className="text-slate-600"><strong>Replication:</strong> DNA copies itself.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <span className="text-slate-600"><strong>Transcription:</strong> DNA is converted to mRNA.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                <span className="text-slate-600"><strong>Translation:</strong> mRNA is decoded into amino acids.</span>
              </li>
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <img 
              src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2000&auto=format&fit=crop" 
              alt="DNA Structure" 
              className="rounded-2xl w-full h-64 object-cover mb-6"
            />
            <div className="flex justify-between items-center text-sm font-mono text-slate-500">
              <span>DNA (Nucleus)</span>
              <ArrowRight size={16} />
              <span>RNA (Cytoplasm)</span>
              <ArrowRight size={16} />
              <span>Protein (Ribosome)</span>
            </div>
          </motion.div>
        </section>

        {/* Section 2: Transcription */}
        <section className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
          <div className="max-w-3xl mx-auto text-center">
             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-6 text-primary">
               <FileText size={24} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-4">Transcription: DNA to mRNA</h2>
             <p className="text-slate-600 leading-relaxed mb-8">
               Transcription is the first step of gene expression. During this process, the DNA sequence of a gene is copied into RNA.
               The main difference in the sequence is that the base <strong>Thymine (T)</strong> in DNA is replaced by <strong>Uracil (U)</strong> in RNA.
             </p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Adenine (A)', 'Cytosine (C)', 'Guanine (G)', 'Uracil (U)'].map((base) => (
                  <div key={base} className="bg-white p-4 rounded-xl border border-slate-200 font-bold text-slate-700 shadow-sm">
                    {base}
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Section 3: Translation */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
           <div className="order-2 md:order-1 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-16 py-2 bg-yellow-100 text-yellow-700 text-center rounded font-mono font-bold">AUG</div>
                    <ArrowRight className="text-slate-300" />
                    <div className="font-bold text-slate-700">Methionine (Start)</div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-16 py-2 bg-primary/10 text-primary text-center rounded font-mono font-bold">GGU</div>
                    <ArrowRight className="text-slate-300" />
                    <div className="font-bold text-slate-700">Glycine</div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-16 py-2 bg-slate-100 text-slate-500 text-center rounded font-mono font-bold">UAA</div>
                    <ArrowRight className="text-slate-300" />
                    <div className="font-bold text-slate-700">Stop Codon</div>
                 </div>
              </div>
           </div>
           <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                <FileText size={14} /> Protein Synthesis
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Translation: mRNA to Protein</h2>
              <p className="text-slate-600 leading-relaxed">
                Translation involves decoding the mRNA sequence into a polypeptide chain. The sequence is read in triplets called <strong>codons</strong>. 
                Each codon corresponds to a specific amino acid or a stop signal. The ribosome is the cellular machinery responsible for this synthesis.
              </p>
           </div>
        </section>
      </div>
    </div>
  );
};