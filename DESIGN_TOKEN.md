# Design Tokens - REM OS

Este documento define os tokens de design utilizados no sistema REM OS. Eles são a base para manter a consistência visual e a escalabilidade da interface.

## 1. Cores

O sistema utiliza um sistema de cores baseado em superfícies e ações.

### Cores Principais
| Token | Cor | Uso |
| :--- | :--- | :--- |
| `pulse-cyan` | `#37D2E2` | Ações principais, destaques, elementos ativos. |
| `action-orange` | `#FF6600` | Ações secundárias, alertas de atenção, botões de ação. |

### Superfícies
| Token | Cor | Uso |
| :--- | :--- | :--- |
| `surface` | `#FFFFFF` | Fundo de componentes (cards, modais). |
| `surface-container` | `#F1F5F5` | Fundo de áreas de conteúdo, containers. |
| `surface-container-low` | `#F8FAFA` | Fundo da página principal. |
| `surface-container-high` | `#E8EDED` | Estados de hover, elementos de destaque. |

### Texto e Ícones
| Token | Cor | Uso |
| :--- | :--- | :--- |
| `on-surface` | `#1A2223` | Texto principal, títulos. |
| `on-surface-variant` | `#556B6D` | Textos secundários, legendas, ícones inativos. |
| `outline` | `#D1DBDB` | Bordas, divisores. |

---

## 2. Tipografia

O sistema utiliza uma fonte sans-serif moderna.

*   **Fonte Principal:** Inter (via `var(--font-sans)`)
*   **Utilitários de Estilo:**
    *   `.technical-label`: Fonte com espaçamento entre letras aumentado (`letter-spacing: 0.08em`), usada para metadados e labels técnicos.
    *   `.editorial-title`: Títulos com espaçamento negativo (`letter-spacing: -0.03em`) para maior impacto.

---

## 3. Efeitos e Utilitários

*   `.glass-panel`: Efeito de vidro fosco (`backdrop-filter: blur(16px)`) para painéis sobrepostos.
*   `.shadow-up`: Sombra projetada para cima (`box-shadow: 0 -4px 12px rgba(0,0,0,0.05)`), usada em barras de rodapé ou elementos flutuantes.
