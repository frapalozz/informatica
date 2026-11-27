// Cloudflare Worker davanti a informatica.palozz.com (GitHub Pages).
// Copia di riferimento: il codice vero si incolla nel Worker del sito su Cloudflare
// (vedi cloudflare/README.md). Route: informatica.palozz.com/*
//
// Fa due cose:
//  1. Il sito dal terminale. Con curl/wget/HTTPie:
//       curl informatica.palozz.com                     → benvenuto e corsi
//       curl informatica.palozz.com/informatica/2anno   → materie dell'anno (stessi indirizzi del sito)
//       curl informatica.palozz.com/informatica/Basi_di_Dati → risorse della materia
//       bash <(curl -s informatica.palozz.com/terminale) → terminale interattivo (lo script chiama /_t)
//  2. La battaglia tra cani e gatti per chi arriva dai siti nella variabile d'ambiente SITI
//     (separati da virgola), anche quando nascondono la provenienza (rel=noreferrer).
// Tutto il resto passa a GitHub Pages senza modifiche.

const HOST = "https://informatica.palozz.com";
const PAGINE_SENZA_REFERRER = ["/", "/index.html"];

// ── Colori ANSI (disattivati con ?nocolor o NO_COLOR nello script) ─────────
const C = { reset: "\x1b[0m", verde: "\x1b[92m", verdeScuro: "\x1b[32m", blu: "\x1b[94m", arancio: "\x1b[38;5;215m", rosso: "\x1b[91m", grigio: "\x1b[90m", grassetto: "\x1b[1m" };
const noColor = new Proxy({}, { get: () => "" });

function eTerminale(h) {
  const ua = (h.get("User-Agent") || "").toLowerCase();
  return /^(curl|wget|httpie|xh|powershell|libfetch|aria2)/.test(ua) || ua.includes("powershell");
}

// ── Dati del sito: assistente.json (corsi e materie), in cache 5 minuti ───────
async function dati(origin) {
  const r = await fetch(origin + "/assistente.json", { cf: { cacheTtl: 300, cacheEverything: true }, headers: { "User-Agent": "informatica-terminale" } });
  if (!r.ok) throw new Error("assistente.json " + r.status);
  return r.json();
}

// ── File system finto: / → corsi → anni → materie (come nel terminale del sito) ─
function anniDi(db, corso) {
  const c = db.corsi[corso];
  return c ? c.anni.map((a) => a + "anno").concat(["extra"]) : [];
}
const annoKey = (dir) => (dir === "extra" ? "extra" : dir.replace("anno", ""));
const materieDi = (db, corso, anno) => db.materie.filter((m) => m.c === corso && String(m.a) === annoKey(anno));

function nodo(db, parti) {
  if (parti.length === 0) return { tipo: "dir", figli: Object.keys(db.corsi) };
  const [corso, anno, nome] = parti;
  if (!db.corsi[corso]) return null;
  if (parti.length === 1) return { tipo: "dir", figli: anniDi(db, corso) };
  if (!anniDi(db, corso).includes(anno)) return null;
  const lista = materieDi(db, corso, anno);
  if (parti.length === 2) return { tipo: "dir", figli: lista.map((m) => m.slug), url: `/${corso}/${anno}/` };
  if (parti.length === 3) {
    const m = lista.find((x) => x.slug.toLowerCase() === String(nome).toLowerCase());
    return m ? { tipo: "file", materia: m, url: m.u } : null;
  }
  return null;
}

function risolvi(cwd, arg) {
  if (!arg) return cwd.slice();
  let parti = arg === "~" || arg.startsWith("/") || arg.startsWith("~/") ? [] : cwd.slice();
  for (const p of arg.replace(/^~\/?/, "").split("/")) {
    if (!p || p === ".") continue;
    if (p === "..") parti.pop();
    else parti.push(p);
  }
  return parti;
}

