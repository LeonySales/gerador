import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Download, LogOut } from 'lucide-react';

interface ClientData {
  name: string;
  email: string;
  generatedAt: string;
  routine?: string;
}

const AdminDashboard: React.FC = () => {
  const { setCurrentView, setAdminLoggedIn, userName } = useApp();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('clientes');
    if (stored) setClients(JSON.parse(stored));
  }, []);

  const handleExportCSV = () => {
    const csvContent = 'Nome,Email,Data de Geração\n' +
      clients.map(c => `${c.name},${c.email},${c.generatedAt}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'clientes.csv');
    link.click();
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-700">Painel do Administrador</h1>
          {userName && <p className="text-sm text-gray-500">Bem-vindo, {userName}</p>}
        </div>
        <Button onClick={() => {
          setAdminLoggedIn(false);
          setCurrentView('dashboard');
        }} className="flex items-center gap-2 text-sm text-red-500">
          <LogOut size={16} /> Sair
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar por nome ou email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleExportCSV} className="flex items-center gap-2 bg-purple-600 text-white">
          <Download size={16} /> Exportar CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-purple-100">
            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{client.name}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.generatedAt}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">Nenhum resultado encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
