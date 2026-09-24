# Roadmap do VozAtiva

Este documento separa claramente três estados: o que **já está implementado e funcionando** hoje, o que está **planejado** (decidido/discutido, mas nenhuma linha de código escrita ainda), e ideias/possibilidades levantadas que **ainda não viraram decisão**. Nada aqui descrito como planejado ou possível existe no código — ver [`docs/ARQUITETURA.md`](ARQUITETURA.md) para o que roda de verdade hoje.

Convenção usada em todo o documento:

- ✅ **Implementado** — existe no código, testado, em uso.
- 📋 **Planejado** — decidido como próximo passo, ainda não iniciado.
- 💡 **Possibilidade** — levantado em discussão/análise, sem decisão de fazer ainda.

## Próximas funcionalidades planejadas

| Funcionalidade | Status | Nota |
|---|---|---|
| Família de fonemas G (GA-GU) na voz feminina | 📋 Planejado | Já gravada e completa na voz masculina (65/65); falta gravar essa família na voz da Anna Clara — único fonema/voz pendente hoje. |
| Reconhecimento de fala com avaliação fonética real (não só heurística de volume) | 💡 Possibilidade | Hoje a verificação usa a Web Speech API do navegador com um heurístico de volume/duração como reserva — uma avaliação fonética mais precisa exigiria um serviço especializado, fora do escopo local atual. |
| Notificações reais agendadas (lembrete de treino diário) | 💡 Possibilidade | Levantado como parte da adaptação para celular/PWA — exige Service Worker, não implementado. |
| Modo de alto contraste dedicado / tamanho de fonte ajustável pelo app | 💡 Possibilidade | Hoje o app já é responsivo e tem tema claro/escuro; um modo de contraste dedicado e escala de fonte configurável foram citados como melhoria futura, não iniciados. |

## Evolução da arquitetura (backend)

**Hoje (✅ implementado):** aplicação 100% client-side — `index.html` + `script.js` + `style.css`, sem servidor de aplicação, sem build step. Todos os dados ficam no navegador do próprio dispositivo (`localStorage` + `IndexedDB`, ver [`docs/ARQUITETURA.md`](ARQUITETURA.md)). Essa é uma decisão deliberada para o estágio atual (demonstração acadêmica local), não uma limitação técnica.

**📋 Planejado, em ordem de prioridade, para uma versão com backend real:**

1. **Backend com API real** — pré-requisito de tudo o resto; sem servidor próprio não existe multi-dispositivo, sincronização entre aparelhos, nem cobrança.
2. **Banco de dados gerenciado (ex.: Postgres)** — substitui `localStorage`/`IndexedDB`; dados deixam de se perder ao limpar o navegador, permite múltiplos usuários de verdade e relatórios agregados para o fonoaudiólogo.
3. **Autenticação real no servidor** — hoje o hash de senha (SHA-256 + sal) evita texto puro, mas só protege localmente; autenticação server-side (sessão/JWT) é pré-requisito de segurança antes de qualquer cobrança.
4. **Camada de pagamentos** — só depois dos três anteriores, já que cobrar de alguém exige dados centralizados e seguros primeiro.

Nenhuma dessas quatro etapas foi iniciada — são passos definidos, não trabalho em andamento.

## Segurança, autenticação e banco de dados

| Item | Status |
|---|---|
| Senha nunca em texto puro (SHA-256 + sal único por conta) | ✅ Implementado |
| Conta administradora de demonstração isolada (`isCurrentUserAdmin`, sem exposição a contas comuns) | ✅ Implementado |
| Dados apenas no dispositivo do usuário, nunca transmitidos pela rede | ✅ Implementado (por não existir backend ainda) |
| Autenticação server-side (sessão/JWT) | 📋 Planejado — ver evolução de arquitetura acima |
| Banco de dados real com controle de acesso por usuário | 📋 Planejado |
| Conformidade formal com a LGPD (dado de saúde é dado sensível) | 💡 Possibilidade — necessário antes de qualquer uso com dados reais de pacientes fora de demonstração; hoje não há coleta de dados que saia do próprio aparelho. |
| Criptografia de dados em repouso no servidor | 💡 Possibilidade — depende do backend existir primeiro. |

## Possíveis integrações

