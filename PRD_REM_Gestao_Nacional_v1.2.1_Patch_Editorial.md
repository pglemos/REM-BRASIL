# PRD - Plataforma Nacional de Gestão do REM Brasil
## Produto: REM OS / REM Control Center Brasil
## Versão: 1.2
## Data: 2026-04-02
## Status: Documento refinado, corrigido e consolidado para freeze funcional e backlog MVP

---

## 1. Resumo executivo

O REM precisa sair de um modelo fragmentado, baseado em Drive, PDFs soltos, apresentações espalhadas, vídeos fora de versão e dependência de memória operacional, para uma plataforma centralizada de gestão, padronização, auditoria e homologação.

A plataforma deve permitir que a direção nacional do REM Brasil, especialmente Rafael Pinheiro e Erika Pinheiro, tenha controle total sobre:
- padronização de conteúdo
- atualização de materiais
- homologação de novas sedes
- acompanhamento de edições
- auditoria de acessos
- rastreabilidade de consumo de conteúdo
- checklist operacional por ACTO
- gestão de responsáveis
- execução local com padrão nacional

Ao mesmo tempo, a plataforma deve dar aos diretores locais uma trilha operacional prática e guiada, organizada por edição, por dia e por ACTO, contendo em uma única tela:
- o porquê da atividade
- o inimigo a atacar
- o roteiro do mestre de cerimônias
- o passo a passo
- o que precisa ser comprado ou preparado
- os responsáveis
- anexos, vídeos, arquivos e materiais de apoio
- checklist de execução
- status de concluído / pendente / em risco

O sistema será, na prática, o sistema operacional do REM.

---

## 2. Contexto do negócio

O REM é uma experiência matrimonial imersiva, roteirizada, espiritual, emocional e vivencial, estruturada em 2 dias, com cronograma oficial, trilha pedagógica por ACTOS e materiais específicos por ministração e dinâmica.

Hoje, a execução depende fortemente de:
- PDFs distribuídos manualmente
- pastas no Google Drive
- apresentações e vídeos fora de controle de versão
- memória dos diretores e equipes locais
- risco de esquecer compras e materiais físicos
- falta de auditoria de quem acessou ou não o conteúdo
- ausência de painel nacional de homologação e qualidade

Isso gera:
- sedes operando com materiais desatualizados
- falhas logísticas em cima da hora
- perda de padrão nacional
- dificuldade para cobrar execução correta
- baixa rastreabilidade
- pouca previsibilidade na homologação de novas sedes

---

## 3. Problema principal

### 3.1 Problema central
A operação do REM não possui hoje um sistema único que concentre conteúdo, cronograma, checklist, homologação, auditoria e execução padronizada.

### 3.2 Sintomas do problema
- arquivos se perdem no Drive
- diretores locais baixam versões antigas
- materiais de compra ficam em documentos separados do ACTO
- o roteiro do que falar não está centralizado com o roteiro do que fazer
- a direção nacional não sabe, em tempo real, quem acessou o quê
- não existe um farol visual claro de homologação por sede
- não há visão consolidada do progresso de cada nova sede
- não existe uma trilha digital operacional minuto a minuto por ACTO

### 3.3 Impactos
- quebra de padrão da experiência
- falhas na excelência do REM
- risco reputacional para a marca nacional
- desperdício de tempo operacional
- retrabalho
- baixa governança
- dificuldade de expansão segura

---

## 4. Visão do produto

Criar uma plataforma nacional do REM que funcione como:
1. **Portal público do REM**
2. **Painel administrativo global**
3. **Portal do diretor local**
4. **CMS de conteúdos oficiais**
5. **Motor de trilha operacional por ACTO**
6. **Sistema de homologação de sedes**
7. **Sistema de auditoria e compliance de acesso**
8. **Base de mídia, arquivos, vídeos e materiais**
9. **Camada offline e mobile em fases futuras**

---

## 5. Objetivos do produto

### 5.1 Objetivos estratégicos
- garantir padronização nacional do REM
- centralizar toda a operação em uma única plataforma
- reduzir falhas logísticas
- garantir atualização de conteúdo por sede
- criar governança de expansão e homologação
- dar visibilidade executiva à direção nacional
- transformar o manual e o cronograma em fluxo operacional prático

### 5.2 Objetivos táticos
- permitir que cada sede execute sua edição usando a plataforma como referência única
- vincular checklist de compras à tela do ACTO
- registrar quem acessou, leu, baixou e confirmou cada conteúdo
- permitir atualizações com rastreabilidade
- organizar materiais por módulo, ACTO, função, edição e mídia
- permitir workflows de delegação e confirmação

### 5.3 Objetivos operacionais
- evitar esquecimento de itens físicos
- evitar uso de materiais obsoletos
- facilitar onboarding de diretores locais
- permitir cobrança com base em dados
- melhorar preparação pré-evento e execução ao vivo

---

## 6. Não objetivos iniciais

Ficam fora do MVP:
- ERP financeiro completo da sede
- emissão fiscal
- automação profunda de marketing pago
- social network interno complexo
- CRM comercial completo para leads públicos
- app nativo completo com NFC no primeiro release
- BI avançado multi-canal de mídia no MVP
- edição colaborativa simultânea estilo Google Docs no MVP

---

## 7. Stakeholders

### 7.1 Stakeholders primários
- Rafael Pinheiro - Diretor REM Brasil
- Erika Pinheiro - Direção REM Brasil
- Diretores locais das sedes
- Coordenadores locais de edição
- Equipes de logística
- Equipes de guias
- Mestres de cerimônia / hosts
- Preletores
- Equipe audiovisual / mídia

### 7.2 Stakeholders secundários
- equipe de homologação nacional
- avaliadores presenciais
- voluntários
- participantes finais
- equipes de design / branding
- equipe técnica da plataforma

---

## 8. Perfis de usuário e permissões

### 8.1 Super Admin Nacional
**Quem é:** direção nacional / administradores centrais  
**Pode:**
- criar e editar qualquer sede
- homologar sedes
- editar qualquer ACTO
- publicar novas versões de conteúdo
- ver auditoria global
- ver dashboards nacionais
- subir arquivos, vídeos, PDFs, imagens e checklists
- configurar templates
- definir fluxos de homologação
- bloquear conteúdos antigos
- ver analytics de consumo

### 8.2 Diretor Nacional
**Quem é:** Rafael / Erika e designados  
**Pode:**
- revisar sedes
- dar feedback
- aprovar ou reprovar homologação
- acompanhar edições
- ver checklist macro
- ver quem acessou conteúdo
- enviar avisos obrigatórios
- atualizar conteúdos oficiais

### 8.3 Avaliador / Homologador
**Pode:**
- preencher avaliação de sede
- anexar relatório
- registrar pendências
- recomendar homologação, reciclagem ou reprovação
- registrar custos de visita

