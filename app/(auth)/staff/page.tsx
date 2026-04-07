'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Search, UserPlus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { Modal } from '@/components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const staffSchema = z.object({
  user_id: z.string().min(1, 'Usuário é obrigatório'),
  role_code: z.string().min(1, 'Papel é obrigatório'),
  current_status: z.string().min(1, 'Status é obrigatório'),
  is_blocking_role: z.boolean(),
});

const coupleSchema = z.object({
  participant_a_name: z.string().min(1, 'Nome do participante A é obrigatório'),
  participant_b_name: z.string().min(1, 'Nome do participante B é obrigatório'),
  primary_phone: z.string().min(1, 'Telefone é obrigatório'),
  primary_email: z.string().email('Email inválido').optional().or(z.literal('')),
  status: z.enum(['confirmado', 'pre_inscrito', 'cancelado']),
  notes: z.string().optional(),
});

type StaffFormValues = z.infer<typeof staffSchema>;
type CoupleFormValues = z.infer<typeof coupleSchema>;

export default function StaffPage() {
  const { roles } = useAuth();
  const localRole = roles.find(r => r.edition_id || r.headquarters_id);
  const editionId = localRole?.edition_id;
  const headquartersId = localRole?.headquarters_id;

  const [activeTab, setActiveTab] = useState<'casais' | 'familias' | 'staff'>('casais');
  const [edition, setEdition] = useState<any>(null);
  const [headquarters, setHeadquarters] = useState<any>(null);
  
  const [couples, setCouples] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos os Status');
  const [users, setUsers] = useState<any[]>([]);

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isCoupleModalOpen, setIsCoupleModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editingCoupleId, setEditingCoupleId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const staffForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      current_status: 'ativo',
      is_blocking_role: false,
    }
  });

  const coupleForm = useForm<CoupleFormValues>({
    resolver: zodResolver(coupleSchema),
    defaultValues: {
      status: 'pre_inscrito',
    }
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let currentEditionId = editionId;

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

      const { data: usersData } = await supabase.from('users').select('id, full_name').eq('is_active', true);
      setUsers(usersData || []);

      if (currentEditionId) {
        const [couplesRes, familiesRes, staffRes] = await Promise.all([
          supabase.from('couples').select(`
            *,
            participant_a:participant_a_id(full_name),
            participant_b:participant_b_id(full_name),
            family_group_members(family_groups(code, label))
          `).eq('edition_id', currentEditionId),
          supabase.from('family_groups').select(`
            *,
            guide:guide_user_id(full_name),
            family_group_members(count)
          `).eq('edition_id', currentEditionId),
          supabase.from('edition_staff').select(`
            *,
            user:user_id(full_name, email)
          `).eq('edition_id', currentEditionId)
        ]);

        setCouples(couplesRes.data || []);
        setFamilies(familiesRes.data || []);
        setStaff(staffRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, editionId, headquartersId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onStaffSubmit = async (data: StaffFormValues) => {
    if (!edition?.id) return;

    // Check for duplicate user in staff
    const isDuplicate = staff.some(s => s.user_id === data.user_id && s.id !== editingStaffId);
    if (isDuplicate) {
      alert('Este usuário já faz parte da equipe desta edição.');
      return;
    }

    if (editingStaffId) {
      const { error } = await supabase
        .from('edition_staff')
        .update({
          user_id: data.user_id,
          role_code: data.role_code,
          current_status: data.current_status,
          is_blocking_role: data.is_blocking_role,
        })
        .eq('id', editingStaffId);
      if (error) console.error('Error updating staff:', error);
    } else {
      const { error } = await supabase
        .from('edition_staff')
        .insert({
          edition_id: edition.id,
          user_id: data.user_id,
          role_code: data.role_code,
          current_status: data.current_status,
          is_blocking_role: data.is_blocking_role,
        });
      if (error) console.error('Error adding staff:', error);
    }

    setIsStaffModalOpen(false);
    staffForm.reset();
    setEditingStaffId(null);
    fetchData();
  };

  const onCoupleSubmit = async (data: CoupleFormValues) => {
    if (!edition?.id) return;

    try {
      if (editingCoupleId) {
        // For editing, we update the couple and potentially the participants
        // For simplicity, let's just update the couple record fields
        const { error } = await supabase
          .from('couples')
          .update({
            primary_phone: data.primary_phone,
            primary_email: data.primary_email,
            status: data.status,
            notes: data.notes,
          })
          .eq('id', editingCoupleId);
        if (error) throw error;
      } else {
        // Create participants first
        const { data: partA, error: errA } = await supabase.from('participants').insert({ full_name: data.participant_a_name }).select().single();
        if (errA) throw errA;
        const { data: partB, error: errB } = await supabase.from('participants').insert({ full_name: data.participant_b_name }).select().single();
        if (errB) throw errB;

        // Determine low/high IDs for canonical unique constraint
        const [lowId, highId] = [partA.id, partB.id].sort();

        const { error: errC } = await supabase.from('couples').insert({
          edition_id: edition.id,
          participant_a_id: partA.id,
          participant_b_id: partB.id,
          participant_low_id: lowId,
          participant_high_id: highId,
          primary_phone: data.primary_phone,
          primary_email: data.primary_email,
          status: data.status,
          notes: data.notes,
        });
        if (errC) throw errC;
      }

      setIsCoupleModalOpen(false);
      coupleForm.reset();
      setEditingCoupleId(null);
      fetchData();
    } catch (error) {
      console.error('Error saving couple:', error);
    }
  };

  const deleteStaff = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este membro do staff?')) {
      const { error } = await supabase.from('edition_staff').delete().eq('id', id);
      if (error) console.error('Error deleting staff:', error);
      else fetchData();
    }
  };

  const deleteCouple = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este casal?')) {
      const { error } = await supabase.from('couples').delete().eq('id', id);
      if (error) console.error('Error deleting couple:', error);
      else fetchData();
    }
  };

  const openStaffModal = (s?: any) => {
    if (s) {
      setEditingStaffId(s.id);
      staffForm.reset({
        user_id: s.user_id,
        role_code: s.role_code,
        current_status: s.current_status,
        is_blocking_role: s.is_blocking_role,
      });
    } else {
      setEditingStaffId(null);
      staffForm.reset({
        current_status: 'ativo',
        is_blocking_role: false,
      });
    }
    setIsStaffModalOpen(true);
  };

  const openCoupleModal = (c?: any) => {
    if (c) {
      setEditingCoupleId(c.id);
      coupleForm.reset({
        participant_a_name: c.participant_a?.full_name,
        participant_b_name: c.participant_b?.full_name,
        primary_phone: c.primary_phone,
        primary_email: c.primary_email || '',
        status: c.status,
        notes: c.notes || '',
      });
    } else {
      setEditingCoupleId(null);
      coupleForm.reset({
        status: 'pre_inscrito',
        participant_a_name: '',
        participant_b_name: '',
        primary_phone: '',
        primary_email: '',
        notes: '',
      });
    }
    setIsCoupleModalOpen(true);
  };

  const filteredCouples = couples.filter(c => {
    const matchSearch = (c.participant_a?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.participant_b?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = statusFilter === 'Todos os Status' || c.status === statusFilter.toLowerCase().replace(' ', '_');
    return matchSearch && matchStatus;
  });

  const filteredFamilies = families.filter(f => {
    return f.label?.toLowerCase().includes(searchTerm.toLowerCase()) || f.code?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredStaff = staff.filter(s => {
    return s.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.role_code?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant">Carregando dados...</div>;
  }

  if (!edition && !headquarters) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        Nenhuma edição ou sede vinculada ao seu perfil.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipes & Casais</h1>
          <p className="text-sm text-gray-500">{headquarters?.name} - {edition?.name || 'Sem edição ativa'}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => openStaffModal()}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Adicionar Staff
          </button>
          <button 
            onClick={() => openCoupleModal()}
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Casal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab('casais')}
            className={`${activeTab === 'casais' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Casais ({couples.length})
          </button>
          <button 
            onClick={() => setActiveTab('familias')}
            className={`${activeTab === 'familias' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Famílias/Equipes ({families.length})
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`${activeTab === 'staff' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Staff ({staff.length})
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="Buscar..."
            />
          </div>
          {activeTab === 'casais' && (
            <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md text-sm py-2 px-3 bg-white focus:outline-none focus:ring-black focus:border-black"
              >
                <option>Todos os Status</option>
                <option>Confirmado</option>
                <option>Pré-inscrito</option>
                <option>Cancelado</option>
              </select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'casais' && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Casal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Família/Equipe</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saúde/Restrições</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCouples.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Nenhum casal encontrado.</td></tr>
                ) : (
                  filteredCouples.map((couple) => {
                    const family = couple.family_group_members?.[0]?.family_groups?.label || 'Não alocado';
                    return (
                      <tr key={couple.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{couple.participant_a?.full_name} & {couple.participant_b?.full_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{couple.primary_phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            family === 'Não alocado' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {family}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            couple.status === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {couple.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {couple.notes || 'Nenhuma'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openCoupleModal(couple)} className="text-gray-400 hover:text-black">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteCouple(couple.id)} className="text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'familias' && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Família/Equipe</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guia Responsável</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Casais Alocados</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFamilies.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Nenhuma família encontrada.</td></tr>
                ) : (
                  filteredFamilies.map((family) => (
                    <tr key={family.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{family.label}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{family.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{family.guide?.full_name || 'Não atribuído'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{family.family_group_members?.[0]?.count || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'staff' && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papel/Função</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Nenhum staff encontrado.</td></tr>
                ) : (
                  filteredStaff.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.user?.full_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.user?.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.role_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          s.current_status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {s.current_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openStaffModal(s)} className="text-gray-400 hover:text-black">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteStaff(s.id)} className="text-gray-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Staff Modal */}
      <Modal 
        isOpen={isStaffModalOpen} 
        onClose={() => setIsStaffModalOpen(false)} 
        title={editingStaffId ? 'Editar Staff' : 'Adicionar Staff'}
      >
        <form onSubmit={staffForm.handleSubmit(onStaffSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Usuário</label>
            <select 
              {...staffForm.register('user_id')} 
              className="w-full border border-outline/50 rounded-sm p-2 text-sm bg-white"
            >
              <option value="">Selecione um usuário...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.full_name}</option>
              ))}
            </select>
            {staffForm.formState.errors.user_id && <span className="text-red-500 text-[10px]">{staffForm.formState.errors.user_id.message}</span>}
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Papel / Função</label>
            <input 
              {...staffForm.register('role_code')} 
              className="w-full border border-outline/50 rounded-sm p-2 text-sm" 
              placeholder="Ex: Guia, Logística, etc."
            />
            {staffForm.formState.errors.role_code && <span className="text-red-500 text-[10px]">{staffForm.formState.errors.role_code.message}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Status</label>
              <select 
                {...staffForm.register('current_status')} 
                className="w-full border border-outline/50 rounded-sm p-2 text-sm bg-white"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" {...staffForm.register('is_blocking_role')} id="is_blocking" />
              <label htmlFor="is_blocking" className="text-xs font-bold text-on-surface uppercase">Papel Crítico</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsStaffModalOpen(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Cancelar</button>
            <button type="submit" className="bg-pulse-cyan text-white px-6 py-2 text-sm font-bold rounded-sm shadow-md uppercase">Salvar</button>
          </div>
        </form>
      </Modal>

      {/* Couple Modal */}
      <Modal 
        isOpen={isCoupleModalOpen} 
        onClose={() => setIsCoupleModalOpen(false)} 
        title={editingCoupleId ? 'Editar Casal' : 'Novo Casal'}
      >
        <form onSubmit={coupleForm.handleSubmit(onCoupleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Participante A</label>
              <input 
                {...coupleForm.register('participant_a_name')} 
                className="w-full border border-outline/50 rounded-sm p-2 text-sm" 
                placeholder="Nome completo"
                disabled={!!editingCoupleId}
              />
              {coupleForm.formState.errors.participant_a_name && <span className="text-red-500 text-[10px]">{coupleForm.formState.errors.participant_a_name.message}</span>}
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Participante B</label>
              <input 
                {...coupleForm.register('participant_b_name')} 
                className="w-full border border-outline/50 rounded-sm p-2 text-sm" 
                placeholder="Nome completo"
                disabled={!!editingCoupleId}
              />
              {coupleForm.formState.errors.participant_b_name && <span className="text-red-500 text-[10px]">{coupleForm.formState.errors.participant_b_name.message}</span>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Telefone Principal</label>
              <input {...coupleForm.register('primary_phone')} className="w-full border border-outline/50 rounded-sm p-2 text-sm" placeholder="(00) 00000-0000" />
              {coupleForm.formState.errors.primary_phone && <span className="text-red-500 text-[10px]">{coupleForm.formState.errors.primary_phone.message}</span>}
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Email Principal</label>
              <input {...coupleForm.register('primary_email')} type="email" className="w-full border border-outline/50 rounded-sm p-2 text-sm" placeholder="email@exemplo.com" />
              {coupleForm.formState.errors.primary_email && <span className="text-red-500 text-[10px]">{coupleForm.formState.errors.primary_email.message}</span>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Status</label>
            <select 
              {...coupleForm.register('status')} 
              className="w-full border border-outline/50 rounded-sm p-2 text-sm bg-white"
            >
              <option value="pre_inscrito">Pré-inscrito</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1 uppercase">Notas / Restrições</label>
            <textarea {...coupleForm.register('notes')} className="w-full border border-outline/50 rounded-sm p-2 text-sm h-20" placeholder="Alergias, restrições alimentares, etc." />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsCoupleModalOpen(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Cancelar</button>
            <button type="submit" className="bg-pulse-cyan text-white px-6 py-2 text-sm font-bold rounded-sm shadow-md uppercase">Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
