# Backlog Detalhado MVP
## Produto: REM OS / REM Control Center Brasil
## Versão: 1.1
## Base: PRD v1.2 + Especificação Funcional MVP v1.1
## Status: Revisado com portal público, notificações e ajustes de freeze técnico

---

## 1. Regras de priorização

### Prioridade
- P0 = bloqueante para MVP
- P1 = altamente desejável no MVP
- P2 = pós-MVP / MMP

### Classificação
- FE = frontend
- BE = backend
- DB = dados
- QA = testes
- UX = design
- INT = integração

---

## 2. Épico 0 - Portal Público / Landing Page
**Objetivo:** entregar a porta de entrada pública do REM prevista no escopo do produto.

### Feature 0.1 - Home institucional pública
**P1**
- HU-000 Como visitante, quero entender o que é o REM e navegar pela proposta pública.
  - Critérios de aceite:
    - página pública exibe manifesto, proposta de valor, identidade visual e CTA principal
    - conteúdo é gerenciável por páginas públicas ou CMS simplificado
    - página carrega sem autenticação
  - Dependências: conteúdo publicado, assets públicos
  - Técnicas: FE, BE, UX, QA

### Feature 0.2 - Calendário público por sede e edição
**P1**
- HU-000A Como visitante, quero consultar calendário público do REM por sede, data e localização.
  - Critérios de aceite:
    - lista edições públicas futuras
    - filtros por estado/sede/período
    - exibe apenas sedes e edições marcadas como públicas
  - Dependências: sedes, edições, public flags
  - Técnicas: FE, BE, DB, QA

### Feature 0.3 - Página pública da sede/edição
**P1**
- HU-000B Como visitante, quero abrir uma página pública de sede ou edição com detalhes e CTA de inscrição.
  - Critérios de aceite:
    - slug público resolve página
    - exibe localidade, datas, resumo e link/CTA de inscrição
    - respeita status publicado
  - Dependências: edições, páginas públicas
  - Técnicas: FE, BE, DB, QA

### Feature 0.4 - Gestão editorial do portal público
**P1**
- HU-000C Como direção nacional, quero publicar textos e destaques do portal público sem depender de código.
  - Critérios de aceite:
    - permite publicar seções de home, FAQ, contato e banners
    - histórico de publicação e revisão auditável
  - Dependências: CMS oficial
  - Técnicas: FE, BE, DB, QA

---

## 3. Épico 1 - Fundação de acesso, tenants e governança
**Objetivo:** permitir autenticação, isolamento por sede, papéis e trilha mínima de auditoria.

### Feature 1.1 - Autenticação e sessão
**P0**
- HU-001 Como usuário autorizado, quero autenticar por e-mail/senha para acessar a plataforma.
  - Critérios de aceite:
    - login com credenciais válidas cria sessão
    - login inválido retorna erro padronizado
    - logout invalida sessão
    - bloqueio após tentativas excessivas
  - Dependências: nenhuma
  - Técnicas: FE, BE, QA

- HU-002 Como sistema, quero registrar eventos de login/logout para auditoria.
  - Critérios de aceite:
    - login e logout geram audit_event
    - log contém user_id, timestamp, ip e user_agent
  - Dependências: modelo de auditoria
  - Técnicas: BE, DB, QA

### Feature 1.2 - RBAC e escopo por sede
**P0**
- HU-003 Como Super Admin, quero atribuir papéis a usuários para controlar acesso.
- HU-004 Como Diretor Local, quero acessar somente minha sede e suas edições.
- HU-005 Como Staff, quero ver apenas ACTOS e tarefas vinculadas ao meu papel/edição.
  - Critérios de aceite:
    - acesso respeita papel + escopo da sede
    - dados de outras sedes não aparecem
    - recursos sem permissão retornam 403
  - Dependências: users, roles, sede
  - Técnicas: BE, DB, QA

### Feature 1.3 - Estrutura multi-sede
**P0**
- HU-006 Como direção nacional, quero cadastrar sedes com status e diretor local.
- HU-007 Como sistema, quero aplicar estado inicial automático "em implantação".
  - Critérios de aceite:
    - sede criada com status inicial pelo sistema
    - unicidade por nome+cidade+estado
    - histórico de mudança de status auditável
  - Técnicas: FE, BE, DB, QA

