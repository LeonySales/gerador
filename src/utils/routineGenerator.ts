import { Child, Parent, SleepRoutine, ScheduleItem } from '../types';
import rotinasBase from '../data/rotinas_sono_base.json';

export const generateRoutine = (child: Partial<Child>, parent: Partial<Parent>): SleepRoutine => {
  // Encontrar a faixa etária correspondente
  const ageGroup = rotinasBase.faixas_etarias.find(faixa => {
    const [min, max] = faixa.idade_meses.split('-').map(Number);
    return child.ageMonths! >= min && child.ageMonths! <= max;
  });

  if (!ageGroup) {
    throw new Error('Faixa etária não encontrada');
  }

  // Gerar cronograma baseado na idade
  const schedule = generateSchedule(ageGroup, child.ageMonths!);

  const routine: SleepRoutine = {
    id: Date.now().toString(),
    childName: child.name || '',
    ageGroup: ageGroup.idade_meses,
    sleepWindows: ageGroup.janelas_sono,
    dailyNaps: ageGroup.sonecas_dia,
    nightSleep: ageGroup.sono_noturno_estimado,
    feeding: ageGroup.alimentacao,
    environment: {
      lighting: ageGroup.ambiente.luminosidade,
      noise: ageGroup.ambiente.ruido,
      temperature: ageGroup.ambiente.temperatura,
    },
    extraTips: ageGroup.dicas_extra,
    schedule,
  };

  return routine;
};

const generateSchedule = (ageGroup: any, ageMonths: number): ScheduleItem[] => {
  const schedule: ScheduleItem[] = [];

  if (ageMonths <= 3) {
    // 0-3 meses - 4 sonecas
    schedule.push(
      { time: '07:00', activity: 'Despertar e Alimentação', description: 'Primeira mamada do dia', type: 'feeding' },
      { time: '08:00', activity: 'Soneca da Manhã', description: 'Primeira soneca (1-2h)', type: 'nap' },
      { time: '10:00', activity: 'Alimentação', description: 'Segunda mamada', type: 'feeding' },
      { time: '11:00', activity: 'Soneca do Meio da Manhã', description: 'Segunda soneca (1-2h)', type: 'nap' },
      { time: '13:00', activity: 'Alimentação', description: 'Terceira mamada', type: 'feeding' },
      { time: '14:00', activity: 'Soneca da Tarde', description: 'Terceira soneca (1-2h)', type: 'nap' },
      { time: '16:00', activity: 'Alimentação', description: 'Quarta mamada', type: 'feeding' },
      { time: '17:00', activity: 'Soneca do Final da Tarde', description: 'Quarta soneca (30-45min)', type: 'nap' },
      { time: '18:30', activity: 'Banho e Ritual', description: 'Banho relaxante e massagem', type: 'routine' },
      { time: '19:00', activity: 'Alimentação e Sono Noturno', description: 'Última mamada antes de dormir', type: 'sleep' }
    );
  } else if (ageMonths <= 6) {
    // 4-6 meses - 3 sonecas
    schedule.push(
      { time: '07:00', activity: 'Despertar e Alimentação', description: 'Primeira mamada do dia', type: 'feeding' },
      { time: '09:00', activity: 'Soneca da Manhã', description: 'Primeira soneca (1-2h)', type: 'nap' },
      { time: '11:00', activity: 'Alimentação', description: 'Segunda mamada', type: 'feeding' },
      { time: '13:00', activity: 'Soneca da Tarde', description: 'Segunda soneca (1-2h)', type: 'nap' },
      { time: '15:00', activity: 'Alimentação', description: 'Terceira mamada', type: 'feeding' },
      { time: '16:30', activity: 'Soneca do Final da Tarde', description: 'Terceira soneca (30-45min)', type: 'nap' },
      { time: '18:00', activity: 'Banho e Ritual', description: 'Banho e preparação para a noite', type: 'routine' },
      { time: '19:00', activity: 'Alimentação e Sono Noturno', description: 'Última mamada e sono', type: 'sleep' }
    );
  } else if (ageMonths <= 12) {
    // 7-12 meses - 2 sonecas
    schedule.push(
      { time: '07:00', activity: 'Despertar e Café da Manhã', description: 'Leite + papinha de frutas', type: 'feeding' },
      { time: '09:30', activity: 'Soneca da Manhã', description: 'Primeira soneca (1-2h)', type: 'nap' },
      { time: '12:00', activity: 'Almoço', description: 'Papinha salgada + leite', type: 'feeding' },
      { time: '14:30', activity: 'Soneca da Tarde', description: 'Segunda soneca (1-2h)', type: 'nap' },
      { time: '16:00', activity: 'Lanche', description: 'Fruta + leite', type: 'feeding' },
      { time: '17:30', activity: 'Brincadeiras Calmas', description: 'Atividades tranquilas', type: 'play' },
      { time: '18:30', activity: 'Jantar', description: 'Papinha leve', type: 'feeding' },
      { time: '19:00', activity: 'Banho e Ritual', description: 'Banho, massagem, história', type: 'routine' },
      { time: '20:00', activity: 'Sono Noturno', description: 'Leite e dormir', type: 'sleep' }
    );
  } else {
    // 13-24 meses - 1 soneca
    schedule.push(
      { time: '07:00', activity: 'Despertar e Café da Manhã', description: 'Leite + frutas + pão', type: 'feeding' },
      { time: '09:00', activity: 'Brincadeiras', description: 'Atividades estimulantes', type: 'play' },
      { time: '12:00', activity: 'Almoço', description: 'Refeição completa', type: 'feeding' },
      { time: '13:00', activity: 'Soneca da Tarde', description: 'Única soneca (1-2h)', type: 'nap' },
      { time: '15:30', activity: 'Lanche', description: 'Fruta + leite', type: 'feeding' },
      { time: '17:00', activity: 'Brincadeiras Calmas', description: 'Atividades tranquilas', type: 'play' },
      { time: '18:30', activity: 'Jantar', description: 'Refeição leve', type: 'feeding' },
      { time: '19:30', activity: 'Banho e Ritual', description: 'Banho, escovação, história', type: 'routine' },
      { time: '20:30', activity: 'Sono Noturno', description: 'Leite e dormir', type: 'sleep' }
    );
  }

  return schedule;
};