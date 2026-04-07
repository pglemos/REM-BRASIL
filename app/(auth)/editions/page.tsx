'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { Modal } from '@/components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

const editionSchema = z.object({
  headquarters_id: z.string().min(1, 'Sede é obrigatória'),
  name: z.string().min(1, 'Nome é obrigatório'),
  start_at: z.string().min(1, 'Data de início é obrigatória'),
  end_at: z.string().min(1, 'Data de término é obrigatória'),
  venue_name: z.string().min(1, 'Local é obrigatório'),
  venue_address: z.string().optional(),
  current_status: z.enum([
    'rascunho',
    'em_preparacao',
    'pronta',
    'em_execucao',
    'concluida',
    'concluida_com_ressalvas',
    'cancelada'
  ]),
  template_version: z.string().min(1, 'Versão do template é obrigatória'),
  is_public: z.boolean(),
  public_slug: z.string().optional().or(z.literal('')),
});

type EditionFormValues = z.infer<typeof editionSchema>;

export default function EditionsPage() {
  const { roles } = useAuth();
  const hasAccess = roles.some(r => r.role_code === 'super_admin' || r.role_code === 'national_director' || r.role_code === 'local_director');
  
  const [editions, setEditions] = useState<any[]>([]);
  const [headquarters, setHeadquarters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditionFormValues>({
    resolver: zodResolver(editionSchema),
    defaultValues: {
      current_status: 'rascunho',
      template_version: '1.0',
      is_public: false,
      public_slug: '',
    }
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    const [editionsRes, hqRes] = await Promise.all([
      supabase
        .from('editions')
        .select(`
          *,
          headquarters:headquarters_id(name)
        `)
        .order('start_at', { ascending: false }),
      supabase
        .from('headquarters')
        .select('id, name')
        .order('name')
    ]);
    
    if (editionsRes.error) console.error('Error fetching editions:', editionsRes.error);
    else setEditions(editionsRes.data || []);

    if (hqRes.error) console.error('Error fetching headquarters:', hqRes.error);
    else setHeadquarters(hqRes.data || []);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data: EditionFormValues) => {
    // Ensure dates are in ISO format
    const payload = {
      ...data,
      start_at: new Date(data.start_at).toISOString(),
      end_at: new Date(data.end_at).toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from('editions')
        .update(payload)
        .eq('id', editingId);
      
      if (error) console.error('Error updating:', error);
    } else {
      const { error } = await supabase
        .from('editions')
        .insert([payload]);
      
      if (error) console.error('Error inserting:', error);
    }
    
    setIsModalOpen(false);
    reset();
    setEditingId(null);
    fetchData();
  };

  const handleEdit = (edition: any) => {
    setEditingId(edition.id);
    reset({
      headquarters_id: edition.headquarters_id,
      name: edition.name,
      start_at: new Date(edition.start_at).toISOString().slice(0, 16), // Format for datetime-local input
      end_at: new Date(edition.end_at).toISOString().slice(0, 16),
      venue_name: edition.venue_name,
      venue_address: edition.venue_address || '',
      current_status: edition.current_status,
      template_version: edition.template_version,
      is_public: edition.is_public || false,
      public_slug: edition.public_slug || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta edição?')) {
      const { error } = await supabase
        .from('editions')
        .delete()
        .eq('id', id);
      
      if (error) console.error('Error deleting:', error);
      else fetchData();
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    reset({
      current_status: 'rascunho',
      template_version: '1.0',
      headquarters_id: '',
      name: '',
      start_at: '',
      end_at: '',
      venue_name: '',
      venue_address: '',
      is_public: false,
      public_slug: '',
    });
    setIsModalOpen(true);
  };

  const filteredEditions = editions.filter(ed => 
    ed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ed.headquarters?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Operação</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Edições</h1>
        </div>
        {hasAccess && (
          <button 
            onClick={openNewModal}
            className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nova Edição
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
              placeholder="Buscar edição..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container text-[10px] technical-label text-on-surface-variant uppercase font-bold border-b border-outline/30">
              <tr>
                <th className="px-6 py-4">Edição</th>
                <th className="px-6 py-4">Sede</th>
                <th className="px-6 py-4">Datas</th>
                <th className="px-6 py-4">Status</th>
                {hasAccess && <th className="px-6 py-4 text-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Carregando...</td>
                </tr>
              ) : filteredEditions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Nenhuma edição encontrada.</td>
                </tr>
              ) : (
                filteredEditions.map((edition) => (
                  <tr key={edition.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pulse-cyan/10 text-pulse-cyan rounded-sm">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-sm text-on-surface">{edition.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                      {edition.headquarters?.name || 'Desconhecida'}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                      {format(new Date(edition.start_at), 'dd/MM/yyyy')} a {format(new Date(edition.end_at), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                        edition.current_status === 'concluida' ? 'bg-surface-container-high text-on-surface-variant' :
                        edition.current_status === 'pronta' ? 'bg-green-100 text-green-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {edition.current_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    {hasAccess && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(edition)} className="text-on-surface-variant hover:text-pulse-cyan p-1">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(edition.id)} className="text-on-surface-variant hover:text-red-500 p-1">
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
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Edição' : 'Nova Edição'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Sede</label>
            <select {...register('headquarters_id')} className="w-full border border-outline/50 rounded-sm p-2 text-sm bg-white">
              <option value="">Selecione uma sede...</option>
              {headquarters.map(hq => (
                <option key={hq.id} value={hq.id}>{hq.name}</option>
              ))}
            </select>
            {errors.headquarters_id && <span className="text-red-500 text-xs">{errors.headquarters_id.message}</span>}
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Nome da Edição</label>
            <input {...register('name')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" placeholder="Ex: REM SP Agosto 2026" />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Início</label>
              <input {...register('start_at')} type="datetime-local" className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
              {errors.start_at && <span className="text-red-500 text-xs">{errors.start_at.message}</span>}
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Término</label>
              <input {...register('end_at')} type="datetime-local" className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
              {errors.end_at && <span className="text-red-500 text-xs">{errors.end_at.message}</span>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Local (Nome)</label>
            <input {...register('venue_name')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
            {errors.venue_name && <span className="text-red-500 text-xs">{errors.venue_name.message}</span>}
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Endereço do Local</label>
            <input {...register('venue_address')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Status</label>
              <select {...register('current_status')} className="w-full border border-outline/50 rounded-sm p-2 text-sm bg-white">
                <option value="rascunho">Rascunho</option>
                <option value="em_preparacao">Em Preparação</option>
                <option value="pronta">Pronta</option>
                <option value="em_execucao">Em Execução</option>
                <option value="concluida">Concluída</option>
                <option value="concluida_com_ressalvas">Concluída com Ressalvas</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Versão do Template</label>
              <input {...register('template_version')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
              {errors.template_version && <span className="text-red-500 text-xs">{errors.template_version.message}</span>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Slug Público</label>
              <input {...register('public_slug')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" placeholder="ex: sao-paulo-2024" />
              {errors.public_slug && <span className="text-red-500 text-[10px]">{errors.public_slug.message}</span>}
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" {...register('is_public')} id="is_public" />
              <label htmlFor="is_public" className="text-xs font-bold text-on-surface uppercase">Visível no Portal</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Cancelar</button>
            <button type="submit" className="bg-pulse-cyan text-white px-6 py-2 text-sm font-bold rounded-sm shadow-md">Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