---

## 4. Épico 2 - Gestão de conteúdo oficial e versionamento
**Objetivo:** tornar a plataforma a fonte única da verdade para conteúdo oficial.

### Feature 2.1 - Cadastro de conteúdo
**P0**
- HU-008 Como autor/editor, quero cadastrar conteúdo oficial com metadados e anexos.
- HU-009 Como editor, quero versionar conteúdo.
  - Critérios:
    - conteúdo exige título, tipo, escopo, versão e descrição
    - upload de anexo funciona
    - versão nova não sobrescreve histórico
  - Técnicas: FE, BE, DB, QA

### Feature 2.2 - Workflow editorial
**P0**
- HU-010 Como revisor, quero enviar/receber conteúdo em revisão.
- HU-011 Como aprovador nacional, quero aprovar conteúdo para publicação.
- HU-012 Como publicador, quero publicar apenas conteúdos aprovados e com changelog.
  - Critérios:
    - fluxo rascunho -> revisão -> aprovado -> publicado
    - publicação sem changelog bloqueada
    - versão anterior vira superseded quando aplicável
  - Técnicas: FE, BE, DB, QA

### Feature 2.3 - Leitura obrigatória e invalidação por nova versão
**P0**
- HU-013 Como sistema, quero invalidar confirmação da versão antiga quando nova versão obrigatória for publicada.
- HU-014 Como usuário impactado, quero ser notificado sobre leitura obrigatória pendente.
  - Critérios:
    - publish de nova versão cria pendências para perfis impactados
    - leitura antiga muda para expirada
    - notificação criada
  - Técnicas: BE, DB, QA, INT

---

## 5. Épico 3 - Gestão de edições
**Objetivo:** estruturar a instância concreta do evento por sede.

### Feature 3.1 - Criação de edição
**P0**
- HU-015 Como Diretor Local, quero criar edição a partir do template oficial de 30 ACTOS.
  - Critérios:
    - edição exige sede, nome, datas, local e responsável geral
    - replica 30 ACTOS na ordem correta
    - estado inicial = rascunho
  - Técnicas: FE, BE, DB, QA

### Feature 3.2 - Estados e prontidão da edição
**P0**
- HU-016 Como sistema, quero impedir mudança para "pronta" sem staff mínimo e critérios mínimos.
- HU-017 Como Diretor Local, quero ver os bloqueios que impedem a edição de ficar pronta.
  - Critérios:
    - checa staff mínimo congelado
    - checa responsáveis dos 30 ACTOS
    - checa checklist crítico > 90%
    - checa leitura obrigatória mínima > 80%
  - Técnicas: FE, BE, DB, QA

---

## 6. Épico 4 - Casais, famílias/equipes e staff
**Objetivo:** modelar a operação real da edição.

### Feature 4.1 - Casais
**P0**
- HU-018 Como Coordenador Local, quero cadastrar ou importar casais por CSV.
- HU-019 Como sistema, quero impedir conflito do mesmo participante em dois casais da mesma edição, inclusive por inversão A/B.
  - Critérios:
    - cadastro manual com campos obrigatórios
    - importação CSV validada
    - duplicidade bloqueada
    - inversão A/B do mesmo casal é rejeitada
  - Técnicas: FE, BE, DB, QA

### Feature 4.2 - Famílias/equipes
**P1**
- HU-020 Como Diretor Local, quero montar famílias/equipes e vincular guias.
  - Critérios:
    - família exige identificador único + guia + casal
    - casal não pode estar em duas famílias
  - Técnicas: FE, BE, DB, QA

### Feature 4.3 - Staff da edição
**P0**
- HU-021 Como Diretor Local, quero montar o staff e ver status de treinamento/compliance.
- HU-022 Como sistema, quero bloquear edição pronta se faltar papel bloqueante.
  - Critérios:
    - staff vinculado à edição e papel
    - cálculo automático dos bloqueios por papel
  - Técnicas: FE, BE, DB, QA

### Feature 4.4 - Dados sensíveis por participante
**P0**
- HU-022A Como coordenador autorizado, quero registrar alergias, restrições e contatos de emergência por participante individual.
  - Critérios:
    - saúde e contato emergencial são armazenados por participante
    - casal continua sendo agregador operacional
    - acesso respeita política LGPD
  - Técnicas: FE, BE, DB, QA