Nenhuma integração externa existe hoje — o app não faz nenhuma chamada de rede a serviços de terceiros (só carrega 2 fontes do Google Fonts). Integrações abaixo são **possibilidades**, não compromissos:

- 💡 Gateway de pagamento (Mercado Pago, Pagar.me ou Stripe) — necessário se o modelo B2B2C avançar (ver seção de monetização).
- 💡 Serviço de reconhecimento de fala especializado em terapia da fala — alternativa mais precisa que a Web Speech API nativa do navegador.
- 💡 Prontuário eletrônico / sistemas de gestão de clínica já usados por fonoaudiólogos — reduziria fricção de adoção B2B.
- 💡 E-mail/SMS transacional (confirmação de conta, lembrete) — depende de existir backend.

## Evolução para um produto completo

Resumo do caminho — detalhado com custos, preços e prioridades em [`docs/MODELO-DE-NEGOCIO.md`](MODELO-DE-NEGOCIO.md):

1. ✅ **Hoje**: protótipo funcional completo, validado por 3 especialistas (Gerontecnologia + 2 fonoaudiólogas), sem backend, uso local/demonstração.
2. 📋 **Próximo passo real**: validar em uso contínuo com fonoaudiólogos de verdade (não só opinião pontual) antes de qualquer investimento em backend.
3. 💡 **Se validado**: backend → banco de dados → autenticação real → pagamentos (ordem da seção de arquitetura acima).
4. 💡 **Se comercializado**: modelo B2B2C, começando por uma clínica-escola ou parceria institucional como primeiro cliente.

## Possibilidades de monetização e expansão

Análise completa (modelo recomendado, preços, custos, concorrentes) em [`docs/MODELO-DE-NEGOCIO.md`](MODELO-DE-NEGOCIO.md) — resumo:

- 💡 **Modelo recomendado, se comercializado**: B2B2C — a clínica/fonoaudiólogo paga por paciente ativo vinculado, o paciente usa de graça. Nenhuma decisão de comercializar foi tomada ainda; é a opção mais coerente com a arquitetura atual entre as levantadas.
- 💡 Outras 5 opções foram comparadas (freemium B2C por assinatura, compra única, convênio de saúde, licenciamento institucional, freemium com anúncios) — todas descartadas ou de prioridade menor pelos motivos detalhados no documento de modelo de negócio.
- 💡 Expansão geográfica/de público — não discutida além do escopo atual (português do Brasil, fonemas do PT-BR).

## Melhorias futuras de UX, acessibilidade e desempenho

**✅ Já implementado hoje:** navegação 100% por teclado, `aria-live`/`aria-label` em pontos-chave, alvos de toque de 44×44px, modo de movimento reduzido, tema claro/escuro completo, responsivo até ~340px de largura, tutorial guiado (spotlight) em cada tela principal.

**📋/💡 Levantado como melhoria futura, não iniciado:**

- 💡 Modo de alto contraste dedicado (além do tema escuro já existente).
- 💡 Tamanho de fonte ajustável pelo próprio app (hoje segue só a configuração do navegador/SO).
- 💡 PWA (Progressive Web App) com Service Worker — permitiria uso offline e notificações reais; plano existe em nível de ideia, nenhuma linha de código escrita.
- 💡 Avaliação de desempenho em aparelhos mais antigos/entrada — não medido formalmente ainda, só testado nos dispositivos usados durante o desenvolvimento.

## Roadmap — próximas etapas e prioridades

Ordem sugerida, da mais pra menos imediata:

1. **Agora**: gravar a família G da voz feminina (único conteúdo pendente).
2. **Curto prazo**: validar o app em uso real e contínuo com fonoaudiólogos, fora do ambiente de demonstração acadêmica.
3. **Médio prazo, se validado**: iniciar a evolução de arquitetura (backend → banco de dados → autenticação real), nessa ordem — não pular etapas.
4. **Médio/longo prazo, se avançar**: camada de pagamentos e modelo B2B2C, começando por uma clínica-escola ou parceria institucional.
5. **Contínuo, em paralelo**: melhorias de acessibilidade (alto contraste, fonte ajustável) e PWA/offline — não bloqueiam os passos acima, podem avançar independentemente.

Nada nesta lista tem data comprometida — é uma ordem de prioridade lógica, não um cronograma.
