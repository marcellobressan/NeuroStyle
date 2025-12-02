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
      description: "Uma análise psicológica profunda e personalizada sobre como este usuário processa informações, citando nuances específicas das respostas."
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de 4 pontos fortes comportamentais específicos."
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Estratégias práticas e acionáveis adaptadas EXCLUSIVAMENTE ao contexto (Trabalho ou Estudo) e idade do usuário."
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

export const analyzeProfile = async (
  profile: UserProfile,
  answers: AssessmentAnswers
): Promise<AssessmentResult> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing. Returning mock data.");
    return {
      style: LearningStyle.DIVERGENT,
      description: "Modo Demonstração (Sem API Key): Você possui uma imaginação fértil e prefere observar situações de diferentes perspectivas antes de agir.",
      strengths: ["Empatia", "Criatividade", "Trabalho em equipe"],
      recommendations: ["Use mapas mentais", "Busque feedback pessoal", "Participe de discussões em grupo"],
      axisData: { ce: 80, ro: 70, ac: 30, ae: 40 }
    };
  }

  // 1. Calculate Mathematics locally (Reliability)
  const stats = calculateRawScores(answers);

  // 2. Prepare Context for the AI (Nuance)
  const answersLog = Object.entries(answers).map(([id, choice]) => {
    const q = QUESTIONS.find(q => q.id === Number(id));
    if (!q) return "";
    const chosenText = choice === 'A' ? q.optionA.text : q.optionB.text;
    const axis = choice === 'A' ? q.optionA.axis : q.optionB.axis;
    const rejectedAxis = choice === 'A' ? q.optionB.axis : q.optionA.axis;
    return `- Na situação "${q.text}", o usuário preferiu "${axis}" (${chosenText}) ao invés de "${rejectedAxis}".`;
  }).join("\n");

  const contextSpecificPrompt = profile.context === EducationalContext.PROFESSIONAL 
    ? "Foque as recomendações em liderança, resolução de problemas corporativos e inovação."
    : "Foque as recomendações em métodos de estudo, preparação para provas e trabalhos acadêmicos.";

  const prompt = `
    Analise o perfil cognitivo deste usuário com base na Teoria de Aprendizagem Experiencial de David Kolb.

    DADOS DO USUÁRIO:
    Nome: ${profile.name}
    Idade: ${profile.age} anos
    Contexto Atual: ${profile.context}

    PONTUAÇÃO BRUTA CALCULADA (Use como base para os eixos, mas ajuste se detectar nuances nas respostas):
    - Experiência Concreta (Sentir): ${stats.raw.CE} pontos
    - Observação Reflexiva (Observar): ${stats.raw.RO} pontos
    - Conceituação Abstrata (Pensar): ${stats.raw.AC} pontos
    - Experimentação Ativa (Fazer): ${stats.raw.AE} pontos

    DIÁRIO DE DECISÕES (Respostas detalhadas):
    ${answersLog}

    SUA MISSÃO:
    1. Determine o Estilo de Aprendizagem (Acomodador, Divergente, Convergente, Assimilador) cruzando os eixos dominantes.
       - Nota: Se houver empate técnico nos eixos, use o "Diário de Decisões" para desempatar baseando-se na complexidade das perguntas.
    2. Escreva uma descrição que NÃO seja genérica. Fale diretamente com o ${profile.name}.
       - Exemplo: "João, embora você tenha um forte viés analítico, suas respostas mostram que em situações sociais você usa a intuição..."
    3. As recomendações devem ser ULTRA-ESPECÍFICAS para o contexto: ${profile.context}.
       - ${contextSpecificPrompt}
       - Evite clichês como "estude mais". Dê táticas tangíveis.

    Retorne APENAS o JSON válido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: `
          Você é o NeuroStyle AI, um especialista sênior em Andragogia e Neurociência Cognitiva.
          Seu tom é profissional, perspicaz e encorajador.
          Você não apenas classifica, você explica o "porquê" baseado nas tensões entre Pensar vs Sentir e Agir vs Observar.
          Você prioriza a utilidade prática das recomendações.
        `,
        thinkingConfig: { thinkingBudget: 1024 } // Allow some reasoning budget for better diagnosis
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AssessmentResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Graceful degradation layout in case of AI failure
    return {
      style: LearningStyle.DIVERGENT,
      description: "Detectamos uma falha momentânea na conexão com a IA, mas seus dados indicam um perfil equilibrado.",
      strengths: ["Resiliência", "Adaptação"],
      recommendations: ["Tente novamente em instantes"],
      axisData: stats.normalized
    };
  }
};
