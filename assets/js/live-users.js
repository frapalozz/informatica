/* Informatica – contatore utenti online peer-to-peer, orientato alla privacy.
   - Nessuna richiesta esterna finché non c'è consenso (o relay TURN attivo).
   - Con TURN configurato: iceTransportPolicy "relay" → i peer non vedono il tuo IP.
   - Senza TURN: opt-in esplicito (in WebRTC i peer vedono l'IP).
   - Rispetta Global Privacy Control / Do Not Track.
   - Connessi solo mentre la scheda è visibile; nessun dato applicativo scambiato.
   - Nessun cookie/localStorage; l'eventuale consenso vive solo in sessionStorage
     (si cancella alla chiusura della scheda). */
(function () {
  "use strict";

  var warn = function (msg, detail) {
    if (window.console && console.warn) console.warn("[live-users] " + msg, detail || "");
  };

  var root = document.querySelector("[data-live-users]");
  if (!root) { warn("elemento [data-live-users] non trovato: il footer non include live-users.html oppure live_users.enabled è false"); return; }
  if (!window.RTCPeerConnection) { warn("WebRTC non disponibile in questo browser"); return; }

  // Segnali di privacy del browser: non partecipare e non mostrare nulla.
  // Si può disattivare con live_users.respect_privacy_signals: false (consigliato solo per test in locale).
  var nav = window.navigator || {};
  if (root.getAttribute("data-respect-signals") !== "false") {
    if (nav.globalPrivacyControl === true) { warn("disattivato di proposito: il browser ha Global Privacy Control attivo"); return; }
    if (nav.doNotTrack === "1" || window.doNotTrack === "1") { warn("disattivato di proposito: il browser ha Do Not Track attivo"); return; }
  }

  var attr = function (k) { return root.getAttribute("data-" + k) || ""; };
  var src = attr("src"), appId = attr("app"), roomId = attr("room") || "online-users";
  var turnUrls = attr("turn-urls").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  var relay = turnUrls.length > 0;

  var optin = root.querySelector("[data-live-optin]");
  var view = root.querySelector("[data-live-view]");
  var countEl = root.querySelector("[data-live-count]");

  var CONSENT_KEY = "live-users-consent";
  var getConsent = function () { try { return sessionStorage.getItem(CONSENT_KEY) === "1"; } catch (e) { return false; } };
  var setConsent = function () { try { sessionStorage.setItem(CONSENT_KEY, "1"); } catch (e) { /* ok: vale solo per questa pagina */ } };

  var mod = null, room = null, lastShown = 0, warmUntil = 0;

  // Avvisa il resto della pagina (es. il bottone "Prendi una Moneta") che il contatore è apparso o è cambiato.
  var notify = function () {
    try { window.dispatchEvent(new Event("live-users:change")); } catch (e) { /* browser molto vecchi */ }
  };
  var bind = function (obj, name, fn) {
    if (typeof obj[name] === "function") obj[name](fn); else obj[name] = fn;
  };

  var render = function () {
    var n = 1 + (room ? Object.keys(room.getPeers()).length : 0);
    // Dopo un rientro in primo piano non far "sfarfallare" il numero mentre i peer si ricollegano.
    if (Date.now() < warmUntil && lastShown > n) n = lastShown;
    lastShown = n;
    countEl.textContent = n;
    optin.hidden = true;
    view.hidden = false;
    root.hidden = false;
    notify();
  };

  var roomConfig = function () {
    var cfg = { appId: appId };
    if (relay) {
      // Solo relay: nessun candidato con il tuo IP viene mai offerto agli altri peer.
      cfg.rtcConfig = {
        iceServers: [{ urls: turnUrls, username: attr("turn-user"), credential: attr("turn-cred") }],
        iceTransportPolicy: "relay"
      };
    }
    return cfg;
  };

  var join = function () {
    if (room || !mod || document.hidden) return;
    room = mod.joinRoom(roomConfig(), roomId, {
      onJoinError: function (d) { warn("connessione a un peer fallita (TURN non valido o rete che blocca la porta?)", d); }
    });
    // Trystero >= 0.25: callback come proprietà. Versioni precedenti: metodi che accettano il callback.
    bind(room, "onPeerJoin", render);
    bind(room, "onPeerLeave", render);
    warmUntil = Date.now() + 4000;
    setTimeout(render, 4100);
    render();
  };

  var leave = function () {
    if (!room) return;
    var r = room; room = null;
    r.leave();
  };

  var activate = function () {
    import(src).then(function (m) {
      mod = m;
      join();
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) leave(); else join();
      });
      window.addEventListener("pagehide", leave);
    }).catch(function (err) {
      warn("contatore disattivato", err);
      root.hidden = true; // tracker/CDN non raggiungibili: nessun contatore
    });
  };

  var begin = function () {
    if (relay || getConsent()) { activate(); return; }
    warn("modalità opt-in (nessun TURN configurato): clicca \"Vedi utenti online\" per attivare");
    // Opt-in: mostra solo il pulsante, nessuna connessione esterna finora.
    optin.hidden = false;
    root.hidden = false;
    notify();
    optin.addEventListener("click", function () {
      setConsent();
      optin.hidden = true;
      activate();
    });
  };

  if (document.readyState === "complete") begin();
  else window.addEventListener("load", begin);
})();
