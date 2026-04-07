# Design System - REM OS

Este documento descreve os padrões de design e componentes do sistema REM OS.

## 1. Princípios de Design

*   **Clareza e Hierarquia:** O uso de superfícies (`surface-container`, `surface-container-low`) define a hierarquia visual.
*   **Consistência:** A tipografia é padronizada para garantir legibilidade e identidade visual.
*   **Acessibilidade:** O contraste entre texto e fundo é priorizado.

## 2. Padrões de Componentes

### Modais
*   Utilizam o componente `Modal` padrão.
*   Devem conter um cabeçalho claro e uma área de ação (botões) na parte inferior.
*   O fundo do modal deve ser `surface`.

### Cards
*   Utilizam bordas sutis (`border-outline/30`) e sombras leves (`shadow-sm`).
*   O cabeçalho do card deve ser diferenciado (ex: `bg-surface-container/30`).

### Botões
*   **Primários:** Fundo `action-orange` ou `pulse-cyan`, texto branco, fonte em negrito (`font-black`), letras maiúsculas (`uppercase`).
*   **Secundários/Cancelar:** Texto `on-surface-variant`, sem fundo ou com fundo `surface-container-high` no hover.

## 3. Layout e Espaçamento

*   O sistema utiliza o sistema de grid do Tailwind CSS.
*   Espaçamentos devem seguir a escala padrão do Tailwind (`p-3`, `p-6`, `gap-4`, etc.).
*   O layout deve ser responsivo, utilizando `w-full` e `max-w-7xl` para centralização.

## 4. Interações

*   **Hover:** Elementos interativos devem ter uma transição suave (`transition-colors`, `transition-all`).
*   **Feedback:** Botões de ação devem ter um efeito de escala ao clicar (`active:scale-95`).
*   **Estados:** Estados de carregamento devem ser indicados visualmente (ex: "Enviando...").

---
*Este documento deve ser atualizado conforme novos componentes ou padrões forem adicionados ao sistema.*
