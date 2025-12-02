import React from 'react';
import { X, Brain, Eye, Hammer, BookOpen, Repeat } from 'lucide-react';

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
            <h2 className="text-2xl font-bold text-slate-900">Teoria da Aprendizagem Experiencial</h2>
            <p className="text-sm text-slate-500">Desenvolvida por David Kolb (1984)</p>
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
            <p className="text-slate-600 leading-relaxed mb-8">
              A teoria de Kolb sugere que a aprendizagem é um processo contínuo baseado na experiência. 
              Para aprender efetivamente, precisamos passar por um ciclo de quatro estágios. Nossas preferências 
              em como navegamos por esses estágios definem nosso <strong>Estilo de Aprendizagem</strong>.
            </p>

            {/* The Cycle */}
            <div className="bg-indigo-50 rounded-xl p-6 mb-8 border border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <Repeat className="w-5 h-5" />
                O Ciclo de Aprendizagem
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
                    <div className="bg-pink-100 p-1.5 rounded text-pink-600"><Brain className="w-4 h-4" /></div>
                    Experiência Concreta (Sentir)
                  </div>
                  <p className="text-sm text-slate-600">Envolver-se em novas experiências.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
                    <div className="bg-blue-100 p-1.5 rounded text-blue-600"><Eye className="w-4 h-4" /></div>
                    Observação Reflexiva (Observar)
                  </div>
                  <p className="text-sm text-slate-600">Observar e refletir sobre a experiência.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
                    <div className="bg-amber-100 p-1.5 rounded text-amber-600"><BookOpen className="w-4 h-4" /></div>
                    Conceituação Abstrata (Pensar)
                  </div>
                  <p className="text-sm text-slate-600">Criar teorias e lógica para explicar observações.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
                    <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><Hammer className="w-4 h-4" /></div>
                    Experimentação Ativa (Fazer)
                  </div>
                  <p className="text-sm text-slate-600">Usar teorias para resolver problemas.</p>
                </div>
              </div>
            </div>

            {/* The Styles */}
            <h3 className="text-xl font-bold text-slate-800 mb-4">Os 4 Estilos de Aprendizagem</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-indigo-500 pl-4 py-1">
                <h4 className="font-bold text-slate-900">Divergente (Sentir + Observar)</h4>
                <p className="text-sm text-slate-600">
                  Pessoas que preferem observar situações de diferentes pontos de vista. São imaginativas, emotivas e ótimas em brainstorming.
                </p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4 py-1">
                <h4 className="font-bold text-slate-900">Assimilador (Pensar + Observar)</h4>
                <p className="text-sm text-slate-600">
                  Focam em ideias e conceitos abstratos. A lógica e a precisão são mais importantes que a aplicação prática ou pessoas.
                </p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-1">
                <h4 className="font-bold text-slate-900">Convergente (Pensar + Fazer)</h4>
                <p className="text-sm text-slate-600">
                  Excelentes em encontrar usos práticos para ideias e teorias. Preferem lidar com tarefas técnicas e problemas lógicos.
                </p>
              </div>
              <div className="border-l-4 border-pink-500 pl-4 py-1">
                <h4 className="font-bold text-slate-900">Acomodador (Sentir + Fazer)</h4>
                <p className="text-sm text-slate-600">
                  Aprendem "colocando a mão na massa". Gostam de novos desafios, confiam na intuição e adaptam-se bem a mudanças.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};