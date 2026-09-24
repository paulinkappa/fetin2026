# Arquitetura do VozAtiva

Este documento explica **como o código está organizado por dentro** — as telas, o modelo de dados, e onde mexer para cada tipo de mudança. Para uma visão geral do projeto (o que é, como rodar), veja o [README](../README.md) na raiz.

## Visão geral

O app é um **SPA de arquivo único**, sem build e sem framework:

| Arquivo | Papel |
|---|---|
| `index.html` | Todas as telas e painéis do app, como blocos escondidos/mostrados via classe `.hidden` — não há roteamento de URL nem múltiplas páginas. |
| `script.js` | Toda a lógica: estado, renderização, regras de negócio, persistência. Um único arquivo, ~5700 linhas, dividido em seções por comentários `══════`. |
| `style.css` | Todo o visual, incluindo tema claro/escuro (custom properties) e responsivo (media queries). |

Não existe transpilação, bundler ou dependência de terceiros no runtime — só as duas Google Fonts carregadas por `<link>` em `index.html`. Isso é uma decisão deliberada (ver README), não uma limitação técnica.

## Telas (`SCREENS_BY_NAME`, script.js)

Cada tela é uma `<div class="screen" id="screen-...">` em `index.html`, trocada via `showOnlyScreen(nome)`:

- **`auth`** — login / criar conta.
- **`account-picker`** — escolher entre contas já usadas neste dispositivo.
- **`home`** — tela inicial (paciente ou médico, mesmo id, conteúdo condicional por `user.role`).
- **`path`** — trilha de fases (o "mapa" de progresso).
- **`app`** — a tela de treino em si (um fonema por vez).
- **`doctor`** — painel do médico (lista de pacientes → detalhe do paciente).

Além das telas, há **painéis** (`.panel-overlay`) e **modais** — perfil, contas, ajuda, créditos, amigos, ranking, chat, editor de exercícios, etc. Todos abrem/fecham por `openPanel(id)` / `closePanel(id)`, empilhados em `overlayStack` (foco preso, Esc fecha o do topo, foco volta pra quem abriu ao fechar — ver seção "PANELS" no script.js).

## Modelo de dados

Não há backend — tudo fica no navegador, em duas camadas:

- **`localStorage`** (`vozativa_users`, `vozativa_chats`) — contas, progresso, mensagens de texto. Sempre lido/gravado via `getUsers()`/`saveUsers()`/`saveUserRecords()` (nunca acesso direto ao localStorage fora dessas funções), que tratam erro de cota esgotada.
- **`IndexedDB`** (`vozativa_media`) — qualquer mídia grande: áudio de tentativa gravado pelo paciente, anexos de chat, vídeo de exercício físico. Ver seção "ARMAZENAMENTO DE MÍDIA" no script.js.

Cada conta (`users[email]`) guarda, entre outros campos: `role` (`"paciente"` ou `"medico"`), `progress` (fases concluídas, tentativas, streak, revisões pendentes), `customContent` (exercícios/dicas/áudio personalizados por um médico vinculado), `friends`/`linkedDoctors`, etc.

## Fonemas e treino

- **`BASE_GRUPOS`** (script.js) — os 65 fonemas reais do app, em 7 grupos (Vogais + 6 pares de letras). É a fonte da verdade: qualquer novo fonema/grupo começa aqui.
- **`BASE_DICAS`** — uma instrução de pronúncia por fonema, mostrada durante o treino.
- **`fonemas-audio/feminina/` e `fonemas-audio/masculina/`** — gravações reais, uma por fonema por voz (ver [README da pasta](../fonemas-audio/LEIA-ME.txt)). `playPhonemeAudio()` escolhe a pasta pelo `voiceGender` selecionado (♀/♂) e nunca mistura as duas; se o arquivo não existir, cai pra síntese de voz do navegador.
- **Loop de exercício** (`loadChallenge` → `toggleRecording`/reconhecimento de fala → `finishRecording` → `advance`) — um fonema por vez, com uma trava (`advancePending`) entre confirmar a resposta e carregar o próximo, pra clique duplo não pular um fonema em silêncio.
- **Fase concluída** (`finishPhase`) — só conta como concluída de verdade (desbloqueia a próxima, entra no ranking) a partir de 65% de aproveitamento (`PHASE_COMPLETION_THRESHOLD`).

## Papéis: paciente vs. médico

Mesmo código, conteúdo condicional por `user.role`:

- **Paciente**: treina fonemas, tem amigos/ranking, pode estar vinculado a um médico (`linkedDoctors`).
- **Médico** (`isCurrentUserDoctor()`): painel próprio (`screen-doctor`) — lista de pacientes vinculados, progresso de cada um, fila de aprovação das gravações (`registerPhaseReview`/`setReviewStatus`), editor de exercícios/fases personalizadas por paciente.

Há também uma conta fixa de demonstração, `admin@admin` (`ensureAdminAccount`/`isCurrentUserAdmin`), com bypass do tutorial e de limites de pulo — usada só para apresentar o app sem as travas normais, nunca alcançável por cadastro comum.

## Tutorial guiado (spotlight)

`TOUR_STEPS` define, por tela, uma lista de `{ el: "<seletor css>", text: "..." }`. `startTour(tela)` mostra um "buraco" (`positionSpotlightOn`) recortado sobre o elemento real, medido via `getBoundingClientRect()` — por isso ele se reposiciona em qualquer `resize` **e** `scroll` da página (necessário porque a trilha faz um auto-scroll suave até a fase atual ao abrir).

## Onde mexer, por tipo de mudança

| Quero... | Mexo em... |
|---|---|
| Adicionar/editar um fonema ou grupo | `BASE_GRUPOS` + `BASE_DICAS` (script.js) + gravar o `.mp3` correspondente em `fonemas-audio/<gênero>/` |
| Mudar o texto de uma tela | `index.html` (busque o `id`/texto) |
| Mudar uma regra de negócio (limiar de conclusão, limite de pulos, etc.) | as constantes no topo das seções relevantes do script.js (`PHASE_COMPLETION_THRESHOLD`, `SKIP_LIMIT_PER_PHASE`...) |
| Mudar cor/tema/responsivo | `style.css` — tudo por custom properties (`--brand-*`, `--ink`, `--card`...), redefinidas em bloco único para `body.dark-mode` |
| Adicionar um passo no tutorial guiado | `TOUR_STEPS` (script.js) |
| Entender uma decisão específica já tomada | `docs/CONTEXTO_PROJETO_v5.txt` — changelog detalhado, por rodada de trabalho |

## O que este projeto **não** tem (por escolha, não por esquecimento)

- **Sem backend/servidor de aplicação** — tudo roda no navegador; dados ficam por dispositivo.
- **Sem build step, bundler ou framework** — ver README para o porquê.
- **Sem suíte de testes automatizados** — a validação é feita manualmente, ao vivo no navegador, registrada rodada a rodada em `docs/CONTEXTO_PROJETO_v5.txt`.
