'use client';
import { useState, useEffect } from 'react';
import { Building2, Plus, Search, MoreVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Modal } from '@/components/Modal';

export default function SedesPage() {
  const auth = useAuth();
  const role = auth?.role;
  const [loading, setLoading] = useState(true);
  const [headquarters, setHeadquarters] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSede, setNewSede] = useState({ name: '', city: '', state: '', status: 'Em Implantação' });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await supabase
        .from('headquarters')
        .select('*, director:staff(name), editions(count)');
      
      if (data) setHeadquarters(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleAddSede() {
    const { error } = await supabase.from('headquarters').insert([newSede]);
    if (!error) {
      setIsModalOpen(false);
      // Refresh data
      const { data } = await supabase
        .from('headquarters')
        .select('*, director:staff(name), editions(count)');
      if (data) setHeadquarters(data);
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Governança</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Sedes</h1>
        </div>
        {(role === 'admin' || role === 'manager') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nova Sede
          </button>
        )}
      </header>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Sede">
        <div className="space-y-4">
          <input className="w-full p-2 border" placeholder="Nome" onChange={(e) => setNewSede({...newSede, name: e.target.value})} />
          <input className="w-full p-2 border" placeholder="Cidade" onChange={(e) => setNewSede({...newSede, city: e.target.value})} />
          <input className="w-full p-2 border" placeholder="Estado" onChange={(e) => setNewSede({...newSede, state: e.target.value})} />
          <button onClick={handleAddSede} className="bg-pulse-cyan text-white p-2 w-full">Salvar</button>
        </div>
      </Modal>

      <div className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container/30">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-on-surface-variant" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-outline/50 rounded-sm leading-5 bg-surface-container text-xs technical-label font-black focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan"
              placeholder="Buscar sede por nome, cidade ou estado..."
            />
          </div>
          <select className="border border-outline/50 rounded-sm text-xs technical-label font-black py-2.5 px-4 bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan">
            <option>Todos os Status</option>
            <option>Homologada</option>
            <option>Em Implantação</option>
            <option>Em Reciclagem</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container text-[10px] technical-label text-on-surface-variant uppercase font-bold border-b border-outline/30">
              <tr>
                <th className="px-6 py-4">Sede</th>
                <th className="px-6 py-4">Localização</th>
                <th className="px-6 py-4">Diretor Local</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Edições</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {headquarters.map((sede: any, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pulse-cyan/10 text-pulse-cyan rounded-sm">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-sm text-on-surface">{sede.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                    {sede.city}, {sede.state}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{sede.director?.name || 'Não definido'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                      sede.status === 'Homologada' ? 'bg-green-100 text-green-800' :
                      sede.status === 'Em Reciclagem' ? 'bg-red-100 text-red-800' :
                      'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {sede.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-on-surface">{sede.editions?.length || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-on-surface-variant hover:text-pulse-cyan">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
