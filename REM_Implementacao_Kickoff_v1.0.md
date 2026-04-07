# Implementação - Kickoff Técnico
## Objetivo
Usar o freeze funcional e técnico aprovado para iniciar a construção do REM OS sem reabrir decisões de domínio já congeladas.

## Diretrizes
1. Tratar PRD v1.2 e Especificação Funcional v1.1 como base de negócio e regra.
2. Tratar backlog v1.1, modelo lógico v1.1 e API Contract v1.1 como base técnica inicial.
3. Não reabrir nomenclatura de domínio: usar **edition/editions**.
4. Não reabrir regra de ACTO: usar **aguardando início** como estado obrigatório intermediário.
5. Não modelar saúde no casal; modelar por participante.
6. Não permitir duplicidade de casal por inversão A/B.

## Stack recomendada
- Next.js + TypeScript
- Tailwind CSS
- Supabase (Postgres/Auth/Storage/RLS)
- Zod para validação
- TanStack Query
- Playwright + Vitest

## Primeiros módulos a construir
1. auth + sessão
2. papéis + escopo
3. sedes
4. edições
5. template de 30 ACTOS
6. shell público
7. shell autenticado

## Definition of Done mínima
- regra implementada
- permissão validada
- log/auditoria quando aplicável
- teste funcional básico
- documentação técnica atualizada
