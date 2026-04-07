'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { Modal } from '@/components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const headquartersSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  country: z.string().min(1, 'País é obrigatório'),
  state: z.string().min(1, 'Estado é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  current_status: z.enum([
    'em_implantacao',
    'aguardando_1a_edicao',
    'edicao_1_concluida',
    'edicao_2_concluida',
    'edicao_3_em_avaliacao',
    'homologada',
    'em_reciclagem',
    'aguardando_nova_edicao',
    'suspensa',
    'inativa'
  ]),
  is_public: z.boolean(),
  public_slug: z.string().optional().or(z.literal('')),
});

type HeadquartersFormValues = z.infer<typeof headquartersSchema>;

export default function SedesPage() {
  const { roles } = useAuth();
  const hasAccess = roles.some(r => r.role_code === 'super_admin' || r.role_code === 'national_director');
  
  const [headquarters, setHeadquarters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm<HeadquartersFormValues>({
    resolver: zodResolver(headquartersSchema),
    defaultValues: {
      current_status: 'em_implantacao',
      country: 'Brasil',
      is_public: false,
      public_slug: '',
    }
  });

  const fetchHeadquarters = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('headquarters')
      .select(`
        *,
        local_director:users!local_director_user_id(full_name)
      `)
      .order('name');
    
    if (error) {
      console.error('Error fetching headquarters:', error);
    } else {
      setHeadquarters(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHeadquarters();
  }, [fetchHeadquarters]);

  const onSubmit = async (data: HeadquartersFormValues) => {
    if (editingId) {
      const { error } = await supabase
        .from('headquarters')
        .update(data)
        .eq('id', editingId);
      
      if (error) console.error('Error updating:', error);
    } else {
      const { error } = await supabase
        .from('headquarters')
        .insert([data]);
      
      if (error) console.error('Error inserting:', error);
    }
    
    setIsModalOpen(false);
    reset();
    setEditingId(null);
    fetchHeadquarters();
  };

  const handleEdit = (hq: any) => {
    setEditingId(hq.id);
    reset({
      name: hq.name,
      country: hq.country,
      state: hq.state,
      city: hq.city,
      email: hq.email || '',
      phone: hq.phone || '',
      current_status: hq.current_status,
      is_public: hq.is_public || false,
      public_slug: hq.public_slug || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta sede?')) {
      const { error } = await supabase
        .from('headquarters')
        .delete()
        .eq('id', id);
      
      if (error) console.error('Error deleting:', error);
      else fetchHeadquarters();
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    reset({
      current_status: 'em_implantacao',
      country: 'Brasil',
      name: '',
      state: '',
      city: '',
      email: '',
      phone: '',
      is_public: false,
      public_slug: '',
    });
    setIsModalOpen(true);
  };

  const filteredHeadquarters = headquarters.filter(hq => 
    hq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hq.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hq.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Governança</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Sedes</h1>
        </div>
        {hasAccess && (
          <button 
            onClick={openNewModal}
            className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nova Sede
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
              placeholder="Buscar sede por nome, cidade ou estado..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container text-[10px] technical-label text-on-surface-variant uppercase font-bold border-b border-outline/30">
              <tr>
                <th className="px-6 py-4">Sede</th>
                <th className="px-6 py-4">Localização</th>
                <th className="px-6 py-4">Diretor Local</th>
                <th className="px-6 py-4">Status</th>
                {hasAccess && <th className="px-6 py-4 text-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Carregando...</td>
                </tr>
              ) : filteredHeadquarters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Nenhuma sede encontrada.</td>
                </tr>
              ) : (
                filteredHeadquarters.map((sede) => (
                  <tr key={sede.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pulse-cyan/10 text-pulse-cyan rounded-sm">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-sm text-on-surface">{sede.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                      {sede.city}, {sede.state}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                      {sede.local_director?.full_name || 'Não atribuído'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                        sede.current_status === 'homologada' ? 'bg-green-100 text-green-800' :
                        sede.current_status === 'em_reciclagem' ? 'bg-red-100 text-red-800' :
                        'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {sede.current_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    {hasAccess && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(sede)} className="text-on-surface-variant hover:text-pulse-cyan p-1">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(sede.id)} className="text-on-surface-variant hover:text-red-500 p-1">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Sede' : 'Nova Sede'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Nome da Sede</label>
            <input {...register('name')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">País</label>
              <input {...register('country')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
              {errors.country && <span className="text-red-500 text-xs">{errors.country.message}</span>}
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Estado</label>
              <input {...register('state')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
              {errors.state && <span className="text-red-500 text-xs">{errors.state.message}</span>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Cidade</label>
            <input {...register('city')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
            {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Email</label>
              <input {...register('email')} type="email" className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Telefone</label>
              <input {...register('phone')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Status</label>
            <select {...register('current_status')} className="w-full border border-outline/50 rounded-sm p-2 text-sm bg-white">
              <option value="em_implantacao">Em Implantação</option>
              <option value="aguardando_1a_edicao">Aguardando 1ª Edição</option>
              <option value="edicao_1_concluida">Edição 1 Concluída</option>
              <option value="edicao_2_concluida">Edição 2 Concluída</option>
              <option value="edicao_3_em_avaliacao">Edição 3 em Avaliação</option>
              <option value="homologada">Homologada</option>
              <option value="em_reciclagem">Em Reciclagem</option>
              <option value="aguardando_nova_edicao">Aguardando Nova Edição</option>
              <option value="suspensa">Suspensa</option>
              <option value="inativa">Inativa</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Slug Público</label>
              <input {...register('public_slug')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" placeholder="ex: sao-paulo-sul" />
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
