import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Download, ArrowLeft, Moon, Sun, Thermometer, Volume2, Baby, Home } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ChecklistItem {
  id: string;
  text: string;
  category: 'lighting' | 'temperature' | 'noise' | 'safety' | 'comfort';
  isGood: boolean; // true = good for sleep, false = bad for sleep
  icon: React.ReactNode;
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'dark_room',
    text: 'Quarto está escuro ou com luz muito baixa',
    category: 'lighting',
    isGood: true,
    icon: <Moon className="w-5 h-5" />
  },
  {
    id: 'blackout_curtains',
    text: 'Cortinas blackout ou persianas fechadas',
    category: 'lighting',
    isGood: true,
    icon: <Home className="w-5 h-5" />
  },
  {
    id: 'night_light',
    text: 'Luz noturna forte ou TV ligada',
    category: 'lighting',
    isGood: false,
    icon: <Sun className="w-5 h-5" />
  },
  {
    id: 'comfortable_temp',
    text: 'Temperatura entre 20-22°C (confortável)',
    category: 'temperature',
    isGood: true,
    icon: <Thermometer className="w-5 h-5" />
  },
  {
    id: 'too_hot',
    text: 'Quarto muito quente (acima de 25°C)',
    category: 'temperature',
    isGood: false,
    icon: <Thermometer className="w-5 h-5" />
  },
  {
    id: 'too_cold',
    text: 'Quarto muito frio (abaixo de 18°C)',
    category: 'temperature',
    isGood: false,
    icon: <Thermometer className="w-5 h-5" />
  },
  {
    id: 'quiet_environment',
    text: 'Ambiente silencioso ou com ruído branco suave',
    category: 'noise',
    isGood: true,
    icon: <Volume2 className="w-5 h-5" />
  },
  {
    id: 'loud_noises',
    text: 'Ruídos altos (TV, música, conversas)',
    category: 'noise',
    isGood: false,
    icon: <Volume2 className="w-5 h-5" />
  },
  {
    id: 'clean_crib',
    text: 'Berço limpo e organizado',
    category: 'safety',
    isGood: true,
    icon: <Baby className="w-5 h-5" />
  },
  {
    id: 'toys_in_crib',
    text: 'Brinquedos, travesseiros ou cobertores soltos no berço',
    category: 'safety',
    isGood: false,
    icon: <Baby className="w-5 h-5" />
  },
  {
    id: 'comfortable_clothes',
    text: 'Bebê com roupas confortáveis para a temperatura',
    category: 'comfort',
    isGood: true,
    icon: <Baby className="w-5 h-5" />
  },
  {
    id: 'diaper_clean',
    text: 'Fralda limpa e seca',
    category: 'comfort',
    isGood: true,
    icon: <Baby className="w-5 h-5" />
  }
];

interface SleepEnvironmentChecklistProps {
  onBack: () => void;
}

