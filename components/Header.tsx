import React from 'react';
import { Dna, Activity, History, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className="relative px-4 py-2 rounded-full group transition-colors"
  >
    {active && (
      <motion.div
        layoutId="nav-pill"
        className="absolute inset-0 bg-primary/10 rounded-full"
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    <div className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${active ? 'text-primary' : 'text-slate-500 group-hover:text-slate-900'}`}>
      {icon}
      <span>{label}</span>
    </div>
  </Link>
);

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-4 z-50 px-4 mb-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-lg shadow-slate-200/20 rounded-2xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl text-white shadow-lg shadow-primary/25"
            >
              <Dna size={20} strokeWidth={2.5} />
            </motion.div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Bio<span className="text-primary">Transcribe</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" icon={<Home size={16} />} label="Home" active={location.pathname === '/'} />
            <NavLink to="/translate" icon={<Activity size={16} />} label="Translator" active={location.pathname === '/translate'} />
            <NavLink to="/history" icon={<History size={16} />} label="History" active={location.pathname === '/history'} />
          </nav>
          
          <div className="md:hidden">
             <Link to="/translate" className="p-2 text-primary bg-primary/10 rounded-lg">
               <Activity size={20} />
             </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};