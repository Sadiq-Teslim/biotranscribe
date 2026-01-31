import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Translator } from './pages/Translator';
import { History } from './pages/History';
import { About } from './pages/About';
import { Architecture } from './pages/Architecture';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-slate-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/translate" element={<Translator />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route path="/architecture" element={<Architecture />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;