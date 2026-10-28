/*
 * Bit, l'assistente del sito.
 *
 * Un gattino pixel che gira per la pagina, su desktop e su telefono (cammina sui
 * titoli, si siede, si addormenta, guarda il cursore). Con "riduci movimento" o
 * con "Mettilo nell'angolo" resta seduto in basso a sinistra; su telefono, in quel
 * caso, il pulsante "Prendi una Moneta" si nasconde per non stargli addosso.
 * Cliccandolo si apre una chat: niente AI, le risposte vengono dalle
 * materie (assistente.json, generato da Jekyll) e da _data/assistente.yml.
 * "Portami lì" fa camminare Bit fino al punto giusto della pagina e lo evidenzia.
 *
 * Dal 15 ottobre al 1° novembre è un gatto nero con il cappello da strega
 * e si sposta volando sulla scopa. ?gatto=strega|arancione forza l'aspetto.
 *
 * Il motore delle risposte (Engine) non usa il DOM: in Node si può importare
 * con require() per i test.
 */
(function () {
  "use strict";

  // ══════════════════════════════════════════════════════════
  //  Motore delle risposte
  // ══════════════════════════════════════════════════════════
  var Engine = (function () {
    var STOP = new Set((
      "a ad al alla alle allo agli ai anche c ce che chi ci col come con cosa cose da dal dalla dalle dei del della delle dello " +
      "degli di do dove e ed gli ha hai ho i il in io la le lo l ma me mi ne nel nella nei per piu po puo posso potrei qual quale quali " +
      "qualcosa qui sai se si sono su sul sulla sui ti tra trovo trovare trovi un una uno vorrei voglio cerco cercando serve servono " +
      "sapere dimmi mostrami dammi fammi vedere avere hanno c e mio mia miei mie tuo tua link pagina materia materie corso esame esami " +
      "the of and to for"
    ).split(" "));

    // Cosa cerca lo studente. L'ordine conta: la prima voce trovata vince.
    var INTENTS = [
      { id: "prove", words: ["prove", "prova", "esami", "esame", "compiti", "compito", "tracce", "traccia", "scritto", "scritti", "appelli", "appello", "passati", "passate", "vecchie", "vecchi"] },
      { id: "registrazioni", words: ["registrazioni", "registrazione", "registrate", "registrata", "video", "videolezioni", "videolezione", "registrati"] },
      { id: "appunti", words: ["appunti", "riassunti", "riassunto", "notion", "libro", "libri", "esercizi", "esercitazioni", "formulario", "dispensa", "dispense"] },
      { id: "materiale", words: ["materiale", "materiali", "slide", "slides", "moodle", "classroom", "didattico", "didattica"] },
      { id: "webex", words: ["webex", "live", "diretta", "streaming", "aula"] },
    ];

    var INTENT_NAME = {
      prove: "le prove passate",
      registrazioni: "le registrazioni",
      materiale: "il materiale didattico",
      webex: "il link Webex",
      appunti: "appunti ed esercizi",
    };

    var YEAR_WORDS = { primo: "1", prima: "1", secondo: "2", seconda: "2", terzo: "3", terza: "3" };

    function norm(s) {
      return String(s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    }

    function tokens(s) {
      return norm(s).split(" ").filter(function (t) { return t && !STOP.has(t); });
    }

    function lev(a, b) {
      if (Math.abs(a.length - b.length) > 2) return 3;
      var prev = [], prev2 = [], cur, i, j;
      for (j = 0; j <= b.length; j++) prev[j] = j;
      for (i = 1; i <= a.length; i++) {
        cur = [i];
        for (j = 1; j <= b.length; j++) {
          cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
          // lettere scambiate ("algortimi") = un solo errore
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], prev2[j - 2] + 1);
        }
        prev2 = prev;
        prev = cur;
      }
      return prev[b.length];
    }

    function build(db) {
      var alias = db.alias || {};
      db.materie.forEach(function (m) {
        var words = tokens(m.t).concat(tokens(String(m.slug || "").replace(/_/g, " ")));
        var terms = new Set(words.filter(function (w) { return w.length > 2; }));
        // Sigla dalle iniziali: "Algoritmi e Strutture Dati" → "asd"
        var initials = tokens(m.t).map(function (w) { return w[0]; }).join("");
        var shorts = new Set();
        if (initials.length >= 3) terms.add(initials);
        else if (initials.length === 2) shorts.add(initials);
        var phrases = [];
        (alias[m.slug] || []).forEach(function (a) {
          var n = norm(a);
          if (n.indexOf(" ") >= 0) phrases.push(n);
          else if (n.length <= 2) shorts.add(n);
          else terms.add(n);
        });
        m._terms = Array.from(terms);
        m._titleTerms = tokens(m.t).filter(function (w) { return w.length > 2; });
        m._shorts = shorts;
        m._phrases = phrases;
      });
      (db.faq || []).forEach(function (f) {
        f._phrases = (f.domande || []).map(norm).filter(Boolean);
      });
      return db;
    }

    function detectIntent(qn) {
      var words = qn.split(" ");
      for (var i = 0; i < INTENTS.length; i++) {
        for (var j = 0; j < INTENTS[i].words.length; j++) {
          if (words.indexOf(INTENTS[i].words[j]) >= 0) return INTENTS[i].id;
        }
      }
      if (/\blezioni registrate\b/.test(qn)) return "registrazioni";
      return null;
    }

    function intentWords() {
      var all = new Set();
      INTENTS.forEach(function (it) { it.words.forEach(function (w) { all.add(w); }); });
      return all;
    }
    var INTENT_WORDS = intentWords();

    function detectYear(qn) {
      var m = qn.match(/\b([1-3])\s*(?:o|a|°)?\s*anno\b/) || qn.match(/\banno\s*([1-3])\b/);
      if (m) return m[1];
      m = qn.match(/\b(primo|prima|secondo|seconda|terzo|terza)\s+anno\b/);
      return m ? YEAR_WORDS[m[1]] : null;
    }

    // Nomi dei corsi: non servono a riconoscere una materia ("informatica" da sola non è Fondamenti di Informatica).
    var COURSE_WORDS = new Set(["informatica", "computer", "science", "cs", "triennale", "magistrale", "laurea"]);

    function detectCourse(qn) {
      if (/\b(computer science|cs|magistrale|inglese|english)\b/.test(qn)) return "computer-science";
      if (/\b(triennale|corso di informatica|laurea in informatica)\b/.test(qn)) return "informatica";
      return null;
    }

    function scoreMateria(m, qTokens, qn, rawWords) {
      var score = 0, matched = 0;
      m._phrases.forEach(function (p) {
        if ((" " + qn + " ").indexOf(" " + p + " ") >= 0) { score += 4; matched++; }
      });
      qTokens.forEach(function (qt, idx) {
        var best = 0;
        m._terms.forEach(function (t) {
          var s = 0;
          if (qt === t) s = 3;
          else if ((qt.length >= 4 && t.indexOf(qt) === 0) || (t.length >= 4 && qt.indexOf(t) === 0)) s = 2;
          else if (qt.length >= 5 && lev(qt, t) <= 1) s = 2.5;
          else if (qt.length >= 8 && lev(qt, t) <= 2) s = 2;
          if (s > best) best = s;
        });
        // Sigle di due lettere ("so", "bd"): solo se scritte in maiuscolo o se la domanda è corta,
        // e mai in "non so" / "lo so".
        if (best < 3 && m._shorts.has(qt)) {
          var raw = rawWords[idx].w;
          var before = rawWords[idx].before;
          var upper = raw.length === 2 && raw === raw.toUpperCase();
          if ((upper || qTokens.length <= 3) && before !== "non" && before !== "lo" && before !== "io") best = 3;
        }
        if (best > 0) matched++;
        score += best;
      });
      if (score === 0) return 0;
      // A parità di punteggio vince la materia il cui nome è coperto meglio dalla domanda
      // ("programmazione" → Programmazione, non Metodologie di Programmazione).
      var covered = m._titleTerms.filter(function (t) {
        return qTokens.some(function (qt) { return qt === t || (qt.length >= 4 && t.indexOf(qt) === 0) || (qt.length >= 5 && lev(qt, t) <= 1); });
      }).length;
      return score + covered / Math.max(1, m._titleTerms.length);
    }

    function rankMaterie(db, q) {
      var qn = norm(q);
      var rawWords = String(q || "").split(/[^A-Za-zÀ-ÿ0-9]+/).filter(Boolean);
      // Le parole che indicano cosa si cerca non servono a riconoscere la materia.
      var qTokens = [], rawKept = [];
      rawWords.forEach(function (w, i) {
        var n = norm(w);
        if (!n || STOP.has(n) || INTENT_WORDS.has(n)) return;
        if (COURSE_WORDS.has(n) && !/fondamenti/.test(qn)) return;
        qTokens.push(n);
        rawKept.push({ w: w, before: i > 0 ? norm(rawWords[i - 1]) : "" });
      });
      var course = detectCourse(qn);
      return db.materie
        .filter(function (m) { return !course || m.c === course; })
        .map(function (m) { return { m: m, s: scoreMateria(m, qTokens, qn, rawKept) }; })
        .filter(function (r) { return r.s >= 2.5; })
        .sort(function (a, b) { return b.s - a.s; });
    }

    function bestFaq(db, qn) {
      var best = null, bestLen = 0;
      (db.faq || []).forEach(function (f) {
        f._phrases.forEach(function (p) {
          if ((" " + qn + " ").indexOf(" " + p + " ") >= 0 && p.length > bestLen) { best = f; bestLen = p.length; }
        });
      });
      return best;
    }

    function resolveUrl(db, url) {
      if (!url) return null;
      if (url[0] === "@") return (db.link || {})[url.slice(1)] || null;
      return url;
    }

    function isInternal(url) {
      return url && url[0] === "/" && url.indexOf("/assets/") !== 0;
    }

    function linkAction(db, label, url) {
      var u = resolveUrl(db, url);
      if (!u) return null;
      if (u[0] === "/") u = (db.base || "") + u;
      return { label: label, href: u, external: !isInternal(url) };
    }

    function yearLabel(m) {
      if (m.a === "extra") return "risorsa extra";
      return m.a + "° anno" + (m.s && m.s !== "extra" ? ", " + m.s + "° semestre" : "");
    }

    function materiaAnswer(db, m, intent) {
      var corso = (db.corsi[m.c] || {}).nome || m.c;
      var page = { label: "Portami alla pagina", go: { url: (db.base || "") + m.u, voce: intent && intent !== "appunti" ? intent : null } };
      var actions = [];
      var res = intent && intent !== "appunti" ? (intent === "webex" ? (m.webex ? { url: m.webex, label: "Webex" } : null) : m[intent]) : null;

      if (intent && intent !== "appunti") {
        if (res && res.url) {
          var text = "Ecco " + INTENT_NAME[intent] + " di " + m.t + ".";
          if (isInternal(res.url)) {
            actions.push({ label: "Portami lì", go: { url: (db.base || "") + res.url, voce: null } });
          } else {
            actions.push(linkAction(db, "Apri " + (res.label || "il link"), res.url));
            actions.push({ label: "Mostrami dove sta", go: { url: (db.base || "") + m.u, voce: intent } });
          }
          return { kind: "materia", text: text, actions: actions.filter(Boolean), materia: m.slug };
        }
        return {
          kind: "mancante",
          text: "Per " + m.t + " non ho ancora " + INTENT_NAME[intent] + ". Se le hai, puoi aggiungerle tu: aiuti chi viene dopo.",
          actions: [page, linkAction(db, "Aggiungi risorsa", "/risorsa/")].filter(Boolean),
          materia: m.slug,
        };
      }

      if (intent === "appunti") {
        var extra = (m.extra || []).filter(function (e) { return e && e.url; });
        if (extra.length) {
          extra.slice(0, 6).forEach(function (e) { actions.push(linkAction(db, e.nome + " (" + e.label + ")", e.url)); });
          actions.push(page);
          return { kind: "materia", text: "Per " + m.t + " ci sono queste risorse in più:", actions: actions.filter(Boolean), materia: m.slug };
        }
        return {
          kind: "mancante",
          text: "Per " + m.t + " non ho ancora appunti o esercizi. Se li hai, puoi aggiungerli tu.",
          actions: [page, linkAction(db, "Aggiungi risorsa", "/risorsa/")].filter(Boolean),
          materia: m.slug,
        };
      }

      // Nessuna richiesta precisa: riassunto di cosa c'è.
      var have = [];
      if (m.materiale) have.push({ label: "Materiale", ask: "materiale " + m.t });
      if (m.registrazioni) have.push({ label: "Registrazioni", ask: "registrazioni " + m.t });
      if (m.prove) have.push({ label: "Prove passate", ask: "prove " + m.t });
      if (m.extra && m.extra.length) have.push({ label: "Appunti e altro", ask: "appunti " + m.t });
      return {
        kind: "materia",
        text: m.t + " (" + corso + ", " + yearLabel(m) + "). Cosa ti serve?",
        actions: [page].concat(have),
        materia: m.slug,
      };
    }

    /**
     * ctx.materia: la materia della pagina aperta (se c'è), così "prove" o
     * "registrazioni" senza nome si riferiscono a quella.
     */
    function answer(db, q, ctx) {
      ctx = ctx || {};
      var qn = norm(q);
      if (!qn) return { kind: "vuoto", text: "Scrivimi una materia o cosa ti serve.", actions: [] };

      var intent = detectIntent(qn);
      var year = detectYear(qn);
      var course = detectCourse(qn);
      var ranked = rankMaterie(db, q);
      var faq = bestFaq(db, qn);

      if (ranked.length && (!faq || ranked[0].s >= 3)) {
        var top = ranked[0];
        var close = ranked.filter(function (r) { return r !== top && top.s - r.s < 0.5; });
        if (close.length) {
          var options = [top].concat(close).slice(0, 4);
          return {
            kind: "scelta",
            text: "Intendi quale di queste?",
            actions: options.map(function (r) {
              return { label: r.m.t, ask: (intent ? intent + " " : "") + r.m.t };
            }),
          };
        }
        return materiaAnswer(db, top.m, intent);
      }

      if (intent && ctx.materia && !year) return materiaAnswer(db, ctx.materia, intent);

      if (faq) {
        return {
          kind: "faq",
          text: faq.risposta,
          actions: (faq.link || []).map(function (l) { return linkAction(db, l.label, l.url); }).filter(Boolean),
        };
      }

      if (year) {
        var corsi = course ? [course] : Object.keys(db.corsi).filter(function (c) { return db.corsi[c].anni.indexOf(year) >= 0; });
        corsi = corsi.filter(function (c) { return db.materie.some(function (m) { return m.c === c && m.a === year; }); });
        var list = [];
        corsi.forEach(function (c) {
          db.materie
            .filter(function (m) { return m.c === c && m.a === year; })
            .forEach(function (m) { list.push({ label: m.t + (corsi.length > 1 ? " · " + db.corsi[c].nome : ""), ask: m.t }); });
        });
        if (!list.length) return { kind: "anno", text: "Non trovo materie del " + year + "° anno.", actions: [] };
        var yearPages = corsi.map(function (c) {
          return { label: "Pagina " + year + "° anno " + db.corsi[c].nome, go: { url: (db.base || "") + "/" + c + "/" + year + "anno/", voce: null } };
        });
        return { kind: "anno", text: "Materie del " + year + "° anno:", actions: list.concat(yearPages) };
      }

      if (intent) {
        var withIt = db.materie.filter(function (m) {
          if (intent === "webex") return !!m.webex && m.a !== "extra";
          if (intent === "appunti") return m.extra && m.extra.length && m.a !== "extra";
          return !!m[intent];
        });
        if (!withIt.length) return { kind: "intent", text: "Al momento nessuna materia ha " + INTENT_NAME[intent] + ".", actions: [] };
        return {
          kind: "intent",
          text: "Di quale materia? Queste hanno " + INTENT_NAME[intent] + ":",
          actions: withIt.slice(0, 8).map(function (m) { return { label: m.t, ask: intent + " " + m.t }; }),
        };
      }

      var onlyCourse = course || (/\binformatica\b/.test(qn) ? "informatica" : null);
      if (onlyCourse && db.corsi[onlyCourse]) {
        var c = db.corsi[onlyCourse];
        return {
          kind: "corso",
          text: c.nome + ": scegli l'anno, oppure chiedimi una materia.",
          actions: c.anni.map(function (a) {
            return { label: a + "° anno", go: { url: (db.base || "") + "/" + onlyCourse + "/" + a + "anno/", voce: null } };
          }).concat([{ label: "Extra", go: { url: (db.base || "") + "/" + onlyCourse + "/extra/", voce: null } }]),
        };
      }

      return {
        kind: "non-capito",
        text: "Non ho capito. Prova con il nome di una materia e cosa ti serve, per esempio «prove di algoritmi». Se non c'è, puoi chiedere nei gruppi o proporla tu.",
        actions: [
          linkAction(db, "Gruppo WhatsApp", "@whatsapp"),
          linkAction(db, "Aggiungi risorsa", "/risorsa/"),
        ].filter(Boolean),
      };
    }

    return { build: build, answer: answer, norm: norm };
  })();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = Engine;
    return;
  }

  // ══════════════════════════════════════════════════════════
  //  Interfaccia
  // ══════════════════════════════════════════════════════════
  var script = document.currentScript;
  var DATA_URL = (script && script.getAttribute("data-dati")) || "/assistente.json";
  var NOME = (script && script.getAttribute("data-nome")) || "Bit";

  var mq = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var reduced = mq("(prefers-reduced-motion: reduce)");
  var desktop = mq("(hover: hover) and (pointer: fine)") && window.innerWidth >= 900;
  var mobile = !desktop;

  function store(kind) {
    try { return window[kind]; } catch (e) { return null; }
  }
  function getItem(kind, key) {
    try { var s = store(kind); return s ? s.getItem(key) : null; } catch (e) { return null; }
  }
  function setItem(kind, key, value) {
    try { var s = store(kind); if (s) { if (value === null) s.removeItem(key); else s.setItem(key, value); } } catch (e) { /* niente */ }
  }

  function track(name) {
    try { if (typeof window.sa_event === "function") window.sa_event(name); } catch (e) { /* niente */ }
  }

  // ── Dati (caricati alla prima domanda) ─────────────────────
  var dbPromise = null;
  function loadDb() {
    if (!dbPromise) {
      dbPromise = fetch(DATA_URL, { credentials: "same-origin" })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(Engine.build)
        .catch(function (err) { dbPromise = null; throw err; });
    }
    return dbPromise;
  }

  // ── Aspetto ────────────────────────────────────────────────
  function pickSkin() {
    var forced = null;
    try { forced = new URLSearchParams(window.location.search).get("gatto"); } catch (e) { /* niente */ }
    if (forced === "strega") return "witch";
    if (forced === "arancione" || forced === "normale") return "orange";
    var d = new Date(), month = d.getMonth(), day = d.getDate();
    return (month === 9 && day >= 15) || (month === 10 && day === 1) ? "witch" : "orange";
  }
  var skin = pickSkin();
  var witch = skin === "witch";

  // Sprite 22x18, rivolti a destra. o contorno, f pelo, a strisce, b macchie, w petto,
  // e occhi, n naso; cappello: h, B fascia; scopa: t manico, g/G saggina, r legatura.
  var FRAMES = {
    walk1: [
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "...oo.......o.....o...",
      "..ofo......ofo...ofo..",
      "..ofo......offoooffo..",
      "...ofo.....offfaaffo..",
      "...ofo.....offfffefo..",
      "...ofoooooooffffwwno..",
      "....offbffaffffffwo...",
      "....offfffffffffwwo...",
      "....offafffaffffwfo...",
      "....offffffffffffo....",
      "....ofofo...ofofo.....",
      "....ooooo...ooooo....."
    ],
    walk2: [
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "...oo.......o.....o...",
      "..ofo......ofo...ofo..",
      "..ofo......offoooffo..",
      "...ofo.....offfaaffo..",
      "...ofo.....offfffefo..",
      "...ofoooooooffffwwno..",
      "....offbffaffffffwo...",
      "....offfffffffffwwo...",
      "....offafffaffffwfo...",
      "....offffffffffffo....",
      "...ofo.ofo.ofo.ofo....",
      "...ooo.ooo.ooo.ooo...."
    ],
    sit: [
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      ".....o.....o..........",
      "....ofo...ofo.........",
      "....offoooffo.........",
      "...offfbaffffo..oo....",
      "...offefffeffo.ofo....",
      "...offfwnwfffo.ofo....",
      "....offwwwffo..ofo....",
      "....offwwwfao..ofo....",
      "....offwwwffo.ofo.....",
      "....ofbwwwaffoffo.....",
      "....ofwofowffffo......",
      "....oooooooooooo......"
    ],
    play: [
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      ".....o.....o..........",
      "....ofo...ofo.........",
      "....offoooffo.........",
      "...offfbaffffo..oo....",
      "...offefffeffo.ofo....",
      "...offfwnwfffo.ofo....",
      "...oooffwwffo..ofo....",
      "...offoowwfao..ofo....",
      "...offo.wwffo.ofo.....",
      "....oo.owwaffoffo.....",
      ".......owofffffo......",
      ".......ooooooooo......"
    ],
    sleep: [
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "......................",
      "............o.....o...",
      "...........ofo...ofo..",
      "....ooooooooffoooffo..",
      "...offbffaffffaafffo..",
      "...offffffffffffoofo..",
      "..oaffffffffffffwwno..",
      "..oaaaaaaaaoooooooo...",
      "...oooooooo..........."
    ],
    ride: [
      "......................",
      "......................",
      "......................",
      "......................",
      "....oo.......o.....o..",
      "...ofo......ofo...ofo.",
      "...ofo......offoooffo.",
      "....ofo.....offfaaffo.",
      "....ofo.....offfffefo.",
      "....ofoooooooffffwwno.",
      ".....offbffaffffffwo..",
      ".....offfffffffffwwo..",
      ".....offafffaffffwfo..",
      "Gg...offffffffffffo...",
      "ggggo.oooooooooooooooo",
      "GGGGrtttttttttttttttto",
      "ggggo.oooooooooooooooo",
      "Gg...................."
    ]
  };
  var HAT = [
    "..oo.......",
    ".ohho......",
    "..ohho.....",
    "...ohho....",
    "...oBBBo...",
    "ohhhhhhhhho"
  ];
  var HAT_AT = {walk1: [10, 3], walk2: [10, 3], sit: [3, 3], play: [3, 3], sleep: [10, 7], ride: [11, 1]};
  var COLS = 22, ROWS = 18, SCALE = desktop ? 2.5 : 2.25;
  var W = COLS * SCALE, H = ROWS * SCALE;
  var COLORS = {
    o: "var(--bit-outline)", f: "var(--bit-fur)", a: "var(--bit-stripe)", b: "var(--bit-patch)",
    w: "var(--bit-chest)", e: "var(--bit-eye)", n: "var(--bit-nose)",
    h: "var(--bit-hat)", B: "var(--bit-band)", r: "var(--bit-band)",
    t: "var(--bit-broom)", g: "var(--bit-straw)", G: "var(--bit-straw-shade)",
  };

  function rects(rows, dx, dy) {
    var out = "";
    rows.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var c = COLORS[row[x]];
        if (c) out += '<rect x="' + (x + dx) + '" y="' + (y + dy) + '" width="1" height="1" fill="' + c + '"/>';
      }
    });
    return out;
  }

  function spriteSvg() {
    var g = "";
    Object.keys(FRAMES).forEach(function (name) {
      g += '<g class="bit-f bit-f-' + name + '">' + rects(FRAMES[name], 0, 0) +
        '<g class="bit-hat">' + rects(HAT, HAT_AT[name][0], HAT_AT[name][1]) + "</g></g>";
    });
    return '<svg class="bit-sprite" viewBox="0 0 ' + COLS + " " + ROWS + '" width="' + W + '" height="' + H +
      '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' + g + "</svg>";
  }

  // ── DOM ────────────────────────────────────────────────────
  var layer = document.createElement("div");
  layer.className = "bit-layer";

  var cat = document.createElement("button");
  cat.type = "button";
  cat.className = "bit-cat" + (reduced ? " bit-docked" : "");
  cat.setAttribute("aria-label", "Apri la chat con " + NOME + ", l'assistente del sito");
  cat.setAttribute("aria-expanded", "false");
  cat.setAttribute("aria-controls", "bit-panel");
  cat.dataset.skin = skin;
  cat.dataset.frame = "sit";
  cat.dataset.dir = "1";
  cat.innerHTML = spriteSvg() + '<span class="bit-zzz" aria-hidden="true"><span>z</span><span>z</span><span>z</span></span>';

  var hint = document.createElement("span");
  hint.className = "bit-hint";
  hint.setAttribute("aria-hidden", "true");
  hint.textContent = "Ciao! Cliccami se cerchi qualcosa";

  var panel = document.createElement("div");
  panel.id = "bit-panel";
  panel.className = "bit-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat con " + NOME);
  panel.hidden = true;
  panel.innerHTML =
    '<div class="bit-head" data-bit-perch>' +
    '  <p class="bit-title">' + NOME + "</p>" +
    '  <div class="bit-head-actions">' +
    (!reduced ? '    <button type="button" class="bit-btn-text" data-bit-stay></button>' : "") +
    '    <button type="button" class="bit-close" aria-label="Chiudi la chat">×</button>' +
    "  </div>" +
    "</div>" +
    '<div class="bit-log" aria-live="polite"></div>' +
    '<form class="bit-form" autocomplete="off">' +
    '  <label class="bit-sr" for="bit-input">Scrivi una domanda a ' + NOME + "</label>" +
    '  <input id="bit-input" class="bit-input" type="text" maxlength="160" placeholder="Es. prove di algoritmi">' +
    '  <button type="submit" class="bit-send">Chiedi</button>' +
    "</form>";

  cat.appendChild(hint);
  layer.appendChild(cat);
  document.body.appendChild(layer);
  document.body.appendChild(panel);

  var log = panel.querySelector(".bit-log");
  var form = panel.querySelector(".bit-form");
  var input = panel.querySelector(".bit-input");
  var stayBtn = panel.querySelector("[data-bit-stay]");

  // ── Chat ───────────────────────────────────────────────────
  var greeted = false;

  function addMessage(who, text, actions) {
    var msg = document.createElement("div");
    msg.className = "bit-msg bit-msg-" + who;
    var p = document.createElement("p");
    p.textContent = text;
    msg.appendChild(p);
    if (actions && actions.length) {
      var row = document.createElement("div");
      row.className = "bit-actions";
      actions.forEach(function (a) {
        var el;
        if (a.href) {
          el = document.createElement("a");
          el.href = a.href;
          if (a.external) { el.target = "_blank"; el.rel = "noopener"; }
        } else {
          el = document.createElement("button");
          el.type = "button";
          el.addEventListener("click", function () {
            if (a.ask) ask(a.ask);
            else if (a.go) goTo(a.go);
          });
        }
        el.className = "bit-action" + (a.go ? " bit-action-go" : "");
        el.textContent = a.label;
        row.appendChild(el);
      });
      msg.appendChild(row);
    }
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
  }

  function greet() {
    if (greeted) return;
    greeted = true;
    addMessage("bit", "Ciao, sono " + NOME + "! Chiedimi una materia e cosa ti serve: prove passate, registrazioni, materiale, appunti.");
    loadDb().then(function (db) {
      var chips = (db.suggerimenti || []).map(function (s) { return { label: s, ask: s }; });
      if (chips.length) addMessage("bit", "Per esempio:", chips);
    }).catch(function () { /* l'errore si vede alla prima domanda */ });
  }

  function ask(q) {
    q = String(q || "").trim();
    if (!q) return;
    addMessage("me", q);
    loadDb().then(function (db) {
      var a = Engine.answer(db, q, { materia: currentMateria(db) });
      addMessage("bit", a.text, a.actions);
      track(a.kind === "non-capito" ? "bit_non_capito" : "bit_risposta");
    }).catch(function () {
      addMessage("bit", "Non riesco a leggere l'elenco delle materie. Controlla la connessione e riprova.");
    });
  }

  function currentMateria(db) {
    var here = window.location.pathname.replace(/\/+$/, "");
    var base = db.base || "";
    for (var i = 0; i < db.materie.length; i++) {
      var m = db.materie[i];
      var urls = [m.u, m.prove && m.prove.url && m.prove.url[0] === "/" ? m.prove.url : null];
      for (var j = 0; j < urls.length; j++) {
        if (urls[j] && (base + urls[j]).replace(/\/+$/, "") === here) return m;
      }
    }
    return null;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value;
    input.value = "";
    ask(q);
  });

  function openPanel() {
    if (!panel.hidden) return;
    panel.hidden = false;
    cat.setAttribute("aria-expanded", "true");
    hideHint();
    greet();
    track("bit_aperto");
    setTimeout(function () { input.focus(); }, 30);
    if (walker) walker.onPanel(true);
  }

  function closePanel(returnFocus) {
    if (panel.hidden) return;
    panel.hidden = true;
    cat.setAttribute("aria-expanded", "false");
    if (returnFocus) cat.focus();
    if (walker) walker.onPanel(false);
  }

  panel.querySelector(".bit-close").addEventListener("click", function () { closePanel(true); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) closePanel(true);
  });

  // ── Fumetto di benvenuto (una volta per visitatore) ──────────
  function hideHint() { hint.classList.remove("bit-hint-on"); }
  function showHint() {
    if (getItem("localStorage", "bit-salutato")) return;
    setItem("localStorage", "bit-salutato", "1");
    hint.classList.add("bit-hint-on");
    setTimeout(hideHint, 6000);
  }

  // ── "Portami lì" ───────────────────────────────────────────
  function samePage(url) {
    try {
      var a = new URL(url, window.location.href);
      return a.pathname.replace(/\/+$/, "") === window.location.pathname.replace(/\/+$/, "");
    } catch (e) { return false; }
  }

  function findTarget(voce) {
    if (voce) {
      var el = document.querySelector('[data-bit-voce="' + voce + '"]');
      if (el) return el;
    }
    return document.querySelector("main h1, section h1, h1");
  }

  function highlight(el) {
    el.classList.remove("bit-highlight");
    void el.offsetWidth; // riavvia l'animazione
    el.classList.add("bit-highlight");
    setTimeout(function () { el.classList.remove("bit-highlight"); }, 2600);
  }

  function goTo(go) {
    if (samePage(go.url)) {
      var el = findTarget(go.voce);
      if (!el) return;
      if (!desktop) closePanel(false);
      if (walker) walker.goTo(el, function () { highlight(el); });
      else {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
        highlight(el);
      }
      return;
    }
    setItem("sessionStorage", "bit-arrivo", JSON.stringify({ voce: go.voce || null }));
    window.location.href = go.url;
  }

  // Dopo un "Portami lì" verso un'altra pagina: Bit ci arriva e indica il punto.
  function onArrival() {
    var raw = getItem("sessionStorage", "bit-arrivo");
    if (!raw) return;
    setItem("sessionStorage", "bit-arrivo", null);
    var info = {};
    try { info = JSON.parse(raw) || {}; } catch (e) { /* niente */ }
    var el = findTarget(info.voce);
    if (!el) return;
    setTimeout(function () {
      if (walker) walker.goTo(el, function () { highlight(el); });
      else { el.scrollIntoView({ behavior: "auto", block: "center" }); highlight(el); }
    }, 400);
  }

  // ══════════════════════════════════════════════════════════
  //  Bit che gira per la pagina (desktop e telefono, senza "riduci movimento")
  // ══════════════════════════════════════════════════════════
  var walker = null;

  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /** Bordo superiore della prima riga di testo di un elemento, in coordinate di pagina. */
  function measure(el) {
    if (!el || !el.isConnected) return null;
    var r0 = el.getBoundingClientRect();
    if (!r0.width || !r0.height) return null;
    var left, right, top;
    if (el.classList.contains("bit-head")) {
      left = r0.left + 8; right = r0.right - 8; top = r0.top;
    } else {
      var range = document.createRange();
      range.selectNodeContents(el);
      var rs = Array.prototype.filter.call(range.getClientRects(), function (r) { return r.width > 0 && r.height > 0; });
      if (!rs.length) return null;
      var firstTop = Math.min.apply(null, rs.map(function (r) { return r.top; }));
      var line = rs.filter(function (r) { return r.top < firstTop + 4; });
      left = Math.min.apply(null, line.map(function (r) { return r.left; }));
      right = Math.max.apply(null, line.map(function (r) { return r.right; }));
      var fs = parseFloat(getComputedStyle(el).fontSize) || 16;
      top = firstTop + fs * 0.24;
    }
    if (right - left < W + 6) {
      // Riga troppo corta (es. "Webex"): Bit si mette sopra, centrato.
      var mid = (left + right) / 2;
      left = mid - W / 2 - 3; right = mid + W / 2 + 3;
    }
    return { el: el, left: left + window.scrollX, right: right + window.scrollX, top: top + window.scrollY };
  }

  var PERCH_SELECTOR = "h1, h2, h3, [data-bit-perch]";

  function perches() {
    return Array.prototype.slice.call(document.querySelectorAll(PERCH_SELECTOR))
      .filter(function (el) {
        if (el.closest("header.nav, #donation-popup, #legacy-popup")) return false;
        if (el.closest(".bit-panel") && panel.hidden) return false;
        return true;
      })
      .map(measure)
      .filter(Boolean);
  }

  function startWalker() {
    var s = {
      perch: null, relX: 0, targetRelX: 0, dir: 1, mode: "sit", until: 0, idles: 0,
      offscreenSince: 0, x: 0, y: 0, jump: null, mouse: { x: -1e5, y: -1e5 }, after: null,
    };
    var frame = "sit";
    var nav = document.querySelector("header.nav");
    var visible = function (p) {
      // sotto la barra fissa in alto (più bassa su telefono)
      var navH = nav ? nav.getBoundingClientRect().bottom + 10 : 110;
      return p.top > window.scrollY + navH && p.top < window.scrollY + window.innerHeight - 10;
    };

    function pick(exclude) {
      var all = perches().filter(function (p) { return p.el !== exclude && !p.el.closest(".bit-panel"); });
      if (!all.length) return null;
      var vis = all.filter(visible);
      if (vis.length) {
        var w = vis.map(function (p) { return 1 / (1 + Math.abs(p.top - s.y) / 250); });
        var r = Math.random() * w.reduce(function (a, b) { return a + b; }, 0);
        for (var i = 0; i < vis.length; i++) { if ((r -= w[i]) <= 0) return vis[i]; }
        return vis[0];
      }
      var mid = window.scrollY + window.innerHeight / 2;
      return all.sort(function (a, b) { return Math.abs(a.top - mid) - Math.abs(b.top - mid); })[0];
    }

    function jumpTo(p, now, opts) {
      opts = opts || {};
      var relX = opts.relX !== undefined ? opts.relX : clamp(s.x - p.left + rand(-120, 120), 0, p.right - p.left - W);
      var x1 = p.left + relX, y1 = p.top, x0 = s.x, y0 = s.y;
      if (opts.fromEdge) {
        y0 = y1 < s.y ? window.scrollY - 10 : window.scrollY + window.innerHeight + H;
        x0 = x1 + rand(-80, 80);
      }
      var dist = Math.hypot(x1 - x0, y1 - y0);
      s.jump = {
        x0: x0, y0: y0, x1: x1, y1: y1, t0: now, el: p.el, relX: relX,
        dur: witch ? clamp(700 + dist * 1.1, 1100, 2400) : clamp(350 + dist * 0.6, 450, 1100),
        arc: witch ? 24 + Math.min(60, dist * 0.12) : 30 + Math.min(140, Math.abs(y1 - y0) * 0.35),
      };
      s.dir = x1 >= x0 ? 1 : -1;
      s.mode = "jump";
    }

    function decide(now, p) {
      var maxRel = p.right - p.left - W, r = Math.random();
      if (!panel.hidden) { s.mode = "sit"; s.until = now + 3000; return; }
      if (s.idles >= 2 && r < 0.5) { s.mode = "sleep"; s.until = now + rand(9000, 16000); s.idles = 0; }
      else if (r < 0.4) { s.mode = "walk"; s.targetRelX = rand(0, maxRel); s.dir = s.targetRelX >= s.relX ? 1 : -1; }
      else if (r < 0.75) { s.mode = "sit"; s.until = now + rand(2000, 4500); s.idles++; }
      else { var n = pick(s.perch); if (n) jumpTo(n, now); else s.mode = "sit"; }
    }

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      s.mouse.x = e.pageX; s.mouse.y = e.pageY;
    }, { passive: true });

    var last = performance.now();
    function render() {
      // s.x / s.y sono coordinate di pagina, il livello è fisso: si sottrae lo scroll.
      cat.style.transform = "translate(" + Math.round(s.x - window.scrollX) + "px," + Math.round(s.y - H - window.scrollY) + "px)";
      cat.dataset.frame = frame;
      cat.dataset.mode = s.mode;
      cat.dataset.dir = String(s.dir);
    }

    function tick(now) {
      requestAnimationFrame(tick);
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (s.mode === "jump" && s.jump) {
        var j = s.jump, t = Math.min(1, (now - j.t0) / j.dur);
        if (witch) {
          var e = t * t * (3 - 2 * t);
          s.x = j.x0 + (j.x1 - j.x0) * e;
          s.y = j.y0 + (j.y1 - j.y0) * e - j.arc * 4 * e * (1 - e) + Math.sin(t * Math.PI * 4) * 3 * (1 - t);
          frame = "ride";
        } else {
          s.x = j.x0 + (j.x1 - j.x0) * t;
          s.y = j.y0 + (j.y1 - j.y0) * t - j.arc * 4 * t * (1 - t);
          frame = t < 0.5 ? "walk2" : "walk1";
        }
        if (t >= 1) {
          s.perch = j.el; s.relX = j.relX; s.jump = null;
          s.mode = "sit"; s.until = now + rand(1200, 2500);
          if (s.after) { var cb = s.after; s.after = null; cb(); }
        }
        render();
        return;
      }

      var p = s.perch ? measure(s.perch) : null;
      if (!p) {
        p = pick(null);
        if (!p) return;
        s.perch = p.el;
        s.relX = rand(0, Math.max(0, p.right - p.left - W));
        cat.classList.add("bit-ready");
        setTimeout(showHint, 1500);
      }
      var maxRel = Math.max(0, p.right - p.left - W);
      s.relX = clamp(s.relX, 0, maxRel);
      s.x = p.left + s.relX;
      s.y = p.top;

      // Se il punto dove sta finisce fuori schermo, Bit raggiunge chi legge.
      if (!visible(p) && !s.after && !p.el.closest(".bit-panel")) {
        if (!s.offscreenSince) s.offscreenSince = now;
        if (now - s.offscreenSince > 1200) {
          s.offscreenSince = 0;
          var n = pick(s.perch);
          if (n && visible(n)) { jumpTo(n, now, { fromEdge: true }); render(); return; }
        }
      } else s.offscreenSince = 0;

      // Guarda il cursore quando si avvicina.
      var near = Math.hypot(s.mouse.x - (s.x + W / 2), s.mouse.y - (s.y - H / 2)) < 110;
      if (near && s.mode !== "jump") {
        s.dir = s.mouse.x >= s.x + W / 2 ? 1 : -1;
        if (s.mode === "sleep" || s.mode === "walk") s.mode = "sit";
        s.until = Math.max(s.until, now + 1500);
        s.idles = 0;
      }

      if (s.mode === "walk") {
        var step = 38 * dt, diff = s.targetRelX - s.relX;
        if (Math.abs(diff) <= step) { s.relX = s.targetRelX; decide(now, p); }
        else s.relX += Math.sign(diff) * step;
        frame = Math.floor(now / 150) % 2 ? "walk1" : "walk2";
      } else if (s.mode === "sleep") {
        frame = "sleep";
        if (now > s.until) { s.mode = "sit"; s.until = now + rand(1500, 3000); }
      } else {
        frame = near ? (Math.floor(now / 380) % 2 ? "play" : "sit") : "sit";
        if (now > s.until) decide(now, p);
      }
      if (s.mode === "jump") frame = witch ? "ride" : "walk2";

      s.x = p.left + s.relX;
      render();
    }
    requestAnimationFrame(tick);

    return {
      onPanel: function (open) {
        if (open) {
          // Bit salta sopra la finestra della chat.
          var p = measure(panel.querySelector(".bit-head"));
          if (p) jumpTo(p, performance.now(), { relX: Math.max(0, p.right - p.left - W - 6) });
        } else if (s.perch && s.perch.closest(".bit-panel")) {
          var n = pick(null);
          if (n) jumpTo(n, performance.now());
        }
      },
      goTo: function (el, done) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // aspetta lo scroll, poi va lì
        setTimeout(function () {
          var target = el.matches(PERCH_SELECTOR) ? el : (el.querySelector("[data-bit-perch]") || el);
          var p = measure(target);
          if (!p) { done(); return; }
          s.after = done;
          jumpTo(p, performance.now(), { relX: 0 });
        }, 450);
      },
    };
  }

  // ── Avvio ──────────────────────────────────────────────────
  cat.addEventListener("click", function () {
    if (panel.hidden) openPanel();
    else closePanel(false);
  });

  var stayKey = "bit-in-angolo";
  function applyStay() {
    var stay = getItem("localStorage", stayKey) === "1";
    if (stayBtn) stayBtn.textContent = stay ? "Fallo girare" : "Mettilo nell'angolo";
    return stay;
  }

  if (stayBtn) {
    stayBtn.addEventListener("click", function () {
      var stay = getItem("localStorage", stayKey) === "1";
      setItem("localStorage", stayKey, stay ? null : "1");
      window.location.reload();
    });
  }

  var stay = applyStay();
  if (!reduced && !stay) {
    walker = startWalker();
  } else {
    cat.classList.add("bit-docked", "bit-ready");
    panel.classList.add("bit-panel-docked");
    // Su telefono il pulsante "Prendi una Moneta" starebbe addosso al gatto: lo nascondiamo.
    if (mobile) document.documentElement.classList.add("bit-moneta-nascosta");
    setTimeout(showHint, 1500);
  }
  onArrival();
})();
