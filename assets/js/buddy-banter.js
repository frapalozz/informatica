(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.BuddyBanter = api; api.init(document); }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const phrases = [
    "Ciao, sono Enrico Papi. Bau.",
    "Già qui a studiare?",
    "Non studiare, vai al Dada!",
    "Al Dada a che ora?",
    "Un esame passa. Un giovedì al Dada no.",
    "«Stasera non esco.» Sì, certo.",
    "Bro, il Dada non si prenota su Moodle.",
    "Solo una birra e torno. Le ultime parole famose.",
    "Giovedì sera e stai su Notion? Tutto bene?",
    "Al Dada ci sei. A lezione vediamo.",
    "Se chiedono, siamo in biblioteca.",
    "Colle Paradiso, fiato inferno.",
    "A Camerino pure per andare a letto c’è una salita.",
    "«È qui vicino.» A Camerino è una minaccia.",
    "Questa salita vale 6 CFU.",
    "Ho fatto Colle Paradiso a piedi. Per oggi basta.",
    "Fra, la discesa all’andata era un segnale.",
    "Prima la mensa, poi si vede.",
    "Il gruppo: «ci becchiamo giù». Giù DOVE?",
    "A Camerino ti distrai e sei già in salita.",
    "18 e mi alzo in piedi.",
    "18? Dove devo firmare?",
    "«È facile, l’ho passato.» Grazie al cazzo.",
    "«Basta seguire.» Disse quello con gli appunti del 2019.",
    "Ho capito tutto. Poi è iniziato l’esercizio.",
    "È fattibile in due giorni. Mi manca solo iniziare.",
    "Da lunedì studio. Non ho detto quale.",
    "Domani spacco. Oggi mi riposo per sicurezza.",
    "Un attimo su TikTok e si è fatta sessione.",
    "La pausa doveva durare cinque minuti.",
    "«A che punto sei?» Non facciamo domande brutte.",
    "«Hai iniziato?» Fra, ho creato la cartella.",
    "Ho aperto gli appunti. Ora devono aprirsi loro con me.",
    "Leggo la stessa riga da venti minuti. Spettacolo.",
    "Bello questo capitolo. Lo salto.",
    "Il PDF è aperto. La testa no.",
    "Studio matto e disperatissimo. Soprattutto disperatissimo.",
    "Non ho ansia. È il caffè. Il quinto.",
    "«Stasera recupero tutto.» Tutte le sere.",
    "Ho un piano. Fa cagare, ma ce l’ho.",
    "Il gruppo studia. Io mando sticker.",
    "Il vero esame è capire quando c’è l’esame.",
    "Mi sentite? Mi vedete? Io non capisco niente.",
    "Webex aperto, microfono spento, cervello pure.",
    "Il codice Classroom? È un escape room.",
    "Ho letto «consegna» e ho chiuso tutto.",
    "«Funziona sul mio PC.» Allora consegna il PC.",
    "Un commit veloce. Sono le tre di notte.",
    "Game of Life? Qua siamo al Game of Sessione.",
    "Machine Learning? Prima impariamo a svegliarci.",
    "AI, fammi passare l’esame. Grazie.",
    "Il modello impara. Io ancora niente.",
    "Sei qui per gli appunti o per guardare me?",
    "Io faccio il giro. Tu sempre alla prima slide?",
    "Bro, ho quattro zampe e seguo più lezioni di te.",
    "Va bene tutto, ma il Dada quando?"
];
  function shuffledLines(random, last) {
    const result = phrases.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    if (result[0] === last) [result[0], result[1]] = [result[1], result[0]];
    return result;
  }
  function bubblePosition(anchor, bubble, viewport) {
    const x = Math.max(10, Math.min(anchor.x + anchor.width / 2 - bubble.width / 2, viewport.width - bubble.width - 10));
    const above = anchor.y - bubble.height - 9;
    const y = above >= 8 ? above : Math.min(viewport.height - bubble.height - 10, anchor.y + anchor.height + 9);
    return { x, y: Math.max(8, y), tail: Math.max(16, Math.min(anchor.x + anchor.width / 2 - x, bubble.width - 16)), below: above < 8 };
  }
  function init(doc) {
    const root = doc.getElementById('duck-guide'), walker = doc.getElementById('duck-walker');
    const launcher = doc.getElementById('duck-launcher');
    const bubble = doc.getElementById('buddy-speech'), text = doc.getElementById('buddy-speech-text');
    if (!root || !walker || !bubble) return;
    const panel = doc.getElementById('duck-panel'), menu = doc.getElementById('duck-position-menu');
    const toggle = doc.getElementById('buddy-banter-toggle');
    let enabled = true, hovered = false, queue = [], nextTimer = 0, frame = 0, last = '';
    try { enabled = localStorage.getItem('retro-buddy-banter') !== 'off'; last = sessionStorage.getItem('retro-buddy-last-line') || ''; } catch (_) {}
    function sync() { toggle.setAttribute('aria-pressed', String(enabled)); toggle.textContent = enabled ? 'Battute: attive' : 'Battute: in pausa'; }
    function hide() { cancelAnimationFrame(frame); bubble.hidden = true; frame = 0; }
    function clear() { clearTimeout(nextTimer); nextTimer = 0; hide(); }
    function allowed() { return hovered && enabled && !doc.hidden && panel.hidden && menu.hidden && !walker.hidden; }
    function place() {
      if (bubble.hidden) return;
      const r = launcher.getBoundingClientRect(), b = bubble.getBoundingClientRect();
      const p = bubblePosition({ x: r.x, y: r.y, width: r.width, height: r.height }, { width: b.width, height: b.height }, { width: innerWidth, height: innerHeight });
      bubble.style.transform = 'translate3d(' + p.x.toFixed(2) + 'px,' + p.y.toFixed(2) + 'px,0)';
      bubble.style.setProperty('--buddy-tail-x', p.tail + 'px');
      bubble.dataset.below = String(p.below);
      frame = requestAnimationFrame(place);
    }
    function show(line) {
      if (!allowed()) return;
      hide(); text.textContent = line; last = line;
      try { sessionStorage.setItem('retro-buddy-last-line', line); } catch (_) {}
      bubble.hidden = false; place();
    }
    function showNext() {
      if (!allowed()) return;
      if (!queue.length) queue = shuffledLines(Math.random, last);
      show(queue.shift());
      nextTimer = setTimeout(() => {
        hide();
        if (allowed()) nextTimer = setTimeout(showNext, 700);
      }, 5200);
    }
    toggle.addEventListener('click', () => {
      enabled = !enabled; sync(); clear();
      try { localStorage.setItem('retro-buddy-banter', enabled ? 'on' : 'off'); } catch (_) {}
    });
    launcher.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch' || hovered) return;
      hovered = true; clear(); showNext();
    });
    launcher.addEventListener('pointerleave', () => { hovered = false; clear(); });
    launcher.addEventListener('pointercancel', () => { hovered = false; clear(); });
    root.addEventListener('duck-panel-toggle', clear);
    root.addEventListener('buddy-menu-open', clear);
    root.addEventListener('duck-position-change', () => { hovered = false; clear(); });
    doc.addEventListener('visibilitychange', () => { hovered = false; clear(); });
    sync();
  }
  return { phrases, shuffledLines, bubblePosition, init };
}));
