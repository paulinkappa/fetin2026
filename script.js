// =============================================
//   VOZATIVA — Treino de Fala
//   v9 — Reconhecimento contínuo, trilha com
//         conectores dinâmicos, reordenação por
//         drag-and-drop, amigos e leaderboard,
//         busca na tela inicial, UI adaptativa
// =============================================

// ── Grupos base (nunca modificados em runtime; cada um tem um ID
//    estável que não muda mesmo se a ordem de exibição for alterada) ──
const BASE_GRUPOS = [
  { id: "vogais", nome: "Vogais", short: "Vog", fonemas: ["A","E","I","O","U"] },
  { id: "mp",     nome: "M e P",  short: "M·P", fonemas: ["MA","ME","MI","MO","MU","PA","PE","PI","PO","PU"] },
  { id: "tl",     nome: "T e L",  short: "T·L", fonemas: ["TA","TE","TI","TO","TU","LA","LE","LI","LO","LU"] },
  { id: "fv",     nome: "F e V",  short: "F·V", fonemas: ["FA","FE","FI","FO","FU","VA","VE","VI","VO","VU"] },
  { id: "nd",     nome: "N e D",  short: "N·D", fonemas: ["NA","NE","NI","NO","NU","DA","DE","DI","DO","DU"] },
  { id: "bc",     nome: "B e C",  short: "B·C", fonemas: ["BA","BE","BI","BO","BU","CA","CE","CI","CO","CU"] },
  { id: "gj",     nome: "G e J",  short: "G·J", fonemas: ["GA","GE","GI","GO","GU","JA","JE","JI","JO","JU"] },
];

// Revisão fonética (ver doc "VozAtiva — Gravação das Vozes", aba "Prompt:
// revisão fonética") — cada frase é tecnicamente fundamentada (ponto e modo
// de articulação, sonoridade reais do PT-BR) mas mantida simples, sem termo
// técnico, porque quem lê é o paciente, não um linguista. Duas decisões de
// julgamento registradas aqui:
// 1) E e O assumem a variante fechada (ê, ô) — a leitura mais neutra da
//    letra isolada.
// 2) TI/DI assumem a palatalização comum na fala brasileira ([tʃi]/[dʒi]) —
//    se as gravações definitivas de voz saírem com pronúncia não
//    palatalizada, só essas duas frases precisam mudar.
const BASE_DICAS = {
  A:"Abra bem a boca, deixe a língua baixa e solte o ar pela boca.",
  E:"Deixe a boca meio aberta, com os lábios levemente esticados para os lados.",
  I:"Estique levemente os lábios para os lados, deixando a língua bem alta.",
  O:"Arredonde os lábios em um círculo pequeno, com a língua numa altura média — nem baixa, nem tão alta quanto no U.",
  U:"Arredonde e projete os lábios para frente, deixando a língua bem alta.",
  MA:"Feche os lábios, deixe o ar sair pelo nariz e depois abra para o A.",
  ME:"Feche os lábios, deixe o ar sair pelo nariz e depois abra para o E.",
  MI:"Feche os lábios, deixe o ar sair pelo nariz e depois abra para o I.",
  MO:"Feche os lábios, deixe o ar sair pelo nariz e depois abra para o O.",
  MU:"Feche os lábios, deixe o ar sair pelo nariz e depois abra para o U.",
  PA:"Junte os lábios, solte o ar de repente e abra para o A.",
  PE:"Junte os lábios, solte o ar de repente e abra para o E.",
  PI:"Junte os lábios, solte o ar de repente e abra para o I.",
  PO:"Junte os lábios, solte o ar de repente e abra para o O.",
  PU:"Junte os lábios, solte o ar de repente e abra para o U.",
  TA:"Encoste a ponta da língua atrás dos dentes de cima, solte o ar e abra para o A.",
  TE:"Encoste a ponta da língua atrás dos dentes de cima, solte o ar e abra para o E.",
  TI:"Encoste a língua perto da parte de trás dos dentes de cima e solte o ar já puxando a língua para o alto.",
  TO:"Encoste a ponta da língua atrás dos dentes de cima, solte o ar e abra para o O.",
  TU:"Encoste a ponta da língua atrás dos dentes de cima, solte o ar e abra para o U.",
  LA:"Encoste a ponta da língua atrás dos dentes de cima e deixe o ar passar pelos lados da língua antes do A.",
  LE:"Encoste a ponta da língua atrás dos dentes de cima e deixe o ar passar pelos lados da língua antes do E.",
  LI:"Encoste a ponta da língua atrás dos dentes de cima e deixe o ar passar pelos lados da língua antes do I.",
  LO:"Encoste a ponta da língua atrás dos dentes de cima e deixe o ar passar pelos lados da língua antes do O.",
  LU:"Encoste a ponta da língua atrás dos dentes de cima e deixe o ar passar pelos lados da língua antes do U.",
  FA:"Encoste os dentes de cima no lábio de baixo, deixe o ar passar e abra para o A.",
  FE:"Encoste os dentes de cima no lábio de baixo, deixe o ar passar e abra para o E.",
  FI:"Encoste os dentes de cima no lábio de baixo, deixe o ar passar e abra para o I.",
  FO:"Encoste os dentes de cima no lábio de baixo, deixe o ar passar e abra para o O.",
  FU:"Encoste os dentes de cima no lábio de baixo, deixe o ar passar e abra para o U.",
  VA:"Encoste os dentes de cima no lábio de baixo, deixe o ar passar com a voz e abra para o A.",
  VE:"Encoste os dentes de cima no lábio de baixo, deixe o ar passar com a voz e abra para o E.",
  VI:"Encoste os dentes de cima no lábio de baixo, deixe o ar passar com a voz e abra para o I.",
  VO:"Encoste os dentes de cima no lábio de baixo, deixe o ar passar com a voz e abra para o O.",
  VU:"Encoste os dentes de cima no lábio de baixo, deixe o ar passar com a voz e abra para o U.",
  NA:"Encoste a língua atrás dos dentes de cima, deixe o ar sair pelo nariz e abra para o A.",
  NE:"Encoste a língua atrás dos dentes de cima, deixe o ar sair pelo nariz e abra para o E.",
  NI:"Encoste a língua atrás dos dentes de cima, deixe o ar sair pelo nariz e abra para o I.",
  NO:"Encoste a língua atrás dos dentes de cima, deixe o ar sair pelo nariz e abra para o O.",
  NU:"Encoste a língua atrás dos dentes de cima, deixe o ar sair pelo nariz e abra para o U.",
  DA:"Encoste a ponta da língua atrás dos dentes de cima, solte o ar com a voz e abra para o A.",
  DE:"Encoste a ponta da língua atrás dos dentes de cima, solte o ar com a voz e abra para o E.",
  DI:"Encoste a língua perto da parte de trás dos dentes de cima e solte o ar com a voz já puxando a língua para o alto.",
  DO:"Encoste a ponta da língua atrás dos dentes de cima, solte o ar com a voz e abra para o O.",
  DU:"Encoste a ponta da língua atrás dos dentes de cima, solte o ar com a voz e abra para o U.",
  BA:"Junte os lábios, solte o ar de repente com a voz e abra para o A.",
  BE:"Junte os lábios, solte o ar de repente com a voz e abra para o E.",
  BI:"Junte os lábios, solte o ar de repente com a voz e abra para o I.",
  BO:"Junte os lábios, solte o ar de repente com a voz e abra para o O.",
  BU:"Junte os lábios, solte o ar de repente com a voz e abra para o U.",
  CA:"Encoste a parte de trás da língua no céu da boca, solte o ar de repente e abra para o A.",
  CE:"Aproxime a língua da parte de trás dos dentes de cima, deixe o ar passar fazendo um som contínuo e abra para o E.",
  CI:"Aproxime a língua da parte de trás dos dentes de cima, deixe o ar passar fazendo um som contínuo e abra para o I.",
  CO:"Encoste a parte de trás da língua no céu da boca, solte o ar de repente e abra para o O.",
  CU:"Encoste a parte de trás da língua no céu da boca, solte o ar de repente e abra para o U.",
  GA:"Encoste a parte de trás da língua no céu da boca, solte o ar de repente com a voz e abra para o A.",
  // GE/GI e J (JA-JU) são o mesmo som — diferente de CE/CI: a língua fica um
  // pouco mais atrás (perto do céu da boca, não dos dentes), por isso a
  // frase marca essa diferença de lugar, não só a de voz (ver problema
  // sinalizado na revisão: antes a frase de GE/GI/J ficava quase idêntica
  // à de CE/CI, como se a única diferença fosse ter voz ou não).
  GE:"Aproxime a língua do céu da boca, um pouco mais atrás do que no som de S, deixe o ar passar com a voz e abra para o E.",
  GI:"Aproxime a língua do céu da boca, um pouco mais atrás do que no som de S, deixe o ar passar com a voz e abra para o I.",
  GO:"Encoste a parte de trás da língua no céu da boca, solte o ar de repente com a voz e abra para o O.",
  GU:"Encoste a parte de trás da língua no céu da boca, solte o ar de repente com a voz e abra para o U.",
  JA:"Aproxime a língua do céu da boca, um pouco mais atrás do que no som de S, deixe o ar passar com a voz e abra para o A.",
  JE:"Aproxime a língua do céu da boca, um pouco mais atrás do que no som de S, deixe o ar passar com a voz e abra para o E.",
  JI:"Aproxime a língua do céu da boca, um pouco mais atrás do que no som de S, deixe o ar passar com a voz e abra para o I.",
  JO:"Aproxime a língua do céu da boca, um pouco mais atrás do que no som de S, deixe o ar passar com a voz e abra para o O.",
  JU:"Aproxime a língua do céu da boca, um pouco mais atrás do que no som de S, deixe o ar passar com a voz e abra para o U.",
};

// Banco de frases motivacionais — uma é sorteada toda vez que a tela
// inicial (paciente) é exibida.
const HOME_TAGLINES = [
  "Cada som praticado hoje é um degrau a mais na sua conquista.",
  "Mantenha o ritmo! Sua voz está ficando mais forte a cada dia.",
  "Não pare agora: sua consistência é o segredo para falar com perfeição.",
  "Hora do treino! Venha desbloquear o próximo nível da sua voz!",
  "Cada sílaba encaixada é uma vitória para a sua comunicação.",
  "Treine sua fala com clareza e confiança para continuar evoluindo.",
  "Supere seus limites um som de cada vez. Você consegue!",
  "Transforme o treino de hoje na sua segurança de amanhã.",
  "Solte a língua, capriche no som e deixe sua mensagem brilhar!",
  "Cada fonema treinado é mais clareza para a sua voz.",
  "Fale sem medo: a prática diária traz a clareza perfeita.",
  "Cada fonema treinado é um superpoder a mais para a sua voz!",
  "Seu esforço de hoje vale ouro para a clareza da sua fala.",
  "Continue treinando: sua voz merece ser ouvida com toda clareza.",
  "Missão cumprida é som aperfeiçoado. Vamos para a próxima!",
];
function randomHomeTagline() {
  return HOME_TAGLINES[Math.floor(Math.random() * HOME_TAGLINES.length)];
}

// Banco de mensagens de conclusão de fase — sorteada a cada fase concluída.
const FINAL_MESSAGES = [
  "Missão cumprida! Você tirou de letra.",
  "Mandou muito bem! Mais um fonema para a conta.",
  "Mais uma etapa conquistada! Sua fala está cada vez mais afiada.",
  "Brilhante! Você arrasou nesse treino e já pode ir para o próximo desafio.",
  "Desafio finalizado! Sua pronúncia está cada vez mais natural.",
  "Desafio concluído! Sua voz está voando radiante.",
];
function randomFinalMessage() {
  return FINAL_MESSAGES[Math.floor(Math.random() * FINAL_MESSAGES.length)];
}

// Banco de mensagens para aproveitamento abaixo do limiar de conclusão
// (ver PHASE_COMPLETION_THRESHOLD).
const FINAL_MESSAGES_LOW = [
  "Treino encerrado! Vamos tentar outra vez para destravar esse fonema?",
  "Concluído! A sua voz está se acostumando, que tal mais uma rodada para fixar?",
  "Missão dada é missão cumprida, mas podemos afinar mais esse som! Vamos de novo?",
  "Missão concluída! Vamos ajustar o som e tentar mais uma vez?",
  "Treino finalizado! Bora dar mais uma ajustada nesse som?",
  "Desafio encerrado! Que tal mais uma tentativa para destravar o fonema?",
];
function randomLowFinalMessage() {
  return FINAL_MESSAGES_LOW[Math.floor(Math.random() * FINAL_MESSAGES_LOW.length)];
}

// ── Conteúdo ativo (derivado do usuário/paciente em foco) ──
let grupos = BASE_GRUPOS.map(g => ({ id: g.id, nome: g.nome, short: g.short, fonemas: [...g.fonemas] }));
let desafios = [], fonemaGrupo = [], fonemaLocal = [];
let activeCustomDicas = {};
let activeCustomAudio = {};
// fonema/palavra -> segundos a sustentar (exercícios do tipo "som
// sustentado", ex.: "AAAAAAA" por 3s) — ver seção TREINO SUSTENTADO.
let activeSustainConfig = {};

function getDica(fonema) { return activeCustomDicas[fonema] || BASE_DICAS[fonema] || ""; }

// Monta a lista de grupos de UM usuário específico (base + conteúdo
// adicionado pelo médico exclusivamente para ele), já respeitando a
// ordem personalizada (drag-and-drop) se existir.
function getUserGroups(user) {
  const g = BASE_GRUPOS.map(bg => ({ id: bg.id, nome: bg.nome, short: bg.short, fonemas: [...bg.fonemas] }));
  const cc = (user && user.customContent) || {};
  (cc.groups || []).forEach(cg => g.push({ id: cg.id, nome: cg.nome, short: cg.short, fonemas: [] }));
  (cc.exercises || []).forEach(ex => {
    const grp = g.find(x => x.id === ex.groupId);
    if (grp && !grp.fonemas.includes(ex.text)) grp.fonemas.push(ex.text);
  });

  const order = cc.groupOrder;
  if (order && order.length) {
    const byId = new Map(g.map(x => [x.id, x]));
    const ordered = [];
    order.forEach(id => { const x = byId.get(id); if (x) { ordered.push(x); byId.delete(id); } });
    byId.forEach(x => ordered.push(x)); // grupos criados fora da lista de ordem entram no fim, por segurança
    return ordered;
  }
  return g;
}

// Garante que o paciente tenha uma ordem de grupos definida, capturando
// a ordem atual como ponto de partida na primeira vez.
function ensureGroupOrder(patient) {
  if (!patient.customContent) patient.customContent = { groups: [], exercises: [], dicas: {}, audio: {}, groupOrder: [], physicalExercises: [] };
  if (!patient.customContent.physicalExercises) patient.customContent.physicalExercises = [];
  if (!patient.customContent.groupOrder || !patient.customContent.groupOrder.length) {
    patient.customContent.groupOrder = getUserGroups(patient).map(g => g.id);
  }
  return patient.customContent.groupOrder;
}

function rebuildDesafios() {
  desafios = grupos.flatMap(g => g.fonemas);
  fonemaGrupo.length = 0; fonemaLocal.length = 0;
  grupos.forEach((g, gi) => g.fonemas.forEach((_, li) => { fonemaGrupo.push(gi); fonemaLocal.push(li); }));
}

// Define de quem é o conteúdo ativo no momento (paciente treinando, ou
// paciente sendo editado pelo médico)
function setActiveContent(user) {
  grupos = getUserGroups(user);
  const cc = (user && user.customContent) || {};
  activeCustomDicas = { ...(cc.dicas || {}) };
  activeCustomAudio = { ...(cc.audio || {}) };
  activeSustainConfig = {};
  (cc.exercises || []).forEach(ex => { if (ex.sustainSec) activeSustainConfig[ex.text] = ex.sustainSec; });
  rebuildDesafios();
}

function groupsWithIntervention(user) {
  const set = new Set();
  const cc = (user && user.customContent) || {};
  (cc.groups || []).forEach(g => set.add(g.id));
  (cc.exercises || []).forEach(ex => set.add(ex.groupId));
  return set;
}

// ── Estado app ────────────────────────────────
let currentIndex       = 0;
let isRecording         = false;
let micGranted         = false;
let micDenied           = false;
let phaseGroupIndex    = 0;
let phaseStartIndex    = 0;
let phaseEndIndex      = 0;
let phaseSegmentStatus = []; // status por fonema da fase atual: "correct" | "incorrect" | "skipped" | null
// Paralelo a phaseSegmentStatus: id (IndexedDB) do áudio gravado em cada
// tentativa da fase atual, ou null se não gravou nada (pulado, sem
// microfone) — usado só pra montar a fila de aprovação do médico
// (ver registerPhaseReview em finishPhase).
let phaseAttemptMediaIds = [];
// Paralelo a phaseSegmentStatus: true só quando o reconhecimento de fala
// real (Web Speech API) deu o resultado desta tentativa — false quando
// caiu pro heurístico de volume/duração (que não confere SE é fala,
// só volume e tempo — ver G1 na auditoria). Mostrado pro médico na fila
// de revisão, pra ele saber quando o "certo" não foi verificado por voz.
let phaseAttemptVerified = [];
// Incrementado toda vez que uma tentativa de fase é abandonada/reiniciada
// (releasePendingPhaseAttempts) — o salvamento assíncrono de áudio
// (stopAudioRecordingForReview) confere esse número antes de escrever no
// array, pra nunca gravar o id de uma gravação velha na fase/tentativa
// nova (ver T2/F2 na auditoria).
let phaseAttemptGeneration = 0;
// true assim que finishPhase já criou a revisão do médico pra esta
// tentativa — a partir daí os ids em phaseAttemptMediaIds pertencem a
// essa revisão e NUNCA devem ser liberados por releasePendingPhaseAttempts
// (ex.: paciente clica "Tentar novamente" logo depois de terminar).
let phaseAttemptCommitted = false;
let mediaRecorder = null;
let currentAttemptChunks = [];
// Contador monotônico de pulos DE VERDADE usados na fase atual — ao
// contrário de contar quantos segmentos estão "skipped" agora (que cai
// se o paciente voltar e responder um deles), este número só sobe,
// fechando a brecha de burlar o limite indo e voltando (ver F6).
let phaseSkipsUsed = 0;
const SKIP_LIMIT_PER_PHASE = 3; // igual para todas as fases, incluindo personalizadas
let recordingPeak       = 0;
let recordingStartTime = 0;
let speechOnsetTime      = null; // quando o volume cruzou o limiar pela 1ª vez nesta gravação
let lastAboveThresholdTime = null; // último instante em que o volume estava acima do limiar
let matchDetected       = false;
let recordingSilenceTimer = null;
let recordingMaxTimer     = null;
let recognitionActiveForTake = false; // reconhecimento real ligado e escutando nesta gravação específica

// ── Treino de som sustentado (ex.: "AAAAAAA" por 3s, "TRTRTRTR") ──────
// Modo à parte do fluxo normal de match único: em vez de comparar o texto
// reconhecido, mede quanto tempo contínuo o volume fica acima do limiar,
// tolerando micro-quedas (respiração, oclusiva no meio do som) sem reiniciar
// a contagem por completo.
let sustainTargetMs      = 0;   // 0 = fonema normal; >0 = segundos-alvo * 1000
let sustainStreakMs      = 0;   // tempo contínuo acima do limiar nesta gravação
let sustainGapMs         = 0;   // silêncio acumulado desde a última queda
let sustainLastFrameTime = 0;
const SUSTAIN_GAP_TOLERANCE_MS = 300; // um blip de silêncio de até 300ms não reinicia a contagem

const MATCH_VOLUME_THRESHOLD = 0.16;
const SILENCE_TIMEOUT_MS     = 3000;
const RECORDING_MAX_MS       = 8000;
const MIC_GAIN                = 2.2; // amplificação de software p/ vozes mais baixas
const CAPTURE_RELEASE_MS      = 180; // silêncio após a fala p/ considerar que o fonema terminou
const CAPTURE_MIN_MS          = 120; // piso mínimo p/ não confirmar estalo/batida instantânea

// Pede ao navegador para já tratar eco, ruído de fundo e ganho automático —
// ajuda bastante quando o ambiente não é silencioso ou a voz do paciente é
// mais baixa, sem precisar de nenhuma configuração manual.
const MIC_CONSTRAINTS = { audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false };

// Fallback para quando o reconhecimento de fala real (Web Speech API) não
// está disponível no navegador (ex.: Firefox) ou falha nesta tentativa: a
// "identificação" usa volume + duração como aproximação. Para não validar
// qualquer som (batida de palma, ruído, tosse) como se fosse o fonema
// esperado, a duração falada precisa ser compatível com o TAMANHO do
// fonema/palavra: muito curta demais para o texto esperado, ou longa
// demais, é registrada como incorreta em vez de aceitar automaticamente.
// "min" aqui é só um teto MÁXIMO de tempo de reação (usado no clique manual
// de confirmação); a confirmação automática não espera mais por um tempo
// fixo — ela reage ao fim da fala (ver CAPTURE_RELEASE_MS/CAPTURE_MIN_MS em
// drawWaveform), o que reduz bastante a espera depois que o paciente já
// terminou de falar um fonema curto.
function expectedDurationRangeMs(fonema) {
  const len = (fonema || "").replace(/[^A-Za-zÀ-ÿ]/g, "").length || 1;
  const min = 90 + len * 20;            // "A" (1): ~110ms · "TRA" (3): ~150ms · "GRANDE" (6): ~210ms
  const max = Math.min(500 + len * 240, RECORDING_MAX_MS - 300);
  return { min, max };
}

// ── Reconhecimento de fala real (Web Speech API) ──────────────────────
// Compara o texto reconhecido pelo navegador com o fonema/palavra esperado
// (ignorando maiúsculas, acentos e pontuação). Usado como critério
// principal de acerto/erro quando disponível; se o navegador não suportar
// SpeechRecognition, ou a tentativa atual falhar ao iniciar, cai de volta
// no heurístico de volume/duração acima só para aquela gravação.
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition || null;
// Reaproveitada entre tentativas — igual ao AudioContext em startAudio().
// Instanciar um SpeechRecognition novo a cada exercício abre uma sessão de
// captura de microfone própria do motor de reconhecimento, independente do
// getUserMedia/micStream já reaproveitado; isso é o que fazia o navegador
// voltar a arbitrar o microfone (e, em alguns navegadores, pedir permissão
// de novo) a cada exercício, mesmo com o áudio "principal" já corrigido.
let recognition = null;
let recognitionCurrentFonema = null; // fonema da tentativa em andamento, lido pelos handlers fixos abaixo
let recognitionFailed = false; // erro permanente (ex.: permissão negada) — desiste pelo resto da sessão
let recognitionOutcome = null; // null = ainda sem veredito nesta gravação | true | false

// faixa Unicode "Combining Diacritical Marks" (U+0300–U+036F), montada por
// código para não depender de caracteres combinantes literais no arquivo
const DIACRITICS_RE = new RegExp("[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]", "g");
function normalizeSpeechText(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(DIACRITICS_RE, "")
    .replace(/[^a-z]/g, "");
}
function speechMatchesFonema(transcript, fonema) {
  const t = normalizeSpeechText(transcript);
  const e = normalizeSpeechText(fonema);
  if (!t || !e) return false;
  return t === e || t.includes(e) || e.includes(t);
}

// Cria a instância UMA ÚNICA VEZ por sessão (ver comentário acima de
// `recognition`) — os handlers ficam fixos e leem recognitionCurrentFonema
// (atualizado a cada chamada) em vez de fechar sobre o parâmetro `fonema`,
// já que agora o mesmo objeto atende várias tentativas.
function ensureSpeechRecognitionInstance() {
  if (recognition) return recognition;
  try {
    recognition = new SpeechRecognitionAPI();
    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognition.onresult = (e) => {
      if (!isRecording || recognitionOutcome !== null) return;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        let matched = false;
        for (let k = 0; k < result.length; k++) {
          if (speechMatchesFonema(result[k].transcript, recognitionCurrentFonema)) { matched = true; break; }
        }
        if (matched) {
          recognitionOutcome = true; matchDetected = true;
          finishRecording(true);
          return;
        }
        if (result.isFinal) {
          // frase reconhecida por completo e não bate com o esperado
          recognitionOutcome = false; matchDetected = true;
          finishRecording(false);
          return;
        }
      }
    };
    recognition.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") recognitionFailed = true;
    };
    recognition.onend = () => {
      // o serviço de reconhecimento encerra sozinho após alguns segundos de
      // silêncio mesmo em modo contínuo; reinicia enquanto a gravação e a
      // fase ainda estiverem em aberto e sem veredito
      if (isRecording && recognitionOutcome === null && !recognitionFailed) {
        try { recognition.start(); } catch (e) {}
      }
    };
  } catch (e) {
    recognition = null;
  }
  return recognition;
}
// Retorna true se a escuta foi iniciada com sucesso (permite decidir, por
// gravação, se deve confiar no reconhecimento real ou cair no heurístico).
function startSpeechRecognition(fonema) {
  recognitionCurrentFonema = fonema;
  const r = ensureSpeechRecognitionInstance();
  if (!r) return false;
  try { r.start(); return true; }
  catch (e) {
    // "InvalidStateError" quando já está em execução (ex.: onend ainda não
    // processou o abort anterior) — nesse caso já está ouvindo, então não é
    // uma falha real; qualquer outro erro aqui também não é permanente.
    return true;
  }
}
function stopSpeechRecognition() {
  if (!recognition) return;
  try { recognition.abort(); } catch (e) {}
}

// ── Estado configurações ──────────────────────
let darkMode = false;
let soundOn  = true;
let notifOn  = true;
let reducedMotion = false;
let voiceGender = "female";

// ── Áudio (waveform) ──────────────────────────
let audioCtx  = null;
let analyser  = null;
let micStream = null;
let rafId     = null;
let dataArray = null;
// Qual micStream o audioCtx/analyser atuais estão ligados a — usado por
// startAudio pra saber se pode reaproveitar o grafo de áudio existente
// ou se precisa recriar (stream trocou de verdade, não só pausou/voltou
// entre exercícios). Ver correção da permissão de microfone repetida.
let audioGraphStream = null;
// Nó de origem (createMediaStreamSource) atualmente ligado ao analyser —
// guardado só pra poder desligá-lo antes de criar um novo a cada gravação
// (ver startAudio). Sem isso, cada tentativa deixaria um nó de origem
// antigo ainda conectado à mesma faixa, além do novo.
let audioGraphSource = null;

// ── Diagnóstico do microfone ──────────────────
// Instrumentação temporária, sem efeito no comportamento — só loga no
// console (prefixo "[mic]") o que está acontecendo de verdade com a faixa
// de áudio e com a permissão, pra investigar relatos de pedido de
// permissão repetido que não reproduzem no ambiente de teste. Cada faixa
// de microfone obtida (bootstrapMicPermission, requestMicPermission,
// retryMicPermission, startAudio, toggleChatAudioRecording) passa por
// attachMicTrackDiagnostics logo depois de adquirida.
function micLog(msg, extra) {
  try { console.warn("[mic] " + msg, extra !== undefined ? extra : ""); } catch (e) {}
}
let micPermissionStatusWatched = false;
function watchMicPermissionStatus() {
  if (micPermissionStatusWatched || !navigator.permissions || !navigator.permissions.query) return;
  micPermissionStatusWatched = true;
  navigator.permissions.query({ name: "microphone" }).then((status) => {
    micLog("estado inicial da permissão (Permissions API): " + status.state);
    status.onchange = () => micLog("MUDANÇA no estado da permissão (Permissions API): " + status.state);
  }).catch((e) => micLog("Permissions API não respondeu para 'microphone' (normal em alguns navegadores)", e && e.message));
}
function attachMicTrackDiagnostics(stream, source) {
  if (!stream) return;
  stream.getTracks().forEach((t) => {
    micLog(`faixa obtida via ${source} — label="${t.label}" state=${t.readyState}`);
    t.addEventListener("ended", () => {
      micLog(`⚠️ faixa TERMINOU sozinha (evento "ended") — obtida via ${source}, label="${t.label}". Isso é o que força um novo getUserMedia() no próximo startAudio().`);
    });
  });
}

