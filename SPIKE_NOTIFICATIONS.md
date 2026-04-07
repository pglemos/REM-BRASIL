# SPIKE: Sistema de Notificações REM OS

## Objetivo
Definir a modelagem técnica e funcional para o sistema de notificações do REM OS, garantindo que diretores e staff recebam alertas relevantes sobre suas sedes e edições.

## Requisitos Funcionais
1. **Tipos de Notificação:**
   - **Sistema:** Atualizações de plataforma, avisos globais.
   - **Sede:** Novas edições, mudanças de status da sede.
   - **Edição:** Novos casais inscritos, mudanças em ACTOS, prazos vencendo.
2. **Canais:**
   - In-app (Dashboard).
   - E-mail (via Supabase Edge Functions + Resend/SendGrid).
3. **Ações:**
   - Marcar como lida.
   - Link direto para o recurso (deep linking).

## Modelagem de Dados (PostgreSQL)

```sql
create type notification_type as enum ('system', 'headquarters', 'edition', 'task');

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type notification_type not null default 'system',
  title text not null,
  message text not null,
  link_url text, -- URL para redirecionamento
  is_read boolean not null default false,
  metadata jsonb, -- Dados extras (ex: edition_id, hq_id)
  created_at timestamptz not null default now()
);

-- Índices para performance
create index idx_notifications_user_unread on notifications(user_id) where is_read = false;
```

## Estratégia de Automação (Triggers)

### 1. Notificação de Nova Edição
Quando uma edição é criada, notificar o Diretor da Sede.

```sql
create or replace function notify_new_edition()
returns trigger as $$
declare
  hq_director_id uuid;
begin
  -- Buscar o diretor da sede vinculada
  select user_id into hq_director_id 
  from user_roles 
  where headquarters_id = NEW.headquarters_id 
  and role_code = 'local_director' 
  limit 1;

  if hq_director_id is not null then
    insert into notifications (user_id, type, title, message, link_url)
    values (
      hq_director_id, 
      'headquarters', 
      'Nova Edição Criada', 
      'A edição ' || NEW.name || ' foi criada e está pronta para configuração.',
      '/editions/' || NEW.id
    );
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_notify_new_edition
after insert on editions
for each row execute function notify_new_edition();
```

## Frontend (React)
1. **Componente `NotificationBell`:** No header do dashboard.
2. **Hook `useNotifications`:** Para buscar e marcar como lida via Supabase Realtime.
3. **Página de Notificações:** `/app/(auth)/notifications/page.tsx`.

## Próximos Passos
- Executar o script SQL de criação da tabela.
- Implementar o componente de UI no layout do dashboard.
- Configurar Supabase Realtime para notificações "push" in-app.
