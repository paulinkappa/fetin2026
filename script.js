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

const BASE_DICAS = {
  A:"Abra bem a boca, deixe a língua baixa e solte o ar livremente.",
  E:"Abra a boca pela metade, lábios levemente abertos para os lados.",
  I:"Lábios afastados para os lados como um sorriso, língua alta.",
  O:"Arredonde os lábios formando um círculo, língua no meio.",
  U:"Projete os lábios para frente formando um círculo pequeno.",
  MA:"Una os lábios, direcione o ar pelo nariz e abra a boca.",
  ME:"Una os lábios, ressoe pelo nariz e abra em E.",
  MI:"Una os lábios, ressoe pelo nariz e abra em I com sorriso.",
  MO:"Una os lábios, ressoe pelo nariz e arredonde para O.",
  MU:"Una os lábios, ressoe pelo nariz e projete para U.",
  PA:"Una os dois lábios, solte o ar de repente e abra em A.",
  PE:"Una os lábios, estoure o ar e abra em E.",
  PI:"Una os lábios, estoure e abra em I com sorriso.",
  PO:"Una os lábios, estoure e arredonde os lábios para O.",
  PU:"Una os lábios, estoure e projete os lábios para U.",
  TA:"Toque a língua atrás dos dentes superiores e solte em A.",
  TE:"Língua atrás dos dentes, solte o ar e abra em E.",
  TI:"Língua atrás dos dentes, solte e sorria para I.",
  TO:"Língua atrás dos dentes, solte e arredonde para O.",
  TU:"Língua atrás dos dentes, solte e projete para U.",
  LA:"Língua na parte superior da boca, solte o ar suavemente em A.",
  LE:"Língua encostada acima, solte e abra em E.",
  LI:"Língua encostada acima, solte e sorria para I.",
  LO:"Língua encostada acima, solte e arredonde para O.",
  LU:"Língua encostada acima, solte e projete para U.",
  FA:"Dentes sobre o lábio inferior, sopre e abra em A.",
  FE:"Dentes sobre o lábio inferior, sopre e abra em E.",
  FI:"Dentes sobre o lábio inferior, sopre e sorria para I.",
  FO:"Dentes sobre o lábio inferior, sopre e arredonde para O.",
  FU:"Dentes sobre o lábio inferior, sopre e projete para U.",
  VA:"Dentes sobre o lábio inferior, vibre e abra em A.",
  VE:"Dentes sobre o lábio inferior, vibre e abra em E.",
  VI:"Dentes sobre o lábio inferior, vibre e sorria para I.",
  VO:"Dentes sobre o lábio inferior, vibre e arredonde para O.",
  VU:"Dentes sobre o lábio inferior, vibre e projete para U.",
  NA:"Passe o ar pelo nariz com a língua acima e abra em A.",
  NE:"Ar pelo nariz, língua acima, abra em E.",
  NI:"Ar pelo nariz, língua acima, sorria para I.",
  NO:"Ar pelo nariz, língua acima, arredonde para O.",
  NU:"Ar pelo nariz, língua acima, projete para U.",
  DA:"Língua atrás dos dentes superiores, solte suave e abra em A.",
  DE:"Língua atrás dos dentes, solte suave e abra em E.",
  DI:"Língua atrás dos dentes, solte suave e sorria para I.",
  DO:"Língua atrás dos dentes, solte suave e arredonde para O.",
  DU:"Língua atrás dos dentes, solte suave e projete para U.",
  BA:"Una os lábios suavemente, solte vibrando e abra em A.",
  BE:"Lábios unidos, vibre ao soltar e abra em E.",
  BI:"Lábios unidos, vibre ao soltar e sorria para I.",
  BO:"Lábios unidos, vibre ao soltar e arredonde para O.",
  BU:"Lábios unidos, vibre ao soltar e projete para U.",
  CA:"Fundo da língua no céu da boca, solte o ar forte em A.",
  CE:"Língua perto dos dentes superiores, sussurre e abra em E.",
  CI:"Língua perto dos dentes superiores, sussurre e sorria para I.",
  CO:"Fundo da língua no céu da boca, solte forte e arredonde para O.",
  CU:"Fundo da língua no céu da boca, solte forte e projete para U.",
  GA:"Fundo da língua no céu da boca, vibre e abra em A.",
  GE:"Fundo da língua suave, ressoe na garganta e abra em E.",
  GI:"Fundo da língua suave, ressoe na garganta e sorria para I.",
  GO:"Fundo da língua no céu da boca, vibre e arredonde para O.",
  GU:"Fundo da língua no céu da boca, vibre e projete para U.",
  JA:"Aproxime a língua do céu da boca, vibre suavemente e abra em A.",
  JE:"Língua próxima ao céu da boca, vibre suave e abra em E.",
  JI:"Língua próxima ao céu da boca, vibre suave e sorria para I.",
  JO:"Língua próxima ao céu da boca, vibre suave e arredonde para O.",
  JU:"Língua próxima ao céu da boca, vibre suave e projete para U.",
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

// Banco de mensagens para aproveitamento insatisfatório (< 60% de acerto).
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
  if (!patient.customContent) patient.customContent = { groups: [], exercises: [], dicas: {}, audio: {}, groupOrder: [] };
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
let recordingPeak       = 0;
let recordingStartTime = 0;
let speechOnsetTime      = null; // quando o volume cruzou o limiar pela 1ª vez nesta gravação
let lastAboveThresholdTime = null; // último instante em que o volume estava acima do limiar
let matchDetected       = false;
let recordingSilenceTimer = null;
let recordingMaxTimer     = null;
let recognitionActiveForTake = false; // reconhecimento real ligado e escutando nesta gravação específica

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
let recognition = null;
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

// Retorna true se a escuta foi iniciada com sucesso (permite decidir, por
// gravação, se deve confiar no reconhecimento real ou cair no heurístico).
function startSpeechRecognition(fonema) {
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
          if (speechMatchesFonema(result[k].transcript, fonema)) { matched = true; break; }
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
    recognition.start();
    return true;
  } catch (e) {
    recognition = null;
    return false;
  }
}
function stopSpeechRecognition() {
  if (!recognition) return;
  const r = recognition;
  recognition = null;
  r.onresult = null; r.onerror = null; r.onend = null;
  try { r.abort(); } catch (e) {}
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
function showOnlyScreen(name) {
  if (currentTourKey && currentTourKey !== name) {
    document.getElementById("tour-overlay").classList.add("hidden");
    window.removeEventListener("resize", repositionTourStep);
    currentTourKey = null;
  }
  screenAuth.classList.toggle("hidden", name !== "auth");
  screenHome.classList.toggle("hidden", name !== "home");
  screenPath.classList.toggle("hidden", name !== "path");
  screenApp.classList.toggle("hidden", name !== "app");
  screenDoctor.classList.toggle("hidden", name !== "doctor");
  screenAccountPicker.classList.toggle("hidden", name !== "account-picker");
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
  maybeStartPathTour();
}

function openDoctorScreen() {
  closeDropdowns();
  clearHomeSearch();
  showOnlyScreen("doctor");
  showDoctorList();
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
  document.getElementById(`dropdown-${which}`).classList.remove("hidden");
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
  focusFirstIn(el);
}
function hideOverlay(el) {
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
  if (id === "profile-panel") refreshProfilePanelForRole();
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
    showToast("Não foi possível usar essa imagem como foto de perfil.");
    return;
  }
  setAvatarUI(dataUrl);
  if (sessionEmail) {
    const users = getUsers();
    const user = users[sessionEmail];
    if (user) { user.avatar = dataUrl; saveUserRecords({ [sessionEmail]: user }); }
  }
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

function copyAccountId() {
  const input = document.getElementById("pf-account-id");
  const btn = document.querySelector(".field-copy-btn");
  if (!input.value) return;
  const showCopied = () => {
    btn.classList.add("copied");
    btn.querySelector(".copy-icon-default").classList.add("hidden");
    btn.querySelector(".copy-icon-done").classList.remove("hidden");
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.querySelector(".copy-icon-default").classList.remove("hidden");
      btn.querySelector(".copy-icon-done").classList.add("hidden");
    }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(input.value).then(showCopied).catch(() => {
      input.select();
      document.execCommand("copy");
      showCopied();
    });
  } else {
    input.select();
    document.execCommand("copy");
    showCopied();
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
  saveUserRecords({ [sessionEmail]: user });
  applyUserToUI(user);
  playBeep(660, 0.1);
  closePanel("profile-panel");
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
function handleAccountsSwitchLogin(e) {
  e.preventDefault();
  hideAuthError("accounts-switch-error");
  const users = getUsers();
  const user = users[accountSwitchTargetEmail];
  const pass = val("accounts-switch-password");
  if (!user || user.password !== pass) {
    showAuthError("accounts-switch-error", "Senha incorreta.");
    return;
  }
  accountSwitchTargetEmail = null;
  switchAccount(user.email);
}

function addAccount() {
  closePanel("accounts-panel");
  showOnlyScreen("auth");
  switchAuthTab("signup");
}

// ── Remover conta do dispositivo ──────────────
let accountPendingRemoval = null;

function removeAccountFromDevice(email) {
  const users = getUsers();
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
}

// Sem argumento: remove a conta atualmente logada (usado pelo dropdown de perfil).
// Com e-mail: remove uma conta específica (usado na lista "Trocar de conta").
function requestRemoveAccount(email = sessionEmail) {
  if (!email) return;
  accountPendingRemoval = email;
  closeDropdowns();
  const users = getUsers();
  const user = users[email];
  const label = user ? (user.name || user.email) : email;
  document.getElementById("remove-account-question").textContent =
    `Remover a conta de ${label} deste dispositivo? Os dados salvos localmente serão apagados.`;
  openModal("remove-account-modal");
}

function executeRemoveAccount() {
  if (!accountPendingRemoval) { closeModal("remove-account-modal"); return; }
  const removingCurrent = accountPendingRemoval === sessionEmail;
  removeAccountFromDevice(accountPendingRemoval);
  accountPendingRemoval = null;
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
function handleAccountPickerLogin(e) {
  e.preventDefault();
  hideAuthError("account-picker-error");
  const users = getUsers();
  const user = users[accountPickerEmail];
  const pass = val("account-picker-password");
  if (!user || user.password !== pass) {
    showAuthError("account-picker-error", "Senha incorreta.");
    return;
  }
  sessionEmail = accountPickerEmail;
  accountPickerEmail = null;
  localStorage.setItem("vozativa_session_email", sessionEmail);
  applyUserToUI(user);
  document.getElementById("account-picker-password-view").reset();
  playBeep(660, 0.12);
  showOnlyScreen("home");
  maybeStartHomeTour();
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
  document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100dvh;font-family:'Nunito',sans-serif;color:#5a7a64;font-size:1.05rem;text-align:center;padding:24px;">Você pode fechar esta aba com segurança.</div>`;
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
    showToast("Não foi possível salvar: armazenamento do dispositivo está cheio.");
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
  return user.progress;
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
  document.getElementById("login-form").classList.toggle("hidden", !isLogin);
  document.getElementById("signup-form").classList.toggle("hidden", isLogin);
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

function handleLogin(e) {
  e.preventDefault();
  hideAuthError("login-error");
  const email = val("login-email").trim().toLowerCase();
  const pass  = val("login-password");
  const users = getUsers();
  const user  = users[email];
  if (!user || user.password !== pass) {
    showAuthError("login-error", "E-mail ou senha incorretos.");
    return;
  }
  sessionEmail = email;
  localStorage.setItem("vozativa_session_email", email);
  applyUserToUI(user);
  document.getElementById("login-form").reset();
  playBeep(660, 0.12);
  showOnlyScreen("home");
  maybeStartHomeTour();
}

function handleSignup(e) {
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
  if (!/^\(\d{2}\)\d \d{4}-\d{4}$/.test(phone)) { showAuthError("signup-error", "Telefone inválido. Use o formato (XX)X XXXX-XXXX."); return; }

  let crmVal = "";
  if (signupRole === "medico") {
    crmVal = val("signup-crm").trim();
    if (countDigits(crmVal) > 6) { showAuthError("signup-error", "Registro profissional deve ter no máximo 6 dígitos."); return; }
  }

  const users = getUsers();
  if (users[email]) { showAuthError("signup-error", "Já existe uma conta com este e-mail."); return; }

  // Cada conta começa 100% em branco — nenhum campo herda valor de outra conta.
  const base = {
    name, email, password: pass, phone, avatar: null, bio: "",
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
    base.customContent = { groups: [], exercises: [], dicas: {}, audio: {}, groupOrder: [] };
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

  const greeting = document.getElementById("home-greeting");
  if (greeting) greeting.textContent = user.name ? `Olá, ${user.name.split(" ")[0]}!` : "";

  const isDoctor = user.role === "medico";
  const patientsBtn = document.getElementById("patients-btn");
  if (patientsBtn) patientsBtn.classList.toggle("hidden", !isDoctor);
  const friendsBtn = document.getElementById("friends-btn");
  if (friendsBtn) friendsBtn.classList.toggle("hidden", isDoctor);

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
  if (!streak) return;
  document.getElementById("streak-count").textContent = streak;
  document.getElementById("streak-label").textContent = streak === 1 ? "dia seguido" : "dias seguidos";
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

function initAuthUI() {
  const savedEmail = localStorage.getItem("vozativa_session_email");
  const users = getUsers();
  if (savedEmail && users[savedEmail]) {
    sessionEmail = savedEmail;
    applyUserToUI(users[savedEmail]);
    showOnlyScreen("home");
    maybeStartHomeTour();
  } else {
    showOnlyScreen("auth");
  }
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
  saveUserRecords({ [sessionEmail]: me, [toEmail]: other });
  playBeep(660, 0.1);
  renderHomeSearchResults();
}

function respondFriendRequest(fromEmail, accept) {
  const users = getUsers();
  const me = users[sessionEmail];
  if (!me) return;
  me.friendRequestsReceived = (me.friendRequestsReceived || []).filter(r => r.fromEmail !== fromEmail);
  const other = users[fromEmail];
  if (other) other.friendRequestsSent = (other.friendRequestsSent || []).filter(e => e !== sessionEmail);

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
let friendPendingRemoval = null;
function requestRemoveFriend(email) {
  const users = getUsers();
  const p = users[email];
  friendPendingRemoval = email;
  document.getElementById("remove-friend-question").textContent =
    `Remover ${p ? p.name : "este amigo"} da sua lista de amigos?`;
  openModal("remove-friend-modal");
}
function executeRemoveFriend() {
  if (!friendPendingRemoval) { closeModal("remove-friend-modal"); return; }
  const users = getUsers();
  const me = users[sessionEmail];
  const other = users[friendPendingRemoval];
  if (me && me.friends) me.friends = me.friends.filter(e => e !== friendPendingRemoval);
  if (other && other.friends) other.friends = other.friends.filter(e => e !== sessionEmail);
  const changed = {};
  if (me) changed[sessionEmail] = me;
  if (other) changed[friendPendingRemoval] = other;
  saveUserRecords(changed);
  friendPendingRemoval = null;
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
function showToast(message) {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "app-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove("show");
  void toast.offsetWidth; // força reflow para reiniciar a transição
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function openFriendsPanel() {
  clearHomeSearch();
  renderFriendsPanel();
  openPanel("friends-panel");
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
    const stats = computePatientStats(u);
    return { email, name: u.name, avatar: u.avatar, groupsDone: stats.groupsDone, accuracyPct: stats.accuracyPct };
  }).sort((a, b) => b.groupsDone - a.groupsDone || b.accuracyPct - a.accuracyPct);

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
}
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

function playPhonemeAudio() {
  const btn = document.getElementById("phoneme-audio-btn");
  const fonema = desafios[currentIndex];

  if (activeCustomAudio[fonema]) {
    btn.classList.add("playing");
    const audioEl = new Audio(activeCustomAudio[fonema]);
    audioEl.onended = () => btn.classList.remove("playing");
    audioEl.onerror = () => btn.classList.remove("playing");
    audioEl.play().catch(() => btn.classList.remove("playing"));
    return;
  }

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
      if (user.role === "paciente") bootstrapMicPermission();
    }
  }
}

// ══════════════════════════════════════════════
// TOUR GUIADO (spotlight)
// ══════════════════════════════════════════════
const TOUR_STEPS = {
  home: [
    { el: "#profile-btn",  text: "Toque aqui para editar seu perfil: nome, foto, telefone e mais." },
    { el: "#settings-btn", text: "Aqui você ajusta som e notificações. O tema claro/escuro fica no botão do cabeçalho em qualquer tela." },
    { el: ".home-start",   text: "Toque para iniciar sua jornada de treino de fala." },
  ],
  path: [
    { el: ".path-node.unlocked, .path-node.completed", text: "Cada nó é uma fase. Toque em um nó desbloqueado para treinar aquele grupo de fonemas." },
  ],
  app: [
    { el: "#screen-app .back-btn", text: "Volte para a trilha de fases quando quiser." },
    { el: "#gender-btn",         text: "Escolha a voz que pronuncia os fonemas: feminina (rosa) ou masculina (azul)." },
    { el: "#help-btn",           text: "Precisa de ajuda? Toque aqui para ver dicas a qualquer momento." },
    { el: "#phoneme-audio-btn",  text: "Toque para ouvir a pronúncia correta do fonema." },
    { el: ".waveform-wrapper",   text: "Sua voz aparece aqui em tempo real. Basta gravar — o reconhecimento é automático." },
    { el: "#btn-record",         text: "Grave sua voz tentando repetir o fonema mostrado. Assim que houver um match, a fase avança sozinha." },
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
  positionSpotlightOn(target);
  document.getElementById("tour-tooltip-text").textContent = step.text;
  renderTourDots(steps.length, tourStepIndex);
  document.getElementById("tour-next-btn").textContent = tourStepIndex === steps.length - 1 ? "Concluir" : "Próximo";
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
  const tipH = 170;
  let top = r.bottom + 20;
  if (top + tipH > window.innerHeight) top = Math.max(16, r.top - tipH - 10);
  let left = r.left;
  if (left + tipW > window.innerWidth - 16) left = window.innerWidth - tipW - 16;
  if (left < 16) left = 16;
  tip.style.width = tipW + "px";
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
function replayTour() {
  closePanel("help-panel");
  let key = "home";
  if (!screenApp.classList.contains("hidden")) key = "app";
  else if (!screenPath.classList.contains("hidden")) key = "path";
  startTour(key);
}
// Nenhum tour começa por cima da tela de permissão de microfone (perguntada
// uma única vez, ao entrar) — se ela ainda estiver aberta quando o timer do
// tour disparar, ele é retomado depois, em resumePendingTourAfterMic().
function maybeStartHomeTour() {
  if (!localStorage.getItem("vozativa_tour_home_seen")) {
    setTimeout(() => { if (!screenHome.classList.contains("hidden") && permOverlay.classList.contains("hidden")) startTour("home"); }, 600);
  }
}
function maybeStartPathTour() {
  if (!localStorage.getItem("vozativa_tour_path_seen")) {
    setTimeout(() => { if (!screenPath.classList.contains("hidden") && permOverlay.classList.contains("hidden")) startTour("path"); }, 500);
  }
}
function maybeStartAppTour() {
  if (!localStorage.getItem("vozativa_tour_app_seen")) {
    setTimeout(() => { if (!screenApp.classList.contains("hidden") && permOverlay.classList.contains("hidden")) startTour("app"); }, 500);
  }
}
function resumePendingTourAfterMic() {
  if (!screenHome.classList.contains("hidden")) maybeStartHomeTour();
  else if (!screenPath.classList.contains("hidden")) maybeStartPathTour();
  else if (!screenApp.classList.contains("hidden")) maybeStartAppTour();
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

function renderPathTree(introAnimation) {
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
    const unlocked = completed || gi === 0 || progress.completedGroupIds.includes(grupos[gi - 1].id);
    if (completed) doneCount++;
    // Fase personalizada (grupo/exercício adicionado pelo médico) ainda
    // não concluída: ícone azul + selo "i". Uma vez concluída, vira um nó
    // "normal" (dourado + check), sem destaque especial.
    const pendingCustom = intervention.has(g.id) && !completed;
    const node = document.createElement("button");
    node.type = "button";
    node.className = "path-node " + aligns[gi % 3] + " " + (completed ? "completed" : unlocked ? "unlocked" : "locked")
      + (pendingCustom ? " has-intervention" : "");
    node.disabled = !unlocked;
    node.onclick = () => startPhase(gi);
    node.innerHTML = `
      <span class="path-node-circle-wrap">
        <span class="path-node-circle">${completed ? CHECK_SVG : unlocked ? (gi + 1) : LOCK_SVG}</span>
        ${pendingCustom ? '<span class="path-node-badge" title="Fase com exercícios adicionados pelo fonoaudiólogo">i</span>' : ""}
      </span>
      <span class="path-node-label">${escapeHtml(g.nome)}</span>`;
    if (introAnimation) {
      // gi=0 é o nó mais embaixo (Vogais); o nó mais alto (último grupo)
      // deve "chegar" primeiro na animação de cima para baixo.
      const reverseIndex = total - 1 - gi;
      node.classList.add("path-node-intro");
      node.style.animationDelay = (reverseIndex * 0.1) + "s";
    }
    tree.appendChild(node);
  });
  document.getElementById("path-progress-indicator").textContent = `${doneCount} de ${grupos.length} fases`;

  renderPathConnectors(progress, intervention);
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
  if (!user || !grupos[gi]) return;
  const progress = getProgress(user);
  const completed = progress.completedGroupIds.includes(grupos[gi].id);
  const unlocked = completed || gi === 0 || progress.completedGroupIds.includes(grupos[gi - 1].id);
  if (!unlocked) return;

  phaseGroupIndex = gi;
  phaseStartIndex = fonemaGrupo.indexOf(gi);
  let endIdx = phaseStartIndex;
  for (let i = 0; i < fonemaGrupo.length; i++) if (fonemaGrupo[i] === gi) endIdx = i;
  phaseEndIndex = endIdx;
  currentIndex = phaseStartIndex;
  phaseSegmentStatus = new Array(phaseEndIndex - phaseStartIndex + 1).fill(null);
  phaseTotal.textContent = phaseEndIndex - phaseStartIndex + 1;
  statTotal.textContent  = phaseEndIndex - phaseStartIndex + 1;

  showOnlyScreen("app");
  initApp();
  if (micGranted || micDenied) maybeStartAppTour();
}

function markGroupCompleted(groupId) {
  if (!sessionEmail) return;
  const users = getUsers();
  const user = users[sessionEmail];
  if (!user) return;
  const progress = getProgress(user);
  if (!progress.completedGroupIds.includes(groupId)) progress.completedGroupIds.push(groupId);
  registerStreakForToday(progress);
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
    seg.innerHTML = `<div class="prog-seg-track"><div class="prog-seg-fill" id="seg-fill-${li}"></div></div><div class="prog-seg-label">${escapeHtml(f)}</div>`;
    progressWrap.appendChild(seg);
  });
}

const SEGMENT_STATUS_CLASSES = ["status-correct", "status-incorrect", "status-skipped"];

function updateProgress() {
  const local = fonemaLocal[currentIndex];
  const groupPhonemes = (grupos[phaseGroupIndex] && grupos[phaseGroupIndex].fonemas) || [];
  groupPhonemes.forEach((_, li) => {
    const fill = document.getElementById(`seg-fill-${li}`);
    const seg  = document.getElementById(`seg-${li}`);
    if (!fill || !seg) return;
    fill.classList.remove(...SEGMENT_STATUS_CLASSES);
    const status = phaseSegmentStatus[li];
    if (li < local) {
      // acertado = verde, errado = vermelho, pulado = cinza
      fill.style.width = "100%"; seg.classList.remove("active");
      if (status === "correct") fill.classList.add("status-correct");
      else if (status === "incorrect") fill.classList.add("status-incorrect");
      else fill.classList.add("status-skipped");
    } else if (li === local) {
      fill.style.width = "0%"; seg.classList.add("active");
    } else {
      fill.style.width = "0%"; seg.classList.remove("active");
    }
  });
  phaseCurrent.textContent = currentIndex - phaseStartIndex + 1;
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
function skipChallenge() {
  if (isRecording) stopAudio();
  phaseSegmentStatus[currentIndex - phaseStartIndex] = "skipped";
  playBeep(480, 0.08);
  advance();
}
function advance() {
  currentIndex++;
  if (currentIndex > phaseEndIndex) finishPhase();
  else loadChallenge();
}

// ── Microfone ─────────────────────────────────
// Pergunta pela permissão UMA ÚNICA VEZ, assim que o paciente entra no app
// (chamado a partir de applyUserToUI) — não mais a cada fase. Uma vez
// perguntado nesta instalação (vozativa_mic_asked), sessões seguintes só
// tentam usar a permissão já concedida antes, em silêncio, sem reabrir esta
// tela — o único jeito de o navegador perguntar de novo é se o próprio
// usuário nunca respondeu de fato ao pedido nativo dele.
async function bootstrapMicPermission() {
  if (micGranted || micDenied) return;
  if (localStorage.getItem("vozativa_mic_asked") === "1") {
    try {
      micStream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
      micGranted = true;
    } catch (e) {
      micDenied = true;
    }
    updateMicBlockedUI();
    return;
  }
  showOverlay(permOverlay);
}
async function requestMicPermission() {
  localStorage.setItem("vozativa_mic_asked", "1");
  try { micStream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS); micGranted = true; }
  catch(e) { micDenied = true; }
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
async function retryMicPermission() {
  localStorage.setItem("vozativa_mic_asked", "1");
  try {
    micStream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
    micGranted = true; micDenied = false;
    playBeep(660, 0.12);
  } catch (e) {
    micDenied = true;
  }
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
    if (recognitionOutcome !== null) {
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
  if (!micStream || micStream.getTracks().every(t => t.readyState === "ended")) {
    try { micStream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS); micGranted = true; micDenied = false; }
    catch(e) {
      micDenied = true;
      updateMicBlockedUI();
      showToast("Não foi possível acessar o microfone.");
      return;
    }
  }
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  // smoothingTimeConstant mais baixo = a barra reage mais rápido ao volume
  // real (menos "atraso" visual e na detecção do fim da fala).
  analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.35;
  // GainNode amplifica o sinal do microfone antes da análise — ajuda a
  // captar vozes mais baixas ou em ambientes com um pouco de ruído, sem
  // exigir nenhuma configuração manual do paciente.
  const micGain = audioCtx.createGain();
  micGain.gain.value = MIC_GAIN;
  audioCtx.createMediaStreamSource(micStream).connect(micGain).connect(analyser);
  dataArray = new Uint8Array(analyser.fftSize);
  isRecording = true;
  recordingPeak = 0;
  recordingStartTime = performance.now();
  speechOnsetTime = null;
  lastAboveThresholdTime = null;
  matchDetected = false;
  recognitionOutcome = null;
  recognitionActiveForTake = SpeechRecognitionAPI && !recognitionFailed && startSpeechRecognition(desafios[currentIndex]);
  phonemeBox.classList.add("recording");
  btnRecord.classList.add("active");
  btnRecord.querySelector(".btn-label").textContent = "Ouvindo...";
  waveformIdle.classList.add("hidden-label");
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
  if (rafId)   { cancelAnimationFrame(rafId); rafId = null; }
  if (audioCtx){ audioCtx.close().catch(() => {}); audioCtx = null; }
  analyser = null; dataArray = null;
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

// Confirma e encerra a gravação (chamado automaticamente pelo match
// contínuo, pelo timeout de silêncio/duração máxima, ou por clique manual).
function finishRecording(correct) {
  if (!isRecording) return;
  const fonema = desafios[currentIndex];
  stopAudio();
  playBeep(correct ? 620 : 460, 0.1);
  flashSuccess(correct);
  phaseSegmentStatus[currentIndex - phaseStartIndex] = correct ? "correct" : "incorrect";
  registerAttempt(fonema, correct);
  // Espera só o suficiente pra animação do selo de acerto/erro (.3s) ser
  // percebida antes de avançar — reduzido de 550ms para diminuir a demora
  // depois que o paciente já terminou de responder.
  setTimeout(() => advance(), 380);
}

// ── Fase concluída ────────────────────────────
function finishPhase() {
  markGroupCompleted(grupos[phaseGroupIndex].id);
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
  document.getElementById("final-title").textContent = isLast ? "Parabéns!" : "Fase concluída!";
  document.getElementById("final-subtitle-lead").textContent = isLast
    ? "Você completou toda a trilha do VozAtiva, terminando na fase"
    : "Você completou a fase";
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
  const unsatisfactory = scorePct < 60;

  document.getElementById("final-message").textContent = unsatisfactory ? randomLowFinalMessage() : randomFinalMessage();
  document.getElementById("final-next-label").textContent = isLast ? "Concluir trilha" : "Próxima fase";
  document.querySelector(".final-medal").classList.toggle("hidden", unsatisfactory);
  statTotal.textContent = phaseLen;
  statCorrect.textContent = correctCount;
  document.getElementById("stat-wrong").textContent = incorrectCount;
  document.getElementById("stat-skipped").textContent = skippedCount;
  document.getElementById("final-stats-summary").textContent =
    `${phaseLen} ${phaseLen === 1 ? "questão proposta" : "questões propostas"}, ${correctCount} ${correctCount === 1 ? "acertada" : "acertadas"}, ${incorrectCount} ${incorrectCount === 1 ? "errada" : "erradas"} e ${skippedCount} ${skippedCount === 1 ? "pulada" : "puladas"}.`;

  if (!unsatisfactory && !reducedMotion) startFinalConfetti();
  playBeep(880, 0.3, "triangle", 0.25);
}

function restartPhase() {
  currentIndex = phaseStartIndex;
  phaseSegmentStatus = new Array(phaseEndIndex - phaseStartIndex + 1).fill(null);
  stopFinalConfetti(); finalScreen.classList.add("hidden");
  mainCard.classList.remove("hidden"); buildProgressBar(); loadChallenge();
}

function backToPath() {
  if (isRecording) stopAudio();
  stopFinalConfetti();
  finalScreen.classList.add("hidden");
  mainCard.classList.remove("hidden");
  showOnlyScreen("path");
  renderPathTree();
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
  patient.customContent.groups.push({ id, nome: name, short: shortLabel });
  patient.customContent.groupOrder.push(id);
  saveUserRecords({ [adminEditorPatientEmail]: patient });

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

  if (!groupId || !targetGroup) { errorEl.textContent = "Selecione um grupo válido."; errorEl.classList.remove("hidden"); return; }
  if (!text) { errorEl.textContent = "Informe a sílaba ou palavra."; errorEl.classList.remove("hidden"); return; }
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

    if (isEditing && cc.exercises[editingExerciseIndex]) {
      const oldText = cc.exercises[editingExerciseIndex].text;
      cc.exercises[editingExerciseIndex] = { groupId, text };
      if (oldText !== text) {
        delete cc.dicas[oldText];
        const oldAudio = cc.audio[oldText];
        const oldTextStillUsed = cc.exercises.some((ex, i) => i !== editingExerciseIndex && ex.text === oldText);
        if (!oldTextStillUsed) delete cc.audio[oldText];
        if (!audioProvided && oldAudio && !oldTextStillUsed) cc.audio[text] = oldAudio;
      }
    } else {
      cc.exercises.push({ groupId, text });
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
  document.getElementById("admin-ex-error").classList.add("hidden");
  document.getElementById("admin-ex-submit-btn").textContent = "Adicionar exercício";
  document.getElementById("admin-ex-cancel-btn").classList.add("hidden");
}

// ── Excluir exercício personalizado ──
let exercisePendingDeletion = null;
function requestDeleteExercise(index) {
  const users = getUsers();
  const patient = users[adminEditorPatientEmail];
  const ex = patient && patient.customContent.exercises[index];
  if (!ex) return;
  exercisePendingDeletion = index;
  document.getElementById("delete-exercise-question").textContent = `Excluir o exercício "${ex.text}"?`;
  openModal("delete-exercise-modal");
}
function executeDeleteExercise() {
  if (exercisePendingDeletion === null || !adminEditorPatientEmail) { closeModal("delete-exercise-modal"); return; }
  const index = exercisePendingDeletion;
  exercisePendingDeletion = null;
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
let groupPendingDeletion = null;
function requestDeleteGroup(groupId, groupName) {
  groupPendingDeletion = groupId;
  document.getElementById("delete-group-question").textContent =
    `Excluir a fase "${groupName}"? Os exercícios personalizados dela também serão removidos. Essa ação não pode ser desfeita.`;
  openModal("delete-group-modal");
}
function executeDeleteGroup() {
  if (!groupPendingDeletion || !adminEditorPatientEmail) { closeModal("delete-group-modal"); return; }
  const groupId = groupPendingDeletion;
  groupPendingDeletion = null;
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
  saveUserRecords({ [patient.email]: patient, [sessionEmail]: doctor });

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
    const card = document.createElement("div");
    card.className = "patient-card";
    card.onclick = () => openPatientDetail(p.email);
    card.setAttribute("aria-label", `Abrir perfil de ${p.name}`);
    makeKeyboardClickable(card);
    card.innerHTML = `
      <div class="patient-card-avatar">${p.avatar ? `<img src="${p.avatar}" alt=""/>` : DEFAULT_AVATAR_SVG}</div>
      <div class="patient-card-info">
        <span class="patient-card-name">${escapeHtml(p.name)}</span>
        <span class="patient-card-meta">${levelLabel(computeLevel(p))} · ${stats.groupsDone}/${totalGroups} fases · ${stats.accuracyPct}% de acerto</span>
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

  const stats = computePatientStats(p);
  const patientGroups = getUserGroups(p);

  const pathRow = document.getElementById("detail-path-row");
  pathRow.innerHTML = "";
  patientGroups.forEach((g, gi) => {
    const done = p.progress && p.progress.completedGroupIds && p.progress.completedGroupIds.includes(g.id);
    const dot = document.createElement("div");
    dot.className = "chart-path-dot" + (done ? " done" : "");
    dot.title = g.nome;
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
    entries.forEach(e => {
      const row = document.createElement("div");
      row.className = "error-bar-row";
      row.innerHTML = `<span class="error-bar-label">${escapeHtml(e.f)}</span><div class="error-bar-track"><div class="error-bar-fill" style="width:${(e.incorrect / max) * 100}%"></div></div><span class="error-bar-count">${e.incorrect}</span>`;
      errBars.appendChild(row);
    });
  }
}

// ══════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════
migrateAccountIds();
loadThemePreference();
loadReducedMotionPreference();
initAuthUI();
