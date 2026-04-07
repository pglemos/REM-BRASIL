'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Search, CheckCircle2, Clock, Edit, Trash2, Globe, Layout, FileEdit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';
import { Modal } from '@/components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const publicPageSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(2, 'Slug deve ter pelo menos 2 caracteres').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  page_type: z.enum(['institutional', 'news', 'faq', 'landing']),
  current_status: z.enum(['draft', 'published', 'archived']),
  summary: z.string().optional(),
  body_md: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
});

type PublicPageFormValues = z.infer<typeof publicPageSchema>;

export default function ContentPage() {
  const { roles, user } = useAuth();
  const hasAccess = roles.some(r => r.role_code === 'super_admin' || r.role_code === 'national_director' || r.role_code === 'local_director');

  const [activeTab, setActiveTab] = useState<'official' | 'public'>('official');
  const [contents, setContents] = useState<any[]>([]);
  const [publicPages, setPublicPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PublicPageFormValues>({
    resolver: zodResolver(publicPageSchema),
    defaultValues: {
      current_status: 'draft',
      page_type: 'institutional',
    }
  });

  const fetchContents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_items')
      .select(`
        *,
        content_versions (
          version_code,
          workflow_status,
          is_mandatory,
          published_at,
          updated_at
        )
      `)
      .order('updated_at', { ascending: false });
    
    if (error) console.error('Error fetching contents:', error);
    else setContents(data || []);
    setLoading(false);
  }, [supabase]);

  const fetchPublicPages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('public_pages')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) console.error('Error fetching public pages:', error);
    else setPublicPages(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (activeTab === 'official') fetchContents();
    else fetchPublicPages();
  }, [activeTab, fetchContents, fetchPublicPages]);

  const filteredContents = contents.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPublicPages = publicPages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLatestVersion = (versions: any[]) => {
    if (!versions || versions.length === 0) return null;
    return versions.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
  };

  const openNewModal = () => {
    setEditingPage(null);
    reset({
      title: '',
      slug: '',
      page_type: 'institutional',
      current_status: 'draft',
      summary: '',
      body_md: '',
    });
    setIsModalOpen(true);
  };

  const handleEditPage = (page: any) => {
    setEditingPage(page);
    reset({
      title: page.title,
      slug: page.slug,
      page_type: page.page_type,
      current_status: page.current_status,
      summary: page.summary || '',
      body_md: page.body_md || '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: PublicPageFormValues) => {
    try {
      if (editingPage) {
        const { error } = await supabase
          .from('public_pages')
          .update({
            ...values,
            updated_by_user_id: user?.id,
            updated_at: new Date().toISOString(),
            published_at: values.current_status === 'published' ? new Date().toISOString() : editingPage.published_at
          })
          .eq('id', editingPage.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('public_pages')
          .insert([{
            ...values,
            created_by_user_id: user?.id,
            updated_by_user_id: user?.id,
            published_at: values.current_status === 'published' ? new Date().toISOString() : null
          }]);
        
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchPublicPages();
    } catch (error) {
      console.error('Error saving public page:', error);
      alert('Erro ao salvar página pública.');
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta página?')) return;
    
    try {
      const { error } = await supabase.from('public_pages').delete().eq('id', id);
      if (error) throw error;
      fetchPublicPages();
    } catch (error) {
      console.error('Error deleting public page:', error);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Gestão de Conteúdo</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Centro de Publicações</h1>
          <p className="text-on-surface-variant mt-2 font-bold text-sm technical-label uppercase">Manuais internos e páginas do portal público</p>
        </div>
        {hasAccess && (
          <button 
            onClick={activeTab === 'public' ? openNewModal : undefined}
            className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {activeTab === 'public' ? 'Nova Página Pública' : 'Novo Conteúdo Oficial'}
          </button>
        )}
      </header>

      <div className="flex border-b border-outline/30 gap-8">
        <button 
          onClick={() => setActiveTab('official')}
          className={`pb-4 text-xs technical-label font-black uppercase tracking-widest transition-all relative ${activeTab === 'official' ? 'text-pulse-cyan' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Conteúdos Oficiais
          {activeTab === 'official' && <span className="absolute bottom-0 left-0 w-full h-1 bg-pulse-cyan"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('public')}
          className={`pb-4 text-xs technical-label font-black uppercase tracking-widest transition-all relative ${activeTab === 'public' ? 'text-pulse-cyan' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Portal Público (CMS)
          {activeTab === 'public' && <span className="absolute bottom-0 left-0 w-full h-1 bg-pulse-cyan"></span>}
        </button>
      </div>

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
              placeholder={activeTab === 'official' ? "Buscar manuais e guias..." : "Buscar páginas e notícias..."}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'official' ? (
            <table className="w-full text-left">
              <thead className="bg-surface-container text-[10px] technical-label text-on-surface-variant uppercase font-bold border-b border-outline/30">
                <tr>
                  <th className="px-6 py-4">Conteúdo</th>
                  <th className="px-6 py-4">Versão</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Obrigatório</th>
                  <th className="px-6 py-4">Atualizado</th>
                  {hasAccess && <th className="px-6 py-4 text-right">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/30">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Carregando conteúdos...</td>
                  </tr>
                ) : filteredContents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Nenhum conteúdo encontrado.</td>
                  </tr>
                ) : (
                  filteredContents.map((content) => {
                    const latestVersion = getLatestVersion(content.content_versions);
                    return (
                      <tr key={content.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-pulse-cyan/10 text-pulse-cyan rounded-sm">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="font-bold text-sm text-on-surface block">{content.title}</span>
                              <span className="text-[10px] technical-label font-bold text-on-surface-variant uppercase">{content.type}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-black text-on-surface-variant bg-surface-container-low rounded-sm inline-block px-2 py-1">
                            {latestVersion ? latestVersion.version_code : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {latestVersion ? (
                            <span className={`inline-flex items-center px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                              latestVersion.workflow_status === 'publicado' ? 'bg-green-100 text-green-800' :
                              latestVersion.workflow_status === 'em_revisao' ? 'bg-amber-100 text-amber-800' :
                              'bg-surface-container-high text-on-surface-variant'
                            }`}>
                              {latestVersion.workflow_status === 'publicado' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {latestVersion.workflow_status === 'em_revisao' && <Clock className="w-3 h-3 mr-1" />}
                              {latestVersion.workflow_status.replace(/_/g, ' ')}
                            </span>
                          ) : (
                            <span className="text-xs text-on-surface-variant">Sem versão</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-black text-on-surface">
                          {latestVersion?.is_mandatory ? 'SIM' : 'NÃO'}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                          {content.updated_at ? format(new Date(content.updated_at), 'dd MMM yyyy') : '--'}
                        </td>
                        {hasAccess && (
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="text-on-surface-variant hover:text-pulse-cyan p-1">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-on-surface-variant hover:text-red-500 p-1">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-surface-container text-[10px] technical-label text-on-surface-variant uppercase font-bold border-b border-outline/30">
                <tr>
                  <th className="px-6 py-4">Página</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Publicado em</th>
                  {hasAccess && <th className="px-6 py-4 text-right">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/30">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Carregando páginas públicas...</td>
                  </tr>
                ) : filteredPublicPages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Nenhuma página encontrada.</td>
                  </tr>
                ) : (
                  filteredPublicPages.map((page) => (
                    <tr key={page.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-pulse-cyan/10 text-pulse-cyan rounded-sm">
                            <Globe className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-on-surface block">{page.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-on-surface-variant bg-surface-container-low rounded-sm inline-block px-2 py-1">
                          /{page.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] technical-label font-bold text-on-surface-variant uppercase">{page.page_type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                          page.current_status === 'published' ? 'bg-green-100 text-green-800' :
                          page.current_status === 'draft' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {page.current_status === 'published' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {page.current_status === 'draft' && <Clock className="w-3 h-3 mr-1" />}
                          {page.current_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                        {page.published_at ? format(new Date(page.published_at), 'dd MMM yyyy') : '--'}
                      </td>
                      {hasAccess && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleEditPage(page)}
                              className="text-on-surface-variant hover:text-pulse-cyan p-1"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeletePage(page.id)}
                              className="text-on-surface-variant hover:text-red-500 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPage ? 'Editar Página Pública' : 'Nova Página Pública'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs technical-label font-black text-on-surface uppercase">Título</label>
              <input
                {...register('title')}
                className="w-full px-4 py-2 border border-outline/50 rounded-sm bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan text-sm"
                placeholder="Ex: Sobre o REM"
              />
              {errors.title && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs technical-label font-black text-on-surface uppercase">Slug (URL)</label>
              <div className="flex items-center">
                <span className="bg-surface-container-high px-3 py-2 border border-r-0 border-outline/50 rounded-l-sm text-xs text-on-surface-variant font-bold">/</span>
                <input
                  {...register('slug')}
                  className="flex-1 px-4 py-2 border border-outline/50 rounded-r-sm bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan text-sm"
                  placeholder="sobre-o-rem"
                />
              </div>
              {errors.slug && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs technical-label font-black text-on-surface uppercase">Tipo de Página</label>
              <select
                {...register('page_type')}
                className="w-full px-4 py-2 border border-outline/50 rounded-sm bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan text-sm"
              >
                <option value="institutional">Institucional</option>
                <option value="news">Notícia / Blog</option>
                <option value="faq">FAQ / Ajuda</option>
                <option value="landing">Landing Page</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs technical-label font-black text-on-surface uppercase">Status</label>
              <select
                {...register('current_status')}
                className="w-full px-4 py-2 border border-outline/50 rounded-sm bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan text-sm"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs technical-label font-black text-on-surface uppercase">Resumo / Sumário</label>
            <textarea
              {...register('summary')}
              rows={2}
              className="w-full px-4 py-2 border border-outline/50 rounded-sm bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan text-sm resize-none"
              placeholder="Breve descrição para listagens e SEO..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs technical-label font-black text-on-surface uppercase flex items-center gap-2">
              Conteúdo (Markdown) <FileEdit className="w-3 h-3" />
            </label>
            <textarea
              {...register('body_md')}
              rows={10}
              className="w-full px-4 py-2 border border-outline/50 rounded-sm bg-surface-container font-mono focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan text-sm"
              placeholder="# Título Principal&#10;&#10;Escreva o conteúdo da página aqui usando Markdown..."
            />
            {errors.body_md && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.body_md.message}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-outline/50 rounded-sm text-xs technical-label font-black uppercase hover:bg-surface-container transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-pulse-cyan text-white rounded-sm text-xs technical-label font-black uppercase shadow-lg shadow-pulse-cyan/20 hover:bg-cyan-400 transition-all"
            >
              {editingPage ? 'Salvar Alterações' : 'Criar Página'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

