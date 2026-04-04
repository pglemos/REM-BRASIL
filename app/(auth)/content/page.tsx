import { FileText, Plus, Search, MoreVertical, CheckCircle2, Clock } from 'lucide-react';

export default function ContentPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Gestão</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Conteúdos Oficiais</h1>
          <p className="text-on-surface-variant mt-2 font-bold text-sm technical-label uppercase">Manuais, guias e materiais do REM</p>
        </div>
        <button className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Conteúdo
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
              placeholder="Buscar conteúdo por título ou tipo..."
            />
          </div>
          <select className="border border-outline/50 rounded-sm text-xs technical-label font-black py-2.5 px-4 bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan">
            <option>Todos os Status</option>
            <option>Publicado</option>
            <option>Em Revisão</option>
            <option>Rascunho</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container text-[10px] technical-label text-on-surface-variant uppercase font-bold border-b border-outline/30">
              <tr>
                <th className="px-6 py-4">Conteúdo</th>
                <th className="px-6 py-4">Versão</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Obrigatório</th>
                <th className="px-6 py-4">Atualizado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {[
                { title: 'Manual do Host', type: 'PDF', version: 'v2.1', status: 'Publicado', mandatory: true, date: '10 Ago 2026' },
                { title: 'Guião - ACTO 4', type: 'Documento', version: 'v1.4', status: 'Publicado', mandatory: true, date: '05 Ago 2026' },
                { title: 'Vídeo de Abertura', type: 'Vídeo', version: 'v1.0', status: 'Em Revisão', mandatory: false, date: '12 Ago 2026' },
                { title: 'Checklist de Compras', type: 'Checklist', version: 'v3.0', status: 'Rascunho', mandatory: false, date: '14 Ago 2026' },
              ].map((content, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pulse-cyan/10 text-pulse-cyan rounded-sm">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-on-surface block">{content.title}</span>
                        <span className="text-[10px] technical-label font-bold text-on-surface-variant uppercase">{content.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-on-surface-variant bg-surface-container-low rounded-sm inline-block mt-4 ml-6">{content.version}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                      content.status === 'Publicado' ? 'bg-green-100 text-green-800' :
                      content.status === 'Em Revisão' ? 'bg-amber-100 text-amber-800' :
                      'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {content.status === 'Publicado' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {content.status === 'Em Revisão' && <Clock className="w-3 h-3 mr-1" />}
                      {content.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-on-surface">{content.mandatory ? 'SIM' : 'NÃO'}</td>
                  <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{content.date}</td>
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