// sons sintéticos (beeps) para feedback
let sfxCtx = null;
function getSfxCtx() {
  if (!sfxCtx) sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
  return sfxCtx;
}
function playBeep(freq = 660, dur = 0.12, type = "sine", vol = 0.18) {
  if (!soundOn) return;
  try {
    const ctx = getSfxCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch(e) {}
}

// ── DOM ───────────────────────────────────────
const screenAuth     = document.getElementById("screen-auth");
const screenHome     = document.getElementById("screen-home");
const screenPath     = document.getElementById("screen-path");
const screenApp      = document.getElementById("screen-app");
const screenDoctor   = document.getElementById("screen-doctor");
const screenAccountPicker = document.getElementById("screen-account-picker");
const phonemeDisplay = document.getElementById("phoneme-display");
const tipText        = document.getElementById("tip-text");
const phaseCurrent   = document.getElementById("phase-current");
const phaseTotal     = document.getElementById("phase-total");
const phonemeBox     = document.getElementById("phoneme-box");
const btnRecord      = document.getElementById("btn-record");
const mainCard       = document.getElementById("main-card");
const finalScreen    = document.getElementById("final-screen");
const statCorrect    = document.getElementById("stat-correct");
const statTotal      = document.getElementById("stat-total");
const canvas         = document.getElementById("waveform-canvas");
const waveformIdle   = document.getElementById("waveform-idle");
const groupLabel     = document.getElementById("group-label");
const permOverlay    = document.getElementById("perm-overlay");
const progressWrap   = document.getElementById("progress-wrapper");
const ctx2d          = canvas.getContext("2d");

const DEFAULT_AVATAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px"><polyline points="20 6 9 17 4 12"/></svg>`;
const LOCK_SVG  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
const MAIL_SVG  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;

// ── Ícones próprios de tipo de mensagem (chat) — mesmo estilo de traço
// (stroke-width 2, cantos arredondados) do resto do app, um glifo
// dedicado por tipo para o balão de mensagem ficar reconhecível de
// relance, sem precisar abrir a mídia para saber o que é.
const CHAT_ICON_TEXT     = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
const CHAT_ICON_REMINDER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;
const CHAT_ICON_AUDIO     = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/></svg>`;
const CHAT_ICON_PHOTO     = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5.5-5.5a2 2 0 0 0-2.8 0L3 20"/></svg>`;
const CHAT_ICON_VIDEO     = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="14" height="13" rx="2"/><path d="M16.5 10.5 21 7.5v9l-4.5-3"/></svg>`;
const CHAT_ICON_SEND      = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
const CHAT_TYPE_ICON = { reminder: CHAT_ICON_REMINDER, audio: CHAT_ICON_AUDIO, photo: CHAT_ICON_PHOTO, video: CHAT_ICON_VIDEO };

// ══════════════════════════════════════════════
// ARMAZENAMENTO DE MÍDIA (IndexedDB)
// ──────────────────────────────────────────────
// Fotos, vídeos e áudios de chat, mais os vídeos de exercício físico
// enviados pelo médico, são grandes demais para o localStorage (cota de
// só alguns MB por origem — já é apertada só com fotos de perfil e
// áudio de fonema, ver AUDIO_MAX_BYTES/AVATAR_MAX_DIM). Em vez de
// colocar tudo em base64 no mesmo blob JSON, o binário em si fica no
// IndexedDB (também 100% local, sem servidor, com cota bem maior) — o
// localStorage guarda só metadados (id, tipo MIME, quem enviou, data).
// ══════════════════════════════════════════════
const MEDIA_DB_NAME = "vozativa_media", MEDIA_STORE = "blobs";
let mediaDbPromise = null;
function openMediaDb() {
  if (mediaDbPromise) return mediaDbPromise;
  mediaDbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(MEDIA_DB_NAME, 1);
    req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(MEDIA_STORE)) req.result.createObjectStore(MEDIA_STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return mediaDbPromise;
}
function saveMediaBlob(id, blob) {
  return openMediaDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, "readwrite");
    tx.objectStore(MEDIA_STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }));
}
function loadMediaBlob(id) {
  return openMediaDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, "readonly");
    const req = tx.objectStore(MEDIA_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  }));
}
function deleteMediaBlob(id) {
  return openMediaDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, "readwrite");
    tx.objectStore(MEDIA_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }));
}
function newMediaId() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9); }
// Object URLs criadas ficam vivas até a página fechar/recarregar — leve
// o bastante para o volume de mídia de um app de terapia entre poucos
// contatos, sem precisar de um controle de ciclo de vida mais elaborado.
const mediaUrlCache = new Map();
async function mediaBlobUrl(id) {
  if (mediaUrlCache.has(id)) return mediaUrlCache.get(id);
  const blob = await loadMediaBlob(id);
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  mediaUrlCache.set(id, url);
  return url;
}
// Libera de vez um item de mídia: revoga a Object URL em cache (se
// alguma tela chegou a exibir/tocar) e apaga o blob do IndexedDB — usado
// quando o conteúdo não tem mais nenhuma finalidade (ex.: áudio de
// revisão de fase já aprovada/rejeitada pelo médico, ver
// setReviewStatus), pra não acumular mídia indefinidamente no
// armazenamento local.
function releaseMediaBlob(id) {
  if (!id) return;
  if (mediaUrlCache.has(id)) {
    URL.revokeObjectURL(mediaUrlCache.get(id));
    mediaUrlCache.delete(id);
  }
  return deleteMediaBlob(id);
}

function val(id) { const el = document.getElementById(id); return el ? el.value : ""; }
// Torna um elemento não-nativo (uma <div> usada como cartão/linha clicável)
// totalmente operável por teclado: focável via Tab, anunciado como botão
// para leitor de tela, e ativável com Enter ou Espaço — igual a um <button>
// nativo já se comportaria sozinho.
function makeKeyboardClickable(el) {
  el.tabIndex = 0;
  if (!el.hasAttribute("role")) el.setAttribute("role", "button");
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      el.click();
    }
  });
}
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
function levelLabel(level) {
  return { iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" }[level] || "Iniciante";
}
function countDigits(str) { return ((str || "").match(/\d/g) || []).length; }

// Nível de Aprendizagem: não é editável — é calculado a partir do
// aproveitamento real do paciente nas fases (não é mais um campo salvo).
function computeLevel(user) {
  const totalGroups = getUserGroups(user).length;
  const done = ((user && user.progress && user.progress.completedGroupIds) || []).length;
  if (!totalGroups) return "iniciante";
  const pct = done / totalGroups;
  if (pct >= 0.75) return "avancado";
  if (pct >= 0.34) return "intermediario";
  return "iniciante";
}

// ══════════════════════════════════════════════
// SENHA — hash (nunca gravamos a senha em texto puro)
// ──────────────────────────────────────────────
// Sem backend, "criptografar e depois decifrar" a senha não protegeria
// nada (a chave teria que morar no mesmo dispositivo do atacante). O que
// realmente elimina o risco é nunca guardar a senha original: só um hash
// SHA-256 com um "sal" aleatório por conta (via Web Crypto, nativo do
// navegador). No login, comparamos hash com hash — a senha em si nunca é
// lida de volta do localStorage.
// ══════════════════════════════════════════════
function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function verifyPassword(password, user) {
  if (!user || !user.passwordSalt || !user.passwordHash) return false;
  const computed = await hashPassword(password, user.passwordSalt);
  return computed === user.passwordHash;
}

// ══════════════════════════════════════════════
// SENHA — mostrar/ocultar
// ══════════════════════════════════════════════
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const willBeVisible = input.type === "password";
  input.type = willBeVisible ? "text" : "password";
  const eyeOn = btn.querySelector(".eye-on");
  const eyeOff = btn.querySelector(".eye-off");
  if (eyeOn) eyeOn.classList.toggle("hidden", !willBeVisible);
  if (eyeOff) eyeOff.classList.toggle("hidden", willBeVisible);
  btn.setAttribute("aria-label", willBeVisible ? "Ocultar senha" : "Mostrar senha");
}

// ══════════════════════════════════════════════
// NAVEGAÇÃO DE TELAS
// ══════════════════════════════════════════════
const SCREENS_BY_NAME = {
  auth: screenAuth, home: screenHome, path: screenPath,
  app: screenApp, doctor: screenDoctor, "account-picker": screenAccountPicker,
};
// Rastreado explicitamente (não "adivinhado" a partir de quem está sem
// .hidden no DOM) — trocas rápidas em sequência (ex.: dois cliques
// seguidos) não confundem qual tela é a "atual de verdade" na hora de
// decidir quem deve tocar a animação de saída.
let activeScreenName = "auth"; // reflete a tela visível por padrão no HTML estático

// Troca de tela com saída animada: a tela atual toca uma animação de
// saída (espelhando a de entrada, só mais rápida) e só recebe .hidden
// depois que ela termina — a tela nova entra imediatamente, então a
// transição lê como uma sequência contínua, não um corte seco.
function showOnlyScreen(name) {
  if (currentTourKey && currentTourKey !== name) {
    document.getElementById("tour-overlay").classList.add("hidden");
    window.removeEventListener("resize", repositionTourStep);
    currentTourKey = null;
  }
  const previousName = activeScreenName;
  activeScreenName = name;
  const target = SCREENS_BY_NAME[name];
  const previous = (previousName && previousName !== name) ? SCREENS_BY_NAME[previousName] : null;

  // Qualquer outra tela que não seja nem a nova nem a que está de saída
  // é escondida na hora — cobre o caso de uma troca ainda mais rápida
  // ter deixado alguma para trás no meio do caminho.
  Object.entries(SCREENS_BY_NAME).forEach(([key, el]) => {
    if (!el || el === target || el === previous) return;
    el.classList.remove("screen-exiting");
    el.classList.add("hidden");
  });

  if (previous) {
    if (reducedMotion) {
      previous.classList.add("hidden");
    } else {
      previous.classList.add("screen-exiting");
      const finishExit = () => {
        previous.classList.remove("screen-exiting");
        // Só esconde se essa tela não voltou a ficar ativa enquanto a
        // animação rodava (troca rápida de volta pra ela mesma).
        if (activeScreenName !== previousName) previous.classList.add("hidden");
      };
      previous.addEventListener("animationend", finishExit, { once: true });
      setTimeout(finishExit, 260); // salvaguarda caso o evento não dispare
    }
  }
  if (target) target.classList.remove("hidden");

  // Bolinhas do fundo só "flutuam" na tela de login/cadastro — ver
  // body.auth-active no CSS e initBlobFluidMotion no script.js.
  document.body.classList.toggle("auth-active", name === "auth");
  updateBlobMotionState();
  // Cursor de "arrastar pra rolar" na trilha e no painel do médico —
  // fica em <html> (document.documentElement), que é quem de fato rola
  // a página (document.scrollingElement), não <body>.
  document.documentElement.classList.toggle("path-active", name === "path");
  document.documentElement.classList.toggle("doctor-active", name === "doctor");
}

// A busca da tela inicial some assim que a busca é concluída (resultado
// escolhido) ou assim que qualquer outra aba/painel é aberto.
function clearHomeSearch() {
  const input = document.getElementById("home-search-input");
  const results = document.getElementById("home-search-results");
  if (input) input.value = "";
  if (results) results.classList.add("hidden");
}

function goHome() {
  if (isRecording) stopAudio();
  showOnlyScreen("home");
  checkPendingInvites();
  updateHomeTagline();
  clearHomeSearch();
  const users = getUsers();
  const user = sessionEmail ? users[sessionEmail] : null;
  if (user) updateStreakBadge(user.role === "medico" ? null : user);
}

function goToPath(introAnimation) {
  if (!sessionEmail) return;
  clearHomeSearch();
  showOnlyScreen("path");
  renderPathTree(!!introAnimation);
  syncPathHeaderPosition();
  maybeStartPathTour();
}

// O cabeçalho da Árvore de Progresso (Voltar/fase/tema/dica) não
// consegue ficar "grudado" no topo via position:sticky nem :fixed puro
// nesta base específica (ver comentário grande em style.css, no bloco
// #screen-path .app-header — resumindo: a animação de entrada de TODA
// tela deixa um transform residual que quebra o containing block dos
// dois). Sincroniza manualmente via JS a cada rolagem, só enquanto a
// tela da trilha está visível — mesma ideia de positionDropdownMenu.
function syncPathHeaderPosition() {
  if (screenPath.classList.contains("hidden")) return;
  const header = document.querySelector("#screen-path .app-header");
  if (!header) return;
  header.style.top = document.documentElement.scrollTop + "px";
}
let pathHeaderSyncRaf = null;
window.addEventListener("scroll", () => {
  if (pathHeaderSyncRaf) return;
  pathHeaderSyncRaf = requestAnimationFrame(() => { pathHeaderSyncRaf = null; syncPathHeaderPosition(); });
}, { passive: true });

function openDoctorScreen() {
  closeDropdowns();
  clearHomeSearch();
  showOnlyScreen("doctor");
  showDoctorList();
  maybeStartDoctorPanelTour();
}

// ══════════════════════════════════════════════
// DROPDOWN
// ══════════════════════════════════════════════
let activeDropdown = null;

function toggleDropdown(which) {
  if (activeDropdown === which) { closeDropdowns(); return; }
  closeDropdowns();
  clearHomeSearch();
  activeDropdown = which;
  const menu = document.getElementById(`dropdown-${which}`);
  const anchor = document.getElementById(`${which}-anchor`);
  menu.classList.remove("hidden");
  if (anchor) positionDropdownMenu(menu, anchor);
}

// O menu usa position:fixed (ver .dropdown-menu no CSS) — calcula aqui a
// posição real a partir do botão que abriu, em vez de confiar em
// position:absolute relativo a um ancestral, que ficava cortado pela
// rolagem horizontal do cabeçalho da Home (.home-top { overflow-x: auto }).
function positionDropdownMenu(menu, anchor) {
  const r = anchor.getBoundingClientRect();
  const menuWidth = Math.max(menu.offsetWidth, 220);
  let left = r.left;
  if (left + menuWidth > window.innerWidth - 12) left = r.right - menuWidth;
  if (left < 12) left = 12;
  menu.style.left = left + "px";
  menu.style.top = (r.bottom + 12) + "px";
}

function closeDropdowns() {
  ["profile","settings"].forEach(id => {
    const el = document.getElementById(`dropdown-${id}`);
    if (el) el.classList.add("hidden");
  });
  activeDropdown = null;
}

document.addEventListener("click", e => {
  if (!e.target.closest(".dropdown-anchor")) closeDropdowns();
});

// ══════════════════════════════════════════════
// PANELS
// ══════════════════════════════════════════════
// Pilha de overlays abertos (modal/painel/permissão) — permite empilhar
// (ex.: ranking aberto de dentro do painel de amigos), devolver o foco ao
// lugar certo em cada fechamento, na ordem certa, e prender o Tab dentro do
// overlay mais recente enquanto ele estiver aberto (ver keydown global logo
// abaixo). Sem isso, um usuário de teclado perdia a posição toda vez que um
// painel abria/fechava e podia "vazar" com Tab para trás do overlay.
const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const overlayStack = [];
function getFocusableIn(container) {
  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(el => el.offsetParent !== null || el === document.activeElement);
}
function focusFirstIn(container) {
  if (!container) return;
  const [first] = getFocusableIn(container);
  (first || container).focus({ preventScroll: true });
}
function showOverlay(el) {
  overlayStack.push({ el, prevFocus: document.activeElement });
  el.classList.remove("hidden");
  ensureDialogA11y(el);
  focusFirstIn(el);
}

// Garante role="dialog"/aria-modal/aria-labelledby em QUALQUER modal ou
// painel aberto por showOverlay — um só lugar, em vez de marcar cada um
// dos ~25 overlays manualmente no HTML (ver A1 na auditoria: só 2 deles
// tinham essa semântica antes). Não sobrescreve um overlay que já
// declarou a própria role/label deliberadamente.
function ensureDialogA11y(el) {
  if (!el.hasAttribute("role")) el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  if (!el.hasAttribute("aria-labelledby") && !el.hasAttribute("aria-label")) {
    const titleEl = el.querySelector(".panel-title, .modal-question, h2, h3");
    if (titleEl) {
      if (!titleEl.id) titleEl.id = "dlg-title-" + (el.id || Math.random().toString(36).slice(2, 8));
      el.setAttribute("aria-labelledby", titleEl.id);
    }
  }
}
// force=true pula a checagem de alterações não salvas (usado só por
// discardProfileEditAndClose, depois que a pessoa já confirmou que quer
// descartar) — sem isso o painel de perfil não teria como fechar de
// verdade nem depois de confirmado, porque o guard rodaria de novo.
function hideOverlay(el, force) {
  // Painel de edição de perfil não fecha "de graça" com alteração
  // pendente — nem pelo X, nem pelo Esc (que também chama hideOverlay
  // direto) — sem confirmar que a pessoa realmente quer sair sem salvar.
  if (!force && el && el.id === "profile-panel" && isProfileDirty()) {
    openModal("profile-unsaved-modal");
    return;
  }
  el.classList.add("hidden");
  const idx = overlayStack.map(o => o.el).lastIndexOf(el);
  const entry = idx !== -1 ? overlayStack.splice(idx, 1)[0] : overlayStack.pop();
  const prev = entry && entry.prevFocus;
  if (prev && typeof prev.focus === "function" && document.body.contains(prev) && !prev.closest(".hidden")) {
    prev.focus({ preventScroll: true });
  }
}

// Esc fecha o overlay mais recente (modal, painel ou o pedido de permissão
// de microfone); Tab/Shift+Tab dentro de um overlay aberto fica preso nele
// (ciclo entre o primeiro e o último elemento focável), em vez de "vazar"
// para trás, para elementos da tela que estão cobertos mas ainda no DOM.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (activeDropdown) { closeDropdowns(); return; }
    const top = overlayStack[overlayStack.length - 1];
    if (top) { hideOverlay(top.el); return; }
    if (!screenAccountPicker.classList.contains("hidden") && !document.getElementById("account-picker-password-view").classList.contains("hidden")) {
      showAccountPickerList();
    }
    return;
  }
  if (e.key === "Tab") {
    const top = overlayStack[overlayStack.length - 1];
    if (!top) return;
    const focusables = getFocusableIn(top.el);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!top.el.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  }
});

function openPanel(id) {
  closeDropdowns();
  clearHomeSearch();
  if (id === "accounts-panel") { showAccountsList(); renderAccounts(); }
  if (id === "profile-panel") { refreshProfilePanelForRole(); snapshotProfileForEdit(); }
  showOverlay(document.getElementById(id));
}

function closePanel(id) {
  hideOverlay(document.getElementById(id));
}

// ── Avatar ─────────────────────────────────────
function setAvatarUI(dataUrl) {
  const big = document.getElementById("profile-avatar");
  const small = document.getElementById("profile-btn-avatar");
  const profileBtn = document.getElementById("profile-btn");
  if (dataUrl) {
    big.innerHTML = `<img src="${dataUrl}" alt="Foto de perfil"/>`;
    small.innerHTML = `<img src="${dataUrl}" alt="Foto de perfil"/>`;
    profileBtn.classList.add("has-avatar");
  } else {
    big.innerHTML = DEFAULT_AVATAR_SVG;
    small.innerHTML = DEFAULT_AVATAR_SVG;
    profileBtn.classList.remove("has-avatar");
  }
}

// Limite de tamanho para áudio de exercício (não dá pra comprimir de forma
// simples no navegador sem bibliotecas extras — só evita arquivos enormes).
const AUDIO_MAX_BYTES  = 3 * 1024 * 1024; // 3MB
// Foto de perfil: redimensionada e recomprimida antes de salvar, para não
// gravar fotos de celular (que podem passar de 10MB) inteiras no
// localStorage — que tem só alguns MB de cota por origem.
const AVATAR_MAX_DIM   = 256;
const AVATAR_QUALITY   = 0.82;

// Lê um arquivo de imagem, redimensiona (mantendo proporção) para no máximo
// AVATAR_MAX_DIM de largura/altura e reencoda como JPEG — reduz o peso de
// uma foto de celular de vários MB para tipicamente algumas dezenas de KB.
function compressImageFile(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("Falha ao ler o arquivo."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Não foi possível ler essa imagem."));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) { height = Math.round(height * (maxDim / width)); width = maxDim; }
          else { width = Math.round(width * (maxDim / height)); height = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  let dataUrl;
  try {
    dataUrl = await compressImageFile(file, AVATAR_MAX_DIM, AVATAR_QUALITY);
  } catch (e) {
    showToast("Não foi possível usar essa imagem como foto de perfil.", true);
    return;
  }
  // Só atualiza a pré-visualização e o rascunho — não grava nada ainda,
  // mesmo motivo de selectPresetAvatar: só "Salvar alterações" persiste.
  setAvatarUI(dataUrl);
  profileDraftAvatar = dataUrl;
  // Envio de foto agora é uma das opções dentro do mesmo painel de
  // "Foto de perfil" (junto com os ícones) — fecha ao concluir, igual
  // ao clicar num ícone predefinido (selectPresetAvatar).
  closePanel("avatar-picker-panel");
}

// ══════════════════════════════════════════════
// ÍCONES DE PERFIL PREDEFINIDOS
// ──────────────────────────────────────────────
// Lista de arquivos esperados dentro da pasta avatares/ — os 8 abaixo
// já existem (exemplos funcionais, validam a estrutura de ponta a
// ponta); para adicionar mais depois, basta soltar o arquivo em
// avatares/ e incluir o nome aqui. Guardado como CAMINHO (não base64,
// diferente da foto enviada pelo usuário) — bem mais leve no
// localStorage, e todo lugar que já exibe user.avatar via <img src>
// funciona sem nenhuma mudança.
// ══════════════════════════════════════════════
const PRESET_AVATARS = [
  "avatares/avatar-01.svg", "avatares/avatar-02.svg", "avatares/avatar-03.svg", "avatares/avatar-04.svg",
  "avatares/avatar-05.svg", "avatares/avatar-06.svg", "avatares/avatar-07.svg", "avatares/avatar-08.svg",
];

function openAvatarPicker() {
  const grid = document.getElementById("avatar-picker-grid");
  const users = getUsers();
  const user = sessionEmail ? users[sessionEmail] : null;
  const current = user ? user.avatar : null;
  grid.innerHTML = "";

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "avatar-picker-option avatar-picker-clear";
  clearBtn.setAttribute("aria-label", "Usar ícone padrão (sem foto nem ícone escolhido)");
  clearBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  clearBtn.onclick = () => selectPresetAvatar(null);
  grid.appendChild(clearBtn);

  PRESET_AVATARS.forEach(path => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "avatar-picker-option" + (current === path ? " selected" : "");
    btn.setAttribute("aria-label", "Usar este ícone como foto de perfil");
    btn.innerHTML = `<img src="${path}" alt=""/>`;
    btn.onclick = () => selectPresetAvatar(path);
    grid.appendChild(btn);
  });

  openPanel("avatar-picker-panel");
}

function selectPresetAvatar(path) {
  // Só atualiza a pré-visualização e o rascunho — não grava nada ainda.
  // A escolha só vira permanente ao clicar em "Salvar alterações" (ver
  // saveProfile) — sem isso, trocar a foto e sair sem salvar já deixava
  // a mudança valendo, tornando o botão de salvar inútil.
  setAvatarUI(path);
  profileDraftAvatar = path;
  closePanel("avatar-picker-panel");
}

// ── Editar perfil: rascunho não salvo ──────────
// Tirado toda vez que o painel de perfil abre (ver openPanel) — usado só
// pra saber se há alteração pendente (nome/telefone/bio/médico-crm/
// avatar) ao tentar sair sem clicar em "Salvar alterações".
let profileEditSnapshot = null;
// undefined = avatar não foi mexido nesta sessão de edição; null = "sem
// foto"/ícone padrão; string = caminho de ícone ou data URL de foto nova.
let profileDraftAvatar = undefined;

function snapshotProfileForEdit() {
  const users = getUsers();
  const user = sessionEmail ? users[sessionEmail] : null;
  profileDraftAvatar = undefined;
  profileEditSnapshot = user ? {
    name: user.name || "", phone: user.phone || "", bio: user.bio || "",
    doctor: user.doctor || "", crm: user.crm || "", avatar: user.avatar || null
  } : null;
}

function isProfileDirty() {
  const s = profileEditSnapshot;
  if (!s) return false;
  if (val("pf-name") !== s.name) return true;
  if (val("pf-phone") !== s.phone) return true;
  if (val("pf-bio") !== s.bio) return true;
  if (val("pf-doctor") !== s.doctor) return true;
  if (val("pf-crm") !== s.crm) return true;
  if (profileDraftAvatar !== undefined && profileDraftAvatar !== s.avatar) return true;
  return false;
}

// Botão "X" do painel de perfil — pede confirmação só se há algo pra
// perder; sem alteração nenhuma, fecha normalmente sem interromper.
function requestCloseProfilePanel() {
  if (isProfileDirty()) { openModal("profile-unsaved-modal"); return; }
  closePanel("profile-panel");
}
// "Sair sem salvar" no modal de confirmação — descarta o rascunho
// (inclusive a pré-visualização do avatar, que volta pro valor salvo) e
// só então fecha de fato o painel (force=true pula o guard de novo).
function discardProfileEditAndClose() {
  closeModal("profile-unsaved-modal");
  const s = profileEditSnapshot;
  if (s) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ""; };
    set("pf-name", s.name); set("pf-phone", s.phone); set("pf-bio", s.bio);
    set("pf-doctor", s.doctor); set("pf-crm", s.crm);
    setAvatarUI(s.avatar);
  }
  profileDraftAvatar = undefined;
  document.getElementById("pf-phone-error").classList.add("hidden");
  document.getElementById("pf-phone").classList.remove("input-error");
  document.getElementById("pf-crm-error").classList.add("hidden");
  hideOverlay(document.getElementById("profile-panel"), true);
}

// ── Editar perfil ─────────────────────────────
function refreshProfilePanelForRole() {
  const users = getUsers();
  const user = sessionEmail ? users[sessionEmail] : null;
  const isDoctor = user && user.role === "medico";
  document.getElementById("pf-patient-fields").classList.toggle("hidden", isDoctor);
  document.getElementById("pf-doctor-fields").classList.toggle("hidden", !isDoctor);
  document.getElementById("pf-role-badge").textContent = isDoctor ? "Fonoaudiólogo(a)" : "Paciente";
  document.getElementById("pf-role-badge").classList.toggle("role-badge-doctor", !!isDoctor);
  document.getElementById("pf-crm-error").classList.add("hidden");
  if (user) {
    document.getElementById("pf-account-id").value = user.accountId || "";
    document.getElementById("pf-crm").value = user.crm || "";
    document.getElementById("pf-level").value = levelLabel(computeLevel(user));
  }
}

// Guarda o timer do feedback "Copiado!" — clicar várias vezes seguidas
// reinicia o mesmo timer em vez de empilhar vários, que deixaria o
// texto/ícone piscando ou revertendo cedo demais (estados conflitantes).
let copyFeedbackTimer = null;
function copyAccountId() {
  const input = document.getElementById("pf-account-id");
  const btn = document.querySelector(".field-copy-btn");
  const feedback = document.getElementById("copy-feedback");
  if (!input.value) return;
  const showCopied = () => {
    clearTimeout(copyFeedbackTimer);
    btn.classList.add("copied");
    btn.querySelector(".copy-icon-default").classList.add("hidden");
    btn.querySelector(".copy-icon-done").classList.remove("hidden");
    if (feedback) { feedback.textContent = "Copiado!"; feedback.classList.add("show"); }
    copyFeedbackTimer = setTimeout(() => {
      btn.classList.remove("copied");
      btn.querySelector(".copy-icon-default").classList.remove("hidden");
      btn.querySelector(".copy-icon-done").classList.add("hidden");
      if (feedback) feedback.classList.remove("show");
    }, 1500);
  };
  // "Copiado!" só aparece quando a cópia realmente deu certo — o
  // fallback de execCommand devolve um booleano de sucesso que antes
  // era ignorado, mostrando sucesso mesmo quando a cópia falhava.
  const fallbackCopy = () => {
    input.select();
    const ok = document.execCommand("copy");
    if (ok) showCopied();
    else showToast("Não foi possível copiar o ID — selecione e copie manualmente.", true);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(input.value).then(showCopied).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
  playBeep(660, 0.08);
}

// Cada conta tem seus próprios dados — nada é herdado de outra conta.
// Preencher explicitamente TODOS os campos do painel (inclusive o recado
// pessoal) ao trocar de usuário evita que um valor digitado numa conta
// permaneça "esquecido" no formulário e seja salvo por engano na próxima.
function saveProfile() {
  const phone = val("pf-phone");
  const phoneError = document.getElementById("pf-phone-error");
  const phoneInput = document.getElementById("pf-phone");
  if (phone && !/^\(\d{2}\)\d \d{4}-\d{4}$/.test(phone)) {
    phoneError.classList.remove("hidden");
    phoneInput.classList.add("input-error");
    return;
  }
  phoneError.classList.add("hidden");
  phoneInput.classList.remove("input-error");

  if (!sessionEmail) { closePanel("profile-panel"); return; }
  const users = getUsers();
  const user = users[sessionEmail] || { email: sessionEmail };

  if (user.role === "medico") {
    const crmVal = val("pf-crm").trim();
    const crmError = document.getElementById("pf-crm-error");
    if (countDigits(crmVal) > 6) { crmError.classList.remove("hidden"); return; }
    crmError.classList.add("hidden");
    user.crm = crmVal;
  } else {
    user.doctor = val("pf-doctor");
  }

  user.name  = val("pf-name");
  user.phone = phone;
  user.bio   = val("pf-bio");
  // Avatar só é persistido aqui, no salvamento explícito — enquanto o
  // painel estava aberto, selectPresetAvatar/handleAvatarChange só
  // atualizavam a pré-visualização (profileDraftAvatar), nunca o storage.
  if (profileDraftAvatar !== undefined) user.avatar = profileDraftAvatar;
  // Se a gravação falhar (armazenamento cheio), não fecha o painel nem
  // toca o som de sucesso — o aviso de erro já apareceu (ver saveUsers),
  // e o paciente precisa perceber que precisa tentar de novo (ver T3).
  if (!saveUserRecords({ [sessionEmail]: user })) return;
  applyUserToUI(user);
  // Estado salvo agora é o novo "original" — fechar o painel logo em
  // seguida (ou reabrir sem mexer em nada) não deve mais ser tratado
  // como alteração pendente.
  snapshotProfileForEdit();
  playBeep(660, 0.1);
  hideOverlay(document.getElementById("profile-panel"), true);
}

// Ativa a barra de rolagem (altura fixa) só quando a lista realmente
// passa de 4 itens — conta os itens de verdade renderizados, em vez de
// estimar por altura em CSS (mais preciso: até 4 itens, nunca aparece
// nenhuma barra, nem cinza/fantasma).
function applyListScrollCap(listEl, threshold) {
  if (!listEl) return;
  listEl.classList.toggle("scroll-capped", listEl.children.length > (threshold || 4));
}

// ── Trocar de conta ───────────────────────────
function renderAccounts() {
  const list = document.getElementById("accounts-list");
  list.innerHTML = "";
  const users = getUsers();
  const current = sessionEmail ? users[sessionEmail] : null;

  if (current) {
    const item = document.createElement("div");
    item.className = "account-item current";
    item.innerHTML = `
      <div class="account-avatar">${current.avatar ? `<img src="${current.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}</div>
      <div class="account-info">
        <span class="account-name">${escapeHtml(current.name || current.email)} ${current.role === "medico" ? "🩺" : ""}</span>
        <span class="account-email">${escapeHtml(current.email)}</span>
      </div>
      <span class="account-current-tag">Atual</span>`;
    list.appendChild(item);
  }

  const others = Object.values(users).filter(u => u.email !== sessionEmail);
  others.forEach(acc => {
    const item = document.createElement("div");
    item.className = "account-item";
    item.onclick = () => selectAccountForSwitch(acc.email);
    item.setAttribute("aria-label", `Entrar na conta de ${acc.name || acc.email}`);
    makeKeyboardClickable(item);
    item.innerHTML = `
      <div class="account-avatar">${acc.avatar ? `<img src="${acc.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}</div>
      <div class="account-info">
        <span class="account-name">${escapeHtml(acc.name || acc.email)} ${acc.role === "medico" ? "🩺" : ""}</span>
        <span class="account-email">${escapeHtml(acc.email)}</span>
      </div>
      <button type="button" class="account-remove-btn" title="Remover conta deste dispositivo" aria-label="Remover ${escapeHtml(acc.name || acc.email)} deste dispositivo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
      </button>`;
    const removeBtn = item.querySelector(".account-remove-btn");
    removeBtn.onclick = (e) => { e.stopPropagation(); requestRemoveAccount(acc.email); };
    list.appendChild(item);
  });

  if (others.length === 0) {
    const empty = document.createElement("div");
    empty.className = "accounts-empty";
    empty.innerHTML = "Nenhuma outra conta logada ainda.<br>Adicione uma conta abaixo.";
    list.appendChild(empty);
  }
  applyListScrollCap(list);
}

function switchAccount(email) {
  const users = getUsers();
  const user = users[email];
  if (!user) return;
  sessionEmail = email;
  localStorage.setItem("vozativa_session_email", email);
  applyUserToUI(user);
  closePanel("accounts-panel");
  playBeep(620, 0.1);
}

// ── Trocar de conta exige a senha daquela conta específica ────────────
let accountSwitchTargetEmail = null;
function selectAccountForSwitch(email) {
  const users = getUsers();
  const acc = users[email];
  if (!acc) return;
  accountSwitchTargetEmail = email;
  document.getElementById("accounts-switch-avatar").innerHTML = acc.avatar ? `<img src="${acc.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG;
  document.getElementById("accounts-switch-name").textContent = acc.name || acc.email;
  document.getElementById("accounts-switch-password").value = "";
  hideAuthError("accounts-switch-error");
  document.getElementById("accounts-list-view").classList.add("hidden");
  const passwordView = document.getElementById("accounts-password-view");
  passwordView.classList.remove("hidden");
  focusFirstIn(passwordView);
}
function showAccountsList() {
  accountSwitchTargetEmail = null;
  document.getElementById("accounts-password-view").classList.add("hidden");
  const listView = document.getElementById("accounts-list-view");
  listView.classList.remove("hidden");
  focusFirstIn(listView);
}
// Confere e-mail/senha contra as contas salvas — os três fluxos de
// login do app (entrar, trocar de conta, escolher conta salva) faziam
// essa mesma checagem copiada e colada, só variando a mensagem de erro
// (login pede e-mail+senha; os outros dois já sabem o e-mail, só pedem
// a senha de novo).
async function authenticateUser(email, password, errorElId, wrongMessage) {
  const users = getUsers();
  const user = users[email];
  if (!user || !(await verifyPassword(password, user))) {
    showAuthError(errorElId, wrongMessage);
    return null;
  }
  return user;
}

async function handleAccountsSwitchLogin(e) {
  e.preventDefault();
  hideAuthError("accounts-switch-error");
  const user = await authenticateUser(accountSwitchTargetEmail, val("accounts-switch-password"), "accounts-switch-error", "Senha incorreta.");
  if (!user) return;
  accountSwitchTargetEmail = null;
  switchAccount(user.email);
}

function addAccount() {
  closePanel("accounts-panel");
  showOnlyScreen("auth");
  switchAuthTab("signup");
}

// ── Confirmação de ação destrutiva (excluir/remover) ──────────────────
// Os 5 fluxos de "pedir confirmação → excluir" do app (remover conta,
// remover amigo, excluir exercício, excluir vídeo de exercício físico,
// excluir fase) usavam cada um sua própria variável global só pra
// guardar o alvo pendente, repetindo o mesmo par declaração+atribuição
// cinco vezes — um único alvo compartilhado basta, já que só um modal
// de confirmação fica aberto por vez (são todos bloqueantes).
let pendingConfirmTarget = null;
function requestConfirmAction(target, modalId) {
  pendingConfirmTarget = target;
  openModal(modalId);
}

// ── Remover conta do dispositivo ──────────────
function removeAccountFromDevice(email) {
  const users = getUsers();
  const removedUser = users[email];
  const changed = { [email]: null };
  // limpa referências (vínculos médico-paciente, convites, amizades) que
  // apontavam para a conta removida — só as contas realmente afetadas
  // entram na gravação, para não sobrescrever outras contas à toa.
  Object.values(users).forEach(u => {
    if (u.email === email) return;
    const before = JSON.stringify(u);
    if (u.patients) u.patients = u.patients.filter(e => e !== email);
    if (u.linkedDoctors) u.linkedDoctors = u.linkedDoctors.filter(e => e !== email);
    if (u.sentInvites) u.sentInvites = u.sentInvites.filter(e => e !== email);
    if (u.pendingInvites) u.pendingInvites = u.pendingInvites.filter(i => i.doctorEmail !== email);
    if (u.friends) u.friends = u.friends.filter(e => e !== email);
    if (u.friendRequestsSent) u.friendRequestsSent = u.friendRequestsSent.filter(e => e !== email);
    if (u.friendRequestsReceived) u.friendRequestsReceived = u.friendRequestsReceived.filter(r => r.fromEmail !== email);
    if (JSON.stringify(u) !== before) changed[u.email] = u;
  });
  saveUserRecords(changed);
  // Nada da conta removida deve sobrar: mídia própria dela (vídeos de
  // exercício, áudio de revisão do médico) e toda conversa em que ela
  // participava — diferente de desfazer amizade (executeRemoveFriend),
  // que mantém o histórico intacto de propósito.
  if (removedUser) purgeUserOwnedMedia(removedUser);
  purgeChatsAndMediaFor(email);
}

// Apaga do IndexedDB toda mídia própria de um usuário sendo removido do
// dispositivo (vídeos de exercício físico do customContent, áudio de
// tentativas na fila de revisão do médico). Áudio de pronúncia
// personalizado (customContent.audio) é base64 embutido no próprio
// JSON do usuário, não um blob — some sozinho junto com o registro.
function purgeUserOwnedMedia(user) {
  const cc = user.customContent || {};
  (cc.physicalExercises || []).forEach(ex => { if (ex.mediaId) deleteMediaBlob(ex.mediaId); });
  const reviews = (user.progress && user.progress.reviews) || [];
  reviews.forEach(r => (r.attempts || []).forEach(a => { if (a.mediaId) deleteMediaBlob(a.mediaId); }));
}

// Apaga TODAS as conversas em que a conta removida participava, e cada
// blob de mídia (foto/vídeo/áudio) que elas continham — sem tocar em
// nenhuma conversa de outras contas. Só roda ao remover a conta do
// dispositivo; desfazer amizade não apaga a conversa (ver
// executeRemoveFriend).
function purgeChatsAndMediaFor(email) {
  const chats = getChats();
  let changed = false;
  Object.keys(chats).forEach(convId => {
    if (!convId.split("::").includes(email)) return;
    (chats[convId].messages || []).forEach(m => { if (m.mediaId) deleteMediaBlob(m.mediaId); });
    delete chats[convId];
    changed = true;
  });
  if (changed) {
    try { localStorage.setItem("vozativa_chats", JSON.stringify(chats)); } catch (e) {}
  }
}

// Sem argumento: remove a conta atualmente logada (usado pelo dropdown de perfil).
// Com e-mail: remove uma conta específica (usado na lista "Trocar de conta").
function requestRemoveAccount(email = sessionEmail) {
  if (!email) return;
  closeDropdowns();
  const users = getUsers();
  const user = users[email];
  const label = user ? (user.name || user.email) : email;
  document.getElementById("remove-account-question").textContent =
    `Remover a conta de ${label} deste dispositivo? Os dados salvos localmente serão apagados.`;
  requestConfirmAction(email, "remove-account-modal");
}

function executeRemoveAccount() {
  if (!pendingConfirmTarget) { closeModal("remove-account-modal"); return; }
  const accountPendingRemoval = pendingConfirmTarget;
  const removingCurrent = accountPendingRemoval === sessionEmail;
  removeAccountFromDevice(accountPendingRemoval);
  pendingConfirmTarget = null;
  closeModal("remove-account-modal");
  playBeep(300, 0.12);

  if (removingCurrent) {
    sessionEmail = null;
    localStorage.removeItem("vozativa_session_email");
    showOnlyScreen("auth");
    switchAuthTab("login");
  } else {
    renderAccounts();
  }
}

// ── Sair da conta ─────────────────────────────
function openModal(id) {
  closeDropdowns();
  showOverlay(document.getElementById(id));
}
function closeModal(id) {
  hideOverlay(document.getElementById(id));
}
function confirmLogout() {
  closeModal("logout-modal");
  if (isRecording) stopAudio();
  sessionEmail = null;
  localStorage.removeItem("vozativa_session_email");
  const users = getUsers();
  if (Object.keys(users).length) {
    openAccountPicker();
  } else {
    showOnlyScreen("auth");
    switchAuthTab("login");
  }
}

// ── Tela de seleção de conta (ao sair, com outras contas salvas) ──
let accountPickerEmail = null;
function openAccountPicker() {
  renderAccountPickerList();
  showAccountPickerList();
  showOnlyScreen("account-picker");
}
function renderAccountPickerList() {
  const list = document.getElementById("account-picker-list");
  list.innerHTML = "";
  const users = getUsers();
  Object.values(users).forEach(acc => {
    const item = document.createElement("div");
    item.className = "account-item";
    item.onclick = () => selectAccountForPicker(acc.email);
    item.setAttribute("aria-label", `Entrar na conta de ${acc.name || acc.email}`);
    makeKeyboardClickable(item);
    item.innerHTML = `
      <div class="account-avatar">${acc.avatar ? `<img src="${acc.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}</div>
      <div class="account-info">
        <span class="account-name">${escapeHtml(acc.name || acc.email)} ${acc.role === "medico" ? "🩺" : ""}</span>
        <span class="account-email">${escapeHtml(acc.email)}</span>
      </div>`;
    list.appendChild(item);
  });
  applyListScrollCap(list);
}
function selectAccountForPicker(email) {
  const users = getUsers();
  const acc = users[email];
  if (!acc) return;
  accountPickerEmail = email;
  document.getElementById("account-picker-avatar").innerHTML = acc.avatar ? `<img src="${acc.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG;
  document.getElementById("account-picker-name").textContent = acc.name || acc.email;
  document.getElementById("account-picker-password").value = "";
  hideAuthError("account-picker-error");
  document.getElementById("account-picker-list-view").classList.add("hidden");
  document.getElementById("account-picker-password-view").classList.remove("hidden");
}
function showAccountPickerList() {
  accountPickerEmail = null;
  document.getElementById("account-picker-password-view").classList.add("hidden");
  document.getElementById("account-picker-list-view").classList.remove("hidden");
}
function goToFreshLogin() {
  showOnlyScreen("auth");
  switchAuthTab("login");
}
async function handleAccountPickerLogin(e) {
  e.preventDefault();
  hideAuthError("account-picker-error");
  const email = accountPickerEmail;
  const user = await authenticateUser(email, val("account-picker-password"), "account-picker-error", "Senha incorreta.");
  if (!user) return;
  accountPickerEmail = null;
  enterSessionAsUser(email, user, "account-picker-password-view");
}

// ══════════════════════════════════════════════
// SAIR DO APP (botão "Sair" na home)
// ══════════════════════════════════════════════
function exitApp() {
  openModal("exit-modal");
}
function cancelExit() {
  closeModal("exit-modal");
}
function confirmExit() {
  window.close();
  document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100dvh;font-family:'Karla',sans-serif;color:#5a7a64;font-size:1.05rem;text-align:center;padding:24px;">Você pode fechar esta aba com segurança.</div>`;
}

// ══════════════════════════════════════════════
// AUTENTICAÇÃO (login / cadastro)
// ══════════════════════════════════════════════
let sessionEmail = null;
let signupRole = "paciente";

function getUsers() {
  try { return JSON.parse(localStorage.getItem("vozativa_users")) || {}; }
  catch(e) { return {}; }
}
// Grava a coleção inteira de contas. Trata erro de cota do localStorage
// (armazenamento cheio) mostrando um aviso em vez de falhar em silêncio —
// antes, qualquer ação de salvar simplesmente quebrava sem nenhum retorno
// ao usuário quando o dispositivo ficava sem espaço. Devolve true/false
// para quem quiser reagir à falha.
function saveUsers(users) {
  try {
    localStorage.setItem("vozativa_users", JSON.stringify(users));
    return true;
  } catch (e) {
    console.error("Falha ao salvar dados do VozAtiva:", e);
    showToast("Não foi possível salvar: armazenamento do dispositivo está cheio.", true);
    return false;
  }
}
// Grava só as contas informadas (por e-mail), mesclando com a versão MAIS
// RECENTE já salva no localStorage — assim uma alteração feita em outra aba
// entre a leitura e esta gravação não é apagada por engano. Use isto em vez
// de saveUsers(getUsers()-inteiro) sempre que a ação só precisa alterar
// contas específicas (o caso comum). Para remover uma conta, passe null.
function saveUserRecords(records) {
  const fresh = getUsers();
  Object.keys(records).forEach(email => {
    if (records[email] === null) delete fresh[email];
    else fresh[email] = records[email];
  });
  return saveUsers(fresh);
}

// Sincronização entre abas: quando outra aba grava vozativa_users (ou troca
// de sessão), esta aba refaz a renderização da tela atual com os dados mais
// recentes, em vez de continuar mostrando um estado desatualizado ou
// arriscar sobrescrevê-lo com uma gravação baseada em dados velhos.
window.addEventListener("storage", (e) => {
  if (e.key === "vozativa_chats") {
    if (!sessionEmail) return;
    const users = getUsers();
    const me = users[sessionEmail];
    if (!me) return;
    updateChatBadge(me);
    updateRemindersBadge(me);
    if (!document.getElementById("chat-list-panel").classList.contains("hidden")) renderChatList();
    if (!document.getElementById("chat-thread-panel").classList.contains("hidden") && activeChatContact) {
      markConversationRead(chatConversationId(sessionEmail, activeChatContact), sessionEmail);
      renderChatThread();
    }
    if (!document.getElementById("reminders-panel").classList.contains("hidden")) renderRemindersPanel();
    return;
  }
  if (e.key !== "vozativa_users" && e.key !== "vozativa_session_email") return;
  if (!sessionEmail) return;
  const users = getUsers();
  if (!users[sessionEmail]) return; // conta atual foi removida em outra aba
  if (!screenHome.classList.contains("hidden")) { applyUserToUI(users[sessionEmail]); checkPendingInvites(); }
  if (!screenPath.classList.contains("hidden")) renderPathTree();
  if (!screenDoctor.classList.contains("hidden") && document.getElementById("doctor-list-view") && !document.getElementById("doctor-list-view").classList.contains("hidden")) renderPatientsList();
  if (!document.getElementById("friends-panel").classList.contains("hidden")) renderFriendsPanel();
  if (!document.getElementById("accounts-panel").classList.contains("hidden")) renderAccounts();
});

function getProgress(user) {
  if (!user.progress) user.progress = { completedGroupIds: [], attempts: {} };
  if (!user.progress.completedGroupIds) user.progress.completedGroupIds = [];
  if (!user.progress.attempts) user.progress.attempts = {};
  if (!user.progress.streak) user.progress.streak = 0;
  if (!user.progress.lastTrainedDate) user.progress.lastTrainedDate = null;
  // Fila de aprovação do médico (ver registerPhaseReview) — uma entrada
  // por fase concluída, com as tentativas gravadas daquela fase.
  if (!user.progress.reviews) user.progress.reviews = [];
  // Melhor % de acerto já alcançado em cada fase (groupId -> scorePct) —
  // usado só pro RANKING (ver computeRankingScore), pra repetir uma fase
  // fácil várias vezes não inflar a posição no ranking: cada fase conta
  // uma única vez, pelo seu melhor resultado, não por tentativa. As
  // estatísticas clínicas do médico (computePatientStats) continuam
  // olhando todas as tentativas — repetição ali é informação legítima
  // (ver G2 na auditoria).
  if (!user.progress.groupBestScore) user.progress.groupBestScore = {};
  // Fonemas rejeitados pelo médico (ver setReviewStatus) que precisam
  // ser retreinados — populam o nível extra "Revisão" fora da trilha
  // principal (ver G3 na auditoria).
  if (!user.progress.rejectedFonemas) user.progress.rejectedFonemas = [];
  // Fases/exercícios que o médico marcou manualmente como "repita" —
  // independente de reprovação formal (ver configurável por médico).
  if (!user.progress.repeatRequested) user.progress.repeatRequested = [];
  return user.progress;
}

// Pontuação usada SÓ no ranking de amigos — nunca inflada por repetir a
// mesma fase fácil várias vezes (ver G2): cada fase conta uma única vez,
// pelo melhor resultado já obtido nela, não por tentativa. Segmentado
// por nível (ver computeLevel) antes de comparar pontuação, pra um
// iniciante com 1-2 fases fáceis não aparecer acima de quem está muito
// mais avançado no tratamento (ver G7).
const LEVEL_RANK = { iniciante: 0, intermediario: 1, avancado: 2 };
function computeRankingScore(user) {
  const best = (user.progress && user.progress.groupBestScore) || {};
  const scores = Object.values(best);
  const avgBestScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const groupsDone = ((user.progress && user.progress.completedGroupIds) || []).length;
  return { levelRank: LEVEL_RANK[computeLevel(user)] || 0, avgBestScore, groupsDone };
}

// ── Sequência diária (streak) ──────────────────
// Mecânica leve e funcional (inspirada no Duolingo): incentiva a prática
// diária, que é justamente o que sustenta resultado real num tratamento
// fonoaudiológico. Conta no máximo uma vez por dia — completar várias
// fases no mesmo dia não infla o número, e faltar um dia reinicia a
// contagem para 1 no próximo treino (sem zerar de forma punitiva: o dia
// de hoje já conta como o novo começo).
function todayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function offsetDateString(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function registerStreakForToday(progress) {
  const today = todayDateString();
  if (progress.lastTrainedDate === today) return false; // já contou hoje
  progress.streak = progress.lastTrainedDate === offsetDateString(-1) ? (progress.streak || 0) + 1 : 1;
  progress.lastTrainedDate = today;
  return true;
}

// ID da conta: 4 dígitos totalmente aleatórios (0-9), únicos entre todas as
// contas (médico ou paciente) — não segue nenhuma sequência ou lógica.
function generateAccountId(users) {
  let id;
  do { id = String(Math.floor(Math.random() * 10000)).padStart(4, "0"); }
  while (Object.values(users).some(u => u.accountId === id));
  return id;
}

// Garante que TODA conta salva tenha um ID único de 4 dígitos, inclusive
// contas criadas antes desse recurso existir (que ficariam sem ID).
function migrateAccountIds() {
  const users = getUsers();
  let changed = false;
  Object.values(users).forEach(u => {
    if (!u.accountId || !/^\d{4}$/.test(u.accountId)) {
      u.accountId = generateAccountId(users);
      changed = true;
    }
  });
  if (changed) saveUsers(users);
}

// Conta fixa de administrador para demonstração (admin@admin / 123456),
// com acesso irrestrito à trilha — ver isCurrentUserAdmin, isGroupUnlocked
// e skipChallenge. É uma conta do tipo "paciente" normal (progride pela
// trilha como qualquer paciente), só que sem os bloqueios de pré-requisito
// e sem limite de pulos. Criada uma única vez, no primeiro carregamento do
// app neste dispositivo; se a conta já existir, só garante que o selo
// isAdmin continue marcado (ex.: caso alguém tenha restaurado um backup
// antigo dos dados sem esse campo).
async function ensureAdminAccount() {
  const users = getUsers();
  const existing = users["admin@admin"];
  if (existing) {
    if (!existing.isAdmin) saveUserRecords({ "admin@admin": { ...existing, isAdmin: true } });
    return;
  }
  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword("123456", passwordSalt);
  saveUserRecords({
    "admin@admin": {
      name: "Administrador", email: "admin@admin", passwordHash, passwordSalt,
      phone: "", avatar: null, bio: "",
      role: "paciente", isAdmin: true,
      progress: { completedGroupIds: [], attempts: {} },
      accountId: generateAccountId(users), welcomeSeen: false,
      doctor: "", linkedDoctors: [], pendingInvites: [], friends: [],
      friendRequestsSent: [], friendRequestsReceived: [],
      customContent: { groups: [], exercises: [], dicas: {}, audio: {}, groupOrder: [], physicalExercises: [] },
    },
  });
}

function setSignupRole(role) {
  signupRole = role;
  document.getElementById("role-btn-paciente").classList.toggle("active", role === "paciente");
  document.getElementById("role-btn-medico").classList.toggle("active", role === "medico");
  document.getElementById("signup-patient-fields").classList.toggle("hidden", role !== "paciente");
  document.getElementById("signup-doctor-fields").classList.toggle("hidden", role !== "medico");
}

function switchAuthTab(tab) {
  const isLogin = tab === "login";
  document.getElementById("tab-login").classList.toggle("active", isLogin);
  document.getElementById("tab-signup").classList.toggle("active", !isLogin);
  // Os dois formulários ficam empilhados na mesma célula de grid (ver
  // .auth-forms-stack no CSS) e alternam por visibility, não display —
  // assim o card sempre reserva a altura do MAIOR dos dois, e trocar de
  // aba nunca muda a altura total nem recentraliza o logo acima dele.
  document.getElementById("login-form").classList.toggle("auth-form-inactive", !isLogin);
  document.getElementById("signup-form").classList.toggle("auth-form-inactive", isLogin);
  hideAuthError("login-error");
  hideAuthError("signup-error");
}

function showAuthError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove("hidden");
}
function hideAuthError(id) {
  document.getElementById(id).classList.add("hidden");
}

// Formato (XX)X XXXX-XXXX
function formatPhoneInput(e) {
  const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
  let out = "";
  if (digits.length > 0) out += "(" + digits.slice(0, Math.min(2, digits.length));
  if (digits.length >= 2) out += ")";
  if (digits.length > 2) out += digits.slice(2, Math.min(3, digits.length));
  if (digits.length > 3) out += " " + digits.slice(3, Math.min(7, digits.length));
  if (digits.length > 7) out += "-" + digits.slice(7, 11);
  e.target.value = out;
}

function formatAccountIdInput(e) {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
}

function formatCrmInput(e) {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
}

// Entra de fato na sessão de um usuário já autenticado — compartilhado
// entre login normal e escolha de conta salva (troca de conta usa
// switchAccount, que tem navegação diferente de propósito: volta pro
// painel de contas em vez de ir pra home).
function enterSessionAsUser(email, user, formIdToReset) {
  sessionEmail = email;
  localStorage.setItem("vozativa_session_email", email);
  applyUserToUI(user);
  const form = document.getElementById(formIdToReset);
  if (form) form.reset();
  playBeep(660, 0.12);
  showOnlyScreen("home");
  maybeStartHomeTour();
}

async function handleLogin(e) {
  e.preventDefault();
  hideAuthError("login-error");
  const email = val("login-email").trim().toLowerCase();
  const user = await authenticateUser(email, val("login-password"), "login-error", "E-mail ou senha incorretos.");
  if (!user) return;
  enterSessionAsUser(email, user, "login-form");
}

async function handleSignup(e) {
  e.preventDefault();
  hideAuthError("signup-error");
  const name   = val("signup-name").trim();
  const email  = val("signup-email").trim().toLowerCase();
  const pass   = val("signup-password");
  const pass2  = val("signup-password2");
  const phone  = val("signup-phone");

  if (!name || !email) { showAuthError("signup-error", "Preencha nome e e-mail."); return; }
  if (pass.length < 5) { showAuthError("signup-error", "A senha deve ter ao menos 5 caracteres."); return; }
  if (pass !== pass2) { showAuthError("signup-error", "As senhas não coincidem."); return; }
  if (phone && !/^\(\d{2}\)\d \d{4}-\d{4}$/.test(phone)) { showAuthError("signup-error", "Telefone inválido. Use o formato (XX)X XXXX-XXXX."); return; }

  let crmVal = "";
  if (signupRole === "medico") {
    crmVal = val("signup-crm").trim();
    if (countDigits(crmVal) > 6) { showAuthError("signup-error", "Registro profissional deve ter no máximo 6 dígitos."); return; }
  }

  const users = getUsers();
  if (users[email]) { showAuthError("signup-error", "Já existe uma conta com este e-mail."); return; }

  // Cada conta começa 100% em branco — nenhum campo herda valor de outra conta.
  // A senha nunca é gravada em texto puro — só o hash + sal (ver seção
  // "SENHA — hash" acima).
  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(pass, passwordSalt);
  const base = {
    name, email, passwordHash, passwordSalt, phone, avatar: null, bio: "",
    role: signupRole, progress: { completedGroupIds: [], attempts: {} },
    accountId: generateAccountId(users), welcomeSeen: false,
  };
  if (signupRole === "medico") {
    base.crm = crmVal;
    base.patients = [];
    base.sentInvites = [];
  } else {
    base.doctor = val("signup-doctor").trim();
    base.linkedDoctors = [];
    base.pendingInvites = [];
    base.friends = [];
    base.friendRequestsSent = [];
    base.friendRequestsReceived = [];
    base.customContent = { groups: [], exercises: [], dicas: {}, audio: {}, groupOrder: [], physicalExercises: [] };
  }

  saveUserRecords({ [email]: base });
  sessionEmail = email;
  localStorage.setItem("vozativa_session_email", email);
  applyUserToUI(base);
  document.getElementById("signup-form").reset();
  setSignupRole("paciente");
  playBeep(660, 0.12);
  showOnlyScreen("home");
  maybeStartHomeTour();
}

// Preenche TODOS os campos do perfil a partir do usuário informado — nunca
// deixa um campo (como o recado pessoal) com o valor deixado por outra conta.
function applyUserToUI(user) {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ""; };
  set("pf-name", user.name);
  set("pf-email", user.email);
  set("pf-phone", user.phone);
  set("pf-doctor", user.doctor);
  set("pf-crm", user.crm);
  set("pf-bio", user.bio);
  setAvatarUI(user.avatar || null);

  setActiveContent(user.role === "paciente" ? user : null);
  updateFriendsBadge(user.role === "paciente" ? user : null);
  updateChatBadge(user);
  updateRemindersBadge(user);

  const greeting = document.getElementById("home-greeting");
  if (greeting) greeting.textContent = user.name ? `Olá, ${user.name.split(" ")[0]}!` : "";

  // Nome ao lado do ícone de perfil no cabeçalho — mesmo padrão em toda
  // tela onde esse ícone aparece (hoje, a tela inicial).
  const profileBtnName = document.getElementById("profile-btn-name");
  const profileBtn = document.getElementById("profile-btn");
  const firstName = user.name ? user.name.split(" ")[0] : "";
  if (profileBtnName) profileBtnName.textContent = firstName;
  if (profileBtn) profileBtn.setAttribute("aria-label", firstName ? `Perfil de ${firstName}` : "Perfil");

  const isDoctor = user.role === "medico";
  const patientsBtn = document.getElementById("patients-btn");
  if (patientsBtn) patientsBtn.classList.toggle("hidden", !isDoctor);
  const friendsBtn = document.getElementById("friends-btn");
  if (friendsBtn) friendsBtn.classList.toggle("hidden", isDoctor);
  const physicalExBtn = document.getElementById("physical-exercises-btn");
  if (physicalExBtn) physicalExBtn.classList.toggle("hidden", isDoctor);

  const startBtn = document.getElementById("home-start-btn");
  if (startBtn) {
    if (isDoctor) {
      startBtn.textContent = "Painel do Médico";
      startBtn.onclick = openDoctorScreen;
    } else {
      startBtn.textContent = "Iniciar tarefa diária";
      startBtn.onclick = () => goToPath(true);
    }
  }
  updateHomeTagline();
  refreshProfilePanelForRole();
  checkPendingInvites();
  updateStreakBadge(isDoctor ? null : user);
  // Boas-vindas aparecem uma única vez por conta, antes de qualquer outra
  // coisa — inclusive antes do pedido de permissão de microfone, que só é
  // disparado depois que a pessoa fecha as boas-vindas (ver
  // closeWelcomeOverlay). Só paciente treina fonemas — médico nunca
  // precisa de microfone.
  const welcomeShown = maybeShowWelcome(user);
  if (!welcomeShown && !isDoctor) bootstrapMicPermission();
}

// Sequência de dias treinando — mecânica leve inspirada no Duolingo, que
// existe para incentivar a prática diária (o que de fato sustenta
// resultado num tratamento fonoaudiológico), não como decoração.
function updateStreakBadge(user) {
  const badge = document.getElementById("streak-badge");
  if (!badge) return;
  const streak = user ? getProgress(user).streak : 0;
  badge.classList.toggle("hidden", !streak);
  if (streak) {
    document.getElementById("streak-count").textContent = streak;
    document.getElementById("streak-label").textContent = streak === 1 ? "dia seguido" : "dias seguidos";
  }
  updateDailyGoalBadge(user);
}

// Objetivo diário — mecânica NOVA (não existia antes do redesign):
// diz, sem culpa nem alarme, se o treino de hoje já aconteceu. Reaproveita
// o mesmo dado que já sustenta a sequência (progress.lastTrainedDate), sem
// precisar de nenhum rastreamento novo. Decisão deliberada de manter o tom
// sempre positivo mesmo no estado "pendente" ("Ainda dá tempo!", nunca
// "Você ainda não treinou hoje ⚠") — objetivo diário deve convidar, não
// cobrar; castigar quem abre o app sem ainda ter treinado é o tipo de
// mecânica agressiva que o projeto decidiu não ter.
function updateDailyGoalBadge(user) {
  const el = document.getElementById("daily-goal-badge");
  if (!el) return;
  if (!user) { el.classList.add("hidden"); return; }
  el.classList.remove("hidden");
  const done = getProgress(user).lastTrainedDate === todayDateString();
  el.classList.toggle("done", done);
  el.querySelector(".daily-goal-text").textContent = done
    ? "Meta de hoje cumprida!"
    : "Ainda dá tempo de treinar hoje";
}

// Muda toda vez que a tela inicial é exibida (médico mantém uma frase fixa).
function updateHomeTagline() {
  const tagline = document.getElementById("home-tagline");
  if (!tagline || !sessionEmail) return;
  const users = getUsers();
  const user = users[sessionEmail];
  if (!user) return;
  tagline.textContent = user.role === "medico"
    ? "Acompanhe o progresso dos seus pacientes"
    : randomHomeTagline();
}

// A tela de Entrar/Criar conta é sempre a primeira exibida ao abrir o
// app — mesmo havendo uma sessão salva de uma visita anterior, ela não
// é mais usada para pular direto pra tela inicial. Os dados da sessão
// salva continuam intactos no localStorage (nada foi apagado), só
// deixaram de ser usados para saltar a tela de autenticação no boot.
function initAuthUI() {
  showOnlyScreen("auth");
}

// ══════════════════════════════════════════════
// BUSCA (somente na tela inicial) — médico busca
// pacientes vinculados; paciente busca e adiciona amigos
// ══════════════════════════════════════════════
function renderHomeSearchResults() {
  const input = document.getElementById("home-search-input");
  const wrap = document.getElementById("home-search-results");
  if (!input || !wrap || !sessionEmail) return;
  const query = input.value.trim().toLowerCase();
  wrap.innerHTML = "";
  if (!query) { wrap.classList.add("hidden"); return; }

  const users = getUsers();
  const me = users[sessionEmail];
  if (!me) return;
  wrap.classList.remove("hidden");

  const showNoResults = () => { wrap.innerHTML = `<div class="search-no-results">Nenhum resultado encontrado para "${escapeHtml(input.value.trim())}".</div>`; };

  if (me.role === "medico") {
    const matches = (me.patients || [])
      .map(email => users[email]).filter(Boolean)
      .filter(p => p.name.toLowerCase().includes(query) || (p.accountId || "").includes(query));
    if (!matches.length) { showNoResults(); return; }
    matches.forEach(p => {
      const row = document.createElement("div");
      row.className = "search-result-row";
      row.innerHTML = `
        <div class="patient-card-avatar">${p.avatar ? `<img src="${p.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}</div>
        <div class="patient-card-info"><span class="patient-card-name">${escapeHtml(p.name)}</span><span class="patient-card-meta">ID ${escapeHtml(p.accountId)}</span></div>`;
      row.onclick = () => { openDoctorScreen(); openPatientDetail(p.email); };
      row.setAttribute("aria-label", `Abrir perfil de ${p.name}`);
      makeKeyboardClickable(row);
      wrap.appendChild(row);
    });
  } else {
    const matches = Object.values(users)
      .filter(u => u.role === "paciente" && u.email !== sessionEmail)
      .filter(p => p.name.toLowerCase().includes(query) || (p.accountId || "").includes(query))
      .slice(0, 8);
    if (!matches.length) { showNoResults(); return; }
    matches.forEach(p => {
      const isFriend = (me.friends || []).includes(p.email);
      const isPending = (me.friendRequestsSent || []).includes(p.email);
      const row = document.createElement("div");
      row.className = "search-result-row";
      row.innerHTML = `
        <div class="patient-card-avatar">${p.avatar ? `<img src="${p.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}</div>
        <div class="patient-card-info"><span class="patient-card-name">${escapeHtml(p.name)}</span><span class="patient-card-meta">ID ${escapeHtml(p.accountId)}</span></div>
        <button type="button" class="search-result-add-btn"${isFriend || isPending ? " disabled" : ""}>${isFriend ? "Amigo" : isPending ? "Pendente" : "Adicionar"}</button>`;
      if (!isFriend && !isPending) {
        row.querySelector(".search-result-add-btn").onclick = (e) => { e.stopPropagation(); sendFriendRequest(p.email); clearHomeSearch(); };
      }
      row.onclick = () => openPublicProfile(p.email);
      row.setAttribute("aria-label", `Ver perfil de ${p.name}`);
      makeKeyboardClickable(row);
      wrap.appendChild(row);
    });
  }
}

// ══════════════════════════════════════════════
// AMIGOS (paciente ↔ paciente)
// ══════════════════════════════════════════════
function sendFriendRequest(toEmail) {
  if (!sessionEmail || toEmail === sessionEmail) return;
  const users = getUsers();
  const me = users[sessionEmail];
  const other = users[toEmail];
  if (!me || !other || other.role !== "paciente") return;
  if (!me.friendRequestsSent) me.friendRequestsSent = [];
  if (!me.friends) me.friends = [];
  if (!other.friendRequestsReceived) other.friendRequestsReceived = [];
  if (me.friends.includes(toEmail) || me.friendRequestsSent.includes(toEmail)) return;
  if (other.friendRequestsReceived.some(r => r.fromEmail === sessionEmail)) return;

  other.friendRequestsReceived.push({ fromEmail: sessionEmail, fromName: me.name, sentAt: Date.now() });
  me.friendRequestsSent.push(toEmail);
  if (!saveUserRecords({ [sessionEmail]: me, [toEmail]: other })) return;
  playBeep(660, 0.1);
  renderHomeSearchResults();
}

// ══════════════════════════════════════════════
// PERFIL PÚBLICO — aberto ao clicar num resultado de busca (nunca
// mostra e-mail, telefone ou qualquer outro dado privado, só o que é
// necessário pra decidir se quer adicionar como amigo).
// ══════════════════════════════════════════════
function publicProfileActionState(me, p) {
  const isFriend = (me.friends || []).includes(p.email);
  const isPending = (me.friendRequestsSent || []).includes(p.email);
  if (isFriend) return { label: "Já são amigos", disabled: true };
  if (isPending) return { label: "Solicitação enviada", disabled: true };
  return { label: "Adicionar como amigo", disabled: false };
}
function openPublicProfile(email) {
  const users = getUsers();
  const me = users[sessionEmail];
  const p = users[email];
  if (!me || !p || email === sessionEmail) return;

  document.getElementById("public-profile-avatar").innerHTML = p.avatar ? `<img src="${p.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG;
  document.getElementById("public-profile-name").textContent = p.name;
  document.getElementById("public-profile-id").textContent = p.accountId || "—";
  document.getElementById("public-profile-level").textContent = levelLabel(computeLevel(p));
  const roleBadge = document.getElementById("public-profile-role");
  roleBadge.textContent = p.role === "medico" ? "Fonoaudiólogo(a)" : "Paciente";
  roleBadge.classList.toggle("role-badge-doctor", p.role === "medico");

  const actionBtn = document.getElementById("public-profile-action-btn");
  if (p.role === "medico") {
    // Perfil de médico encontrado pela busca (não deveria acontecer no
    // fluxo normal de paciente, mas por segurança não oferece "amizade"
    // a uma conta que não é de paciente).
    actionBtn.classList.add("hidden");
  } else {
    actionBtn.classList.remove("hidden");
    const state = publicProfileActionState(me, p);
    actionBtn.textContent = state.label;
    actionBtn.disabled = state.disabled;
    actionBtn.onclick = () => {
      sendFriendRequest(email);
      const refreshed = publicProfileActionState(getUsers()[sessionEmail], users[email]);
      actionBtn.textContent = refreshed.label;
      actionBtn.disabled = refreshed.disabled;
      renderFriendsPanel();
      renderFriendsAddResults();
    };
  }
  openPanel("public-profile-panel");
}

function respondFriendRequest(fromEmail, accept) {
  const users = getUsers();
  const me = users[sessionEmail];
  if (!me) return;
  const other = users[fromEmail];
  // Limpa o pedido nos DOIS sentidos, não só no que foi respondido — se
  // as duas contas se convidaram quase ao mesmo tempo (uma antes de ver
  // o convite da outra), aceitar ou recusar um lado deixava o outro
  // sentido "pendente" pra sempre, mesmo já sendo amigos (ou já tendo
  // recusado). Ver correção do pedido fantasma.
  me.friendRequestsReceived = (me.friendRequestsReceived || []).filter(r => r.fromEmail !== fromEmail);
  me.friendRequestsSent = (me.friendRequestsSent || []).filter(e => e !== fromEmail);
  if (other) {
    other.friendRequestsSent = (other.friendRequestsSent || []).filter(e => e !== sessionEmail);
    other.friendRequestsReceived = (other.friendRequestsReceived || []).filter(r => r.fromEmail !== sessionEmail);
  }

  if (accept) {
    if (!me.friends) me.friends = [];
    if (!me.friends.includes(fromEmail)) me.friends.push(fromEmail);
    if (other) {
      if (!other.friends) other.friends = [];
      if (!other.friends.includes(sessionEmail)) other.friends.push(sessionEmail);
    }
    playBeep(660, 0.12);
    showToast(`Você e ${other ? other.name : "seu amigo"} agora são amigos!`);
  } else {
    playBeep(300, 0.1);
  }
  const changed = { [sessionEmail]: me };
  if (other) changed[fromEmail] = other;
  saveUserRecords(changed);
  renderFriendsPanel();
}

// ── Remover amigo ──────────────────────────────
function requestRemoveFriend(email) {
  const users = getUsers();
  const p = users[email];
  document.getElementById("remove-friend-question").textContent =
    `Remover ${p ? p.name : "este amigo"} da sua lista de amigos?`;
  requestConfirmAction(email, "remove-friend-modal");
}
function executeRemoveFriend() {
  if (!pendingConfirmTarget) { closeModal("remove-friend-modal"); return; }
  const friendPendingRemoval = pendingConfirmTarget;
  const users = getUsers();
  const me = users[sessionEmail];
  const other = users[friendPendingRemoval];
  if (me && me.friends) me.friends = me.friends.filter(e => e !== friendPendingRemoval);
  if (other && other.friends) other.friends = other.friends.filter(e => e !== sessionEmail);
  const changed = {};
  if (me) changed[sessionEmail] = me;
  if (other) changed[friendPendingRemoval] = other;
  if (!saveUserRecords(changed)) return;
  pendingConfirmTarget = null;
  closeModal("remove-friend-modal");
  playBeep(300, 0.1);
  renderFriendsPanel();
}

// Bolinha vermelha no ícone "Amigos" quando há pedido de amizade
// pendente aguardando aprovação.
function updateFriendsBadge(user) {
  const dot = document.getElementById("friends-badge-dot");
  if (!dot) return;
  const hasPending = !!(user && user.friendRequestsReceived && user.friendRequestsReceived.length);
  dot.classList.toggle("hidden", !hasPending);
}

// Mensagem rápida e curta no rodapé da tela, usada para confirmações
// leves (ex.: "agora são amigos").
let toastTimer = null;
// isError=true faz o aviso ficar na tela até a pessoa clicar "OK,
// entendi" — usado pra mensagens de erro de verdade (armazenamento
// cheio, microfone bloqueado, limite atingido), que não podem só
// piscar e sumir sozinhas sem garantia nenhuma de que foram lidas.
function showToast(message, isError) {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    document.body.appendChild(toast);
  }
  clearTimeout(toastTimer);
  toast.className = "app-toast" + (isError ? " app-toast-error" : "");
  toast.setAttribute("role", isError ? "alert" : "status");
  toast.setAttribute("aria-live", isError ? "assertive" : "polite");
  if (isError) {
    toast.innerHTML = `<span class="app-toast-msg"></span><button type="button" class="app-toast-close">OK, entendi</button>`;
    toast.querySelector(".app-toast-msg").textContent = message;
    toast.querySelector(".app-toast-close").onclick = () => toast.classList.remove("show");
  } else {
    toast.textContent = message;
  }
  toast.classList.remove("show");
  void toast.offsetWidth; // força reflow para reiniciar a transição
  toast.classList.add("show");
  if (!isError) toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function openFriendsPanel() {
  clearHomeSearch();
  renderFriendsPanel();
  closeFriendsAddSection();
  openPanel("friends-panel");
}

// Busca e adição de amigos direto da aba Amigos (botão "+" no
// cabeçalho) — mesma lógica de busca por nome/ID já usada na tela
// inicial, sem precisar sair do painel.
function toggleFriendsAddSection() {
  const section = document.getElementById("friends-add-section");
  const btn = document.getElementById("friends-add-toggle-btn");
  const isOpen = !section.classList.contains("hidden");
  if (isOpen) { closeFriendsAddSection(); return; }
  section.classList.remove("hidden");
  btn.classList.add("active");
  btn.setAttribute("aria-expanded", "true");
  const input = document.getElementById("friends-add-input");
  if (input) { input.value = ""; input.focus(); }
  document.getElementById("friends-add-results").classList.add("hidden");
}
function closeFriendsAddSection() {
  const section = document.getElementById("friends-add-section");
  const btn = document.getElementById("friends-add-toggle-btn");
  if (!section) return;
  section.classList.add("hidden");
  btn.classList.remove("active");
  btn.setAttribute("aria-expanded", "false");
}
function renderFriendsAddResults() {
  const input = document.getElementById("friends-add-input");
  const wrap = document.getElementById("friends-add-results");
  if (!input || !wrap || !sessionEmail) return;
  const query = input.value.trim().toLowerCase();
  wrap.innerHTML = "";
  if (!query) { wrap.classList.add("hidden"); return; }

  const users = getUsers();
  const me = users[sessionEmail];
  if (!me) return;
  wrap.classList.remove("hidden");

  const matches = Object.values(users)
    .filter(u => u.role === "paciente" && u.email !== sessionEmail)
    .filter(p => p.name.toLowerCase().includes(query) || (p.accountId || "").includes(query))
    .slice(0, 8);
  if (!matches.length) {
    wrap.innerHTML = `<div class="search-no-results">Nenhum resultado encontrado para "${escapeHtml(input.value.trim())}".</div>`;
    return;
  }
  matches.forEach(p => {
    const isFriend = (me.friends || []).includes(p.email);
    const isPending = (me.friendRequestsSent || []).includes(p.email);
    // Dois controles irmãos (nunca um botão dentro de outro elemento
    // clicável) — perfil e "Adicionar" são ações distintas com o mesmo
    // peso, cada uma focável e anunciável por si só (ver A5 na auditoria).
    const row = document.createElement("div");
    row.className = "search-result-row";
    row.innerHTML = `
      <button type="button" class="search-result-profile-btn" aria-label="Ver perfil de ${escapeHtml(p.name)}">
        <div class="patient-card-avatar">${p.avatar ? `<img src="${p.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}</div>
        <div class="patient-card-info"><span class="patient-card-name">${escapeHtml(p.name)}</span><span class="patient-card-meta">ID ${escapeHtml(p.accountId)}</span></div>
      </button>
      <button type="button" class="search-result-add-btn"${isFriend || isPending ? " disabled" : ""}>${isFriend ? "Amigo" : isPending ? "Pendente" : "Adicionar"}</button>`;
    row.querySelector(".search-result-profile-btn").onclick = () => openPublicProfile(p.email);
    if (!isFriend && !isPending) {
      row.querySelector(".search-result-add-btn").onclick = () => {
        sendFriendRequest(p.email);
        renderFriendsAddResults();
        renderFriendsPanel();
      };
    }
    wrap.appendChild(row);
  });
}

function friendPreviewCard(p, metaText, extraHtml) {
  return `
    <div class="patient-card-avatar">${p.avatar ? `<img src="${p.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}</div>
    <div class="patient-card-info">
      <span class="patient-card-name">${escapeHtml(p.name)}</span>
      <span class="patient-card-meta">${metaText}</span>
    </div>
    ${extraHtml || ""}`;
}

function renderFriendsPanel() {
  if (!sessionEmail) return;
  const users = getUsers();
  const me = users[sessionEmail];
  if (!me) return;

  const receivedSection = document.getElementById("friend-requests-received-section");
  const receivedWrap = document.getElementById("friend-requests-received-list");
  const received = (me.friendRequestsReceived || [])
    .filter(r => users[r.fromEmail])
    .sort((a, b) => (a.fromName || "").localeCompare(b.fromName || "", "pt-BR", { sensitivity: "base" }));
  if (received.length) {
    receivedSection.classList.remove("hidden");
    receivedWrap.innerHTML = "";
    received.forEach(r => {
      const p = users[r.fromEmail];
      const card = document.createElement("div");
      card.className = "friend-card";
      card.innerHTML = friendPreviewCard(p, `${levelLabel(computeLevel(p))} · quer ser seu amigo`, `
        <div class="friend-request-actions">
          <button type="button" class="friend-req-deny" title="Recusar" aria-label="Recusar pedido de ${escapeHtml(p.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          <button type="button" class="friend-req-accept" title="Aceitar" aria-label="Aceitar pedido de ${escapeHtml(p.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></button>
        </div>`);
      card.querySelector(".friend-req-accept").onclick = () => respondFriendRequest(r.fromEmail, true);
      card.querySelector(".friend-req-deny").onclick = () => respondFriendRequest(r.fromEmail, false);
      receivedWrap.appendChild(card);
    });
    applyListScrollCap(receivedWrap);
  } else {
    receivedSection.classList.add("hidden");
  }

  const sentSection = document.getElementById("friend-requests-sent-section");
  const sentWrap = document.getElementById("friend-requests-sent-list");
  const sent = sortByName((me.friendRequestsSent || []).map(e => users[e]).filter(Boolean));
  if (sent.length) {
    sentSection.classList.remove("hidden");
    sentWrap.innerHTML = "";
    sent.forEach(p => {
      const card = document.createElement("div");
      card.className = "patient-card patient-card-pending";
      card.innerHTML = friendPreviewCard(p, `${levelLabel(computeLevel(p))} · aguardando confirmação`,
        `<span class="invite-sent-icon" title="Pedido enviado, aguardando resposta">${MAIL_SVG}</span>`);
      sentWrap.appendChild(card);
    });
    applyListScrollCap(sentWrap);
  } else {
    sentSection.classList.add("hidden");
  }

  const friendsWrap = document.getElementById("friends-list");
  const friends = sortByName((me.friends || []).map(e => users[e]).filter(Boolean));
  friendsWrap.innerHTML = "";
  if (!friends.length) {
    friendsWrap.innerHTML = `<div class="accounts-empty">Nenhum amigo adicionado ainda.<br>Use a busca na tela inicial para adicionar pelo nome ou ID.</div>`;
  } else {
    friends.forEach(p => {
      const stats = computePatientStats(p);
      const card = document.createElement("div");
      card.className = "friend-card";
      card.innerHTML = friendPreviewCard(p, `${levelLabel(computeLevel(p))} · ${stats.groupsDone} fases · ${stats.accuracyPct}% de acerto`, `
        <button type="button" class="friend-remove-btn" title="Remover amigo" aria-label="Remover ${escapeHtml(p.name)} da lista de amigos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>`);
      card.querySelector(".friend-remove-btn").onclick = () => requestRemoveFriend(p.email);
      friendsWrap.appendChild(card);
    });
  }
  applyListScrollCap(friendsWrap);

  updateFriendsBadge(me);
}

// ══════════════════════════════════════════════
// LEADERBOARD (você + amigos)
// ══════════════════════════════════════════════
function openLeaderboardPanel() {
  renderLeaderboard();
  openPanel("leaderboard-panel");
}

function renderLeaderboard() {
  if (!sessionEmail) return;
  const users = getUsers();
  const me = users[sessionEmail];
  if (!me) return;
  const ids = [sessionEmail, ...((me.friends || []).filter(e => users[e]))];
  const ranked = ids.map(email => {
    const u = users[email];
    const rank = computeRankingScore(u);
    return { email, name: u.name, avatar: u.avatar, groupsDone: rank.groupsDone, accuracyPct: rank.avgBestScore, levelRank: rank.levelRank };
    // Ranking segmentado por nível primeiro (ver G7) — um iniciante com
    // 1-2 fases fáceis em 100% nunca aparece acima de quem está muito
    // mais avançado no tratamento. Dentro do mesmo nível, ordena pela
    // média do MELHOR resultado de cada fase já concluída (não pela
    // soma de tentativas — repetir uma fase fácil não muda nada aqui,
    // ver G2), com fases concluídas como desempate final.
  }).sort((a, b) => b.levelRank - a.levelRank || b.accuracyPct - a.accuracyPct || b.groupsDone - a.groupsDone);

  const wrap = document.getElementById("leaderboard-list");
  wrap.innerHTML = "";
  ranked.forEach((r, i) => {
    const row = document.createElement("div");
    row.className = "leaderboard-row" + (r.email === sessionEmail ? " leaderboard-me" : "") + (i < 3 ? ` leaderboard-top${i + 1}` : "");
    row.innerHTML = `
      <span class="leaderboard-rank">${i + 1}º</span>
      <div class="patient-card-avatar">${r.avatar ? `<img src="${r.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}</div>
      <div class="patient-card-info">
        <span class="patient-card-name">${escapeHtml(r.name)}${r.email === sessionEmail ? " (você)" : ""}</span>
        <span class="patient-card-meta">${r.groupsDone} fases · ${r.accuracyPct}% de acerto</span>
      </div>`;
    wrap.appendChild(row);
  });
}

// ══════════════════════════════════════════════
// CHAT (mensagens entre contas vinculadas)
// ──────────────────────────────────────────────
// Funciona entre TODAS as contas com vínculo confirmado: amigos
// (paciente↔paciente) e médico↔paciente vinculados — nunca com uma
// conta sem relação nenhuma. Como o app não tem backend, a conversa só
// existe de fato entre contas salvas NESTE MESMO dispositivo/navegador
// (mesma limitação que já vale pra contas em geral — ver "Trocar de
// conta"); o modelo de dados já fica pronto para um backend futuro.
// Tipos de mensagem: texto, lembrete, áudio (gravado na hora via
// MediaRecorder), foto e vídeo — mídia grande fica no IndexedDB (ver
// ARMAZENAMENTO DE MÍDIA), só a referência entra no localStorage.
// ══════════════════════════════════════════════
function chatConversationId(a, b) { return [a, b].sort().join("::"); }

function getChats() {
  try { return JSON.parse(localStorage.getItem("vozativa_chats")) || {}; }
  catch (e) { return {}; }
}
// Merge-safe como saveUserRecords(): relê o localStorage antes de
// gravar, então uma mensagem enviada em outra aba entre a leitura e
// esta gravação não é apagada por engano.
function saveChatMessage(conversationId, message) {
  const chats = getChats();
  if (!chats[conversationId]) chats[conversationId] = { messages: [] };
  chats[conversationId].messages.push(message);
  try { localStorage.setItem("vozativa_chats", JSON.stringify(chats)); return true; }
  catch (e) { showToast("Não foi possível enviar: armazenamento do dispositivo está cheio.", true); return false; }
}
function markConversationRead(conversationId, myEmail) {
  const chats = getChats();
  const conv = chats[conversationId];
  if (!conv) return;
  let changed = false;
  conv.messages.forEach(m => {
    if (m.from !== myEmail && !m.readBy.includes(myEmail)) { m.readBy.push(myEmail); changed = true; }
  });
  if (changed) localStorage.setItem("vozativa_chats", JSON.stringify(chats));
}

// Contatos válidos: para paciente, amigos + médicos vinculados; para
// médico, pacientes vinculados. Nunca uma conta sem vínculo confirmado.
function getChatContacts(user) {
  const users = getUsers();
  const emails = user.role === "medico" ? [...(user.patients || [])] : [...(user.friends || []), ...(user.linkedDoctors || [])];
  return emails.map(e => users[e]).filter(Boolean);
}
function chatUnreadCountFor(myEmail, contactEmail) {
  const conv = getChats()[chatConversationId(myEmail, contactEmail)];
  if (!conv) return 0;
  return conv.messages.filter(m => m.from === contactEmail && !m.readBy.includes(myEmail)).length;
}
function updateChatBadge(user) {
  const dot = document.getElementById("chat-badge-dot");
  if (!dot) return;
  if (!user) { dot.classList.add("hidden"); return; }
  const hasUnread = getChatContacts(user).some(c => chatUnreadCountFor(user.email, c.email) > 0);
  dot.classList.toggle("hidden", !hasUnread);
}

function openChatListPanel() {
  renderChatList();
  openPanel("chat-list-panel");
}
function renderChatList() {
  const wrap = document.getElementById("chat-contacts-list");
  if (!wrap || !sessionEmail) return;
  wrap.innerHTML = "";
  const users = getUsers();
  const me = users[sessionEmail];
  if (!me) return;
  const contacts = getChatContacts(me);
  if (!contacts.length) {
    wrap.innerHTML = `<div class="accounts-empty">${me.role === "medico" ? "Nenhum paciente vinculado ainda." : "Adicione amigos ou vincule um fonoaudiólogo para poder conversar."}</div>`;
    return;
  }
  const chats = getChats();
  const withPreview = contacts.map(c => {
    const conv = chats[chatConversationId(sessionEmail, c.email)];
    const last = conv && conv.messages.length ? conv.messages[conv.messages.length - 1] : null;
    return { c, last, unread: chatUnreadCountFor(sessionEmail, c.email) };
  }).sort((a, b) => (b.last ? b.last.createdAt : 0) - (a.last ? a.last.createdAt : 0));

  withPreview.forEach(({ c, last, unread }) => {
    const row = document.createElement("div");
    row.className = "chat-contact-row";
    row.setAttribute("aria-label", `Conversar com ${c.name}`);
    makeKeyboardClickable(row);
    const previewText = !last ? "Nenhuma mensagem ainda"
      : last.type === "text" ? escapeHtml(last.text)
      : last.type === "reminder" ? "🔔 " + escapeHtml(last.text)
      : last.type === "audio" ? "Mensagem de voz"
      : last.type === "photo" ? "Foto"
      : "Vídeo";
    row.innerHTML = `
      <div class="account-avatar">${c.avatar ? `<img src="${c.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}</div>
      <div class="chat-contact-info">
        <span class="chat-contact-name">${escapeHtml(c.name)} ${c.role === "medico" ? "🩺" : ""}</span>
        <span class="chat-contact-preview">${previewText}</span>
      </div>
      ${unread ? `<span class="chat-unread-count">${unread}</span>` : ""}`;
    row.onclick = () => openChatThread(c.email);
    wrap.appendChild(row);
  });
}

// ── Thread (conversa aberta) ──
let activeChatContact = null;
function openChatThread(contactEmail) {
  const users = getUsers();
  const contact = users[contactEmail];
  const me = sessionEmail ? users[sessionEmail] : null;
  if (!contact || !me) return;
  activeChatContact = contactEmail;
  document.getElementById("chat-thread-avatar").innerHTML = contact.avatar ? `<img src="${contact.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG;
  document.getElementById("chat-thread-name").textContent = contact.name;
  markConversationRead(chatConversationId(sessionEmail, contactEmail), sessionEmail);
  renderChatThread();
  updateChatBadge(me);
  closePanel("chat-list-panel");
  openPanel("chat-thread-panel");
}
function backToChatList() {
  activeChatContact = null;
  closePanel("chat-thread-panel");
  openChatListPanel();
}

function chatBubbleContent(m) {
  if (m.type === "text") return `<p class="chat-msg-text">${escapeHtml(m.text)}</p>`;
  if (m.type === "reminder") return `<div class="chat-msg-reminder">${CHAT_ICON_REMINDER}<p class="chat-msg-text">${escapeHtml(m.text)}</p></div>${m.done ? '<span class="chat-msg-reminder-done">Marcado como feito ✓</span>' : ""}`;
  if (m.type === "audio") return `<div class="chat-msg-audio">${CHAT_ICON_AUDIO}<audio class="chat-audio-el" controls preload="none"></audio></div>`;
  if (m.type === "photo") return `<div class="chat-msg-media"><img class="chat-msg-photo" alt="Foto enviada"/></div>`;
  if (m.type === "video") return `<div class="chat-msg-media"><video class="chat-msg-video" controls></video></div>`;
  return "";
}
async function hydrateChatBubbleMedia(bubbleEl, m) {
  if (m.type !== "photo" && m.type !== "video" && m.type !== "audio") return;
  const url = await mediaBlobUrl(m.mediaId);
  if (!url) return;
  if (m.type === "photo") { const img = bubbleEl.querySelector(".chat-msg-photo"); if (img) img.src = url; }
  if (m.type === "video") { const vid = bubbleEl.querySelector(".chat-msg-video"); if (vid) vid.src = url; }
  if (m.type === "audio") { const audioEl = bubbleEl.querySelector(".chat-audio-el"); if (audioEl) audioEl.src = url; }
}
function renderChatThread() {
  const wrap = document.getElementById("chat-thread-messages");
  if (!wrap || !activeChatContact) return;
  wrap.innerHTML = "";
  const conv = getChats()[chatConversationId(sessionEmail, activeChatContact)];
  const messages = (conv && conv.messages) || [];
  if (!messages.length) {
    wrap.innerHTML = `<div class="accounts-empty">Nenhuma mensagem ainda. Diga oi!</div>`;
    return;
  }
  messages.forEach(m => {
    const isMine = m.from === sessionEmail;
    const bubbleRow = document.createElement("div");
    bubbleRow.className = "chat-bubble-row " + (isMine ? "mine" : "theirs");
    bubbleRow.innerHTML = `<div class="chat-bubble${m.type !== "text" ? " chat-bubble-media-type" : ""}">${chatBubbleContent(m)}<span class="chat-bubble-time">${new Date(m.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span></div>`;
    wrap.appendChild(bubbleRow);
    hydrateChatBubbleMedia(bubbleRow, m);
  });
  wrap.scrollTop = wrap.scrollHeight;
}

function sendChatText() {
  const input = document.getElementById("chat-text-input");
  const text = input.value.trim();
  if (!text || !activeChatContact || !sessionEmail) return;
  const message = { id: newMediaId(), from: sessionEmail, type: "text", text, createdAt: Date.now(), readBy: [sessionEmail] };
  if (!saveChatMessage(chatConversationId(sessionEmail, activeChatContact), message)) return;
  input.value = "";
  renderChatThread();
  playBeep(560, 0.08);
}
// ── Lembretes — aba própria na Home, limitada a 1 por dia por conversa ──
// Um lembrete continua contando no envio até o dia seguinte mesmo depois
// de marcado como feito (o limite é sobre TER SIDO ENVIADO hoje, não
// sobre estar pendente) — evita reenviar o mesmo lembrete 5x no mesmo dia
// só porque a pessoa já marcou "feito" na primeira vez.
function dateStringFor(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function reminderSentToday(myEmail, contactEmail) {
  const conv = getChats()[chatConversationId(myEmail, contactEmail)];
  if (!conv) return false;
  const today = todayDateString();
  return conv.messages.some(m => m.type === "reminder" && m.from === myEmail && dateStringFor(m.createdAt) === today);
}
function openChatReminderPrompt() {
  if (!activeChatContact || !sessionEmail) return;
  if (reminderSentToday(sessionEmail, activeChatContact)) {
    showToast("Você já enviou um lembrete para essa pessoa hoje — tente de novo amanhã.", true);
    return;
  }
  document.getElementById("chat-reminder-input").value = "";
  openModal("chat-reminder-modal");
}
function sendChatReminder() {
  const text = document.getElementById("chat-reminder-input").value.trim();
  if (!text || !activeChatContact || !sessionEmail) return;
  if (reminderSentToday(sessionEmail, activeChatContact)) {
    closeModal("chat-reminder-modal");
    showToast("Você já enviou um lembrete para essa pessoa hoje — tente de novo amanhã.", true);
    return;
  }
  const message = { id: newMediaId(), from: sessionEmail, type: "reminder", text, done: false, createdAt: Date.now(), readBy: [sessionEmail] };
  saveChatMessage(chatConversationId(sessionEmail, activeChatContact), message);
  closeModal("chat-reminder-modal");
  renderChatThread();
  updateRemindersBadge(getUsers()[sessionEmail]);
  playBeep(560, 0.08);
}

// Todos os lembretes RECEBIDOS pelo usuário atual, em qualquer conversa,
// que ainda não foram marcados como feitos — é o que popula a aba
// "Lembretes" na tela inicial.
function getAllPendingReminders(myEmail) {
  const chats = getChats();
  const out = [];
  Object.keys(chats).forEach(convId => {
    const [a, b] = convId.split("::");
    if (a !== myEmail && b !== myEmail) return;
    const contactEmail = a === myEmail ? b : a;
    (chats[convId].messages || []).forEach(m => {
      if (m.type === "reminder" && m.from === contactEmail && !m.done) out.push({ ...m, contactEmail });
    });
  });
  return out.sort((a, b) => b.createdAt - a.createdAt);
}
function updateRemindersBadge(user) {
  const dot = document.getElementById("reminders-badge-dot");
  if (!dot) return;
  const hasPending = !!(user && getAllPendingReminders(user.email).length);
  dot.classList.toggle("hidden", !hasPending);
}
function markReminderDone(contactEmail, messageId) {
  if (!sessionEmail) return;
  const chats = getChats();
  const convId = chatConversationId(sessionEmail, contactEmail);
  const conv = chats[convId];
  const msg = conv && conv.messages.find(m => m.id === messageId);
  if (!msg) return;
  msg.done = true;
  msg.doneAt = Date.now();
  localStorage.setItem("vozativa_chats", JSON.stringify(chats));
  renderRemindersPanel();
  updateRemindersBadge(getUsers()[sessionEmail]);
  if (!document.getElementById("chat-thread-panel").classList.contains("hidden") && activeChatContact === contactEmail) renderChatThread();
  playBeep(660, 0.1);
}
function openRemindersPanel() {
  renderRemindersPanel();
  openPanel("reminders-panel");
}
function renderRemindersPanel() {
  const wrap = document.getElementById("reminders-list");
  if (!wrap || !sessionEmail) return;
  wrap.innerHTML = "";
  const users = getUsers();
  const pending = getAllPendingReminders(sessionEmail);
  if (!pending.length) {
    wrap.innerHTML = `<div class="accounts-empty">Nenhum lembrete pendente. Lembretes que você receber aparecem aqui até você marcar como feito.</div>`;
    return;
  }
  pending.forEach(m => {
    const from = users[m.contactEmail];
    const row = document.createElement("div");
    row.className = "reminder-row";
    row.innerHTML = `
      <span class="reminder-row-icon">${CHAT_ICON_REMINDER}</span>
      <div class="reminder-row-body">
        <span class="reminder-row-from">${from ? escapeHtml(from.name) : "—"}</span>
        <p class="reminder-row-text">${escapeHtml(m.text)}</p>
      </div>
      <button type="button" class="btn btn-primary reminder-ok-btn">OK</button>`;
    row.querySelector(".reminder-ok-btn").onclick = () => markReminderDone(m.contactEmail, m.id);
    wrap.appendChild(row);
  });
}

// ── Mídia: foto/vídeo enviados por arquivo ──
const CHAT_PHOTO_MAX_BYTES = 8 * 1024 * 1024;
const CHAT_VIDEO_MAX_BYTES = 60 * 1024 * 1024;
// Selecionar um arquivo só abre uma pré-visualização — nada é enviado até
// o usuário confirmar em "Enviar" (ver confirmSendChatMedia).
let pendingChatMediaFile = null;
function handleChatMediaSelect(input) {
  const file = input.files[0];
  input.value = "";
  if (!file || !activeChatContact || !sessionEmail) return;
  const isPhoto = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isPhoto && !isVideo) { showToast("Envie uma imagem ou um vídeo.", true); return; }
  const maxBytes = isPhoto ? CHAT_PHOTO_MAX_BYTES : CHAT_VIDEO_MAX_BYTES;
  if (file.size > maxBytes) { showToast(`Arquivo muito grande (máx. ${Math.round(maxBytes / 1024 / 1024)}MB).`, true); return; }
  pendingChatMediaFile = file;
  const url = URL.createObjectURL(file);
  document.getElementById("chat-media-preview-content").innerHTML = isPhoto
    ? `<img src="${url}" alt="Pré-visualização da foto"/>`
    : `<video src="${url}" controls></video>`;
  openModal("chat-media-preview-modal");
}
function cancelChatMediaPreview() {
  const content = document.getElementById("chat-media-preview-content");
  const media = content.querySelector("img, video");
  if (media && media.src) URL.revokeObjectURL(media.src);
  content.innerHTML = "";
  pendingChatMediaFile = null;
  closeModal("chat-media-preview-modal");
}
async function confirmSendChatMedia() {
  const file = pendingChatMediaFile;
  if (!file || !activeChatContact || !sessionEmail) { cancelChatMediaPreview(); return; }
  const isPhoto = file.type.startsWith("image/");
  const btn = document.getElementById("chat-media-preview-send-btn");
  setBtnLoading(btn, true);
  const blobId = newMediaId();
  try { await saveMediaBlob(blobId, file); }
  catch (e) { setBtnLoading(btn, false); showToast("Não foi possível enviar este arquivo.", true); return; }
  const message = { id: newMediaId(), from: sessionEmail, type: isPhoto ? "photo" : "video", mediaId: blobId, mediaMime: file.type, createdAt: Date.now(), readBy: [sessionEmail] };
  saveChatMessage(chatConversationId(sessionEmail, activeChatContact), message);
  setBtnLoading(btn, false);
  cancelChatMediaPreview();
  renderChatThread();
  playBeep(560, 0.08);
}

// ── Mídia: áudio gravado na hora (MediaRecorder — captura o áudio de
// verdade e reproduzível depois, diferente do analisador de volume usado
// no treino, que só serve pra visualizar/medir em tempo real). Igual ao
// WhatsApp: parar de gravar abre uma prévia ouvível (com play/pausa e
// seleção de trecho, via <audio controls> nativo) antes de qualquer envio
// — descartar ou enviar são ações explícitas e separadas. ──
let chatRecorder = null, chatRecorderChunks = [], chatRecordingStart = 0;
let pendingChatAudioBlob = null, pendingChatAudioUrl = null, pendingChatAudioTimedDuration = 1;
async function toggleChatAudioRecording() {
  const btn = document.getElementById("chat-audio-record-btn");
  if (chatRecorder && chatRecorder.state === "recording") { chatRecorder.stop(); return; }
  let stream;
  const reusable = micStream && micStream.getTracks().some(t => t.readyState === "live");
  if (!reusable) micLog("toggleChatAudioRecording: precisou pedir getUserMedia() próprio (micStream indisponível/encerrado)");
  try {
    stream = reusable ? micStream : await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
    if (!reusable) attachMicTrackDiagnostics(stream, "toggleChatAudioRecording");
  }
  catch (e) { micLog("toggleChatAudioRecording: getUserMedia falhou", e && e.name + ": " + e.message); showToast("Não foi possível acessar o microfone.", true); return; }
  chatRecorderChunks = [];
  try { chatRecorder = new MediaRecorder(stream); }
  catch (e) { showToast("Gravação de áudio não é suportada neste navegador.", true); return; }
  chatRecorder.ondataavailable = e => { if (e.data.size) chatRecorderChunks.push(e.data); };
  chatRecorder.onstop = () => {
    btn.classList.remove("active");
    const timedDurationSec = Math.round((performance.now() - chatRecordingStart) / 1000);
    const blob = new Blob(chatRecorderChunks, { type: chatRecorder.mimeType || "audio/webm" });
    if (blob.size === 0 || timedDurationSec < 1) return; // gravação cancelada/curta demais pra valer a pena
    openChatAudioPreview(blob, timedDurationSec);
  };
  chatRecordingStart = performance.now();
  chatRecorder.start();
  btn.classList.add("active");
}
function openChatAudioPreview(blob, timedDurationSec) {
  pendingChatAudioBlob = blob;
  pendingChatAudioUrl = URL.createObjectURL(blob);
  pendingChatAudioTimedDuration = timedDurationSec;
  const player = document.getElementById("chat-audio-preview-player");
  player.src = pendingChatAudioUrl;
  openModal("chat-audio-preview-modal");
}
function cancelChatAudioPreview() {
  const player = document.getElementById("chat-audio-preview-player");
  player.pause();
  player.removeAttribute("src");
  player.load();
  if (pendingChatAudioUrl) URL.revokeObjectURL(pendingChatAudioUrl);
  pendingChatAudioBlob = null; pendingChatAudioUrl = null;
  closeModal("chat-audio-preview-modal");
}
async function confirmSendChatAudio() {
  const blob = pendingChatAudioBlob;
  if (!blob || !activeChatContact || !sessionEmail) { cancelChatAudioPreview(); return; }
  const player = document.getElementById("chat-audio-preview-player");
  const durationSec = Number.isFinite(player.duration) ? (Math.round(player.duration) || 1) : pendingChatAudioTimedDuration;
  const btn = document.getElementById("chat-audio-preview-send-btn");
  setBtnLoading(btn, true);
  const blobId = newMediaId();
  try { await saveMediaBlob(blobId, blob); }
  catch (e) { setBtnLoading(btn, false); showToast("Não foi possível salvar o áudio.", true); return; }
  const message = { id: newMediaId(), from: sessionEmail, type: "audio", mediaId: blobId, mediaMime: blob.type, durationSec, createdAt: Date.now(), readBy: [sessionEmail] };
  saveChatMessage(chatConversationId(sessionEmail, activeChatContact), message);
  setBtnLoading(btn, false);
  cancelChatAudioPreview();
  renderChatThread();
  playBeep(560, 0.08);
}

// ══════════════════════════════════════════════
// CONVITES DE FONOAUDIÓLOGO
// ══════════════════════════════════════════════
function checkPendingInvites() {
  const card = document.getElementById("invite-card");
  if (!card) return;
  if (!sessionEmail) { card.classList.add("hidden"); return; }
  const users = getUsers();
  const user = users[sessionEmail];
  if (!user || user.role !== "paciente" || !user.pendingInvites || !user.pendingInvites.length) {
    card.classList.add("hidden");
    return;
  }
  const invite = user.pendingInvites[0];
  document.getElementById("invite-text").textContent =
    `${invite.doctorName || "Um(a) fonoaudiólogo(a)"} quer acompanhar seu progresso no VozAtiva.`;
  card.classList.remove("hidden");
}

function respondInvite(accept) {
  const users = getUsers();
  const user = users[sessionEmail];
  if (!user || !user.pendingInvites || !user.pendingInvites.length) return;
  const invite = user.pendingInvites.shift();
  const doctor = users[invite.doctorEmail];
  if (accept) {
    if (!user.linkedDoctors) user.linkedDoctors = [];
    if (!user.linkedDoctors.includes(invite.doctorEmail)) user.linkedDoctors.push(invite.doctorEmail);
    // "Fonoaudiólogo responsável" é preenchido automaticamente com o nome
    // de quem enviou o convite aceito, sempre — não só quando está vazio.
    user.doctor = invite.doctorName;
    if (doctor) {
      if (!doctor.patients) doctor.patients = [];
      if (!doctor.patients.includes(sessionEmail)) doctor.patients.push(sessionEmail);
    }
    playBeep(660, 0.12);
  } else {
    playBeep(300, 0.1);
  }
  const changed = { [sessionEmail]: user };
  if (doctor) {
    if (doctor.sentInvites) doctor.sentInvites = doctor.sentInvites.filter(e => e !== sessionEmail);
    changed[invite.doctorEmail] = doctor;
  }
  saveUserRecords(changed);
  checkPendingInvites();
}

// ══════════════════════════════════════════════
// CONFIGURAÇÕES
// ══════════════════════════════════════════════

// ── Tema escuro (persistente, disponível em toda a ferramenta) ──
function updateThemeIcons() {
  const moonSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const sunSvg  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const icon = darkMode ? sunSvg : moonSvg;
  document.querySelectorAll(".theme-toggle-icon").forEach(el => { el.innerHTML = icon; });
  const themeLabelEl = document.getElementById("theme-label");
  if (themeLabelEl) themeLabelEl.textContent = darkMode ? "Tema claro" : "Tema escuro";
  const ddTheme = document.getElementById("dd-theme");
  if (ddTheme) ddTheme.classList.toggle("item-active", darkMode);
  syncHasActive("dropdown-settings");
}
function loadThemePreference() {
  darkMode = document.body.classList.contains("dark-mode");
  updateThemeIcons();
}

// ── Reduzir movimento (acessibilidade) ────────
// Desliga/encurta confete, animações de entrada e pulsos contínuos.
// Padrão inicial segue a preferência do sistema operacional
// (prefers-reduced-motion), mas o usuário pode ligar ou desligar
// manualmente a qualquer momento — a escolha fica salva.
function loadReducedMotionPreference() {
  reducedMotion = document.body.classList.contains("reduced-motion");
  updateReducedMotionUI();
}
function updateReducedMotionUI() {
  const label = document.getElementById("motion-label");
  if (label) label.textContent = reducedMotion ? "Movimento reduzido" : "Movimento normal";
  const dd = document.getElementById("dd-motion");
  if (dd) dd.classList.toggle("item-active", reducedMotion);
  const icon = document.getElementById("motion-icon");
  if (icon) {
    icon.innerHTML = reducedMotion
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>`;
  }
  syncHasActive("dropdown-settings");
}
function toggleReducedMotion() {
  reducedMotion = !reducedMotion;
  document.body.classList.toggle("reduced-motion", reducedMotion);
  localStorage.setItem("vozativa_reduced_motion", reducedMotion ? "1" : "0");
  updateReducedMotionUI();
  playBeep(reducedMotion ? 420 : 560, 0.1);
  updateBlobMotionState();
}

// ══════════════════════════════════════════════
// BOLINHAS DE FUNDO — "fluido" com repulsão pelo mouse
// ──────────────────────────────────────────────
// Movimento orgânico de base (ondas seno/cosseno com fase e frequência
// próprias por bolinha, então nunca sincronizam) + um empurrão suave
// quando o cursor se aproxima, que desaparece sozinho conforme o mouse
// se afasta (é só distância → força, recalculado a cada quadro — não
// existe um estado de "empurrado" para desligar, ele já cai a zero
// naturalmente). Tudo suavizado por interpolação (lerp) quadro a
// quadro, inclusive a base e a repulsão juntas, então a transição entre
// "flutuando livre" e "sendo empurrado" nunca dá um salto.
// Só roda enquanto a tela de login/cadastro está visível e o movimento
// reduzido está desligado — para de vez (cancela o quadro agendado) nos
// outros casos, em vez de só pular o trabalho, pra não gastar nada à
// toa em telas onde isso nunca aparece.
// ══════════════════════════════════════════════
let blobMotionFrame = null;
let blobMouseX = null, blobMouseY = null;
let blobState = null; // preenchido no primeiro start

function setupBlobState() {
  const blobs = [...document.querySelectorAll(".blob")];
  blobState = blobs.map((el, i) => {
    const rect = el.getBoundingClientRect();
    return {
      el,
      baseCx: rect.left + rect.width / 2,
      baseCy: rect.top + rect.height / 2,
      phaseX: i * 2.1,
      phaseY: i * 1.4 + 1,
      freqX: (2 * Math.PI) / (5 + i * 0.9),   // período curto (~5-7s) = "mais rápido"
      freqY: (2 * Math.PI) / (6.2 + i * 1.1),
      ampX: 0, ampY: 0, // recalculado por recomputeBlobAmplitudes(), depende da viewport
      curX: 0, curY: 0,
    };
  });
  recomputeBlobAmplitudes();
}

function recomputeBlobAmplitudes() {
  if (!blobState) return;
  const vw = window.innerWidth, vh = window.innerHeight;
  blobState.forEach((s, i) => {
    const mult = 0.85 + i * 0.15; // cada bolinha percorre uma fração um pouco diferente da tela
    s.ampX = vw * 0.30 * mult;
    s.ampY = vh * 0.30 * mult;
    const rect = s.el.getBoundingClientRect();
    // A posição-base também muda com o layout (ex.: rotação de tela) —
    // remonta a partir da posição atual menos o deslocamento já aplicado,
    // pra não "pular" quando a janela é redimensionada.
    s.baseCx = rect.left + rect.width / 2 - s.curX;
    s.baseCy = rect.top + rect.height / 2 - s.curY;
  });
}

const BLOB_REPEL_RADIUS = 260;
const BLOB_REPEL_FORCE = 130;
const BLOB_SMOOTHING = 0.05;

function blobMotionFrameFn(now) {
  blobMotionFrame = requestAnimationFrame(blobMotionFrameFn);
  const t = now / 1000;
  blobState.forEach(s => {
    const baseX = Math.sin(t * s.freqX + s.phaseX) * s.ampX;
    const baseY = Math.cos(t * s.freqY + s.phaseY) * s.ampY;

    let repelX = 0, repelY = 0;
    if (blobMouseX != null) {
      const cx = s.baseCx + s.curX, cy = s.baseCy + s.curY;
      const dx = cx - blobMouseX, dy = cy - blobMouseY;
      const dist = Math.hypot(dx, dy);
      if (dist < BLOB_REPEL_RADIUS && dist > 0.5) {
        const force = (1 - dist / BLOB_REPEL_RADIUS) * BLOB_REPEL_FORCE;
        repelX = (dx / dist) * force;
        repelY = (dy / dist) * force;
      }
    }

    const targetX = baseX + repelX, targetY = baseY + repelY;
    s.curX += (targetX - s.curX) * BLOB_SMOOTHING;
    s.curY += (targetY - s.curY) * BLOB_SMOOTHING;
    s.el.style.transform = `translate(${s.curX.toFixed(1)}px, ${s.curY.toFixed(1)}px)`;
  });
}

function startBlobMotion() {
  if (blobMotionFrame) return;
  if (!blobState) setupBlobState();
  else recomputeBlobAmplitudes();
  blobMotionFrame = requestAnimationFrame(blobMotionFrameFn);
}
function stopBlobMotion() {
  if (blobMotionFrame) { cancelAnimationFrame(blobMotionFrame); blobMotionFrame = null; }
  if (blobState) blobState.forEach(s => { s.el.style.transform = ""; s.curX = 0; s.curY = 0; });
}
function updateBlobMotionState() {
  const shouldRun = document.body.classList.contains("auth-active") && !reducedMotion;
  if (shouldRun) startBlobMotion(); else stopBlobMotion();
}
window.addEventListener("mousemove", (e) => { blobMouseX = e.clientX; blobMouseY = e.clientY; });
window.addEventListener("mouseleave", () => { blobMouseX = null; blobMouseY = null; });
window.addEventListener("resize", () => { if (blobMotionFrame) recomputeBlobAmplitudes(); });
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode", darkMode);
  localStorage.setItem("vozativa_theme", darkMode ? "dark" : "light");
  updateThemeIcons();
  playBeep(darkMode ? 330 : 550, 0.1);
}

// ── Mute / Som ────────────────────────────────
function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("sound-label").textContent = soundOn ? "Com som" : "Sem som";
  document.getElementById("dd-sound").classList.toggle("item-active", !soundOn);
  document.getElementById("sound-icon").innerHTML = soundOn
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
  syncHasActive("dropdown-settings");
  if (soundOn) playBeep(660, 0.12);
}

// ── Notificações ──────────────────────────────
function toggleNotifications() {
  notifOn = !notifOn;

  if (notifOn) {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    playBeep(580, 0.1);
  } else {
    playBeep(300, 0.1);
  }

  document.getElementById("notif-label").textContent = notifOn ? "Notificações ativas" : "Notificações desligadas";
  document.getElementById("dd-notif").classList.toggle("item-active", !notifOn);

  document.getElementById("notif-icon").innerHTML = notifOn
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  syncHasActive("dropdown-settings");
}

function syncHasActive(menuId) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  menu.classList.toggle("has-active", !!menu.querySelector(".item-active"));
}

// ══════════════════════════════════════════════
// VOZ DO FONEMA (gênero + TTS / áudio personalizado)
// ══════════════════════════════════════════════
let ttsVoices = [];
function loadVoices() {
  ttsVoices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
}
if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

function toggleGenderVoice() {
  voiceGender = voiceGender === "female" ? "male" : "female";
  document.querySelectorAll(".gender-btn").forEach(btn => {
    btn.classList.toggle("voice-female", voiceGender === "female");
    btn.classList.toggle("voice-male", voiceGender === "male");
    btn.setAttribute("aria-label", voiceGender === "female" ? "Voz feminina selecionada" : "Voz masculina selecionada");
    const symbol = btn.querySelector(".gender-symbol");
    if (symbol) symbol.textContent = voiceGender === "female" ? "♀" : "♂";
  });
  playBeep(voiceGender === "female" ? 720 : 380, 0.08);
}

function pickVoice() {
  if (!ttsVoices.length) loadVoices();
  const pt = ttsVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith("pt"));
  const pool = pt.length ? pt : ttsVoices;
  if (!pool.length) return null;
  const femaleHint = /female|mulher|maria|luciana|joana|fem/i;
  const maleHint   = /male|homem|daniel|ricardo|felipe|masc/i;
  const preferred = pool.find(v => voiceGender === "female" ? femaleHint.test(v.name) : maleHint.test(v.name));
  if (preferred) return preferred;
  return voiceGender === "female" ? pool[0] : (pool[1] || pool[0]);
}

