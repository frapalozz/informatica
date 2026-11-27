/*
 * Easter egg: il terminale.
 * Digitando il codice Konami (↑ ↑ ↓ ↓ ← → ← → B A) il sito diventa un vecchio terminale
 * con comandi finti ma utili: `ls` e `cd` girano davvero tra corsi, anni e materie.
 * Si apre anche con #terminale nell'indirizzo. Esc o `exit` per uscire.
 *
 * I dati (corsi e materie) sono quelli di Bit: assistente.json, generato da Jekyll.
 * Il CSS (assets/css/terminale.css) si carica solo quando il terminale si apre.
 */
(function () {
  "use strict";

  var script = document.currentScript;
  var DATA_URL = (script && script.getAttribute("data-dati")) || "/assistente.json";
  var CSS_URL = (script && script.getAttribute("data-css")) || "/assets/css/terminale.css";
  var BASE = (script && script.getAttribute("data-base")) || "";
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // ── Codice Konami ───────────────────────────────────────────
  var KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  var pos = 0;
  document.addEventListener("keydown", function (e) {
    if (open) { if (e.key === "Escape") closeTerminal(); return; }
    var t = e.target;
    if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
    var k = (e.key || "").toLowerCase();
    pos = k === KONAMI[pos] ? pos + 1 : (k === KONAMI[0] ? 1 : 0);
    if (pos === KONAMI.length) { pos = 0; openTerminal(); }
  });

  // ── Dati: un piccolo file system finto ──────────────────────
  // /                          → i corsi (informatica, computer-science)
  // /<corso>                   → 1anno, 2anno, 3anno, extra
  // /<corso>/<anno>            → le materie di quell'anno
  var db = null;
  function loadData() {
    if (db) return Promise.resolve(db);
    return fetch(DATA_URL, { credentials: "same-origin" })
      .then(function (r) { return r.json(); })
      .then(function (j) { db = j; return db; })
      .catch(function () { db = { corsi: {}, materie: [] }; return db; });
  }

  function anniDi(corso) {
    var c = db.corsi[corso];
    return c ? c.anni.map(function (a) { return a + "anno"; }).concat(["extra"]) : [];
  }
  function annoKey(dir) { return dir === "extra" ? "extra" : dir.replace("anno", ""); }
  function materieDi(corso, anno) {
    return db.materie.filter(function (m) { return m.c === corso && String(m.a) === annoKey(anno); });
  }

  // Cosa c'è a un certo percorso (array di parti): tipo, figli e pagina del sito.
  function node(parts) {
    if (parts.length === 0) return { type: "dir", children: Object.keys(db.corsi) };
    var corso = parts[0];
    if (!db.corsi[corso]) return null;
    if (parts.length === 1) return { type: "dir", children: anniDi(corso) };
    var anno = parts[1];
    if (anniDi(corso).indexOf(anno) < 0) return null;
    var lista = materieDi(corso, anno);
    if (parts.length === 2) {
      return { type: "dir", children: lista.map(function (m) { return m.slug; }), url: BASE + "/" + corso + "/" + anno + "/" };
    }
    if (parts.length === 3) {
      var m = lista.filter(function (x) { return x.slug === parts[2]; })[0];
      return m ? { type: "file", materia: m, url: m.u } : null;
    }
    return null;
  }

  function resolve(arg) {
    if (!arg) return cwd.slice(); // nessun argomento: la cartella corrente
    var parts = arg === "~" || arg.charAt(0) === "/" || arg.indexOf("~/") === 0 ? [] : cwd.slice();
    (arg || "").replace(/^~\/?/, "").split("/").forEach(function (p) {
      if (!p || p === ".") return;
      if (p === "..") parts.pop();
      else parts.push(p);
    });
    return parts;
  }
  function show(parts) { return "~" + (parts.length ? "/" + parts.join("/") : ""); }

  // La cartella di partenza è quella della pagina in cui ci si trova.
  function startDir() {
    var path = window.location.pathname.slice(BASE.length);
    var m = path.match(/^\/([^/]+)\/(\d+anno|extra)\//);
    if (m && db.corsi[m[1]]) return [m[1], m[2]];
    var here = db.materie.filter(function (x) { return x.u && path.indexOf(x.u.slice(BASE.length)) === 0; })[0];
    if (here) return [here.c, here.a === "extra" ? "extra" : here.a + "anno"];
    return [];
  }

  // ── Interfaccia ─────────────────────────────────────────────
  var open = false, box, out, input, promptEl, cwd = [], history = [], hIndex = 0, lastFocus = null;

  function loadCss() {
    if (document.querySelector('link[data-terminale]')) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = CSS_URL;
    l.setAttribute("data-terminale", "");
    document.head.appendChild(l);
  }

  var BIT = [
    "   /\\_/\\      bit@informatica",
    "  ( o.o )     ----------------",
    "   > ^ <      Il terminale degli studenti.",
    "  /|   |\\     Scrivi `help` per i comandi.",
    " (_|   |_)    Esc o `exit` per uscire."
  ].join("\n");

  function openTerminal() {
    if (open) return;
    open = true;
    lastFocus = document.activeElement;
    loadCss();
    box = document.createElement("div");
    box.className = "terminale";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Terminale");
    box.innerHTML =
      '<div class="terminale-out" aria-live="polite"></div>' +
      '<label class="terminale-riga"><span class="terminale-prompt"></span>' +
      '<input class="terminale-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Comando"></label>';
    document.body.appendChild(box);
    document.documentElement.classList.add("terminale-aperto");
    out = box.querySelector(".terminale-out");
    input = box.querySelector(".terminale-input");
    promptEl = box.querySelector(".terminale-prompt");
    box.addEventListener("click", function () { if (!window.getSelection().toString()) input.focus(); });
    input.addEventListener("keydown", onKey);
    print(BIT, "terminale-bit");
    input.disabled = true;
    loadData().then(function () {
      cwd = startDir();
      input.disabled = false;
      updatePrompt();
      input.focus();
    });
  }

  function closeTerminal() {
    if (!open) return;
    open = false;
    box.remove();
    document.documentElement.classList.remove("terminale-aperto");
    if (/^#terminale$/i.test(window.location.hash)) history_replace();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function history_replace() {
    try { window.history.replaceState(null, "", window.location.pathname + window.location.search); } catch (e) { /* niente */ }
  }

  function updatePrompt() { promptEl.textContent = "studente@unicam:" + show(cwd) + "$ "; }

  function print(text, cls) {
    var p = document.createElement("pre");
    p.className = "terminale-linea" + (cls ? " " + cls : "");
    p.textContent = text;
    out.appendChild(p);
    box.scrollTop = box.scrollHeight;
    return p;
  }

  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeTerminal(); return; }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      hIndex = Math.max(0, Math.min(history.length, hIndex + (e.key === "ArrowUp" ? -1 : 1)));
      input.value = history[hIndex] || "";
      return;
    }
    if (e.key === "Tab") { e.preventDefault(); complete(); return; }
    if (e.key === "l" && e.ctrlKey) { e.preventDefault(); out.innerHTML = ""; return; }
    if (e.key !== "Enter") return;
    var line = input.value;
    input.value = "";
    print(promptEl.textContent + line, "terminale-eco");
    if (line.trim()) { history.push(line); }
    hIndex = history.length;
    run(line.trim());
  }

  // Tab: completa l'ultimo pezzo con i nomi della cartella.
  function complete() {
    var v = input.value, i = v.lastIndexOf(" ");
    var head = v.slice(0, i + 1), arg = v.slice(i + 1);
    var j = arg.lastIndexOf("/");
    var dir = j >= 0 ? arg.slice(0, j + 1) : "", start = arg.slice(j + 1);
    var n = node(resolve(dir || "."));
    if (!n || n.type !== "dir") return;
    var hits = n.children.filter(function (c) { return c.toLowerCase().indexOf(start.toLowerCase()) === 0; });
    if (hits.length === 1) input.value = head + dir + hits[0] + (node(resolve(dir + hits[0])).type === "dir" ? "/" : "");
    else if (hits.length > 1) print(hits.join("  "));
  }

  // ── Comandi ─────────────────────────────────────────────────
  var HELP = [
    "Comandi disponibili:",
    "  ls [cartella]      elenca corsi, anni o materie",
    "  cd <cartella>      entra in una cartella (anni e materie aprono la pagina)",
    "  cat <materia>      mostra le risorse di una materia",
    "  open <materia>     apre la pagina della materia",
    "  pwd · whoami · date · echo · clear · history",
    "  neofetch           info sul sistema",
    "  studia             fa quello che dice",
    "  exit               torna al sito",
    "E qualche comando nascosto, che non elenco: sei tu l'informatico."
  ].join("\n");

  function run(line) {
    if (!line) return;
    var args = line.split(/\s+/), cmd = args.shift().toLowerCase(), rest = args.join(" ");
    switch (cmd) {
      case "help": case "man": case "?": print(HELP); break;
      case "ls": case "ll": case "dir": ls(args.filter(function (a) { return a.charAt(0) !== "-"; })[0]); break;
      case "cd": cd(rest); break;
      case "pwd": print("/home/studente" + show(cwd).slice(1)); break;
      case "cat": case "less": case "more": cat(rest); break;
      case "open": case "xdg-open": openPage(rest); break;
      case "whoami": print("studente (in sessione da troppo tempo)"); break;
      case "date": print(new Date().toLocaleString("it-IT", { dateStyle: "full", timeStyle: "short" }) + "\nMancano sempre troppo pochi giorni all'esame."); break;
      case "echo": print(rest); break;
      case "clear": case "cls": out.innerHTML = ""; break;
      case "history": print(history.map(function (h, i) { return "  " + (i + 1) + "  " + h; }).join("\n")); break;
      case "neofetch": neofetch(); break;
      case "studia": studia(); break;
      case "sudo": sudo(args); break;
      case "rm": rm(args); break;
      case "exit": case "quit": case "logout": case ":q": case ":wq": closeTerminal(); break;
      case "vim": case "vi": case "nano": case "emacs": print(cmd === "emacs" ? "Bel sistema operativo, peccato manchi un editor decente." : "Sei entrato in " + cmd + ". Nessuno è mai uscito vivo.\n(Suggerimento: :q)"); break;
      case "ping": print("PONG da informatica.palozz.com: tempo=0.1ms (più veloce di Moodle)"); break;
      case "make": print(rest === "love" ? "make: *** Nessuna regola per creare 'love'. Prova con 'pizza'." : "make: *** Nessun Makefile. Come il tuo piano di studio."); break;
      case "git": print(args[0] === "push" ? "Fatto. Su main. Di venerdì. Buona fortuna." : "git: '" + (args[0] || "") + "' non è un comando git. Neanche tu sai cosa stai facendo, vero?"); break;
      case "42": print("La risposta. Ma qual era la domanda?"); break;
      case "bit": case "meow": case "miao": print("Miao! (Bit approva)"); break;
      case "bau": case "buddy": print("Bau! (Buddy approva)"); break;
      case "dada": print("Il Dada è aperto il giovedì. Il terminale tutti i giorni. Scegli con saggezza."); break;
      default: print(cmd + ": comando non trovato. Prova `help`.", "terminale-errore");
    }
  }

  function ls(arg) {
    var parts = resolve(arg), n = node(parts);
    if (!n) { print("ls: impossibile accedere a '" + (arg || "") + "': File o directory non esistente", "terminale-errore"); return; }
    if (n.type === "file") { print(parts[parts.length - 1]); return; }
    if (!n.children.length) { print("(vuota, come la mia voglia di studiare)"); return; }
    var p = print("");
    n.children.forEach(function (c, i) {
      var child = node(parts.concat([c]));
      var s = document.createElement("span");
      s.className = child && child.type === "dir" ? "terminale-dir" : "terminale-file";
      s.textContent = c + (child && child.type === "dir" ? "/" : "");
      p.appendChild(s);
      if (i < n.children.length - 1) p.appendChild(document.createTextNode("  "));
    });
  }

  function cd(arg) {
    var parts = arg ? resolve(arg) : [], n = node(parts); // `cd` da solo torna a ~
    if (!n) { print("cd: " + arg + ": File o directory non esistente", "terminale-errore"); return; }
    if (n.type === "file") { openPage(arg); return; }
    cwd = parts;
    updatePrompt();
    // Un anno è una pagina vera del sito: ci si va.
    if (n.url && !samePage(n.url)) goTo(n.url);
  }

  function cat(arg) {
    if (!arg) { print("cat: manca il nome di una materia. (Ma il gatto c'è, si chiama Bit.)"); return; }
    var n = node(resolve(arg));
    if (!n || n.type !== "file") { print("cat: " + arg + ": non è una materia", "terminale-errore"); return; }
    var m = n.materia, righe = [m.t, "Corso: " + (db.corsi[m.c] ? db.corsi[m.c].nome : m.c) + " · " + (m.a === "extra" ? "Extra" : m.a + "° anno") + (m.s && m.s !== "extra" ? " · " + m.s + "° semestre" : "")];
    if (m.materiale) righe.push("Materiale:     " + m.materiale.label + "  " + m.materiale.url);
    if (m.registrazioni) righe.push("Registrazioni: " + m.registrazioni.label + "  " + m.registrazioni.url);
    if (m.prove) righe.push("Prove passate: " + m.prove.url);
    if (m.webex) righe.push("Lezione:       " + m.webex);
    (m.extra || []).forEach(function (x) { righe.push("Extra:         " + x.nome + " (" + x.label + ")  " + x.url); });
    righe.push("Apri la pagina con: open " + m.slug);
    print(righe.join("\n"));
  }

  function openPage(arg) {
    var n = arg ? node(resolve(arg)) : null;
    if (!n || !n.url) { print("open: " + (arg || "") + ": niente da aprire", "terminale-errore"); return; }
    goTo(n.url);
  }
  function samePage(url) { return window.location.pathname === url; }
  function goTo(url) {
    print("Apro " + url + " …");
    // Il terminale si riapre da solo nella nuova pagina.
    setTimeout(function () { window.location.href = url + "#terminale"; }, 300);
  }

  function neofetch() {
    var nMat = db.materie.length, nCorsi = Object.keys(db.corsi).length;
    var art = BIT.split("\n").slice(0, 5).map(function (l) { return l.slice(0, 14); });
    var info = [
      "studente@unicam",
      "---------------",
      "OS: Informatica GNU/Unicam",
      "Corsi: " + nCorsi + " · Materie: " + nMat,
      "Shell: bash dei poveri 1.0",
      "Uptime: da quando è iniziata la sessione",
      "Memoria: 98% usata (formule di Analisi)"
    ];
    print(info.map(function (l, i) { return (art[i] || "              ") + l; }).join("\n"));
  }

  function studia() {
    input.disabled = true;
    var p = print(""), i = 0, steps = 20;
    var tick = setInterval(function () {
      i++;
      p.textContent = "Studio in corso [" + new Array(i + 1).join("█") + new Array(steps - i + 1).join("░") + "] " + Math.round(i * 100 / steps) + "%";
      if (i >= steps) {
        clearInterval(tick);
        print("Fatto! Hai studiato 0.3 CFU. Ora vai davvero a studiare.");
        input.disabled = false;
        input.focus();
      }
    }, reduced ? 10 : 90);
  }

  function sudo(args) {
    var what = args.join(" ");
    if (!what) { print("usage: sudo <comando>"); return; }
    if (/passa[-_ ]?esame/i.test(what)) { print("Permission denied: prova con `studia`.", "terminale-errore"); return; }
    if (/^rm\b/.test(what)) { rm(args.slice(1)); return; }
    if (/make\s+me\s+a\s+sandwich/i.test(what)) { print("Ok. 🥪"); return; }
    print("[sudo] password per studente: ********\nstudente non è nel file sudoers. Questo incidente verrà segnalato al professore.", "terminale-errore");
  }

  function rm(args) {
    var joined = args.join(" ");
    if (/-\w*r\w*f|-\w*f\w*r/.test(joined) && /(^|\s)(\/|~|\*|\/\*)(\s|$)/.test(joined)) { crollo(); return; }
    print("rm: impossibile rimuovere '" + (args[args.length - 1] || "") + "': gli appunti degli altri non si cancellano.", "terminale-errore");
  }

  // ── rm -rf / : il sito crolla, Bit rimette tutto a posto ────
  function crollo() {
    print("Rimozione di / in corso…", "terminale-errore");
    input.disabled = true;
    setTimeout(function () {
      closeTerminal();
      if (reduced) { toast("rm: il sito ha il backup. Bit l'ha già ripristinato."); return; }
      var items = pezzi();
      var h = window.innerHeight;
      items.forEach(function (el, i) {
        var r = el.getBoundingClientRect();
        // transform non funziona sugli elementi inline (come i link): li rendo inline-block
        if (getComputedStyle(el).display === "inline") el.style.display = "inline-block";
        el.classList.add("terminale-cade");
        el.style.transitionDelay = (Math.random() * 0.4).toFixed(2) + "s";
        el.style.transform = "translateY(" + Math.round(h - r.top + 40) + "px) rotate(" + Math.round(Math.random() * 60 - 30) + "deg)";
      });
      setTimeout(function () { toast("Tranquillo, avevo il backup. — Bit"); }, 1400);
      setTimeout(function () {
        items.forEach(function (el) {
          el.style.transitionDelay = (Math.random() * 0.3).toFixed(2) + "s";
          el.style.transform = "";
        });
        setTimeout(function () {
          items.forEach(function (el) { el.classList.remove("terminale-cade"); el.style.transitionDelay = ""; el.style.display = ""; });
        }, 1500);
      }, 2600);
    }, 600);
  }

  // I pezzi della pagina che cadono: quelli visibili, non troppi.
  function pezzi() {
    var sel = "main h1, main h2, main h3, main p, main a, main img, main button, nav a, header a, footer a, footer p";
    var all = Array.prototype.slice.call(document.querySelectorAll(sel));
    return all.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight || r.width === 0) return false;
      // niente elementi annidati dentro un altro pezzo che cade già
      return !all.some(function (o) { return o !== el && o.contains(el); });
    }).slice(0, 60);
  }

  function toast(text) {
    loadCss();
    var t = document.createElement("div");
    t.className = "terminale-toast";
    t.setAttribute("role", "status");
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3500);
  }

  // Aperto con #terminale (anche dopo `cd` o `open`, che cambiano pagina).
  // Sta in fondo perché tutte le variabili qui sopra devono essere già pronte.
  if (/^#terminale$/i.test(window.location.hash)) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", openTerminal);
    else openTerminal();
  }
  window.addEventListener("hashchange", function () {
    if (/^#terminale$/i.test(window.location.hash)) openTerminal();
  });
})();
