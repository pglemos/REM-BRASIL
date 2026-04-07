'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Users, MapPin, Calendar, FileText } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function DashboardPage() {
  const { user, roles, signOut } = useAuth();
  const [stats, setStats] = useState({
    headquarters: 0,
    editions: 0,
    couples: 0,
    content: 0
  });
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [hqRes, edRes, cpRes, ctRes] = await Promise.all([
        supabase.from('headquarters').select('*', { count: 'exact', head: true }),
        supabase.from('editions').select('*', { count: 'exact', head: true }),
        supabase.from('couples').select('*', { count: 'exact', head: true }),
        supabase.from('content_items').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        headquarters: hqRes.count || 0,
        editions: edRes.count || 0,
        couples: cpRes.count || 0,
        content: ctRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const isNational = roles.some(r => r.scope_type === 'national');

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Visão Geral</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Dashboard</h1>
        </div>
        <button 
          onClick={signOut}
          className="bg-surface-container-high text-on-surface px-6 py-2.5 font-black text-xs technical-label uppercase shadow-sm active:scale-95 transition-all flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </header>

      <div className="bg-white border border-outline/30 rounded-sm shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Bem-vindo, {user?.email}</h2>
        
        <div className="mt-6">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase mb-2">Seus Papéis:</h3>
          {roles.length > 0 ? (
            <ul className="space-y-2">
              {roles.map((role, i) => (
                <li key={i} className="bg-surface-container-low p-3 rounded-sm border border-outline/30 flex items-center gap-3">
                  <span className="bg-pulse-cyan text-white px-2 py-1 text-[10px] font-bold uppercase rounded-sm">
                    {role.role_code}
                  </span>
                  <span className="text-sm text-on-surface-variant">
                    Escopo: {role.scope_type}
                    {role.headquarters_id && ` | Sede: ${role.headquarters_id}`}
                    {role.edition_id && ` | Edição: ${role.edition_id}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-on-surface-variant">Nenhum papel atribuído.</p>
          )}
        </div>
      </div>

      {isNational && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-outline/30 rounded-sm p-6 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-action-orange/10 rounded-full">
              <MapPin className="w-6 h-6 text-action-orange" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Sedes</p>
              <p className="text-2xl font-black">{stats.headquarters}</p>
            </div>
          </div>
          <div className="bg-white border border-outline/30 rounded-sm p-6 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-pulse-cyan/10 rounded-full">
              <Calendar className="w-6 h-6 text-pulse-cyan" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Edições</p>
              <p className="text-2xl font-black">{stats.editions}</p>
            </div>
          </div>
          <div className="bg-white border border-outline/30 rounded-sm p-6 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Casais</p>
              <p className="text-2xl font-black">{stats.couples}</p>
            </div>
          </div>
          <div className="bg-white border border-outline/30 rounded-sm p-6 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-full">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Conteúdos</p>
              <p className="text-2xl font-black">{stats.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