### 8.4 Diretor Local
**Pode:**
- acessar conteúdos oficiais liberados para sua sede
- abrir edição local
- montar staff local
- designar responsáveis por ACTO
- acompanhar checklist de preparação
- baixar materiais
- confirmar leitura
- acompanhar cronograma de sua edição
- preencher status da execução

### 8.5 Coordenador Operacional Local
**Pode:**
- atualizar tarefas
- marcar materiais comprados
- anexar comprovantes, fotos e evidências
- acompanhar pendências

### 8.6 Guia / Staff / Preletor / Mídia
**Pode:**
- acessar apenas módulos liberados ao seu papel
- ver roteiro e checklist do seu ACTO
- baixar materiais específicos
- confirmar leitura / ciência
- ver horário, local e responsabilidades

### 8.7 Participante Público
**Pode:**
- ver landing page
- ver calendário
- acessar página de inscrição
- ver informações públicas do REM

---

## 9. Princípios do produto

1. **Uma única fonte da verdade**
2. **Tudo centralizado por ACTO**
3. **Conteúdo padronizado com versionamento**
4. **Execução local com governança nacional**
5. **Checklist prático na mesma tela da ministração**
6. **Auditoria nativa, não opcional**
7. **Interface simples para operação real**
8. **Offline-first em fases futuras**
9. **Excelência visual e funcional alinhada à marca REM**
10. **Rastreabilidade total de atualização e leitura**

---

## 10. Escopo funcional

### 10.1 Módulo A - Landing Page Pública
Objetivo: ser a porta de entrada do REM.

#### Funcionalidades
- home institucional
- explicação do que é o REM
- manifesto / proposta de valor
- calendário por sede
- mapa de atuação
- CTAs de inscrição
- páginas locais por edição / cidade / estado
- FAQ
- contato
- galeria
- integração com inscrições externas ou internas

#### Conteúdo esperado
- copy da campanha
- identidade visual oficial
- mensagens-chave
- calendário por mês
- sedes homologadas
- status de novas aberturas

---

### 10.2 Módulo B - Painel Administrativo Global
Objetivo: centro de comando da direção nacional.

#### Funcionalidades
- dashboard executivo
- farol de homologação por sede
- mapa de sedes
- pipeline de expansão
- visão de edições futuras, ativas e concluídas
- alertas críticos
- métricas de acesso e atualização
- relatórios comparativos por sede
- central de publicações e comunicados

#### Cards / KPIs
- número total de sedes
- sedes homologadas
- sedes em 1ª, 2ª, 3ª edição
- sedes em reciclagem
- edições futuras nos próximos 30, 60, 90 dias
- percentual médio de leitura do conteúdo oficial
- ACTOS com maior índice de pendência logística
- usuários que não acessaram conteúdo obrigatório
- atualização mais recente publicada

---

### 10.3 Módulo C - Gestão de Sedes
Objetivo: controlar todas as sedes REM.

#### Funcionalidades
- cadastro de sede
- dados institucionais
- diretor responsável
- equipe principal
- região / estado / cidade
- status operacional
- status de homologação
- histórico de edições
- documentos da sede
- checklist de abertura
- calendário local
- configurações de acesso

#### Status possíveis
- em implantação
- aguardando 1ª edição
- 1ª edição concluída
- 2ª edição concluída
- 3ª edição em avaliação
- homologada
- em reciclagem
- aguardando nova edição
- suspensa
- inativa

---

### 10.4 Módulo D - Homologação de Sedes
Objetivo: operacionalizar a regra nacional das 3 edições.

#### Regras de negócio
- nenhuma sede é homologada na primeira edição
- homologação só pode ocorrer após 3 edições concluídas
- a avaliação precisa ser presencial
- a direção nacional, ou equipe designada, avalia essas 3 primeiras edições
- se a avaliação final for positiva, a sede é homologada
- se não alcançar o padrão, a sede entra em reciclagem
- avaliações extras após a 3ª edição geram repasse de custo ao diretor local

#### Funcionalidades
- workflow de homologação
- agenda de visitas presenciais
- checklist de avaliação
- score por edição
- relatório por edição
- parecer final
- decisão de homologação
- decisão de reciclagem
- registro de penalidade financeira
- histórico completo por sede

#### Critérios de avaliação sugeridos
- fidelidade ao cronograma
- fidelidade aos ACTOS
- uso correto do conteúdo oficial
- preparação logística
- experiência dos casais
- aderência visual
- segurança operacional
- organização da equipe
- execução dos materiais físicos
- qualidade da ministração
- conformidade com atualizações da direção

---

### 10.5 Módulo E - CMS de Conteúdo Oficial
Objetivo: centralizar tudo o que é material oficial.

#### Tipos de conteúdo
- ACTOS
- cronogramas
- manuais
- pregações
- roteiros do host
- apresentações
- vídeos
- áudios
- PDFs
- imagens
- arquivos de impressão
- checklists
- templates
- identidade visual
- formulários
- documentos de homologação
- treinamento por função

#### Funcionalidades
- criar conteúdo
- editar conteúdo
- versionar conteúdo
- publicar conteúdo
- arquivar conteúdo
- definir público-alvo do conteúdo
- marcar leitura obrigatória
- associar conteúdo a ACTO
- associar conteúdo a papel
- associar conteúdo a edição
- registrar changelog

#### Campos mínimos por conteúdo
- título
- tipo
- descrição
- objetivo
- tags
- versão
- data de publicação
- autor
- responsável pela revisão
- validade
- arquivos anexos
- vídeos relacionados
- status de publicação
- leitura obrigatória: sim/não

---

### 10.6 Módulo F - Trilha de Execução por Edição
Objetivo: transformar o evento em fluxo operacional executável.

#### Estrutura
- edição
  - dia 1
    - ACTO 1 ao ACTO 18
  - dia 2
    - ACTO 19 ao ACTO 30

#### Cada ACTO terá uma tela padrão com:
1. resumo do ACTO  
2. objetivo / porquê  
3. inimigo a atacar  
4. termômetro emocional:
   - como os casais chegam
   - como devem sair  
5. o que precisamos  
6. cenário  
7. responsáveis  
8. guião do mestre de cerimônias  
9. passo a passo  
10. papel e responsabilidade da equipe  
11. arquivos e vídeos da atividade  
12. checklist logístico  
13. checklist de compras  
14. checklist de pré-execução  
15. checklist de execução ao vivo  
16. checklist de pós-execução  
17. observações da sede  
18. pendências  
19. evidências (foto, vídeo, comprovante)  
20. confirmação de leitura  
21. confirmação de treinamento  
22. status do ACTO

#### Status possíveis por ACTO
- não iniciado
- em preparação
- pronto
- em execução
- concluído
- concluído com ressalvas
- pendente
- em risco
- bloqueado

