-- REM OS / REM Control Center Brasil
-- Schema físico inicial PostgreSQL / Supabase
-- Versão: 1.0

create extension if not exists pgcrypto;

create type headquarters_status as enum (
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
);

create type edition_status as enum (
  'rascunho',
  'em_preparacao',
  'pronta',
  'em_execucao',
  'concluida',
  'concluida_com_ressalvas',
  'cancelada'
);

create type acto_status as enum (
  'nao_iniciado',
  'em_preparacao',
  'pronto',
  'aguardando_inicio',
  'iniciado_no_horario',
  'iniciado_com_atraso',
  'em_execucao',
  'pausado',
  'concluido_no_horario',
  'concluido_com_atraso',
  'concluido_com_ressalva',
  'bloqueado',
  'cancelado'
);

create type content_scope as enum ('global','local_complementary','public_page');
create type content_workflow_status as enum ('rascunho','em_revisao','aprovado_para_publicacao','publicado','superseded','arquivado','bloqueado');
create type checklist_type as enum ('purchases','logistics','pre_execution','live_execution','post_execution','training');
create type checklist_item_status as enum ('pending','in_progress','done','blocked');
create type notification_channel as enum ('in_app','email');
create type notification_type as enum ('mandatory_reading','critical_item_overdue','acto_blocked','critical_incident','edition_upcoming','task_assigned');
create type review_recommendation as enum ('approve','recycle','suspend');
create type public_page_type as enum ('home','faq','contact','campaign_banner','headquarters_public','edition_public');

create table users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  password_hash text,
  auth_provider_ref text,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  scope_type text not null check (scope_type in ('national','local','edition')),
  created_at timestamptz not null default now()
);

create table headquarters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  state text not null,
  city text not null,
  email text,
  phone text,
  current_status headquarters_status not null default 'em_implantacao',
  local_director_user_id uuid references users(id),
  first_edition_planned_at timestamptz,
  is_public boolean not null default false,
  public_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(name, state, city)
);

create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  headquarters_id uuid references headquarters(id) on delete cascade,
  edition_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table headquarters_status_history (
  id uuid primary key default gen_random_uuid(),
  headquarters_id uuid not null references headquarters(id) on delete cascade,
  from_status headquarters_status,
  to_status headquarters_status not null,
  reason text,
  changed_by_user_id uuid references users(id),
  changed_at timestamptz not null default now()
);

create table editions (
  id uuid primary key default gen_random_uuid(),
  headquarters_id uuid not null references headquarters(id) on delete cascade,
  name text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  venue_name text not null,
  venue_address text,
  current_status edition_status not null default 'rascunho',
  general_manager_user_id uuid references users(id),
  template_version text not null,
  started_at_real timestamptz,
  ended_at_real timestamptz,
  is_public boolean not null default false,
  public_slug text unique,
  public_cta_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at >= start_at),
  unique(headquarters_id, name, start_at)
);

alter table user_roles
  add constraint fk_user_roles_edition foreign key (edition_id) references editions(id) on delete cascade;

create table edition_days (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions(id) on delete cascade,
  day_number int not null check (day_number in (1,2)),
  date_ref date,
  label text
);

create table participants (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  birth_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table participant_health_flags (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null unique references participants(id) on delete cascade,
  allergy_notes text,
  restriction_notes text,
  medication_notes text,
  risk_notes text,
  sensitive_consent_at timestamptz,
  retention_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references participants(id) on delete cascade,
  contact_name text not null,
  relationship text,
  phone text not null,
  is_primary boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table couples (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions(id) on delete cascade,
  participant_a_id uuid not null references participants(id),
  participant_b_id uuid not null references participants(id),
  participant_low_id uuid not null references participants(id),
  participant_high_id uuid not null references participants(id),
  primary_phone text not null,
  primary_email text,
  status text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (participant_a_id <> participant_b_id),
  unique (edition_id, participant_low_id, participant_high_id)
);

create or replace function set_couple_canonical_ids()
returns trigger language plpgsql as $$
begin
  if NEW.participant_a_id::text < NEW.participant_b_id::text then
    NEW.participant_low_id := NEW.participant_a_id;
    NEW.participant_high_id := NEW.participant_b_id;
  else
    NEW.participant_low_id := NEW.participant_b_id;
    NEW.participant_high_id := NEW.participant_a_id;
  end if;
  return NEW;
end;
$$;

create trigger trg_set_couple_canonical_ids
before insert or update on couples
for each row execute function set_couple_canonical_ids();

create table family_groups (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions(id) on delete cascade,
  code text not null,
  label text,
  guide_user_id uuid references users(id),
  created_at timestamptz not null default now(),
  unique (edition_id, code)
);

create table family_group_members (
  id uuid primary key default gen_random_uuid(),
  family_group_id uuid not null references family_groups(id) on delete cascade,
  couple_id uuid not null unique references couples(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table edition_staff (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role_code text not null,
  current_status text not null,
  is_blocking_role boolean not null default false,
  created_at timestamptz not null default now(),
  unique (edition_id, user_id, role_code)
);

create table actos (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions(id) on delete cascade,
  code text not null,
  title text not null,
  day_number int not null check (day_number in (1,2)),
  sequence_order int not null,
  planned_start_at timestamptz,
  planned_end_at timestamptz,
  current_status acto_status not null default 'nao_iniciado',
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (edition_id, code)
);

create table acto_versions (
  id uuid primary key default gen_random_uuid(),
  acto_id uuid not null references actos(id) on delete cascade,
  official_content_version_id uuid,
  objective text,
  why_text text,
  enemy_to_attack text,
  emotional_state_before text,
  emotional_state_after text,
  scenario_notes text,
  host_script text,
  step_by_step text,
  team_role_notes text,
  safety_notes text,
  version_label text,
  is_current boolean not null default true,
  created_at timestamptz not null default now()
);

create table acto_assignments (
  id uuid primary key default gen_random_uuid(),
  acto_id uuid not null references actos(id) on delete cascade,
  user_id uuid not null references users(id),
  assignment_type text not null check (assignment_type in ('main_responsible','guide','media','support')),
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index ux_acto_primary_assignment on acto_assignments(acto_id) where is_primary = true;

create table acto_dependencies (
  id uuid primary key default gen_random_uuid(),
  acto_id uuid not null references actos(id) on delete cascade,
  depends_on_acto_id uuid not null references actos(id) on delete cascade,
  dependency_type text not null check (dependency_type in ('completion','material','compliance')),
  created_at timestamptz not null default now()
);

create table acto_runtime_logs (
  id uuid primary key default gen_random_uuid(),
  acto_id uuid not null references actos(id) on delete cascade,
  from_status acto_status,
  to_status acto_status not null,
  changed_by_user_id uuid references users(id),
  changed_at timestamptz not null default now(),
  note text
);

create table acto_checklists (
  id uuid primary key default gen_random_uuid(),
  acto_id uuid not null references actos(id) on delete cascade,
  checklist_type checklist_type not null,
  title text not null,
  created_at timestamptz not null default now()
);

create table checklist_items (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references acto_checklists(id) on delete cascade,
  label text not null,
  is_critical boolean not null default false,
  assigned_user_id uuid references users(id),
  due_at timestamptz,
  quantity numeric(12,2),
  supplier_name text,
  estimated_cost numeric(12,2),
  actual_cost numeric(12,2),
  current_status checklist_item_status not null default 'pending',
  available_confirmed boolean not null default false,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table content_items (
  id uuid primary key default gen_random_uuid(),
  scope content_scope not null,
  title text not null,
  type text not null,
  description text,
  target_roles jsonb,
  headquarters_id uuid references headquarters(id) on delete cascade,
  edition_id uuid references editions(id) on delete cascade,
  acto_code text,
  created_by_user_id uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((scope <> 'global') or headquarters_id is null)
);

create table content_versions (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  version_code text not null,
  workflow_status content_workflow_status not null default 'rascunho',
  changelog text,
  body_md text,
  is_mandatory boolean not null default false,
  published_at timestamptz,
  approved_by_user_id uuid references users(id),
  created_by_user_id uuid references users(id),
  created_at timestamptz not null default now(),
  unique(content_item_id, version_code)
);

alter table acto_versions
  add constraint fk_acto_versions_content_version foreign key (official_content_version_id) references content_versions(id);

create table file_assets (
  id uuid primary key default gen_random_uuid(),
  content_version_id uuid references content_versions(id) on delete cascade,
  acto_id uuid references actos(id) on delete cascade,
  asset_type text not null check (asset_type in ('pdf','image','video','audio','other')),
  storage_path text not null,
  original_filename text,
  mime_type text,
  size_bytes bigint,
  checksum text,
  created_at timestamptz not null default now()
);

create table content_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  content_version_id uuid not null references content_versions(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  edition_id uuid references editions(id) on delete cascade,
  open_count int not null default 0,
  consumed_percent numeric(5,2),
  read_confirmed boolean not null default false,
  confirmed_at timestamptz,
  expired_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index ux_content_ack_scope
on content_acknowledgements(content_version_id, user_id, coalesce(edition_id, '00000000-0000-0000-0000-000000000000'::uuid));

create table incident_reports (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions(id) on delete cascade,
  acto_id uuid not null references actos(id) on delete cascade,
  category text not null,
  severity text not null check (severity in ('baixa','media','alta','critica')),
  description text not null,
  action_taken text,
  reported_by_user_id uuid references users(id),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table headquarters_homologation_cycles (
  id uuid primary key default gen_random_uuid(),
  headquarters_id uuid not null references headquarters(id) on delete cascade,
  cycle_number int not null,
  current_status text not null,
  started_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table headquarters_reviews (
  id uuid primary key default gen_random_uuid(),
  headquarters_id uuid not null references headquarters(id) on delete cascade,
  edition_id uuid not null references editions(id) on delete cascade,
  homologation_cycle_id uuid not null references headquarters_homologation_cycles(id) on delete cascade,
  evaluator_user_id uuid references users(id),
  total_score numeric(5,2),
  has_eliminatory boolean not null default false,
  recommendation review_recommendation not null,
  final_decision text,
  opinion_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table homologation_scorecards (
  id uuid primary key default gen_random_uuid(),
  headquarters_review_id uuid not null references headquarters_reviews(id) on delete cascade,
  dimension_code text not null,
  score numeric(5,2) not null,
  note text,
  unique (headquarters_review_id, dimension_code)
);

create table penalties (
  id uuid primary key default gen_random_uuid(),
  headquarters_id uuid not null references headquarters(id) on delete cascade,
  edition_id uuid references editions(id) on delete set null,
  headquarters_review_id uuid references headquarters_reviews(id) on delete set null,
  amount_estimated numeric(12,2) not null,
  amount_actual numeric(12,2),
  cost_center text,
  billing_status text,
  note text,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  channel notification_channel not null,
  type notification_type not null,
  title text not null,
  body text not null,
  reference_type text,
  reference_id uuid,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public_pages (
  id uuid primary key default gen_random_uuid(),
  page_type public_page_type not null,
  slug text not null unique,
  title text not null,
  current_status text not null check (current_status in ('draft','published','archived')),
  summary text,
  body_md text,
  headquarters_id uuid references headquarters(id) on delete cascade,
  edition_id uuid references editions(id) on delete cascade,
  published_at timestamptz,
  created_by_user_id uuid references users(id),
  updated_by_user_id uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table evidences (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid references editions(id) on delete cascade,
  acto_id uuid references actos(id) on delete cascade,
  incident_report_id uuid references incident_reports(id) on delete cascade,
  headquarters_review_id uuid references headquarters_reviews(id) on delete cascade,
  file_asset_id uuid references file_assets(id) on delete cascade,
  note text,
  created_by_user_id uuid references users(id),
  created_at timestamptz not null default now()
);

create table audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  headquarters_id uuid references headquarters(id) on delete set null,
  edition_id uuid references editions(id) on delete set null,
  reference_type text not null,
  reference_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_headquarters_name_state_city on headquarters(name, state, city);
create index idx_headquarters_public_slug on headquarters(public_slug);
create index idx_editions_hq_status_start on editions(headquarters_id, current_status, start_at);
create index idx_editions_public_slug on editions(public_slug, is_public);
create index idx_actos_edition_day_seq on actos(edition_id, day_number, sequence_order);
create index idx_checklist_items_status_due on checklist_items(checklist_id, current_status, is_critical, due_at);
create index idx_content_versions_status_published on content_versions(content_item_id, workflow_status, published_at desc);
create index idx_content_ack_user_status on content_acknowledgements(user_id, read_confirmed, expired_at);
create index idx_incident_reports_edition_severity on incident_reports(edition_id, severity, category);
create index idx_audit_events_user_action_created on audit_events(user_id, action, created_at desc);
create index idx_reviews_hq_edition on headquarters_reviews(headquarters_id, edition_id);
create index idx_couples_canonical on couples(edition_id, participant_low_id, participant_high_id);
create index idx_notifications_user_read on notifications(user_id, read_at, created_at desc);
