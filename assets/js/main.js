/* Informatica – comportamento client-side (nessuna dipendenza) */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var show = function (el, display) { el.classList.remove("hidden"); if (display) el.classList.add(display); };
  var hide = function (el, display) { el.classList.add("hidden"); if (display) el.classList.remove(display); };

  /* ── Advent of Code: 1–25 dicembre ───────────────────────── */
  var now = new Date();
  var advent = $("[data-advent]");
  if (advent && now.getMonth() === 11 && now.getDate() < 26) show(advent, "flex");

  /* ── Elenco materie: "Aggiornato X giorni fa" + pallino "nuovo" ── */
  $$("[data-card]").forEach(function (card) {
    var d = new Date(card.getAttribute("data-date") + "T00:00:00");
    if (isNaN(d.getTime())) return;
    var diff = Math.round((now.getTime() - (d.getTime() - 43200000)) / (1000 * 3600 * 24)) - 1;
    var label = diff <= 0 ? "oggi" : diff === 1 ? "1 giorno fa" : diff + " giorni fa";
    var ago = $("[data-ago]", card);
    if (ago) ago.textContent = label;
    if (diff <= 0) $$("[data-new]", card).forEach(function (el) { show(el); });
  });

  /* ── Ricerca materie ─────────────────────────────────────── */
  var grid = $("[data-cardgrid]");
  if (grid) {
    var current = grid.getAttribute("data-anno");
    var input = $("#search-class-input", grid);
    var empty = $("[data-empty]", grid);
    var cards = $$("[data-card]", grid);

    var update = function () {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var anno = card.getAttribute("data-anno");
        var ok = q === ""
          ? anno === current
          : (current === "extra" ? anno === "extra" : (anno === "1" || anno === "2" || anno === "3"))
            && card.getAttribute("data-title").indexOf(q) > -1;
        card.classList.toggle("hidden", !ok);
        if (ok) visible++;
      });
      if (visible === 0) show(empty, "flex"); else hide(empty, "flex");
    };
    input.addEventListener("input", update);
    update();
  }

  /* ── Pagina materia: pulsanti "altro" / "chiudi" ─────────── */
  var mcard = $("[data-materia-card]");
  if (mcard) {
    var front = $("[data-card-front]", mcard), back = $("[data-card-back]", mcard);
    var open = $("[data-card-open]", mcard), close = $("[data-card-close]", mcard);
    if (front && back && open && close) {
      open.addEventListener("click", function () { hide(front); show(back, "flex"); });
      close.addEventListener("click", function () { hide(back, "flex"); show(front); });
    }
  }

  /* ── Avviso cambio dominio (opzionale) ───────────────────── */
  var popup = $("#legacy-popup");
  if (popup) {
    var oldOrigin = popup.getAttribute("data-old"), newOrigin = popup.getAttribute("data-new");
    if (oldOrigin && window.location.origin === oldOrigin) {
      show(popup, "flex");
      window.location.replace(newOrigin + window.location.pathname);
    }
    var closeBtn = $("[data-popup-close]", popup);
    if (closeBtn) closeBtn.addEventListener("click", function () { hide(popup, "flex"); });
  }

  /* ── Form "Aggiungi risorsa" ─────────────────────────────── */
  var form = $("#risorsa-form");
  if (form) {
    var endpoint = form.getAttribute("data-endpoint");
    var repo = form.getAttribute("data-repo");
    var btn = $("#submit-button", form);
    var spinner = $("#spinner", form);
    var msg = $("#message", form);

    var setState = function (state) {
      spinner.classList.toggle("hidden", state !== "loading");
      spinner.classList.toggle("inline", state === "loading");
      btn.disabled = state === "loading" || state === "done";
      btn.classList.toggle("dark:bg-neutral-400", btn.disabled);
      btn.classList.toggle("bg-neutral-800", btn.disabled);
      btn.classList.toggle("dark:bg-white", !btn.disabled);
      btn.classList.toggle("bg-black", !btn.disabled);
      msg.className = state === "done" ? "text-green-500" : state === "error" ? "text-red-500" : "";
      msg.textContent = state === "done" ? (endpoint ? "Inviato!" : "Completa l’invio su GitHub")
        : state === "error" ? "Riprova più tardi!" : "";
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name: $("#name").value,
        corso: $("#corso").value,
        anno: $("#anno").value,
        links: $("#links").value,
        altro: $("#altro").value
      };

      if (endpoint) {
        setState("loading");
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        })
          .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); setState("done"); })
          .catch(function (err) { console.error(err); setState("error"); });
      } else if (repo) {
        var body = "**Corso:** " + data.corso + "\n\n**Anno:** " + data.anno + "\n\n**Links:**\n" + data.links +
          (data.altro ? "\n\n**Altre informazioni:**\n" + data.altro : "");
        var url = "https://github.com/" + repo + "/issues/new?title=" +
          encodeURIComponent("Nuova risorsa: " + data.name) + "&body=" + encodeURIComponent(body);
        window.open(url, "_blank", "noopener");
        setState("done");
      } else {
        setState("error");
      }
    });
  }
})();
