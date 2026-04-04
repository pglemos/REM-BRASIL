import { 
  Building2, 
  CalendarCheck, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  FileWarning,
  ArrowRight
} from 'lucide-react';

export default function DashboardNacional() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Visão Geral</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Dashboard Nacional</h1>
        </div>
        <div className="flex gap-4">
          <select className="bg-surface-container border border-outline/50 text-xs technical-label font-black py-2.5 px-4 focus:ring-pulse-cyan rounded-sm">
            <option>Últimos 30 dias</option>
            <option>Este ano</option>
          </select>
          <button className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all">
            Exportar Relatório
          </button>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Sedes Totais', value: '42', icon: Building2, color: 'text-pulse-cyan', trend: '+3' },
          { title: 'Edições Futuras', value: '18', icon: CalendarCheck, color: 'text-action-orange' },
          { title: 'Compliance', value: '87%', icon: CheckCircle2, color: 'text-pulse-cyan' },
          { title: 'Pendências', value: '5', icon: AlertTriangle, color: 'text-action-orange' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 border-l-4 border-pulse-cyan shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="technical-label text-[10px] font-black uppercase text-on-surface-variant">{kpi.title}</h3>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-on-surface">{kpi.value}</span>
              {kpi.trend && <span className="text-xs font-bold text-pulse-cyan flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> {kpi.trend}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fila de Homologação */}
        <div className="lg:col-span-2 bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-outline/30 flex items-center justify-between">
            <h2 className="font-black text-xl uppercase italic">Fila de Homologação</h2>
            <Link href="/homologation" className="text-xs technical-label font-black uppercase text-pulse-cyan hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-outline/30">
            {[
              { sede: 'REM São Paulo', status: '3ª Edição Concluída', score: 88, alert: false },
              { sede: 'REM Belo Horizonte', status: 'Em Avaliação', score: 92, alert: false },
              { sede: 'REM Curitiba', status: 'Em Reciclagem', score: 75, alert: true },
              { sede: 'REM Salvador', status: '2ª Edição Concluída', score: 85, alert: false },
            ].map((item, i) => (
              <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${item.alert ? 'bg-action-orange' : 'bg-pulse-cyan'}`}></div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{item.sede}</p>
                    <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">{item.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-black text-on-surface">{item.score}/100</p>
                    <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Score</p>
                  </div>
                  <button className="px-4 py-2 text-[10px] technical-label font-black uppercase bg-surface-container hover:bg-surface-container-high transition-all">
                    Avaliar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas e Atualizações */}
        <div className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-outline/30">
            <h2 className="font-black text-xl uppercase italic">Alertas Recentes</h2>
          </div>
          <div className="p-8 space-y-8">
            {[
              { title: 'REM Rio de Janeiro', desc: 'Diretor local não confirmou leitura do novo manual.', time: 'Há 2 horas', icon: FileWarning, color: 'text-action-orange' },
              { title: 'REM Porto Alegre', desc: 'Edição próxima (3 dias) com 2 ACTOS sem responsável.', time: 'Há 5 horas', icon: AlertTriangle, color: 'text-rem-red' },
              { title: 'Nova Versão', desc: 'Manual do Host v2.1 foi publicado.', time: 'Ontem', icon: CheckCircle2, color: 'text-pulse-cyan' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-0.5">
                  <alert.icon className={`w-5 h-5 ${alert.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{alert.title}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{alert.desc}</p>
                  <p className="text-[10px] technical-label text-on-surface-variant/50 uppercase font-black mt-2">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-8 py-5 border-t border-outline/30 bg-surface-container-low">
            <button className="text-xs technical-label font-black uppercase text-on-surface w-full text-center hover:text-pulse-cyan transition-colors">
              Ver todas as notificações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link';
