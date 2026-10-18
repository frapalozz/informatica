/* "Prendi una Moneta" – mini clicker con popup di donazione al decimo click */
(function () {
  "use strict";

  var container = document.getElementById("btn-container");
  var button = document.getElementById("btn");
  var template = document.getElementById("coin-template");
  var counter = document.getElementById("coin-counter");
  var counterText = document.getElementById("coin-count");
  var popup = document.getElementById("donation-popup");
  var popupClose = document.getElementById("donation-close");
  if (!container || !button || !template) return;

  var labels = {
    9: "10 monetine 😑", 49: "50 monetine 😐", 99: "100 monete 👀", 199: "200 monete 🤨",
    499: "500 monete 🤑", 999: "1000 monete 😤", 1999: "2000 monete 🏦",
    4999: "5000 monete 🤖", 9999: "10000 monete 🕴️"
  };

  var clicks = 0;
  var popupOpen = true;

  // Il pulsante entra dopo 3 secondi. In fondo alla pagina scivola fuori dallo schermo
  // verso il basso (così non copre il footer) e ricompare appena si risale.
  var GAP = 16;          // distanza dal bordo inferiore quando è visibile (px)
  var BOTTOM_ZONE = 40;  // quanto vicino al fondo conta come "in fondo" (px)
  var entered = false, frame = 0;

  var atBottom = function () {
    var doc = document.documentElement, body = document.body;
    var total = Math.max(doc.scrollHeight, body ? body.scrollHeight : 0);
    var y = window.pageYOffset || doc.scrollTop || 0;
    var scrollable = total > window.innerHeight + 2; // pagine corte: il pulsante resta
    return scrollable && y + window.innerHeight >= total - BOTTOM_ZONE;
  };

  var updatePosition = function () {
    frame = 0;
    if (!entered) return;
    var hide = atBottom();
    container.style.bottom = hide ? "-" + (container.offsetHeight + GAP + 8) + "px" : GAP + "px";
    container.style.pointerEvents = hide ? "none" : "";
  };

  var schedule = function () { if (!frame) frame = requestAnimationFrame(updatePosition); };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  setTimeout(function () { entered = true; updatePosition(); }, 3000);

  button.addEventListener("click", function () {
    var text = labels[clicks] || "+1 monetina";
    clicks++;

    counterText.textContent = "x" + clicks;
    counter.classList.remove("hidden");
    counter.classList.add("flex");
    schedule(); // il pulsante diventa più alto con il contatore monete

    var node = template.content.firstElementChild.cloneNode(true);
    var coin = node.querySelector("[data-coin]");
    node.querySelector("[data-coin-text]").textContent = text;
    container.appendChild(node);

    setTimeout(function () { coin.style.bottom = "25px"; coin.style.opacity = "0"; }, 50);
    setTimeout(function () { node.remove(); }, 1500);

    if (clicks === 10 && popupOpen) {
      popup.classList.remove("hidden");
      popup.classList.add("flex");
    }
  });

  popupClose.addEventListener("click", function () {
    popupOpen = false;
    popup.classList.add("hidden");
    popup.classList.remove("flex");
  });
})();
