'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Users, CheckSquare, AlertTriangle, FileText, PlayCircle, Save, Plus, Trash2, Paperclip, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Modal } from '@/components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const assignmentSchema = z.object({
  user_id: z.string().min(1, 'Usuário é obrigatório'),
  assignment_type: z.enum(['main_responsible', 'guide', 'media', 'support']),
  is_primary: z.boolean(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export default function ActoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const actoId = params.id as string;
  
  const { roles } = useAuth();
  const hasAccess = roles.some(r => r.role_code === 'super_admin' || r.role_code === 'national_director' || r.role_code === 'local_director');

  const [acto, setActo] = useState<any>(null);
  const [actoVersion, setActoVersion] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(null);

  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [runtimeLogs, setRuntimeLogs] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      assignment_type: 'main_responsible',
      is_primary: false,
    }
  });

  const checklistItemSchema = z.object({
    label: z.string().min(1, 'Descrição é obrigatória'),
    is_critical: z.boolean(),
    quantity: z.string().optional(),
  });

  type ChecklistItemFormValues = z.infer<typeof checklistItemSchema>;

  const { register: registerChecklist, handleSubmit: handleSubmitChecklist, reset: resetChecklist, formState: { errors: errorsChecklist } } = useForm<ChecklistItemFormValues>({
    resolver: zodResolver(checklistItemSchema),
    defaultValues: {
      is_critical: false,
    }
  });

  const incidentSchema = z.object({
    category: z.string().min(1, 'Categoria é obrigatória'),
    severity: z.enum(['baixa', 'media', 'alta', 'critica']),
    description: z.string().min(1, 'Descrição é obrigatória'),
    action_taken: z.string().optional(),
  });

  type IncidentFormValues = z.infer<typeof incidentSchema>;

  const { register: registerIncident, handleSubmit: handleSubmitIncident, reset: resetIncident, formState: { errors: errorsIncident } } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      severity: 'baixa',
    }
  });

  const fetchActoData = useCallback(async () => {
    setLoading(true);
    
    // Fetch Acto details
    const { data: actoData, error: actoError } = await supabase
      .from('actos')
      .select('*, editions(name, start_at)')
      .eq('id', actoId)
      .single();
      
    if (actoError) {
      console.error('Error fetching acto:', actoError);
      setLoading(false);
      return;
    }
    setActo(actoData);

    // Fetch Acto Version (latest/current)
    const { data: versionData } = await supabase
      .from('acto_versions')
      .select('*')
      .eq('acto_id', actoId)
      .eq('is_current', true)
      .single();
    
    if (versionData) setActoVersion(versionData);

    // Fetch Assignments
    const { data: assignmentsData } = await supabase
      .from('acto_assignments')
      .select('*, users(full_name, email)')
      .eq('acto_id', actoId);
      
    if (assignmentsData) setAssignments(assignmentsData);

    // Fetch Checklists
    const { data: checklistsData } = await supabase
      .from('acto_checklists')
      .select('*, checklist_items(*)')
      .eq('acto_id', actoId);
      
    if (checklistsData) setChecklists(checklistsData);

    // Fetch available users (staff for this edition)
    if (actoData?.edition_id) {
      const { data: staffData } = await supabase
        .from('edition_staff')
        .select('users(id, full_name, email)')
        .eq('edition_id', actoData.edition_id)
        .eq('current_status', 'ativo');
        
      if (staffData) {
        setAvailableUsers(staffData.map((s: any) => s.users).filter(Boolean));
      }

      // Fetch Incidents
      const { data: incidentsData } = await supabase
        .from('incident_reports')
        .select('*, users(full_name)')
        .eq('acto_id', actoId)
        .order('occurred_at', { ascending: false });
      
      if (incidentsData) setIncidents(incidentsData);
    }

    // Fetch Runtime Logs
    const { data: logsData } = await supabase
      .from('acto_runtime_logs')
      .select('*, users(full_name)')
      .eq('acto_id', actoId)
      .order('changed_at', { ascending: false });
      
    if (logsData) setRuntimeLogs(logsData);

    // Fetch Attachments
    const { data: attachmentsData } = await supabase
      .from('file_assets')
      .select('*')
      .eq('acto_id', actoId)
      .order('created_at', { ascending: false });
      
    if (attachmentsData) setAttachments(attachmentsData);

    setLoading(false);
  }, [supabase, actoId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActoData();
  }, [fetchActoData]);

  const handleAttachmentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !hasAccess) return;

    setIsUploadingAttachment(true);
    try {
      let assetType = 'other';
      if (file.type.startsWith('video/')) assetType = 'video';
      else if (file.type.startsWith('image/')) assetType = 'image';
      else if (file.type.startsWith('audio/')) assetType = 'audio';
      else if (file.type === 'application/pdf') assetType = 'pdf';

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `actos/${actoId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media-assets')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error('O bucket "media-assets" não existe no Supabase. Por favor, crie-o no painel do Supabase Storage.');
        }
        throw uploadError;
      }

      const { error: dbError } = await supabase.from('file_assets').insert({
        acto_id: actoId,
        asset_type: assetType,
        storage_path: filePath,
        original_filename: file.name,
        mime_type: file.type,
        size_bytes: file.size,
      });

      if (dbError) throw dbError;

      await fetchActoData();
    } catch (error: any) {
      console.error('Erro no upload de anexo:', error);
      alert(`Erro ao enviar anexo: ${error.message}`);
    } finally {
      setIsUploadingAttachment(false);
      if (attachmentInputRef.current) attachmentInputRef.current.value = '';
    }
  };

  const handleDownloadAttachment = async (asset: any) => {
    try {
      const { data, error } = await supabase.storage.from('media-assets').createSignedUrl(asset.storage_path, 60);
      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error: any) {
      console.error('Erro ao gerar link de download:', error);
      alert('Erro ao acessar o arquivo. Verifique as permissões.');
    }
  };

  const onSubmitAssignment = async (data: AssignmentFormValues) => {
    const { error } = await supabase
      .from('acto_assignments')
      .insert([{
        ...data,
        acto_id: actoId
      }]);
      
    if (error) {
      console.error('Error adding assignment:', error);
      alert('Erro ao adicionar responsável. Verifique se ele já não está adicionado ou se já existe um responsável principal.');
    } else {
      setIsAssignmentModalOpen(false);
      reset();
      fetchActoData();
    }
  };

  const removeAssignment = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este responsável?')) return;
    
    const { error } = await supabase
      .from('acto_assignments')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error removing assignment:', error);
    } else {
      fetchActoData();
    }
  };

  const toggleChecklistItem = async (itemId: string, currentStatus: string) => {
    if (!hasAccess) return;
    
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    const { error } = await supabase
      .from('checklist_items')
      .update({ 
        current_status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', itemId);
      
    if (error) {
      console.error('Error toggling checklist item:', error);
    } else {
      fetchActoData();
    }
  };

  const onSubmitChecklistItem = async (data: ChecklistItemFormValues) => {
    if (!selectedChecklistId) return;

    const { error } = await supabase
      .from('checklist_items')
      .insert([{
        checklist_id: selectedChecklistId,
        label: data.label,
        is_critical: data.is_critical,
        quantity: data.quantity ? parseFloat(data.quantity) : null,
        current_status: 'pending'
      }]);
      
    if (error) {
      console.error('Error adding checklist item:', error);
      alert('Erro ao adicionar item ao checklist.');
    } else {
      setIsChecklistModalOpen(false);
      resetChecklist();
      fetchActoData();
    }
  };

  const onSubmitIncident = async (data: IncidentFormValues) => {
    if (!acto?.edition_id) return;

    const { error } = await supabase
      .from('incident_reports')
      .insert([{
        ...data,
        acto_id: actoId,
        edition_id: acto.edition_id
      }]);
      
    if (error) {
      console.error('Error adding incident:', error);
      alert('Erro ao registrar incidente.');
    } else {
      setIsIncidentModalOpen(false);
      resetIncident();
      fetchActoData();
    }
  };

  const updateActoStatus = async (newStatus: string) => {
    if (!hasAccess) return;
    
    // 1. Update acto status
    const { error: updateError } = await supabase
      .from('actos')
      .update({ current_status: newStatus })
      .eq('id', actoId);
      
    if (updateError) {
      console.error('Error updating acto status:', updateError);
      alert('Erro ao atualizar status do ACTO.');
      return;
    }

    // 2. Log transition
    const { error: logError } = await supabase
      .from('acto_runtime_logs')
      .insert([{
        acto_id: actoId,
        from_status: acto.current_status,
        to_status: newStatus,
        note: `Status alterado manualmente para ${newStatus.replace(/_/g, ' ')}`
      }]);
      
    if (logError) {
      console.error('Error logging status transition:', logError);
    }

    fetchActoData();
  };

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant">Carregando detalhes do ACTO...</div>;
  }

  if (!acto) {
    return <div className="p-8 text-center text-on-surface-variant">ACTO não encontrado.</div>;
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '--:--';
    return format(new Date(dateString), 'HH:mm');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs technical-label font-bold uppercase text-on-surface-variant hover:text-pulse-cyan w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Cronograma
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 text-[10px] technical-label font-black uppercase bg-surface-container-high text-on-surface-variant">
                ACTO {acto.sequence_order}
              </span>
              <span className="text-[10px] technical-label font-black uppercase text-action-orange">
                Dia {acto.day_number}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black editorial-title text-on-surface uppercase">{acto.title}</h1>
            <p className="text-sm text-on-surface-variant mt-2 font-medium">
              {acto.editions?.name}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center px-4 py-2 text-xs technical-label font-black uppercase rounded-sm bg-surface-container-high text-on-surface">
              Status: {acto.current_status.replace(/_/g, ' ')}
            </span>
            <div className="flex gap-4 text-sm font-bold">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-on-surface-variant" />
                <span>{formatTime(acto.planned_start_at)} - {formatTime(acto.planned_end_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Execution Control */}
          <section className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline/30 bg-surface-container/30">
              <h2 className="font-black text-lg uppercase italic flex items-center gap-2">
                <Clock className="w-5 h-5 text-pulse-cyan" /> Controle de Execução
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Status Actions */}
              <div>
                <h3 className="text-xs technical-label font-black uppercase text-on-surface-variant mb-3">Alterar Status</h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => updateActoStatus('em_preparacao')}
                    disabled={!hasAccess || acto.current_status === 'em_preparacao'}
                    className="px-4 py-2 text-xs technical-label font-bold uppercase rounded-sm bg-surface-container-high text-on-surface hover:bg-pulse-cyan hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-surface-container-high disabled:hover:text-on-surface"
                  >
                    Em Preparação
                  </button>
                  <button 
                    onClick={() => updateActoStatus('pronto')}
                    disabled={!hasAccess || acto.current_status === 'pronto'}
                    className="px-4 py-2 text-xs technical-label font-bold uppercase rounded-sm bg-surface-container-high text-on-surface hover:bg-pulse-cyan hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-surface-container-high disabled:hover:text-on-surface"
                  >
                    Pronto
                  </button>
                  <button 
                    onClick={() => updateActoStatus('aguardando_inicio')}
                    disabled={!hasAccess || acto.current_status === 'aguardando_inicio'}
                    className="px-4 py-2 text-xs technical-label font-bold uppercase rounded-sm bg-surface-container-high text-on-surface hover:bg-pulse-cyan hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-surface-container-high disabled:hover:text-on-surface"
                  >
                    Aguardando Início
                  </button>
                  <button 
                    onClick={() => updateActoStatus('em_execucao')}
                    disabled={!hasAccess || acto.current_status === 'em_execucao'}
                    className="px-4 py-2 text-xs technical-label font-bold uppercase rounded-sm bg-pulse-cyan text-white hover:bg-pulse-cyan-dark transition-colors shadow-sm disabled:opacity-50"
                  >
                    Iniciar Execução
                  </button>
                  <button 
                    onClick={() => updateActoStatus('concluido_no_horario')}
                    disabled={!hasAccess || acto.current_status.startsWith('concluido')}
                    className="px-4 py-2 text-xs technical-label font-bold uppercase rounded-sm bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Concluir
                  </button>
                </div>
              </div>

              {/* Incidents */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs technical-label font-black uppercase text-on-surface-variant">Incidentes e Ressalvas</h3>
                  {hasAccess && (
                    <button 
                      onClick={() => setIsIncidentModalOpen(true)}
                      className="text-[10px] technical-label font-bold uppercase text-action-orange hover:text-action-red flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Registrar Incidente
                    </button>
                  )}
                </div>
                
                {incidents.length === 0 ? (
                  <p className="text-sm text-on-surface-variant italic">Nenhum incidente registrado.</p>
                ) : (
                  <ul className="space-y-3">
                    {incidents.map(incident => (
                      <li key={incident.id} className="bg-surface-container-low p-4 rounded-sm border-l-4 border-action-orange">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] technical-label font-black uppercase text-action-orange bg-action-orange/10 px-2 py-1 rounded-sm">
                            {incident.severity}
                          </span>
                          <span className="text-[10px] technical-label font-bold text-on-surface-variant">
                            {format(new Date(incident.occurred_at), "dd/MM HH:mm")}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-on-surface mb-1">{incident.category}</p>
                        <p className="text-sm text-on-surface-variant mb-2">{incident.description}</p>
                        {incident.action_taken && (
                          <p className="text-xs text-on-surface bg-surface-container p-2 rounded-sm"><span className="font-bold">Ação:</span> {incident.action_taken}</p>
                        )}
                        <p className="text-[10px] technical-label font-bold text-on-surface-variant mt-2 text-right">Por: {incident.users?.full_name || 'Sistema'}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Runtime Logs */}
              <div>
                <h3 className="text-xs technical-label font-black uppercase text-on-surface-variant mb-3">Histórico de Execução</h3>
                {runtimeLogs.length === 0 ? (
                  <p className="text-sm text-on-surface-variant italic">Nenhum registro de execução.</p>
                ) : (
                  <ul className="space-y-2">
                    {runtimeLogs.map(log => (
                      <li key={log.id} className="flex items-start gap-3 text-sm">
                        <span className="text-xs technical-label font-bold text-on-surface-variant w-12 flex-shrink-0">
                          {format(new Date(log.changed_at), "HH:mm")}
                        </span>
                        <div>
                          <p className="text-on-surface">
                            Status alterado para <span className="font-bold uppercase text-[10px] technical-label">{log.to_status.replace(/_/g, ' ')}</span>
                          </p>
                          {log.note && <p className="text-xs text-on-surface-variant italic">{log.note}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Context & Objectives */}
          <section className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline/30 bg-surface-container/30">
              <h2 className="font-black text-lg uppercase italic flex items-center gap-2">
                <FileText className="w-5 h-5 text-pulse-cyan" /> Contexto e Objetivos
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {actoVersion ? (
                <>
                  <div>
                    <h3 className="text-xs technical-label font-black uppercase text-on-surface-variant mb-2">Objetivo Principal</h3>
                    <p className="text-sm text-on-surface leading-relaxed">{actoVersion.objective || 'Não definido.'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs technical-label font-black uppercase text-on-surface-variant mb-2">Estado Emocional (Antes)</h3>
                      <p className="text-sm text-on-surface">{actoVersion.emotional_state_before || 'Não definido.'}</p>
                    </div>
                    <div>
                      <h3 className="text-xs technical-label font-black uppercase text-on-surface-variant mb-2">Estado Emocional (Depois)</h3>
                      <p className="text-sm text-on-surface">{actoVersion.emotional_state_after || 'Não definido.'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs technical-label font-black uppercase text-on-surface-variant mb-2">Inimigo a Atacar</h3>
                    <p className="text-sm text-on-surface">{actoVersion.enemy_to_attack || 'Não definido.'}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-on-surface-variant italic">Nenhuma versão de conteúdo vinculada a este ACTO.</p>
              )}
            </div>
          </section>

          {/* Attachments */}
          <section className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline/30 bg-surface-container/30 flex justify-between items-center">
              <h2 className="font-black text-lg uppercase italic flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-pulse-cyan" /> Anexos e Mídia
              </h2>
              {hasAccess && (
                <>
                  <button 
                    onClick={() => attachmentInputRef.current?.click()}
                    disabled={isUploadingAttachment}
                    className="text-xs technical-label font-bold uppercase text-pulse-cyan hover:text-pulse-cyan-dark flex items-center gap-1 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" /> {isUploadingAttachment ? 'Enviando...' : 'Adicionar Anexo'}
                  </button>
                  <input 
                    type="file" 
                    ref={attachmentInputRef} 
                    onChange={handleAttachmentUpload} 
                    className="hidden" 
                  />
                </>
              )}
            </div>
            <div className="p-6">
              {attachments.length === 0 ? (
                <p className="text-sm text-on-surface-variant italic">Nenhum anexo vinculado a este ACTO.</p>
              ) : (
                <ul className="space-y-3">
                  {attachments.map(asset => (
                    <li key={asset.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-sm border border-outline/30 hover:border-pulse-cyan/50 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-pulse-cyan/10 text-pulse-cyan rounded-sm flex-shrink-0">
                          {asset.asset_type === 'video' ? <PlayCircle className="w-4 h-4" /> : 
                           asset.asset_type === 'pdf' ? <FileText className="w-4 h-4" /> : 
                           <Paperclip className="w-4 h-4" />}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold text-on-surface truncate" title={asset.original_filename}>
                            {asset.original_filename}
                          </p>
                          <p className="text-[10px] technical-label text-on-surface-variant uppercase">
                            {asset.asset_type} • {format(new Date(asset.created_at), "dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDownloadAttachment(asset)}
                        className="p-2 text-on-surface-variant hover:text-pulse-cyan transition-colors flex-shrink-0"
                        title="Baixar anexo"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Step by Step / Script */}
          <section className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline/30 bg-surface-container/30">
              <h2 className="font-black text-lg uppercase italic flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-pulse-cyan" /> Guião e Passo a Passo
              </h2>
            </div>
            <div className="p-6 space-y-6">
               {actoVersion ? (
                <>
                  <div>
                    <h3 className="text-xs technical-label font-black uppercase text-on-surface-variant mb-2">Passo a Passo</h3>
                    <div className="prose prose-sm max-w-none text-on-surface">
                      {actoVersion.step_by_step ? (
                        <div dangerouslySetInnerHTML={{ __html: actoVersion.step_by_step.replace(/\n/g, '<br/>') }} />
                      ) : (
                        <p className="italic text-on-surface-variant">Não definido.</p>
                      )}
                    </div>
                  </div>
                  {actoVersion.host_script && (
                    <div className="bg-surface-container-low p-4 rounded-sm border-l-4 border-pulse-cyan">
                      <h3 className="text-xs technical-label font-black uppercase text-on-surface-variant mb-2">Script do Apresentador</h3>
                      <p className="text-sm text-on-surface whitespace-pre-wrap">{actoVersion.host_script}</p>
                    </div>
                  )}
                </>
               ) : (
                 <p className="text-sm text-on-surface-variant italic">Nenhuma versão de conteúdo vinculada.</p>
               )}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Responsáveis */}
          <section className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline/30 bg-surface-container/30 flex justify-between items-center">
              <h2 className="font-black text-lg uppercase italic flex items-center gap-2">
                <Users className="w-5 h-5 text-pulse-cyan" /> Responsáveis
              </h2>
              {hasAccess && (
                <button 
                  onClick={() => setIsAssignmentModalOpen(true)}
                  className="text-xs technical-label font-bold uppercase text-pulse-cyan hover:text-pulse-cyan-dark flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              )}
            </div>
            <div className="p-6">
              {assignments.length === 0 ? (
                <div className="text-center py-4">
                  <AlertTriangle className="w-8 h-8 text-action-orange mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-action-orange uppercase">Sem responsáveis definidos</p>
                  <p className="text-[10px] text-on-surface-variant mt-1">Isso pode bloquear a execução do ACTO.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {assignments.map(assignment => (
                    <li key={assignment.id} className="flex items-start justify-between gap-3 group">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-on-surface">
                            {assignment.users?.full_name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{assignment.users?.full_name}</p>
                          <p className="text-[10px] technical-label font-black uppercase text-on-surface-variant">
                            {assignment.assignment_type.replace(/_/g, ' ')} {assignment.is_primary && '(Principal)'}
                          </p>
                        </div>
                      </div>
                      {hasAccess && (
                        <button 
                          onClick={() => removeAssignment(assignment.id)}
                          className="text-action-red opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Checklists */}
          <section className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline/30 bg-surface-container/30 flex justify-between items-center">
              <h2 className="font-black text-lg uppercase italic flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-pulse-cyan" /> Checklists
              </h2>
            </div>
            <div className="p-0">
              {checklists.length === 0 ? (
                <p className="p-6 text-sm text-on-surface-variant italic text-center">Nenhum checklist vinculado.</p>
              ) : (
                <div className="divide-y divide-outline/30">
                  {checklists.map(checklist => (
                    <div key={checklist.id} className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs technical-label font-black uppercase text-on-surface">{checklist.title}</h3>
                        {hasAccess && (
                          <button 
                            onClick={() => {
                              setSelectedChecklistId(checklist.id);
                              setIsChecklistModalOpen(true);
                            }}
                            className="text-[10px] technical-label font-bold uppercase text-pulse-cyan hover:text-pulse-cyan-dark flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Item
                          </button>
                        )}
                      </div>
                      <ul className="space-y-3">
                        {checklist.checklist_items?.map((item: any) => (
                          <li key={item.id} className="flex items-start gap-3">
                            <input 
                              type="checkbox" 
                              checked={item.current_status === 'completed'}
                              onChange={() => toggleChecklistItem(item.id, item.current_status)}
                              disabled={!hasAccess}
                              className="mt-1 rounded-sm border-outline text-pulse-cyan focus:ring-pulse-cyan cursor-pointer disabled:opacity-50"
                            />
                            <div>
                              <p className={`text-sm ${item.current_status === 'completed' ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                                {item.label}
                                {item.is_critical && <span className="ml-2 text-[10px] technical-label font-black uppercase text-action-red bg-action-red/10 px-1 py-0.5 rounded-sm">Crítico</span>}
                              </p>
                              {item.quantity && <p className="text-[10px] text-on-surface-variant">Qtd: {item.quantity}</p>}
                            </div>
                          </li>
                        ))}
                        {(!checklist.checklist_items || checklist.checklist_items.length === 0) && (
                          <p className="text-xs text-on-surface-variant italic">Sem itens.</p>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </div>

      <Modal
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          reset();
        }}
        title="Adicionar Responsável"
      >
        <form onSubmit={handleSubmit(onSubmitAssignment)} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Usuário (Staff da Edição)</label>
            <select
              {...register('user_id')}
              className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
            >
              <option value="">Selecione um usuário...</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>{user.full_name} ({user.email})</option>
              ))}
            </select>
            {errors.user_id && <p className="text-action-red text-xs mt-1">{errors.user_id.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Tipo de Responsabilidade</label>
            <select
              {...register('assignment_type')}
              className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
            >
              <option value="main_responsible">Responsável Principal</option>
              <option value="guide">Guia</option>
              <option value="media">Mídia</option>
              <option value="support">Apoio</option>
            </select>
            {errors.assignment_type && <p className="text-action-red text-xs mt-1">{errors.assignment_type.message}</p>}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_primary"
              {...register('is_primary')}
              className="w-4 h-4 rounded-sm border-outline text-pulse-cyan focus:ring-pulse-cyan"
            />
            <label htmlFor="is_primary" className="text-sm font-bold text-on-surface">
              É o responsável primário? (Apenas um por ACTO)
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-outline/30">
            <button
              type="button"
              onClick={() => {
                setIsAssignmentModalOpen(false);
                reset();
              }}
              className="px-6 py-2.5 text-xs technical-label font-bold uppercase text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all"
            >
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isChecklistModalOpen}
        onClose={() => {
          setIsChecklistModalOpen(false);
          resetChecklist();
          setSelectedChecklistId(null);
        }}
        title="Adicionar Item ao Checklist"
      >
        <form onSubmit={handleSubmitChecklist(onSubmitChecklistItem)} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Descrição do Item</label>
            <input
              type="text"
              {...registerChecklist('label')}
              className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
              placeholder="Ex: Microfones testados"
            />
            {errorsChecklist.label && <p className="text-action-red text-xs mt-1">{errorsChecklist.label.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Quantidade (Opcional)</label>
            <input
              type="number"
              step="0.01"
              {...registerChecklist('quantity')}
              className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
              placeholder="Ex: 2"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_critical"
              {...registerChecklist('is_critical')}
              className="w-4 h-4 rounded-sm border-outline text-pulse-cyan focus:ring-pulse-cyan"
            />
            <label htmlFor="is_critical" className="text-sm font-bold text-on-surface">
              Item Crítico (Bloqueia o ACTO se não for concluído)
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-outline/30">
            <button
              type="button"
              onClick={() => {
                setIsChecklistModalOpen(false);
                resetChecklist();
                setSelectedChecklistId(null);
              }}
              className="px-6 py-2.5 text-xs technical-label font-bold uppercase text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-pulse-cyan text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all"
            >
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isIncidentModalOpen}
        onClose={() => {
          setIsIncidentModalOpen(false);
          resetIncident();
        }}
        title="Registrar Incidente ou Ressalva"
      >
        <form onSubmit={handleSubmitIncident(onSubmitIncident)} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Categoria</label>
            <input
              type="text"
              {...registerIncident('category')}
              className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
              placeholder="Ex: Atraso, Problema Técnico, Saúde"
            />
            {errorsIncident.category && <p className="text-action-red text-xs mt-1">{errorsIncident.category.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Severidade</label>
            <select
              {...registerIncident('severity')}
              className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
            >
              <option value="baixa">Baixa (Apenas registro)</option>
              <option value="media">Média (Impacto contornado)</option>
              <option value="alta">Alta (Impacto no cronograma/experiência)</option>
              <option value="critica">Crítica (Risco à segurança ou parada)</option>
            </select>
            {errorsIncident.severity && <p className="text-action-red text-xs mt-1">{errorsIncident.severity.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Descrição do Ocorrido</label>
            <textarea
              {...registerIncident('description')}
              rows={4}
              className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm resize-none"
              placeholder="Descreva o que aconteceu em detalhes..."
            />
            {errorsIncident.description && <p className="text-action-red text-xs mt-1">{errorsIncident.description.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Ação Tomada (Opcional)</label>
            <textarea
              {...registerIncident('action_taken')}
              rows={3}
              className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm resize-none"
              placeholder="O que foi feito para resolver ou mitigar?"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-outline/30">
            <button
              type="button"
              onClick={() => {
                setIsIncidentModalOpen(false);
                resetIncident();
              }}
              className="px-6 py-2.5 text-xs technical-label font-bold uppercase text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-action-orange text-white px-6 py-2.5 font-black text-xs technical-label uppercase shadow-lg shadow-action-orange/20 active:scale-95 transition-all"
            >
              Registrar Incidente
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
