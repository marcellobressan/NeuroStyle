import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, AssessmentAnswers, AssessmentResult, LearningStyle } from "../types";
import { QUESTIONS } from "../constants";

// Initialize Gemini Client
// IMPORTANT: In a real production app, ensure this key is guarded.
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
      description: "The identified Kolb learning style."
    },
    description: {
      type: Type.STRING,
      description: "A concise description of the user's learning personality."
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-4 key strengths."
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific study or work strategies tailored to the user."
    },
    axisData: {
      type: Type.OBJECT,
      properties: {
        ce: { type: Type.NUMBER, description: "Concrete Experience score (0-100)" },
        ro: { type: Type.NUMBER, description: "Reflective Observation score (0-100)" },
        ac: { type: Type.NUMBER, description: "Abstract Conceptualization score (0-100)" },
        ae: { type: Type.NUMBER, description: "Active Experimentation score (0-100)" }
      },
      required: ["ce", "ro", "ac", "ae"]
    }
  },
  required: ["style", "description", "strengths", "recommendations", "axisData"]
};

export const analyzeProfile = async (
  profile: UserProfile,
  answers: AssessmentAnswers
): Promise<AssessmentResult> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing. Returning mock data.");
    // Fallback mock for demonstration if key is missing
    return {
      style: LearningStyle.DIVERGENT,
      description: "Demonstração (Sem API Key): Você tende a ver situações concretas sob muitas perspectivas.",
      strengths: ["Imaginação", "Brainstorming", "Abertura mental"],
      recommendations: ["Trabalhos em grupo", "Mapas mentais", "Feedback personalizado"],
      axisData: { ce: 80, ro: 70, ac: 30, ae: 40 }
    };
  }

  // Construct a prompt context that explains the inputs
  const answersSummary = Object.entries(answers).map(([id, choice]) => {
    const q = QUESTIONS.find(q => q.id === Number(id));
    if (!q) return "";
    const chosenText = choice === 'A' ? q.optionA.text : q.optionB.text;
    const axis = choice === 'A' ? q.optionA.axis : q.optionB.axis;
    return `Question: ${q.text} -> Answer: ${chosenText} (Axis Preference: ${axis})`;
  }).join("\n");

  const prompt = `
    Atue como um especialista em Psicologia Educacional e Ciência de Dados, focado na teoria de David Kolb.
    Analise o perfil e as respostas do seguinte usuário para determinar seu Estilo de Aprendizagem.

    Dados do Usuário:
    - Nome: ${profile.name}
    - Idade: ${profile.age}
    - Contexto: ${profile.context}

    Respostas do Inventário:
    ${answersSummary}

    Tarefa:
    1. Calcule uma pontuação aproximada (0-100) para cada eixo de Kolb (CE, RO, AC, AE) baseando-se na frequência das respostas associadas a cada eixo e inferência comportamental do perfil.
    2. Classifique o usuário em um dos 4 estilos: Acomodador, Divergente, Convergente ou Assimilador.
       - Divergente (CE + RO)
       - Assimilador (AC + RO)
       - Convergente (AC + AE)
       - Acomodador (CE + AE)
    3. Forneça 4-5 recomendações práticas (incluindo sugestões de livros, tipos de vídeos/podcasts ou atividades práticas) especificamente adaptadas à Idade e ao Contexto Educacional (ex: se for Profissional, foque em carreira; se Universitário, em estudos).
    4. Responda estritamente no formato JSON fornecido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AssessmentResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao analisar o perfil. Tente novamente.");
  }
};