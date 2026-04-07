'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Download, BarChart3, AlertTriangle, CheckCircle2, FileWarning, Eye, Edit, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AuditPage() {
  const { roles } = useAuth();
  const hasAccess = roles.some(r => r.role_code === 'super_admin' || r.role_code === 'national_director');

  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 50;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchAuditEvents = useCallback(async () => {
    if (!hasAccess) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Get total count
    const { count } = await supabase
      .from('audit_events')
      .select('*', { count: 'exact', head: true });
      
    setTotalCount(count || 0);

    // Get paginated data
    const { data, error } = await supabase
      .from('audit_events')
      .select(`
        *,
        users:user_id (full_name, email),
        headquarters:headquarters_id (name)
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
    
    if (error) console.error('Error fetching audit events:', error);
    else setAuditEvents(data || []);
    
    setLoading(false);
  }, [supabase, page, hasAccess]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAuditEvents();
  }, [fetchAuditEvents]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (!hasAccess) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        Você não tem permissão para acessar esta página.
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    if (action.includes('read') || action.includes('view')) return <Eye className="w-4 h-4 text-pulse-cyan" />;
    if (action.includes('update') || action.includes('edit')) return <Edit className="w-4 h-4 text-pulse-cyan" />;
    if (action.includes('delete')) return <FileWarning className="w-4 h-4 text-action-orange" />;
    if (action.includes('login') || action.includes('auth')) return <ShieldAlert className="w-4 h-4 text-pulse-cyan" />;
    return <CheckCircle2 className="w-4 h-4 text-pulse-cyan" />;
  };

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

      {/* Data Table (Live Feed Style) */}
      <div className="bg-white border border-outline/30 rounded-sm mb-12 overflow-hidden shadow-sm">
        <div className="p-6 flex justify-between items-center border-b border-outline/30 bg-surface-container/30">
          <h3 className="font-black text-xl uppercase italic tracking-tight">Log de Atividades Detalhado</h3>
          <span className="text-[10px] technical-label font-black text-on-surface-variant uppercase">
            Exibindo {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, totalCount)} de {totalCount} registros
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container text-[10px] technical-label text-on-surface-variant uppercase font-bold border-b border-outline/30">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Sede</th>
                <th className="px-6 py-4">Ação</th>
                <th className="px-6 py-4">Tipo de Referência</th>
                <th className="px-6 py-4">Data/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Carregando logs...</td>
                </tr>
              ) : auditEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Nenhum registro encontrado.</td>
                </tr>
              ) : (
                auditEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pulse-cyan/10 flex items-center justify-center text-pulse-cyan font-bold text-[10px]">
                          {event.users?.full_name?.substring(0, 2).toUpperCase() || 'NA'}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{event.users?.full_name || 'Sistema'}</div>
                          <div className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">
                            {event.users?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-xs uppercase text-on-surface-variant">
                      {event.headquarters?.name || 'Geral'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getActionIcon(event.action)}
                        <span className="text-xs font-bold">{event.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">
                      {event.reference_type}
                    </td>
                    <td className="px-6 py-4 text-[10px] technical-label font-medium">
                      {format(new Date(event.created_at), "dd/MM/yyyy HH:mm:ss")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-6 bg-surface-container-low flex justify-center items-center border-t border-outline/30">
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center bg-white border border-outline/50 hover:bg-surface-container transition-all text-on-surface-variant disabled:opacity-50"
              >
                &lt;
              </button>
              <span className="flex items-center justify-center px-4 text-[10px] technical-label font-black">
                Página {page} de {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center bg-white border border-outline/50 hover:bg-surface-container transition-all text-on-surface-variant disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
