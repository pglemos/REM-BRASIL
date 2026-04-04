import { Building2, Plus, Search, MoreVertical } from 'lucide-react';

export default function SedesPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Governança</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Sedes</h1>
        </div>
        <button className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Sede
        </button>
      </header>

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
              {[
                { name: 'REM São Paulo', city: 'São Paulo', state: 'SP', director: 'João Silva', status: 'Homologada', editions: 5 },
                { name: 'REM Belo Horizonte', city: 'Belo Horizonte', state: 'MG', director: 'Maria Souza', status: '3ª Edição em Avaliação', editions: 3 },
                { name: 'REM Rio de Janeiro', city: 'Rio de Janeiro', state: 'RJ', director: 'Pedro Costa', status: 'Em Implantação', editions: 0 },
                { name: 'REM Curitiba', city: 'Curitiba', state: 'PR', director: 'Ana Lima', status: 'Em Reciclagem', editions: 4 },
              ].map((sede, i) => (
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
                  <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{sede.director}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                      sede.status === 'Homologada' ? 'bg-green-100 text-green-800' :
                      sede.status === 'Em Reciclagem' ? 'bg-red-100 text-red-800' :
                      'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {sede.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-on-surface">{sede.editions}</td>
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