---

### 10.7 Módulo G - Checklists de Compras e Logística Integrados
Objetivo: eliminar falha logística por documento separado.

#### Regra
Todo ACTO que tiver materiais físicos ou necessidades de preparação deve exibir a lista na própria tela da atividade.

#### Casos explícitos
- ACTO 3 / 4: sacolas de areia, canetões, lenços
- ACTO 14: cestas de piquenique
- ACTO 26: aranhas e óleo de massagem
- ACTO 27: talões de cheque, bombons e chocolates
- ACTO 30: mesas, cadeiras, legos

#### Funcionalidades
- checklist com status por item
- responsável pelo item
- data limite
- quantidade
- fornecedor
- custo estimado
- custo real
- comprovante
- observações
- alerta de item pendente
- duplicar checklist da edição anterior
- exportar lista consolidada da edição

#### Visões
- visão por ACTO
- visão por categoria de compra
- visão consolidada da edição
- visão pendências críticas
- visão por responsável

---

### 10.8 Módulo H - Pregações Padronizadas
Objetivo: substituir PDFs soltos por leitura estruturada dentro da plataforma.

#### Formato da tela da pregação
- título
- versículo central
- ideia central
- objetivo espiritual
- estrutura:
  - introdução
  - desenvolvimento
  - pontos-chave
  - exemplos
  - dinâmica
  - aplicação
  - encerramento
- frases-chave
- materiais necessários
- duração prevista
- arquivo complementar
- vídeo oficial
- observações para o preletor

#### Casos mínimos
- Marta e Marto
- Banco do Amor
- Predica da Aldeia
- Sexualidade
- Comunicação
- Resolução de Conflitos
- Uma Só Carne
- Terapia de Confiança
- Matrilego

---

### 10.9 Módulo I - Auditoria e Logs
Objetivo: rastrear acesso, consumo e aderência.

#### Eventos que devem ser logados
- login
- logout
- visualização de módulo
- visualização de ACTO
- download de arquivo
- reprodução de vídeo
- confirmação de leitura
- confirmação de checklist
- alteração de conteúdo
- publicação de nova versão
- edição local
- upload de evidência
- alteração de status da sede
- decisão de homologação
- envio de feedback
- aceite de atualização obrigatória

#### Visões de auditoria
- por usuário
- por sede
- por edição
- por ACTO
- por conteúdo
- por data
- por status de leitura
- por versão

#### Casos de uso
- quem ainda não acessou a nova versão
- quem baixou versão antiga
- qual diretor não abriu o ACTO obrigatório
- quais materiais foram visualizados antes da edição
- evidência de cobrança baseada em acesso

---

### 10.10 Módulo J - Notificações e Compliance
Objetivo: garantir leitura e ação.

#### Tipos de notificação
- nova versão publicada
- conteúdo obrigatório pendente
- ACTO com material faltando
- homologação em avaliação
- prazo de checklist vencendo
- edição próxima
- tarefa atribuída
- feedback de reciclagem
- alerta de não conformidade

#### Canais
- dentro da plataforma
- e-mail
- WhatsApp em fase posterior
- push em app futuro

---

### 10.11 Módulo K - Gestão de Arquivos e Mídia
Objetivo: concentrar vídeos, artes e arquivos oficiais.

#### Funcionalidades
- upload de PDF
- upload de imagem
- upload de vídeo
- streaming ou embed
- controle de tamanho
- versionamento de arquivos
- associação por ACTO
- associação por sede
- associação por campanha
- pasta lógica por categoria
- busca global

#### Categorias
- apresentações
- telão
- vídeos de abertura
- vídeos de pregação
- papelaria
- arte gráfica
- identidade visual
- formulários
- contratos
- arquivos da homologação

---

### 10.12 Módulo L - Portal do Diretor Local
Objetivo: painel prático da sede.

#### Dashboard local
- próxima edição
- número de inscritos
- número de casais confirmados
- número de guias
- número de voluntários
- ACTOS prontos
- ACTOS pendentes
- materiais faltando
- conteúdos obrigatórios não lidos
- tarefas por responsável
- cronograma regressivo

#### Rotinas locais
- montar equipe
- designar responsáveis
- acompanhar compras
- validar leitura da equipe
- montar execução da edição
- anexar evidências
- acompanhar homologação
- responder feedback nacional

---

### 10.13 Módulo M - Offline / Operação de Campo (fases futuras)
Objetivo: apoiar execução durante o evento.

#### Possibilidades
- checklist offline
- ficha médica offline
- confirmação de presença offline
- leitura offline de ACTOS
- cache de vídeos e arquivos
- check-in com NFC futuramente
- tags por família
- relatórios locais sincronizados depois

---

## 11. Conteúdo mínimo por ACTO

Cada ACTO precisa existir como entidade estruturada no banco, não apenas como arquivo anexado.

### 11.1 Modelo de dados do ACTO
- id
- código do ACTO
- título
- dia
- ordem
- horário início
- horário término
- duração
- categoria
- objetivo
- porquê
- inimigo a atacar
- estado emocional inicial
- estado emocional final
- cenário
- materiais
- compras
- responsáveis
- roteiro host
- passo a passo
- papel da equipe
- riscos
- instruções de segurança
- vídeos
- anexos
- status
- versão

---

## 12. Mapeamento inicial dos ACTOS e materiais críticos

### ACTO 1 - Registro / Check-in
- listas de inscritos
- kits REM
- café da manhã
- contato com transporte
- termo de responsabilidade assinado
- mesas de check-in
- etiquetas de bagagem

### ACTO 2 - Nosso percurso para lembrar
- mapa do percurso
- adesivos
- ônibus / transporte
- casal host

### ACTO 3 - Início da caminhada
- equipamento de som
- bandeiras por equipe
- percurso planejado
- sacolas de areia
- canetões

### ACTO 4 - Marta e Marto
- 2 sacolas de areia
- canetões
- lenços para tapar os olhos

### ACTO 5 - Olhos vendados
- lenços do kit
- guias
- organização por casal

### ACTO 6 - O Controle
- ensino
- areia
- espaço de parada

### ACTO 7 - Livres de fardos
- som
- adoração
- cruz
- local aberto
- equipe para recolher areia

### ACTO 8 - Esposados
- abraçadeiras / enforca-gato
- instruções no ônibus

### ACTO 9 - Almoço
- alimentação
- mesas
- cadeiras
- serviço logístico

### ACTO 10 - Montagem do glamping
- bandeiras por equipe
- áreas demarcadas
- critérios de premiação

### ACTO 11 - Erros na comunicação
- apresentação
- caderno de trabalho
- sketch / teatro
- vídeo introdutório