// Uma pasta por gênero de voz, cada uma com uma gravação real por fonema
// (ex.: fonemas-audio/feminina/A.mp3, fonemas-audio/masculina/MA.mp3...).
// A pasta usada segue o voiceGender selecionado no botão ♀/♂ — uma
// gravação feminina nunca toca no modo masculino e vice-versa. Arquivo
// ausente ou com erro cai automaticamente pra síntese de voz do
// navegador — não precisa mexer em código pra ir completando as
// gravações de cada gênero aos poucos.
const PHONEME_AUDIO_DIR_BY_GENDER = {
  female: "fonemas-audio/feminina/",
  male: "fonemas-audio/masculina/",
};

function playPhonemeAudio() {
  const btn = document.getElementById("phoneme-audio-btn");
  const fonema = desafios[currentIndex];
  const sources = [];
  if (activeCustomAudio[fonema]) sources.push(activeCustomAudio[fonema]);
  sources.push(`${PHONEME_AUDIO_DIR_BY_GENDER[voiceGender]}${fonema}.mp3`);
  tryPhonemeAudioSources(sources, 0, btn, fonema);
}

function tryPhonemeAudioSources(sources, i, btn, fonema) {
  if (i >= sources.length) { speakPhonemeFallback(fonema, btn); return; }
  btn.classList.add("playing");
  const audioEl = new Audio(sources[i]);
  let advanced = false;
  const next = () => {
    if (advanced) return;
    advanced = true;
    tryPhonemeAudioSources(sources, i + 1, btn, fonema);
  };
  audioEl.onended = () => btn.classList.remove("playing");
  audioEl.onerror = next;
  audioEl.play().catch(next);
}

