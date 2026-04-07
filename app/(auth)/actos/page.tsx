'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle2, AlertCircle, Clock, ChevronRight, PlayCircle, Plus, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ActosPage() {
  const { roles } = useAuth();
  const hasAccess = roles.some(r => r.role_code === 'super_admin' || r.role_code === 'national_director' || r.role_code === 'local_director');

  const [editions, setEditions] = useState<any[]>([]);
  const [selectedEditionId, setSelectedEditionId] = useState<string>('');
  const [actos, setActos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [dateRange, setDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchEditions = useCallback(async () => {
    const { data, error } = await supabase
      .from('editions')
      .select('id, name, start_at, end_at')
      .order('start_at', { ascending: false });
    
    if (error) console.error('Error fetching editions:', error);
    else {
      setEditions(data || []);
      if (data && data.length > 0) {
        setSelectedEditionId(data[0].id);
      }
    }
  }, [supabase]);

  const fetchActos = useCallback(async (editionId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('actos')
      .select('*')
      .eq('edition_id', editionId)
      .order('day_number', { ascending: true })
      .order('sequence_order', { ascending: true });
    
    if (error) console.error('Error fetching actos:', error);
    else setActos(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEditions();
  }, [fetchEditions]);

  useEffect(() => {
    if (selectedEditionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchActos(selectedEditionId);
    }
  }, [selectedEditionId, fetchActos]);

  const selectedEdition = editions.find(e => e.id === selectedEditionId);
  const filteredActos = actos.filter(a => {
    const matchDay = a.day_number === selectedDay;
    let matchDate = true;
    if (dateRange.start && dateRange.end) {
        const actoDate = new Date(a.planned_start_at);
        matchDate = actoDate >= new Date(dateRange.start) && actoDate <= new Date(dateRange.end);
    }
    return matchDay && matchDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pronto':
      case 'concluido_no_horario':
        return 'bg-green-100 text-green-800';
      case 'em_preparacao':
      case 'aguardando_inicio':
        return 'bg-amber-100 text-amber-800';
      case 'bloqueado':
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'em_execucao':
        return 'bg-pulse-cyan/20 text-pulse-cyan';
      default:
        return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '--:--';
    return format(new Date(dateString), 'HH:mm');
  };

  const getDuration = (start: string | null, end: string | null) => {
    if (!start || !end) return '-- min';
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return `${Math.round(diff / 60000)} min`;
  };

  const exportToCSV = () => {
    if (!actos || actos.length === 0) return;

    const headers = ['Dia', 'Ordem', 'Nome', 'Status', 'Início Previsto', 'Fim Previsto', 'Início Real', 'Fim Real'];
    const csvContent = [
      headers.join(','),
      ...actos.map(a => [
        a.day_number,
        a.sequence_order,
        `"${a.name}"`,
        a.current_status,
        formatTime(a.planned_start_time),
        formatTime(a.planned_end_time),
        formatTime(a.actual_start_time),
        formatTime(a.actual_end_time)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `actos_edicao_${selectedEditionId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Operação</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Trilha por ACTO</h1>
          {editions.length > 0 && (
            <select 
              value={selectedEditionId}
              onChange={(e) => setSelectedEditionId(e.target.value)}
              className="mt-2 bg-transparent border-none text-on-surface-variant font-bold text-sm technical-label uppercase focus:ring-0 p-0 cursor-pointer hover:text-pulse-cyan transition-colors"
            >
              {editions.map(ed => (
                <option key={ed.id} value={ed.id}>{ed.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex gap-4">
          {hasAccess && (
            <button 
              onClick={exportToCSV}
              className="bg-surface-container text-on-surface-variant px-4 py-2.5 font-black text-xs technical-label uppercase shadow-sm active:scale-95 transition-all flex items-center gap-2 hover:text-pulse-cyan"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
          )}
          <select 
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="bg-surface-container border border-outline/50 text-xs technical-label font-black py-2.5 px-4 focus:ring-pulse-cyan rounded-sm"
          >
            <option value={1}>Dia 1</option>
            <option value={2}>Dia 2</option>
          </select>
          <div className="flex gap-2">
            <input type="date" onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="bg-surface-container border border-outline/50 text-xs technical-label font-black py-2.5 px-4 focus:ring-pulse-cyan rounded-sm" />
            <input type="date" onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="bg-surface-container border border-outline/50 text-xs technical-label font-black py-2.5 px-4 focus:ring-pulse-cyan rounded-sm" />
          </div>
          {hasAccess && (
            <button className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Novo Acto
            </button>
          )}
        </div>
      </header>

      <div className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-outline/30 bg-surface-container/30 flex items-center justify-between">
          <h2 className="font-black text-xl uppercase italic">
            {selectedEdition && selectedEdition.start_at ? (
              `Dia ${selectedDay} - ${format(new Date(selectedEdition.start_at), "dd 'de' MMMM", { locale: ptBR })}`
            ) : (
              `Dia ${selectedDay}`
            )}
          </h2>
          <span className="text-[10px] technical-label font-black text-on-surface-variant uppercase">{filteredActos.length} ACTOS</span>
        </div>
        
        <div className="divide-y divide-outline/30">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">Carregando actos...</div>
          ) : filteredActos.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">Nenhum acto encontrado para este dia.</div>
          ) : (
            filteredActos.map((acto) => (
              <div key={acto.id} className="p-8 hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row gap-6 sm:items-center">
                <div className="flex-shrink-0 w-20 text-center">
                  <span className="block text-lg font-black text-on-surface">{formatTime(acto.planned_start_at)}</span>
                  <span className="block text-[10px] technical-label font-bold text-on-surface-variant uppercase">
                    {getDuration(acto.planned_start_at, acto.planned_end_at)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 text-[10px] technical-label font-black uppercase bg-surface-container-high text-on-surface-variant">
                      ACTO {acto.sequence_order}
                    </span>
                    <h3 className="text-lg font-black text-on-surface uppercase italic">{acto.title}</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-4 font-medium">{acto.category || 'Sem categoria'}</p>
                  <div className="flex flex-wrap gap-4 text-[10px] technical-label font-black uppercase text-on-surface-variant">
                    {/* Placeholder for checklists */}
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:w-32">
                  <span className={`inline-flex items-center px-3 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${getStatusColor(acto.current_status)}`}>
                    {acto.current_status.replace(/_/g, ' ')}
                  </span>
                  <Link 
                    href={`/actos/${acto.id}`}
                    className="text-xs technical-label font-black uppercase text-pulse-cyan hover:text-on-surface flex items-center gap-1"
                  >
                    Abrir <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
