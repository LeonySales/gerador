export interface QuizStep {
  id: number;
  title: string;
  subtitle?: string;
  type: 'input' | 'slider' | 'select';
  field: string;
  options?: { value: string; label: string; icon: string }[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
  condition?: {
    field: string;
    value: any;
  };
}

export interface RoutineItem {
  time: string;
  activity: string;
  description: string;
  type: 'routine' | 'feeding' | 'play' | 'nap' | 'sleep';
}

export interface SleepRoutine {
  dailyNaps: number;
  nightSleep: string;
  sleepWindows: string[];
  schedule: RoutineItem[];
  environment: {
    lighting: string;
    noise: string;
    temperature: string;
  };
  extraTips: string[];
  feeding: string;
}

export const quizSteps: QuizStep[] = [
  {
    id: 0,
    title: "Vamos conhecer seu bebê",
    subtitle: "Qual o nome da sua criança?",
    type: "input",
    field: "childName",
    validation: { required: true }
  },
  {
    id: 1,
    title: "Qual a idade do seu bebê?",
    subtitle: "Isso nos ajuda a gerar a rotina adequada",
    type: "slider",
    field: "ageMonths",
    validation: { min: 0, max: 48 }
  },
  {
    id: 2,
    title: "Quem cuida do bebê durante o dia?",
    subtitle: "Ajuda a definir os horários e responsabilidades",
    type: "select",
    field: "cuidador_dia",
    options: [
      { value: "pais", label: "Pais ou responsáveis", icon: "👨‍👩‍👧" },
      { value: "baba", label: "Babá ou cuidador", icon: "🧑‍🍼" },
      { value: "creche", label: "Creche ou escola", icon: "🏫" },
      { value: "outro", label: "Outro", icon: "❓" }
    ]
  },
  {
    id: 3,
    title: "Qual horário seu bebê chega na creche?",
    subtitle: "Se ele for para a creche",
    type: "input",
    field: "horario_chegada_creche",
    validation: { required: true },
    condition: { field: "cuidador_dia", value: "creche" }
  },
  {
    id: 4,
    title: "E qual horário ele volta da creche?",
    type: "input",
    field: "horario_saida_creche",
    validation: { required: true },
    condition: { field: "cuidador_dia", value: "creche" }
  },
  {
    id: 5,
    title: "Ele costuma dormir na creche?",
    type: "select",
    field: "dorme_na_creche",
    options: [
      { value: "sim", label: "Sim", icon: "🛏️" },
      { value: "nao", label: "Não", icon: "🚫" }
    ],
    condition: { field: "cuidador_dia", value: "creche" }
  },
  {
    id: 6,
    title: "Você trabalha fora durante o dia?",
    subtitle: "Isso ajuda a entender o tempo disponível",
    type: "select",
    field: "responsavel_trabalha",
    options: [
      { value: "sim", label: "Sim", icon: "💼" },
      { value: "nao", label: "Não", icon: "🏠" }
    ]
  },
  {
    id: 7,
    title: "Seu bebê tem necessidades especiais?",
    subtitle: "Alguma condição importante a considerar?",
    type: "select",
    field: "necessidades_especiais",
    options: [
      { value: "nao", label: "Não", icon: "✅" },
      { value: "leve", label: "Sim, leves", icon: "⚠️" },
      { value: "importante", label: "Sim, importantes", icon: "❗" }
    ]
  },
  {
    id: 8,
    title: "Como prefere receber as orientações?",
    subtitle: "Vamos personalizar seu estilo",
    type: "select",
    field: "tipo_orientacao",
    options: [
      { value: "curtas", label: "Curtas e diretas", icon: "✂️" },
      { value: "detalhadas", label: "Mais explicativas", icon: "📖" }
    ]
  },
  {
    id: 9,
    title: "Qual seu nome?",
    subtitle: "Para deixarmos tudo mais pessoal",
    type: "input",
    field: "parentName",
    validation: { required: true }
  }
];