function speakPhonemeFallback(fonema, btn) {
  if (!("speechSynthesis" in window)) { playBeep(700, 0.15); return; }
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(fonema.toLowerCase());
  utter.lang = "pt-BR";
  const voice = pickVoice();
  if (voice) utter.voice = voice;
  utter.rate = 0.8;
  utter.pitch = voiceGender === "female" ? 1.15 : 0.85;
  btn.classList.add("playing");
  utter.onend = () => btn.classList.remove("playing");
  utter.onerror = () => btn.classList.remove("playing");
  speechSynthesis.speak(utter);
}

// ══════════════════════════════════════════════
// AJUDA
// ══════════════════════════════════════════════
function openHelpPanel() {
  openPanel("help-panel");
}

// ══════════════════════════════════════════════
// CRÉDITOS
// ══════════════════════════════════════════════
function openCreditsModal() {
  openPanel("credits-panel");
}

// ══════════════════════════════════════════════
// BOAS-VINDAS — uma vez por conta, antes de qualquer outra coisa
// (inclusive antes do pedido de permissão de microfone)
// ══════════════════════════════════════════════
const WELCOME_STEP_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
function maybeShowWelcome(user) {
  if (!user || user.welcomeSeen) return false;
  const isDoctor = user.role === "medico";
  document.getElementById("welcome-title").textContent = isDoctor ? `Bem-vindo(a), ${(user.name || "").split(" ")[0] || "Doutor(a)"}!` : `Bem-vindo(a), ${(user.name || "").split(" ")[0] || ""}!`;
  document.getElementById("welcome-desc").textContent = isDoctor
    ? "O VozAtiva é uma ferramenta de apoio para você acompanhar, à distância, pacientes que já estão em tratamento fonoaudiológico com você — um complemento às consultas, não um substituto."
    : "O VozAtiva é um complemento ao seu tratamento com o(a) fonoaudiólogo(a) — ele te ajuda a praticar entre as consultas, não substitui o acompanhamento profissional.";
  const steps = isDoctor
    ? [
        "Adicione pacientes pelo ID da conta deles, no Painel do Médico.",
        "Crie exercícios personalizados e reordene a trilha de cada paciente.",
        "Acompanhe o progresso e os erros mais recorrentes de cada um.",
      ]
    : [
        "Pratique um pouquinho todo dia — é isso que mais ajuda no seu tratamento.",
        "Toque em \"Gravar Voz\", diga o fonema e siga a trilha de fases.",
        "Ficou com dúvida? O botão de ajuda (💡) está sempre por perto.",
      ];
  const list = document.getElementById("welcome-steps");
  list.innerHTML = "";
  steps.forEach(text => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="step-icon">${WELCOME_STEP_ICON}</span><span>${escapeHtml(text)}</span>`;
    list.appendChild(li);
  });
  document.getElementById("welcome-cta").textContent = isDoctor ? "Entendi" : "Vamos começar!";
  showOverlay(document.getElementById("welcome-overlay"));
  return true;
}
function closeWelcomeOverlay() {
  hideOverlay(document.getElementById("welcome-overlay"));
  if (sessionEmail) {
    const users = getUsers();
    const user = users[sessionEmail];
    if (user && !user.welcomeSeen) {
      user.welcomeSeen = true;
      saveUserRecords({ [sessionEmail]: user });
      // Paciente: o pedido/checagem de microfone é quem retoma o tutorial
      // pendente ao terminar (ver bootstrapMicPermission/requestMicPermission/
      // skipPermission). Médico nunca usa microfone — precisa retomar aqui
      // mesmo, senão o tutorial da Home nunca chegaria a aparecer pra ele.
      if (user.role === "paciente") bootstrapMicPermission();
      else resumePendingTourAfterMic();
    }
  }
}

// ══════════════════════════════════════════════
// TOUR GUIADO (spotlight)
// ══════════════════════════════════════════════
// Cada texto termina dizendo o que vai acontecer/onde a pessoa vai
// parar DEPOIS de tocar — não só o que o botão é (ver UX1 na
// auditoria: ninguém devia terminar um passo do tour sem saber pra
// onde vai). Tours separados por papel (paciente/médico), já que os
// dois têm telas e objetivos bem diferentes.
const TOUR_STEPS = {
  home: [
    { el: "#profile-btn",  text: "Toque aqui pra abrir seu perfil — nome, foto, telefone. Um menu se abre com essas opções." },
    { el: "#settings-btn", text: "Aqui ficam som, notificações e créditos. O tema claro/escuro fica sempre no botão de lua/sol, em qualquer tela." },
    { el: ".home-start",   text: "Toque aqui pra começar a treinar agora — você vai direto pra sua trilha de fases." },
  ],
  homeMedico: [
    { el: "#profile-btn",  text: "Toque aqui pra abrir seu perfil — nome, foto, telefone. Um menu se abre com essas opções." },
    { el: "#settings-btn", text: "Aqui ficam som, notificações e créditos. O tema claro/escuro fica sempre no botão de lua/sol, em qualquer tela." },
    { el: ".home-start",   text: "Toque aqui pra abrir o Painel do Médico — é lá que você acompanha e adiciona pacientes." },
  ],
  path: [
    { el: ".remedial-node", text: "Este card mostra fonemas que você mesmo(a) precisa retreinar, quando seu fonoaudiólogo pede uma repetição. Fica apagado e sem função enquanto não há nada pendente." },
    { el: ".path-node.unlocked, .path-node.completed", text: "Cada nó é uma fase. Toque num nó desbloqueado (colorido) pra começar a treinar aqueles fonemas — um pulou de ilha desbloqueia a próxima." },
  ],
  app: [
    { el: "#screen-app .back-btn", text: "Toque aqui pra voltar pra trilha de fases a qualquer momento, sem perder o que já foi respondido nesta fase." },
    { el: "#gender-btn",         text: "Toque pra trocar a voz que pronuncia os fonemas entre feminina (rosa) e masculina (azul)." },
    { el: "#help-btn",           text: "Ficou com dúvida? Toque aqui pra abrir a Central de Ajuda a qualquer momento, inclusive sobre como funciona a revisão do fonoaudiólogo." },
    { el: "#phoneme-audio-btn",  text: "Toque pra ouvir como esse fonema deve soar antes de gravar sua voz." },
    { el: ".waveform-wrapper",   text: "Sua voz aparece aqui em tempo real assim que você grava — dá pra ver se o som está sendo captado." },
    { el: "#btn-record",         text: "Toque aqui pra gravar e diga o fonema mostrado — não precisa tocar de novo pra parar, o reconhecimento avança sozinho assim que reconhece sua fala." },
  ],
  // Painel do médico — tela de lista de pacientes (ver openDoctorScreen).
  doctorPanel: [
    { el: "#add-patient-id",       text: "Digite o ID de 4 dígitos do paciente aqui e toque em Adicionar — ele recebe um convite e precisa aceitar antes de aparecer vinculado." },
    { el: ".patient-card",         text: "Toque no card de um paciente pra ver o progresso completo dele, fase por fase." },
  ],
  // Painel do médico — detalhe de um paciente (ver openPatientDetail).
  doctorDetail: [
    { el: "#detail-reviews-list",  text: "Aqui aparecem as fases que o paciente concluiu, com o áudio de cada tentativa — ouça e toque Aprovar ou Rejeitar. Rejeitar manda aqueles fonemas de volta pro paciente treinar de novo, num nível separado." },
    { el: "#detail-error-bars",    text: "Fonemas com erro recorrente aparecem aqui — toque em \"Pedir repetição\" pra mandar um fonema específico direto pro paciente treinar de novo, mesmo sem uma revisão pendente." },
  ],
};
let tourStepIndex = 0;
let currentTourKey = null;

function startTour(key) {
  if (!TOUR_STEPS[key] || !TOUR_STEPS[key].length) return;
  currentTourKey = key;
  tourStepIndex = 0;
  closeDropdowns();
  document.getElementById("tour-overlay").classList.remove("hidden");
  window.addEventListener("resize", repositionTourStep);
  showTourStep();
}

function isElementVisible(el) {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

function showTourStep() {
  const steps = TOUR_STEPS[currentTourKey];
  const step = steps[tourStepIndex];
  const target = document.querySelector(step.el);
  if (!target || !isElementVisible(target)) { nextTourStep(); return; }
  // Conteúdo do passo (texto, pontos, rótulo do botão) precisa estar
  // definido ANTES de posicionar o tooltip — positionSpotlightOn() mede a
  // altura real já renderizada; medir antes de trocar o texto usava a
  // altura do passo ANTERIOR (ou nenhuma, no primeiro passo), fazendo o
  // tooltip ficar mal posicionado/cortado em textos mais longos ou telas
  // menores.
  document.getElementById("tour-tooltip-text").textContent = step.text;
  renderTourDots(steps.length, tourStepIndex);
  document.getElementById("tour-next-btn").textContent = tourStepIndex === steps.length - 1 ? "Concluir" : "Próximo";
  positionSpotlightOn(target);
}

function positionSpotlightOn(target) {
  const r = target.getBoundingClientRect();
  const pad = 10;
  const margin = 14; // nunca encostar nas bordas da tela
  let left = r.left - pad;
  let top = r.top - pad;
  let width = r.width + pad * 2;
  let height = r.height + pad * 2;

  if (left < margin) { width -= (margin - left); left = margin; }
  if (top < margin) { height -= (margin - top); top = margin; }
  if (left + width > window.innerWidth - margin) width = window.innerWidth - margin - left;
  if (top + height > window.innerHeight - margin) height = window.innerHeight - margin - top;
  width = Math.max(width, 24);
  height = Math.max(height, 24);

  const spot = document.getElementById("tour-spotlight");
  spot.style.width  = width + "px";
  spot.style.height = height + "px";
  spot.style.left   = left + "px";
  spot.style.top    = top + "px";
  spot.style.borderRadius = (height <= 70 && Math.abs(width - height) < 16) ? "50%" : "18px";
  positionTourTooltip(r);
}

function positionTourTooltip(r) {
  const tip = document.getElementById("tour-tooltip");
  const tipW = Math.min(300, window.innerWidth - 32);
  tip.style.width = tipW + "px";
  // Mede a altura REAL já renderizada (texto + pontos + botões) em vez de
  // supor um valor fixo — um texto mais longo numa tela estreita quebra em
  // mais linhas do que num tipW largo, e um valor fixo subestimava isso,
  // deixando o tooltip cortado ou saindo da tela em telas menores.
  const tipH = tip.offsetHeight || 170;
  let top = r.bottom + 20;
  if (top + tipH > window.innerHeight - 16) top = r.top - tipH - 10;
  // Se nem abaixo nem acima do alvo cabe (alvo ocupa quase a tela toda,
  // comum em celular), força dentro dos limites da tela em vez de deixar
  // vazar — nunca cortado, mesmo que fique sobrepondo parte do alvo.
  top = Math.max(16, Math.min(top, window.innerHeight - tipH - 16));
  let left = r.left;
  if (left + tipW > window.innerWidth - 16) left = window.innerWidth - tipW - 16;
  if (left < 16) left = 16;
  tip.style.top = top + "px";
  tip.style.left = left + "px";
}

function repositionTourStep() {
  if (!currentTourKey) return;
  const step = TOUR_STEPS[currentTourKey][tourStepIndex];
  const target = document.querySelector(step.el);
  if (target) positionSpotlightOn(target);
}

function renderTourDots(total, active) {
  const wrap = document.getElementById("tour-progress-dots");
  wrap.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.className = "tour-dot" + (i === active ? " active" : "");
    wrap.appendChild(dot);
  }
}

function nextTourStep() {
  const steps = TOUR_STEPS[currentTourKey];
  tourStepIndex++;
  if (tourStepIndex >= steps.length) { endTour(); return; }
  showTourStep();
}
function skipTour() { endTour(); }
function endTour() {
  document.getElementById("tour-overlay").classList.add("hidden");
  if (currentTourKey) localStorage.setItem("vozativa_tour_" + currentTourKey + "_seen", "1");
  window.removeEventListener("resize", repositionTourStep);
  currentTourKey = null;
}
function isCurrentUserDoctor() {
  if (!sessionEmail) return false;
  const u = getUsers()[sessionEmail];
  return !!(u && u.role === "medico");
}
// Conta de demonstração com acesso irrestrito à trilha (ver ensureAdminAccount,
// no boot do arquivo) — nenhuma conta comum pode ganhar isAdmin por conta
// própria, então isto nunca afeta usuários normais.
function isCurrentUserAdmin() {
  if (!sessionEmail) return false;
  const u = getUsers()[sessionEmail];
  return !!(u && u.isAdmin);
}

function replayTour() {
  closePanel("help-panel");
  let key = isCurrentUserDoctor() ? "homeMedico" : "home";
  if (!screenApp.classList.contains("hidden")) key = "app";
  else if (!screenPath.classList.contains("hidden")) key = "path";
  else if (!screenDoctor.classList.contains("hidden")) {
    const detailOpen = document.getElementById("doctor-detail-view") && !document.getElementById("doctor-detail-view").classList.contains("hidden");
    key = detailOpen ? "doctorDetail" : "doctorPanel";
  }
  startTour(key);
}
// Nenhum tour começa por cima das boas-vindas nem da tela de permissão de
// microfone — a ordem certa é sempre boas-vindas → permissão de microfone
// → tutorial, nunca o tutorial "furando a fila" na frente de qualquer um
// dos dois. Se qualquer um dos dois ainda estiver aberto quando o timer do
// tour disparar, ele é retomado depois, em resumePendingTourAfterMic()
// (chamada ao fechar as boas-vindas e ao resolver a permissão).
function tourBlockedByOtherOverlay() {
  const welcome = document.getElementById("welcome-overlay");
  return (welcome && !welcome.classList.contains("hidden")) || !permOverlay.classList.contains("hidden");
}
// Administrador (ver isCurrentUserAdmin): nenhum tour guiado aparece
// sozinho — é uma conta de demonstração/teste, não alguém vendo a tela
// pela primeira vez. Guarda em cada maybeStart*Tour (não em startTour
// em si) pra não afetar replayTour(), que continua disponível se o
// próprio admin abrir o tour manualmente pelo painel de ajuda.
function maybeStartHomeTour() {
  if (isCurrentUserAdmin()) return;
  const key = isCurrentUserDoctor() ? "homeMedico" : "home";
  if (!localStorage.getItem("vozativa_tour_" + key + "_seen")) {
    setTimeout(() => { if (!screenHome.classList.contains("hidden") && !tourBlockedByOtherOverlay()) startTour(key); }, 600);
  }
}
function maybeStartPathTour() {
  if (isCurrentUserAdmin()) return;
  if (!localStorage.getItem("vozativa_tour_path_seen")) {
    setTimeout(() => { if (!screenPath.classList.contains("hidden") && !tourBlockedByOtherOverlay()) startTour("path"); }, 500);
  }
}
// Painel do médico nunca tinha tour nenhum antes (ver UX1 na auditoria)
// — o médico entrava direto sem nenhuma orientação de onde adicionar
// pacientes ou o que cada card mostra.
function maybeStartDoctorPanelTour() {
  if (isCurrentUserAdmin()) return;
  if (!localStorage.getItem("vozativa_tour_doctorPanel_seen")) {
    setTimeout(() => { if (!screenDoctor.classList.contains("hidden") && !tourBlockedByOtherOverlay()) startTour("doctorPanel"); }, 500);
  }
}
function maybeStartDoctorDetailTour() {
  if (isCurrentUserAdmin()) return;
  if (!localStorage.getItem("vozativa_tour_doctorDetail_seen")) {
    setTimeout(() => { if (!screenDoctor.classList.contains("hidden") && !tourBlockedByOtherOverlay()) startTour("doctorDetail"); }, 500);
  }
}
function maybeStartAppTour() {
  if (isCurrentUserAdmin()) return;
  if (!localStorage.getItem("vozativa_tour_app_seen")) {
    setTimeout(() => { if (!screenApp.classList.contains("hidden") && !tourBlockedByOtherOverlay()) startTour("app"); }, 500);
  }
}
function resumePendingTourAfterMic() {
  if (!screenHome.classList.contains("hidden")) maybeStartHomeTour();
  else if (!screenPath.classList.contains("hidden")) maybeStartPathTour();
  else if (!screenApp.classList.contains("hidden")) maybeStartAppTour();
  else if (!screenDoctor.classList.contains("hidden")) maybeStartDoctorPanelTour();
}

// ══════════════════════════════════════════════
// TRILHA DE PROGRESSO
// ══════════════════════════════════════════════
let pathResizeRaf = null;
window.addEventListener("resize", () => {
  if (screenPath.classList.contains("hidden")) return;
  if (pathResizeRaf) cancelAnimationFrame(pathResizeRaf);
  pathResizeRaf = requestAnimationFrame(() => renderPathTree());
});

// Uma fase sem nenhum exercício (grupo customizado recém-criado, antes
// do médico adicionar conteúdo) nunca é jogável nem conta como
// "anterior" pra desbloquear a próxima — senão ela travaria toda a
// trilha depois dela pra sempre. Ver F1 na auditoria.
function isPlayableGroup(g) { return !!(g && g.fonemas && g.fonemas.length); }
function isGroupUnlocked(gi, progress) {
  // Administrador: qualquer fase com conteúdo é sempre acessível, sem
  // depender da fase anterior ter sido concluída (ver isCurrentUserAdmin).
  if (isCurrentUserAdmin()) return true;
  if (progress.completedGroupIds.includes(grupos[gi].id)) return true;
  for (let i = gi - 1; i >= 0; i--) {
    if (!isPlayableGroup(grupos[i])) continue;
    return progress.completedGroupIds.includes(grupos[i].id);
  }
  return true; // nenhuma fase anterior tem conteúdo — a primeira fase jogável libera
}

function renderPathTree(introAnimation, celebrateIndex) {
  const tree = document.getElementById("path-tree");
  const users = getUsers();
  const user = users[sessionEmail];
  if (!user) return;
  const progress = getProgress(user);
  saveUserRecords({ [sessionEmail]: user });
  const intervention = groupsWithIntervention(user);

  tree.innerHTML = "";
  let doneCount = 0;
  const aligns = ["align-center", "align-left", "align-right"];
  const total = grupos.length;
  grupos.forEach((g, gi) => {
    const completed = progress.completedGroupIds.includes(g.id);
    // Uma fase já concluída continua sempre desbloqueada/clicável, mesmo
    // que uma nova fase personalizada ainda pendente seja inserida logo
    // antes dela na ordem (o médico pode inserir tarefas entre fases já
    // concluídas a qualquer momento) — sem isso, a fase concluída ficava
    // com o ícone de check mas desabilitada (clique não fazia nada).
    const playable = isPlayableGroup(g);
    const unlocked = playable && isGroupUnlocked(gi, progress); // já considera isCurrentUserAdmin()
    if (completed) doneCount++;
    // Fase personalizada (grupo/exercício adicionado pelo médico) ainda
    // não concluída: ícone azul + selo "i". Uma vez concluída, vira um nó
    // "normal" (dourado + check), sem destaque especial.
    const pendingCustom = intervention.has(g.id) && !completed;
    const node = document.createElement("button");
    node.type = "button";
    node.className = "path-node " + aligns[gi % 3] + " " + (!playable ? "locked" : completed ? "completed" : unlocked ? "unlocked" : "locked")
      + (pendingCustom ? " has-intervention" : "");
    node.dataset.gi = gi;
    node.disabled = !unlocked;
    if (!playable) node.title = "O fonoaudiólogo ainda não adicionou exercícios a esta fase.";
    node.onclick = () => startPhase(gi);
    node.innerHTML = `
      <span class="path-node-circle-wrap">
        <span class="path-node-circle">${completed ? CHECK_SVG : unlocked ? (gi + 1) : LOCK_SVG}</span>
        ${pendingCustom ? '<span class="path-node-badge" title="Fase com exercícios adicionados pelo fonoaudiólogo">i</span>' : ""}
      </span>
      <span class="path-node-label">${escapeHtml(g.nome)}${!playable ? ' <em>(sem exercícios)</em>' : ""}</span>`;
    if (introAnimation) {
      // gi=0 é o nó mais embaixo (Vogais); o nó mais alto (último grupo)
      // deve "chegar" primeiro na animação de cima para baixo.
      const reverseIndex = total - 1 - gi;
      node.classList.add("path-node-intro");
      node.style.animationDelay = (reverseIndex * 0.1) + "s";
    }
    // Celebração de desbloqueio: só dispara no nó indicado por
    // celebrateIndex (o próximo da fase recém-concluída, ver backToPath),
    // e só se ele realmente acabou de abrir (desbloqueado, ainda não
    // concluído) — evita "comemorar" um nó que já estava aberto antes.
    if (gi === celebrateIndex && unlocked && !completed) {
      node.classList.add("just-unlocked");
      setTimeout(() => node.classList.remove("just-unlocked"), 1200);
    }
    tree.appendChild(node);
  });
  document.getElementById("path-progress-indicator").textContent = `${doneCount} de ${grupos.length} fases`;

  renderPathConnectors(progress, intervention);
  renderRemedialNode(progress);

  // Rola automaticamente até a fase atual (a próxima não concluída) toda
  // vez que a trilha é exibida — não só ao voltar de uma fase recém-
  // concluída (celebrateIndex). Sem isso, a tela sempre abria no topo,
  // obrigando a pessoa a procurar manualmente onde parou. Roda DEPOIS de
  // renderPathConnectors/renderRemedialNode (que ainda mexem no layout
  // do próprio #path-tree) e dentro de requestAnimationFrame, pra medir
  // a posição só depois que o navegador realmente aplicou esse layout —
  // nunca antes dos elementos existirem/estarem no lugar final.
  const scrollTargetIndex = celebrateIndex !== undefined ? Math.min(celebrateIndex, total - 1) : computeCurrentPhaseIndex(progress);
  requestAnimationFrame(() => {
    const targetNode = tree.querySelector(`[data-gi="${scrollTargetIndex}"]`);
    if (targetNode) targetNode.scrollIntoView({ behavior: reducedMotion || introAnimation ? "auto" : "smooth", block: "center" });
    // Rolagem "auto"/instantânea às vezes não dispara um evento scroll
    // a tempo do próximo frame — sincroniza direto aqui também, o
    // listener de scroll cobre o resto durante uma rolagem "smooth".
    syncPathHeaderPosition();
  });
}

// A "fase atual" pra fins de rolagem automática: a primeira fase jogável
// ainda não concluída (onde a pessoa realmente vai continuar) — ou a
// última da trilha, se tudo já estiver concluído.
function computeCurrentPhaseIndex(progress) {
  for (let i = 0; i < grupos.length; i++) {
    if (isPlayableGroup(grupos[i]) && !progress.completedGroupIds.includes(grupos[i].id)) return i;
  }
  return Math.max(0, grupos.length - 1);
}

// Nível de Revisão (ver G3 na auditoria) — apagado/inclicável sem nada
// pendente, colorido/clicável assim que o médico rejeita alguma
// aprovação. Fica fora de #path-tree de propósito (não é um nó da
// árvore de fases, ver startRemedialPhase).
function renderRemedialNode(progress) {
  const node = document.getElementById("remedial-node");
  const meta = document.getElementById("remedial-node-meta");
  if (!node || !meta) return;
  const count = uniqueRejectedFonemas(progress).length;
  node.disabled = count === 0;
  node.classList.toggle("has-items", count > 0);
  meta.textContent = count === 0
    ? "Nada pendente por enquanto"
    : `${count} fonema${count > 1 ? "s" : ""} pra rever`;
}

// Desenha linhas conectando cada nó ao próximo, seguindo a posição real
// deles na tela (zigue-zague) — cheias entre fases já concluídas,
// tracejadas rumo às próximas. Uma fase personalizada ainda não concluída
// fica com o caminho tracejado tanto antes quanto depois dela (não só
// depois), para destacar que ela mesma ainda está pendente.
function renderPathConnectors(progress, intervention) {
  const tree = document.getElementById("path-tree");
  let svg = document.getElementById("path-connectors-svg");
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "path-connectors-svg");
    svg.setAttribute("class", "path-connectors-svg");
    tree.insertBefore(svg, tree.firstChild);
  } else {
    svg.innerHTML = "";
  }

  const treeRect = tree.getBoundingClientRect();
  svg.setAttribute("width", treeRect.width);
  svg.setAttribute("height", treeRect.height);
  svg.setAttribute("viewBox", `0 0 ${treeRect.width} ${treeRect.height}`);

  // Usa offsetLeft/offsetTop (não getBoundingClientRect) para calcular o
  // centro de cada nó: essas propriedades ignoram transform do CSS, então
  // o ponto já reflete a posição final de repouso do nó mesmo durante a
  // animação de entrada (path-node-intro), que desloca o nó com translateY
  // enquanto seu fill-mode:both estiver ativo.
  const circles = Array.from(tree.querySelectorAll(".path-node-circle"));
  const points = circles.map(c => {
    let x = c.offsetWidth / 2;
    let y = c.offsetHeight / 2;
    let el = c;
    while (el && el !== tree) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return { x, y };
  });

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1];
    const nextPendingCustom = intervention && intervention.has(grupos[i + 1].id) && !progress.completedGroupIds.includes(grupos[i + 1].id);
    const done = progress.completedGroupIds.includes(grupos[i].id) && !nextPendingCustom;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
    line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
    line.setAttribute("class", done ? "path-line-done" : "path-line-todo");
    svg.appendChild(line);
  }
}

function startPhase(gi) {
  const users = getUsers();
  const user = users[sessionEmail];
  // Fase sem nenhum exercício não pode ser aberta — impede a tela de
  // treino de quebrar com "undefined" quando o médico cria um grupo
  // customizado antes de adicionar conteúdo a ele (ver F1 na auditoria).
  if (!user || !grupos[gi] || !isPlayableGroup(grupos[gi])) return;
  const progress = getProgress(user);
  if (!isGroupUnlocked(gi, progress)) return;

  releasePendingPhaseAttempts();
  phaseSkipsUsed = 0;
  phaseAttemptCommitted = false;
  phaseGroupIndex = gi;
  phaseStartIndex = fonemaGrupo.indexOf(gi);
  let endIdx = phaseStartIndex;
  for (let i = 0; i < fonemaGrupo.length; i++) if (fonemaGrupo[i] === gi) endIdx = i;
  phaseEndIndex = endIdx;
  currentIndex = phaseStartIndex;
  phaseSegmentStatus = new Array(phaseEndIndex - phaseStartIndex + 1).fill(null);
  phaseAttemptMediaIds = new Array(phaseEndIndex - phaseStartIndex + 1).fill(null);
  phaseAttemptVerified = new Array(phaseEndIndex - phaseStartIndex + 1).fill(null);
  phaseTotal.textContent = phaseEndIndex - phaseStartIndex + 1;
  statTotal.textContent  = phaseEndIndex - phaseStartIndex + 1;

  showOnlyScreen("app");
  initApp();
  if (micGranted || micDenied) maybeStartAppTour();
}

// Aproveitamento mínimo para uma fase contar como CONCLUÍDA de verdade —
// é o que desbloqueia a próxima fase na trilha e o que entra no ranking
// de amigos. Abaixo disso, a fase pode ser tentada de novo quantas vezes
// forem necessárias; ela não fica "travada", só não conta como dominada.
const PHASE_COMPLETION_THRESHOLD = 65;

// A sequência diária (streak) conta pela PRÁTICA do dia, não pela nota —
// por isso é registrada sempre que a fase é finalizada, mesmo abaixo do
// limiar de conclusão (ver comentário em SEQUÊNCIA DIÁRIA). Já o grupo só
// entra em completedGroupIds — o que desbloqueia a próxima fase e conta
// para o ranking — quando o aproveitamento real da fase atinge o limiar.
function registerPhaseAttempt(groupId, scorePct) {
  if (!sessionEmail) return;
  const users = getUsers();
  const user = users[sessionEmail];
  if (!user) return;
  const progress = getProgress(user);
  if (scorePct >= PHASE_COMPLETION_THRESHOLD && !progress.completedGroupIds.includes(groupId)) {
    progress.completedGroupIds.push(groupId);
  }
  // Só pro ranking (ver computeRankingScore) — guarda o MELHOR resultado
  // já obtido nesta fase, nunca soma por tentativa, pra repetir uma fase
  // fácil não inflar a posição no ranking (ver G2 na auditoria).
  progress.groupBestScore[groupId] = Math.max(progress.groupBestScore[groupId] || 0, scorePct);
  registerStreakForToday(progress);
  saveUserRecords({ [sessionEmail]: user });
}

// Fila de aprovação do médico: cada fase concluída (não cada fonema)
// vira UMA entrada de revisão, agrupando as tentativas gravadas daquela
// fase, pro fonoaudiólogo conferir se o reconhecimento automático
// acertou. Não bloqueia o paciente — ele já avançou/desbloqueou a
// próxima fase normalmente (ver registerPhaseAttempt); isso é só uma
// auditoria em paralelo.
function registerPhaseReview(group, scorePct) {
  if (!sessionEmail) return;
  const users = getUsers();
  const user = users[sessionEmail];
  if (!user) return;
  const progress = getProgress(user);
  const groupFonemas = group.fonemas || [];
  const attempts = groupFonemas.map((f, i) => ({
    fonema: f,
    status: phaseSegmentStatus[i] || "skipped",
    mediaId: phaseAttemptMediaIds[i] || null,
    verified: !!phaseAttemptVerified[i]
  }));
  // Sem nenhum áudio gravado nesta fase (tudo pulado, ou microfone
  // bloqueado o tempo todo) não há nada pro médico ouvir/validar.
  if (!attempts.some(a => a.mediaId)) return;
  progress.reviews.unshift({
    id: "rv" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    groupId: group.id,
    groupNome: group.nome,
    timestamp: Date.now(),
    scorePct,
    status: "pendente",
    attempts,
    reviewedAt: null
  });
  saveUserRecords({ [sessionEmail]: user });
}

function registerAttempt(fonema, correct) {
  if (!sessionEmail) return;
  const users = getUsers();
  const user = users[sessionEmail];
  if (!user) return;
  const progress = getProgress(user);
  if (!progress.attempts[fonema]) progress.attempts[fonema] = { correct: 0, incorrect: 0 };
  progress.attempts[fonema][correct ? "correct" : "incorrect"]++;
  saveUserRecords({ [sessionEmail]: user });
}

// ══════════════════════════════════════════════
// TREINO — cada fase mostra apenas seus próprios fonemas
// ══════════════════════════════════════════════
function initApp() {
  finalScreen.classList.add("hidden");
  mainCard.classList.remove("hidden");
  buildProgressBar();
  loadChallenge();
  // A permissão de microfone já foi perguntada uma única vez, ao entrar no
  // app (ver bootstrapMicPermission) — aqui só refletimos o estado atual.
}

function buildProgressBar() {
  progressWrap.innerHTML = "";
  const groupPhonemes = (grupos[phaseGroupIndex] && grupos[phaseGroupIndex].fonemas) || [];
  groupPhonemes.forEach((f, li) => {
    const seg = document.createElement("div");
    seg.className = "prog-segment";
    seg.id = `seg-${li}`;
    seg.style.setProperty("--seg-flex", 1);
    seg.innerHTML = `<div class="prog-seg-track"><div class="prog-seg-fill" id="seg-fill-${li}"></div></div><div class="prog-seg-label" aria-hidden="true">${escapeHtml(f)}</div><span class="sr-only" id="seg-status-${li}"></span>`;
    progressWrap.appendChild(seg);
  });
}

const SEGMENT_STATUS_CLASSES = ["status-correct", "status-incorrect", "status-skipped"];

// Rótulo de status em texto — o preenchimento colorido (verde/vermelho/
// cinza) do segmento nunca é a ÚNICA forma de saber o resultado: cada
// segmento também guarda esse texto num <span> visualmente oculto
// (.sr-only), lido por leitor de tela mesmo sem enxergar a cor.
function segmentStatusText(f, status, isCurrent, isUpcoming) {
  if (isCurrent) return `${f}: fonema atual`;
  if (isUpcoming) return `${f}: ainda não respondido`;
  if (status === "correct") return `${f}: acertado`;
  if (status === "incorrect") return `${f}: errado`;
  return `${f}: pulado`;
}

function updateProgress() {
  const local = fonemaLocal[currentIndex];
  const groupPhonemes = (grupos[phaseGroupIndex] && grupos[phaseGroupIndex].fonemas) || [];
  groupPhonemes.forEach((f, li) => {
    const fill = document.getElementById(`seg-fill-${li}`);
    const seg  = document.getElementById(`seg-${li}`);
    const statusEl = document.getElementById(`seg-status-${li}`);
    if (!fill || !seg) return;
    fill.classList.remove(...SEGMENT_STATUS_CLASSES);
    const status = phaseSegmentStatus[li];
    if (li < local) {
      // acertado = verde, errado = vermelho, pulado = cinza
      fill.style.width = "100%"; seg.classList.remove("active");
      if (status === "correct") fill.classList.add("status-correct");
      else if (status === "incorrect") fill.classList.add("status-incorrect");
      else fill.classList.add("status-skipped");
      if (statusEl) statusEl.textContent = segmentStatusText(f, status, false, false);
    } else if (li === local) {
      fill.style.width = "0%"; seg.classList.add("active");
      if (statusEl) statusEl.textContent = segmentStatusText(f, status, true, false);
    } else {
      fill.style.width = "0%"; seg.classList.remove("active");
      if (statusEl) statusEl.textContent = segmentStatusText(f, status, false, true);
    }
  });
  phaseCurrent.textContent = currentIndex - phaseStartIndex + 1;
  updateSkipButtonState();
}

function loadChallenge() {
  const fonema = desafios[currentIndex];
  phonemeDisplay.textContent = fonema;
  tipText.textContent        = getDica(fonema);
  const gi = fonemaGrupo[currentIndex];
  groupLabel.textContent = `Grupo ${gi + 1} — ${grupos[gi].nome}`;
  updateProgress();
  const btnPrev = document.getElementById("btn-prev");
  if (btnPrev) btnPrev.disabled = currentIndex <= phaseStartIndex;
  phonemeBox.classList.remove("recording");
  btnRecord.classList.remove("active");
  btnRecord.querySelector(".btn-label").textContent = "Gravar Voz";
  stopAudio();
  clearCanvas();
  waveformIdle.classList.remove("hidden-label");
  resetSuccessBadge();
  animateCardEnter();
  updateMicBlockedUI();
  // Som sustentado: troca a instrução e mostra a barra de progresso de
  // tempo sustentado (a própria startAudio() zera sustainTargetMs de novo
  // quando a gravação começar; aqui é só o estado visual em repouso).
  const sustainSec = activeSustainConfig[fonema] || 0;
  const instructionEl = document.getElementById("challenge-instruction");
  const sustainWrap = document.getElementById("sustain-progress");
  if (instructionEl) instructionEl.textContent = sustainSec ? `Segure o som abaixo por ${sustainSec} segundos` : "Pronuncie o fonema abaixo";
  if (sustainWrap) sustainWrap.classList.toggle("hidden", !sustainSec);
  if (sustainSec) updateSustainProgressUI(0, sustainSec * 1000);
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

// Sem microfone, o paciente ainda navega livremente pelo app (trilha,
// fonemas, pronúncia), mas não pode confirmar um exercício como concluído
// sem verificação nenhuma — o botão de gravar fica bloqueado e um convite
// para ativar o microfone é mostrado no lugar, em vez de acertar tudo
// automaticamente.
function updateMicBlockedUI() {
  const notice = document.getElementById("mic-blocked-notice");
  const wrap = document.querySelector(".waveform-wrapper");
  if (!notice) return;
  const blocked = micDenied && !micGranted;
  notice.classList.toggle("hidden", !blocked);
  if (wrap) wrap.classList.toggle("hidden", blocked);
  btnRecord.disabled = blocked;
  btnRecord.classList.toggle("btn-disabled", blocked);
}

function resetSuccessBadge() {
  const badge = document.getElementById("success-badge");
  if (!badge) return;
  badge.classList.remove("show", "wrong");
  badge.classList.add("hidden");
}
function flashSuccess(correct) {
  const badge = document.getElementById("success-badge");
  if (!badge) return;
  const isWrong = correct === false;
  badge.classList.toggle("wrong", isWrong);
  badge.innerHTML = isWrong
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  badge.classList.remove("hidden");
  requestAnimationFrame(() => badge.classList.add("show"));
  // O ícone é só visual (aria-hidden) — quem usa leitor de tela precisa
  // ouvir o resultado da tentativa de algum jeito (ver A3 na auditoria).
  const announce = document.getElementById("recording-result-announce");
  if (announce) announce.textContent = isWrong ? "Errado" : "Certo";
}
function animateCardEnter() {
  mainCard.classList.remove("challenge-enter");
  void mainCard.offsetWidth;
  mainCard.classList.add("challenge-enter");
}

// ── Navegação ──────────────────────────────────
function prevChallenge() {
  if (isRecording) stopAudio();
  if (currentIndex > phaseStartIndex) { currentIndex--; loadChallenge(); playBeep(400, 0.08); }
}
// Limite de pulos por fase — vale para todas, inclusive fases
// personalizadas do médico, sem exceção de tamanho. Usa phaseSkipsUsed
// (contador que só sobe) em vez de contar quantos segmentos estão
// "skipped" AGORA — essa contagem baixava se o paciente voltasse com
// "Desafio anterior" e respondesse um pulado, reabrindo uma vaga de
// pulo indefinidamente (ver F6 na auditoria).
function skipChallenge() {
  // Administrador: sem limite de pulos por fase (ver isCurrentUserAdmin).
  const isAdmin = isCurrentUserAdmin();
  if (!isAdmin && phaseSkipsUsed >= SKIP_LIMIT_PER_PHASE) return;
  if (isRecording) stopAudio();
  phaseSegmentStatus[currentIndex - phaseStartIndex] = "skipped";
  phaseSkipsUsed++;
  playBeep(480, 0.08);
  if (!isAdmin && phaseSkipsUsed >= SKIP_LIMIT_PER_PHASE) {
    showToast("Limite de 3 pulos nesta fase — os próximos exercícios precisam ser respondidos.");
  }
  advance();
}
function updateSkipButtonState() {
  const skipBtn = document.getElementById("btn-skip");
  if (!skipBtn) return;
  const reachedLimit = !isCurrentUserAdmin() && phaseSkipsUsed >= SKIP_LIMIT_PER_PHASE;
  skipBtn.disabled = reachedLimit;
  skipBtn.title = reachedLimit ? "Limite de 3 pulos nesta fase já foi usado" : "";
}
function advance() {
  currentIndex++;
  if (currentIndex > phaseEndIndex) finishPhase();
  else loadChallenge();
}

// Estado de carregamento genérico para botões que disparam uma ação
// assíncrona real (ex.: pedir permissão de microfone, que espera o
// diálogo nativo do navegador — pode levar alguns segundos se a pessoa
// hesitar). Troca o conteúdo por um spinner e desabilita o clique
// duplo; sempre restaura o texto original ao terminar, mesmo em erro.
function setBtnLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    if (btn.dataset.loading === "1") return;
    btn.dataset.loading = "1";
    btn.dataset.originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';
  } else {
    if (btn.dataset.loading !== "1") return;
    delete btn.dataset.loading;
    btn.innerHTML = btn.dataset.originalHtml || btn.innerHTML;
    delete btn.dataset.originalHtml;
    btn.disabled = false;
  }
}

// ── Microfone ─────────────────────────────────
// Pergunta pela permissão UMA ÚNICA VEZ, assim que o paciente entra no app
// (chamado a partir de applyUserToUI) — não mais a cada fase. Uma vez
// perguntado nesta instalação (vozativa_mic_asked), sessões seguintes só
// tentam usar a permissão já concedida antes, em silêncio, sem reabrir esta
// tela — o único jeito de o navegador perguntar de novo é se o próprio
// usuário nunca respondeu de fato ao pedido nativo dele.
async function bootstrapMicPermission() {
  watchMicPermissionStatus();
  if (micGranted || micDenied) { micLog("bootstrapMicPermission chamado de novo, mas já resolvido (micGranted=" + micGranted + " micDenied=" + micDenied + ") — ignorado."); return; }
  if (localStorage.getItem("vozativa_mic_asked") === "1") {
    micLog("bootstrap: já perguntado antes neste dispositivo — tentando reusar em silêncio via getUserMedia()");
    try {
      micStream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
      attachMicTrackDiagnostics(micStream, "bootstrapMicPermission (silencioso)");
      micGranted = true;
    } catch (e) {
      micLog("bootstrap: getUserMedia falhou", e && e.name + ": " + e.message);
      micDenied = true;
    }
    updateMicBlockedUI();
    // vozativa_mic_asked é uma flag de DISPOSITIVO, não de conta — numa
    // conta nova no mesmo aparelho onde outra conta já respondeu ao
    // pedido antes, esse "if" é o único caminho percorrido (a tela de
    // permissão nem chega a abrir), então é aqui que o tutorial pendente
    // dessa conta precisa ser retomado, não só no fluxo abaixo.
    resumePendingTourAfterMic();
    return;
  }
  showOverlay(permOverlay);
}
async function requestMicPermission(evt) {
  const btn = evt && evt.currentTarget;
  setBtnLoading(btn, true);
  localStorage.setItem("vozativa_mic_asked", "1");
  micLog("requestMicPermission: pedido explícito pela tela de permissão inicial");
  try { micStream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS); attachMicTrackDiagnostics(micStream, "requestMicPermission"); micGranted = true; }
  catch(e) { micLog("requestMicPermission falhou", e && e.name + ": " + e.message); micDenied = true; }
  setBtnLoading(btn, false);
  hideOverlay(permOverlay);
  updateMicBlockedUI();
  resumePendingTourAfterMic();
}
function skipPermission() {
  localStorage.setItem("vozativa_mic_asked", "1");
  micDenied = true;
  hideOverlay(permOverlay);
  updateMicBlockedUI();
  resumePendingTourAfterMic();
}
// Botão "Ativar microfone" dentro do próprio exercício, para quem pulou ou
// negou a permissão inicial e mudou de ideia — sem precisar recarregar a
// página. Precisa ser chamado a partir de um clique real do usuário.
async function retryMicPermission(evt) {
  const btn = evt && evt.currentTarget;
  setBtnLoading(btn, true);
  localStorage.setItem("vozativa_mic_asked", "1");
  micLog("retryMicPermission: botão 'Ativar microfone' dentro do exercício");
  try {
    micStream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
    attachMicTrackDiagnostics(micStream, "retryMicPermission");
    micGranted = true; micDenied = false;
    playBeep(660, 0.12);
  } catch (e) {
    micLog("retryMicPermission falhou", e && e.name + ": " + e.message);
    micDenied = true;
  }
  setBtnLoading(btn, false);
  updateMicBlockedUI();
}

// ── Gravação — reconhecimento contínuo ────────
// Não é preciso clicar para "parar": assim que o volume detectado cruza o
// limiar de match por tempo suficiente, a gravação é encerrada e o
// resultado confirmado automaticamente. Se ficar em silêncio total pelos
// primeiros 3s, a tentativa é encerrada como incorreta (dá-se uma nova
// chance ao avançar). Um clique manual durante a gravação também encerra,
// usando o pico já captado até aquele momento.
async function toggleRecording() {
  const fonema = desafios[currentIndex];
  // Sem microfone não é possível confirmar nada por voz — o botão já fica
  // desabilitado nesse estado (ver updateMicBlockedUI), isto é só uma trava
  // de segurança extra.
  if (micDenied && !micGranted) return;
  if (isRecording) {
    if (sustainTargetMs > 0) {
      // Som sustentado: um clique manual confirma com base em quanto tempo
      // já foi sustentado até agora, não num intervalo de duração fixo.
      finishRecording(sustainStreakMs >= sustainTargetMs);
    } else if (recognitionOutcome !== null) {
      finishRecording(recognitionOutcome);
    } else {
      const duration = performance.now() - recordingStartTime;
      const { min, max } = expectedDurationRangeMs(fonema);
      finishRecording(recordingPeak > MATCH_VOLUME_THRESHOLD && duration >= min && duration <= max);
    }
  } else {
    await startAudio();
  }
}

function clearRecordingTimers() {
  if (recordingSilenceTimer) { clearTimeout(recordingSilenceTimer); recordingSilenceTimer = null; }
  if (recordingMaxTimer) { clearTimeout(recordingMaxTimer); recordingMaxTimer = null; }
}

async function startAudio() {
  const tracksNow = micStream ? micStream.getTracks() : [];
  const needsNewStream = !micStream || tracksNow.length === 0 || tracksNow.every(t => t.readyState === "ended");
  if (needsNewStream) {
    micLog(
      "startAudio: PRECISOU pedir getUserMedia() de novo — " +
      (!micStream ? "micStream ainda não existia" : tracksNow.length === 0 ? "micStream sem nenhuma faixa" : "todas as faixas já estavam 'ended'"),
      tracksNow.map(t => ({ label: t.label, state: t.readyState }))
    );
    // Se micGranted já era true, isto é uma RE-tentativa (a permissão que
    // já tínhamos foi perdida de algum jeito — revogada pelo usuário, pelo
    // navegador ou pelo sistema) — mensagem diferente da primeira vez,
    // pra deixar claro que algo mudou, não que é a primeira vez pedindo.
    const wasPreviouslyGranted = micGranted;
    try {
      micStream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
      attachMicTrackDiagnostics(micStream, "startAudio (retomada)");
      micGranted = true; micDenied = false;
    }
    catch(e) {
      micLog("startAudio: getUserMedia falhou na retomada", e && e.name + ": " + e.message);
      micDenied = true;
      updateMicBlockedUI();
      showToast(
        wasPreviouslyGranted
          ? "O acesso ao microfone foi revogado. Ative-o de novo nas permissões do navegador para continuar treinando com sua voz."
          : "Não foi possível acessar o microfone.",
        true
      );
      return;
    }
  }
  // Grava esta tentativa (ver fila de aprovação do médico, finishPhase/
  // registerPhaseReview) — se o navegador não suportar MediaRecorder,
  // o exercício continua funcionando normalmente, só sem áudio pra
  // revisão depois (mediaRecorder fica null e stopAudioRecordingForReview
  // não salva nada).
  currentAttemptChunks = [];
  try {
    mediaRecorder = new MediaRecorder(micStream);
    mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) currentAttemptChunks.push(e.data); };
    mediaRecorder.start();
  } catch (e) { mediaRecorder = null; }

  // Reaproveita o MESMO AudioContext (e a MESMA faixa de microfone) entre
  // exercícios em vez de fechar e recriar um a cada tentativa — fechar um
  // AudioContext ligado à mesma faixa de microfone repetidamente é o
  // gatilho mais comum pra o navegador derrubar a sessão de captura por
  // trás dos panos, fazendo o getUserMedia seguinte pedir permissão de
  // novo (era isso que fazia a permissão de microfone ser solicitada a
  // cada exercício).
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } else if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }
  // MAS a ligação fonte→ganho→analisador é recriada a CADA gravação, mesmo
  // com o mesmo AudioContext/faixa — isso é diferente de recriar o
  // AudioContext e não afeta a permissão. É uma falha documentada do
  // WebAudio: um AnalyserNode ligado uma única vez pode, depois de um
  // tempo ou de algumas gravações, parar de receber amostras reais
  // (fica "travado" entregando silêncio) mesmo com a faixa continuando
  // "live" — sem nenhuma reconexão automática do navegador. Reconectar o
  // analisador do zero a cada tentativa evita esse travamento (era isso
  // que fazia o "espectrograma" parar de reagir à voz depois de algumas
  // gravações, mesmo a gravação em si continuando a funcionar).
  if (audioGraphSource) { try { audioGraphSource.disconnect(); } catch (e) {} }
  analyser = audioCtx.createAnalyser();
  // smoothingTimeConstant mais baixo = a barra reage mais rápido ao volume
  // real (menos "atraso" visual e na detecção do fim da fala).
  analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.35;
  // GainNode amplifica o sinal do microfone antes da análise — ajuda a
  // captar vozes mais baixas ou em ambientes com um pouco de ruído, sem
  // exigir nenhuma configuração manual do paciente.
  const micGain = audioCtx.createGain();
  micGain.gain.value = MIC_GAIN;
  audioGraphSource = audioCtx.createMediaStreamSource(micStream);
  audioGraphSource.connect(micGain).connect(analyser);
  audioGraphStream = micStream;
  dataArray = new Uint8Array(analyser.fftSize);
  isRecording = true;
  recordingPeak = 0;
  recordingStartTime = performance.now();
  speechOnsetTime = null;
  lastAboveThresholdTime = null;
  matchDetected = false;
  recognitionOutcome = null;
  // Som sustentado nunca usa reconhecimento de fala real — "TRTRTRTR" ou
  // uma vogal segurada por segundos não é algo que o motor de reconhecimento
  // do navegador reconhece como texto válido; a avaliação é 100% por volume.
  sustainTargetMs = (activeSustainConfig[desafios[currentIndex]] || 0) * 1000;
  sustainStreakMs = 0; sustainGapMs = 0; sustainLastFrameTime = performance.now();
  recognitionActiveForTake = sustainTargetMs === 0 && SpeechRecognitionAPI && !recognitionFailed && startSpeechRecognition(desafios[currentIndex]);
  phonemeBox.classList.add("recording");
  btnRecord.classList.add("active");
  btnRecord.querySelector(".btn-label").textContent = "Ouvindo...";
  waveformIdle.classList.add("hidden-label");
  updateSustainProgressUI(0, sustainTargetMs);
  drawWaveform();

  clearRecordingTimers();
  recordingSilenceTimer = setTimeout(() => {
    if (isRecording && recordingPeak <= MATCH_VOLUME_THRESHOLD) finishRecording(false);
  }, SILENCE_TIMEOUT_MS);
  recordingMaxTimer = setTimeout(() => {
    if (isRecording) finishRecording(false); // tempo esgotado sem um match válido para o fonema
  }, RECORDING_MAX_MS);
}

function stopAudio() {
  isRecording = false;
  clearRecordingTimers();
  stopSpeechRecognition();
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  // NÃO fecha o AudioContext nem larga o analyser aqui — eles são
  // reaproveitados entre exercícios (ver startAudio). Fechar e recriar
  // isso a cada tentativa era a causa real da permissão de microfone
  // sendo pedida de novo a cada exercício. Só suspende (pausa o
  // processamento, sem derrubar a captura) pra economizar recursos
  // enquanto não há gravação em andamento.
  if (audioCtx && audioCtx.state === "running") audioCtx.suspend().catch(() => {});
  // Se chegou até aqui sem passar por stopAudioRecordingForReview (fonema
  // pulado ou tela abandonada no meio de uma gravação), descarta a
  // gravação em andamento sem salvar nada — só tentativas confirmadas via
  // finishRecording entram na fila de aprovação do médico.
  if (mediaRecorder) {
    if (mediaRecorder.state !== "inactive") { try { mediaRecorder.stop(); } catch(e) {} }
    mediaRecorder = null;
  }
  phonemeBox.classList.remove("recording");
  btnRecord.classList.remove("active");
  btnRecord.querySelector(".btn-label").textContent = "Gravar Voz";
  const captureIndicator = document.getElementById("capture-indicator");
  if (captureIndicator) captureIndicator.classList.remove("show");
}

function drawWaveform() {
  if (!isRecording || !analyser) return;
  rafId = requestAnimationFrame(drawWaveform);
  const W = canvas.offsetWidth || 400, H = canvas.offsetHeight || 64;
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
  analyser.getByteTimeDomainData(dataArray);
  ctx2d.clearRect(0, 0, W, H);
  const BAR_COUNT = 60, gap = 2;
  const barW = (W - gap * (BAR_COUNT - 1)) / BAR_COUNT;
  const step = Math.floor(dataArray.length / BAR_COUNT), midY = H / 2;
  let frameMax = 0;
  for (let i = 0; i < BAR_COUNT; i++) {
    let sum = 0;
    for (let j = 0; j < step; j++) sum += Math.abs(dataArray[i * step + j] - 128);
    const avg = sum / step, barH = Math.max(3, (avg / 128) * H * 0.92);
    if (avg > frameMax) frameMax = avg;
    const x = i * (barW + gap), intensity = avg / 80;
    const r = Math.round(30 + intensity * 40), g2 = Math.round(180 + intensity * 40), b = Math.round(80 - intensity * 40);
    ctx2d.fillStyle = `rgba(${r},${g2},${b},${0.55 + intensity * 0.45})`;
    ctx2d.beginPath();
    ctx2d.roundRect ? ctx2d.roundRect(x, midY - barH / 2, barW, barH, barW / 2) : ctx2d.rect(x, midY - barH / 2, barW, barH);
    ctx2d.fill();
  }
  const now = performance.now();
  const currentLevel = frameMax / 128;
  recordingPeak = Math.max(recordingPeak, currentLevel);

  // Indicador visual em tempo real: "captando sua voz" some/aparece de
  // acordo com o volume atual (não o pico acumulado), pra dar retorno claro
  // e imediato de que a fala está sendo ouvida.
  const captureIndicator = document.getElementById("capture-indicator");
  if (captureIndicator) captureIndicator.classList.toggle("show", currentLevel > MATCH_VOLUME_THRESHOLD);

  // Som sustentado: mede tempo contínuo acima do limiar em vez de comparar
  // texto — um blip curto de silêncio (respiração, oclusiva no meio do som)
  // não zera a contagem, só um silêncio real (> SUSTAIN_GAP_TOLERANCE_MS) zera.
  if (sustainTargetMs > 0 && !matchDetected) {
    const dt = now - sustainLastFrameTime;
    sustainLastFrameTime = now;
    if (currentLevel > MATCH_VOLUME_THRESHOLD) {
      sustainStreakMs += dt;
      sustainGapMs = 0;
    } else {
      sustainGapMs += dt;
      if (sustainGapMs > SUSTAIN_GAP_TOLERANCE_MS) sustainStreakMs = 0;
    }
    updateSustainProgressUI(sustainStreakMs, sustainTargetMs);
    if (sustainStreakMs >= sustainTargetMs) {
      matchDetected = true;
      finishRecording(true);
      return;
    }
    if ((now - recordingStartTime) > RECORDING_MAX_MS) {
      matchDetected = true;
      finishRecording(false);
    }
    return;
  }

  // Com reconhecimento real ativo nesta gravação, quem decide acerto/erro é
  // o texto reconhecido (ver startSpeechRecognition/onresult) — o heurístico
  // de volume abaixo só decide quando o reconhecimento real está
  // indisponível ou falhou ao iniciar nesta tentativa específica.
  if (!recognitionActiveForTake && !matchDetected) {
    const isAboveNow = currentLevel > MATCH_VOLUME_THRESHOLD;
    if (isAboveNow) {
      if (speechOnsetTime === null) speechOnsetTime = now;
      lastAboveThresholdTime = now;
    }
    const { max } = expectedDurationRangeMs(desafios[currentIndex]);
    if (speechOnsetTime !== null) {
      const speechDuration = lastAboveThresholdTime - speechOnsetTime;
      const silenceSinceSpeech = now - lastAboveThresholdTime;
      // Confirma logo depois que o paciente PARA de falar (não espera um
      // tempo fixo baseado no tamanho da palavra) — reduz bastante a espera
      // percebida após dizer o fonema, principalmente em palavras curtas.
      if (silenceSinceSpeech >= CAPTURE_RELEASE_MS && speechDuration >= CAPTURE_MIN_MS) {
        matchDetected = true;
        finishRecording(true);
        return;
      }
    }
    if ((now - recordingStartTime) > max) {
      // som presente por tempo maior do que o plausível para esse fonema
      matchDetected = true;
      finishRecording(false);
    }
  }
}

function clearCanvas() {
  const W = canvas.offsetWidth || 400, H = canvas.offsetHeight || 64;
  canvas.width = W; canvas.height = H; ctx2d.clearRect(0, 0, W, H);
}

function updateSustainProgressUI(streakMs, targetMs) {
  const fill = document.getElementById("sustain-progress-fill");
  const label = document.getElementById("sustain-progress-label");
  if (!fill || !label || !targetMs) return;
  const pct = Math.min(100, (streakMs / targetMs) * 100);
  fill.style.width = pct + "%";
  label.textContent = `${(streakMs / 1000).toFixed(1)}s / ${(targetMs / 1000).toFixed(0)}s`;
}

// Encerra a gravação desta tentativa e salva o áudio no IndexedDB pra
// entrar na fila de aprovação do médico (ver registerPhaseReview em
// finishPhase) — só chamado quando a tentativa É CONFIRMADA
// (finishRecording), nunca em abandono/pulo (esses só passam por
// stopAudio, que descarta a gravação em andamento sem salvar).
function stopAudioRecordingForReview(segIdx) {
  if (!mediaRecorder || mediaRecorder.state === "inactive") { mediaRecorder = null; return; }
  const rec = mediaRecorder, chunks = currentAttemptChunks;
  const myGeneration = phaseAttemptGeneration;
  const myGroupIndex = phaseGroupIndex;
  mediaRecorder = null;
  rec.onstop = () => {
    if (!chunks.length) return;
    const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
    const id = newMediaId();
    saveMediaBlob(id, blob).then(() => {
      // Se a fase foi reiniciada/abandonada enquanto isto salvava, essa
      // geração já não existe mais — descarta em vez de escrever o id
      // velho num array que já é de outra tentativa (ver T2/F2).
      if (myGeneration !== phaseAttemptGeneration) { deleteMediaBlob(id); return; }
      phaseAttemptMediaIds[segIdx] = id;
      // Corrida rara: a revisão da fase já foi criada (finishPhase rodou)
      // antes deste salvamento terminar — o registro persistido já existe
      // com mediaId nulo pra este índice; corrige direto nele também,
      // pra o áudio não ficar sem dono nenhum (ver F2).
      if (phaseAttemptCommitted) attachMediaToCommittedReview(myGroupIndex, segIdx, id);
    }).catch(() => {});
  };
  try { rec.stop(); } catch(e) {}
}

// Anexa um áudio que terminou de salvar DEPOIS que a revisão da fase já
// foi persistida (ver stopAudioRecordingForReview) — busca a revisão
// pendente mais recente daquele grupo cujo attempt naquele índice ainda
// não tem mediaId, e completa.
function attachMediaToCommittedReview(groupIndex, segIdx, mediaId) {
  if (!sessionEmail || !grupos[groupIndex]) return;
  const users = getUsers();
  const user = users[sessionEmail];
  if (!user) return;
  const progress = getProgress(user);
  const review = (progress.reviews || []).find(r =>
    r.groupId === grupos[groupIndex].id && r.status === "pendente" &&
    r.attempts[segIdx] && !r.attempts[segIdx].mediaId
  );
  if (!review) { deleteMediaBlob(mediaId); return; }
  review.attempts[segIdx].mediaId = mediaId;
  saveUserRecords({ [sessionEmail]: user });
}

// Libera (apaga do IndexedDB) qualquer áudio de tentativa já gravado na
// fase atual que nunca chegou a entrar numa revisão do médico — chamado
// sempre que uma tentativa de fase é abandonada ou reiniciada
// (startPhase, restartPhase, backToPath), pra nenhuma gravação órfã
// sobreviver a "Voltar"/"Tentar novamente" (ver T2 na auditoria).
function releasePendingPhaseAttempts() {
  if (!phaseAttemptCommitted) {
    phaseAttemptMediaIds.forEach(id => { if (id) releaseMediaBlob(id); });
  }
  phaseAttemptGeneration++;
}

// Confirma e encerra a gravação (chamado automaticamente pelo match
// contínuo, pelo timeout de silêncio/duração máxima, ou por clique manual).
function finishRecording(correct) {
  if (!isRecording) return;
  const fonema = desafios[currentIndex];
  // Só é "verificado por voz de verdade" quando o reconhecimento de fala
  // real deu o resultado — som sustentado e o heurístico de volume/duração
  // (reserva quando o reconhecimento não respondeu a tempo) não confirmam
  // que o som era o fonema certo, só volume e tempo (ver G1 na auditoria).
  const verified = sustainTargetMs === 0 && recognitionOutcome !== null;
  stopAudioRecordingForReview(currentIndex - phaseStartIndex);
  stopAudio();
  playBeep(correct ? 620 : 460, 0.1);
  flashSuccess(correct);
  phaseSegmentStatus[currentIndex - phaseStartIndex] = correct ? "correct" : "incorrect";
  phaseAttemptVerified[currentIndex - phaseStartIndex] = verified;
  registerAttempt(fonema, correct);
  // Espera só o suficiente pra animação do selo de acerto/erro (.3s) ser
  // percebida antes de avançar — reduzido de 550ms para diminuir a demora
  // depois que o paciente já terminou de responder.
  setTimeout(() => advance(), 380);
}

// ══════════════════════════════════════════════
// NÍVEL DE REVISÃO — fonemas rejeitados pelo médico (ver G3 na auditoria)
// ──────────────────────────────────────────────
// Um nó separado na trilha, fora da cadeia normal de fases: nunca
// bloqueia nem desbloqueia nada, começa apagado/inclicável e só fica
// colorido/clicável quando há pelo menos um fonema rejeitado esperando
// nova tentativa. Reaproveita a MESMA tela de treino (loadChallenge,
// toggleRecording, etc.) trocando temporariamente grupos/desafios por um
// grupo sintético — sem nunca gravar nada em completedGroupIds, no
// ranking ou na fila de aprovação do médico, porque não é uma fase real.
// ══════════════════════════════════════════════
let isRemedialMode = false;
let savedGrupos = null, savedDesafios = null, savedFonemaGrupo = null, savedFonemaLocal = null;

function uniqueRejectedFonemas(progress) {
  const seen = new Set();
  return (progress.rejectedFonemas || []).filter(r => {
    if (seen.has(r.fonema)) return false;
    seen.add(r.fonema);
    return true;
  });
}

function startRemedialPhase() {
  const users = getUsers();
  const user = users[sessionEmail];
  if (!user) return;
  const progress = getProgress(user);
  const items = uniqueRejectedFonemas(progress);
  if (!items.length) return; // nó apagado — nada pra revisar agora

  savedGrupos = grupos; savedDesafios = desafios;
  savedFonemaGrupo = fonemaGrupo.slice(); savedFonemaLocal = fonemaLocal.slice();

  const remedialGroup = { id: "__remedial__", nome: "Revisão", short: "Rev", fonemas: items.map(i => i.fonema) };
  grupos = [remedialGroup];
  desafios = remedialGroup.fonemas.slice();
  fonemaGrupo = desafios.map(() => 0);
  fonemaLocal = desafios.map((_, i) => i);
  isRemedialMode = true;

  releasePendingPhaseAttempts();
  phaseSkipsUsed = 0;
  phaseAttemptCommitted = false;
  phaseGroupIndex = 0;
  phaseStartIndex = 0;
  phaseEndIndex = desafios.length - 1;
  currentIndex = 0;
  phaseSegmentStatus = new Array(desafios.length).fill(null);
  phaseAttemptMediaIds = new Array(desafios.length).fill(null);
  phaseAttemptVerified = new Array(desafios.length).fill(null);
  phaseTotal.textContent = desafios.length;
  statTotal.textContent = desafios.length;
  showOnlyScreen("app");
  initApp();
}

// Desfaz a troca temporária de grupos/desafios — chamado sempre que se
// sai da tela de treino (ver backToPath), pra trilha voltar a mostrar as
// fases de verdade em vez do grupo sintético de revisão.
function exitRemedialMode() {
  if (!isRemedialMode) return;
  grupos = savedGrupos; desafios = savedDesafios;
  fonemaGrupo = savedFonemaGrupo; fonemaLocal = savedFonemaLocal;
  savedGrupos = savedDesafios = savedFonemaGrupo = savedFonemaLocal = null;
  isRemedialMode = false;
}

function finishRemedialAttempt(correctCount, incorrectCount, skippedCount, scorePct, phaseLen) {
  const users = getUsers();
  const user = users[sessionEmail];
  if (user) {
    const progress = getProgress(user);
    // Fonema respondido CERTO agora sai da lista — o que ainda saiu
    // errado ou foi pulado continua pendente pra próxima tentativa.
    desafios.forEach((f, i) => {
      if (phaseSegmentStatus[i] === "correct") {
        progress.rejectedFonemas = progress.rejectedFonemas.filter(r => r.fonema !== f);
      }
    });
    registerStreakForToday(progress); // pratica do dia conta streak também
    saveUserRecords({ [sessionEmail]: user });
  }
  mainCard.classList.add("hidden");
  finalScreen.classList.remove("hidden");
  const allCleared = correctCount === phaseLen;
  document.getElementById("final-group-name").textContent = "Revisão";
  document.getElementById("final-title").textContent = allCleared ? "Revisão concluída!" : "Quase lá!";
  document.getElementById("final-subtitle-lead").textContent = allCleared
    ? "Você revisou todos os fonemas pendentes em"
    : "Você revisou os fonemas pendentes em";
  document.getElementById("final-message").textContent = allCleared
    ? "Ótimo trabalho! Não há mais nada pendente de revisão."
    : "Os fonemas que ainda não saíram certo continuam na Revisão.";
  document.getElementById("final-next-label").textContent = "Voltar à trilha";
  const medalEl = document.querySelector(".final-medal");
  medalEl.classList.remove("tier-blue", "tier-gray");
  if (!allCleared) medalEl.classList.add("tier-blue");
  statTotal.textContent = phaseLen;
  statCorrect.textContent = correctCount;
  document.getElementById("stat-wrong").textContent = incorrectCount;
  document.getElementById("stat-skipped").textContent = skippedCount;
  document.getElementById("final-stats-summary").textContent =
    `${phaseLen} ${phaseLen === 1 ? "fonema revisado" : "fonemas revisados"}, ${correctCount} ${correctCount === 1 ? "confirmado" : "confirmados"}.`;
  if (allCleared && !reducedMotion) startFinalConfetti();
  playBeep(880, 0.3, "triangle", 0.25);
}

// ── Fase concluída ────────────────────────────
function finishPhase() {
  // Pinta todos os segmentos da fase (inclusive o último, que nunca passa
  // por updateProgress() de novo depois de respondido) de acordo com o
  // status real registrado — sem isso o último ficava sempre verde,
  // porque só a largura ia a 100%, sem a classe de status certa.
  (grupos[phaseGroupIndex].fonemas || []).forEach((_, li) => {
    const fill = document.getElementById(`seg-fill-${li}`);
    if (!fill) return;
    fill.style.width = "100%";
    fill.classList.remove(...SEGMENT_STATUS_CLASSES);
    const status = phaseSegmentStatus[li];
    if (status === "incorrect") fill.classList.add("status-incorrect");
    else if (status === "skipped") fill.classList.add("status-skipped");
    else fill.classList.add("status-correct");
  });
  mainCard.classList.add("hidden");
  finalScreen.classList.remove("hidden");

  const isLast = phaseGroupIndex === grupos.length - 1;
  document.getElementById("final-group-name").textContent = grupos[phaseGroupIndex].nome;
  const phaseLen = phaseEndIndex - phaseStartIndex + 1;
  // Contagem real e explícita: acerto de fala soma em "acertadas"; silêncio
  // (tempo esgotado sem match) e "pular esse desafio" somam em "puladas" —
  // não em acerto nenhum, diferente do completedCount antigo, que misturava
  // tentativas erradas com concluídas e não batia com a mensagem/medalha.
  const correctCount   = phaseSegmentStatus.filter(s => s === "correct").length;
  const incorrectCount = phaseSegmentStatus.filter(s => s === "incorrect").length;
  const skippedCount   = phaseSegmentStatus.filter(s => s === "skipped" || s === null).length;
  const scorePct = phaseLen ? Math.floor((correctCount / phaseLen) * 100) : 100;

  // Nível de Revisão (fonemas rejeitados pelo médico, ver G3 na
  // auditoria) tem seu próprio fechamento — nunca entra em
  // completedGroupIds/ranking/fila de aprovação, porque "__remedial__"
  // não é uma fase real da trilha.
  if (isRemedialMode) {
    finishRemedialAttempt(correctCount, incorrectCount, skippedCount, scorePct, phaseLen);
    return;
  }

  // Só entra em completedGroupIds (o que desbloqueia a próxima fase e conta
  // para o ranking de amigos) quando o aproveitamento real atinge o limiar
  // — ver PHASE_COMPLETION_THRESHOLD. A streak é registrada de todo jeito,
  // pela prática do dia, dentro da própria função.
  registerPhaseAttempt(grupos[phaseGroupIndex].id, scorePct);
  registerPhaseReview(grupos[phaseGroupIndex], scorePct);
  phaseAttemptCommitted = true;
  const completedForReal = scorePct >= PHASE_COMPLETION_THRESHOLD;

  document.getElementById("final-title").textContent = !completedForReal ? "Quase lá!" : (isLast ? "Parabéns!" : "Fase concluída!");
  document.getElementById("final-subtitle-lead").textContent = !completedForReal
    ? "Você tentou a fase"
    : (isLast ? "Você completou toda a trilha do VozAtiva, terminando na fase" : "Você completou a fase");
  document.getElementById("final-message").textContent = completedForReal ? randomFinalMessage() : randomLowFinalMessage();
  document.getElementById("final-next-label").textContent = !completedForReal ? "Voltar à trilha" : (isLast ? "Concluir trilha" : "Próxima fase");
  // A medalha fica sempre visível — só a cor muda com o aproveitamento:
  // dourado (100%, perfeito), azul (do limiar de conclusão até 99%, bom) e
  // cinza (abaixo do limiar — a fase ainda não conta como concluída).
  const medalEl = document.querySelector(".final-medal");
  medalEl.classList.remove("tier-blue", "tier-gray");
  if (scorePct >= 100) { /* dourado — cor padrão do SVG, nenhuma classe extra */ }
  else if (completedForReal) medalEl.classList.add("tier-blue");
  else medalEl.classList.add("tier-gray");
  statTotal.textContent = phaseLen;
  statCorrect.textContent = correctCount;
  document.getElementById("stat-wrong").textContent = incorrectCount;
  document.getElementById("stat-skipped").textContent = skippedCount;
  // Deixa explícito que errar e pular pesam igual pra fins de conclusão
  // — sem isso, nada no resumo dizia que as duas coisas eram
  // equivalentes (ver G10 na auditoria).
  document.getElementById("final-stats-summary").textContent =
    `${phaseLen} ${phaseLen === 1 ? "questão proposta" : "questões propostas"}, ${correctCount} ${correctCount === 1 ? "acertada" : "acertadas"}, ${incorrectCount} ${incorrectCount === 1 ? "errada" : "erradas"} e ${skippedCount} ${skippedCount === 1 ? "pulada" : "puladas"}.` +
    (incorrectCount || skippedCount ? " Erros e pulos não contam como fonema dominado — só o que sai certo conta pra concluir a fase." : "");

  if (completedForReal && !reducedMotion) startFinalConfetti();
  playBeep(880, 0.3, "triangle", 0.25);
}

function restartPhase() {
  releasePendingPhaseAttempts();
  phaseSkipsUsed = 0;
  phaseAttemptCommitted = false;
  currentIndex = phaseStartIndex;
  phaseSegmentStatus = new Array(phaseEndIndex - phaseStartIndex + 1).fill(null);
  phaseAttemptMediaIds = new Array(phaseEndIndex - phaseStartIndex + 1).fill(null);
  phaseAttemptVerified = new Array(phaseEndIndex - phaseStartIndex + 1).fill(null);
  stopFinalConfetti(); finalScreen.classList.add("hidden");
  mainCard.classList.remove("hidden"); buildProgressBar(); loadChallenge();
}

function backToPath() {
  if (isRecording) stopAudio();
  // Só libera áudio se a fase foi abandonada ANTES de terminar — se já
  // passou por finishPhase, releasePendingPhaseAttempts não mexe em nada
  // (ver phaseAttemptCommitted).
  releasePendingPhaseAttempts();
  const wasRemedial = isRemedialMode;
  exitRemedialMode(); // restaura grupos/desafios reais antes de renderizar a trilha
  stopFinalConfetti();
  finalScreen.classList.add("hidden");
  mainCard.classList.remove("hidden");
  showOnlyScreen("path");
  renderPathTree(false, wasRemedial ? undefined : phaseGroupIndex + 1);
}

// Ao sair de uma fase em andamento (via botão "Voltar"), avisa que o
// progresso da fase atual (posição no fonema) será perdido.
function requestLeavePhase() {
  if (!finalScreen.classList.contains("hidden")) { backToPath(); return; }
  openModal("leave-phase-modal");
}
function confirmLeavePhase() {
  closeModal("leave-phase-modal");
  backToPath();
}

// ── Confetti ───────────────────────────────────
let confettiRaf = null;
const confettiPieces = [];
const CONFETTI_COLORS = ["#79ed94","#3ecf63","#fbbf24","#fb923c","#f472b6","#a78bfa","#38bdf8","#f87171","#fff"];

function startFinalConfetti() {
  const cvs = document.getElementById("final-confetti-canvas");
  confettiPieces.length = 0;
  const W = cvs.offsetWidth || 400;
  for (let i = 0; i < 140; i++) {
    confettiPieces.push({
      x: Math.random() * W, y: -10 - Math.random() * 340,
      w: 5 + Math.random() * 11, h: 8 + Math.random() * 14,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      vx: (Math.random() - 0.5) * 2.8, vy: 2.2 + Math.random() * 3.5,
      rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 7,
      round: Math.random() > 0.5, alpha: 0.7 + Math.random() * 0.3,
    });
  }
  function tick() {
    const W2 = cvs.offsetWidth || 400, H2 = cvs.offsetHeight || 560;
    cvs.width = W2; cvs.height = H2;
    const c = cvs.getContext("2d"); c.clearRect(0, 0, W2, H2);
    let alive = false;
    for (const p of confettiPieces) {
      p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
      if (p.y < H2 + 20) alive = true;
      c.save(); c.globalAlpha = p.alpha; c.translate(p.x, p.y); c.rotate(p.rot * Math.PI / 180);
      c.fillStyle = p.color; c.beginPath();
      if (p.round) c.arc(0, 0, p.w / 2, 0, Math.PI * 2); else c.rect(-p.w / 2, -p.h / 2, p.w, p.h);
      c.fill(); c.restore();
    }
    if (alive) confettiRaf = requestAnimationFrame(tick);
  }
  confettiRaf = requestAnimationFrame(tick);
}

function stopFinalConfetti() {
  if (confettiRaf) { cancelAnimationFrame(confettiRaf); confettiRaf = null; }
}

// ══════════════════════════════════════════════
// MÉDICO — EDITOR DE EXERCÍCIOS POR PACIENTE
// ══════════════════════════════════════════════
let adminEditorPatientEmail = null;

function openAdminEditor(patientEmail) {
  const users = getUsers();
  const patient = users[patientEmail];
  if (!patient) return;
  adminEditorPatientEmail = patientEmail;
  setActiveContent(patient);
  document.getElementById("admin-editor-patient-name").textContent = `Paciente: ${patient.name}`;
  populateAdminGroupSelect();
  cancelEditExercise();
  renderCustomExerciseList();
  renderPhysicalExerciseList();
  renderGroupOrderList();
  openPanel("admin-editor-panel");
}

function populateAdminGroupSelect() {
  const select = document.getElementById("admin-ex-group");
  if (!select) return;
  const prevValue = select.value;
  select.innerHTML = "";
  grupos.forEach((g, gi) => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = `${gi + 1}. ${g.nome}`;
    select.appendChild(opt);
  });
  if (prevValue && grupos.some(g => g.id === prevValue)) select.value = prevValue;
}

function createCustomGroup() {
  if (!adminEditorPatientEmail) return;
  const nameInput = document.getElementById("admin-group-name");
  const name = nameInput.value.trim();
  if (!name) return;
  const shortLabel = (name.match(/\S+/g) || ["NG"]).map(w => w[0]).join("").slice(0, 3).toUpperCase();
  const id = "custom-" + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);

  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  if (!patient) return;
  ensureGroupOrder(patient);
  // Não entra em groupOrder ainda — um grupo sem nenhum exercício não
  // pode virar nó clicável na trilha do paciente (tela quebrava com
  // "undefined", ver F1 na auditoria). Entra em groupOrder só quando o
  // primeiro exercício for adicionado a ele (ver addCustomExercise).
  patient.customContent.groups.push({ id, nome: name, short: shortLabel });
  if (!saveUserRecords({ [adminEditorPatientEmail]: patient })) return;

  setActiveContent(patient);
  nameInput.value = "";
  populateAdminGroupSelect();
  renderGroupOrderList();
  playBeep(660, 0.1);
}

// null = criando um exercício novo; número = índice (em
// patient.customContent.exercises) do exercício sendo editado.
let editingExerciseIndex = null;

function addCustomExercise() {
  const errorEl = document.getElementById("admin-ex-error");
  errorEl.classList.add("hidden");
  if (!adminEditorPatientEmail) return;

  const groupId = val("admin-ex-group");
  const text = val("admin-ex-text").trim().toUpperCase();
  const tip = val("admin-ex-tip").trim();
  const fileInput = document.getElementById("admin-ex-audio");
  const targetGroup = grupos.find(g => g.id === groupId);
  const isEditing = editingExerciseIndex !== null;

  // Som sustentado (opcional): em vez de comparar um fonema único, pede
  // pro paciente segurar o som (ex.: "AAAAAAA", "TRTRTRTR") por N segundos.
  const sustainRaw = val("admin-ex-sustain").trim();
  let sustainSec = 0;
  if (sustainRaw) {
    sustainSec = Number(sustainRaw);
    if (!Number.isFinite(sustainSec) || sustainSec < 1 || sustainSec > 6) {
      errorEl.textContent = "A duração do som sustentado deve ser entre 1 e 6 segundos.";
      errorEl.classList.remove("hidden");
      return;
    }
  }

  if (!groupId || !targetGroup) { errorEl.textContent = "Selecione um grupo válido."; errorEl.classList.remove("hidden"); return; }
  if (!text) { errorEl.textContent = "Informe a sílaba, palavra ou som sustentado."; errorEl.classList.remove("hidden"); return; }
  if (!tip) { errorEl.textContent = "Informe a instrução de pronúncia."; errorEl.classList.remove("hidden"); return; }
  const usersForCheck = getUsers();
  const patientForCheck = usersForCheck[adminEditorPatientEmail];
  const currentExercise = isEditing && patientForCheck ? patientForCheck.customContent.exercises[editingExerciseIndex] : null;
  const isUnchangedSelf = currentExercise && currentExercise.groupId === groupId && currentExercise.text === text;
  if (!isUnchangedSelf && targetGroup.fonemas.includes(text)) { errorEl.textContent = "Esse item já existe nesse grupo."; errorEl.classList.remove("hidden"); return; }

  const finish = (audioDataUrl, audioProvided) => {
    const users = getUsers();
    const patient = users[adminEditorPatientEmail];
    if (!patient) return;
    ensureGroupOrder(patient);
    const cc = patient.customContent;

    const exerciseRecord = { groupId, text };
    if (sustainSec) exerciseRecord.sustainSec = sustainSec;
    if (isEditing && cc.exercises[editingExerciseIndex]) {
      const oldText = cc.exercises[editingExerciseIndex].text;
      cc.exercises[editingExerciseIndex] = exerciseRecord;
      if (oldText !== text) {
        delete cc.dicas[oldText];
        const oldAudio = cc.audio[oldText];
        const oldTextStillUsed = cc.exercises.some((ex, i) => i !== editingExerciseIndex && ex.text === oldText);
        if (!oldTextStillUsed) delete cc.audio[oldText];
        if (!audioProvided && oldAudio && !oldTextStillUsed) cc.audio[text] = oldAudio;
      }
    } else {
      cc.exercises.push(exerciseRecord);
    }
    cc.dicas[text] = tip;
    if (audioProvided) cc.audio[text] = audioDataUrl;
    saveUserRecords({ [adminEditorPatientEmail]: patient });

    setActiveContent(patient);
    cancelEditExercise();
    renderCustomExerciseList();
    playBeep(660, 0.1);
  };

  const file = fileInput.files[0];
  if (file) {
    if (file.size > AUDIO_MAX_BYTES) {
      errorEl.textContent = `Áudio muito grande (máx. ${Math.round(AUDIO_MAX_BYTES / 1024 / 1024)}MB). Escolha um arquivo menor.`;
      errorEl.classList.remove("hidden");
      return;
    }
    const reader = new FileReader();
    reader.onload = e => finish(e.target.result, true);
    reader.readAsDataURL(file);
  } else {
    finish(null, false);
  }
}

// Preenche o formulário de "Adicionar sílaba ou palavra" com os dados do
// exercício selecionado e muda o botão para "Salvar alterações" — reaproveita
// o mesmo formulário em vez de duplicar uma edição embutida na linha.
function startEditExercise(index) {
  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  if (!patient) return;
  const ex = patient.customContent.exercises[index];
  if (!ex) return;
  editingExerciseIndex = index;
  document.getElementById("admin-ex-group").value = ex.groupId;
  document.getElementById("admin-ex-text").value = ex.text;
  document.getElementById("admin-ex-tip").value = patient.customContent.dicas[ex.text] || "";
  document.getElementById("admin-ex-audio").value = "";
  document.getElementById("admin-ex-sustain").value = ex.sustainSec || "";
  document.getElementById("admin-ex-error").classList.add("hidden");
  document.getElementById("admin-ex-submit-btn").textContent = "Salvar alterações";
  document.getElementById("admin-ex-cancel-btn").classList.remove("hidden");
  document.getElementById("admin-ex-text").focus();
}
function cancelEditExercise() {
  editingExerciseIndex = null;
  document.getElementById("admin-ex-text").value = "";
  document.getElementById("admin-ex-tip").value = "";
  document.getElementById("admin-ex-audio").value = "";
  document.getElementById("admin-ex-sustain").value = "";
  document.getElementById("admin-ex-error").classList.add("hidden");
  document.getElementById("admin-ex-submit-btn").textContent = "Adicionar exercício";
  document.getElementById("admin-ex-cancel-btn").classList.add("hidden");
}

// ── Excluir exercício personalizado ──
function requestDeleteExercise(index) {
  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  const ex = patient && patient.customContent.exercises[index];
  if (!ex) return;
  document.getElementById("delete-exercise-question").textContent = `Excluir o exercício "${ex.text}"?`;
  requestConfirmAction(index, "delete-exercise-modal");
}
function executeDeleteExercise() {
  if (pendingConfirmTarget === null || !adminEditorPatientEmail) { closeModal("delete-exercise-modal"); return; }
  const index = pendingConfirmTarget;
  pendingConfirmTarget = null;
  closeModal("delete-exercise-modal");

  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  if (!patient) return;
  const cc = patient.customContent;
  const ex = cc.exercises[index];
  if (!ex) return;
  cc.exercises.splice(index, 1);
  const stillUsed = cc.exercises.some(e => e.text === ex.text);
  if (!stillUsed) { delete cc.dicas[ex.text]; delete cc.audio[ex.text]; }
  saveUserRecords({ [adminEditorPatientEmail]: patient });

  setActiveContent(patient);
  if (editingExerciseIndex === index) cancelEditExercise();
  renderCustomExerciseList();
  playBeep(300, 0.1);
}

// ══════════════════════════════════════════════
// EXERCÍCIOS FÍSICOS/PRÁTICOS — categoria à parte da trilha diária
// ──────────────────────────────────────────────
// Vídeos complementares ao tratamento, adicionados pelo médico por
// paciente (mesmo isolamento por conta que o resto do customContent):
// exercícios com auxílio de objeto (ex.: escova de dente, rolo de
// papel na garganta) ou feitos em conjunto — não são fonemas isolados,
// por isso ficam numa categoria própria, fora da trilha de fases.
// O vídeo em si vai pro IndexedDB (ver ARMAZENAMENTO DE MÍDIA); só o
// metadado (título, descrição, referência) fica no customContent.
// ══════════════════════════════════════════════
const PHYSICAL_VIDEO_MAX_BYTES = 60 * 1024 * 1024; // 60MB — folgado pra um vídeo curto, mas limitado pra não travar o navegador

async function addPhysicalExercise() {
  const errorEl = document.getElementById("admin-phys-error");
  errorEl.classList.add("hidden");
  if (!adminEditorPatientEmail) return;
  const title = val("admin-phys-title").trim();
  const desc = val("admin-phys-desc").trim();
  const fileInput = document.getElementById("admin-phys-video");
  const file = fileInput.files[0];
  if (!title) { errorEl.textContent = "Informe um título para o exercício."; errorEl.classList.remove("hidden"); return; }
  if (!file) { errorEl.textContent = "Selecione um vídeo."; errorEl.classList.remove("hidden"); return; }
  if (!file.type.startsWith("video/")) { errorEl.textContent = "O arquivo precisa ser um vídeo."; errorEl.classList.remove("hidden"); return; }
  if (file.size > PHYSICAL_VIDEO_MAX_BYTES) { errorEl.textContent = `Vídeo muito grande (máx. ${Math.round(PHYSICAL_VIDEO_MAX_BYTES / 1024 / 1024)}MB).`; errorEl.classList.remove("hidden"); return; }

  if (!getUsers()[adminEditorPatientEmail]) return;

  const btn = document.getElementById("admin-phys-submit-btn");
  setBtnLoading(btn, true);
  const blobId = newMediaId();
  try {
    await saveMediaBlob(blobId, file);
  } catch (e) {
    setBtnLoading(btn, false);
    errorEl.textContent = "Não foi possível salvar o vídeo neste dispositivo.";
    errorEl.classList.remove("hidden");
    return;
  }
  // Relê o paciente só AGORA, depois do await — o upload pode levar
  // segundos, e usar o snapshot de antes do await sobrescreveria
  // qualquer progresso/revisão salvos por essa conta nesse intervalo
  // (ver F3 na auditoria).
  const freshPatient = getUsers()[adminEditorPatientEmail];
  if (!freshPatient) { setBtnLoading(btn, false); deleteMediaBlob(blobId); return; }
  ensureGroupOrder(freshPatient); // garante customContent inteiro, inclusive physicalExercises
  freshPatient.customContent.physicalExercises.push({
    id: newMediaId(), title, description: desc, mediaId: blobId, mediaMime: file.type, addedAt: Date.now(),
  });
  saveUserRecords({ [adminEditorPatientEmail]: freshPatient });
  setBtnLoading(btn, false);

  document.getElementById("admin-phys-title").value = "";
  document.getElementById("admin-phys-desc").value = "";
  fileInput.value = "";
  renderPhysicalExerciseList();
  playBeep(660, 0.1);
}

function requestDeletePhysicalExercise(id) {
  requestConfirmAction(id, "delete-physical-exercise-modal");
}
function executeDeletePhysicalExercise() {
  if (!pendingConfirmTarget || !adminEditorPatientEmail) { closeModal("delete-physical-exercise-modal"); return; }
  const id = pendingConfirmTarget;
  pendingConfirmTarget = null;
  closeModal("delete-physical-exercise-modal");
  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  if (!patient) return;
  const list = patient.customContent.physicalExercises || [];
  const item = list.find(x => x.id === id);
  patient.customContent.physicalExercises = list.filter(x => x.id !== id);
  saveUserRecords({ [adminEditorPatientEmail]: patient });
  if (item) deleteMediaBlob(item.mediaId).catch(() => {});
  renderPhysicalExerciseList();
  playBeep(300, 0.1);
}

function renderPhysicalExerciseList() {
  const wrap = document.getElementById("admin-phys-list");
  if (!wrap) return;
  wrap.innerHTML = "";
  const users = getUsers();
  const patient = adminEditorPatientEmail ? users[adminEditorPatientEmail] : null;
  const list = (patient && patient.customContent && patient.customContent.physicalExercises) || [];
  if (!list.length) {
    wrap.innerHTML = `<div class="accounts-empty">Nenhum exercício físico adicionado ainda para este paciente.</div>`;
    return;
  }
  list.slice().reverse().forEach(item => {
    const row = document.createElement("div");
    row.className = "admin-exercise-row";
    row.innerHTML = `
      <span class="admin-exercise-text">${escapeHtml(item.title)}</span>
      <span class="admin-exercise-group">${escapeHtml(item.description || "—")}</span>
      <span class="admin-exercise-actions">
        <button type="button" class="admin-exercise-icon-btn danger" title="Excluir" aria-label="Excluir ${escapeHtml(item.title)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </span>`;
    row.querySelector(".admin-exercise-icon-btn.danger").onclick = () => requestDeletePhysicalExercise(item.id);
    wrap.appendChild(row);
  });
}