// Un indirizzo del sito → percorso nel file system finto.
function daIndirizzo(db, path) {
  const p = path.replace(/\/+$/, "").split("/").filter(Boolean);
  if (p.length === 0) return [];
  const corso = p[0];
  if (!db.corsi[corso]) return null;
  if (p.length === 1) return [corso];
  if (/^\d+anno$|^extra$/.test(p[1])) return [corso, p[1]];
  const m = db.materie.find((x) => x.c === corso && x.slug.toLowerCase() === p[1].toLowerCase());
  return m ? [corso, m.a === "extra" ? "extra" : m.a + "anno", m.slug] : null;
}

// ── Testi ─────────────────────────────────────────────────────────────
const ART = ["   /\\_/\\     ", "  ( o.o )    ", "   > ^ <     ", "  /|   |\\    ", " (_|   |_)   "];
const BIT = (c) => [
  `${c.arancio}${ART[0]} ${c.verde}bit@informatica${c.reset}`,
  `${c.arancio}${ART[1]} ${c.verde}---------------${c.reset}`,
  `${c.arancio}${ART[2]} ${c.reset}Il sito degli studenti UNICAM, dal terminale.`,
  `${c.arancio}${ART[3]}${c.reset}`,
  `${c.arancio}${ART[4]}${c.reset}`,
].join("\n");

function benvenuto(db, c) {
  return [
    BIT(c),
    "",
    `${c.grassetto}Corsi${c.reset}`,
    ...Object.entries(db.corsi).map(([k, v]) => `  ${c.blu}${k}/${c.reset}  ${c.grigio}${v.nome} · anni ${v.anni.join(", ")}${c.reset}`),
    "",
    `${c.grassetto}Come si usa${c.reset}`,
    `  ${c.verde}curl informatica.palozz.com/informatica/2anno${c.reset}         ${c.grigio}le materie di un anno${c.reset}`,
    `  ${c.verde}curl informatica.palozz.com/informatica/Basi_di_Dati${c.reset}  ${c.grigio}le risorse di una materia${c.reset}`,
    `  ${c.verde}bash <(curl -s informatica.palozz.com/terminale)${c.reset}     ${c.grigio}il terminale interattivo${c.reset}`,
    "",
  ].join("\n");
}

function lista(db, parti, c) {
  const n = nodo(db, parti);
  if (!n) return null;
  if (n.tipo === "file") return scheda(db, n.materia, c);
  if (!n.figli.length) return `${c.grigio}(vuota, come la mia voglia di studiare)${c.reset}`;
  if (parti.length === 2) {
    // Un anno: una materia per riga, con semestre e nome per esteso.
    const mat = materieDi(db, parti[0], parti[1]);
    const w = Math.max(...mat.map((m) => m.slug.length)) + 2;
    return mat
      .map((m) => `  ${c.verde}${m.slug.padEnd(w)}${c.reset}${c.grigio}${m.s && m.s !== "extra" ? m.s + "° sem · " : ""}${m.t}${c.reset}`)
      .join("\n");
  }
  return n.figli.map((f) => `${c.blu}${f}/${c.reset}`).join("  ");
}

function scheda(db, m, c) {
  const corso = db.corsi[m.c] ? db.corsi[m.c].nome : m.c;
  const r = [
    `${c.grassetto}${c.verde}${m.t}${c.reset}`,
    `${c.grigio}${corso} · ${m.a === "extra" ? "Extra" : m.a + "° anno"}${m.s && m.s !== "extra" ? " · " + m.s + "° semestre" : ""}${c.reset}`,
    "",
  ];
  const etichette = ["Materiale", "Registrazioni", "Prove passate", "Lezione"].concat((m.extra || []).map((x) => String(x.nome)));
  const w = Math.max(...etichette.map((e) => e.length)) + 2;
  const riga = (et, testo) => r.push(`  ${c.arancio}${et.padEnd(w)}${c.reset}${testo}`);
  if (m.materiale) riga("Materiale", `${m.materiale.label}  ${c.blu}${m.materiale.url}${c.reset}`);
  if (m.registrazioni) riga("Registrazioni", `${m.registrazioni.label}  ${c.blu}${m.registrazioni.url}${c.reset}`);
  if (m.prove) riga("Prove passate", `${c.blu}${m.prove.url.startsWith("/") ? HOST + m.prove.url : m.prove.url}${c.reset}`);
  if (m.webex) riga(m.a === "extra" ? "Risorsa" : "Lezione", `${c.blu}${m.webex}${c.reset}`);
  for (const x of m.extra || []) riga(x.nome, `${x.label}  ${c.blu}${x.url}${c.reset}`);
  r.push("", `  ${c.grigio}Pagina: ${HOST}${m.u}${c.reset}`);
  return r.join("\n");
}