const SleepEnvironmentChecklist: React.FC<SleepEnvironmentChecklistProps> = ({ onBack }) => {
  const { child, setCurrentView } = useApp();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const handleItemToggle = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const generateResults = () => {
    setShowResults(true);
  };

  const getResultsByCategory = () => {
    const results = {
      good: [] as ChecklistItem[],
      warning: [] as ChecklistItem[],
      bad: [] as ChecklistItem[]
    };

    checklistItems.forEach(item => {
      const isChecked = checkedItems.has(item.id);
      
      if (item.isGood && isChecked) {
        results.good.push(item);
      } else if (!item.isGood && isChecked) {
        results.bad.push(item);
      } else if (item.isGood && !isChecked) {
        results.warning.push(item);
      }
    });

    return results;
  };

  const generatePDF = () => {
    const results = getResultsByCategory();
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Análise do Ambiente de Sono - ${child.name || 'Bebê'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #374151;
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          
          .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .section {
            margin-bottom: 40px;
          }
          
          .section h2 {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .result-item {
            display: flex;
            align-items: center;
            padding: 15px 20px;
            margin-bottom: 12px;
            border-radius: 12px;
            border-left: 4px solid;
          }
          
          .result-good {
            background: #ecfdf5;
            border-left-color: #10b981;
          }
          
          .result-warning {
            background: #fef3c7;
            border-left-color: #f59e0b;
          }
          
          .result-bad {
            background: #fef2f2;
            border-left-color: #ef4444;
          }
          
          .result-icon {
            margin-right: 15px;
            font-size: 20px;
          }
          
          .result-text {
            flex: 1;
            font-weight: 500;
          }
          
          .summary {
            background: #f8fafc;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
          }
          
          .summary h3 {
            color: #a855f7;
            font-size: 20px;
            margin-bottom: 10px;
          }
          
          .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer-brand {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 15px;
            color: #a855f7;
            font-weight: 600;
          }
          
          .footer p {
            color: #6b7280;
            font-size: 14px;
          }
          
          .motivational {
            background: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            margin: 30px 0;
          }
          
          .motivational p {
            font-size: 16px;
            font-weight: 500;
          }
          
          @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌙</div>
            <h1>Análise do Ambiente de Sono</h1>
            <p>${child.name || 'Bebê'} • ${currentDate}</p>
          </div>
          
          <div class="content">
            <div class="summary">
              <h3>Resumo da Análise</h3>
              <p>✅ ${results.good.length} itens adequados • ⚠️ ${results.warning.length} podem melhorar • ❌ ${results.bad.length} precisam de atenção</p>
            </div>
            
            ${results.good.length > 0 ? `
              <div class="section">
                <h2>✅ Ambiente Adequado</h2>
                ${results.good.map(item => `
                  <div class="result-item result-good">
                    <span class="result-icon">✅</span>
                    <span class="result-text">${item.text}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${results.warning.length > 0 ? `
              <div class="section">
                <h2>⚠️ Pode Melhorar</h2>
                ${results.warning.map(item => `
                  <div class="result-item result-warning">
                    <span class="result-icon">⚠️</span>
                    <span class="result-text">${item.text}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${results.bad.length > 0 ? `
              <div class="section">
                <h2>❌ Precisa de Atenção</h2>
                ${results.bad.map(item => `
                  <div class="result-item result-bad">
                    <span class="result-icon">❌</span>
                    <span class="result-text">${item.text}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <div class="motivational">
              <p>Você está construindo um ambiente de sono acolhedor com leveza e presença 💜</p>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-brand">
              <span>💜</span>
              <span>Ninho do Sono</span>
            </div>
            <p>Análise criada com carinho para ${child.name || 'sua família'} • ${currentDate}</p>
            <p style="margin-top: 8px; font-style: italic;">Transformando noites em família</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Criar e baixar o arquivo
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ambiente-sono-${child.name?.toLowerCase().replace(/\s+/g, '-') || 'bebe'}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else {
      setCurrentView('dashboard');
    }
  };

  if (showResults) {
    const results = getResultsByCategory();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors rounded-xl px-4 py-2 hover:bg-purple-50"
            >
              <Home className="w-5 h-5" />
              <span>Início</span>
            </button>
            
            <button
              onClick={generatePDF}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-xl font-medium hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Download className="w-5 h-5" />
              <span>Baixar resultado em PDF</span>
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Moon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Análise do Ambiente de Sono
            </h1>
            <p className="text-purple-600 text-lg">
              {child.name ? `Para ${child.name}` : 'Resultado da análise'}
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumo da Análise</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{results.good.length}</div>
                  <div className="text-green-700 font-medium">✅ Itens adequados</div>
                </div>
                <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{results.warning.length}</div>
                  <div className="text-yellow-700 font-medium">⚠️ Podem melhorar</div>
                </div>
                <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
                  <div className="text-3xl font-bold text-red-600 mb-2">{results.bad.length}</div>
                  <div className="text-red-700 font-medium">❌ Precisam de atenção</div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-8">
            {results.good.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Ambiente Adequado</h3>
                </div>
                <div className="space-y-4">
                  {results.good.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{item.text}</p>
                        <p className="text-green-700 text-sm">Ótimo! Continue assim.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.warning.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Pode Melhorar</h3>
                </div>
                <div className="space-y-4">
                  {results.warning.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{item.text}</p>
                        <p className="text-yellow-700 text-sm">Considere implementar para melhorar o sono.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.bad.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <XCircle className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Precisa de Atenção</h3>
                </div>
                <div className="space-y-4">
                  {results.bad.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl border border-red-200">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{item.text}</p>
                        <p className="text-red-700 text-sm">Recomendamos ajustar para um sono mais seguro.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Motivational Message */}
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-3xl p-8 text-white text-center mt-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Moon className="w-8 h-8 text-white" />
            </div>
            <p className="text-xl font-medium">
              Você está construindo um ambiente de sono acolhedor com leveza e presença 💜
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors rounded-xl px-4 py-2 hover:bg-purple-50"
          >
            <Home className="w-5 h-5" />
            <span>Início</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Moon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Checklist do Ambiente de Sono
          </h1>
          <p className="text-purple-600 text-lg">
            Marque os itens que se aplicam ao ambiente atual do seu bebê
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-purple-600">
              {checkedItems.size} de {checklistItems.length} itens marcados
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((checkedItems.size / checklistItems.length) * 100)}% completo
            </span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(checkedItems.size / checklistItems.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 mb-8">
          <div className="space-y-4">
            {checklistItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemToggle(item.id)}
                className={`w-full flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all hover:shadow-md ${
                  checkedItems.has(item.id)
                    ? 'border-purple-400 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  checkedItems.has(item.id)
                    ? 'border-purple-400 bg-purple-400'
                    : 'border-gray-300'
                }`}>
                  {checkedItems.has(item.id) && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.isGood ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="text-left font-medium text-gray-900 flex-1">
                    {item.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Results Button */}
        <div className="text-center">
          <button
            onClick={generateResults}
            disabled={checkedItems.size === 0}
            className="px-8 py-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-2xl font-semibold text-lg hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ver Resultado da Análise
          </button>
          
          {checkedItems.size === 0 && (
            <p className="text-gray-500 text-sm mt-3">
              Marque pelo menos um item para ver o resultado
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SleepEnvironmentChecklist;