// ── Lado do paciente: assistir os exercícios físicos enviados ──
function openPhysicalExercisesPanel() {
  renderPatientPhysicalExerciseList();
  openPanel("physical-exercises-panel");
}
function renderPatientPhysicalExerciseList() {
  const wrap = document.getElementById("physical-exercises-list");
  if (!wrap || !sessionEmail) return;
  wrap.innerHTML = "";
  const users = getUsers();
  const user = users[sessionEmail];
  const list = (user && user.customContent && user.customContent.physicalExercises) || [];
  if (!list.length) {
    wrap.innerHTML = `<div class="accounts-empty">Seu fonoaudiólogo(a) ainda não adicionou exercícios físicos.<br>Eles aparecem aqui assim que forem enviados.</div>`;
    return;
  }
  list.slice().reverse().forEach(item => {
    const card = document.createElement("div");
    card.className = "physical-exercise-card";
    card.innerHTML = `
      <div class="physical-exercise-info">
        <h4>${escapeHtml(item.title)}</h4>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
      </div>
      <button type="button" class="btn btn-ghost physical-exercise-play-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Assistir
      </button>
      <div class="physical-exercise-video-wrap hidden"></div>`;
    card.querySelector(".physical-exercise-play-btn").onclick = async (e) => {
      const btn = e.currentTarget;
      const videoWrap = card.querySelector(".physical-exercise-video-wrap");
      if (!videoWrap.classList.contains("hidden")) return;
      const url = await mediaBlobUrl(item.mediaId);
      if (!url) { showToast("Não foi possível carregar este vídeo.", true); return; }
      videoWrap.innerHTML = `<video controls src="${url}"></video>`;
      videoWrap.classList.remove("hidden");
      btn.classList.add("hidden");
    };
    wrap.appendChild(card);
  });
}

