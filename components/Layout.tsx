import React, { useState } from 'react';
import { BrainCircuit, BookOpen } from 'lucide-react';
import { TheoryModal } from './TheoryModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
               <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">NeuroStyle</span>
          </div>
          <nav>
            <button 
              onClick={() => setIsTheoryOpen(true)}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors focus:outline-none"
            >
              Sobre a Teoria
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm">Baseado na metodologia de David Kolb</span>
          </div>
          <p className="text-xs text-center md:text-right">
            &copy; {new Date().getFullYear()} NeuroStyle. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <TheoryModal isOpen={isTheoryOpen} onClose={() => setIsTheoryOpen(false)} />
    </div>
  );
};