import { CalendarDays, Plus, Search, MoreVertical } from 'lucide-react';

export default function EditionsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Operação</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Edições</h1>
        </div>
        {(role === 'admin' || role === 'manager') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nova Edição
          </button>
        )}
      </header>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Edição">
        <div className="space-y-4">
          <input className="w-full p-2 border" placeholder="Nome" onChange={(e) => setNewEdition({...newEdition, name: e.target.value})} />
          <input className="w-full p-2 border" placeholder="ID da Sede" onChange={(e) => setNewEdition({...newEdition, headquarters_id: e.target.value})} />
          <input type="date" className="w-full p-2 border" onChange={(e) => setNewEdition({...newEdition, start_date: e.target.value})} />
          <input type="date" className="w-full p-2 border" onChange={(e) => setNewEdition({...newEdition, end_date: e.target.value})} />
          <button onClick={handleAddEdition} className="bg-pulse-cyan text-white p-2 w-full">Salvar</button>
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
              placeholder="Buscar edição..."
            />
          </div>
          <select className="border border-outline/50 rounded-sm text-xs technical-label font-black py-2.5 px-4 bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan">
            <option>Todos os Status</option>
            <option>Em Preparação</option>
            <option>Pronta</option>
            <option>Em Execução</option>
            <option>Concluída</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container text-[10px] technical-label text-on-surface-variant uppercase font-bold border-b border-outline/30">
              <tr>
                <th className="px-6 py-4">Edição</th>
                <th className="px-6 py-4">Sede</th>
                <th className="px-6 py-4">Datas</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Casais</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {editions.map((edition: any, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pulse-cyan/10 text-pulse-cyan rounded-sm">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-sm text-on-surface">{edition.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{edition.headquarters?.name || 'Não definida'}</td>
                  <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                    {new Date(edition.start_date).toLocaleDateString()} - {new Date(edition.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                      edition.status === 'Concluída' ? 'bg-surface-container-high text-on-surface-variant' :
                      edition.status === 'Pronta' ? 'bg-green-100 text-green-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {edition.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-on-surface">{edition.couples_count || 0}</td>
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