### ACTO 12 - Mapa do Amor e ventilador
- ensino
- caderno de exercícios
- espaço externo
- facilitação dos grupos

### ACTO 13 - Sexualidade
- facilitador
- apresentação
- suporte audiovisual

### ACTO 14 - Piquenique ao pôr-do-sol
- cestas de piquenique
- ambiente romântico
- música
- local externo
- fotografia
- atenção a alergias

### ACTO 15 - Uma Só Carne
- tesouras
- óleo de unção
- ministração
- suporte de guias

### ACTO 16 - Oficina de masculinidade
- lista de canções
- animadores
- oficina curta

### ACTO 17 - Workshop para mulheres
- facilitação feminina
- espaço de testemunho
- oração

### ACTO 18 - Workshop de karaokê
- microfones
- telões
- computador
- playlist
- máscaras
- bonés
- óculos
- chapéus
- adereços

### ACTO 19 - Fantasias / fotografia
- set de fotografia
- fotógrafo
- alto-falante

### ACTO 20 - Exercício e aquecimento
- instrutor
- música
- local amplo

### ACTO 21 - Corrida
- mapas da corrida
- instruções
- equipe logística
- trilha segura

### ACTO 22 - Café da manhã
- café da manhã
- mesas
- logística

### ACTO 23 - Resolução de conflitos
- apresentação
- casal para teatro
- vídeo
- acompanhamento de psicólogos

### ACTO 24 - Testemunhos
- casal condutor
- microfone aberto
- espaço de ministração

### ACTO 25 - Almoço
- alimentação
- mesas
- guias

### ACTO 26 - Terapia de confiança
- médico / terapeuta
- aranha massageadora
- óleo
- guias

### ACTO 27 - Banco do Amor
- talão de cheques
- bombons
- chocolates
- apresentação e vídeo
- facilitador

### ACTO 28 - Predicação da Aldeia
- ensino
- vídeo
- guia de formação da aldeia

### ACTO 29 - Desmontar o acampamento
- local sinalizado
- organização por cores
- checklist final

### ACTO 30 - Matrilego
- mesas
- cadeiras
- peças de lego
- minifiguras
- painéis por pessoa
- facilitação
- mídia

---

## 13. Fluxos principais

### 13.1 Fluxo de atualização nacional
1. direção nacional publica nova versão  
2. sistema cria changelog  
3. usuários impactados são notificados  
4. conteúdo anterior vira "desatualizado"  
5. diretores locais precisam confirmar leitura  
6. auditoria registra acesso  
7. dashboard mostra quem leu e quem não leu  

### 13.2 Fluxo de preparação da edição local
1. diretor local cria edição  
2. sistema replica trilha padrão do REM  
3. diretor designa responsáveis por ACTO  
4. equipe acessa conteúdo por função  
5. checklist logístico começa a ser preenchido  
6. pendências críticas sobem no dashboard  
7. direção nacional pode acompanhar em tempo real  

### 13.3 Fluxo de homologação
1. sede é criada  
2. 1ª edição é executada e avaliada  
3. 2ª edição é executada e avaliada  
4. 3ª edição é executada e avaliada  
5. painel mostra histórico consolidado  
6. avaliador recomenda homologar ou reciclar  
7. direção nacional decide  
8. sistema registra decisão e condições  

### 13.4 Fluxo de reciclagem
1. sede reprovada após 3 edições  
2. feedback estruturado é registrado  
3. plano de ação é atribuído  
4. nova edição é planejada  
5. custos extras da avaliação são atribuídos à sede  
6. nova avaliação é agendada  
7. sistema acompanha correções  

---

## 14. Requisitos funcionais detalhados

### RF-001
O sistema deve permitir cadastro de sede com status operacional e status de homologação.

### RF-002
O sistema deve permitir criação de edição local baseada em template oficial.

### RF-003
O sistema deve permitir cadastro, edição e versionamento de ACTOS.

### RF-004
Cada ACTO deve possuir checklist de compras, logística, execução e pós-execução.

### RF-005
O sistema deve permitir anexar vídeos, PDFs, imagens e roteiros a cada ACTO.

### RF-006
O sistema deve registrar visualizações, downloads e confirmação de leitura.

### RF-007
O sistema deve informar quem acessou e quem ainda não acessou conteúdo obrigatório.

### RF-008
O sistema deve permitir publicação de novas versões com changelog.

### RF-009
O sistema deve impedir que conteúdos antigos permaneçam como "oficiais" sem marcação.

### RF-010
O sistema deve exibir dashboard executivo nacional.

### RF-011
O sistema deve exibir dashboard operacional local.

### RF-012
O sistema deve permitir workflow de homologação em 3 edições.

### RF-013
O sistema deve permitir registrar reciclagem e penalidade financeira.

### RF-014
O sistema deve permitir designar responsáveis por ACTO e por item de checklist.

### RF-015
O sistema deve permitir upload de evidências por ACTO.

### RF-016
O sistema deve permitir gerar visão consolidada de compras por edição.

### RF-017
O sistema deve permitir filtrar conteúdos por papel, sede, edição, ACTO e versão.

### RF-018
O sistema deve ter busca global por conteúdos e arquivos.

### RF-019
O sistema deve permitir visualização estruturada de pregações.

### RF-020
O sistema deve permitir exportar relatórios de leitura, execução, homologação e pendências.

---

## 15. Requisitos não funcionais

### RNF-001 - Segurança
- autenticação segura
- RBAC por papel
- trilha de auditoria
- proteção de arquivos sensíveis
- logs imutáveis para eventos críticos

### RNF-002 - Disponibilidade
- disponibilidade mínima alvo: 99,5% em produção
- CDN para arquivos estáticos
- backups automáticos

### RNF-003 - Performance
- dashboard inicial < 3s
- busca global < 2s em uso normal
- abertura de ACTO < 2s
- upload de arquivos com fila e feedback

### RNF-004 - Escalabilidade
- suporte a múltiplas sedes e edições simultâneas
- multi-tenant lógico por sede
- capacidade de expansão internacional no futuro

### RNF-005 - Usabilidade
- uso simples para diretores não técnicos
- estrutura clara por dia > ACTO > checklist
- mobile responsive
- leitura otimizada para operação em campo

### RNF-006 - Governança de conteúdo
- versionamento obrigatório
- histórico de edição
- estado de publicação
- rastreio de consumo

### RNF-007 - Offline futuro
- arquitetura preparada para cache local
- conteúdos críticos sincronizáveis

---

## 16. Modelo de dados inicial

### Entidades principais
- users
- roles
- permissions
- headquarters
- headquarters_members
- headquarters_homologation_cycles
- headquarters_reviews
- editions
- edition_days
- actos
- acto_versions
- acto_assignments
- acto_checklists
- checklist_items
- purchases
- content_items
- content_versions
- file_assets
- media_assets
- reading_receipts
- download_logs
- access_logs
- notifications
- comments
- evidences
- audit_events
- feedback_cycles
- penalties
- templates
- public_pages

