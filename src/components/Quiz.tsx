import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { QuizStep } from '../types';
import { Home } from 'lucide-react';

const Quiz: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    child,
    setChild,
    parent,
    setParent,
    setCurrentView,
    setGeneratedRoutine,
  } = useApp();

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Definição dos passos do quiz
  const quizSteps: QuizStep[] = [
    { id: 0, title: 'Qual o nome do seu bebê?', type: 'input', field: 'childName', validation: { required: true } },
    { id: 1, title: 'Quantos meses ele tem?', type: 'slider', field: 'ageMonths', validation: { min: 0, max: 48 } },
    { id: 2, title: 'Que horas ele costuma acordar?', type: 'time', field: 'hora_acorda', validation: { required: true } },
    { id: 3, title: 'Você trabalha fora de casa?', type: 'select', field: 'responsavel_trabalha',
      options: [{ value: 'sim', label: 'Sim' },{ value: 'nao', label: 'Não' }] },
    { id: 4, title: 'Quem cuida do bebê durante o dia?', type: 'select', field: 'cuidador_dia',
      options: [
        { value: 'pais', label: 'Pais ou responsáveis' },
        { value: 'baba', label: 'Babá ou cuidador' },
        { value: 'creche', label: 'Creche ou escola' }
      ]
    },
    { id: 5, title: 'Qual o horário de entrada na creche?', type: 'time', field: 'hora_entrada_creche',
      validation: { required: true }, condition: { field: 'cuidador_dia', value: 'creche' }
    },
    { id: 6, title: 'Qual o horário de saída da creche?', type: 'time', field: 'hora_saida_creche',
      validation: { required: true }, condition: { field: 'cuidador_dia', value: 'creche' }
    },
    { id: 7, title: 'Ele dorme na creche?', type: 'select', field: 'dorme_na_creche',
      options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }],
      condition: { field: 'cuidador_dia', value: 'creche' }
    },

    // NOVAS PERGUNTAS: Sonecas na creche
    { id: 8, title: 'Quantas sonecas o bebê costuma fazer na creche?', type: 'number', field: 'qtd_sonecas_creche',
      condition: { field: 'dorme_na_creche', value: 'sim' }
    },
    { id: 9, title: 'Horário de início da soneca 1 na creche', type: 'time', field: 'horario_soneca_creche_1',
      condition: { field: 'qtd_sonecas_creche', value: 1 }
    },
    { id: 10, title: 'Horário de início da soneca 2 na creche (se houver)', type: 'time', field: 'horario_soneca_creche_2',
      condition: { field: 'qtd_sonecas_creche', value: 2 }
    },

    { id: 11, title: 'Seu bebê tem necessidades especiais?', type: 'select', field: 'necessidades_especiais',
      options: [
        { value: 'nao', label: 'Não' },
        { value: 'leve', label: 'Sim, leve' },
        { value: 'importante', label: 'Sim, importante' },
      ]
    },
    { id: 12, title: 'Como você prefere receber a rotina?', type: 'select', field: 'tipo_orientacao',
      options: [
        { value: 'curtas', label: 'Curtas e diretas' },
        { value: 'detalhadas', label: 'Mais detalhadas' },
      ]
    },
  ];

  const validateField = (field: string, value: any): string => {
    const step = quizSteps.find((s) => s.field === field);
    if (!step?.validation) return '';
    if (step.validation.required && (!value || value.toString().trim() === '')) {
      return 'Este campo é obrigatório';
    }
    return '';
  };

  const visibleSteps = quizSteps.filter((step) => {
    if (!step.condition) return true;
    const dependeDe = answers[step.condition.field];
    return dependeDe === step.condition.value;
  });

  const currentQuizStep = visibleSteps[currentStep];
  const currentAnswer = answers[currentQuizStep.field];
  const currentError = errors[currentQuizStep.field];

  const handleAnswer = (value: any) => {
    const error = validateField(currentQuizStep.field, value);
    setErrors({ ...errors, [currentQuizStep.field]: error });
    setAnswers({ ...answers, [currentQuizStep.field]: value });

    // Salvar no contexto
    const campo = currentQuizStep.field;
    if (['childName', 'ageMonths', 'hora_acorda'].includes(campo)) {
      setChild({ ...child, [campo]: value });
    } else {
      setParent({ ...parent, [campo]: value });
    }
  };

  const canProceed = () => {
    const answer = answers[currentQuizStep.field];
    const error = validateField(currentQuizStep.field, answer);
    return !error && answer !== undefined;
  };

  const nextStep = () => {
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentView('routine-result');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderInput = () => {
    switch (currentQuizStep.type) {
      case 'input':
        return <input type="text" value={currentAnswer || ''} onChange={(e) => handleAnswer(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />;
      case 'slider':
        return (
          <div>
            <p className="text-center text-lg font-medium mb-2">{currentAnswer || 0} meses</p>
            <input type="range" min={0} max={48} value={currentAnswer || 0} onChange={(e) => handleAnswer(parseInt(e.target.value))} className="w-full" />
          </div>
        );
      case 'time':
        return <input type="time" value={currentAnswer || ''} onChange={(e) => handleAnswer(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />;
      case 'number':
        return <input type="number" min={1} max={3} value={currentAnswer || ''} onChange={(e) => handleAnswer(parseInt(e.target.value))} className="w-full px-4 py-2 border rounded-xl" />;
      case 'select':
        return (
          <div className="grid gap-3">
            {currentQuizStep.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left p-4 rounded-xl border ${
                  currentAnswer === option.value ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 relative">
      <h2 className="text-xl font-bold text-center mb-4">{currentQuizStep.title}</h2>
      {renderInput()}
      {currentError && <p className="text-red-500 text-sm mt-2">{currentError}</p>}

      <div className="flex justify-between mt-8">
        <button onClick={prevStep} disabled={currentStep === 0} className="px-4 py-2 rounded-xl border text-gray-700">
          Voltar
        </button>
        <button onClick={nextStep} disabled={!canProceed()} className="bg-purple-600 text-white px-4 py-2 rounded-xl">
          {currentStep === visibleSteps.length - 1 ? 'Finalizar' : 'Próximo'}
        </button>
      </div>

      <button onClick={() => setCurrentView('dashboard')} className="fixed bottom-6 right-6 bg-gray-200 p-3 rounded-full shadow-md hover:bg-gray-300" title="Voltar ao início">
        <Home className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

export default Quiz;