function renderCustomExerciseList() {
  const wrap = document.getElementById("admin-custom-list");
  if (!wrap) return;
  wrap.innerHTML = "";
  const users = getUsers();
  const patient = adminEditorPatientEmail ? users[adminEditorPatientEmail] : null;
  const cc = (patient && patient.customContent) || { groups: [], exercises: [], audio: {} };
  if (!cc.exercises || !cc.exercises.length) {
    wrap.innerHTML = `<div class="accounts-empty">Nenhum exercício personalizado ainda para este paciente.</div>`;
    return;
  }
  const groupsForPatient = getUserGroups(patient);
  cc.exercises.map((ex, i) => ({ ex, i })).reverse().forEach(({ ex, i }) => {
    const g = groupsForPatient.find(x => x.id === ex.groupId);
    const row = document.createElement("div");
    row.className = "admin-exercise-row";
    row.innerHTML = `
      <span class="admin-exercise-text">${escapeHtml(ex.text)}</span>
      <span class="admin-exercise-group">${g ? escapeHtml(g.nome) : "—"}</span>
      ${cc.audio && cc.audio[ex.text] ? '<span class="admin-exercise-audio-flag" title="Tem áudio personalizado">🔊</span>' : ""}
      ${ex.sustainSec ? `<span class="admin-exercise-audio-flag" title="Som sustentado por ${ex.sustainSec}s">⏱ ${ex.sustainSec}s</span>` : ""}
      <span class="admin-exercise-actions">
        <button type="button" class="admin-exercise-icon-btn" title="Editar" aria-label="Editar exercício ${escapeHtml(ex.text)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button type="button" class="admin-exercise-icon-btn danger" title="Excluir" aria-label="Excluir exercício ${escapeHtml(ex.text)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </span>`;
    row.querySelector(".admin-exercise-icon-btn:not(.danger)").onclick = () => startEditExercise(i);
    row.querySelector(".admin-exercise-icon-btn.danger").onclick = () => requestDeleteExercise(i);
    wrap.appendChild(row);
  });
}