// ── Terminale interattivo: lo script bash manda ogni comando a /_t ──────────
// Risposta: righe normali da stampare, più righe di controllo che lo script interpreta:
//   @cwd /percorso   nuova cartella        @open URL   apri nel browser
//   @studia          barra di avanzamento  @lento      le righe seguenti escono piano
const HELP = (c) => [
  `${c.grassetto}Comandi${c.reset}`,
  "  ls [cartella]      elenca corsi, anni o materie",
  "  cd <cartella>      entra in una cartella",
  "  cat <materia>      mostra le risorse di una materia",
  "  open [cartella]    apre la pagina nel browser",
  "  pwd · whoami · date · echo · clear · history",
  "  neofetch           info sul sistema",
  "  studia             fa quello che dice",
  "  exit               esci",
  `${c.grigio}E qualche comando nascosto. Sei tu l'informatico.${c.reset}`,
].join("\n");

function comando(db, cwd, linea, c) {
  const args = linea.trim().split(/\s+/).filter(Boolean);
  const cmd = (args.shift() || "").toLowerCase();
  const resto = args.join(" ");
  const errore = (t) => `${c.rosso}${t}${c.reset}`;
  const mostra = (p) => "~" + (p.length ? "/" + p.join("/") : "");
  switch (cmd) {
    case "": return "";
    case "@benvenuto": return benvenuto(db, c);
    case "help": case "man": case "?": return HELP(c);
    case "ls": case "ll": case "dir": {
      const arg = args.find((a) => !a.startsWith("-"));
      return lista(db, risolvi(cwd, arg), c) ?? errore(`ls: impossibile accedere a '${arg || ""}': File o directory non esistente`);
    }
    case "cd": {
      const parti = resto ? risolvi(cwd, resto) : [];
      const n = nodo(db, parti);
      if (!n) return errore(`cd: ${resto}: File o directory non esistente`);
      if (n.tipo === "file") return errore(`cd: ${resto}: è una materia, non una cartella. Prova: cat ${parti[2]}`);
      return "@cwd /" + parti.join("/");
    }
    case "pwd": return "/home/studente" + mostra(cwd).slice(1);
    case "cat": case "less": case "more": {
      if (!resto) return "cat: manca il nome di una materia. (Ma il gatto c'è, si chiama Bit.)";
      const n = nodo(db, risolvi(cwd, resto));
      return n && n.tipo === "file" ? scheda(db, n.materia, c) : errore(`cat: ${resto}: non è una materia`);
    }
    case "open": case "xdg-open": case "start": {
      const n = nodo(db, risolvi(cwd, resto));
      if (!n) return errore(`open: ${resto}: niente da aprire`);
      return "@open " + HOST + (n.url || "/");
    }
    case "whoami": return "studente (in sessione da troppo tempo)";
    case "date": return new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome", dateStyle: "full", timeStyle: "short" }) + "\nMancano sempre troppo pochi giorni all'esame.";
    case "echo": return resto;
    case "neofetch": {
      const info = [`${c.verde}studente@unicam${c.reset}`, `${c.verde}---------------${c.reset}`, `OS: Informatica GNU/Unicam`, `Corsi: ${Object.keys(db.corsi).length} · Materie: ${db.materie.length}`, "Shell: bash dei poveri 1.0", "Uptime: da quando è iniziata la sessione", "Memoria: 98% usata (formule di Analisi)"];
      return info.map((l, i) => `${c.arancio}${ART[i] || "             "}${c.reset} ${l}`).join("\n");
    }
    case "studia": return "@studia";
    case "sudo": {
      if (!resto) return "usage: sudo <comando>";
      if (/passa[-_ ]?esame/i.test(resto)) return errore("Permission denied: prova con `studia`.");
      if (/^rm\b/.test(resto)) return comando(db, cwd, resto, c);
      if (/make\s+me\s+a\s+sandwich/i.test(resto)) return "Ok. 🥪";
      return errore("[sudo] password per studente: ********\nstudente non è nel file sudoers. Questo incidente verrà segnalato al professore.");
    }
    case "rm": {
      if (/-\w*r\w*f|-\w*f\w*r/.test(resto) && /(^|\s)(\/|~|\*|\/\*)(\s|$)/.test(resto)) {
        const file = db.materie.slice(0, 12).map((m) => `${c.rosso}rimosso '/${m.c}/${m.slug}'${c.reset}`);
        return ["@lento", ...file, `${c.rosso}rimosso '/'${c.reset}`, "", `${c.arancio}Tranquillo, avevo il backup. — Bit${c.reset}`].join("\n");
      }
      return errore(`rm: impossibile rimuovere '${args[args.length - 1] || ""}': gli appunti degli altri non si cancellano.`);
    }
    case "chat": case "who": return `La chat esiste solo nel browser: apri ${c.blu}${HOST}/terminale/${c.reset}`;
    case "vim": case "vi": case "nano": return `Sei entrato in ${cmd}. Nessuno è mai uscito vivo.\n(Suggerimento: :q)`;
    case "emacs": return "Bel sistema operativo, peccato manchi un editor decente.";
    case ":q": case ":wq": return "Bravo, sei uscito da vim. Raro.";
    case "ping": return "PONG da informatica.palozz.com: tempo=0.1ms (più veloce di Moodle)";
    case "make": return resto === "love" ? "make: *** Nessuna regola per creare 'love'. Prova con 'pizza'." : "make: *** Nessun Makefile. Come il tuo piano di studio.";
    case "git": return args[0] === "push" ? "Fatto. Su main. Di venerdì. Buona fortuna." : `git: '${args[0] || ""}' non è un comando git. Neanche tu sai cosa stai facendo, vero?`;
    case "42": return "La risposta. Ma qual era la domanda?";
    case "bit": case "meow": case "miao": return "Miao! (Bit approva)";
    case "bau": case "buddy": return "Bau! (Buddy approva)";
    case "dada": return "Il Dada è aperto il giovedì. Il terminale tutti i giorni. Scegli con saggezza.";
    default: return errore(`${cmd}: comando non trovato. Prova \`help\`.`);
  }
}