---

## 17. Arquitetura recomendada

### Frontend
- Next.js
- TypeScript
- Tailwind
- UI premium responsiva
- suporte web app responsivo

### Backend
- Supabase ou stack equivalente com:
  - Postgres
  - Auth
  - Storage
  - Realtime
  - Row Level Security

### Storage
- arquivos em bucket com versionamento lógico
- thumbnails e previews para mídia

### Busca
- busca textual em conteúdos e arquivos
- indexação por metadados

### Analytics
- eventos de acesso
- consumo de conteúdo
- funil de preparação por edição

### Notificações
- e-mail transacional
- fila de notificações internas
- WhatsApp em fase posterior

---

## 18. Integrações recomendadas

### MVP
- armazenamento de arquivos
- envio de e-mail
- player de vídeo
- autenticação
- dashboard analytics básico

### Fase 2
- WhatsApp
- assinaturas eletrônicas
- formulários dinâmicos
- automação de tarefas

### Fase 3
- app mobile
- NFC / QR / tags
- cache offline completo
- operação de campo avançada

---

## 19. Métricas de sucesso

### Métricas nacionais
- % de sedes com 100% de leitura obrigatória
- % de ACTOS executados sem pendência logística
- tempo médio de homologação
- taxa de reprovação por sede
- taxa de atualização consumida em até 7 dias
- uso de versão correta por edição

### Métricas locais
- % de checklist concluído antes da edição
- % de equipe treinada por ACTO
- nº de itens esquecidos por edição
- nº de ACTOS em risco
- tempo de preparação por edição

### Métricas de produto
- DAU/WAU de diretores
- retenção por edição
- nº de downloads por conteúdo
- nº de visualizações por ACTO
- tempo médio na trilha operacional

---

## 20. Roadmap

### Fase 1 - Fundação
- autenticação
- RBAC
- cadastro de sedes
- CMS básico
- trilha por ACTO
- checklist por ACTO
- upload de arquivos
- auditoria básica
- dashboards iniciais

### Fase 2 - Governança
- homologação completa
- reciclagem
- penalidade financeira
- notificações
- leitura obrigatória
- changelog
- analytics ampliado

### Fase 3 - Operação avançada
- mobile responsivo refinado
- cache offline parcial
- central de mídia robusta
- workflows de equipe
- relatórios completos

### Fase 4 - Campo e escala
- app de operação
- NFC / check-in
- offline-first
- expansão internacional
- multilingue completo

---

## 21. Riscos

### Risco 1 - Resistência à adoção
Mitigação:
- UX simples
- onboarding guiado
- imports de conteúdo
- treinamento curto por perfil

### Risco 2 - Conteúdo oficial incompleto
Mitigação:
- operação de saneamento de conteúdo
- comitê editorial nacional
- aprovação antes de publicar

### Risco 3 - Dependência de arquivos antigos
Mitigação:
- versionamento
- marca d'água de obsolescência
- bloqueio de download antigo quando necessário

### Risco 4 - Falta de disciplina local
Mitigação:
- auditoria
- leitura obrigatória
- alertas
- dashboards de cobrança

### Risco 5 - Complexidade excessiva no MVP
Mitigação:
- foco nas dores principais
- priorização por valor operacional
- roll-out em fases

---

## 22. Critérios de aceite do MVP

O MVP será considerado aceito quando:
1. a direção nacional conseguir cadastrar e acompanhar sedes  
2. for possível criar uma edição local completa  
3. o cronograma estiver navegável por ACTO  
4. cada ACTO tiver conteúdo, checklist e responsáveis  
5. o sistema registrar acessos e downloads  
6. for possível identificar quem não acessou atualização obrigatória  
7. o fluxo de homologação estiver funcional  
8. o diretor local conseguir preparar uma edição sem depender do Drive como fonte principal  
9. o checklist de materiais estiver visível na mesma tela da atividade  
10. houver rastreabilidade básica de publicação e leitura  

---

## 23. Recomendações de UX

### Navegação principal
- Dashboard
- Sedes
- Edições
- Trilha por ACTO
- Conteúdos Oficiais
- Pregações
- Checklists
- Homologação
- Auditoria
- Mídia & Arquivos
- Configurações

### Padrão visual da tela do ACTO
- cabeçalho com dia, horário, duração e status
- colunas ou blocos modulares
- botões fixos: marcar como lido, baixar materiais, iniciar checklist, atribuir responsável
- timeline lateral
- cartões de risco e pendência
- player de vídeo integrado
- anexos em painel lateral
- histórico de atualizações

---

## 24. PRD resumido por valor entregue

### Para a direção nacional
- controle
- visibilidade
- governança
- homologação
- cobrança com dado

### Para o diretor local
- clareza
- centralização
- execução prática
- menos erro
- menos retrabalho

### Para a equipe local
- saber o que fazer
- saber o que falar
- saber o que preparar
- saber quando executar
- saber onde acessar

### Para a marca REM
- padrão
- escala
- excelência
- proteção da experiência
- expansão segura

---

## 25. Conclusão

A plataforma REM OS não é apenas um repositório de arquivos. Ela precisa ser desenhada como sistema de execução, padronização e expansão nacional.

O principal valor do produto é transformar uma operação baseada em arquivos dispersos em uma operação guiada por contexto, checklist, rastreabilidade e governança.

Em termos práticos: o diretor local não deve mais pensar em "onde está o arquivo". Ele deve pensar apenas em executar o ACTO corretamente, porque tudo estará centralizado, atualizado e auditável dentro da própria etapa.

Esse é o tipo de sistema que protege a experiência, preserva a visão da direção nacional e permite escalar o REM sem virar bagunça organizada em pasta errada de Drive, que é um clássico humano de sofrimento operacional.


---

## 26. Validação aplicada na versão 1.1

Esta versão incorpora refinamentos necessários para que o documento deixe de ser apenas um PRD estratégico forte e passe a servir como base prática para backlog, regras de negócio, arquitetura e preparação de implementação.

### 26.1 O que foi reforçado nesta versão
- fechamento do glossário de domínio
- definição do módulo de gestão de edições, casais, famílias e staff
- definição do modo de execução ao vivo do evento
- detalhamento da governança editorial e de versionamento
- fechamento da rubrica de homologação com pesos e critérios eliminatórios
- maior objetividade nos critérios de aceite do MVP
- ampliação do modelo de dados para cobrir a operação real

### 26.2 Leitura correta deste documento
Este PRD não substitui:
- especificação de UI detalhada
- especificação técnica de API
- modelo físico final de banco
- plano de testes
- política jurídica e contratual