// ── Reordenar fases por arrastar-e-soltar (mouse e toque, via Pointer Events) ──
function renderGroupOrderList() {
  const wrap = document.getElementById("admin-group-order-list");
  if (!wrap || !adminEditorPatientEmail) return;
  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  if (!patient) return;
  ensureGroupOrder(patient);
  saveUserRecords({ [adminEditorPatientEmail]: patient });

  const customIds = new Set((patient.customContent.groups || []).map(g => g.id));
  const orderedGroups = getUserGroups(patient);
  wrap.innerHTML = "";
  orderedGroups.forEach((g, idx) => {
    const isCustom = customIds.has(g.id);
    const row = document.createElement("div");
    row.className = "group-order-row";
    row.dataset.groupId = g.id;
    row.innerHTML = `
      <span class="group-order-handle" title="Arraste para reordenar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>
      </span>
      <span class="group-order-index">${idx + 1}</span>
      <span class="group-order-name">${escapeHtml(g.nome)}</span>
      ${isCustom && g.fonemas.length > 0 && g.fonemas.length < 5 ? `<span class="group-order-min-note" title="Com poucos exercícios, o limiar de ${PHASE_COMPLETION_THRESHOLD}% vira quase exigência de acerto total">precisa de ${Math.ceil(g.fonemas.length * PHASE_COMPLETION_THRESHOLD / 100)}/${g.fonemas.length} certos pra concluir</span>` : ""}
      <span class="group-order-actions">
        <button type="button" class="group-order-move-btn" data-move="up" title="Mover para cima" aria-label="Mover ${escapeHtml(g.nome)} para cima"${idx === 0 ? " disabled" : ""}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button type="button" class="group-order-move-btn" data-move="down" title="Mover para baixo" aria-label="Mover ${escapeHtml(g.nome)} para baixo"${idx === orderedGroups.length - 1 ? " disabled" : ""}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        ${isCustom ? `
        <button type="button" class="group-order-icon-btn" data-action="rename" title="Renomear fase" aria-label="Renomear ${escapeHtml(g.nome)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button type="button" class="group-order-icon-btn danger" data-action="delete" title="Excluir fase" aria-label="Excluir ${escapeHtml(g.nome)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>` : ""}
      </span>`;
    row.querySelector('[data-move="up"]').onclick = () => moveGroupOrder(g.id, -1);
    row.querySelector('[data-move="down"]').onclick = () => moveGroupOrder(g.id, 1);
    if (isCustom) {
      row.querySelector('[data-action="rename"]').onclick = () => startRenameGroup(g.id, g.nome);
      row.querySelector('[data-action="delete"]').onclick = () => requestDeleteGroup(g.id, g.nome);
    }
    wrap.appendChild(row);
  });
  wireGroupOrderDrag(wrap);
}

// Move uma fase uma posição para cima/baixo na trilha do paciente — mesmo
// resultado do arrastar-e-soltar, mas 100% operável só com teclado (Tab +
// Enter/Espaço nos botões de seta).
function moveGroupOrder(groupId, delta) {
  if (!adminEditorPatientEmail) return;
  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  if (!patient) return;
  ensureGroupOrder(patient);
  const order = patient.customContent.groupOrder;
  const idx = order.indexOf(groupId);
  const target = idx + delta;
  if (idx === -1 || target < 0 || target >= order.length) return;
  [order[idx], order[target]] = [order[target], order[idx]];
  saveUserRecords({ [adminEditorPatientEmail]: patient });
  setActiveContent(patient);
  renderGroupOrderList();
  populateAdminGroupSelect();
  playBeep(500, 0.06);
}

// ── Renomear fase personalizada (edição em linha) ──
function startRenameGroup(groupId, currentName) {
  const row = document.querySelector(`.group-order-row[data-group-id="${groupId}"]`);
  if (!row) return;
  const nameEl = row.querySelector(".group-order-name");
  nameEl.innerHTML = "";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "group-rename-input";
  input.value = currentName;
  input.setAttribute("aria-label", "Novo nome da fase");
  nameEl.appendChild(input);
  input.focus();
  input.select();
  let done = false;
  const commit = () => {
    if (done) return;
    done = true;
    const newName = input.value.trim();
    if (newName && newName !== currentName) saveGroupRename(groupId, newName);
    else renderGroupOrderList();
  };
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); done = true; renderGroupOrderList(); }
  });
  input.addEventListener("blur", commit);
}
function saveGroupRename(groupId, newName) {
  if (!adminEditorPatientEmail) return;
  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  if (!patient) return;
  const group = (patient.customContent.groups || []).find(g => g.id === groupId);
  if (!group) return;
  group.nome = newName;
  group.short = (newName.match(/\S+/g) || ["NG"]).map(w => w[0]).join("").slice(0, 3).toUpperCase();
  saveUserRecords({ [adminEditorPatientEmail]: patient });
  setActiveContent(patient);
  renderGroupOrderList();
  populateAdminGroupSelect();
  playBeep(500, 0.08);
}

