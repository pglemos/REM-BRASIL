'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShieldCheck, Plus, Search, MoreVertical, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';

export default function HomologationPage() {
  const { roles } = useAuth();
  const hasAccess = roles.some(r => r.role_code === 'super_admin' || r.role_code === 'national_director');

  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchCycles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('headquarters_homologation_cycles')
      .select(`
        *,
        headquarters (name),
        headquarters_reviews (total_score, has_eliminatory, recommendation, created_at)
      `)
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching homologation cycles:', error);
    else setCycles(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCycles();
  }, [fetchCycles]);

  const filteredCycles = cycles.filter(c => 
    c.headquarters?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLatestReview = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return null;
    return reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Qualidade</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Homologação</h1>
          <p className="text-on-surface-variant mt-2 font-bold text-sm technical-label uppercase">Avaliações e ciclos de homologação de sedes</p>
        </div>
        {hasAccess && (
          <button className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nova Avaliação
          </button>
        )}
      </header>

      <div className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container/30">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-on-surface-variant" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-outline/50 rounded-sm leading-5 bg-surface-container text-xs technical-label font-black focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan"
              placeholder="Buscar por sede..."
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Carregando ciclos de homologação...</td>
                </tr>
              ) : filteredCycles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Nenhum ciclo encontrado.</td>
                </tr>
              ) : (
                filteredCycles.map((cycle) => {
                  const latestReview = getLatestReview(cycle.headquarters_reviews);
                  return (
                    <tr key={cycle.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-pulse-cyan/10 text-pulse-cyan rounded-sm">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-sm text-on-surface">{cycle.headquarters?.name || 'Sede Desconhecida'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">Ciclo {cycle.cycle_number}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-on-surface">
                            {latestReview?.total_score ? `${latestReview.total_score}/100` : '--'}
                          </span>
                          {latestReview?.has_eliminatory && <AlertTriangle className="w-4 h-4 text-action-orange" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                          cycle.current_status === 'homologada' ? 'bg-green-100 text-green-800' :
                          cycle.current_status === 'em_reciclagem' ? 'bg-red-100 text-red-800' :
                          'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {cycle.current_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                        {latestReview?.created_at ? format(new Date(latestReview.created_at), 'dd MMM yyyy') : '--'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/homologation/${cycle.id}`}
                          className="text-on-surface-variant hover:text-pulse-cyan flex items-center justify-end gap-1 text-xs technical-label font-bold uppercase"
                        >
                          Ver <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
