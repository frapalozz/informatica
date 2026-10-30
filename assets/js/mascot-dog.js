/* Buddy visual adapter: movement and search are owned ONLY by assistente.js.
 * This module keeps the original Buddy one-liners and attribution on hover. */
(function () {
  "use strict";
  var actor = document.querySelector(".bit-cat.is-buddy");
  var bubble = document.getElementById("bit-bubble");
  if (!actor || !bubble) return;

  var source = window.BuddyBanter;
  var sayings = source && source.phrases ? source.phrases : ["Bau! Torna a studiare."];
  var queue = [], last = "";
  try { last = sessionStorage.getItem("retro-buddy-last-line") || ""; } catch (_) {}

  var speech = document.createElement("div");
  speech.className = "buddy-hover-speech";
  speech.setAttribute("role", "status");
  speech.hidden = true;
  var line = document.createElement("span");
  var by = document.createElement("small");
  by.textContent = "Created by Berserk-hub150";
  speech.appendChild(line);
  speech.appendChild(by);
  document.body.appendChild(speech);

  // The dog inherits Bit's full search / navigation panel; only its credit is new.
  var attribution = document.createElement("p");
  attribution.className = "buddy-panel-credit";
  attribution.appendChild(document.createTextNode("Sprite e battute originali · Created by "));
  var author = document.createElement("a");
  author.href = "https://github.com/Berserk-hub150";
  author.target = "_blank";
  author.rel = "noopener noreferrer";
  author.textContent = "Berserk-hub150";
  attribution.appendChild(author);
  bubble.appendChild(attribution);

  var frame = 0;
  function hide() {
    speech.hidden = true;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }
  function position() {
    frame = 0;
    if (speech.hidden || !bubble.hidden || document.hidden) { hide(); return; }
    var rect = actor.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= innerHeight) { hide(); return; }
    var width = speech.offsetWidth, height = speech.offsetHeight;
    var x = Math.max(8, Math.min(innerWidth - width - 8, rect.left + rect.width / 2 - width / 2));
    var above = rect.top - height - 12;
    var y = above >= 8 ? above : rect.bottom + 12;
    y = Math.max(8, Math.min(innerHeight - height - 8, y));
    speech.style.left = x + "px";
    speech.style.top = y + "px";
    frame = requestAnimationFrame(position);
  }
  function show() {
    if (!bubble.hidden || document.hidden) return;
    if (!queue.length) {
      queue = source && source.shuffledLines ? source.shuffledLines(Math.random, last) : sayings.slice();
    }
    last = queue.shift() || sayings[0];
    try { sessionStorage.setItem("retro-buddy-last-line", last); } catch (_) {}
    line.textContent = last;
    speech.hidden = false;
    if (!frame) position();
  }

  // Same cat motion controller naturally sits/looks at the pointer;
  // these listeners only show the dog's own jokes.
  actor.addEventListener("pointerenter", function (event) {
    if (event.pointerType !== "touch") show();
  });
  actor.addEventListener("pointerleave", hide);
  actor.addEventListener("pointercancel", hide);
  actor.addEventListener("click", hide);
  actor.addEventListener("focus", show);
  actor.addEventListener("blur", hide);
  document.addEventListener("visibilitychange", hide);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") hide();
  });
  window.addEventListener("resize", hide);
})();