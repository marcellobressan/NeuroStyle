export enum EducationalContext {
  PROFESSIONAL = 'Profissional',
  UNIVERSITY = 'Universitário',
  CONTINUING_ED = 'Educação Continuada',
}

export enum LearningStyle {
  DIVERGENT = 'Divergente',
  ASSIMILATOR = 'Assimilador',
  CONVERGENT = 'Convergente',
  ACCOMMODATOR = 'Acomodador',
}

export interface UserProfile {
  name: string;
  age: number;
  context: EducationalContext;
}

export interface Question {
  id: number;
  text: string;
  optionA: { text: string; axis: 'CE' | 'AC' | 'RO' | 'AE' }; // Maps to Kolb axes
  optionB: { text: string; axis: 'CE' | 'AC' | 'RO' | 'AE' };
}

export interface AssessmentAnswers {
  [questionId: number]: 'A' | 'B';
}

export interface AssessmentResult {
  style: LearningStyle;
  description: string;
  strengths: string[];
  recommendations: string[];
  axisData: {
    ce: number; // Concrete Experience
    ro: number; // Reflective Observation
    ac: number; // Abstract Conceptualization
    ae: number; // Active Experimentation
  };
}