---

## 7. Épico 5 - Trilha operacional por ACTO
**Objetivo:** transformar manual + cronograma em fluxo navegável e operável.

### Feature 5.1 - Tela padrão do ACTO
**P0**
- HU-023 Como Diretor Local, quero acessar cada ACTO com contexto, objetivo, materiais, guião, passo a passo, responsáveis, anexos e status.
  - Critérios:
    - todos os 30 ACTOS possuem tela própria
    - exibe versão oficial vinculada
    - exibe bloco de checklist e evidências
  - Técnicas: FE, BE, DB, QA, UX

### Feature 5.2 - Responsáveis por ACTO
**P0**
- HU-024 Como Diretor Local, quero definir responsável principal por ACTO.
  - Critérios:
    - apenas perfis autorizados podem ser responsáveis
    - ausência de responsável bloqueia ACTO crítico
  - Técnicas: FE, BE, DB, QA

### Feature 5.3 - Checklists integrados
**P0**
- HU-025 Como coordenador, quero marcar itens críticos por ACTO.
- HU-026 Como sistema, quero consolidar compras por edição.
  - Critérios:
    - item pode ter responsável, prazo, quantidade, custo e observação
    - visão consolidada por edição
    - itens críticos em atraso geram alerta
  - Técnicas: FE, BE, DB, QA

---

## 8. Épico 6 - Execução ao vivo
**Objetivo:** monitorar o cronograma em tempo real.

### Feature 6.1 - Máquina de estados do ACTO
**P0**
- HU-027 Como sistema, quero mover ACTO de pronto para aguardando início em T-15 ou manualmente.
- HU-028 Como responsável, quero iniciar ACTO apenas em aguardando início.
  - Critérios:
    - transições obedecem especificação
    - iniciar fora do estado permitido bloqueia ação
  - Técnicas: FE, BE, QA

### Feature 6.2 - Cronômetro e encerramento
**P1**
- HU-029 Como diretor, quero registrar início real, fim real, atraso e ressalvas.
  - Critérios:
    - calcula on-time vs atraso
    - justificativa obrigatória em atraso/ressalva
  - Técnicas: FE, BE, DB, QA

### Feature 6.3 - Incidentes
**P1**
- HU-030 Como usuário autorizado, quero registrar incidente por ACTO.
  - Critérios:
    - incidente exige categoria, severidade e descrição
    - incidente crítico pode forçar ressalva
  - Técnicas: FE, BE, DB, QA

---

## 9. Épico 7 - Auditoria, compliance, notificações e LGPD
**Objetivo:** rastrear consumo, proteger dados e suportar cobrança baseada em evidência.

### Feature 7.1 - Auditoria de consumo
**P0**
- HU-031 Como direção nacional, quero ver quem abriu, consumiu, confirmou e baixou conteúdos.
  - Critérios:
    - diferencia abertura, consumo, confirmação, download
    - filtrável por usuário, sede, edição, versão
  - Técnicas: FE, BE, DB, QA

### Feature 7.2 - Compliance congelado
**P0**
- HU-032 Como sistema, quero aplicar thresholds fixos de consumo por tipo de conteúdo.
- HU-033 Como sistema, quero bloquear ACTO quando faltas críticas de compliance existirem.
  - Critérios:
    - texto = 45s/500 palavras ou 80% scroll
    - vídeo = 80%
    - arquivo de impressão = download + confirmação
  - Técnicas: BE, QA

### Feature 7.3 - Dados sensíveis / LGPD
**P0**
- HU-034 Como sistema, quero mascarar dados sensíveis para perfis não autorizados.
- HU-035 Como usuário autorizado, quero registrar acesso emergencial com justificativa.
  - Critérios:
    - logs específicos para dado sensível
    - retenção de 180 dias configurada
    - exportação exige justificativa
  - Técnicas: FE, BE, DB, QA

### Feature 7.4 - Notificações e alertas operacionais
**P1**
- HU-035A Como usuário, quero listar minhas notificações e marcar como lidas.
- HU-035B Como sistema, quero gerar alertas automáticos para leitura pendente, item crítico vencido, ACTO bloqueado e incidente crítico.
  - Critérios:
    - notificações aparecem em lista cronológica
    - usuário consegue marcar individualmente como lida
    - unread count é retornado
    - geração automática ocorre para eventos críticos configurados no freeze
  - Técnicas: FE, BE, DB, QA, INT

