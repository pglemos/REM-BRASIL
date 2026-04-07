'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Calendar, MapPin, Search, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PublicCalendarPage() {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('Todos os Estados');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('editions')
        .select('*, headquarters(name, state, city)')
        .eq('is_public', true)
        .order('start_at', { ascending: true });
      
      if (error) console.error('Error fetching public calendar:', error);
      else setEditions(data || []);
    } catch (error) {
      console.error('Error in calendar fetch:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const states = Array.from(new Set(editions.map(e => e.headquarters?.state))).filter(Boolean).sort();

  const filteredEditions = editions.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        e.headquarters?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.headquarters?.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchState = stateFilter === 'Todos os Estados' || e.headquarters?.state === stateFilter;
    return matchSearch && matchState;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="space-y-4 mb-12">
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Calendário Oficial</h1>
        <p className="text-xl text-gray-500 max-w-2xl">Encontre a próxima edição do REM mais próxima de você e inicie sua jornada de transformação.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, sede ou cidade..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-pulse-cyan/20 focus:border-pulse-cyan"
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select 
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-pulse-cyan/20 focus:border-pulse-cyan appearance-none"
          >
            <option>Todos os Estados</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-sm"></div>
          ))}
        </div>
      ) : filteredEditions.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-sm border border-dashed border-gray-200">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-widest">Nenhuma edição pública encontrada</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEditions.map(edition => (
            <div key={edition.id} className="group bg-white border border-gray-100 rounded-sm shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col">
              <div className="p-8 flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="bg-gray-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {edition.headquarters?.state}
                  </div>
                  <div className="text-pulse-cyan">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight leading-none group-hover:text-pulse-cyan transition-colors">{edition.name}</h3>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{edition.headquarters?.name}</p>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                    <Calendar className="w-4 h-4 text-pulse-cyan" />
                    <span>{new Date(edition.start_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                    <MapPin className="w-4 h-4 text-pulse-cyan" />
                    <span>{edition.headquarters?.city}, {edition.headquarters?.state}</span>
                  </div>
                </div>
              </div>

              <Link 
                href={`/${edition.public_slug || edition.id}`}
                className="bg-gray-50 p-4 text-center text-xs font-black uppercase tracking-widest border-t border-gray-100 group-hover:bg-black group-hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Ver Detalhes & Inscrição <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
