# SPIKE: Arquitetura e Modelagem de Notificações (REM-S0-027)

## 1. Objetivo
Validar e definir a estratégia técnica para o sistema de notificações do REM OS, suportando múltiplos canais (In-App e E-mail) e garantindo escalabilidade, entrega assíncrona e rastreabilidade.

## 2. Modelagem de Dados Atual (Supabase)

O schema atual (`REM_Schema_Fisico_Postgres_v1.0.sql`) já contempla a base necessária:

```sql
create type notification_channel as enum ('in_app','email');
create type notification_type as enum ('system','acto_update','registration','role_assignment');

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  channel notification_channel not null,
  type notification_type not null,
  title text not null,
  body text not null,
  reference_type text, -- Ex: 'acto', 'content'
  reference_id uuid,   -- ID do recurso relacionado
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
```

### Análise da Modelagem:
*   **Prós:** Estrutura simples e direta. Permite filtrar notificações não lidas (`read_at is null`) e agrupar por canal. O uso de `reference_type` e `reference_id` permite "deep linking" no frontend (ex: clicar na notificação e ir direto para o ACTO).
*   **Ajuste Recomendado:** Para notificações que devem ir para *ambos* os canais (In-App e Email), a modelagem atual exige a criação de duas linhas na tabela. Isso é aceitável e preferível para manter o controle de status de envio/leitura independente por canal.

## 3. Arquitetura de Disparo (Fluxo de Dados)

Para evitar que o frontend ou a API principal fiquem bloqueados esperando o envio de e-mails, adotaremos uma arquitetura orientada a eventos usando as ferramentas nativas do Supabase.

### Fluxo de Inserção:
1.  Uma ação ocorre no sistema (ex: Local Director aprova um ACTO).
2.  O código (Frontend ou RPC no banco) insere um registro na tabela `notifications`.
    *   Se for In-App: `channel = 'in_app'`.
    *   Se for E-mail: `channel = 'email'`.

### Fluxo de Entrega (In-App):
1.  O Frontend React utiliza o **Supabase Realtime**.
2.  Um hook global (`useNotifications`) escuta eventos de `INSERT` na tabela `notifications` onde `user_id = auth.uid()`.
3.  Quando o evento chega, o estado global é atualizado, incrementando o contador no "sininho" do Header e exibindo um Toast.

### Fluxo de Entrega (E-mail):
1.  Configuramos um **Supabase Database Webhook** (Trigger) na tabela `notifications`.
2.  Condição do Trigger: Disparar apenas após `INSERT` onde `channel = 'email'`.
3.  O Webhook chama uma **Supabase Edge Function** (ex: `send-email-notification`).
4.  A Edge Function:
    *   Recebe o payload (dados da notificação e `user_id`).
    *   Busca o e-mail do usuário na tabela `users` (ou via Auth Admin API).
    *   Utiliza um provedor de e-mail (ex: **Resend** ou **SendGrid**) via API para enviar a mensagem.
    *   Em caso de sucesso, atualiza a coluna `sent_at` da notificação para `now()`.

## 4. Provedor de E-mail Recomendado
Recomenda-se o uso do **Resend** (resend.com) devido à sua excelente DX (Developer Experience), integração nativa com React Email (para templates bonitos e responsivos) e facilidade de uso em Edge Functions (Deno/Edge runtime).

## 5. Casos de Uso Identificados (`notification_type`)
*   **`system`**: Avisos globais da coordenação nacional (In-App).
*   **`acto_update`**: Mudança de status de um ACTO (ex: de 'em_revisao' para 'aprovado'). Notifica o Local Director (In-App + Email).
*   **`registration`**: Confirmação de inscrição de um casal (Email).
*   **`role_assignment`**: Quando um usuário recebe um novo papel (ex: promovido a Local Director) (In-App + Email).

## 6. Próximos Passos (Implementação)
1.  **Frontend:** Criar o componente de UI do "Sininho" (Dropdown) e a página de listagem de notificações.
2.  **Frontend:** Implementar o hook `useNotifications` com Supabase Realtime.
3.  **Backend:** Criar a Supabase Edge Function `send-email-notification` integrada com a API do Resend.
4.  **Backend:** Configurar o Database Webhook no painel do Supabase para conectar a tabela à Edge Function.
