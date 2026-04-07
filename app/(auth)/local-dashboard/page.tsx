'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Users, CheckSquare, AlertCircle, Clock, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardLocal() {
  const { roles } = useAuth();
  
  // Find the first role that has an edition_id or headquarters_id
  const localRole = roles.find(r => r.edition_id || r.headquarters_id);
  const editionId = localRole?.edition_id;
  const headquartersId = localRole?.headquarters_id;

  const [edition, setEdition] = useState<any>(null);
  const [headquarters, setHeadquarters] = useState<any>(null);
  const [stats, setStats] = useState({
    couplesCount: 0,
    staffCount: 0,
    actosReady: 0,
    actosTotal: 0,
    pendingIssues: 0
  });
  const [actos, setActos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    
    try {
      let currentEditionId = editionId;

      // If we only have headquarters_id, find the latest active edition for it
      if (!currentEditionId && headquartersId) {
        const { data: hq } = await supabase
          .from('headquarters')
          .select('name')
          .eq('id', headquartersId)
          .single();
        
        if (hq) setHeadquarters(hq);

        const { data: eds } = await supabase
          .from('editions')
          .select('*')
          .eq('headquarters_id', headquartersId)
          .order('start_at', { ascending: false })
          .limit(1);
        
        if (eds && eds.length > 0) {
          currentEditionId = eds[0].id;
          setEdition(eds[0]);
        }
      } else if (currentEditionId) {
        const { data: ed } = await supabase
          .from('editions')
          .select('*, headquarters(name)')
          .eq('id', currentEditionId)
          .single();
        
        if (ed) {
          setEdition(ed);
          setHeadquarters(ed.headquarters);
        }
      }

      if (currentEditionId) {
        // Fetch stats
        const [couplesRes, staffRes, actosRes] = await Promise.all([
          supabase.from('couples').select('id', { count: 'exact', head: true }).eq('edition_id', currentEditionId),
          supabase.from('edition_staff').select('id', { count: 'exact', head: true }).eq('edition_id', currentEditionId),
          supabase.from('actos').select('id, current_status, title, planned_start_at, sequence_order').eq('edition_id', currentEditionId).order('sequence_order', { ascending: true })
        ]);

        const actosData = actosRes.data || [];
        const readyCount = actosData.filter(a => a.current_status === 'pronto' || a.current_status === 'concluido_no_horario').length;
        const pendingCount = actosData.filter(a => a.current_status === 'bloqueado' || a.current_status === 'em_preparacao').length;

        setStats({
          couplesCount: couplesRes.count || 0,
          staffCount: staffRes.count || 0,
          actosReady: readyCount,
          actosTotal: actosData.length,
          pendingIssues: pendingCount
        });

        setActos(actosData.slice(0, 5)); // First 5 actos for the timeline
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, editionId, headquartersId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant">Carregando dashboard...</div>;
  }

  if (!edition && !headquarters) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        Nenhuma edição ou sede vinculada ao seu perfil.
      </div>
    );
  }

  const daysUntil = edition?.start_at ? Math.ceil((new Date(edition.start_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{headquarters?.name || 'Sede Local'}</h1>
          <p className="text-sm text-gray-500">
            {edition ? `Próxima edição: ${format(new Date(edition.start_at), "dd 'a' dd 'de' MMMM, yyyy", { locale: ptBR })}` : 'Nenhuma edição programada'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/actos" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
            Ver Cronograma
          </Link>
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
            Modo Execução
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {edition && daysUntil > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Edição em Preparação - Faltam {daysUntil} dias</h3>
            <p className="text-sm text-amber-700 mt-1">
              A edição ainda não pode ser marcada como &quot;Pronta&quot;. Faltam responsáveis por ACTO e itens críticos no checklist.
            </p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Casais</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">{stats.couplesCount}</span>
            <span className="text-sm text-gray-500 ml-2">inscritos</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, (stats.couplesCount / 50) * 100)}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Staff & Guias</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">{stats.staffCount}</span>
            <span className="text-sm text-gray-500 ml-2">ativos</span>
          </div>
          <p className="text-xs text-green-600 mt-2 font-medium">Equipe em formação</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">ACTOS Prontos</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">{stats.actosReady}</span>
            <span className="text-sm text-gray-500 ml-2">/ {stats.actosTotal}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${stats.actosTotal > 0 ? (stats.actosReady / stats.actosTotal) * 100 : 0}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Pendências</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">{stats.pendingIssues}</span>
            <span className="text-sm text-gray-500 ml-2">críticas</span>
          </div>
          <p className="text-xs text-red-600 mt-2 font-medium">Requer atenção imediata</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Passos / Pendências */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Ação Necessária</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-4 hover:bg-gray-50 flex items-start gap-4">
              <div className="mt-1">
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Revisar Equipe</h4>
                <p className="text-sm text-gray-500 mt-1">Verifique se todos os papéis críticos estão preenchidos.</p>
              </div>
              <Link href="/staff" className="text-sm font-medium text-blue-600 hover:text-blue-800">Resolver</Link>
            </div>
            <div className="p-4 hover:bg-gray-50 flex items-start gap-4">
              <div className="mt-1">
                <CheckSquare className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Verificar ACTOS</h4>
                <p className="text-sm text-gray-500 mt-1">Existem ACTOS em preparação que precisam ser concluídos.</p>
              </div>
              <Link href="/actos" className="text-sm font-medium text-blue-600 hover:text-blue-800">Resolver</Link>
            </div>
          </div>
        </div>

        {/* Resumo do Cronograma */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Trilha de ACTOS</h2>
            <Link href="/actos" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
              Ver todos <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6">
            {actos.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">Nenhum acto cadastrado para esta edição.</p>
            ) : (
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                {actos.map((acto) => (
                  <div key={acto.id} className="relative pl-6">
                    <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ring-4 ring-white ${
                      acto.current_status === 'pronto' ? 'bg-green-500' :
                      acto.current_status === 'bloqueado' ? 'bg-red-500' :
                      'bg-amber-500'
                    }`}></div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {acto.planned_start_at ? format(new Date(acto.planned_start_at), 'HH:mm') : '--:--'}
                    </p>
                    <h4 className="text-sm font-bold text-gray-900">ACTO {acto.sequence_order} - {acto.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">Status: {acto.current_status.replace(/_/g, ' ')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
