<img src="identidade-visual/logo.svg" alt="Logo do VozAtiva" width="72" height="72" />

# VozAtiva

Aplicativo web de treino de fala para pessoas em acompanhamento fonoaudiológico, com trilha de progressão por fases (inspirada no Duolingo) e elementos sociais (amigos, ranking). O paciente vê um fonema, ouve a pronúncia correta, grava a própria voz e recebe feedback automático e contínuo. O fonoaudiólogo acompanha o progresso de seus pacientes vinculados, audita as gravações e personaliza exercícios.

> O VozAtiva é um complemento ao acompanhamento fonoaudiológico já realizado com um profissional — não um substituto dele.

**Projeto número 160.** Idealizador: Luan Campos · Orientador: Renan Sthel · Desenvolvedor: Paulo Ricardo Mendes Cândido · Desenvolvimento auxiliado por Claude (Anthropic).

## Índice

- [O que o app faz](#o-que-o-app-faz)
- [Tecnologias](#tecnologias)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Como executar localmente](#como-executar-localmente)
- [Como testar](#como-testar)
- [Manutenção e desenvolvimento](#manutenção-e-desenvolvimento)

## O que o app faz

**Paciente**
- Treina os 65 fonemas do português (vogais + 6 pares de letras) em uma trilha de fases progressiva, com reconhecimento de fala real (Web Speech API) e feedback imediato.
- Ouve a pronúncia correta de cada fonema em voz feminina ou masculina (gravações reais, não só síntese de voz).
- Acompanha sequência diária (streak), ranking entre amigos, e um nível de "Revisão" para fonemas que o fonoaudiólogo pediu pra repetir.
- Tem uma central de exercícios práticos (vídeos) e um chat com contas vinculadas (fonoaudiólogo, amigos).

**Fonoaudiólogo**
- Vincula pacientes por um ID de 4 dígitos e acompanha o progresso de cada um, fase por fase.
- Ouve o áudio de cada tentativa gravada e aprova ou rejeita — rejeitar manda aqueles fonemas de volta pro paciente treinar num nível de revisão separado.
- Cria fases e exercícios personalizados por paciente (fonemas extras, dicas próprias, áudio próprio).

Tour guiado (spotlight) e central de ajuda embutidos, acessibilidade (navegação por teclado, `aria-live`, alvos de toque de 44px, modo de movimento reduzido) e tema claro/escuro em todas as telas.

## Tecnologias

- **HTML5 + CSS3 + JavaScript (ES6+), sem framework e sem build step.** Decisão deliberada: um projeto acadêmico de demonstração ganha mais em ser 100% legível e rodável com um clique do que em usar um framework — sem `npm install`, sem bundler, sem tempo de build. Três arquivos (`index.html`, `script.js`, `style.css`), abra e funciona.
- **Web Speech API** (`SpeechRecognition`) — reconhecimento de fala real, com um heurístico de volume/duração como reserva quando o navegador não suporta ou não responde a tempo.
- **`localStorage`** — contas, progresso, mensagens de texto (ver [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) para o modelo de dados completo).
- **`IndexedDB`** — mídia grande (áudio de tentativas, anexos de chat, vídeos de exercício).
- **Web Audio API** (`AudioContext`/`AnalyserNode`) — captura e visualização (waveform) do microfone em tempo real.

Nenhuma dependência de terceiros é baixada em tempo de execução, exceto duas Google Fonts carregadas por `<link>`.

## Estrutura do repositório

```
.
├── index.html                  # todas as telas/painéis do app (um único HTML)
├── script.js                   # toda a lógica (estado, regras, persistência)
├── style.css                   # todo o visual (tema claro/escuro, responsivo)
├── fonemas-audio/
│   ├── feminina/                # 65 gravações reais (voz feminina — Anna Clara)
│   ├── masculina/                # 65 gravações reais (voz masculina — Paulo Ricardo)
│   └── LEIA-ME.txt              # como funciona a escolha/fallback de áudio
├── avatares/                    # ícones de perfil predefinidos (SVG)
├── identidade-visual/           # logo e QR code do repositório (SVG + PNG)
├── docs/
│   ├── ARQUITETURA.md           # como o código está organizado por dentro
│   └── CONTEXTO_PROJETO_v5.txt  # changelog detalhado, rodada a rodada
├── .claude/
│   ├── launch.json              # configuração do servidor local de dev
│   └── static-server.ps1        # servidor HTTP estático (PowerShell, sem dependências)
├── Iniciar VozAtiva.bat         # atalho Windows: sobe o servidor e abre o navegador
└── .gitignore
```

Veja [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) para uma explicação de **onde mexer** para cada tipo de mudança (adicionar um fonema, mudar uma regra de negócio, mudar o tema, etc.).

## Como executar localmente

O app é só HTML/CSS/JS estático — mas **precisa ser servido por HTTP**, nunca aberto direto como arquivo (`file://`). Abrir como arquivo quebra permissões do navegador (microfone é pedido de novo a cada exercício) e o carregamento dos áudios de fonema.

**Windows — mais simples:** dê duplo clique em [`Iniciar VozAtiva.bat`](Iniciar%20VozAtiva.bat). Ele sobe um servidor local na porta 5500 e abre `http://localhost:5500` no navegador padrão.

**Manual (qualquer sistema com PowerShell, ou qualquer outro servidor estático):**
```powershell
powershell -ExecutionPolicy Bypass -File .claude/static-server.ps1 -Port 5500
```
depois abra `http://localhost:5500` no navegador. Qualquer outro servidor estático (`npx serve`, `python -m http.server`, extensão Live Server, etc.) também funciona — o único requisito é servir a raiz do repositório por HTTP.

## Como testar

Não há suíte de testes automatizados — é um projeto de demonstração acadêmica sem backend, então a validação é feita manualmente, ao vivo no navegador, a cada rodada de mudança (registrado em [`docs/CONTEXTO_PROJETO_v5.txt`](docs/CONTEXTO_PROJETO_v5.txt)). Pra conferir que uma mudança não quebrou nada:

1. Suba o servidor local (seção acima).
2. Abra o console do navegador (F12) e confira que não há erros ao carregar.
3. Teste o fluxo principal: criar conta → trilha → treinar um fonema (com e sem microfone) → concluir uma fase.
4. Se mexeu em algo do fonoaudiólogo: crie uma segunda conta como médico, vincule as duas pelo ID de 4 dígitos, e confira o painel dele.
5. Teste tema claro/escuro e uma largura de tela estreita (celular) na mudança que você fez.

## Manutenção e desenvolvimento

- **Sem build step** — edite `index.html`/`script.js`/`style.css` diretamente e recarregue o navegador.
- **Cache-busting manual**: `index.html` referencia `script.js?v=N` e `style.css?v=N`. Depois de editar um desses dois arquivos, incremente o `v=` correspondente em `index.html`, senão o navegador pode continuar servindo a versão em cache.
- **`docs/CONTEXTO_PROJETO_v5.txt`** é o histórico completo de decisões, uma entrada por rodada de trabalho — consulte antes de mudar algo que pareça estranho à primeira vista; provavelmente já foi discutido e tem um motivo registrado ali.
- **`docs/ARQUITETURA.md`** explica o modelo de dados, as telas e onde mexer para cada tipo de mudança comum.
- Decisões de escopo conscientes (não são pendências esquecidas): sem backend real (tudo fica por dispositivo), sem migração de senha ao trocar o esquema de hash, sem teste clínico formal — o app é um complemento de apoio, não substitui o acompanhamento profissional.

## Acesso rápido

<img src="identidade-visual/qrcode-github.svg" alt="QR code para este repositório no GitHub" width="160" />

Aponte a câmera do celular pra abrir este repositório.
