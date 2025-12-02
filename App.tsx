import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StepWizard } from './components/StepWizard';
import { UserProfile, AssessmentAnswers, EducationalContext, AssessmentResult } from './types';
import { CONTEXT_OPTIONS, QUESTIONS } from './constants';
import { ArrowRight, User, CheckCircle2, Lightbulb, RefreshCw } from 'lucide-react';
import { analyzeProfile } from './services/geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="bg-indigo-50 p-4 rounded-full mb-6">
        <User className="w-12 h-12 text-indigo-600" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 max-w-2xl leading-tight">
        Descubra como seu cérebro <span className="text-indigo-600">aprende melhor</span>
      </h1>
      <p className="text-lg text-slate-600 mb-10 max-w-xl">
        Utilize inteligência artificial baseada na teoria de Kolb para identificar seu estilo de aprendizagem e receba estratégias personalizadas para sua carreira ou estudos.
      </p>
      <button 
        onClick={() => navigate('/assessment')}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-full overflow-hidden transition-all hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
      >
        <span className="relative flex items-center gap-2">
          Iniciar Avaliação
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </button>
      <div className="mt-12 flex gap-8 text-sm text-slate-400">
        <span>⏱️ Aprox. 3 minutos</span>
        <span>🧠 Baseado em Neurociência</span>
        <span>🔒 100% Gratuito</span>
      </div>
    </div>
  );
};

const Assessment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({ name: '', age: 25, context: EducationalContext.UNIVERSITY });
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.age) {
      setStep(2);
      window.scrollTo(0,0);
    }
  };

  const handleAnswer = (questionId: number, choice: 'A' | 'B') => {
    setAnswers(prev => ({ ...prev, [questionId]: choice }));
  };

  const currentQuestions = QUESTIONS.slice((step - 2) * 4, (step - 1) * 4);
  const isLastStep = (step - 1) * 4 >= QUESTIONS.length;
  const canProceed = currentQuestions.every(q => answers[q.id]);

  const nextStep = async () => {
    if (step === 1) {
       // Handled by form submit
    } else if (!isLastStep) {
      setStep(prev => prev + 1);
      window.scrollTo(0,0);
    } else {
      // Submit
      setIsSubmitting(true);
      try {
        const result = await analyzeProfile(profile, answers);
        navigate('/result', { state: { result, profile } });
      } catch (e) {
        console.error(e);
        alert('Erro ao processar. Verifique sua conexão ou a chave de API.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-800">Analisando seu perfil...</h2>
        <p className="text-slate-500 mt-2">Nossa IA está cruzando seus dados com a teoria de Kolb.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <StepWizard 
        currentStep={step} 
        totalSteps={3} 
        labels={['Perfil', 'Preferências I', 'Preferências II']} 
      />

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all animate-fade-in-up">
        
        {step === 1 && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Sobre Você</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
              <input 
                type="text" 
                required
                style={{ colorScheme: 'light' }}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="Seu nome"
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Idade</label>
                <input 
                  type="number" 
                  min="18" 
                  max="100"
                  required
                  style={{ colorScheme: 'light' }}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  value={profile.age}
                  onChange={e => setProfile({...profile, age: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contexto</label>
                <select 
                  style={{ colorScheme: 'light' }}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  value={profile.context}
                  onChange={e => setProfile({...profile, context: e.target.value as EducationalContext})}
                >
                  {CONTEXT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step > 1 && (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Como você prefere aprender?</h2>
              <p className="text-slate-500">Selecione a opção que melhor descreve seu comportamento habitual.</p>
            </div>

            <div className="space-y-6">
              {currentQuestions.map((q) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-100 transition-colors">
                  <p className="font-medium text-slate-800 mb-4">{q.text}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAnswer(q.id, 'A')}
                      className={`
                        p-4 rounded-lg text-left text-sm transition-all border-2
                        ${answers[q.id] === 'A' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold shadow-inner' 
                          : 'border-white bg-white hover:border-slate-300 text-slate-600 shadow-sm'}
                      `}
                    >
                      <span className="font-bold text-indigo-500 mr-2">A)</span> {q.optionA.text}
                    </button>
                    <button
                      onClick={() => handleAnswer(q.id, 'B')}
                      className={`
                        p-4 rounded-lg text-left text-sm transition-all border-2
                        ${answers[q.id] === 'B' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold shadow-inner' 
                          : 'border-white bg-white hover:border-slate-300 text-slate-600 shadow-sm'}
                      `}
                    >
                      <span className="font-bold text-indigo-500 mr-2">B)</span> {q.optionB.text}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button 
                onClick={() => setStep(prev => prev - 1)}
                className="px-6 py-3 text-slate-500 font-medium hover:text-slate-800 transition-colors"
              >
                Voltar
              </button>
              <button 
                onClick={nextStep}
                disabled={!canProceed}
                className={`
                  px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all
                  ${canProceed 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                `}
              >
                {isLastStep ? 'Finalizar Análise' : 'Próximo'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result: AssessmentResult; profile: UserProfile } | null;

  if (!state) {
    return <Navigate to="/" />;
  }

  const { result, profile } = state;

  const chartData = [
    { subject: 'Exp. Concreta (CE)', A: result.axisData.ce, fullMark: 100 },
    { subject: 'Obs. Reflexiva (RO)', A: result.axisData.ro, fullMark: 100 },
    { subject: 'Conc. Abstrata (AC)', A: result.axisData.ac, fullMark: 100 },
    { subject: 'Exp. Ativa (AE)', A: result.axisData.ae, fullMark: 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in pb-20">
      {/* Header Result */}
      <div className="text-center mb-12">
        <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-4">
          Resultado da Análise
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
          {profile.name}, seu estilo é <span className="text-indigo-600">{result.style}</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {result.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center justify-center min-h-[350px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 w-full text-center border-b border-slate-100 pb-2">
            Seu Mapa de Aprendizagem
          </h3>
          <div className="w-full h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={profile.name}
                  dataKey="A"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Recommendations */}
        <div className="space-y-6 flex flex-col">
          {/* Strengths */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Seus Pontos Fortes</h3>
            </div>
            <ul className="space-y-3">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Recommendations */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-6 rounded-2xl shadow-md flex-1">
            <div className="flex items-center gap-3 mb-4">
               <div className="bg-indigo-700/50 p-2 rounded-lg">
                <Lightbulb className="w-5 h-5 text-indigo-200" />
               </div>
              <h3 className="text-lg font-bold text-white">Estratégias para Você</h3>
            </div>
             <ul className="space-y-3">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-indigo-100">
                   <span className="mt-2 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                  <span className="leading-snug">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
           onClick={() => navigate('/')}
           className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-indigo-600 font-semibold bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refazer Avaliação
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/result" element={<Result />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}