Mas passa a ser suficiente para:
- decomposição em épicos
- descoberta com stakeholders
- desenho de arquitetura
- escrita de histórias de usuário
- definição do MVP, MMP e fases posteriores

---

## 27. Glossário oficial do domínio

### Sede
Unidade local do REM em uma cidade, estado ou região, com direção própria, ainda em implantação, em homologação, homologada ou inativa.

### Edição
Instância concreta de um evento REM executado por uma sede em uma data específica. Uma sede pode ter várias edições ao longo do tempo.

### Ciclo de homologação
Conjunto das três primeiras edições de uma nova sede, acompanhadas e avaliadas presencialmente pela direção nacional ou equipe designada, com objetivo de homologação.

### Reciclagem
Estado em que a sede entra após não atingir o padrão exigido ao final do ciclo de homologação. Exige plano corretivo, nova preparação e nova avaliação.

### ACTO
Unidade operacional e pedagógica da experiência REM, associada a um horário, objetivo, contexto, materiais, roteiro, responsáveis e checklists.

### Conteúdo oficial
Material aprovado nacionalmente para uso obrigatório ou preferencial nas sedes, incluindo roteiros, pregações, vídeos, apresentações, artes, formulários e checklists.

### Conteúdo local complementar
Material produzido pela sede local que não substitui conteúdo oficial global e que pode existir apenas onde o sistema permitir customização.

### Versão de conteúdo
Instância específica de um conteúdo oficial ou complementar, com identificador de versão, data de publicação, changelog e histórico de consumo.

### Leitura obrigatória
Conteúdo que exige ciência formal de determinados perfis antes da execução da edição.

### Casal participante
Entidade operacional composta por duas pessoas inscritas na edição e vinculada a dados cadastrais, contato, saúde, termo e status de presença.

### Família / equipe
Agrupamento operacional de casais e staff durante a edição, geralmente organizado por cor, número ou identificador interno.

### Staff de edição
Conjunto de pessoas com papel operacional na edição, como guias, logística, mídia, host, preletores, coordenação e apoio.

### Responsável por ACTO
Pessoa ou papel designado para garantir preparação, execução e encerramento de um ACTO específico.

### Evidência
Arquivo, foto, vídeo, checklist confirmado, observação ou comprovante usado para demonstrar preparação, conformidade ou execução.

### Não conformidade
Falha relevante de padrão, processo, conteúdo, logística, segurança ou execução identificada durante preparação, evento ou avaliação.

---

## 28. Módulo N - Gestão de Edições, Casais, Famílias e Staff
Objetivo: modelar a operação real da edição, e não apenas o conteúdo.

### 28.1 Entidades operacionais mínimas
- edição
- casal participante
- participante individual
- família / equipe
- staff da edição
- papel operacional por edição
- alocação por ACTO
- ônibus / transporte
- quarto / glamping / área
- check-in
- presença
- contato de emergência
- informação médica / alergias / restrições
- termo de responsabilidade
- observação pastoral / operacional quando permitido

### 28.2 Funcionalidades
- cadastro manual ou importação de casais
- vínculo de pessoas em casal
- montagem de famílias / equipes por cor ou número
- distribuição de casais por guia
- distribuição de staff por papel
- alocação de responsáveis por ACTO
- vinculação de participantes a ônibus, áreas, quartos ou glamping
- rastreio de presença e ausência
- visualização rápida de alergias, restrições e contatos de emergência
- geração de listas operacionais por edição

### 28.3 Regras
- toda edição deve possuir staff mínimo configurado antes de ser marcada como pronta
- todo casal deve ter status operacional antes do início do evento
- uma pessoa pode ter papel nacional e papel local, mas permissões devem respeitar contexto
- famílias/equipes podem variar por edição, mesmo dentro da mesma sede
- dados sensíveis de saúde devem obedecer política de acesso restrito, consentimento explícito e trilha reforçada de auditoria

### 28.3.1 Staff mínimo congelado para o MVP
Papéis obrigatórios e bloqueantes para uma edição ser marcada como **pronta**:
- 1 responsável geral da edição
- 1 diretor local ativo ou delegado formal
- 1 host / mestre de cerimônias ativo
- 1 responsável de logística ativo
- 1 responsável de mídia / audiovisual ativo
- 1 responsável de saúde / segurança ou primeiros socorros ativo
- mínimo de 1 guia ativo para cada 10 casais confirmados, com arredondamento para cima
- 30 ACTOS com responsável principal definido

### 28.3.2 Regras de bloqueio por staff mínimo
- ausência de qualquer papel bloqueante impede mudança da edição para **pronta**
- guia insuficiente em relação ao número de casais confirmados impede mudança da edição para **pronta**
- papéis bloqueantes podem ser acumulados pela mesma pessoa somente quando compatíveis e aprovados pela direção local

### 28.4 Status sugeridos do casal participante
- pré-inscrito
- confirmado
- cancelado
- no-show
- presente
- presença parcial
- concluinte

### 28.5 Status sugeridos do staff por edição
- convidado
- pendente de aceite
- ativo
- treinado
- sem leitura obrigatória concluída
- bloqueado para execução
- removido

---

## 29. Módulo O - Execução ao Vivo
Objetivo: transformar o cronograma em operação monitorável em tempo real.

### 29.1 Funcionalidades
- timeline do evento por dia e por ACTO
- cronômetro planejado vs real
- início manual e encerramento manual do ACTO
- registro de atraso
- registro de incidente
- bloqueio por dependência não concluída
- observações em tempo real
- mudança de status com trilha de auditoria
- visão de guerra da edição para diretor local e direção nacional
- painel de pendências críticas em tempo real

### 29.2 Status operacionais ao vivo
- aguardando início
- aguardando início
- iniciado no horário
- iniciado com atraso
- em execução
- pausado
- concluído no horário
- concluído com atraso
- concluído com ressalva
- bloqueado
- cancelado

### 29.3 Dependências mínimas
Um ACTO pode entrar em “aguardando início” apenas quando:
- responsável principal estiver definido
- checklist crítico estiver concluído
- materiais obrigatórios estiverem marcados como disponíveis
- conteúdo obrigatório do papel principal tiver sido lido
- pré-condições do ACTO anterior, se houver, estiverem cumpridas

### 29.4 Incidentes
O sistema deve permitir registrar incidentes por categoria:
- logística
- conteúdo
- segurança
- saúde
- atraso
- equipe
- mídia / audiovisual
- infraestrutura
- desvio de padrão

---

## 30. Governança editorial, conteúdo global e conteúdo local
Objetivo: impedir que o problema do Drive seja recriado dentro da plataforma.

### 30.1 Papéis editoriais
- autor
- editor
- revisor de conteúdo
- revisor doutrinário / metodológico
- aprovador final nacional
- publicador
- mantenedor local de conteúdo complementar

