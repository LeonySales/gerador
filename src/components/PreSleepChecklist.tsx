import React, { useState } from 'react';
import { CheckCircle, Download, ArrowLeft, Moon, Heart, List, Home } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import conteudoApp from '../data/conteudo_app_sono_ninho.json';

interface PreSleepChecklistProps {
  onBack: () => void;
}

const PreSleepChecklist: React.FC<PreSleepChecklistProps> = ({ onBack }) => {
  const { child, setCurrentView } = useApp();
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const handleItemToggle = (index: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      newCheckedItems.add(index);
    }
    setCheckedItems(newCheckedItems);
  };

  const generateResults = () => {
    setShowResults(true);
  };

  const generatePDF = () => {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Checklist Pré-Sono - ${child.name || 'Bebê'}</title>
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
          
          .checklist-item {
            display: flex;
            align-items: center;
            padding: 15px 20px;
            margin-bottom: 12px;
            border-radius: 12px;
            border-left: 4px solid;
          }
          
          .item-checked {
            background: #ecfdf5;
            border-left-color: #10b981;
          }
          
          .item-unchecked {
            background: #f9fafb;
            border-left-color: #d1d5db;
          }
          
          .item-icon {
            margin-right: 15px;
            font-size: 20px;
          }
          
          .item-text {
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
            <h1>Checklist Pré-Sono</h1>
            <p>${child.name || 'Bebê'} • ${currentDate}</p>
          </div>
          
          <div class="content">
            <div class="summary">
              <h3>Resumo do Checklist</h3>
              <p>✅ ${checkedItems.size} de ${conteudoApp.checklist_pre_sono.length} itens verificados</p>
            </div>
            
            <div class="section">
              <h2>📋 Itens do Checklist</h2>
              ${conteudoApp.checklist_pre_sono.map((item, index) => `
                <div class="checklist-item ${checkedItems.has(index) ? 'item-checked' : 'item-unchecked'}">
                  <span class="item-icon">${checkedItems.has(index) ? '✅' : '⬜'}</span>
                  <span class="item-text">${item}</span>
                </div>
              `).join('')}
            </div>
            
            <div class="motivational">
              <p>Você está criando momentos de calma e conexão antes do sono 💜</p>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-brand">
              <span>💜</span>
              <span>Ninho do Sono</span>
            </div>
            <p>Checklist criado com carinho para ${child.name || 'sua família'} • ${currentDate}</p>
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
    a.download = `checklist-pre-sono-${child.name?.toLowerCase().replace(/\s+/g, '-') || 'bebe'}-${new Date().toISOString().split('T')[0]}.html`;
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
              <span>Baixar checklist em PDF</span>
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <List className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Checklist Pré-Sono Concluído
            </h1>
            <p className="text-purple-600 text-lg">
              {child.name ? `Para ${child.name}` : 'Resultado do checklist'}
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{checkedItems.size}</div>
                  <div className="text-green-700 font-medium">✅ Itens verificados</div>
                </div>
                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{conteudoApp.checklist_pre_sono.length - checkedItems.size}</div>
                  <div className="text-purple-700 font-medium">⏳ Para próxima vez</div>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Results */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <List className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Itens do Checklist</h3>
            </div>
            
            <div className="space-y-4">
              {conteudoApp.checklist_pre_sono.map((item, index) => (
                <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl border ${
                  checkedItems.has(index) 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    checkedItems.has(index) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}>
                    {checkedItems.has(index) ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-white rounded"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{item}</p>
                    <p className={`text-sm ${
                      checkedItems.has(index) 
                        ? 'text-green-700' 
                        : 'text-gray-500'
                    }`}>
                      {checkedItems.has(index) ? 'Verificado ✓' : 'Para próxima vez'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-3xl p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <p className="text-xl font-medium">
              Você está criando momentos de calma e conexão antes do sono 💜
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
            <List className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Checklist Pré-Sono
          </h1>
          <p className="text-purple-600 text-lg">
            Use antes de cada soneca ou sono noturno
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-purple-600">
              {checkedItems.size} de {conteudoApp.checklist_pre_sono.length} itens verificados
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((checkedItems.size / conteudoApp.checklist_pre_sono.length) * 100)}% completo
            </span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(checkedItems.size / conteudoApp.checklist_pre_sono.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 mb-8">
          <div className="space-y-4">
            {conteudoApp.checklist_pre_sono.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemToggle(index)}
                className={`w-full flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all hover:shadow-md ${
                  checkedItems.has(index)
                    ? 'border-purple-400 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  checkedItems.has(index)
                    ? 'border-purple-400 bg-purple-400'
                    : 'border-gray-300'
                }`}>
                  {checkedItems.has(index) && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                
                <span className="text-left font-medium text-gray-900 flex-1">
                  {item}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Results Button */}
        <div className="text-center">
          <button
            onClick={generateResults}
            className="px-8 py-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-2xl font-semibold text-lg hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ver Resultado do Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreSleepChecklist;