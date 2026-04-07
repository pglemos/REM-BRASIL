# Decomposição em Tickets - Sprint 0
## Convenção
- ID: REM-S0-XXX
- Tipo: EPIC / STORY / TASK / SPIKE
- Prioridade: P0/P1
- Dependência: IDs predecessores

| ID | Tipo | Título | Prioridade | Dependência |
|---|---|---|---|---|
| REM-S0-001 | TASK | Criar monorepo base apps/web + packages | P0 | - |
| REM-S0-002 | TASK | Configurar TypeScript, ESLint, Prettier e Husky | P0 | REM-S0-001 |
| REM-S0-003 | TASK | Configurar CI com lint, typecheck e smoke test | P0 | REM-S0-001 |
| REM-S0-004 | TASK | Configurar variáveis de ambiente e README de setup | P0 | REM-S0-001 |
| REM-S0-005 | TASK | Provisionar projeto Supabase e conexões locais | P0 | - |
| REM-S0-006 | TASK | Criar migration inicial users, roles, user_roles, headquarters, editions | P0 | REM-S0-005 |
| REM-S0-007 | TASK | Criar migration inicial actos, checklists e audit_events | P0 | REM-S0-006 |
| REM-S0-008 | TASK | Criar migration inicial content, notifications e public_pages | P0 | REM-S0-006 |
| REM-S0-009 | TASK | Criar schema para participants, couples canonicalizados e health_flags por participante | P0 | REM-S0-006 |
| REM-S0-010 | TASK | Popular seeds de papéis e usuários base | P0 | REM-S0-006 |
| REM-S0-011 | STORY | Implementar login por e-mail/senha | P0 | REM-S0-005 |
| REM-S0-012 | TASK | Implementar logout e sessão persistida | P0 | REM-S0-011 |
| REM-S0-013 | TASK | Implementar middleware auth + route guards | P0 | REM-S0-011 |
| REM-S0-014 | STORY | Implementar RBAC base por sede e edição | P0 | REM-S0-006, REM-S0-013 |
| REM-S0-015 | TASK | Definir enum oficial de estados sede/edição/ACTO | P0 | REM-S0-006 |
| REM-S0-016 | TASK | Configurar app shell autenticado | P0 | REM-S0-001 |
| REM-S0-017 | TASK | Configurar shell público e rotas /public | P0 | REM-S0-001 |
| REM-S0-018 | TASK | Implementar layout Dashboard Nacional placeholder | P1 | REM-S0-016 |
| REM-S0-019 | TASK | Implementar layout Dashboard Local placeholder | P1 | REM-S0-016 |
| REM-S0-020 | TASK | Implementar Home pública placeholder | P1 | REM-S0-017 |
| REM-S0-021 | TASK | Implementar Calendário público placeholder | P1 | REM-S0-017 |
| REM-S0-022 | TASK | Configurar bucket de assets e política inicial | P0 | REM-S0-005 |
| REM-S0-023 | TASK | Implementar upload básico de arquivos | P1 | REM-S0-022 |
| REM-S0-024 | TASK | Configurar audit_events base | P0 | REM-S0-007 |
| REM-S0-025 | TASK | Documentar convenções de branch, PR, DoR e DoD | P0 | - |
| REM-S0-026 | SPIKE | Validar estratégia de RLS por sede/edição | P0 | REM-S0-006 |
| REM-S0-027 | SPIKE | Validar modelagem final de notificações in_app + email | P1 | REM-S0-008 |
| REM-S0-028 | TASK | Gerar OpenAPI inicial no repositório | P0 | REM-S0-006 |
| REM-S0-029 | TASK | Publicar schema SQL inicial no repositório | P0 | REM-S0-006 |
| REM-S0-030 | TASK | Criar smoke tests auth, home pública, dashboard e migrations | P0 | REM-S0-003, REM-S0-011 |
