import React, { useState } from 'react';
import {
  Download, Clock, Baby, Heart, CheckCircle,
  Star, ArrowRight, Sparkles, List
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import conteudoApp from '../data/conteudo_app_sono_ninho.json';

const Dashboard: React.FC = () => {
  const { setCurrentView, userName } = useApp();
  const [motivationalPhrase] = useState(
    conteudoApp.frases_motivacionais[Math.floor(Math.random() * conteudoApp.frases_motivacionais.length)]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Boas-vindas */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3 text-purple-700 text-xl font-semibold mb-2">
            <Baby className="w-6 h-6" />
            <span>Bem-vindo(a), {userName || 'família'}!</span>
          </div>
          <p className="text-sm text-gray-600">Vamos transformar a rotina de sono do seu bebê juntos 💜</p>
        </div>

        {/* Apresentação */}
        <div className="text-center mb-12">
          <img 
            src={`${import.meta.env.BASE_URL}logo-ninho.png`} 
            alt="Ninho do Sono Logo" 
            className="w-24 h-24 rounded-full object-cover shadow-lg mx-auto mb-6"
          />

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gerador de Rotinas
          </h1>

          <p className="text-xl text-purple-600 font-medium mb-6">
            Ninho do Sono
          </p>

          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Descubra a rotina ideal de sono para o seu bebê. Com base na idade e realidade da sua casa, 
              o Gerador de Rotinas cria um plano prático, acolhedor e 100% personalizável.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: <Baby className="w-8 h-8 text-purple-600" />,
                  title: "Personalizado",
                  desc: "Baseado na idade e necessidades do seu bebê"
                },
                {
                  icon: <Clock className="w-8 h-8 text-purple-600" />,
                  title: "Prático",
                  desc: "Rotina detalhada com horários e dicas"
                },
                {
                  icon: <Download className="w-8 h-8 text-purple-600" />,
                  title: "Baixável",
                  desc: "PDF estilizado para imprimir e usar"
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center p-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm text-center">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('quiz')}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
          >
            <Sparkles className="w-6 h-6" />
            <span>Gerar minha rotina personalizada</span>
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setCurrentView('environment-checklist')}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Analisar ambiente de sono</span>
            </button>

            <button
              onClick={() => setCurrentView('pre-sleep-checklist')}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <List className="w-5 h-5" />
              <span>Checklist Pré-Sono</span>
            </button>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            ✨ Gratuito • 📱 Resultado em 2 minutos • 📄 PDF para download
          </p>
        </div>

        {/* Frase motivacional */}
        <div className="text-center mt-12 py-8">
          <div className="inline-flex items-center space-x-2 text-purple-600 mb-3">
            <Heart className="w-5 h-5" />
            <span className="font-medium">{motivationalPhrase}</span>
          </div>
          <p className="text-gray-500 text-sm">
            Ninho do Sono • Transformando noites em família
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
