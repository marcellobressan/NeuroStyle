import React from 'react';
import { X, Brain, Eye, Hammer, BookOpen, Repeat, AlertTriangle, Compass, Target } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Como Adultos Realmente Aprendem</h2>
            <p className="text-sm text-slate-500">Andragogia & Teoria de Kolb Revisitada</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="prose prose-slate max-w-none">
            
            {/* The Myth Section */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-800 m-0">O Mito do "Estilo Único"</h3>
                  <p className="text-red-700 text-sm mt-1 leading-relaxed">
                    A ciência mostra que tentar aprender <strong>apenas</strong> no seu "estilo preferido" (ex: "sou visual, só assisto vídeos") não melhora o desempenho. Isso é um neuromito.
                    O segredo não é o "encaixe", mas a <strong>flexibilidade</strong>: a capacidade de usar todas as formas de aprendizado conforme o problema exige.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-8">
              O modelo de Kolb não serve para rotular você, mas para mostrar sua "Zona de Conforto". 
              Para aprender algo complexo e não esquecer (vencendo a curva do esquecimento), você precisa percorrer o ciclo completo.
            </p>

            {/* Andragogy Principles */}
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-600" />
              Princípios da Andragogia (Ensino para Adultos)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-2">Autonomia</div>
                <p className="text-xs text-slate-600">Adultos precisam ter controle e autodireção sobre o que aprendem.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-2">Experiência</div>
                <p className="text-xs text-slate-600">Sua bagagem de vida é a base. O aprendizado deve conectar com o que você já sabe.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-2">Resolução de Problemas</div>
                <p className="text-xs text-slate-600">O foco não é memorizar conteúdo, mas resolver problemas reais e imediatos.</p>
              </div>
            </div>

            {/* The Cycle */}
            <div className="bg-indigo-50 rounded-xl p-6 mb-8 border border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <Repeat className="w-5 h-5" />
                O Ciclo Real (Não Pare no Seu Estilo!)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
                    <div className="bg-pink-100 p-1.5 rounded text-pink-600"><Brain className="w-4 h-4" /></div>
                    1. Sentir (Experiência)
                  </div>
                  <p className="text-sm text-slate-600">Mergulhar na situação.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
                    <div className="bg-blue-100 p-1.5 rounded text-blue-600"><Eye className="w-4 h-4" /></div>
                    2. Observar (Reflexão)
                  </div>
                  <p className="text-sm text-slate-600">Analisar o que aconteceu.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
                    <div className="bg-amber-100 p-1.5 rounded text-amber-600"><BookOpen className="w-4 h-4" /></div>
                    3. Pensar (Conceituação)
                  </div>
                  <p className="text-sm text-slate-600">Entender a lógica por trás.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
                    <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Hammer className="w-4 h-4" /></div>
                    4. Fazer (Aplicação)
                  </div>
                  <p className="text-sm text-slate-600">Testar na prática real.</p>
                </div>
              </div>
              <div className="mt-4 text-center text-sm font-medium text-indigo-800 bg-indigo-100 p-2 rounded">
                Dica: Se você "trava" em um ponto, force-se a ir para o próximo estágio do ciclo!
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};