/* La battaglia tra cani e gatti sulla pagina 404.
   Si vede se si arriva da uno dei siti in battaglia.siti (_config.yml: lo script in
   _includes/head.html porta qui e salva la pagina richiesta) oppure aprendo /battaglia/.
   Gli sprite sono quelli di Bit e Buddy: il gatto lo disegna assistente.js (window.BitSprite),
   il cane è il foglio di assistente.css. Senza assistente i gatti diventano emoji. */
(function () {
  "use strict";

  var script = document.currentScript;
  var BASE = (script && script.getAttribute("data-base")) || "";
  var section = document.getElementById("battaglia");
  if (!section) return;

  function get(key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } }
  function drop(key) { try { sessionStorage.removeItem(key); } catch (e) { /* niente */ } }

  var from = get("battaglia-da");
  var direct = /\/battaglia\/?$/.test(window.location.pathname);
  if (!from && !direct) return; // un 404 qualunque: resta quello normale

  var sito = get("battaglia-sito");
  drop("battaglia-da");
  drop("battaglia-sito");

  // Il pulsante "Entra" porta alla pagina che si voleva aprire (solo indirizzi di questo sito).
  var enter = section.querySelector(".battaglia-entra");
  if (from && from.charAt(0) === "/" && from.charAt(1) !== "/" && !/^\/battaglia\/?$/.test(from)) enter.href = from;
  else enter.href = BASE + "/";

  if (sito) section.querySelector(".battaglia-sito").textContent = sito;
  var normal = document.getElementById("pagina-404");
  if (normal) normal.style.display = "none"; // ha "flex" di Tailwind: hidden non basta
  section.hidden = false;
  document.title = "Battaglia! | " + document.title.split(" | ").pop();
  setTimeout(function () { enter.hidden = false; }, 5000);

  var arena = section.querySelector(".battaglia-arena");
  var points = { gatto: 0, cane: 0 };
  var pointsEl = {
    gatto: section.querySelector('[data-punti="gatto"]'),
    cane: section.querySelector('[data-punti="cane"]')
  };
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var PER_TEAM = window.innerWidth < 640 ? 5 : 9;
  var W = 55, H = 45; // stessa misura di Bit su desktop
  var SOUNDS = {
    gatto: ["MIAO!", "FSSS!", "MRRAW!", "ZAMPATA!", "PFFT!"],
    cane: ["BAU!", "GRRR!", "WOOF!", "ARF!", "MORSO!"],
    any: ["SBAM!", "POW!", "PAF!", "CRASH!", "ZOT!"]
  };

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  var catSvg = null;
  function catArt() {
    if (!catSvg && window.BitSprite) catSvg = window.BitSprite.svg();
    return catSvg || '<span class="battaglia-emoji">🐱</span>';
  }

  var fighters = [];
  function makeFighter(team, i) {
    var el = document.createElement("div");
    el.className = "bit-fighter battaglia-" + team;
    el.dataset.frame = "walk1";
    el.style.width = W + "px";
    el.style.height = H + "px";
    if (team === "cane") {
      el.style.setProperty("--bit-dog-w", (H * 90 / 57).toFixed(1) + "px");
      el.innerHTML = '<span class="bit-dog"></span>';
    } else {
      el.innerHTML = catArt();
    }
    arena.appendChild(el);
    var box = arena.getBoundingClientRect();
    // i gatti partono da sinistra, i cani da destra
    var f = {
      el: el, team: team,
      x: team === "gatto" ? rand(0, box.width * 0.3) : rand(box.width * 0.7 - W, box.width - W),
      y: rand(0, Math.max(0, box.height - H)),
      speed: rand(60, 110),
      stunned: 0, hop: 0, hopT: 0, target: null, step: rand(0, 300)
    };
    f.dir = team === "gatto" ? 1 : -1;
    fighters.push(f);
    return f;
  }

  // Il gatto arriva quando assistente.js ha disegnato lo sprite (può essere dopo questo script).
  function start() {
    for (var i = 0; i < PER_TEAM; i++) { makeFighter("gatto", i); makeFighter("cane", i); }
    if (reduced) { staticScene(); return; }
    requestAnimationFrame(loop);
  }
  if (window.BitSprite) start();
  else {
    var started = false;
    var go = function () { if (!started) { started = true; start(); } };
    document.addEventListener("bit-sprite", go, { once: true });
    setTimeout(go, 1500); // assistente spento o lento: si combatte con le emoji
  }

  function draw(f) {
    var lift = f.hop > 0 ? Math.sin(Math.PI * (1 - f.hop)) * 28 : 0;
    f.el.style.transform = "translate3d(" + f.x.toFixed(1) + "px," + (f.y - lift).toFixed(1) + "px,0)";
    f.el.style.zIndex = String(Math.round(f.y));
    f.el.dataset.dir = String(f.dir);
  }

  function cloud(x, y, team) {
    var c = document.createElement("span");
    c.className = "battaglia-nuvola";
    c.textContent = Math.random() < 0.5 ? pick(SOUNDS.any) : pick(SOUNDS[team]);
    c.style.left = x + "px";
    c.style.top = y + "px";
    arena.appendChild(c);
    if (!reduced) setTimeout(function () { c.remove(); }, 900);
  }

  function nearestEnemy(f) {
    var best = null, bestD = Infinity;
    fighters.forEach(function (o) {
      if (o.team === f.team || o.stunned > 0) return;
      var d = Math.hypot(o.x - f.x, o.y - f.y);
      if (d < bestD) { bestD = d; best = o; }
    });
    return best;
  }

  function clash(a, b) {
    var winner = Math.random() < 0.5 ? a : b;
    var loser = winner === a ? b : a;
    cloud((a.x + b.x) / 2 + W / 2, Math.min(a.y, b.y), winner.team);
    points[winner.team]++;
    pointsEl[winner.team].textContent = points[winner.team];
    // chi perde vola via con un saltello e resta stordito un attimo
    loser.stunned = rand(1.2, 2.2);
    loser.hop = 1;
    loser.kx = (loser.x < winner.x ? -1 : 1) * rand(160, 260);
    loser.ky = rand(-120, 120);
    loser.el.dataset.frame = "sleep";
    winner.el.dataset.frame = "play";
    winner.stunned = 0.35; // anche il vincitore si ferma a esultare
    winner.target = null;
  }

  var last = 0;
  function loop(now) {
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    if (document.hidden) { requestAnimationFrame(loop); return; }
    var box = arena.getBoundingClientRect();
    var maxX = Math.max(0, box.width - W), maxY = Math.max(0, box.height - H);

    fighters.forEach(function (f) {
      if (f.hop > 0) {
        f.hop = Math.max(0, f.hop - dt * 1.8);
        f.x += f.kx * dt;
        f.y += f.ky * dt;
      }
      if (f.stunned > 0) {
        f.stunned -= dt;
        if (f.stunned <= 0) f.el.dataset.frame = "walk1";
      } else {
        if (!f.target || f.target.stunned > 0 || Math.random() < 0.005) f.target = nearestEnemy(f);
        var t = f.target;
        if (t) {
          var dx = t.x - f.x, dy = t.y - f.y, d = Math.hypot(dx, dy) || 1;
          if (d < 34 && t.stunned <= 0) clash(f, t);
          else {
            // verso il nemico, ma lontano dai compagni: così non finiscono tutti in un mucchio
            var mx = dx / d, my = dy / d;
            fighters.forEach(function (o) {
              if (o === f || o.team !== f.team) return;
              var ox = f.x - o.x, oy = f.y - o.y, od = Math.hypot(ox, oy);
              if (od > 0 && od < 60) { mx += (ox / od) * (60 - od) / 30; my += (oy / od) * (60 - od) / 30; }
            });
            f.wob = (f.wob || rand(0, 6)) + dt * 2;
            my += Math.sin(f.wob) * 0.5;
            var m = Math.hypot(mx, my) || 1;
            f.x += (mx / m) * f.speed * dt;
            f.y += (my / m) * f.speed * dt;
            if (Math.abs(dx) > 4) f.dir = dx > 0 ? 1 : -1;
            f.step += dt * 1000;
            f.el.dataset.frame = Math.floor(f.step / 140) % 2 ? "walk2" : "walk1";
          }
        } else f.el.dataset.frame = "sit";
      }
      f.x = Math.max(0, Math.min(maxX, f.x));
      f.y = Math.max(0, Math.min(maxY, f.y));
      draw(f);
    });
    requestAnimationFrame(loop);
  }

  // Con "riduci movimento": una scena ferma, coppie che si fronteggiano.
  function staticScene() {
    var box = arena.getBoundingClientRect();
    var cats = fighters.filter(function (f) { return f.team === "gatto"; });
    var dogs = fighters.filter(function (f) { return f.team === "cane"; });
    cats.forEach(function (c, i) {
      var d = dogs[i];
      var y = (i + 0.5) * (box.height - H) / cats.length;
      var x = rand(0.15, 0.55) * box.width;
      c.x = x; c.y = y; c.dir = 1; c.el.dataset.frame = "play";
      d.x = x + 46; d.y = y; d.dir = -1; d.el.dataset.frame = "play";
      draw(c); draw(d);
      if (i % 2 === 0) cloud(x + W, y, i % 4 ? "cane" : "gatto");
    });
  }
})();
