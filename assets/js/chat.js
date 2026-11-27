/*
 * Chat tra chi sta usando il sito, peer-to-peer.
 * Usa la stessa stanza del contatore "online" (assets/js/live-users.js, Trystero via relay TURN):
 * nessun server, nessuno storico, i messaggi arrivano solo a chi è online in quel momento.
 *
 * - Nel terminale (comando `chat` o pagina /terminale/) si leggono e si scrivono i messaggi veri.
 * - Chi naviga normalmente vede solo la mascotte dire "nickname: miao bau miao…" (assistente.js).
 * - Moderazione (assets/js/moderazione.js) applicata da chi RICEVE: le parole vietate diventano versi.
 *   Anche limiti di lunghezza e di frequenza sono controllati in ricezione.
 *
 * API per il terminale: window.Chat = { stato, invia, nick, chi, ascolta, muta, smuta, ultimi }
 */
(function () {
  "use strict";

  var MAX_TESTO = 280, MAX_NICK = 20;
  var LIMITE = 5, FINESTRA = 15000;       // al massimo 5 messaggi ogni 15 secondi a persona
  var PAUSA_INVIO = 1500;                  // tra un mio messaggio e l'altro
  var RISERVATI = /^(palozz|admin|amministratore|moderatore|mod|bit|buddy|sistema|system|root)$/i;

  var M = window.Moderazione || { pulisci: function (t) { return t; }, vietata: function () { return false; } };

  function get(store, k) { try { return window[store].getItem(k); } catch (e) { return null; } }
  function set(store, k, v) { try { window[store].setItem(k, v); } catch (e) { /* niente */ } }

  // ── Nickname ────────────────────────────────────────────────
  function pulisciNick(n) {
    n = String(n || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, "").slice(0, MAX_NICK);
    if (n.length < 3 || M.vietata(n) || M.pulisci(n) !== n) return null;
    return n;
  }
  function nickCasuale() {
    var animale = get("localStorage", "bit-mascotte") === "cane" ? "cane" : "gatto";
    return animale + "-" + (100 + Math.floor(Math.random() * 900));
  }
  var mioNick = pulisciNick(get("localStorage", "chat-nick")) || get("sessionStorage", "chat-nick-casuale");
  if (!mioNick) { mioNick = nickCasuale(); set("sessionStorage", "chat-nick-casuale", mioNick); }

  // ── Stato ───────────────────────────────────────────────────
  var room = null, aChat = null, aNick = null, selfId = null;
  var nomi = {};          // peerId → nickname
  var arrivi = {};        // peerId → orari dei messaggi recenti (per il limite)
  var muti = {};          // nickname → true
  var ascoltatori = [];
  var ultimoInvio = 0;
  var coda = [];          // messaggi scritti mentre la connessione era giù: partono appena torna
  var eraCollegato = false;
  var ULTIMI_KEY = "chat-ultimi";
  var ultimi = [];
  try { ultimi = JSON.parse(get("sessionStorage", ULTIMI_KEY) || "[]"); } catch (e) { ultimi = []; }

  function avvisa(evento) {
    ascoltatori.forEach(function (fn) { try { fn(evento); } catch (e) { /* un ascoltatore rotto non blocca gli altri */ } });
  }

  // Trystero 0.25 restituisce un oggetto { send, onMessage }; le versioni prima [send, get].
  function azione(r, nome) {
    var a = r.makeAction(nome);
    if (Array.isArray(a)) {
      return {
        send: function (d, a2) { return a[0](d, a2); },
        on: function (fn) { a[1](function (d, peer) { fn(d, peer); }); }
      };
    }
    return {
      send: function (d, a2) { return a.send(d, a2 ? { target: a2 } : undefined); },
      on: function (fn) { a.onMessage = function (d, meta) { fn(d, meta && typeof meta === "object" ? meta.peerId : meta); }; }
    };
  }

  function nomeDi(peer) {
    var n = nomi[peer];
    return n || "anonimo-" + String(peer || "").slice(0, 4);
  }

  function collega(r) {
    room = r; nomi = {}; arrivi = {};
    if (!r) {
      avvisa({ tipo: "stato", stato: eraCollegato ? "persa" : "connessione" });
      return;
    }
    eraCollegato = true;
    selfId = window.LiveUsers && window.LiveUsers.selfId;
    aChat = azione(r, "chat");
    aNick = azione(r, "nick");
    aNick.on(function (d, peer) {
      var n = pulisciNick(d && d.nick);
      if (!n || RISERVATI.test(n)) n = "impostore-" + String(peer || "").slice(0, 4);
      var prima = nomi[peer];
      nomi[peer] = n;
      if (!prima) avvisa({ tipo: "entra", nick: n });
      else if (prima !== n) avvisa({ tipo: "nick", prima: prima, nick: n });
    });
    aChat.on(function (d, peer) { ricevi(d, peer); });
    try { aNick.send({ nick: mioNick }); } catch (e) { /* nessuno ancora */ }
    avvisa({ tipo: "stato", stato: "attiva" });
  }

  function ricevi(d, peer) {
    if (!d || typeof d.t !== "string") return;
    // limite di frequenza per persona
    var ora = Date.now(), lista = (arrivi[peer] || []).filter(function (x) { return ora - x < FINESTRA; });
    if (lista.length >= LIMITE) return;
    lista.push(ora); arrivi[peer] = lista;
    var nick = nomeDi(peer);
    if (muti[nick]) return;
    var testo = M.pulisci(d.t.replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, MAX_TESTO)).trim();
    if (!testo) return;
    registra({ tipo: "messaggio", nick: nick, testo: testo, quando: ora, mio: false });
    // Chi naviga normalmente: la mascotte "dice" il messaggio nella sua lingua.
    if (!document.querySelector(".terminale-chat") && window.BitChat) window.BitChat.dice(nick, testo);
  }

  function registra(m) {
    ultimi.push(m);
    if (ultimi.length > 40) ultimi = ultimi.slice(-40);
    set("sessionStorage", ULTIMI_KEY, JSON.stringify(ultimi));
    avvisa(m);
  }

  // ── API ─────────────────────────────────────────────────────
  window.Chat = {
    stato: function () {
      if (!document.querySelector("[data-live-users]")) return "spenta";
      if (!room) return "connessione";
      return "attiva";
    },
    invia: function (testo) {
      testo = String(testo || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, MAX_TESTO);
      if (!testo) return "vuoto";
      if (!room) {
        if (coda.length >= 5) return "offline";
        coda.push(testo);
        return "in-coda";
      }
      if (Date.now() - ultimoInvio < PAUSA_INVIO) return "troppo-veloce";
      ultimoInvio = Date.now();
      aChat.send({ t: testo });
      registra({ tipo: "messaggio", nick: mioNick, testo: M.pulisci(testo), quando: Date.now(), mio: true });
      return "ok";
    },
    nick: function (nuovo) {
      if (nuovo === undefined) return mioNick;
      var n = pulisciNick(nuovo);
      if (!n) return null;
      if (RISERVATI.test(n)) return false;
      mioNick = n;
      set("localStorage", "chat-nick", n);
      if (room) try { aNick.send({ nick: n }); } catch (e) { /* niente */ }
      return n;
    },
    chi: function () {
      var peers = room ? Object.keys(room.getPeers()) : [];
      return [mioNick + " (tu)"].concat(peers.map(nomeDi));
    },
    ascolta: function (fn) {
      ascoltatori.push(fn);
      return function () { ascoltatori = ascoltatori.filter(function (x) { return x !== fn; }); };
    },
    muta: function (nick) { muti[String(nick).toLowerCase()] = true; },
    smuta: function (nick) { delete muti[String(nick).toLowerCase()]; },
    ultimi: function () { return ultimi.slice(); }
  };

  // ── Collegamento alla stanza del contatore ──────────────────
  window.addEventListener("live-users:room", function (e) { collega(e.detail); });
  window.addEventListener("live-users:peer-join", function (e) {
    if (room && aNick) try { aNick.send({ nick: mioNick }, e.detail); } catch (err) { /* niente */ }
    // Appena c'è di nuovo qualcuno, partono i messaggi rimasti in coda.
    if (room && aChat && coda.length) {
      var da = coda; coda = [];
      setTimeout(function () {
        da.forEach(function (t) {
          aChat.send({ t: t });
          registra({ tipo: "messaggio", nick: mioNick, testo: M.pulisci(t), quando: Date.now(), mio: true });
        });
      }, 500);
    }
  });
  window.addEventListener("live-users:peer-leave", function (e) {
    var n = nomi[e.detail];
    delete nomi[e.detail];
    if (n) avvisa({ tipo: "esce", nick: n });
  });
  if (window.LiveUsers && window.LiveUsers.room) collega(window.LiveUsers.room);
})();
