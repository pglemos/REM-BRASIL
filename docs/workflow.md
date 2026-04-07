# REM OS: Workflow de Desenvolvimento e Convenções

## 1. Estratégia de Branching (GitFlow Adaptado)

- **main:** Código estável em produção. Apenas merges de `develop` via PR.
- **develop:** Integração de novas funcionalidades. Base para novas branches.
- **feature/[ticket-id]-[slug]:** Desenvolvimento de novas funcionalidades. Ex: `feature/REM-S1-001-crud-staff`.
- **bugfix/[ticket-id]-[slug]:** Correção de bugs em `develop`.
- **hotfix/[ticket-id]-[slug]:** Correção crítica em `main`.

### Convenção de Commits (Conventional Commits)
- `feat:` Nova funcionalidade.
- `fix:` Correção de bug.
- `docs:` Alterações na documentação.
- `style:` Formatação, ponto e vírgula, etc (sem alteração de código).
- `refactor:` Refatoração de código.
- `test:` Adição ou correção de testes.
- `chore:` Atualização de build, dependências, etc.

## 2. Pull Requests (PR)

### Requisitos para Abertura
1. Branch nomeada corretamente.
2. Descrição clara do que foi feito e porquê.
3. Link para o ticket no backlog.
4. Screenshots ou vídeos para alterações de UI.

### Requisitos para Merge
1. Pelo menos 1 aprovação (Peer Review).
2. CI passando (Build, Lint, Typecheck, Smoke Tests).
3. Sem conflitos com a branch de destino.

## 3. Definition of Ready (DoR) - Quando iniciar?

Uma tarefa está pronta para desenvolvimento quando:
- [ ] O ticket tem uma descrição clara e objetiva.
- [ ] Os critérios de aceitação estão definidos.
- [ ] O design (se houver) está aprovado ou referenciado.
- [ ] As dependências técnicas foram identificadas.
- [ ] O esforço foi estimado (Story Points ou T-Shirt Size).

## 4. Definition of Done (DoD) - Quando terminar?

Uma tarefa está concluída quando:
- [ ] O código segue as convenções do projeto (Lint, Prettier).
- [ ] A funcionalidade atende a todos os critérios de aceitação.
- [ ] Testes automatizados (Unitários ou E2E) foram adicionados/atualizados.
- [ ] O código passou por Code Review e foi aprovado.
- [ ] A documentação (se necessário) foi atualizada.
- [ ] O deploy em ambiente de homologação foi realizado e validado.
- [ ] Não foram introduzidos novos débitos técnicos críticos.

## 5. Qualidade de Código (Lint & Typecheck)

- **Lint:** `npm run lint` (ESLint + Prettier).
- **Typecheck:** `npm run typecheck` (TypeScript).
- **E2E Tests:** `npm run test:e2e` (Playwright).
- **CI/CD:** GitHub Actions configurado em `.github/workflows/ci.yml`.
