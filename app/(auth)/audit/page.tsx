import { Search, Filter, Download, BarChart3, AlertTriangle, CheckCircle2, FileWarning, Eye, Edit, ShieldAlert } from 'lucide-react';

export default function AuditPage() {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Monitoramento Nacional</span>
          <h2 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Auditoria e Logs</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Monitoramento de acesso e conformidade em tempo real para todas as sedes nacionais.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container border border-outline/50 hover:bg-surface-container-high text-[10px] technical-label font-black uppercase transition-all">
            <Filter className="w-4 h-4" /> Filtros Avançados
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container border border-outline/50 hover:bg-surface-container-high text-[10px] technical-label font-black uppercase transition-all">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
        </div>
      </header>

      {/* Bento Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Region Metric */}
        <div className="lg:col-span-8 bg-white p-8 border border-outline/30 rounded-sm shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-pulse-cyan/20 group-hover:bg-pulse-cyan transition-colors"></div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="technical-label text-[10px] font-black uppercase text-on-surface-variant">Adesão por Região</h3>
            <BarChart3 className="w-6 h-6 text-pulse-cyan opacity-40" />
          </div>
          <div className="flex items-end space-x-6 h-32">
            <div className="flex flex-col items-center flex-1 space-y-2 group/bar">
              <div className="w-full bg-surface-container-high rounded-t-sm relative h-[85%]">
                <div className="absolute bottom-0 w-full bg-pulse-cyan rounded-t-sm h-full group-hover/bar:brightness-110 transition-all"></div>
              </div>
              <span className="text-[10px] technical-label font-bold text-on-surface-variant">SUL</span>
            </div>
            <div className="flex flex-col items-center flex-1 space-y-2 group/bar">
              <div className="w-full bg-surface-container-high rounded-t-sm relative h-[65%]">
                <div className="absolute bottom-0 w-full bg-pulse-cyan rounded-t-sm h-full group-hover/bar:brightness-110 transition-all"></div>
              </div>
              <span className="text-[10px] technical-label font-bold text-on-surface-variant">SUDESTE</span>
            </div>
            <div className="flex flex-col items-center flex-1 space-y-2 group/bar">
              <div className="w-full bg-surface-container-high rounded-t-sm relative h-[45%]">
                <div className="absolute bottom-0 w-full bg-pulse-cyan rounded-t-sm h-full group-hover/bar:brightness-110 transition-all"></div>
              </div>
              <span className="text-[10px] technical-label font-bold text-on-surface-variant">NORTE</span>
            </div>
            <div className="flex flex-col items-center flex-1 space-y-2 group/bar">
              <div className="w-full bg-surface-container-high rounded-t-sm relative h-[75%]">
                <div className="absolute bottom-0 w-full bg-pulse-cyan rounded-t-sm h-full group-hover/bar:brightness-110 transition-all"></div>
              </div>
              <span className="text-[10px] technical-label font-bold text-on-surface-variant">CENTRO</span>
            </div>
            <div className="flex flex-col items-center flex-1 space-y-2 group/bar">
              <div className="w-full bg-surface-container-high rounded-t-sm relative h-[55%]">
                <div className="absolute bottom-0 w-full bg-pulse-cyan rounded-t-sm h-full group-hover/bar:brightness-110 transition-all"></div>
              </div>
              <span className="text-[10px] technical-label font-bold text-on-surface-variant">NE</span>
            </div>
          </div>
        </div>

        {/* Side Quick Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 border-l-4 border-pulse-cyan shadow-sm flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex justify-between items-start">
              <span className="technical-label text-[10px] text-on-surface-variant uppercase font-bold">Downloads (24h)</span>
              <Download className="w-5 h-5 text-pulse-cyan" />
            </div>
            <div>
              <div className="text-4xl font-black text-on-surface">1,284</div>
              <div className="flex items-center gap-1 mt-2">
                <BarChart3 className="w-3 h-3 text-pulse-cyan" />
                <span className="text-[10px] technical-label text-pulse-cyan font-bold uppercase">+12.5% vs ontem</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 border-l-4 border-action-orange shadow-sm flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex justify-between items-start">
              <span className="technical-label text-[10px] text-on-surface-variant uppercase font-bold">Alertas Compliance</span>
              <AlertTriangle className="w-5 h-5 text-action-orange" />
            </div>
            <div>
              <div className="text-4xl font-black text-action-orange">04</div>
              <div className="text-[10px] technical-label text-on-surface-variant font-bold uppercase mt-2">Ações Críticas pendentes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <section className="bg-white p-8 border border-outline/30 rounded-sm shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] technical-label font-black uppercase text-on-surface-variant">Filtrar por Sede</label>
            <select className="w-full bg-surface-container border border-outline/50 text-xs technical-label font-black py-2.5 px-4 focus:ring-pulse-cyan rounded-sm">
              <option>Todas as Sedes Nacionais</option>
              <option>São Paulo - Matriz</option>
              <option>Rio de Janeiro - Regional</option>
              <option>Brasília - Federal</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] technical-label font-black uppercase text-on-surface-variant">Filtrar por Edição</label>
            <select className="w-full bg-surface-container border border-outline/50 text-xs technical-label font-black py-2.5 px-4 focus:ring-pulse-cyan rounded-sm">
              <option>Todas as Edições</option>
              <option>ACTO 2024 Q4</option>
              <option>ACTO 2024 Q3</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] technical-label font-black uppercase text-on-surface-variant">Usuário</label>
            <input className="w-full bg-surface-container border border-outline/50 text-xs technical-label font-black py-2.5 px-4 focus:ring-pulse-cyan rounded-sm" placeholder="Nome ou ID..." type="text" />
          </div>
          <button className="bg-pulse-cyan text-white py-2.5 font-black uppercase text-xs tracking-widest shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-transform">
            Aplicar Filtros
          </button>
        </div>
      </section>

      {/* Data Table (Live Feed Style) */}
      <div className="bg-white border border-outline/30 rounded-sm mb-12 overflow-hidden shadow-sm">
        <div className="p-6 flex justify-between items-center border-b border-outline/30 bg-surface-container/30">
          <h3 className="font-black text-xl uppercase italic tracking-tight">Log de Atividades Detalhado</h3>
          <span className="text-[10px] technical-label font-black text-on-surface-variant uppercase">Exibindo 1-50 de 4.290 registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container text-[10px] technical-label text-on-surface-variant uppercase font-bold border-b border-outline/30">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Sede</th>
                <th className="px-6 py-4">Ação</th>
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Versão</th>
                <th className="px-6 py-4 text-center">Status Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {/* Row 1 */}
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pulse-cyan/10 flex items-center justify-center text-pulse-cyan font-bold text-[10px]">AM</div>
                    <div>
                      <div className="font-bold text-sm">Ana Martins</div>
                      <div className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">ID: 4829-X</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-xs uppercase text-on-surface-variant">São Paulo</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-pulse-cyan" />
                    <span className="text-xs font-bold">Viu ACTO 4</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[10px] technical-label font-medium">22/10/2023 14:32:10</td>
                <td className="px-6 py-4"><span className="font-mono font-bold text-pulse-cyan text-xs">v2.4.1</span></td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="text-[10px] technical-label px-3 py-1 bg-green-100 text-green-700 font-black border border-green-200">CONFORME</span>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-action-orange/10 flex items-center justify-center text-action-orange font-bold text-[10px]">RC</div>
                    <div>
                      <div className="font-bold text-sm">Ricardo Costa</div>
                      <div className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">ID: 9912-A</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-xs uppercase text-on-surface-variant">Brasília</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-action-orange" />
                    <span className="text-xs font-bold">Baixou PDF Técnico</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[10px] technical-label font-medium">22/10/2023 13:15:45</td>
                <td className="px-6 py-4"><span className="font-mono font-bold text-pulse-cyan text-xs">v2.3.0</span></td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="text-[10px] technical-label px-3 py-1 bg-action-orange/10 text-action-orange font-black border border-action-orange/20">EM REVISÃO</span>
                  </div>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pulse-cyan/10 flex items-center justify-center text-pulse-cyan font-bold text-[10px]">JF</div>
                    <div>
                      <div className="font-bold text-sm">Juliana Farias</div>
                      <div className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">ID: 1204-B</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-xs uppercase text-on-surface-variant">Rio de Janeiro</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-pulse-cyan" />
                    <span className="text-xs font-bold">Editou Metadados</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[10px] technical-label font-medium">22/10/2023 12:44:21</td>
                <td className="px-6 py-4"><span className="font-mono font-bold text-pulse-cyan text-xs">v2.4.1</span></td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="text-[10px] technical-label px-3 py-1 bg-green-100 text-green-700 font-black border border-green-200">CONFORME</span>
                  </div>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-[10px]">OL</div>
                    <div>
                      <div className="font-bold text-sm">Otávio Lins</div>
                      <div className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">ID: 5567-C</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-xs uppercase text-on-surface-variant">Porto Alegre</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold">Falha de Autenticação</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[10px] technical-label font-medium">22/10/2023 11:02:03</td>
                <td className="px-6 py-4"><span className="font-mono font-bold text-on-surface-variant text-xs opacity-40">--</span></td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="text-[10px] technical-label px-3 py-1 bg-red-100 text-red-700 font-black border border-red-200 uppercase">Não Conforme</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-surface-container-low flex justify-center items-center border-t border-outline/30">
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-outline/50 hover:bg-surface-container transition-all text-on-surface-variant">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-pulse-cyan text-white border border-pulse-cyan text-[10px] technical-label font-black">1</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-outline/50 hover:bg-surface-container transition-all text-[10px] technical-label font-black">2</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-outline/50 hover:bg-surface-container transition-all text-[10px] technical-label font-black">3</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-outline/50 hover:bg-surface-container transition-all text-on-surface-variant">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