---

## 10. Épico 8 - Homologação
**Objetivo:** padronizar o ciclo de 3 edições e decisão nacional.

### Feature 8.1 - Scorecard
**P0**
- HU-036 Como avaliador, quero preencher score por dimensão e parecer.
  - Critérios:
    - todas as dimensões obrigatórias
    - total calculado automaticamente
  - Técnicas: FE, BE, DB, QA

### Feature 8.2 - Critérios eliminatórios e decisão
**P0**
- HU-037 Como sistema, quero aplicar critérios eliminatórios acima da nota.
- HU-038 Como direção nacional, quero homologar ou reciclar com trilha de decisão.
  - Critérios:
    - homologação exige 3 avaliações + média >=85 + sem eliminatório
    - reciclagem dispara plano corretivo
  - Técnicas: FE, BE, DB, QA

### Feature 8.3 - Penalidade financeira
**P1**
- HU-039 Como direção nacional, quero registrar custos extras após 3ª edição.
  - Critérios:
    - penalidade só permitida após 3ª edição
    - registra valor estimado, valor real e status de cobrança
  - Técnicas: FE, BE, DB, QA

---

## 11. Épico 9 - Dashboards e relatórios
**Objetivo:** dar visibilidade nacional e local.

### Feature 9.1 - Dashboard nacional
**P1**
- HU-040 Como direção nacional, quero ver sedes, compliance, pendências e homologação.
  - Critérios:
    - filtros por período, sede, estado
    - KPIs mínimos do freeze
  - Técnicas: FE, BE, QA, UX

### Feature 9.2 - Dashboard local
**P1**
- HU-041 Como diretor local, quero ver progresso da edição, ACTOS prontos, staff e materiais faltantes.
  - Critérios:
    - KPIs mínimos exibidos
    - atalho para ACTOS críticos
  - Técnicas: FE, BE, QA, UX

### Feature 9.3 - Exportações
**P1**
- HU-042 Como usuário autorizado, quero exportar CSV/PDF básico.
  - Critérios:
    - CSV de casais
    - CSV de checklist
    - PDF simples de edição
    - PDF simples de homologação
  - Técnicas: FE, BE, QA

---

## 12. Dependências macro entre épicos

1. Épico 1 desbloqueia todos os demais
2. Épico 0 depende de conteúdo publicado e sedes/edições públicas
3. Épico 2 depende de auth + RBAC
4. Épico 3 depende de sedes
5. Épico 4 depende de edições
6. Épico 5 depende de edições + conteúdo
7. Épico 6 depende de ACTOS + checklists
8. Épico 7 depende de conteúdo + papéis + eventos críticos
9. Épico 8 depende de edições + auditoria
10. Épico 9 depende de dados produzidos pelos demais

---

## 13. Backlog técnico da Sprint 0 a Sprint 4

### Sprint 0
- setup monorepo/apps
- auth base
- RBAC base
- design tokens/layout app shell
- schema inicial tenants/users/roles
- audit_events base

### Sprint 1
- CRUD sedes
- CRUD usuários locais
- criação de edição
- replicação template 30 ACTOS
- estados básicos edição/sede
- estrutura de páginas públicas e slugs

### Sprint 2
- CMS oficial
- versionamento
- workflow editorial
- leitura obrigatória
- acknowledgements
- home pública e calendário público

### Sprint 3
- tela ACTO
- responsáveis
- checklist compras/logística
- consolidado por edição
- alertas básicos
- página pública de sede/edição

### Sprint 4
- casais
- famílias/equipes
- staff
- saúde por participante
- notificações/lista de alertas

---

## 14. Definição de pronto (DoR/DoD)

### Definition of Ready
Uma história só entra em sprint quando:
- possui objetivo claro
- critérios de aceite testáveis
- dependências conhecidas
- campos e estados definidos
- impacto em papéis conhecido

### Definition of Done
Uma história só sai da sprint quando:
- critérios de aceite passam
- testes básicos executados
- logs/auditoria aplicáveis existem
- permissão foi validada
- documentação técnica mínima foi atualizada
