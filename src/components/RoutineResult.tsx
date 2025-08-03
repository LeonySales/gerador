import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useApp } from '../contexts/AppContext';
import { Home, Sparkles, Clock, Heart, CheckCircle } from 'lucide-react';
import { SleepRoutine, RoutineItem } from '../types';
import rotinaBase from '../data/rotinas_sono_base.json';
import modelosRotina from '../data/modelos_rotina.json';

const RoutineResult: React.FC = () => {
  const { child, parent, setCurrentView, setChild, setParent, setGeneratedRoutine, setCurrentStep } = useApp();
  const [routine, setRoutine] = useState<SleepRoutine | null>(null);
  const [recomendacoes, setRecomendacoes] = useState<string[]>([]);
  const [summary, setSummary] = useState<{sonecas: number, sonoDiurno: number, horaSonoNoturno: string, tempoAcordadoFinal: string} | null>(null);

  const parseFaixaEtaria = (meses: number) => {
    const faixas = rotinaBase.faixas_etarias;
    for (const faixa of faixas) {
      const [inicio, fim] = faixa.idade_meses.includes('+')
        ? [parseInt(faixa.idade_meses), Infinity]
        : faixa.idade_meses.split('-').map(Number);
      if (meses >= inicio && meses <= fim) return faixa;
    }
    return null;
  };

  const horarioParaMinutos = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  };

  const minutosParaHora = (min: number) => {
    const h = Math.floor(min / 60).toString().padStart(2, '0');
    const m = (min % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const generatePDF = async () => {
    const content = document.getElementById('pdfContent');
    if (!content) return;

    const canvas = await html2canvas(content, {
      scale: 3,
      useCORS: true,
      scrollY: -window.scrollY,
      backgroundColor: '#ffffff',
      windowWidth: content.scrollWidth,
      windowHeight: content.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth() - 40;
    const pageHeight = pdf.internal.pageSize.getHeight() - 40;
    const imgProps = pdf.getImageProperties(imgData);

    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    let position = 20;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, 'PNG', 20, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 20;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 20, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const nome = (child?.childName || 'bebe').replace(/\s+/g, '_');
    pdf.save(`rotina_${nome}.pdf`);
  };

  const voltarInicio = () => {
    setGeneratedRoutine(null);
    setChild({});
    setParent({});
    setCurrentStep(0);
    setCurrentView('dashboard');
  };

  useEffect(() => {
    const respostas = { ...child, ...parent };
    const idadeMeses = Number(respostas.ageMonths || 0);
    const faixa = parseFaixaEtaria(idadeMeses);
    if (!faixa) return;

    let modeloKey: keyof typeof modelosRotina = 'padrao';
    if (respostas.cuidador_dia === 'creche') modeloKey = 'creche';
    else if (['importante', 'leve'].includes(respostas.necessidades_especiais))
      modeloKey = 'especial';
    else if (respostas.tipo_orientacao === 'detalhadas')
      modeloKey = 'pais_detalhistas';

    const modelo = (modelosRotina as any)[modeloKey];
    const blocos: RoutineItem[] = [];
    const recs: string[] = [];

    const wakeTime = respostas.hora_acorda || '07:00';
    let horaAtual = horarioParaMinutos(wakeTime);

    const janelaBase = faixa.janelas_sono[0];
    const horasJanela = parseFloat(janelaBase);
    const janelaMin = Math.round(horasJanela * 60);

    const vaiCreche = respostas.cuidador_dia === 'creche';
    const entradaCreche = vaiCreche ? horarioParaMinutos(respostas.hora_entrada_creche || '08:00') : null;
    const saidaCreche = vaiCreche ? horarioParaMinutos(respostas.hora_saida_creche || '17:00') : null;

    let ultimaSonecaFim = 0;

    if (!vaiCreche) {
      blocos.push({
        time: minutosParaHora(horaAtual),
        activity: 'Despertar',
        description: 'Acordar com carinho e abrir cortinas para a luz natural.'
      });

      horaAtual += 30;
      blocos.push({
        time: minutosParaHora(horaAtual),
        activity: 'Café da manhã',
        description: 'Leite materno ou fórmula. Se faz introdução alimentar, frutas amassadas.'
      });

      let totalSonecas = faixa.sonecas_dia;
      for (let i = 1; i <= totalSonecas; i++) {
        horaAtual += janelaMin;
        blocos.push({
          time: minutosParaHora(horaAtual),
          activity: `Soneca ${i}`,
          description: 'Soneca em ambiente calmo e escuro.'
        });
        ultimaSonecaFim = horaAtual + 60;
        horaAtual = ultimaSonecaFim;

        horaAtual += 30;
        blocos.push({
          time: minutosParaHora(horaAtual),
          activity: 'Atividade',
          description: 'Tempo de brincadeiras e exploração após a soneca.'
        });
      }

      horaAtual = Math.min(horarioParaMinutos('19:30'), ultimaSonecaFim + 180);
      blocos.push({
        time: minutosParaHora(horaAtual - 60),
        activity: 'Banho',
        description: 'Banho morno, luz baixa e massagem relaxante.'
      });
      blocos.push({
        time: minutosParaHora(horaAtual - 30),
        activity: 'História',
        description: 'História calma e previsível.'
      });
      blocos.push({
        time: minutosParaHora(horaAtual),
        activity: 'Sono noturno',
        description: 'Dormir em ambiente escuro e silencioso.'
      });
    }

    if (vaiCreche && entradaCreche && saidaCreche) {
      blocos.push({
        time: minutosParaHora(horarioParaMinutos(wakeTime)),
        activity: 'Despertar',
        description: 'Despertar calmo e troca de fralda.'
      });
      blocos.push({
        time: minutosParaHora(horarioParaMinutos(wakeTime) + 30),
        activity: 'Café da manhã',
        description: 'Café da manhã leve antes da creche.'
      });

      blocos.push({
        time: minutosParaHora(entradaCreche),
        activity: 'Entrada na creche',
        description: 'Chegada tranquila à creche.'
      });

      if (respostas.dorme_na_creche === 'sim' && respostas.qtd_sonecas_creche) {
        for (let i = 1; i <= respostas.qtd_sonecas_creche; i++) {
          const campo = `horario_soneca_creche_${i}`;
          const horario = respostas[campo];
          if (horario) {
            const inicio = horarioParaMinutos(horario);
            blocos.push({
              time: minutosParaHora(inicio),
              activity: 'Soneca na creche',
              description: 'Cochilo supervisionado na creche.'
            });
            ultimaSonecaFim = inicio + 60;
          }
        }
      } else {
        let proxSoneca = entradaCreche + Math.max(janelaMin, 120);
        const limiteCreche = saidaCreche - 120;
        while (proxSoneca <= limiteCreche) {
          blocos.push({
            time: minutosParaHora(proxSoneca),
            activity: 'Soneca na creche',
            description: 'Cochilo supervisionado na creche.'
          });
          ultimaSonecaFim = proxSoneca + 60;
          proxSoneca += 240;
        }
      }

      blocos.push({
        time: minutosParaHora(saidaCreche),
        activity: 'Saída da creche',
        description: 'Retorno para casa.'
      });

      let posSaida = saidaCreche + 30;
      blocos.push({
        time: minutosParaHora(posSaida),
        activity: 'Lanche',
        description: 'Lanche leve após a creche.'
      });

      posSaida += 60;
      blocos.push({
        time: minutosParaHora(posSaida),
        activity: 'Leitura',
        description: 'Atividade calma após a creche.'
      });

      posSaida += 45;
      blocos.push({
        time: minutosParaHora(posSaida),
        activity: 'Banho',
        description: 'Banho morno e massagem relaxante.'
      });

      posSaida += 30;
      blocos.push({
        time: minutosParaHora(posSaida),
        activity: 'História',
        description: 'História calma antes de dormir.'
      });

      let horaSono = posSaida + 15;
      const ultimaHora = ultimaSonecaFim;
      if (ultimaHora && ultimaHora <= horarioParaMinutos('15:00')) {
        horaSono = horarioParaMinutos('19:00');
      } else if (ultimaHora && ultimaHora <= horarioParaMinutos('16:00')) {
        horaSono = ultimaSonecaFim + 180;
      }
      if (horaSono > horarioParaMinutos('20:00')) horaSono = horarioParaMinutos('20:00');

      blocos.push({
        time: minutosParaHora(horaSono),
        activity: 'Sono noturno',
        description: 'Dormir em ambiente escuro e silencioso.'
      });
    }

    // === GERAR SUMÁRIO ===
    const sonecaBlocos = blocos.filter(b => b.activity.toLowerCase().includes('soneca'));
    const sonecas = sonecaBlocos.length;
    const sonoDiurno = sonecas * 1; // 1h cada
    const sonoNoturnoBloco = blocos.find(b => b.activity.toLowerCase().includes('sono noturno'));
    const horaSonoNoturno = sonoNoturnoBloco ? sonoNoturnoBloco.time : '';
    const ultimaSoneca = sonecaBlocos[sonecaBlocos.length - 1];
    let tempoAcordadoFinal = '';
    if (ultimaSoneca && sonoNoturnoBloco) {
      const minutos = horarioParaMinutos(sonoNoturnoBloco.time) - horarioParaMinutos(ultimaSoneca.time) - 60;
      tempoAcordadoFinal = `${Math.round(minutos / 60)}h`;
    }

    setSummary({ sonecas, sonoDiurno, horaSonoNoturno, tempoAcordadoFinal });

    if (respostas.necessidades_especiais === 'leve') recs.push('Adapte a rotina com paciência e evite sobrecarga sensorial.');
    else if (respostas.necessidades_especiais === 'importante') recs.push('⚠️ Procure acompanhamento profissional para ajustar a rotina.');
    if (idadeMeses >= 6) recs.push('Introduza alimentos sólidos conforme orientação do pediatra.');
    if (idadeMeses >= 7) recs.push('Inclua refeições sólidas + leite nas principais refeições.');

    const rotinaFinal: SleepRoutine = {
      dailyNaps: faixa.sonecas_dia,
      nightSleep: faixa.sono_noturno_estimado,
      sleepWindows: faixa.janelas_sono,
      schedule: blocos,
      environment: faixa.ambiente,
      extraTips: faixa.dicas_extra,
      feeding: faixa.alimentacao,
    };

    setRoutine(rotinaFinal);
    setRecomendacoes(recs);
  }, [child, parent]);

  if (!routine) return <p className="text-center mt-10">Gerando rotina personalizada...</p>;

  const nomeBebe = child?.childName ? ` de ${child.childName}` : '';

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold text-purple-700 mb-1">Rotina Personalizada{nomeBebe}</h1>
      <p className="text-gray-500 mb-4">Baseada nas respostas fornecidas</p>

      <div id="pdfContent" className="bg-white p-4 rounded-lg">
        {routine.schedule.map((item, i) => (
          <div key={i} className="mb-3 p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
            <h3 className="font-semibold text-purple-800 flex items-center gap-2">
              <Clock size={18} /> {item.time} - {item.activity}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
        ))}

        {summary && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-bold text-blue-700 mb-2">Resumo do Dia</h2>
            <ul className="text-sm text-gray-700 list-disc ml-4">
              <li>Total de sonecas: {summary.sonecas}</li>
              <li>Total aproximado de sono diurno: {summary.sonoDiurno}h</li>
              <li>Hora sugerida do sono noturno: {summary.horaSonoNoturno}</li>
              <li>Tempo acordado antes do sono noturno: {summary.tempoAcordadoFinal}</li>
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-bold text-purple-700 mb-2 flex items-center gap-2">
            <Home className="w-5 h-5" /> Ambiente Ideal
          </h2>
          <ul className="text-sm text-gray-700 list-disc ml-4">
            <li><strong>Luminosidade:</strong> {routine.environment.lighting}. Mantenha o quarto escuro nas sonecas.</li>
            <li><strong>Ruído:</strong> {routine.environment.noise}. Sons suaves ajudam o bebê a relaxar.</li>
            <li><strong>Temperatura:</strong> {routine.environment.temperature}. Use roupas adequadas e ambiente confortável.</li>
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold text-purple-700 mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Dicas Extras
          </h2>
          <ul className="text-sm text-gray-700 list-disc ml-4">
            {routine.extraTips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold text-purple-700 mb-2 flex items-center gap-2">
            <Heart className="w-5 h-5" /> Alimentação
          </h2>
          <p className="text-sm text-gray-700 ml-2">{routine.feeding}</p>
        </div>

        {recomendacoes.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-purple-700 mb-2">Recomendações</h2>
            <ul className="list-disc ml-4 text-sm text-gray-700">
              {recomendacoes.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8 flex-wrap">
        <button onClick={voltarInicio} className="flex items-center gap-2 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition shadow-md">
          <Home className="w-5 h-5" /> Início
        </button>

        <button onClick={generatePDF} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-md">
          <Sparkles className="w-5 h-5" /> Baixar PDF
        </button>
      </div>
    </div>
  );
};

export default RoutineResult;
