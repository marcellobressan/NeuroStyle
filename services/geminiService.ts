import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, AssessmentAnswers, AssessmentResult, LearningStyle, EducationalContext } from "../types";
import { QUESTIONS } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    style: {
      type: Type.STRING,
      enum: [
        LearningStyle.ACCOMMODATOR,
        LearningStyle.ASSIMILATOR,
        LearningStyle.CONVERGENT,
        LearningStyle.DIVERGENT
      ],
      description: "O estilo de aprendizado Kolb identificado."
    },
    description: {
      type: Type.STRING,
      description: "Uma análise que valida a preferência natural do usuário, mas alerta sobre a necessidade de percorrer todo o ciclo (Sentir, Observar, Pensar, Fazer)."
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "4 pontos fortes para usar como alavanca (ex: autonomia, resolução de problemas)."
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Desafios práticos baseados em Andragogia e PBL (Project Based Learning). Devem focar em resolver problemas reais e aplicar conhecimento imediatamente."
    },
    axisData: {
      type: Type.OBJECT,
      properties: {
        ce: { type: Type.NUMBER, description: "Experiência Concreta (Sentir) score (0-100)" },
        ro: { type: Type.NUMBER, description: "Observação Reflexiva (Observar) score (0-100)" },
        ac: { type: Type.NUMBER, description: "Conceituação Abstrata (Pensar) score (0-100)" },
        ae: { type: Type.NUMBER, description: "Experimentação Ativa (Fazer) score (0-100)" }
      },
      required: ["ce", "ro", "ac", "ae"]
    }
  },
  required: ["style", "description", "strengths", "recommendations", "axisData"]
};

// Helper to calculate raw scores locally to help the AI
const calculateRawScores = (answers: AssessmentAnswers) => {
  const scores = { CE: 0, RO: 0, AC: 0, AE: 0 };
  
  Object.entries(answers).forEach(([qId, answer]) => {
    const question = QUESTIONS.find(q => q.id === Number(qId));
    if (question) {
      const axis = answer === 'A' ? question.optionA.axis : question.optionB.axis;
      if (scores[axis] !== undefined) {
        scores[axis]++;
      }
    }
  });

  // Normalize to approximate percentages (simple heuristic based on question distribution)
  // This is a helper for the AI, specifically for the axisData visual
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const normalized = {
    ce: Math.round((scores.CE / total) * 100 * 1.5), // Multiplier to fill radar chart better
    ro: Math.round((scores.RO / total) * 100 * 1.5),
    ac: Math.round((scores.AC / total) * 100 * 1.5),
    ae: Math.round((scores.AE / total) * 100 * 1.5)
  };

  // Cap at 100
  (Object.keys(normalized) as Array<keyof typeof normalized>).forEach(key => {
    if (normalized[key] > 100) normalized[key] = 100;
  });

  return { raw: scores, normalized };
};

// Helper to strip markdown code blocks if present
const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown JSON code blocks if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

export const analyzeProfile = async (
  profile: UserProfile,
  answers: AssessmentAnswers
): Promise<AssessmentResult> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing. Returning mock data.");
    return {
      style: LearningStyle.DIVERGENT,
      description: "Modo Demonstração (Sem API Key): Você prefere observar, mas para aprender de verdade, precisa agir. A ciência mostra que 'aprender apenas no seu estilo' é um mito. Use sua observação para planejar, mas force-se a executar.",
      strengths: ["Empatia", "Visão Holística", "Planejamento"],
      recommendations: ["Aplique um conceito novo hoje mesmo", "Resolva um problema real do trabalho usando a teoria", "Ensine o que aprendeu para fixar"],
      axisData: { ce: 80, ro: 70, ac: 30, ae: 40 }
    };
  }

  const stats = calculateRawScores(answers);

  const prompt = `
    Atue como um Especialista em Andragogia (Educação de Adultos) e Neurociência.
    Analise o perfil de: ${profile.name}, ${profile.age} anos, Contexto: ${profile.context}.

    PONTUAÇÃO BRUTA (Eixos de Kolb):
    - Sentir (CE): ${stats.raw.CE} | Observar (RO): ${stats.raw.RO}
    - Pensar (AC): ${stats.raw.AC} | Fazer (AE): ${stats.raw.AE}

    DIRETRIZES FUNDAMENTAIS (BASEADAS EM EVIDÊNCIA):
    1. **Derrube o Mito:** Não diga ao usuário para aprender *apenas* do jeito que ele gosta. Explique que o "Estilo" é apenas o ponto de partida (zona de conforto), mas o aprendizado real acontece quando ele percorre o ciclo completo (incluindo o que ele não gosta).
    2. **Foco em Andragogia:** Adultos precisam de *Autonomia*, *Resolução de Problemas Reais* e *Aplicação Imediata*.
    3. **Metodologia Ativa:** Incentive PBL (Project Based Learning). A retenção passiva é baixa. A retenção ativa (fazendo) é alta.

    MISSÃO:
    1. Classifique o estilo (Acomodador, Divergente, Convergente, Assimilador).
    2. Na descrição: Valide a preferência dele, mas desafie-o a desenvolver o oposto. (Ex: Se ele é "Pensador", diga que ele precisa "Sentir/Fazer" para não esquecer o conteúdo).
    3. Recomendações: Devem ser AÇÕES práticas para resolver problemas do dia a dia no contexto dele (${profile.context}). Nada de "ler mais livros". Sugira "aplicar a teoria X no problema Y".

    Retorne APENAS JSON válido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: `
          Você é o NeuroStyle AI. Sua filosofia é baseada na Andragogia moderna.
          Você rejeita a "hipótese de mesclagem" (ensinar apenas no estilo do aluno).
          Seu objetivo é promover a Agilidade de Aprendizagem (Learning Agility): a capacidade de transitar entre Sentir, Pensar, Observar e Agir conforme a necessidade do problema.
        `,
        thinkingConfig: { thinkingBudget: 1024 }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean and parse
    const cleanedText = cleanJsonResponse(text);
    return JSON.parse(cleanedText) as AssessmentResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      style: LearningStyle.DIVERGENT,
      description: "Não foi possível gerar a análise personalizada no momento. Verifique se a chave de API está ativa e possui cota disponível.",
      strengths: ["Persistência", "Adaptação", "Resiliência"],
      recommendations: ["Tente novamente em alguns instantes", "Verifique sua conexão com a internet"],
      axisData: stats.normalized
    };
  }
};