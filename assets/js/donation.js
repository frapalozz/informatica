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

  // entrata del pulsante dopo 3 secondi
  setTimeout(function () { container.style.bottom = "16px"; }, 3000);

  button.addEventListener("click", function () {
    var text = labels[clicks] || "+1 monetina";
    clicks++;

    counterText.textContent = "x" + clicks;
    counter.classList.remove("hidden");
    counter.classList.add("flex");

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
