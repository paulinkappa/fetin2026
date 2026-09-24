# Modelo de negócio — análise e possibilidades

**Nenhuma decisão de comercializar o VozAtiva foi tomada.** Este documento é uma análise de possibilidades para se o projeto evoluir de protótipo acadêmico para produto real — não uma declaração de planos em execução. Números de mercado citados como **fato** vêm de preço público de concorrentes; o restante é **estimativa** calibrada para esse contexto, não pesquisa de mercado validada.

## Modelos comparados

| Modelo | Como funciona | Quem já faz assim | Encaixe com o VozAtiva |
|---|---|---|---|
| Freemium B2C por assinatura | Uso básico grátis, trilha completa por mensalidade | Speech Blubs (US$14,49/mês), ELSA Speak (US$3–6/mês), Duolingo Super | Alto |
| **B2B2C** | Clínica/fonoaudiólogo paga por paciente ativo, paciente usa de graça | Constant Therapy Enterprise, Tactus Therapy VRC | **Muito alto** |
| Compra única / vitalício | Um pagamento, acesso permanente | Tactus Therapy (US$5–74,99), planos vitalícios do Speech Blubs | Médio |
| Convênio de saúde / reembolso | Uso coberto por plano de saúde | Great Speech, Better Speech, Expressable | Baixo no curto prazo (exige credenciamento com operadoras) |
| Licenciamento institucional | Venda em bloco para clínicas, hospitais, secretarias, universidades | Camada Enterprise do Constant Therapy | Alto no médio prazo (parceria com instituição de ensino/clínica-escola) |
| Freemium com anúncios | Uso grátis sustentado por publicidade | Duolingo (parcialmente) | Baixo — anúncio num app usado por pacientes em tratamento é sensível |

## Modelo recomendado: B2B2C

A clínica/fonoaudiólogo paga por paciente ativo vinculado; o paciente usa de graça. É o encaixe mais alto porque o próprio modelo de dados do app **já** trata o médico como quem gerencia uma carteira de pacientes — cobrar por paciente ativo seria extensão do que já existe, não uma funcionalidade nova. Também evita cobrar diretamente de um público que já paga pela sessão de fonoaudiologia em si e que inclui crianças e idosos.

## Quem pagaria / o que seria grátis

- **Paga**: a clínica ou o fonoaudiólogo autônomo, por paciente ativo vinculado (ex.: fez ao menos 1 exercício nos últimos 30 dias).
- **Sempre grátis**: o paciente — nunca veria cobrança, mantendo a missão de acessibilidade do projeto.
- **Redução de fricção sugerida**: plano grátis para o fonoaudiólogo até um número pequeno de pacientes (ex.: 3), permitindo testar antes de pagar — importante sem equipe de vendas.

## Preço sugerido (estimativa)

**Faixa sugerida: R$ 15–25 por paciente ativo/mês**, cobrado do fonoaudiólogo/clínica, com penetração baixa de propósito — sem validação clínica formal ainda, um preço alto seria difícil de justificar.

Não existe comparável brasileiro em B2B2C de fonoaudiologia com preço público conhecido — essa faixa é estimativa própria, não um dado de mercado validado.

## Principais custos estimados

| Item | Estimativa |
|---|---|
| Hospedagem do backend | Baixo para começar (ex.: Railway/Render/DigitalOcean) — escala com uso real |
| Banco de dados gerenciado | Planos gratuitos cobrem volume inicial (ex.: Supabase/Neon) |
| Armazenamento de mídia (áudio/vídeo) | Hoje é local (IndexedDB) — migrar para nuvem introduz custo por GB/mês |
| Gateway de pagamento | Sem custo fixo alto — cobram por transação (tipicamente 3–5% + taxa fixa) |
| LGPD / privacidade | Dado de saúde é dado sensível — mais tempo de implementação que custo direto no início |
| Tempo de manutenção | Recurso mais escasso numa equipe pequena, não é custo monetário direto |

## Próximas etapas comerciais (se avançar)

1. Validar com fonoaudiólogos reais em uso contínuo (não só a opinião pontual já coletada de 3 especialistas) antes de cobrar de qualquer um.
2. Testar disposição a pagar (pesquisa/entrevista) antes de construir o backend inteiro.
3. Buscar uma clínica-escola ou parceria com a própria instituição de ensino como primeiro "cliente".
4. Formalizar (CNPJ, termos de uso, política de privacidade) antes de cobrar de qualquer pessoa de verdade.

## O que não precisa ser desenvolvido agora

- Convênio de saúde / reembolso — exige credenciamento jurídico fora de alcance de uma equipe pequena.
- Licenciamento institucional em escala — exige time comercial dedicado.
- Aplicativo mobile nativo — o app web já atende por enquanto.
- Sistema de cobrança sofisticado (múltiplos planos, upgrade automático) — começar simples.

## Evolução técnica necessária

Ver [`docs/ROADMAP.md`](ROADMAP.md), seção "Evolução da arquitetura" — backend → banco de dados → autenticação real → pagamentos, nessa ordem. Nenhuma etapa foi iniciada.