// ── Excluir fase personalizada (e os exercícios dela) ──
function requestDeleteGroup(groupId, groupName) {
  document.getElementById("delete-group-question").textContent =
    `Excluir a fase "${groupName}"? Os exercícios personalizados dela também serão removidos. Essa ação não pode ser desfeita.`;
  requestConfirmAction(groupId, "delete-group-modal");
}
function executeDeleteGroup() {
  if (!pendingConfirmTarget || !adminEditorPatientEmail) { closeModal("delete-group-modal"); return; }
  const groupId = pendingConfirmTarget;
  pendingConfirmTarget = null;
  closeModal("delete-group-modal");

  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  if (!patient) return;
  const cc = patient.customContent;
  cc.groups = (cc.groups || []).filter(g => g.id !== groupId);
  const removedTexts = (cc.exercises || []).filter(ex => ex.groupId === groupId).map(ex => ex.text);
  cc.exercises = (cc.exercises || []).filter(ex => ex.groupId !== groupId);
  removedTexts.forEach(text => {
    const stillUsed = cc.exercises.some(ex => ex.text === text);
    if (!stillUsed) { delete cc.dicas[text]; delete cc.audio[text]; }
  });
  cc.groupOrder = (cc.groupOrder || []).filter(id => id !== groupId);
  if (patient.progress && patient.progress.completedGroupIds) {
    patient.progress.completedGroupIds = patient.progress.completedGroupIds.filter(id => id !== groupId);
  }
  saveUserRecords({ [adminEditorPatientEmail]: patient });
  setActiveContent(patient);
  populateAdminGroupSelect();
  renderCustomExerciseList();
  renderGroupOrderList();
  playBeep(300, 0.1);
}

function wireGroupOrderDrag(wrap) {
  let dragRow = null;
  wrap.querySelectorAll(".group-order-row").forEach(row => {
    const handle = row.querySelector(".group-order-handle");
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dragRow = row;
      row.classList.add("dragging");
      try { handle.setPointerCapture(e.pointerId); } catch(err) {}
    });
  });
  wrap.addEventListener("pointermove", (e) => {
    if (!dragRow) return;
    const after = getDragAfterElement(wrap, e.clientY);
    if (after == null) wrap.appendChild(dragRow);
    else wrap.insertBefore(dragRow, after);
  });
  const endDrag = () => {
    if (!dragRow) return;
    dragRow.classList.remove("dragging");
    dragRow = null;
    saveGroupOrderFromDOM(wrap);
  };
  wrap.addEventListener("pointerup", endDrag);
  wrap.addEventListener("pointercancel", endDrag);
}

function getDragAfterElement(container, y) {
  const rows = [...container.querySelectorAll(".group-order-row:not(.dragging)")];
  return rows.reduce((closest, row) => {
    const box = row.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: row };
    return closest;
  }, { offset: -Infinity, element: null }).element;
}

function saveGroupOrderFromDOM(wrap) {
  if (!adminEditorPatientEmail) return;
  const ids = [...wrap.querySelectorAll(".group-order-row")].map(r => r.dataset.groupId);
  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  if (!patient) return;
  patient.customContent.groupOrder = ids;
  saveUserRecords({ [adminEditorPatientEmail]: patient });
  setActiveContent(patient);
  renderGroupOrderList();
  populateAdminGroupSelect();
  playBeep(500, 0.06);
}

// ══════════════════════════════════════════════
// MÉDICO — PACIENTES E GRÁFICOS
// ══════════════════════════════════════════════
function computePatientStats(user) {
  const progress = user.progress || { completedGroupIds: [], attempts: {} };
  const groupsDone = (progress.completedGroupIds || []).length;
  let correct = 0, incorrect = 0;
  const attempts = progress.attempts || {};
  Object.keys(attempts).forEach(k => { correct += attempts[k].correct || 0; incorrect += attempts[k].incorrect || 0; });
  const total = correct + incorrect;
  const accuracyPct = total ? Math.round((correct / total) * 100) : 0;
  return { groupsDone, correct, incorrect, total, accuracyPct, attempts };
}

function addPatientByDoctor() {
  const errorEl = document.getElementById("add-patient-error");
  const successEl = document.getElementById("add-patient-success");
  errorEl.classList.add("hidden");
  successEl.classList.add("hidden");

  const id = val("add-patient-id").trim();
  if (!/^\d{4}$/.test(id)) { errorEl.textContent = "Informe o ID da conta do paciente (4 dígitos)."; errorEl.classList.remove("hidden"); return; }

  const users = getUsers();
  const patient = Object.values(users).find(u => u.role === "paciente" && u.accountId === id);
  if (!patient) { errorEl.textContent = "Nenhum paciente encontrado com esse ID."; errorEl.classList.remove("hidden"); return; }

  const doctor = users[sessionEmail];
  if (!doctor.patients) doctor.patients = [];
  if (!doctor.sentInvites) doctor.sentInvites = [];
  if (!patient.pendingInvites) patient.pendingInvites = [];

  if (doctor.patients.includes(patient.email)) { errorEl.textContent = `${patient.name} já está vinculado(a) a você.`; errorEl.classList.remove("hidden"); return; }
  if (patient.pendingInvites.some(i => i.doctorEmail === sessionEmail)) { errorEl.textContent = `Convite já enviado a ${patient.name}, aguardando confirmação.`; errorEl.classList.remove("hidden"); return; }

  patient.pendingInvites.push({ doctorEmail: sessionEmail, doctorName: doctor.name, sentAt: Date.now() });
  if (!doctor.sentInvites.includes(patient.email)) doctor.sentInvites.push(patient.email);
  if (!saveUserRecords({ [patient.email]: patient, [sessionEmail]: doctor })) {
    errorEl.textContent = "Não foi possível enviar o convite — tente novamente.";
    errorEl.classList.remove("hidden");
    return;
  }

  document.getElementById("add-patient-id").value = "";
  successEl.textContent = `Convite enviado para ${patient.name}!`;
  successEl.classList.remove("hidden");
  playBeep(660, 0.12);
  renderPatientsList();
}

function showDoctorList() {
  document.getElementById("doctor-detail-view").classList.add("hidden");
  document.getElementById("doctor-list-view").classList.remove("hidden");
  setActiveContent(null);
  renderPatientsList();
}

// Ordena uma lista de usuários (objetos com .name) alfabeticamente.
function sortByName(list) {
  return list.slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }));
}

function renderPatientsList() {
  const wrap = document.getElementById("patients-list");
  wrap.innerHTML = "";
  const users = getUsers();
  const doctor = users[sessionEmail];
  const patientEmails = (doctor && doctor.patients) || [];

  if (!patientEmails.length) {
    wrap.innerHTML = `<div class="accounts-empty">Nenhum paciente vinculado ainda.<br>Adicione um paciente pelo ID abaixo.</div>`;
  }
  const patients = sortByName(patientEmails.map(email => users[email]).filter(Boolean));
  patients.forEach(p => {
    const stats = computePatientStats(p);
    const totalGroups = getUserGroups(p).length;
    const pendingReviews = ((p.progress && p.progress.reviews) || []).filter(r => r.status === "pendente").length;
    const card = document.createElement("div");
    card.className = "patient-card";
    card.onclick = () => openPatientDetail(p.email);
    card.setAttribute("aria-label", `Abrir perfil de ${p.name}${pendingReviews ? ` — ${pendingReviews} aprovação(ões) pendente(s)` : ""}`);
    makeKeyboardClickable(card);
    card.innerHTML = `
      <div class="patient-card-avatar">
        ${p.avatar ? `<img src="${p.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}
        ${pendingReviews ? `<span class="icon-badge-dot" title="${pendingReviews} aprovação(ões) pendente(s)"></span>` : ""}
      </div>
      <div class="patient-card-info">
        <span class="patient-card-name">${escapeHtml(p.name)}</span>
        <span class="patient-card-meta">${levelLabel(computeLevel(p))} · ${stats.groupsDone}/${totalGroups} fases · ${stats.accuracyPct}% de acerto</span>
        ${pendingReviews ? `<span class="patient-card-pending-tag">${pendingReviews} aprovação${pendingReviews > 1 ? "ões" : ""} pendente${pendingReviews > 1 ? "s" : ""}</span>` : ""}
      </div>
      <div class="patient-card-actions">
        <button type="button" class="patient-card-add-btn" title="Adicionar exercício para este paciente" aria-label="Adicionar exercício para ${escapeHtml(p.name)}">+</button>
        <svg class="patient-card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>`;
    const addBtn = card.querySelector(".patient-card-add-btn");
    addBtn.onclick = (e) => { e.stopPropagation(); openAdminEditor(p.email); };
    wrap.appendChild(card);
  });

  renderPendingInvitesList(doctor, users);
}

// Prévia do perfil básico do paciente + selo de "convite enviado",
// enquanto ele ainda não confirmou o vínculo.
function renderPendingInvitesList(doctor, users) {
  const section = document.getElementById("pending-invites-section");
  const wrap = document.getElementById("pending-invites-list");
  if (!section || !wrap) return;
  const sent = sortByName(((doctor && doctor.sentInvites) || []).map(email => users[email]).filter(Boolean));
  if (!sent.length) { section.classList.add("hidden"); return; }
  section.classList.remove("hidden");
  wrap.innerHTML = "";
  sent.forEach(p => {
    const card = document.createElement("div");
    card.className = "patient-card patient-card-pending";
    card.innerHTML = friendPreviewCard(p, `${levelLabel(computeLevel(p))} · aguardando confirmação`,
      `<span class="invite-sent-icon" title="Convite enviado, aguardando resposta">${MAIL_SVG}</span>`);
    wrap.appendChild(card);
  });
}

function openPatientDetail(email) {
  const users = getUsers();
  const p = users[email];
  if (!p) return;
  document.getElementById("doctor-list-view").classList.add("hidden");
  document.getElementById("doctor-detail-view").classList.remove("hidden");
  document.getElementById("detail-avatar").innerHTML = p.avatar ? `<img src="${p.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG;
  document.getElementById("detail-name").textContent = p.name;
  document.getElementById("detail-meta").textContent =
    `${levelLabel(computeLevel(p))} · ID da conta ${p.accountId || "—"} · ${p.phone || "sem telefone cadastrado"}`;

  renderPatientReviews(p);

  const stats = computePatientStats(p);
  const patientGroups = getUserGroups(p);

  const pathRow = document.getElementById("detail-path-row");
  pathRow.innerHTML = "";
  patientGroups.forEach((g, gi) => {
    const done = p.progress && p.progress.completedGroupIds && p.progress.completedGroupIds.includes(g.id);
    const dot = document.createElement("div");
    dot.className = "chart-path-dot" + (done ? " done" : "");
    dot.title = `${g.nome}: ${done ? "concluída" : "pendente"}`;
    dot.setAttribute("aria-label", dot.title);
    dot.textContent = gi + 1;
    pathRow.appendChild(dot);
  });

  const perfBar = document.getElementById("detail-perf-bar");
  const correctPct = stats.total ? (stats.correct / stats.total) * 100 : 0;
  perfBar.innerHTML = stats.total
    ? `<div class="perf-seg perf-correct" style="width:${correctPct}%"></div><div class="perf-seg perf-wrong" style="width:${100 - correctPct}%"></div>`
    : `<div class="perf-empty">Nenhuma tentativa registrada ainda.</div>`;
  document.getElementById("detail-correct-count").textContent = stats.correct;
  document.getElementById("detail-wrong-count").textContent = stats.incorrect;

  const errBars = document.getElementById("detail-error-bars");
  errBars.innerHTML = "";
  const entries = Object.entries(stats.attempts)
    .map(([f, a]) => ({ f, incorrect: a.incorrect || 0 }))
    .filter(e => e.incorrect > 0)
    .sort((a, b) => b.incorrect - a.incorrect)
    .slice(0, 5);
  if (!entries.length) {
    errBars.innerHTML = `<div class="perf-empty">Nenhum erro recorrente registrado.</div>`;
  } else {
    const max = entries[0].incorrect;
    const progress = getProgress(p);
    entries.forEach(e => {
      const alreadyPending = progress.rejectedFonemas.some(r => r.fonema === e.f);
      const row = document.createElement("div");
      row.className = "error-bar-row";
      row.innerHTML = `<span class="error-bar-label">${escapeHtml(e.f)}</span><div class="error-bar-track"><div class="error-bar-fill" style="width:${(e.incorrect / max) * 100}%"></div></div><span class="error-bar-count">${e.incorrect}</span>
        <button type="button" class="error-bar-repeat-btn"${alreadyPending ? " disabled" : ""}>${alreadyPending ? "Já pedido" : "Pedir repetição"}</button>`;
      if (!alreadyPending) {
        row.querySelector(".error-bar-repeat-btn").onclick = () => requestFonemaRepeat(email, e.f);
      }
      errBars.appendChild(row);
    });
  }
  maybeStartDoctorDetailTour();
}

// Configurável pelo médico independente de uma revisão pendente existir:
// julgando pelo padrão de erro recorrente do paciente (ver
// detail-error-bars), ele pode mandar um fonema específico direto pro
// nível de Revisão do paciente, sem precisar esperar uma fase inteira
// ser reprovada. Mesmo destino de setReviewStatus("rejeitado") — um
// único lugar onde "precisa repetir" realmente significa alguma coisa
// pro paciente (ver G3 na auditoria).
function requestFonemaRepeat(patientEmail, fonema) {
  const users = getUsers();
  const patient = users[patientEmail];
  if (!patient) return;
  const progress = getProgress(patient);
  if (progress.rejectedFonemas.some(r => r.fonema === fonema)) return;
  progress.rejectedFonemas.push({ fonema, groupId: null, addedAt: Date.now() });
  if (!saveUserRecords({ [patientEmail]: patient })) return;
  openPatientDetail(patientEmail);
}

const REVIEW_STATUS_LABEL = { correct: "Certo", incorrect: "Errado", skipped: "Pulado" };

// Fila de aprovação do médico (ver registerPhaseReview em script.js) —
// lista só as revisões "pendente" desta fase; aprovar/rejeitar tira o
// item da lista (não bloqueia o progresso do paciente, é só auditoria).
function renderPatientReviews(patient) {
  const wrap = document.getElementById("detail-reviews-list");
  if (!wrap) return;
  const reviews = ((patient.progress && patient.progress.reviews) || []).filter(r => r.status === "pendente");
  wrap.innerHTML = "";
  if (!reviews.length) {
    wrap.innerHTML = `<div class="perf-empty">Nenhuma aprovação pendente.</div>`;
    return;
  }
  reviews.forEach(r => {
    const card = document.createElement("div");
    card.className = "review-card";
    const date = new Date(r.timestamp).toLocaleString("pt-BR");
    card.innerHTML = `
      <div class="review-card-header">
        <span class="review-card-title">${escapeHtml(r.groupNome)}</span>
        <span class="review-card-score">${r.scorePct}% de acerto</span>
        <span class="review-card-date">${escapeHtml(date)}</span>
      </div>
      <div class="review-attempts"></div>
      <div class="review-actions">
        <button type="button" class="btn btn-side review-reject-btn">Rejeitar</button>
        <button type="button" class="btn btn-primary review-approve-btn">Aprovar</button>
      </div>`;
    const attemptsWrap = card.querySelector(".review-attempts");
    r.attempts.forEach(a => {
      const row = document.createElement("div");
      row.className = "review-attempt-row";
      const unverified = a.status !== "skipped" && !a.verified;
      row.innerHTML = `
        <span class="review-attempt-fonema">${escapeHtml(a.fonema)}</span>
        <span class="review-attempt-status status-${a.status}">${REVIEW_STATUS_LABEL[a.status] || a.status}</span>
        ${unverified ? `<span class="review-attempt-unverified" title="O reconhecimento de fala não respondeu a tempo nesta tentativa — o resultado veio só de volume/duração, ouça com atenção.">não verificado por voz</span>` : ""}
        ${a.mediaId ? `<audio controls class="review-attempt-audio"></audio>` : `<span class="review-attempt-none">sem áudio</span>`}`;
      attemptsWrap.appendChild(row);
      if (a.mediaId) {
        const audioEl = row.querySelector("audio");
        mediaBlobUrl(a.mediaId).then(url => { if (url) audioEl.src = url; });
      }
    });
    card.querySelector(".review-approve-btn").onclick = () => setReviewStatus(patient.email, r.id, "aprovado");
    card.querySelector(".review-reject-btn").onclick = () => setReviewStatus(patient.email, r.id, "rejeitado");
    wrap.appendChild(card);
  });
}

function setReviewStatus(patientEmail, reviewId, status) {
  const users = getUsers();
  const patient = users[patientEmail];
  if (!patient) return;
  const progress = getProgress(patient);
  const review = (progress.reviews || []).find(r => r.id === reviewId);
  if (!review) return;
  const previousStatus = review.status;
  const previousRejected = progress.rejectedFonemas.slice();
  review.status = status;
  review.reviewedAt = Date.now();
  // Rejeitado vira retreino de verdade, não só um registro morto: os
  // fonemas dessa revisão entram no nível "Revisão" (fora da trilha
  // principal), fechando o ciclo que faltava (ver G3 na auditoria) —
  // sem isso, "Rejeitar" não mudava nada no app pro paciente.
  if (status === "rejeitado") {
    review.attempts.forEach(a => {
      if (a.status === "skipped") return;
      if (!progress.rejectedFonemas.some(r => r.fonema === a.fonema && r.groupId === review.groupId)) {
        progress.rejectedFonemas.push({ fonema: a.fonema, groupId: review.groupId, addedAt: Date.now() });
      }
    });
  }
  // Só libera o áudio DEPOIS de confirmar que a gravação foi salva —
  // se falhar (armazenamento cheio), a revisão volta a "pendente" e o
  // áudio continua intacto, em vez de virar uma referência quebrada
  // (mediaId apontando pra um blob já apagado) — ver T3 na auditoria.
  if (!saveUserRecords({ [patientEmail]: patient })) {
    review.status = previousStatus;
    review.reviewedAt = null;
    progress.rejectedFonemas = previousRejected;
    return;
  }
  review.attempts.forEach(a => {
    if (a.mediaId) { releaseMediaBlob(a.mediaId); a.mediaId = null; }
  });
  saveUserRecords({ [patientEmail]: patient });
  openPatientDetail(patientEmail);
}

// ══════════════════════════════════════════════
// ROLAGEM POR CLIQUE-E-ARRASTA (desktop)
// ──────────────────────────────────────────────
// Escopo deliberadamente restrito — só nas áreas que realmente costumam
// ter bastante conteúdo pra rolar: listas longas (Amigos, Contas),
// edição da ordem das fases do médico, a árvore de fases (trilha) e a
// tela do médico (que pode ter vários gráficos/pacientes empilhados).
// Em todo o resto do app (telas curtas, cartão de treino, formulários)
// só a rolagem nativa (roda, touchpad, toque) continua ativa — arrastar
// nessas telas nunca é interceptado, de propósito, pra não competir com
// outras interações.
//
// Usa eventos de mouse "clássicos" (mousedown/mousemove/mouseup), não
// Pointer Events — em telas de toque esses eventos praticamente não
// disparam para gestos de toque (o navegador já trata como toque puro),
// então rolagem por dedo e por roda/touchpad continuam 100% nativas,
// sem nenhuma interferência. Só começa a "arrastar" de verdade depois
// de um pequeno limiar de movimento (DRAG_SCROLL_THRESHOLD_PX) — um
// clique simples num botão dentro da área continua funcionando
// normalmente, porque nunca chega a ser tratado como arraste.
// ══════════════════════════════════════════════
const DRAG_SCROLL_THRESHOLD_PX = 6;
function enableDragScroll(el, shouldActivate) {
  if (!el || el.dataset.dragScrollBound === "1") return;
  el.dataset.dragScrollBound = "1";
  let startX = 0, startY = 0, startScrollTop = 0, startScrollLeft = 0;
  let pending = false, dragging = false;

  el.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    if (shouldActivate && !shouldActivate()) return;
    // Controles clicáveis (botões, links, campos, o "puxador" de
    // reordenar fases) continuam 100% nativos — o arraste só começa se
    // o clique começar em espaço "vazio" do painel (texto, preenchimento,
    // espaço entre itens).
    if (e.target.closest(
      ".group-order-handle, input, textarea, select, [contenteditable], " +
      "button, a, .btn, .icon-btn, [role='button'], .path-node, .fonema-btn"
    )) return;
    pending = true; dragging = false;
    startX = e.clientX; startY = e.clientY;
    startScrollTop = el.scrollTop; startScrollLeft = el.scrollLeft;
    // Evita que o navegador comece a SELECIONAR TEXTO no mesmo gesto —
    // sem isto, os primeiros pixels do arraste (antes do limiar decidir
    // "isto é um arraste") já teriam disparado seleção nativa, competindo
    // visualmente com a rolagem.
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!pending) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (!dragging && Math.hypot(dx, dy) > DRAG_SCROLL_THRESHOLD_PX) {
      dragging = true;
      el.classList.add("drag-scrolling");
    }
    if (dragging) {
      el.scrollTop = startScrollTop - dy;
      el.scrollLeft = startScrollLeft - dx;
    }
  });
  window.addEventListener("mouseup", () => {
    if (dragging) {
      // Suprime o "click" gerado por este mesmo gesto de soltar o botão,
      // só desta vez — sem isso, soltar o arraste em cima de um botão
      // dispararia o clique dele por engano.
      window.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); }, { capture: true, once: true });
    }
    pending = false; dragging = false;
    el.classList.remove("drag-scrolling");
  });
}

// ══════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════
migrateAccountIds();
ensureAdminAccount();
loadThemePreference();
loadReducedMotionPreference();
initAuthUI();

// Listas longas — cada uma já tem sua própria rolagem interna (ver
// .friends-list/.accounts-list com altura fixa no CSS).
document.querySelectorAll(".friends-list, .accounts-list, .search-results-wrap").forEach(el => enableDragScroll(el));
// Cabeçalho da Home (Perfil/Amigos/Mensagens/Lembretes/Configurações) —
// rola na horizontal em vez de quebrar linha quando não cabe tudo.
const homeTop = document.querySelector(".home-top");
if (homeTop) enableDragScroll(homeTop);
// Edição da ordem das fases do médico — o painel inteiro (não só a
// lista) porque o formulário de cima também pode empurrar a lista pra
// baixo da área visível.
const adminEditorCard = document.querySelector("#admin-editor-panel .panel-card");
if (adminEditorCard) enableDragScroll(adminEditorCard);
// Central de Ajuda — outra "lista extensa" (perguntas frequentes) que
// costuma passar do que cabe na tela.
const helpCard = document.querySelector("#help-panel .panel-card");
if (helpCard) enableDragScroll(helpCard);
// Árvore de fases (trilha) e painel do médico — telas inteiras que
// podem crescer mais que a viewport; ativa só quando uma delas está
// aberta (a página em si é quem rola, não um contêiner interno).
// overlayStack.length === 0 é essencial aqui: sem isso, arrastar dentro
// de um painel aberto por cima da trilha/painel do médico (ex.: a
// Central de Ajuda) também rolava a tela de fundo — o mousedown que
// começa dentro do painel sobe (bubble) até documentElement do mesmo
// jeito, não importa o z-index visual por cima.
enableDragScroll(document.scrollingElement, () => (activeScreenName === "path" || activeScreenName === "doctor") && overlayStack.length === 0);
