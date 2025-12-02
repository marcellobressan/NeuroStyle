import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StepWizard } from './components/StepWizard';
import { UserProfile, AssessmentAnswers, EducationalContext, AssessmentResult } from './types';
import { CONTEXT_OPTIONS, QUESTIONS } from './constants';
import { ArrowRight, User, CheckCircle2, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';
import { analyzeProfile } from './services/geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

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
        Utilize inteligência artificial baseada em Andragogia para identificar sua zona de conforto e criar estratégias de aprendizado ativo.
      </p>
      <button 
        onClick={() => navigate('/assessment')}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-full overflow-hidden transition-all hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
      >
        <span className="relative flex items-center gap-2">
          Iniciar Análise
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </button>
      <div className="mt-12 flex gap-8 text-sm text-slate-400">
        <span>⏱️ Aprox. 3 minutos</span>
        <span>🧠 Baseado em Evidências</span>
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
  
  // Validation State
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; age?: boolean }>({});

  const validateField = (name: string, value: any) => {
    let error = "";
    if (name === 'name') {
      if (!value || String(value).trim().length === 0) error = "Por favor, insira seu nome.";
      else if (String(value).trim().length < 3) error = "O nome deve ter pelo menos 3 caracteres.";
    }
    if (name === 'age') {
      if (!value) error = "A idade é obrigatória.";
      else if (Number(value) < 18) error = "É necessário ter pelo menos 18 anos.";
      else if (Number(value) > 120) error = "Insira uma idade válida.";
    }
    return error;
  };

  const handleBlur = (field: 'name' | 'age') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, profile[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: 'name' | 'age', value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Validate immediately if already touched, or clears error if valid
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields on submit
    const nameError = validateField('name', profile.name);
    const ageError = validateField('age', profile.age);
    
    setErrors({ name: nameError, age: ageError });
    setTouched({ name: true, age: true });

    if (!nameError && !ageError) {
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
        <h2 className="text-2xl font-bold text-slate-800">Consultando o Especialista...</h2>
        <p className="text-slate-500 mt-2">Nossa IA está criando um plano baseado em Andragogia.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <StepWizard 
        currentStep={step} 
        totalSteps={4} 
        labels={['Perfil', 'Preferências I', 'Preferências II', 'Preferências III']} 
      />

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all animate-fade-in-up">
        
        {step === 1 && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Sobre Você</h2>
            
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
              <div className="relative">
                <input 
                  type="text" 
                  style={{ colorScheme: 'light' }}
                  className={`
                    w-full px-4 py-3 rounded-lg border bg-white text-slate-900 transition-all outline-none pr-10
                    ${errors.name && touched.name 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                      : !errors.name && touched.name && profile.name.length > 0
                        ? 'border-green-500 focus:ring-2 focus:ring-green-200 focus:border-green-500'
                        : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}
                  `}
                  placeholder="Seu nome"
                  value={profile.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  aria-invalid={!!errors.name}
                />
                {errors.name && touched.name && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
                {!errors.name && touched.name && profile.name.length > 0 && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">Idade</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="18" 
                    max="120"
                    style={{ colorScheme: 'light' }}
                    className={`
                      w-full px-4 py-3 rounded-lg border bg-white text-slate-900 transition-all outline-none pr-10
                      ${errors.age && touched.age 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                        : !errors.age && touched.age
                          ? 'border-green-500 focus:ring-2 focus:ring-green-200 focus:border-green-500'
                          : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}
                    `}
                    value={profile.age}
                    onChange={e => handleChange('age', e.target.value)}
                    onBlur={() => handleBlur('age')}
                    aria-invalid={!!errors.age}
                  />
                  {errors.age && touched.age && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  )}
                  {!errors.age && touched.age && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {errors.age && touched.age && (
                  <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.age}</p>
                )}
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
                className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(!!errors.name || !!errors.age) && (touched.name || touched.age)}
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step > 1 && (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Como você prefere resolver problemas?</h2>
              <p className="text-slate-500">Selecione a opção que melhor descreve sua primeira reação.</p>
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
                {isLastStep ? 'Gerar Análise' : 'Próximo'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-sm z-50">
        <p className="font-bold text-indigo-700 mb-1">{label}</p>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
           <p className="text-slate-600">
             Intensidade: <span className="font-bold text-slate-900">{payload[0].value}</span>%
           </p>
        </div>
        <p className="text-xs text-slate-400 mt-1">Quanto maior, maior a preferência.</p>
      </div>
    );
  }
  return null;
};

// Custom axis tick renderer to improve readability
const renderCustomAxisTick = ({ x, y, payload, cx, cy }: any) => {
  // Determine anchor based on position relative to center to avoid overlapping the chart
  const anchor = Math.abs(x - cx) < 10 ? 'middle' : x > cx ? 'start' : 'end';
  
  // Calculate offsets to give some breathing room
  const xOffset = Math.abs(x - cx) < 10 ? 0 : x > cx ? 10 : -10;
  const yOffset = Math.abs(y - cy) < 10 ? 0 : y > cy ? 5 : -5;

  const [main, sub] = payload.value.split('(');
  
  return (
    <g transform={`translate(${x + xOffset},${y + yOffset})`}>
      <text 
        textAnchor={anchor} 
        y={0} 
        className="text-[10px] sm:text-xs font-bold fill-slate-700"
      >
        {main.trim()}
      </text>
      <text 
        textAnchor={anchor} 
        y={14} 
        className="text-[9px] sm:text-[10px] font-medium fill-slate-500"
      >
        ({sub.trim()}
      </text>
    </g>
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
    { subject: 'Exp. Concreta (Sentir)', A: result.axisData.ce, fullMark: 100 },
    { subject: 'Obs. Reflexiva (Observar)', A: result.axisData.ro, fullMark: 100 },
    { subject: 'Conc. Abstrata (Pensar)', A: result.axisData.ac, fullMark: 100 },
    { subject: 'Exp. Ativa (Fazer)', A: result.axisData.ae, fullMark: 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in pb-20">
      {/* Header Result */}
      <div className="text-center mb-12">
        <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-4">
          Resultado da Análise Andragógica
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
          {profile.name}, sua zona de conforto é <span className="text-indigo-600">{result.style}</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {result.description}
        </p>
      </div>

      {/* Warning Card about "Matching Hypothesis" */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-12 max-w-3xl mx-auto flex gap-4 items-start">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div className="text-left">
          <h4 className="font-bold text-amber-800">Cuidado com a "Zona de Conforto"</h4>
          <p className="text-sm text-amber-700 mt-1">
            Pesquisas recentes mostram que aprender <strong>apenas</strong> no seu estilo preferido não traz melhores resultados. 
            Para reter conhecimento real, você precisa desafiar as áreas onde sua pontuação foi menor no gráfico abaixo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-2 w-full text-center">
            Seu Ciclo de Aprendizagem
          </h3>
          <p className="text-xs text-slate-500 mb-6 text-center max-w-xs mx-auto">
            Este gráfico mostra suas tendências naturais. Um ciclo completo de aprendizado requer o uso dos quatro quadrantes.
          </p>
          <div className="w-full h-[320px] min-w-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                <PolarGrid gridType="polygon" stroke="#e2e8f0" strokeWidth={1.5} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={renderCustomAxisTick}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Seu Perfil"
                  dataKey="A"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fill="#6366f1"
                  fillOpacity={0.4}
                  dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
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
          
          {/* Recommendations (PBL Focused) */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-6 rounded-2xl shadow-md flex-1">
            <div className="flex items-center gap-3 mb-4">
               <div className="bg-indigo-700/50 p-2 rounded-lg">
                <Lightbulb className="w-5 h-5 text-indigo-200" />
               </div>
              <h3 className="text-lg font-bold text-white">Desafios Práticos (PBL)</h3>
            </div>
            <p className="text-xs text-indigo-200 mb-4 border-b border-indigo-700 pb-2">
              Para vencer a "Curva do Esquecimento", aplique isso hoje:
            </p>
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