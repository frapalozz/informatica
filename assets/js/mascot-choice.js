/* Scegli una mascotte senza inizializzare due assistenti contemporaneamente. */
(function () {
  "use strict";
  var current = document.currentScript;
  if (!current) return;
  var KEY = "informatica-mascot";
  var choice = "cat";
  try { if (localStorage.getItem(KEY) === "dog") choice = "dog"; } catch (_) { try { if (sessionStorage.getItem(KEY) === "dog") choice = "dog"; } catch (_) {} }

  function load(src, attributes, onLoad) {
    var node = document.createElement("script");
    node.src = src;
    node.async = false;
    Object.keys(attributes || {}).forEach(function (key) { node.setAttribute(key, attributes[key]); });
    if (onLoad) node.addEventListener("load", onLoad, { once: true });
    document.body.appendChild(node);
  }

  var switcher = document.createElement("nav");
  switcher.className = "mascot-selector";
  switcher.setAttribute("aria-label", "Scegli la mascotte del sito");
  var label = document.createElement("span");
  label.className = "mascot-selector-label";
  label.textContent = "MASCOTTE";
  switcher.appendChild(label);
  [["cat", "Gatto", "🐱"], ["dog", "Cane", "🐶"]].forEach(function (option) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "mascot-selector-button";
    button.dataset.mascot = option[0];
    button.setAttribute("aria-pressed", String(choice === option[0]));
    button.setAttribute("aria-label", "Usa il " + option[1].toLowerCase() + " come mascotte");
    var icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = option[2];
    button.appendChild(icon);
    button.appendChild(document.createTextNode(" " + option[1]));
    button.addEventListener("click", function () {
      if (choice === option[0]) return;
      try { localStorage.setItem(KEY, option[0]); } catch (_) {
        /* In modalità privata la scelta resta valida solo per questa pagina. */
        try { sessionStorage.setItem(KEY, option[0]); } catch (_) {}
      }
      window.location.reload();
    });
    switcher.appendChild(button);
  });
  document.body.appendChild(switcher);

  if (choice === "cat") {
    load(current.getAttribute("data-cat-script"), {
      "data-dati": current.getAttribute("data-dati") || "",
      "data-nome": current.getAttribute("data-nome") || "Bit",
      "data-chiacchiere": current.getAttribute("data-chiacchiere") || "true"
    });
  } else {
    // Buddy usa il motore originale di Bit per camminate, salti, pose,
    // titoli, sonno, puntatore e comportamento del fumetto.
    load(current.getAttribute("data-banter-script"), {}, function () {
      load(current.getAttribute("data-cat-script"), {
        "data-dati": current.getAttribute("data-dati") || "",
        "data-nome": "Buddy",
        "data-chiacchiere": "false",
        "data-mascot": "dog"
      }, function () {
        // Solo battute e crediti: nessun secondo loop di movimento.
        load(current.getAttribute("data-dog-script"));
      });
    });
  }
})();