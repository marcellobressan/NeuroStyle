import { EducationalContext, Question } from './types';

export const CONTEXT_OPTIONS = [
  { value: EducationalContext.UNIVERSITY, label: 'Estudante Universitário' },
  { value: EducationalContext.PROFESSIONAL, label: 'Profissional em Mercado' },
  { value: EducationalContext.CONTINUING_ED, label: 'Educação Continuada / Cursos Livres' },
];

// Simplified Kolb-based inventory questions (adapted for brevity and clarity)
// CE: Concrete Experience (Feeling)
// RO: Reflective Observation (Watching)
// AC: Abstract Conceptualization (Thinking)
// AE: Active Experimentation (Doing)
export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Quando estou aprendendo algo novo, eu prefiro...",
    optionA: { text: "Confiar nos meus sentimentos e intuição.", axis: "CE" },
    optionB: { text: "Confiar na lógica e no raciocínio.", axis: "AC" }
  },
  {
    id: 2,
    text: "Em um projeto de grupo, eu tendo a...",
    optionA: { text: "Observar e ouvir antes de agir.", axis: "RO" },
    optionB: { text: "Assumir o comando e tentar coisas novas imediatamente.", axis: "AE" }
  },
  {
    id: 3,
    text: "Eu aprendo melhor quando...",
    optionA: { text: "Tenho teorias e conceitos claros.", axis: "AC" },
    optionB: { text: "Posso praticar e colocar a mão na massa.", axis: "AE" }
  },
  {
    id: 4,
    text: "Diante de um problema complexo, eu...",
    optionA: { text: "Busco diferentes perspectivas e significados.", axis: "RO" },
    optionB: { text: "Busco a solução prática mais rápida.", axis: "AE" }
  },
  {
    id: 5,
    text: "Minha maior força no aprendizado é...",
    optionA: { text: "Ser imaginativo e sensível aos sentimentos.", axis: "CE" },
    optionB: { text: "Ser analítico e organizado.", axis: "AC" }
  },
  {
    id: 6,
    text: "Geralmente, eu sou uma pessoa que...",
    optionA: { text: "Observa e reflete.", axis: "RO" },
    optionB: { text: "Faz e participa.", axis: "AE" }
  },
  {
    id: 7,
    text: "Eu prefiro professores ou mentores que...",
    optionA: { text: "Focam em exemplos da vida real e experiências.", axis: "CE" },
    optionB: { text: "Focam em lógica, conceitos e estrutura.", axis: "AC" }
  },
  {
    id: 8,
    text: "Para tomar uma decisão importante, eu...",
    optionA: { text: "Considero como ela afeta as pessoas.", axis: "CE" },
    optionB: { text: "Analiso os prós e contras objetivamente.", axis: "AC" }
  },
  {
    id: 9,
    text: "Quando preciso aprender a usar um novo software ou ferramenta...",
    optionA: { text: "Leio o manual ou a ajuda para entender os princípios primeiro.", axis: "AC" },
    optionB: { text: "Começo a mexer e testar as funções para ver o que acontece.", axis: "AE" }
  },
  {
    id: 10,
    text: "Em situações sociais ou de trabalho, eu costumo ser mais...",
    optionA: { text: "Sensível aos sentimentos e clima emocional.", axis: "CE" },
    optionB: { text: "Observador e analítico antes de me envolver.", axis: "RO" }
  },
  {
    id: 11,
    text: "O que me dá mais satisfação em um projeto é...",
    optionA: { text: "Sentir que estou ajudando pessoas e criando conexões.", axis: "CE" },
    optionB: { text: "Ver as coisas funcionando e tarefas sendo concluídas.", axis: "AE" }
  },
  {
    id: 12,
    text: "Para mim, a chave para o sucesso é...",
    optionA: { text: "Ter tempo para planejar e refletir sobre as consequências.", axis: "RO" },
    optionB: { text: "Ter uma base racional e lógica sólida para as decisões.", axis: "AC" }
  }
];