### 30.2 Estados de conteúdo
- rascunho
- em revisão
- aprovado para publicação
- publicado
- superseded / substituído
- arquivado
- bloqueado

### 30.3 Regras de governança
- conteúdo oficial global só pode ser publicado por fluxo editorial nacional
- sede local não pode sobrescrever conteúdo oficial global
- sede local pode anexar conteúdo complementar apenas nos módulos liberados
- conteúdo complementar local deve ser claramente identificado como não oficial
- toda nova versão oficial deve manter changelog obrigatório
- conteúdos superseded devem permanecer auditáveis, mas não devem aparecer como padrão operacional
- quando um conteúdo obrigatório é atualizado, o sistema deve invalidar a leitura da versão anterior para os perfis impactados

### 30.4 Tipos de customização permitidos localmente
Permitidos:
- dados da edição local
- contatos locais
- fornecedores locais
- mapas e logística local
- observações locais por ACTO
- artes locais aprovadas quando aplicável
- evidências e materiais complementares sem substituir o padrão oficial

Não permitidos:
- alterar objetivo oficial do ACTO
- alterar guião oficial sem permissão
- substituir pregação oficial em conteúdo mandatório sem aprovação nacional
- remover checklist crítico nacional
- trocar identidade visual oficial por variante local não aprovada

---

## 31. Rubrica oficial de homologação
Objetivo: reduzir subjetividade e padronizar decisão nacional.

### 31.1 Estrutura de pontuação
Cada edição avaliada recebe nota de 0 a 100, com base nas dimensões abaixo:

- fidelidade ao cronograma: 10 pontos
- fidelidade ao desenho dos ACTOS: 15 pontos
- uso correto do conteúdo oficial e da versão vigente: 10 pontos
- preparação logística e materiais críticos: 10 pontos
- qualidade da equipe e das atribuições: 10 pontos
- condução do host e da comunicação da experiência: 10 pontos
- qualidade da ministração e aplicação do conteúdo: 10 pontos
- segurança operacional, saúde e organização do fluxo: 10 pontos
- aderência visual e experiência da marca REM: 5 pontos
- fechamento pós-evento, evidências e organização final: 10 pontos

### 31.2 Critérios eliminatórios
Independentemente da nota total, impedem homologação:
- uso deliberado de material oficial desatualizado após publicação obrigatória
- ausência da avaliação presencial exigida
- falha grave de segurança sem tratamento adequado
- supressão de ACTOS obrigatórios sem aprovação nacional
- adulteração de evidências ou relatórios
- reincidência grave em não conformidades críticas já apontadas no ciclo
- descumprimento contratual ou reputacional grave definido pela direção

### 31.3 Regras de decisão
- homologada: média do ciclo >= 85, sem critério eliminatório, terceira edição concluída e parecer favorável
- homologável com ressalva: média do ciclo >= 80, sem eliminatório, com plano corretivo de curto prazo aprovado nacionalmente
- reciclagem obrigatória: média do ciclo < 80 ou ocorrência de critério eliminatório
- suspensão: ocorrência grave que exija bloqueio temporário de novas edições

### 31.4 Evidências mínimas exigidas por avaliação
- relatório do avaliador
- checklist de conformidade por ACTO
- evidências de materiais críticos
- evidências de leitura de conteúdo obrigatório
- registro de incidentes
- parecer consolidado da edição

### 31.5 Custos extras
Após a terceira edição:
- toda nova visita avaliativa poderá ser vinculada a penalidade financeira
- o sistema deve registrar centro de custo, valor estimado, valor real, responsável financeiro e status de cobrança

---

## 32. Regras adicionais de auditoria e compliance

### 32.1 Diferença entre abrir, ler, consumir e confirmar
- abriu: acessou a página ou arquivo
- consumiu: permaneceu tempo mínimo ou atingiu critério mínimo de uso
- confirmou leitura: fez aceite formal da versão
- treinado: concluiu fluxo exigido para aquele papel e edição

### 32.2 Regras sugeridas por tipo de conteúdo
- documento textual: confirmação manual + permanência mínima configurável
- vídeo: progresso mínimo de reprodução configurável
- checklist: status concluído com responsável e timestamp
- arquivo de impressão: download + confirmação de ciência
- treinamento crítico: conclusão de todos os itens obrigatórios

### 32.3 Relatórios obrigatórios
- usuários sem leitura obrigatória por edição
- usuários com leitura da versão antiga após publicação nova
- ACTOS críticos sem responsável treinado
- equipe local bloqueada por falta de compliance
- sede com uso recorrente de conteúdo desatualizado


### 32.4 Regras congeladas de compliance para o MVP
- conteúdo textual obrigatório: confirmação manual + permanência mínima de 45 segundos a cada 500 palavras ou scroll mínimo de 80%
- vídeo obrigatório: mínimo de 80% de reprodução
- arquivo de impressão obrigatório: download + confirmação manual de ciência
- checklist de treinamento: 100% dos itens obrigatórios do pacote do papel

Perfis que exigem leitura obrigatória vigente no MVP quando vinculados à edição:
- diretor local
- coordenador operacional local
- host / mestre de cerimônias
- responsável principal do ACTO
- guias ativos
- preletores ativos
- responsável de mídia / audiovisual quando o ACTO depender de apresentação, vídeo ou telão
- avaliador / homologador para o pacote de avaliação

Faltas de compliance que bloqueiam ACTO:
- responsável principal sem leitura vigente do pacote obrigatório do ACTO
- host sem leitura vigente do guião do ACTO quando atuar como papel principal
- preletor sem leitura vigente do conteúdo do ACTO quando atuar como papel principal
- responsável de mídia sem leitura vigente do pacote audiovisual do ACTO quando houver dependência crítica
- materiais críticos não confirmados como disponíveis

Faltas de compliance que geram apenas alerta:
- staff de apoio não crítico com leitura pendente
- usuário não escalado para o ACTO com leitura pendente
- conteúdo complementar local não lido
- consumo parcial sem papel bloqueante vinculado

---

## 32.5 Regras operacionais de dados sensíveis e LGPD no MVP
- coleta mínima: somente dados estritamente necessários para segurança, operação e contato de emergência
- base legal operacional do MVP: consentimento explícito para dados sensíveis de saúde e uso excepcional por proteção da vida / incolumidade física em contexto emergencial
- retenção padrão: 180 dias após o encerramento da edição
- retenção estendida: permitida quando houver incidente, disputa, exigência legal ou processo de homologação em aberto
- mascaramento padrão: dados sensíveis devem aparecer mascarados para perfis sem autorização plena
- exportação de dados sensíveis: somente para perfis autorizados e com justificativa registrada em log
- exclusão ou anonimização: permitida quando não houver obrigação legal, incidente aberto ou retenção excepcional aplicável
- acesso emergencial: permitido por mecanismo de break-glass com justificativa obrigatória e auditoria reforçada
- toda visualização, edição, exportação e exclusão de dado sensível deve gerar log auditável específico

