# Sprint 0 - Plano de Execução
## Produto: REM OS / REM Control Center Brasil
## Versão: 1.0
## Base: Freeze técnico aprovado

## 1. Objetivo
Preparar a base técnica, o domínio inicial e a disciplina de entrega do REM OS para permitir início de implementação com baixo retrabalho.

## 2. Resultados esperados da Sprint 0
- monorepo inicial configurado
- convenções técnicas aprovadas
- autenticação base operacional
- RBAC base modelado
- banco inicial criado em ambiente de desenvolvimento
- storage e buckets iniciais configurados
- design system base publicado
- pipeline CI básica funcionando
- observabilidade mínima habilitada
- backlog fatiado para Sprint 1
- OpenAPI e schema físico versionados no repositório

## 3. Escopo da Sprint 0
### 3.1 Engenharia
- criar monorepo com apps/web e packages compartilhados
- configurar lint, format, typecheck e test runner
- configurar ambiente Supabase/Postgres/Auth/Storage
- aplicar schema físico inicial
- criar seed mínima para papéis e usuários base
- configurar autenticação por e-mail/senha
- implementar middleware de sessão
- implementar RBAC base por sede/edição
- criar estrutura de rotas autenticadas e públicas
- configurar upload inicial de arquivos
- configurar logs de auditoria base

### 3.2 Produto/UX
- fechar navegação principal
- fechar tokens visuais iniciais
- fechar layout app shell
- aprovar wireframes de alta para telas críticas
- definir eventos analíticos mínimos

### 3.3 QA/DevEx
- checklist de ambientes
- pipeline CI com validação mínima
- padrão de branch, PR e Definition of Done
- massa de teste mínima

## 4. Entregáveis
- repositório inicial versionado
- schema SQL v1
- OpenAPI v1
- guia de setup local
- guia de convenções
- backlog Sprint 1 confirmado

## 5. Critérios de aceite da Sprint 0
- time novo consegue subir ambiente local seguindo README
- login base funciona em dev
- papéis base existem no banco
- primeira migration roda sem erro
- CI valida lint + typecheck + testes smoke
- layout app shell abre páginas pública e autenticada
- documentação central está publicada no repositório

## 6. Riscos imediatos
- atraso na definição de auth e RBAC
- schema inicial excessivamente grande
- falta de convenção de nomenclatura entre frontend e backend
- ausência de seed mínima para desenvolvimento

## 7. Mitigações
- congelar convenções no primeiro dia
- subir schema inicial por blocos
- validar OpenAPI e SQL antes do build de telas
- adotar seed determinística

## 8. Ordem sugerida dos 10 dias úteis
Dia 1: bootstrap repo, CI, convenções, ambientes
Dia 2: auth base, sessão, app shell
Dia 3: schema físico núcleo, migrations
Dia 4: RBAC e políticas de acesso
Dia 5: storage, audit_events, seeds
Dia 6: páginas públicas base
Dia 7: dashboards shell e navegação
Dia 8: contratos API alinhados ao backend
Dia 9: smoke tests e QA técnico
Dia 10: revisão, handoff Sprint 1 e retro técnica
