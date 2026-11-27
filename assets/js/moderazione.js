/*
 * Moderazione della chat: le parole vietate diventano versi di animali.
 * Prova a riconoscerle anche quando sono camuffate:
 *   maiuscole e accenti      → CaZZò          (minuscole, senza accenti)
 *   numeri e simboli         → c4zz0, $tronzo (leet: 0→o, 4→a, $→s, …)
 *   lettere ripetute         → cazzzzzo       (le doppie contano come una)
 *   separatori               → c.a.z.z.o, c-a-z-z-o
 *   lettere staccate         → c a z z o
 *   asterischi               → c*zzo          (l'asterisco vale qualsiasi lettera)
 *   lettere di altri alfabeti→ саzzo con la "а" cirillica
 *   parole attaccate o spezzate su più parole → porco dio, dio cane, porcodio
 * Gira su chi RICEVE il messaggio, non su chi lo manda: non si aggira dalla console.
 *
 * window.Moderazione.pulisci(testo) → testo con le parole vietate sostituite
 * window.Moderazione.vietata(parola) → true se la parola è vietata
 */
(function (root) {
  "use strict";

  var VERSI = ["miao", "bau", "squit", "muu", "cip cip", "oink", "beee", "coccodè", "qua qua", "hiii", "grrr", "prrr", "cra cra", "bzzz"];

  // Parole vietate, scritte già "pulite" (minuscole, senza doppie: cazzo → cazo).
  // pre: la parola INIZIA così · any: la parola CONTIENE questo pezzo · re: espressione sulla parola (con le doppie)
  var LISTA = [
    { pre: "caz" }, { any: "incaz" }, { any: "minchi" }, { any: "stronz" }, { any: "fancul" }, { any: "vafancul" },
    { any: "putan" }, { re: /^troi[ae]/ }, { any: "merd" }, { any: "coglion" }, { any: "bastard" },
    { any: "zocol" }, { pre: "pompin" }, { re: /^(figa|fica|fighe|fiche)$/ }, { pre: "suca" }, { pre: "sborr" },
    { pre: "froci" }, { any: "ricchion" }, { re: /^negr(o|a|i|e|etto|etti)$/ }, { any: "mongoloid" },
    { any: "fuck" }, { pre: "shit" }, { any: "bitch" }, { any: "cunt" }, { re: /^nigg/ }, { re: /^faggot/ }
  ];
  // Bestemmie e insulti che stanno su due o tre parole (si controllano anche attaccate).
  var COMPOSTE = ["vafancul", "fancul", "porcodi", "diocan", "dioporc", "diobo", "diomerd", "porcamadon", "madonaputan", "diobestia", "mortacci"];

  var LEET = { "0": "o", "1": "i", "2": "z", "3": "e", "4": "a", "5": "s", "6": "g", "7": "t", "8": "b", "9": "g", "@": "a", "$": "s", "!": "i", "|": "i", "€": "e", "£": "l", "+": "t", "¡": "i", "×": "x", "ß": "ss" };
  // Lettere di altri alfabeti che sembrano latine.
  var SOSIA = { "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x", "к": "k", "м": "m", "т": "t", "і": "i", "ј": "j", "ѕ": "s", "ԁ": "d", "ο": "o", "α": "a", "ε": "e", "ι": "i", "κ": "k", "ν": "v", "τ": "t", "υ": "u", "ρ": "p" };

  // Parole innocue che somigliano a quelle vietate (scritte per intero, minuscole).
  var ECCEZIONI = ["cazzuola", "cazzuole", "stronzio", "scunthorpe", "shitake", "shiitake", "cunto", "cunti"];

  function verso() { return VERSI[Math.floor(Math.random() * VERSI.length)]; }

  // Una parola → solo lettere minuscole (gli asterischi restano, valgono come jolly).
  function base(parola) {
    var s = String(parola).toLowerCase().replace(/[​-‍﻿­]/g, "");
    try { s = s.normalize("NFD").replace(/[̀-ͯ]/g, ""); } catch (e) { /* browser vecchi */ }
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      c = SOSIA[c] || LEET[c] || c;
      if (/[a-z*]/.test(c)) out += c;
    }
    return out;
  }
  function senzaDoppie(s) { return s.replace(/(.)\1+/g, "$1"); }

  function corrisponde(nuda, voce) {
    var corta = senzaDoppie(nuda);
    if (voce.pre) return corta.indexOf(voce.pre) === 0;
    if (voce.any) return corta.indexOf(voce.any) >= 0;
    if (voce.re) return voce.re.test(nuda) || voce.re.test(corta);
    return false;
  }

  function vietata(parola) {
    var nuda = base(parola);
    if (nuda.length < 3) return false;
    if (ECCEZIONI.indexOf(nuda) >= 0) return false;
    if (nuda.indexOf("*") >= 0) return conJolly(nuda);
    var corta = senzaDoppie(nuda);
    for (var i = 0; i < LISTA.length; i++) if (corrisponde(nuda, LISTA[i])) return true;
    for (var j = 0; j < COMPOSTE.length; j++) if (corta.indexOf(COMPOSTE[j]) >= 0) return true;
    return false;
  }

  // c*zzo, m*rda: l'asterisco può essere qualsiasi lettera (o nessuna).
  var PAROLE_INTERE = ["cazzo", "cazzi", "cazzata", "minchia", "stronzo", "stronza", "merda", "puttana", "troia", "coglione", "vaffanculo", "fanculo", "bastardo", "zoccola", "fuck", "shit", "bitch", "porcodio", "diocane", "frocio", "negro"];
  function conJolly(nuda) {
    if (nuda.replace(/\*/g, "").length < 2) return false;
    var re = new RegExp("^" + nuda.replace(/\*+/g, "[a-z]{0,3}") + "$");
    var corta = new RegExp("^" + senzaDoppie(nuda).replace(/\*+/g, "[a-z]{0,3}") + "$");
    return PAROLE_INTERE.some(function (p) { return re.test(p) || corta.test(senzaDoppie(p)); });
  }

  // Il testo intero: parola per parola, poi lettere staccate e parole composte.
  function pulisci(testo) {
    var pezzi = String(testo).split(/(\s+)/); // tiene gli spazi per ricomporre il testo uguale
    var idx = [];
    for (var i = 0; i < pezzi.length; i++) if (pezzi[i] && !/^\s+$/.test(pezzi[i])) idx.push(i);
    var via = {};

    // 1. parole singole
    idx.forEach(function (i) { if (vietata(pezzi[i])) via[i] = true; });

    // 2. lettere staccate: c a z z o, c. a. z. z. o.
    for (var a = 0; a < idx.length; a++) {
      if (base(pezzi[idx[a]]).length !== 1) continue;
      var b = a;
      while (b + 1 < idx.length && base(pezzi[idx[b + 1]]).length === 1) b++;
      if (b - a >= 2) {
        var unite = idx.slice(a, b + 1).map(function (i) { return base(pezzi[i]); }).join("");
        // cerca la parola vietata più lunga dentro la sequenza di lettere
        for (var s = a; s <= b; s++) for (var e = b; e >= s + 2; e--) {
          var pezzo = unite.slice(s - a, e - a + 1);
          if (vietata(pezzo)) { for (var k = s; k <= e; k++) via[idx[k]] = "unite"; s = e; break; }
        }
      }
      a = b;
    }

    // 3. due o tre parole attaccate: porco dio, dio cane, madonna puttana
    for (var n = 0; n < idx.length; n++) {
      for (var lung = 2; lung <= 3 && n + lung <= idx.length; lung++) {
        var gruppo = idx.slice(n, n + lung);
        var insieme = senzaDoppie(gruppo.map(function (i) { return base(pezzi[i]); }).join(""));
        if (COMPOSTE.some(function (c) { return insieme.indexOf(c) >= 0; })) {
          gruppo.forEach(function (i) { if (!via[i]) via[i] = true; });
        }
      }
    }

    // Sostituzione: lettere staccate → un solo verso; parole → un verso ciascuna.
    var appenaUnite = false;
    return pezzi.map(function (p, i) {
      if (!via[i]) { if (!/^\s+$/.test(p)) appenaUnite = false; return p; }
      if (via[i] === "unite") {
        if (appenaUnite) return "";
        appenaUnite = true;
        return verso();
      }
      appenaUnite = false;
      // tiene la punteggiatura finale (es. "merda!" → "muu!")
      var fine = (String(p).match(/[.,;:!?…]+$/) || [""])[0];
      return verso() + fine;
    }).join("").replace(/\s{2,}/g, " ");
  }

  var api = { pulisci: pulisci, vietata: vietata, verso: verso };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Moderazione = api;
})(typeof window !== "undefined" ? window : this);
