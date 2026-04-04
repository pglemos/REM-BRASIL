import { FileText, CheckCircle2, AlertCircle, Clock, ChevronRight, PlayCircle } from 'lucide-react';

export default function ActosPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Operação</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Trilha por ACTO</h1>
          <p className="text-on-surface-variant mt-2 font-bold text-sm technical-label uppercase">REM São Paulo - Agosto 2026</p>
        </div>
        <select className="bg-surface-container border border-outline/50 text-xs technical-label font-black py-2.5 px-4 focus:ring-pulse-cyan rounded-sm">
          <option>Dia 1 (15 Ago)</option>
          <option>Dia 2 (16 Ago)</option>
          <option>Dia 3 (17 Ago)</option>
        </select>
      </header>

      <div className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-outline/30 bg-surface-container/30 flex items-center justify-between">
          <h2 className="font-black text-xl uppercase italic">Sábado, 15 de Agosto (Dia 1)</h2>
          <span className="text-[10px] technical-label font-black text-on-surface-variant uppercase">18 ACTOS</span>
        </div>
        
        <div className="divide-y divide-outline/30">
          {[
            { id: 1, time: '08:00', duration: '60 min', title: 'Registro / Check-in', desc: 'Recepção dos casais, entrega de kits e café da manhã.', status: 'Pronto', statusColor: 'bg-green-100 text-green-800' },
            { id: 2, time: '09:30', duration: '45 min', title: 'Nosso percurso', desc: 'Dinâmica no ônibus e preparação para a caminhada.', status: 'Pronto', statusColor: 'bg-green-100 text-green-800' },
            { id: 3, time: '10:45', duration: '90 min', title: 'Início da caminhada', desc: 'Caminhada com sacolas de areia e reflexão.', status: 'Em Preparação', statusColor: 'bg-amber-100 text-amber-800' },
            { id: 4, time: '12:30', duration: '45 min', title: 'Marta e Marto', desc: 'Dinâmica de confiança com olhos vendados.', status: 'Bloqueado', statusColor: 'bg-red-100 text-red-800' },
          ].map((acto) => (
            <div key={acto.id} className="p-8 hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row gap-6 sm:items-center">
              <div className="flex-shrink-0 w-20 text-center">
                <span className="block text-lg font-black text-on-surface">{acto.time}</span>
                <span className="block text-[10px] technical-label font-bold text-on-surface-variant uppercase">{acto.duration}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 text-[10px] technical-label font-black uppercase bg-surface-container-high text-on-surface-variant">
                    ACTO {acto.id}
                  </span>
                  <h3 className="text-lg font-black text-on-surface uppercase italic">{acto.title}</h3>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 font-medium">{acto.desc}</p>
                <div className="flex flex-wrap gap-4 text-[10px] technical-label font-black uppercase text-on-surface-variant">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-pulse-cyan" /> Checklist OK</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-pulse-cyan" /> Materiais OK</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:w-32">
                <span className={`inline-flex items-center px-3 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${acto.statusColor}`}>
                  {acto.status}
                </span>
                <button className="text-xs technical-label font-black uppercase text-pulse-cyan hover:text-on-surface flex items-center gap-1">
                  Abrir <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
