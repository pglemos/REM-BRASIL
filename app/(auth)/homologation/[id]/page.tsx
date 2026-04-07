'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, AlertTriangle, Plus, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Modal } from '@/components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const reviewSchema = z.object({
  edition_id: z.string().min(1, 'Edição avaliada é obrigatória'),
  score_infra: z.string().min(1, 'Nota de infraestrutura é obrigatória'),
  score_team: z.string().min(1, 'Nota de equipe é obrigatória'),
  score_content: z.string().min(1, 'Nota de conteúdo é obrigatória'),
  score_finance: z.string().min(1, 'Nota de financeiro é obrigatória'),
  has_eliminatory: z.boolean(),
  opinion_text: z.string().min(10, 'Parecer detalhado é obrigatório (mín. 10 caracteres)'),
  recommendation: z.enum(['aprovar', 'reciclar', 'descredenciar']),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function HomologationCycleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cycleId = params.id as string;
  
  const { roles } = useAuth();
  const hasAccess = roles.some(r => r.role_code === 'super_admin' || r.role_code === 'national_director' || r.role_code === 'auditor');
  const isNationalDirector = roles.some(r => r.role_code === 'super_admin' || r.role_code === 'national_director');

  const [cycle, setCycle] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      has_eliminatory: false,
      recommendation: 'aprovar',
    }
  });

  const watchScores = watch(['score_infra', 'score_team', 'score_content', 'score_finance', 'has_eliminatory']);
  
  const calculateAverage = () => {
    const [infra, team, content, finance] = watchScores;
    const scores = [infra, team, content, finance].map(s => parseFloat(s || '0'));
    if (scores.some(isNaN)) return 0;
    return (scores.reduce((a, b) => a + b, 0) / 4).toFixed(2);
  };

  const fetchCycleData = useCallback(async () => {
    setLoading(true);
    
    // Fetch Cycle details
    const { data: cycleData, error: cycleError } = await supabase
      .from('headquarters_homologation_cycles')
      .select('*, headquarters(name, country)')
      .eq('id', cycleId)
      .single();
      
    if (cycleError) {
      console.error('Error fetching cycle:', cycleError);
      setLoading(false);
      return;
    }
    setCycle(cycleData);

    // Fetch Reviews with Scorecards
    const { data: reviewsData } = await supabase
      .from('headquarters_reviews')
      .select('*, users(full_name), editions(name), homologation_scorecards(*)')
      .eq('homologation_cycle_id', cycleId)
      .order('created_at', { ascending: false });
      
    if (reviewsData) setReviews(reviewsData);

    // Fetch Editions for this HQ to evaluate
    if (cycleData?.headquarters_id) {
      const { data: editionsData } = await supabase
        .from('editions')
        .select('id, name')
        .eq('headquarters_id', cycleData.headquarters_id)
        .order('start_at', { ascending: false });
        
      if (editionsData) setEditions(editionsData);
    }

    setLoading(false);
  }, [supabase, cycleId]);

  useEffect(() => {
    fetchCycleData();
  }, [fetchCycleData]);

  const onSubmitReview = async (data: ReviewFormValues) => {
    if (!cycle?.headquarters_id) return;

    const totalScore = parseFloat(calculateAverage() as string);
    const finalRecommendation = data.has_eliminatory ? 'descredenciar' : data.recommendation;

    // 1. Insert Review
    const { data: reviewData, error: reviewError } = await supabase
      .from('headquarters_reviews')
      .insert([{
        headquarters_id: cycle.headquarters_id,
        edition_id: data.edition_id,
        homologation_cycle_id: cycleId,
        total_score: totalScore,
        has_eliminatory: data.has_eliminatory,
        recommendation: finalRecommendation,
        opinion_text: data.opinion_text
      }])
      .select()
      .single();
      
    if (reviewError || !reviewData) {
      console.error('Error adding review:', reviewError);
      alert('Erro ao registrar avaliação.');
      return;
    }

    // 2. Insert Scorecards
    const scorecards = [
      { headquarters_review_id: reviewData.id, dimension_code: 'infra', score: parseFloat(data.score_infra) },
      { headquarters_review_id: reviewData.id, dimension_code: 'team', score: parseFloat(data.score_team) },
      { headquarters_review_id: reviewData.id, dimension_code: 'content', score: parseFloat(data.score_content) },
      { headquarters_review_id: reviewData.id, dimension_code: 'finance', score: parseFloat(data.score_finance) },
    ];

    const { error: scorecardsError } = await supabase
      .from('homologation_scorecards')
      .insert(scorecards);

    if (scorecardsError) {
      console.error('Error adding scorecards:', scorecardsError);
    }

    setIsReviewModalOpen(false);
    reset();
    fetchCycleData();
  };

  const updateCycleStatus = async (newStatus: string) => {
    if (!isNationalDirector) return;
    
    const { error } = await supabase
      .from('headquarters_homologation_cycles')
      .update({ 
        current_status: newStatus,
        closed_at: newStatus !== 'em_avaliacao' ? new Date().toISOString() : null
      })
      .eq('id', cycleId);
      
    if (error) {
      console.error('Error updating cycle status:', error);
      alert('Erro ao atualizar status do ciclo.');
    } else {
      fetchCycleData();
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant">Carregando detalhes do ciclo...</div>;
  }

  if (!cycle) {
    return <div className="p-8 text-center text-on-surface-variant">Ciclo não encontrado.</div>;
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs technical-label font-bold uppercase text-on-surface-variant hover:text-pulse-cyan w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Homologações
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 text-[10px] technical-label font-black uppercase bg-surface-container-high text-on-surface-variant">
                Ciclo {cycle.cycle_number}
              </span>
              <span className={`px-2 py-1 text-[10px] technical-label font-black uppercase rounded-sm ${
                cycle.current_status === 'homologada' ? 'bg-green-100 text-green-800' :
                cycle.current_status === 'em_reciclagem' ? 'bg-red-100 text-red-800' :
                'bg-surface-container-high text-on-surface-variant'
              }`}>
                {cycle.current_status.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black editorial-title text-on-surface uppercase">{cycle.headquarters?.name}</h1>
            <p className="text-sm text-on-surface-variant mt-2 font-medium">
              Iniciado em {format(new Date(cycle.started_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {isNationalDirector && cycle.current_status === 'em_avaliacao' && (
              <div className="flex gap-2">
                <button 
                  onClick={() => updateCycleStatus('homologada')}
                  className="px-4 py-2 text-xs technical-label font-bold uppercase rounded-sm bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
                >
                  Aprovar Sede
                </button>
                <button 
                  onClick={() => updateCycleStatus('em_reciclagem')}
                  className="px-4 py-2 text-xs technical-label font-bold uppercase rounded-sm bg-action-orange text-white hover:bg-action-orange/90 transition-colors shadow-sm"
                >
                  Reciclar
                </button>
                <button 
                  onClick={() => updateCycleStatus('descredenciada')}
                  className="px-4 py-2 text-xs technical-label font-bold uppercase rounded-sm bg-action-red text-white hover:bg-action-red/90 transition-colors shadow-sm"
                >
                  Descredenciar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Reviews List */}
          <section className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline/30 bg-surface-container/30 flex justify-between items-center">
              <h2 className="font-black text-lg uppercase italic flex items-center gap-2">
                <FileText className="w-5 h-5 text-pulse-cyan" /> Avaliações (Scorecards)
              </h2>
              {hasAccess && cycle.current_status === 'em_avaliacao' && (
                <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  className="text-xs technical-label font-bold uppercase text-pulse-cyan hover:text-pulse-cyan-dark flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Nova Avaliação
                </button>
              )}
            </div>
            <div className="p-0">
              {reviews.length === 0 ? (
                <p className="p-6 text-sm text-on-surface-variant italic text-center">Nenhuma avaliação registrada neste ciclo.</p>
              ) : (
                <div className="divide-y divide-outline/30">
                  {reviews.map(review => (
                    <div key={review.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-sm font-black uppercase text-on-surface">{review.editions?.name}</h3>
                          <p className="text-[10px] technical-label font-bold text-on-surface-variant mt-1">
                            Avaliador: {review.users?.full_name || 'Sistema'} • {format(new Date(review.created_at), "dd/MM/yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-on-surface">{review.total_score}</span>
                          <span className="text-xs text-on-surface-variant">/10</span>
                        </div>
                      </div>

                      {review.has_eliminatory && (
                        <div className="bg-action-red/10 text-action-red p-3 rounded-sm flex items-center gap-2 mb-4">
                          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-xs font-bold uppercase">Critério Eliminatório Identificado</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {review.homologation_scorecards?.map((score: any) => (
                          <div key={score.id} className="bg-surface-container-low p-3 rounded-sm text-center">
                            <p className="text-[10px] technical-label font-black uppercase text-on-surface-variant mb-1">
                              {score.dimension_code === 'infra' ? 'Infraestrutura' :
                               score.dimension_code === 'team' ? 'Equipe' :
                               score.dimension_code === 'content' ? 'Conteúdo' : 'Financeiro'}
                            </p>
                            <p className="text-lg font-bold text-on-surface">{score.score}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-surface-container p-4 rounded-sm">
                        <h4 className="text-xs technical-label font-black uppercase text-on-surface-variant mb-2">Parecer do Avaliador</h4>
                        <p className="text-sm text-on-surface whitespace-pre-wrap">{review.opinion_text}</p>
                        <div className="mt-4 pt-4 border-t border-outline/30 flex items-center gap-2">
                          <span className="text-[10px] technical-label font-bold uppercase text-on-surface-variant">Recomendação:</span>
                          <span className={`text-[10px] technical-label font-black uppercase px-2 py-1 rounded-sm ${
                            review.recommendation === 'aprovar' ? 'bg-green-100 text-green-800' :
                            review.recommendation === 'reciclar' ? 'bg-action-orange/20 text-action-orange' :
                            'bg-action-red/20 text-action-red'
                          }`}>
                            {review.recommendation}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Summary */}
          <section className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-outline/30 bg-surface-container/30">
              <h2 className="font-black text-lg uppercase italic flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-pulse-cyan" /> Resumo do Ciclo
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] technical-label font-bold uppercase text-on-surface-variant mb-1">Total de Avaliações</p>
                <p className="text-2xl font-black text-on-surface">{reviews.length}</p>
              </div>
              <div>
                <p className="text-[10px] technical-label font-bold uppercase text-on-surface-variant mb-1">Média Geral</p>
                <p className="text-2xl font-black text-on-surface">
                  {reviews.length > 0 
                    ? (reviews.reduce((acc, rev) => acc + Number(rev.total_score), 0) / reviews.length).toFixed(2) 
                    : '--'}
                </p>
              </div>
              <div>
                <p className="text-[10px] technical-label font-bold uppercase text-on-surface-variant mb-1">Critérios Eliminatórios</p>
                <p className={`text-2xl font-black ${reviews.some(r => r.has_eliminatory) ? 'text-action-red' : 'text-green-600'}`}>
                  {reviews.filter(r => r.has_eliminatory).length}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          reset();
        }}
        title="Nova Avaliação (Scorecard)"
      >
        <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Edição Avaliada</label>
            <select
              {...register('edition_id')}
              className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
            >
              <option value="">Selecione a edição...</option>
              {editions.map(ed => (
                <option key={ed.id} value={ed.id}>{ed.name}</option>
              ))}
            </select>
            {errors.edition_id && <p className="text-action-red text-xs mt-1">{errors.edition_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Infraestrutura (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                {...register('score_infra')}
                className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
              />
              {errors.score_infra && <p className="text-action-red text-xs mt-1">{errors.score_infra.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Equipe (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                {...register('score_team')}
                className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
              />
              {errors.score_team && <p className="text-action-red text-xs mt-1">{errors.score_team.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Conteúdo (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                {...register('score_content')}
                className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
              />
              {errors.score_content && <p className="text-action-red text-xs mt-1">{errors.score_content.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Financeiro (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                {...register('score_finance')}
                className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
              />
              {errors.score_finance && <p className="text-action-red text-xs mt-1">{errors.score_finance.message}</p>}
            </div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-sm flex justify-between items-center">
            <span className="text-xs technical-label font-black uppercase text-on-surface-variant">Média Calculada:</span>
            <span className="text-xl font-black text-pulse-cyan">{calculateAverage()}</span>
          </div>

          <div className="flex items-center gap-3 bg-action-red/5 p-4 rounded-sm border border-action-red/20">
            <input
              type="checkbox"
              id="has_eliminatory"
              {...register('has_eliminatory')}
              className="w-4 h-4 rounded-sm border-outline text-action-red focus:ring-action-red"
            />
            <label htmlFor="has_eliminatory" className="text-sm font-bold text-action-red">
              Critério Eliminatório Identificado (Reprovação Automática)
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Parecer Detalhado</label>
            <textarea
              {...register('opinion_text')}
              rows={4}
              className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm resize-none"
              placeholder="Descreva as observações da auditoria..."
            />
            {errors.opinion_text && <p className="text-action-red text-xs mt-1">{errors.opinion_text.message}</p>}
          </div>

          {!watchScores[4] && ( // If not eliminatory, show recommendation
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Recomendação</label>
              <select
                {...register('recommendation')}
                className="w-full bg-surface-container border border-outline/50 p-3 text-sm focus:ring-pulse-cyan rounded-sm"
              >
                <option value="aprovar">Aprovar Sede</option>
                <option value="reciclar">Sugerir Reciclagem</option>
                <option value="descredenciar">Descredenciar</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-outline/30">
            <button
              type="button"
              onClick={() => {
                setIsReviewModalOpen(false);
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
              Salvar Avaliação
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
