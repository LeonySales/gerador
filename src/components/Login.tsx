import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import axios from 'axios';

const Login: React.FC = () => {
  const { setIsAuthorized, setCurrentView, setAdminLoggedIn, setUserName } = useApp();
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setErro('');
  }, [email, senha, nome]);

  const verificarAcesso = async (email: string) => {
    try {
      setCarregando(true);
      const response = await axios.get('http://localhost:5000/api/verify-access', {
        params: { email: email.trim().toLowerCase() }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro na verificação:', error);
      setErro('Erro ao verificar acesso. Tente novamente.');
      return { authorized: false };
    } finally {
      setCarregando(false);
    }
  };

  const handleLogin = async () => {
    const emailTrim = email.trim().toLowerCase();

    // Admin (mantido o mesmo comportamento)
    if (emailTrim === 'leony@admin.com') {
      if (senha === 'admin1209') {
        localStorage.setItem('authorized', JSON.stringify({ email, nome: 'Admin' }));
        setUserName('Admin');
        setAdminLoggedIn(true);
        setIsAuthorized(true);
        setCurrentView('admin-dashboard');
      } else {
        setErro('Senha incorreta para administrador.');
      }
      return;
    }

    // Validação básica
    if (!nome.trim()) {
      setErro('Por favor, preencha seu nome.');
      return;
    }

    // Verifica acesso via API
    const { authorized, customer } = await verificarAcesso(emailTrim);

    if (!authorized) {
      setErro('Email não autorizado ou compra não encontrada. Verifique ou aguarde liberação.');
      return;
    }

    // Login bem-sucedido
    localStorage.setItem('authorized', JSON.stringify({ 
      email, 
      nome: nome || customer?.name || 'Usuário',
      orderId: customer?.order_id
    }));
    
    setUserName(nome || customer?.name || '');
    setIsAuthorized(true);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-200 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">Bem-vindo ao Ninho do Sono</h2>
        
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="seu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={carregando}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Seu nome</label>
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Como podemos te chamar?"
          value={nome}
          onChange={e => setNome(e.target.value)}
          disabled={carregando}
        />

        {email.trim().toLowerCase() === 'leony@admin.com' && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha de admin</label>
            <input
              type={mostrarSenha ? 'text' : 'password'}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              disabled={carregando}
            />
            <div className="text-sm text-gray-500 mb-4">
              <label>
                <input 
                  type="checkbox" 
                  onChange={() => setMostrarSenha(!mostrarSenha)} 
                  className="mr-2" 
                  disabled={carregando}
                />
                Mostrar senha
              </label>
            </div>
          </>
        )}

        {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

        <button
          onClick={handleLogin}
          className={`w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition ${carregando ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={carregando}
        >
          {carregando ? 'Verificando...' : 'Entrar'}
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Use o mesmo email utilizado na compra. Caso tenha problemas, entre em contato com o suporte.
        </p>
      </div>
    </div>
  );
};

export default Login;