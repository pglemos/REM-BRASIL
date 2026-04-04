import { ShieldCheck, Plus, Search, MoreVertical, AlertTriangle } from 'lucide-react';

export default function HomologationPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Qualidade</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Homologação</h1>
          <p className="text-on-surface-variant mt-2 font-bold text-sm technical-label uppercase">Avaliações e ciclos de homologação de sedes</p>
        </div>
        <button className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Avaliação
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
              placeholder="Buscar por sede ou avaliador..."
            />
          </div>
          <select className="border border-outline/50 rounded-sm text-xs technical-label font-black py-2.5 px-4 bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan">
            <option>Todos os Status</option>
            <option>Homologada</option>
            <option>Em Avaliação</option>
            <option>Em Reciclagem</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container text-[10px] technical-label text-on-surface-variant uppercase font-bold border-b border-outline/30">
              <tr>
                <th className="px-6 py-4">Sede</th>
                <th className="px-6 py-4">Ciclo</th>
                <th className="px-6 py-4">Score Médio</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Última Avaliação</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {[
                { sede: 'REM São Paulo', cycle: '3ª Edição', score: 88, status: 'Homologada', date: '10 Ago 2026', alert: false },
                { sede: 'REM Belo Horizonte', cycle: '2ª Edição', score: 92, status: 'Em Avaliação', date: '05 Ago 2026', alert: false },
                { sede: 'REM Curitiba', cycle: '3ª Edição', score: 75, status: 'Em Reciclagem', date: '12 Jul 2026', alert: true },
                { sede: 'REM Salvador', cycle: '1ª Edição', score: 85, status: 'Em Avaliação', date: '14 Ago 2026', alert: false },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pulse-cyan/10 text-pulse-cyan rounded-sm">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-sm text-on-surface">{item.sede}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{item.cycle}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-on-surface">{item.score}/100</span>
                      {item.alert && <AlertTriangle className="w-4 h-4 text-action-orange" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                      item.status === 'Homologada' ? 'bg-green-100 text-green-800' :
                      item.status === 'Em Reciclagem' ? 'bg-red-100 text-red-800' :
                      'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{item.date}</td>
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
