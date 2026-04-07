-- ========================================================================================
-- REM OS - Row Level Security (RLS) Setup
-- Ticket: REM-S0-026
-- Descrição: Políticas de segurança para garantir o isolamento de dados por Sede/Edição.
-- ========================================================================================

-- 1. Habilitar RLS nas tabelas principais
alter table headquarters enable row level security;
alter table editions enable row level security;
alter table actos enable row level security;
alter table couples enable row level security;
alter table content_items enable row level security;
alter table audit_events enable row level security;

-- 2. Funções Auxiliares (Security Definer para poder ler user_roles sem recursão infinita)

-- Verifica se o usuário tem escopo nacional (super_admin, national_director)
create or replace function is_national_user()
returns boolean as $$
begin
  return exists (
    select 1 from user_roles ur
    join roles r on ur.role_id = r.id
    where ur.user_id = auth.uid() and r.scope_type = 'national'
  );
end;
$$ language plpgsql security definer;

-- Verifica se o usuário tem acesso a uma sede específica (Nacional ou vinculado à Sede)
create or replace function has_hq_access(hq_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from user_roles ur
    join roles r on ur.role_id = r.id
    where ur.user_id = auth.uid() 
    and (r.scope_type = 'national' or ur.headquarters_id = hq_id)
  );
end;
$$ language plpgsql security definer;

-- 3. Políticas para Headquarters (Sedes)
-- Leitura: Todos os usuários autenticados podem ver a lista de sedes
create policy "HQs viewable by authenticated users" on headquarters for select using (auth.role() = 'authenticated');
-- Escrita: Apenas usuários nacionais podem criar/editar/deletar sedes
create policy "HQs modifiable by national users" on headquarters for all using (is_national_user());

-- 4. Políticas para Editions (Edições)
-- Leitura: Todos os usuários autenticados podem ver as edições
create policy "Editions viewable by authenticated users" on editions for select using (auth.role() = 'authenticated');
-- Escrita: Apenas usuários com acesso à sede da edição podem modificar
create policy "Editions modifiable by HQ admins" on editions for all using (has_hq_access(headquarters_id));

-- 5. Políticas para Actos
-- Leitura: Usuários autenticados podem ver os ACTOs
create policy "Actos viewable by authenticated users" on actos for select using (auth.role() = 'authenticated');
-- Escrita: Apenas usuários com acesso à sede da edição do ACTO podem modificar
create policy "Actos modifiable by HQ admins" on actos for all using (
  has_hq_access((select headquarters_id from editions where id = actos.edition_id))
);

-- 6. Políticas para Couples (Casais)
-- Leitura e Escrita: Apenas usuários com acesso à sede da edição podem ver e modificar os casais
create policy "Couples viewable by HQ admins" on couples for select using (
  has_hq_access((select headquarters_id from editions where id = couples.edition_id))
);
create policy "Couples modifiable by HQ admins" on couples for all using (
  has_hq_access((select headquarters_id from editions where id = couples.edition_id))
);

-- 7. Políticas para Content Items (CMS)
-- Leitura: Todos os usuários autenticados podem ler conteúdos publicados
create policy "Content viewable by authenticated users" on content_items for select using (auth.role() = 'authenticated');
-- Escrita: Apenas usuários nacionais podem gerenciar o CMS global
create policy "Content modifiable by national users" on content_items for all using (is_national_user());

-- 8. Políticas para Audit Events
-- Leitura: Apenas usuários nacionais podem ler os logs de auditoria
create policy "Audit logs viewable by national users" on audit_events for select using (is_national_user());
-- Inserção: O sistema (qualquer usuário autenticado) pode inserir logs
create policy "Audit logs insertable by authenticated users" on audit_events for insert with check (auth.role() = 'authenticated');
-- Update/Delete: NINGUÉM pode alterar ou deletar logs de auditoria
create policy "Audit logs cannot be updated" on audit_events for update using (false);
create policy "Audit logs cannot be deleted" on audit_events for delete using (false);