## 33. Critérios de aceite revisados do MVP

O MVP será aceito somente se todos os itens abaixo forem demonstráveis em ambiente de homologação do sistema:

1. criar sede com diretor local, status operacional e ciclo de homologação ativo  
2. criar edição local com replicação integral da trilha padrão de 30 ACTOS  
3. atribuir responsáveis por ACTO e por item crítico de checklist  
4. cadastrar ou importar casais participantes e staff mínimo da edição  
5. visualizar por ACTO os campos: objetivo, inimigo a atacar, guião, passo a passo, materiais, responsáveis e anexos  
6. registrar checklist de compras e logística na mesma tela do ACTO  
7. publicar conteúdo oficial versionado com changelog  
8. identificar, por usuário e por sede, quem leu e quem não leu conteúdo obrigatório  
9. registrar download, visualização e confirmação de leitura da versão vigente  
10. impedir que conteúdo superseded apareça como padrão oficial  
11. registrar avaliação de homologação de pelo menos três edições de teste  
12. aplicar status final de homologada ou reciclagem com trilha de decisão  
13. exibir dashboard nacional com sedes, status, pendências e compliance mínimo  
14. exibir dashboard local com progresso da edição, ACTOS prontos, pendências e materiais faltantes  
15. permitir evidências por ACTO e gerar relatório exportável básico por edição  

---

## 34. Requisitos funcionais adicionais

### RF-021
O sistema deve permitir cadastro e gestão de casais participantes por edição.

### RF-022
O sistema deve permitir criação de famílias/equipes e alocação de casais e guias.

### RF-023
O sistema deve permitir gestão de staff da edição com status de treinamento e leitura obrigatória.

### RF-024
O sistema deve permitir iniciar, pausar e encerrar ACTOS em modo execução ao vivo.

### RF-025
O sistema deve permitir registrar incidentes operacionais por edição e por ACTO.

### RF-026
O sistema deve aplicar critérios eliminatórios na decisão de homologação.

### RF-027
O sistema deve suportar governança editorial com estados de conteúdo e papéis de aprovação.

### RF-028
O sistema deve distinguir conteúdo oficial global de conteúdo local complementar.

### RF-029
O sistema deve permitir invalidar a leitura da versão anterior quando uma nova versão obrigatória for publicada.

### RF-030
O sistema deve permitir bloquear o início de ACTO quando dependências críticas não estiverem concluídas.

### RF-031
O sistema deve permitir gerar listas operacionais por ônibus, equipe/família, staff e casais.

### RF-032
O sistema deve permitir registrar presença, no-show e presença parcial de casais por edição.

### RF-033
O sistema deve permitir registrar dados sensíveis de saúde com restrição de acesso por papel.

### RF-034
O sistema deve permitir registrar plano corretivo e acompanhar reciclagem da sede.

### RF-035
O sistema deve permitir cálculo de score por edição e score médio do ciclo de homologação.

---

## 35. Modelo de dados inicial ampliado

Além das entidades já previstas, o domínio deve considerar também:

- editions
- edition_staff
- edition_roles
- participants
- couples
- family_groups
- family_group_members
- transport_allocations
- lodging_allocations
- attendance_records
- health_flags
- emergency_contacts
- acto_runtime_logs
- acto_dependencies
- incident_reports
- homologation_scorecards
- homologation_dimensions
- content_workflows
- content_acknowledgements
- local_overrides
- training_requirements
- training_completions

---

## 36. Backlog inicial por épicos

### Épico 1 - Fundação de acesso e governança
- autenticação
- RBAC
- multi-sede
- usuários
- papéis
- trilha de auditoria base

### Épico 2 - CMS oficial e versionamento
- conteúdos oficiais
- assets
- estados editoriais
- changelog
- leitura obrigatória

### Épico 3 - Trilha operacional por ACTO
- template oficial
- tela padrão do ACTO
- anexos
- checklist por ACTO
- responsáveis

### Épico 4 - Gestão da edição
- cadastro de edição
- casais
- staff
- famílias/equipes
- listas operacionais

### Épico 5 - Execução ao vivo
- timeline
- status em tempo real
- runtime logs
- incidentes
- dependências

### Épico 6 - Homologação
- scorecard
- parecer
- ciclo de 3 edições
- reciclagem
- penalidade financeira

### Épico 7 - Dashboards e relatórios
- visão nacional
- visão local
- compliance
- pendências
- exportações

---

## 37. Ordem recomendada de implementação

### Sprint 0
- arquitetura
- auth
- papéis
- layout base
- design system inicial
- modelagem do domínio

### Sprint 1
- sedes
- usuários
- edição
- ACTOS
- template oficial da trilha

### Sprint 2
- CMS oficial
- versionamento
- anexos
- leitura obrigatória

### Sprint 3
- checklist por ACTO
- responsáveis
- compras
- visão consolidada da edição

### Sprint 4
- casais
- famílias/equipes
- staff
- listas operacionais

### Sprint 5
- homologação
- scorecard
- reciclagem
- penalidades

### Sprint 6
- execução ao vivo
- incidentes
- bloqueios por dependência
- dashboards avançados

---

## 38. Decisões consolidadas de freeze funcional v1.2
1. **Nome canônico do domínio:** o conceito oficial para banco, APIs e telas é **edição / editions**. O termo event/events deixa de ser canônico no produto.
2. **Máquina de estados da sede corrigida:** passa a existir o estado **aguardando nova edição** para sedes em reciclagem ou reativadas entre ciclos.
3. **Status inicial da sede:** é definido pelo sistema, não pelo usuário. A criação inicia em **em implantação** e a promoção para **aguardando 1ª edição** ocorre por regra.
4. **Início do ACTO:** o estado **aguardando início** é intermediário obrigatório; o botão iniciar só opera a partir desse estado.
5. **E-mail do casal no MVP:** passa a ser opcional e recomendado. O contato obrigatório é telefone principal.
6. **Staff mínimo:** congelado no documento como requisito bloqueante para a edição ficar pronta.
7. **Dados sensíveis/LGPD:** passam a ter regra operacional mínima explícita para build do MVP, sem substituir revisão jurídica final.
8. **Compliance do MVP:** tempos, percentuais, perfis obrigatórios e bloqueios foram congelados para evitar interpretação aberta em engenharia.

## 39. Próximo entregável recomendado
Depois deste PRD 1.2, o próximo documento a ser produzido deve ser:

**Especificação Funcional MVP + Backlog em Épicos, Features, Histórias e Critérios de Aceite**

Esse documento deve quebrar o PRD em trabalho executável para time técnico, design e automação.
