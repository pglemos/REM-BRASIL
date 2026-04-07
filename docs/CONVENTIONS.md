# Convenções de Desenvolvimento e Qualidade (REM OS)

Este documento define as regras e padrões de desenvolvimento para o projeto REM OS, garantindo consistência, qualidade e rastreabilidade em todo o ciclo de vida do software.

## 1. Estratégia de Branching (GitHub Flow Adaptado)

Utilizamos um modelo baseado em Trunk-Based Development com branches de feature curtas.

*   **`main`**: Branch principal. Sempre reflete o ambiente de produção. Código aqui deve ser estável e *deployable*.
*   **`develop`** (opcional/staging): Branch de integração para testes em ambiente de homologação antes de ir para produção.
*   **Branches de Feature/Bugfix**:
    *   Formato: `<tipo>/<ticket-id>-<descricao-curta>`
    *   Tipos permitidos: `feature`, `bugfix`, `hotfix`, `chore`, `docs`.
    *   Exemplo: `feature/REM-S0-011-login-email`, `bugfix/REM-S1-005-fix-header-mobile`.

## 2. Convenções de Commits (Conventional Commits)

Todos os commits devem seguir a especificação [Conventional Commits](https://www.conventionalcommits.org/). Isso facilita a geração de changelogs automáticos e o entendimento do histórico.

**Formato:**
`<tipo>(<escopo opcional>): <descrição> [Ticket ID]`

**Tipos:**
*   `feat`: Uma nova funcionalidade.
*   `fix`: Correção de um bug.
*   `chore`: Atualizações de dependências, configurações de build, etc. (não altera código de produção).
*   `docs`: Alterações apenas na documentação.
*   `style`: Formatação, ponto e vírgula faltando, etc. (não afeta o significado do código).
*   `refactor`: Refatoração de código que não corrige bug nem adiciona feature.
*   `test`: Adição ou correção de testes.

**Exemplos:**
*   `feat(auth): implementar login com supabase [REM-S0-011]`
*   `fix(ui): corrigir alinhamento do botão no mobile [REM-S1-005]`

## 3. Pull Requests (PRs)

*   Todo código deve entrar na `main` (ou `develop`) através de um Pull Request.
*   **Tamanho:** PRs devem ser pequenos e focados em resolver um único ticket.
*   **Revisão:** Exige aprovação de pelo menos 1 desenvolvedor (Code Review).
*   **CI/CD:** Todos os checks automatizados (Lint, Typecheck, Testes) devem passar antes do merge.
*   **Merge Strategy:** Utilizar `Squash and Merge` para manter o histórico da branch principal limpo (1 PR = 1 Commit na main).

## 4. Definition of Ready (DoR)

Uma tarefa (Ticket/Issue) é considerada "Pronta para Desenvolvimento" (Ready) quando atende aos seguintes critérios:

1.  **Descrição Clara:** O problema ou funcionalidade está claramente descrito.
2.  **Critérios de Aceite (AC):** Possui uma lista clara do que precisa acontecer para a tarefa ser considerada concluída.
3.  **UI/UX:** Se houver interface visual, os protótipos/designs (Figma) estão anexados e aprovados.
4.  **Dependências Resolvidas:** Não há bloqueios técnicos ou dependências de outras tarefas não concluídas.
5.  **Estimativa:** A tarefa foi discutida e seu tamanho/esforço foi estimado pela equipe.

## 5. Definition of Done (DoD)

Um Pull Request / Tarefa é considerado "Concluído" (Done) quando atende aos seguintes critérios:

1.  **Código Compila:** O build passa sem erros (`npm run build`).
2.  **Qualidade de Código:** Linting e Typechecking passam sem erros (`npm run lint`, `tsc --noEmit`).
3.  **Critérios de Aceite:** Todos os critérios definidos no ticket foram atendidos.
4.  **Testes:** Testes unitários/fumaça foram criados ou atualizados e estão passando.
5.  **Code Review:** O PR foi revisado e aprovado por outro desenvolvedor.
6.  **Documentação:** README, Swagger/OpenAPI ou comentários de código foram atualizados, se necessário.
7.  **Deploy:** A funcionalidade foi implantada com sucesso no ambiente de Staging/Homologação e validada.