// Lo script bash del terminale interattivo (bash <(curl -s informatica.palozz.com/terminale)).
const SCRIPT = `#!/usr/bin/env bash
# Terminale di informatica.palozz.com — esegui con: bash <(curl -s informatica.palozz.com/terminale)
# Ogni comando viene mandato al sito con curl; qui si stampa la risposta. Niente altro.
H="${HOST}"; CWD="/"; C=""; [ -n "$NO_COLOR" ] && C="&nocolor=1"
command -v curl >/dev/null || { echo "Serve curl."; exit 1; }
chiedi() { curl -s -G "$H/_t?x=1$C" --data-urlencode "cwd=$CWD" --data-urlencode "cmd=$1"; }
apri() { if command -v xdg-open >/dev/null; then xdg-open "$1" >/dev/null 2>&1; elif command -v open >/dev/null; then open "$1"; else echo "Apri: $1"; fi; }
studia() { local i b; for i in $(seq 1 20); do b=$(printf '%*s' "$i" '' | tr ' ' '#'); printf '\\rStudio in corso [%-20s] %3d%%' "$b" $((i*5)); sleep 0.08; done; printf '\\nFatto! Hai studiato 0.3 CFU. Ora vai davvero a studiare.\\n'; }
HISTFILE=/dev/null; set -o history 2>/dev/null
chiedi "@benvenuto"; echo "Scrivi help per i comandi, exit per uscire."
while true; do
  if [ -n "$C" ]; then P="studente@unicam:~\${CWD%/}\\$ "; else P=$'\\001\\e[92m\\002studente@unicam\\001\\e[0m\\002:\\001\\e[94m\\002~'"\${CWD%/}"$'\\001\\e[0m\\002$ '; fi
  IFS= read -r -e -p "$P" riga || { echo; break; }
  history -s "$riga" 2>/dev/null
  case "$riga" in exit|quit|logout) break ;; clear|cls) clear; continue ;; history) history; continue ;; "") continue ;; esac
  lento=0
  while IFS= read -r r || [ -n "$r" ]; do
    case "$r" in
      "@cwd "*) CWD="\${r#@cwd }" ;;
      "@open "*) echo "Apro \${r#@open } …"; apri "\${r#@open }" ;;
      "@studia") studia ;;
      "@lento") lento=1 ;;
      *) echo "$r"; [ $lento = 1 ] && sleep 0.07 ;;
    esac
  done < <(chiedi "$riga")
done
echo "Ciao! Torna quando vuoi: bash <(curl -s informatica.palozz.com/terminale)"
`;

