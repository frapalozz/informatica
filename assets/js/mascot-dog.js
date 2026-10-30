/* Buddy from ComputerScience: same six-by-six pixel sprite and original banter. */
(function () {
  "use strict";
  var script = document.currentScript;
  var dataUrl = script && script.getAttribute("data-dati");
  var KEY = "informatica-dog-position";
  var dock = "roam";
  try { dock = localStorage.getItem(KEY) || "roam"; } catch (_) {}
  if (["roam", "left", "right"].indexOf(dock) < 0) dock = "roam";
  var finePointer = !!(window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches);
  var reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var mobile = !finePointer || innerWidth < 800;
  var WIDTH = 90, HEIGHT = 57, SPEED = 72;

  var root = document.createElement("div");
  root.className = "mascot-dog";
  root.innerHTML =
    '<button type="button" class="mascot-dog-actor" aria-label="Apri Buddy, il cane del sito" aria-expanded="false" aria-controls="mascot-dog-panel">' +
      '<span class="mascot-dog-sprite" aria-hidden="true"></span></button>' +
    '<div class="mascot-dog-speech" role="status" hidden></div>' +
    '<section class="mascot-dog-panel" id="mascot-dog-panel" role="dialog" aria-label="Buddy, il cane guida" hidden>' +
      '<div class="mascot-dog-heading"><strong>Buddy_</strong><button type="button" class="mascot-dog-close" aria-label="Chiudi Buddy">×</button></div>' +
      '<p>Bau! Cerchi una materia? Ti aiuto a trovarla, senza AI.</p>' +
      '<label for="mascot-dog-search">Cerca una materia</label>' +
      '<input id="mascot-dog-search" type="search" placeholder="Es. Machine Learning, Algoritmi..." autocomplete="off">' +
      '<ul class="mascot-dog-results" aria-live="polite"></ul>' +
      '<fieldset class="mascot-dog-positions"><legend>Dove mi metto?</legend>' +
        '<button type="button" data-dog-position="roam">Sui riquadri</button>' +
        '<button type="button" data-dog-position="left">A sinistra</button>' +
        '<button type="button" data-dog-position="right">A destra</button>' +
      '</fieldset>' +
      '<p class="mascot-dog-credit">Sprite e battute originali · Created by <a href="https://github.com/Berserk-hub150" target="_blank" rel="noopener noreferrer">Berserk-hub150</a></p>' +
    '</section>';
  document.body.appendChild(root);

  var actor = root.querySelector(".mascot-dog-actor");
  var sprite = root.querySelector(".mascot-dog-sprite");
  var speech = root.querySelector(".mascot-dog-speech");
  var panel = root.querySelector(".mascot-dog-panel");
  var close = root.querySelector(".mascot-dog-close");
  var search = root.querySelector("#mascot-dog-search");
  var results = root.querySelector(".mascot-dog-results");
  var positionButtons = Array.prototype.slice.call(root.querySelectorAll("[data-dog-position]"));
  var pos = { x: 16, y: Math.max(16, innerHeight - HEIGHT - 84) };
  var route = [], routeIndex = 0, targetIndex = 0, pausedUntil = 0, lastTick = 0;
  var hovered = false, opened = false, running = 0, lastPhrase = "", phraseTimer = 0;
  var queue = [], courses = null;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function setPose(row, column) {
    sprite.style.backgroundPosition = (column * 20) + "% " + (row * 20) + "%";
  }
  function showAt(x, y, dx, dy) {
    pos.x = clamp(x, 8, Math.max(8, innerWidth - WIDTH - 8));
    pos.y = clamp(y, 8, Math.max(8, innerHeight - HEIGHT - 8));
    actor.style.transform = "translate3d(" + pos.x.toFixed(1) + "px," + pos.y.toFixed(1) + "px,0)";
    sprite.style.transform = dx < 0 ? "scaleX(1)" : "scaleX(-1)";
    actor.dataset.direction = dy > 1 ? "down" : dy < -1 ? "up" : "side";
    placeSpeech();
  }
  function placeSpeech() {
    if (speech.hidden) return;
    var box = speech.getBoundingClientRect();
    var above = pos.y - box.height - 10;
    var y = above < 8 ? pos.y + HEIGHT + 9 : above;
    speech.style.left = clamp(pos.x + WIDTH / 2 - box.width / 2, 8, innerWidth - box.width - 8) + "px";
    speech.style.top = clamp(y, 8, innerHeight - box.height - 8) + "px";
  }
  function syncPositions() {
    positionButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.dogPosition === dock));
    });
  }
  function corner(side) {
    return { x: side === "left" ? 12 : innerWidth - WIDTH - 12, y: innerHeight - HEIGHT - (innerWidth < 480 ? 73 : 14) };
  }
  function findSurfaces() {
    var candidates = Array.prototype.slice.call(document.querySelectorAll(
      "[data-card], [data-materia-card], .materia-card, main article, main section"
    ));
    var visible = candidates.map(function (el) {
      var r = el.getBoundingClientRect();
      return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height };
    }).filter(function (r) {
      return r.width >= 125 && r.height >= 75 && r.top > HEIGHT + 24 &&
        r.top < innerHeight - HEIGHT - 28 && r.right > WIDTH && r.left < innerWidth - WIDTH;
    });
    return visible.slice(0, 7);
  }
  function routeFor(r) {
    var left = clamp(r.left + 9, 8, innerWidth - WIDTH - 8);
    var right = clamp(r.right - WIDTH - 9, 8, innerWidth - WIDTH - 8);
    var top = clamp(r.top - HEIGHT + 4, 8, innerHeight - HEIGHT - 8);
    var bottom = clamp(r.bottom + 4, 8, innerHeight - HEIGHT - 8);
    if (right <= left + 18) right = left + 18;
    var points = [
      { x:left, y:top }, { x:right, y:top },
      { x:right, y:bottom }, { x:left, y:bottom }, { x:left, y:top }
    ];
    return points.filter(function (p, i) {
      return !i || Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) > 6;
    });
  }
  function rebuild() {
    var surfaces = findSurfaces();
    if (surfaces.length) {
      targetIndex = targetIndex % surfaces.length;
      route = routeFor(surfaces[targetIndex]);
    } else { route = []; }
    routeIndex = 0;
    lastTick = 0;
    if (route.length) showAt(route[0].x, route[0].y, 1, 0);
    else { var p = corner("left"); showAt(p.x, p.y, 1, 0); }
  }
  function nextRoute() { targetIndex++; rebuild(); }
  function stopPhrase() {
    clearTimeout(phraseTimer);
    phraseTimer = 0;
    speech.hidden = true;
  }
  function nextPhrase() {
    if (!hovered || opened || document.hidden) return;
    if (!queue.length) {
      var lines = window.BuddyBanter && window.BuddyBanter.shuffledLines;
      queue = lines ? lines(Math.random, lastPhrase) : ["Bau! L'esame lo passa chi studia."];
    }
    lastPhrase = queue.shift();
    speech.textContent = lastPhrase;
    speech.hidden = false;
    placeSpeech();
    phraseTimer = setTimeout(function () {
      speech.hidden = true;
      if (hovered && !opened) phraseTimer = setTimeout(nextPhrase, 550);
    }, 4800);
  }
  function parked() {
    var side = dock === "roam" ? "left" : dock;
    var p = corner(side);
    showAt(p.x, p.y, side === "left" ? 1 : -1, 0);
    setPose(4, 0);
  }
  function animate(now) {
    running = requestAnimationFrame(animate);
    if (hovered || opened || reduceMotion || mobile || document.hidden || dock !== "roam" || !route.length) {
      if (!hovered && !opened && (reduceMotion || mobile || dock !== "roam" || !route.length)) parked();
      else if (hovered || opened) setPose(4, 0);
      lastTick = now;
      return;
    }
    var dt = lastTick ? Math.min((now - lastTick) / 1000, 0.06) : 0;
    lastTick = now;
    if (now < pausedUntil) { setPose(5, 0); return; }
    var next = route[(routeIndex + 1) % route.length];
    var dx = next.x - pos.x, dy = next.y - pos.y;
    var length = Math.hypot(dx, dy);
    if (length < 2) {
      routeIndex++;
      if (routeIndex >= route.length - 1) {
        pausedUntil = now + 500;
        nextRoute();
      } else pausedUntil = now + 170;
      setPose(4, 0);
      return;
    }
    var step = Math.min(length, SPEED * dt);
    showAt(pos.x + dx / length * step, pos.y + dy / length * step, dx, dy);
    setPose(1, Math.floor(now / 105) % 6);
  }
  function openPanel() {
    opened = true; stopPhrase();
    panel.hidden = false;
    actor.setAttribute("aria-expanded", "true");
    setPose(4, 0);
    syncPositions();
    renderResults();
    if (!courses && dataUrl) fetch(dataUrl).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (db) {
      courses = { base: db.base || "", list: Array.isArray(db.materie) ? db.materie : [] };
      if (opened) renderResults();
    }).catch(function () {
      courses = { base:"", list:[] };
      if (opened) renderResults();
    });
    search.focus({ preventScroll: true });
  }
  function closePanel() {
    opened = false; panel.hidden = true;
    actor.setAttribute("aria-expanded", "false");
    actor.focus({ preventScroll: true });
    if (!hovered) { if (dock === "roam" && !mobile && !reduceMotion) rebuild(); else parked(); }
  }
  function renderResults() {
    results.replaceChildren();
    if (!courses) {
      var wait = document.createElement("li");
      wait.textContent = "Carico le materie…";
      results.appendChild(wait);
      return;
    }
    var q = search.value.toLocaleLowerCase("it").trim();
    var matches = courses.list.filter(function (course) {
      return typeof course.t === "string" && typeof course.u === "string" &&
        (!q || course.t.toLocaleLowerCase("it").indexOf(q) !== -1);
    }).slice(0, 7);
    if (!matches.length) {
      var empty = document.createElement("li");
      empty.textContent = "Nessuna materia trovata.";
      results.appendChild(empty);
    }
    matches.forEach(function (course) {
      var li = document.createElement("li"), a = document.createElement("a");
      var url = (courses.base || "") + course.u;
      // Do not render arbitrary URLs from JSON as navigation targets.
      if (!/^\/(?!\/)/.test(url)) return;
      a.href = url;
      a.textContent = course.t + " →";
      li.appendChild(a);
      results.appendChild(li);
    });
  }

  actor.addEventListener("pointerenter", function (e) {
    if (e.pointerType === "touch") return;
    hovered = true;
    setPose(4, 0);
    stopPhrase();
    nextPhrase();
  });
  actor.addEventListener("pointerleave", function () {
    hovered = false; stopPhrase();
    if (!opened && dock === "roam" && !mobile && !reduceMotion) rebuild();
  });
  actor.addEventListener("focus", function () { hovered = true; setPose(4, 0); });
  actor.addEventListener("blur", function () { hovered = false; stopPhrase(); });
  actor.addEventListener("click", function () { opened ? closePanel() : openPanel(); });
  close.addEventListener("click", closePanel);
  search.addEventListener("input", renderResults);
  positionButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      dock = b.dataset.dogPosition;
      try { localStorage.setItem(KEY, dock); } catch (_) {}
      syncPositions();
      if (dock === "roam" && !mobile && !reduceMotion) rebuild(); else parked();
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && opened) closePanel();
  });
  document.addEventListener("pointerdown", function (e) {
    if (opened && !panel.contains(e.target) && !actor.contains(e.target)) closePanel();
  });
  window.addEventListener("resize", function () {
    mobile = !finePointer || innerWidth < 800;
    if (dock === "roam" && !mobile && !reduceMotion) rebuild(); else parked();
  });
  window.addEventListener("scroll", function () {
    if (dock === "roam" && !mobile && !reduceMotion && !opened && !hovered) rebuild();
  }, { passive:true });
  document.addEventListener("visibilitychange", stopPhrase);
  syncPositions();
  if (dock === "roam" && !mobile && !reduceMotion) rebuild(); else parked();
  running = requestAnimationFrame(animate);
})();