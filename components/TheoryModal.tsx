import React, { useState } from 'react';
import { X, Brain, Eye, Hammer, BookOpen, Repeat, AlertTriangle, Compass, ArrowRight, GitMerge } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CYCLE_STAGES = [
  {
    id: 1,
    short: "Sentir",
    title: "Experiência Concreta",
    icon: Brain,
    color: "text-pink-600 bg-pink-100",
    border: "border-pink-200",
    description: "É o momento de se envolver totalmente em uma nova experiência sem preconceitos.",
    example: "Participar de uma simulação de vendas, um roleplay ou tentar consertar algo sem ler o manual.",
    action: "Mergulhar",
    connection: "A vivência gera dados brutos. Para aprender com ela, precisamos nos distanciar e analisar o que aconteceu.",
    nextStage: "Observação Reflexiva"
  },
  {
    id: 2,
    short: "Observar",
    title: "Observação Reflexiva",
    icon: Eye,
    color: "text-blue-600 bg-blue-100",
    border: "border-blue-200",
    description: "Pausar para revisar o que aconteceu. Olhar a experiência sob várias perspectivas.",
    example: "Discutir em grupo o que funcionou e o que falhou na simulação anterior.",
    action: "Refletir",
    connection: "A reflexão levanta perguntas ('Por que isso aconteceu?'). Precisamos de lógica e teoria para responder.",
    nextStage: "Conceituação Abstrata"
  },
  {
    id: 3,
    short: "Pensar",
    title: "Conceituação Abstrata",
    icon: BookOpen,
    color: "text-amber-600 bg-amber-100",
    border: "border-amber-200",
    description: "Criar teorias ou lógicas que expliquem as observações. Aprender com especialistas.",
    example: "Ler um livro sobre técnicas de negociação ou assistir a uma aula teórica para entender os princípios.",
    action: "Teorizar",
    connection: "A teoria por si só é abstrata. Para ser útil e consolidada, ela precisa ser validada na prática.",
    nextStage: "Experimentação Ativa"
  },
  {
    id: 4,
    short: "Fazer",
    title: "Experimentação Ativa",
    icon: Hammer,
    color: "text-emerald-600 bg-emerald-100",
    border: "border-emerald-200",
    description: "Usar a teoria para resolver problemas e tomar decisões. Testar a nova ideia.",
    example: "Aplicar a técnica de negociação aprendida em um cliente real para ver o resultado.",
    action: "Testar",
    connection: "Ao testar, criamos uma nova realidade (uma nova Experiência Concreta), reiniciando o ciclo.",
    nextStage: "Experiência Concreta"
  }
];

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  const [activeStage, setActiveStage] = useState(0);

  if (!isOpen) return null;

  const CurrentStage = CYCLE_STAGES[activeStage];
  const Icon = CurrentStage.icon;

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

            {/* Interactive Cycle Diagram */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-10 overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 m-0">
                  <Repeat className="w-5 h-5 text-indigo-600" />
                  O Ciclo Interativo de Aprendizagem
                </h3>
                <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                  Clique nos ícones
                </span>
              </div>
              
              <div className="p-6">
                {/* Visual Navigation Steps */}
                <div className="flex justify-between items-center relative mb-8 px-2 md:px-8">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                  
                  {CYCLE_STAGES.map((stage, index) => {
                    const isActive = index === activeStage;
                    const StageIcon = stage.icon;
                    return (
                      <React.Fragment key={stage.id}>
                        <button
                          onClick={() => setActiveStage(index)}
                          className={`relative z-10 flex flex-col items-center group focus:outline-none transition-transform duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`}
                        >
                          <div className={`
                            w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 shadow-sm transition-all duration-300
                            ${isActive ? `${stage.color} ${stage.border} ring-4 ring-offset-2 ring-indigo-50` : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300'}
                          `}>
                            <StageIcon className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                          <span className={`
                            mt-2 text-xs font-bold transition-colors absolute -bottom-6 w-max
                            ${isActive ? 'text-slate-800' : 'text-slate-400 opacity-0 group-hover:opacity-100'}
                          `}>
                            {stage.short}
                          </span>
                        </button>
                        {/* Add arrows between items */}
                        {index < CYCLE_STAGES.length - 1 && (
                            <div className="relative z-0 bg-slate-100 rounded-full p-1 border border-slate-200">
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Detail Card with Connection Info */}
                <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-100 relative transition-all duration-500">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                         <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${CurrentStage.color.replace('bg-', 'bg-opacity-10 bg-')}`}>
                           Fase {CurrentStage.id}
                         </span>
                         <h4 className="text-xl font-bold text-slate-800 m-0">{CurrentStage.title}</h4>
                      </div>
                      
                      <p className="text-slate-600 leading-relaxed">
                        {CurrentStage.description}
                      </p>

                      <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                        <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Exemplo Prático</span>
                        <p className="text-slate-800 italic m-0">"{CurrentStage.example}"</p>
                      </div>

                      {/* Connection Section */}
                      <div className="flex items-start gap-3 pt-4 border-t border-slate-200">
                        <GitMerge className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase">Conexão com {CurrentStage.nextStage}</span>
                            <p className="text-sm text-slate-700 mt-1">{CurrentStage.connection}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Side */}
                    <div className="flex flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-6 gap-4 min-w-[140px]">
                       <div className="text-center md:text-right">
                         <span className="text-xs text-slate-400">Ação Principal</span>
                         <div className="text-2xl font-bold text-indigo-600">{CurrentStage.action}</div>
                       </div>
                       
                       <button 
                         onClick={() => setActiveStage((prev) => (prev + 1) % 4)}
                         className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                       >
                         Próximo <ArrowRight className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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

          </div>
        </div>
      </div>
    </div>
  );
};