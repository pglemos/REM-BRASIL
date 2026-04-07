'use client';

import { useState, useEffect, use } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Building2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PublicSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [type, setType] = useState<'page' | 'hq' | 'edition' | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function resolveSlug() {
      setLoading(true);
      try {
        // 1. Check public_pages
        const { data: page } = await supabase
          .from('public_pages')
          .select('*')
          .eq('slug', slug)
          .eq('current_status', 'published')
          .single();

        if (page) {
          setData(page);
          setType('page');
          return;
        }

        // 2. Check headquarters
        const { data: hq } = await supabase
          .from('headquarters')
          .select('*')
          .eq('public_slug', slug)
          .eq('is_public', true)
          .single();

        if (hq) {
          setData(hq);
          setType('hq');
          return;
        }

        // 3. Check editions
        const { data: edition } = await supabase
          .from('editions')
          .select('*, headquarters(name)')
          .eq('public_slug', slug)
          .eq('is_public', true)
          .single();

        if (edition) {
          setData(edition);
          setType('edition');
          return;
        }
      } catch (error) {
        console.error('Error resolving slug:', error);
      } finally {
        setLoading(false);
      }
    }

    resolveSlug();
  }, [slug, supabase]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black uppercase mb-4">404</h1>
        <p className="text-gray-500 mb-8 max-w-md">A página ou evento que você procura não foi encontrado ou não está mais público.</p>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-sm font-bold uppercase text-sm shadow-xl hover:bg-gray-800 transition-all">Voltar para Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {type === 'hq' && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-pulse-cyan">
            <Building2 className="w-8 h-8" />
            <span className="text-sm font-black uppercase tracking-widest">Sede Oficial</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{data.name}</h1>
          <div className="grid md:grid-cols-2 gap-12 pt-8">
            <div className="space-y-6">
              <p className="text-xl text-gray-600 leading-relaxed">Bem-vindo à sede do REM em {data.city}, {data.state}. Aqui realizamos edições periódicas para transformar vidas e fortalecer comunidades.</p>
              <div className="flex items-center gap-3 text-gray-500">
                <MapPin className="w-5 h-5" />
                <span className="font-bold">{data.city} - {data.state}, {data.country}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-sm border border-gray-100">
              <h3 className="text-lg font-black uppercase mb-4">Próximas Edições</h3>
              <p className="text-sm text-gray-500 italic">Consulte o calendário oficial para as próximas datas nesta sede.</p>
              <Link href="/calendario" className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase text-pulse-cyan hover:underline">
                Ver Calendário <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {type === 'edition' && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-pulse-cyan">
            <Calendar className="w-8 h-8" />
            <span className="text-sm font-black uppercase tracking-widest">Edição Confirmada</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{data.name}</h1>
          <p className="text-2xl font-bold text-gray-400 uppercase tracking-tight">{data.headquarters?.name}</p>
          
          <div className="grid md:grid-cols-2 gap-12 pt-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Quando e Onde</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-lg font-bold">
                    <Calendar className="w-5 h-5 text-pulse-cyan" />
                    <span>{new Date(data.start_at).toLocaleDateString('pt-BR')} até {new Date(data.end_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg font-bold">
                    <MapPin className="w-5 h-5 text-pulse-cyan" />
                    <span>{data.venue_name}</span>
                  </div>
                  {data.venue_address && <p className="text-gray-500 ml-8">{data.venue_address}</p>}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Sobre esta edição</h3>
                <p className="text-gray-600 leading-relaxed">Esta edição do REM está sendo preparada com excelência pela sede {data.headquarters?.name}. Garanta sua participação realizando sua pré-inscrição abaixo.</p>
              </div>
            </div>

            <div className="bg-black text-white p-8 rounded-sm shadow-2xl space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tight">Inscrições Abertas</h3>
              <p className="text-gray-400 text-sm">As vagas são limitadas por edição. Preencha o formulário oficial para iniciar seu processo de participação.</p>
              <a 
                href={data.public_cta_url || '#'} 
                className="block w-full bg-pulse-cyan text-white text-center py-4 rounded-sm font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg"
              >
                Fazer Inscrição Agora
              </a>
              <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">Processamento seguro via REM OS Foundation</p>
            </div>
          </div>
        </div>
      )}

      {type === 'page' && (
        <article className="prose prose-lg max-w-none">
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-8">{data.title}</h1>
          {data.summary && <p className="text-xl text-gray-600 mb-12 font-medium">{data.summary}</p>}
          <div className="markdown-content text-gray-800 leading-relaxed">
            {data.body_md}
          </div>
        </article>
      )}
    </div>
  );
}
