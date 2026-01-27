import React from 'react';
import { AminoAcid } from '../types';
import { ArrowRight, Dna, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  rnaSequence: string;
  proteinSequence: AminoAcid[];
}

export const SequenceVisualizer: React.FC<Props> = ({ rnaSequence, proteinSequence }) => {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="min-w-max pr-8">
          {/* Labels */}
          <div className="flex mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest pl-28">
            <span className="w-12 block text-center">Codon</span>
            <span className="w-12 block text-center ml-1">Flow</span>
            <span className="w-12 block text-center ml-1">AA</span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Header Column */}
            <div className="absolute left-0 w-24 flex flex-col gap-8 pt-3 z-10 bg-gradient-to-r from-white via-white to-transparent pl-4">
              <div className="flex items-center gap-2 text-yellow-600 font-bold font-mono text-sm">
                 <Dna size={16} /> mRNA
              </div>
              <div className="flex items-center gap-2 text-primary font-bold font-mono text-sm">
                 <Activity size={16} /> Protein
              </div>
            </div>

            {/* Sequence Flow */}
            <div className="flex gap-2 pl-28">
              {proteinSequence.map((aa, idx) => (
                <motion.div 
                  key={`group-${idx}-${aa.codon}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center gap-3 group"
                >
                  {/* Codon */}
                  <div className="w-14 py-2 text-center bg-yellow-50/80 border border-yellow-200 rounded-lg text-yellow-700 font-mono text-sm font-semibold shadow-sm group-hover:border-yellow-400 transition-colors">
                    {aa.codon}
                  </div>

                  {/* Arrow */}
                  <div className="text-slate-300 group-hover:text-slate-400 transition-colors">
                    <ArrowRight size={14} className="rotate-90" />
                  </div>

                  {/* Amino Acid */}
                  <div className="relative">
                    <div 
                      className={`w-14 h-14 flex items-center justify-center rounded-xl font-bold shadow-md border-2 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg
                      ${aa.code === '*' 
                        ? 'bg-slate-100 text-slate-400 border-slate-200' 
                        : 'bg-white text-primary border-primary/20 shadow-primary/10'
                      }`}
                    >
                      <span className="text-lg">{aa.code}</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap shadow-xl">
                        {aa.name}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};