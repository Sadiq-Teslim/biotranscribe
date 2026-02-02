import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Dna, FileText, Database, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; delay: number }> = ({ icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
    <div className="text-primary mb-6 bg-primary/5 w-14 h-14 rounded-2xl flex items-center justify-center ring-1 ring-primary/20">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </motion.div>
);

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-32 px-4">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-10 w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm text-slate-600 text-sm font-semibold mb-8"
          >
            <Sparkles size={14} className="text-secondary" />
            <span>Advanced Group 2 Project</span>
          </motion.div> */}
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[0.9]"
          >
            Decode the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Language of Life</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            An intelligent interface for the Central Dogma. Convert DNA to RNA and translate genetic sequences into proteins with real-time visualization.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              to="/translate"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-slate-900 rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/25 hover:-translate-y-1"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center gap-2">
                Start Translating <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              to="/history"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-1"
            >
              View History
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            delay={0.2}
            icon={<Dna size={28} />}
            title="Transcription"
            desc="Seamless conversion of DNA strands into messenger RNA (mRNA). Watch as Thymine transforms into Uracil in real-time."
          />
          <FeatureCard 
            delay={0.4}
            icon={<FileText size={28} />}
            title="Translation"
            desc="Instant decoding of mRNA triplets into amino acid chains. Visualize the codon-to-protein mapping with precision."
          />
          <FeatureCard 
            delay={0.6}
            icon={<Database size={28} />}
            title="AI Analysis"
            desc="Leverage Google Gemini to predict protein structure, function, and physicochemical properties from your sequences."
          />
        </div>
      </section>
    </div>
  );
};