function testo(body, status = 200) {
  return new Response(body.endsWith("\n") ? body : body + "\n", {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}

async function terminale(request, url) {
  const c = url.searchParams.has("nocolor") ? noColor : C;
  if (url.pathname === "/terminale" || url.pathname === "/terminale/" || url.pathname === "/terminale.sh") {
    return testo(SCRIPT);
  }
  let db;
  try { db = await dati(url.origin); } catch (e) { return testo("Il sito non risponde, riprova tra poco.", 503); }
  if (url.pathname === "/_t") {
    const cwd = (url.searchParams.get("cwd") || "/").split("/").filter(Boolean);
    return testo(comando(db, nodo(db, cwd) ? cwd : [], (url.searchParams.get("cmd") || "").slice(0, 300), c));
  }
  let path = url.pathname;
  try { path = decodeURIComponent(path); } catch { /* indirizzo strano: lo lascio com'è */ }
  const parti = daIndirizzo(db, path);
  // Non è una pagina di corsi/anni/materie (es. un PDF delle prove): passa al sito normale.
  if (!parti) return null;
  if (parti.length === 0) return testo(benvenuto(db, c));
  return testo(lista(db, parti, c));
}

// ── La battaglia (vedi 404.html e assets/js/battaglia.js nel sito) ──────────
function battaglia(request, url, env) {
  const h = request.headers;
  const isPagina = (request.method === "GET" || request.method === "HEAD") && h.get("Sec-Fetch-Dest") === "document" && h.get("Sec-Fetch-Mode") === "navigate";
  if (!isPagina || url.pathname.startsWith("/battaglia")) return null;
  const siti = String((env && env.SITI) || "").split(",").map((s) => s.trim()).filter(Boolean);
  const referer = h.get("Referer") || "";
  let daSito = false;
  try {
    const host = new URL(referer).hostname.replace(/^www\./, "");
    daSito = siti.some((s) => host === s || host.endsWith("." + s));
  } catch { /* nessun referer */ }
  const nascosto = siti.length > 0 && referer === "" && h.get("Sec-Fetch-Site") === "cross-site" && PAGINE_SENZA_REFERRER.includes(url.pathname);
  if (!daSito && !nascosto) return null;
  return new Response(null, { status: 302, headers: { Location: url.origin + "/battaglia/", "Cache-Control": "no-store", "X-Battaglia": daSito ? "referer" : "noreferrer" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if ((request.method === "GET" || request.method === "HEAD") && (eTerminale(request.headers) || url.pathname === "/_t")) {
      const t = await terminale(request, url);
      if (t) return t;
      return fetch(request);
    }
    const b = battaglia(request, url, env);
    if (b) return b;
    const res = await fetch(request);
    // La homepage non va tenuta in cache dal browser, altrimenti un click da un altro sito non arriva qui.
    if (PAGINE_SENZA_REFERRER.includes(url.pathname)) {
      const out = new Response(res.body, res);
      out.headers.set("Cache-Control", "no-cache");
      return out;
    }
    return res;
  },
};
