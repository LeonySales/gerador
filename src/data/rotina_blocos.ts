import { RoutineItem } from '../types';

export const rotinaBlocos: Record<string, RoutineItem> = {
  despertar: {
    time: '07:00',
    activity: 'Despertar',
    description: 'Acorde o bebê com luz natural e carinho. Evite telas e ruídos fortes.',
    type: 'routine'
  },
  cafe: {
    time: '07:30',
    activity: 'Amamentação / Café da manhã',
    description: 'Leite materno ou fórmula. Se iniciou sólidos, ofereça frutas amassadas ou papinhas leves.',
    type: 'feeding'
  },
  brincar: {
    time: '08:00',
    activity: 'Tummy Time e Estímulos',
    description: 'Deixe o bebê brincar no chão com brinquedos seguros. Faça tummy time supervisionado por 10-15 minutos.',
    type: 'play'
  },
  soneca_1: {
    time: '09:15',
    activity: '1ª Soneca',
    description: 'Ambiente escuro, ruído branco a 50 dB, temperatura agradável. Respeite sinais de sono.',
    type: 'nap'
  },
  pos_soneca_1: {
    time: '10:45',
    activity: 'Acordar + Leite',
    description: 'Despertar calmo, luz suave e amamentação em ambiente tranquilo.',
    type: 'feeding'
  },
  almoco: {
    time: '11:30',
    activity: 'Almoço + Estímulo leve',
    description: 'Papinhas salgadas e alimentos ricos em ferro se autorizado. Após a refeição, música calma ou leitura.',
    type: 'feeding'
  },
  soneca_2: {
    time: '13:00',
    activity: '2ª Soneca',
    description: 'Repetir o ambiente da primeira soneca. Priorizar consistência no ritual do sono.',
    type: 'nap'
  },
  pos_soneca_2: {
    time: '14:30',
    activity: 'Acordar + Leite',
    description: 'Momento de conexão após o cochilo. Conversas suaves, contato visual e amamentação.',
    type: 'feeding'
  },
  leitura: {
    time: '15:30',
    activity: 'Leitura e Atividades Calmas',
    description: 'Livros com texturas ou música instrumental. Evite estímulos fortes ou telas.',
    type: 'play'
  },
  banho: {
    time: '18:00',
    activity: 'Banho + Massagem',
    description: 'Banho morno seguido de massagem com óleo vegetal. Luz baixa e ambiente relaxante.',
    type: 'routine'
  },
  historia: {
    time: '18:30',
    activity: 'História / Canção de Ninar',
    description: 'Ritual pré-sono com voz suave. Use frases repetitivas, histórias tranquilas ou canções de ninar.',
    type: 'routine'
  },
  sono: {
    time: '19:00',
    activity: 'Sono Noturno',
    description: 'Ambiente escuro total, ruído branco contínuo e temperatura entre 20-22°C.',
    type: 'sleep'
  },

  creche_entrada: {
    time: '08:00',
    activity: 'Chegada na Creche',
    description: 'Leve o bebê com calma. Prepare com carinho esse momento de transição.',
    type: 'routine'
  },
  creche_soneca: {
    time: '11:00',
    activity: 'Soneca na Creche',
    description: 'O bebê costuma dormir no ambiente escolar. Garanta que ele esteja confortável.',
    type: 'nap'
  },
  creche_saida: {
    time: '17:00',
    activity: 'Retorno da Creche',
    description: 'Momento de reencontro. Mantenha o ambiente acolhedor e tranquilo.',
    type: 'routine'
  }
};
