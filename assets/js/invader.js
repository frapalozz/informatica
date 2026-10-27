/*
 * Easter egg: dopo 1 minuto passato sul sito compare un piccolo alieno pixel
 * che scende dall'alto, segue il cursore e gli spara. Cliccandolo esplode;
 * torna dopo un altro minuto. Solo desktop (mouse), mai con "riduci movimento".
 *
 * Il tempo è contato solo con la scheda visibile ed è condiviso tra le pagine
 * della stessa sessione (sessionStorage), così il minuto non riparte a ogni clic.
 */
(function () {
  "use strict";

  var DELAY_MS = 60 * 1000;
  var KEY_TIME = "invader-time";
  var KEY_NEXT = "invader-next";

  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  if (!mq("(hover: hover) and (pointer: fine)") || window.innerWidth < 1024) return;
  if (mq("(prefers-reduced-motion: reduce)")) return;

  // ── Tempo sul sito ──────────────────────────────────────────
  function read(key, fallback) {
    try { var v = parseInt(sessionStorage.getItem(key), 10); return isNaN(v) ? fallback : v; }
    catch (e) { return fallback; }
  }
  function write(key, value) {
    try { sessionStorage.setItem(key, String(value)); } catch (e) { /* storage bloccato: vale per la pagina */ }
  }

  var elapsed = read(KEY_TIME, 0);
  var next = read(KEY_NEXT, DELAY_MS);
  var lastTick = Date.now();
  var alien = null;

  setInterval(function () {
    var now = Date.now();
    if (document.visibilityState === "visible") elapsed += Math.min(now - lastTick, 2000);
    lastTick = now;
    write(KEY_TIME, elapsed);
    if (!alien && elapsed >= next) spawn();
  }, 1000);

  // ── Sprite ──────────────────────────────────────────────────
  // b = corpo, w = occhio, a = antenna. La pupilla è disegnata a parte e guarda il cursore.
  var BODY = [
    "......a......",
    "....bbbbb....",
    "..bbbbbbbbb..",
    ".bbbwwwwwbbb.",
    ".bbbwwwwwbbb.",
    ".bbbwwwwwbbb.",
    "..bbbbbbbbb.."
  ];
  var LEGS = [
    ["..b.b...b.b..", ".b...b.b...b."],
    ["..b..b.b..b..", "...b.....b..."]
  ];
  var PX = 4;                       // pixel dello schermo per pixel dello sprite
  var SW = 13 * PX, SH = 9 * PX;    // dimensioni dello sprite
  var COLORS = { b: "#22c55e", a: "#facc15", w: "#f5f5f4", k: "#0c0a09" };
  var BOLT = "#f59e0b";
  var SPARKS = ["#22c55e", "#facc15", "#f59e0b", "#f5f5f4"];

  // ── Canvas ─────────────────────────────────────────────────
  var canvas, ctx, W = 0, H = 0;
  function setup() {
    canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:90";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }
  function resize() {
    var dpr = window.devicePixelRatio || 1;
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  // ── Stato ──────────────────────────────────────────────────
  var mouse = { x: -1, y: -1, inside: false };
  var bolts = [], sparks = [];
  var running = false, last = 0;

  document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.inside = true;
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", function () { mouse.inside = false; });

  function spawn() {
    if (!canvas) setup();
    var homeY = 110;
    alien = {
      x: Math.round((mouse.inside ? mouse.x : W / 2) - SW / 2),
      y: -SH - 10,
      homeY: homeY,
      stepAt: 0,
      frame: 0,
      nextShot: performance.now() + 1800,
      t0: performance.now()
    };
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  }

  function explode(x, y, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 160;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + Math.random() * 0.3, age: 0,
        c: SPARKS[(Math.random() * SPARKS.length) | 0] });
    }
  }

  // Cliccare l'alieno lo fa esplodere (senza attivare il link che c'è sotto).
  document.addEventListener("click", function (e) {
    if (!alien) return;
    if (e.clientX >= alien.x - 6 && e.clientX <= alien.x + SW + 6 && e.clientY >= alien.y - 6 && e.clientY <= alien.y + SH + 6) {
      e.preventDefault();
      e.stopPropagation();
      explode(alien.x + SW / 2, alien.y + SH / 2, 26);
      alien = null;
      bolts.length = 0;
      next = elapsed + DELAY_MS;
      write(KEY_NEXT, next);
    }
  }, true);

  // ── Disegno ────────────────────────────────────────────────
  function drawRows(rows, ox, oy) {
    for (var y = 0; y < rows.length; y++) {
      for (var x = 0; x < rows[y].length; x++) {
        var c = COLORS[rows[y][x]];
        if (c) { ctx.fillStyle = c; ctx.fillRect(ox + x * PX, oy + y * PX, PX, PX); }
      }
    }
  }

  function drawAlien(a) {
    var ox = Math.round(a.x), oy = Math.round(a.y);
    drawRows(BODY, ox, oy);
    drawRows(LEGS[a.frame], ox, oy + BODY.length * PX);
    // pupilla: colonne 5-7, righe 3-5 dell'occhio, verso il cursore
    var cx = ox + SW / 2, cy = oy + 4 * PX;
    var px = 6, py = 4;
    if (mouse.inside) {
      var dx = mouse.x - cx, dy = mouse.y - cy;
      px = dx < -40 ? 5 : dx > 40 ? 7 : 6;
      py = dy > 60 ? 5 : dy < -20 ? 3 : 4;
    }
    ctx.fillStyle = COLORS.k;
    ctx.fillRect(ox + px * PX, oy + py * PX, PX, PX);
  }

  function drawBolt(b) {
    // saetta a zig-zag fatta di quadratini lungo la direzione di volo
    var ux = b.vx / b.speed, uy = b.vy / b.speed;
    for (var i = 0; i < 4; i++) {
      var side = (i % 2 ? 1 : -1) * 2.5;
      var x = b.x - ux * i * 5 - uy * side, y = b.y - uy * i * 5 + ux * side;
      ctx.fillStyle = BOLT;
      ctx.fillRect(Math.round(x - 2), Math.round(y - 2), 4, 4);
    }
  }

  // ── Ciclo ──────────────────────────────────────────────────
  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, W, H);

    if (alien) {
      var a = alien;
      // Movimento "a scatti" come nei vecchi arcade: un passo ogni 90 ms.
      if (now >= a.stepAt) {
        a.stepAt = now + 90;
        a.frame = 1 - a.frame;
        if (a.y < a.homeY) {
          a.y = Math.min(a.homeY, a.y + 8);
        } else {
          var target = (mouse.inside ? mouse.x : W / 2 + Math.sin(now / 1500) * W * 0.3) - SW / 2;
          var d = target - a.x;
          if (Math.abs(d) > PX) a.x += Math.max(-PX * 2, Math.min(PX * 2, d));
          a.x = Math.max(8, Math.min(W - SW - 8, a.x));
          a.y = a.homeY + (Math.floor(now / 600) % 2) * PX; // piccolo dondolio
        }
      }
      // Spara al cursore.
      if (mouse.inside && a.y >= a.homeY && now >= a.nextShot && bolts.length < 4) {
        a.nextShot = now + 900 + Math.random() * 900;
        var sx = a.x + SW / 2, sy = a.y + SH;
        var dx = mouse.x - sx, dy = mouse.y - sy, len = Math.max(1, Math.hypot(dx, dy)), speed = 360;
        bolts.push({ x: sx, y: sy, vx: dx / len * speed, vy: dy / len * speed, speed: speed });
      }
      drawAlien(a);
    }

    for (var i = bolts.length - 1; i >= 0; i--) {
      var b = bolts[i];
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (mouse.inside && Math.hypot(b.x - mouse.x, b.y - mouse.y) < 10) {
        explode(mouse.x, mouse.y, 12);   // colpito!
        bolts.splice(i, 1);
        continue;
      }
      if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) { bolts.splice(i, 1); continue; }
      drawBolt(b);
    }

    for (var j = sparks.length - 1; j >= 0; j--) {
      var s = sparks[j];
      s.age += dt;
      if (s.age >= s.life) { sparks.splice(j, 1); continue; }
      s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 300 * dt;
      ctx.globalAlpha = 1 - s.age / s.life;
      ctx.fillStyle = s.c;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), 4, 4);
      ctx.globalAlpha = 1;
    }

    if (alien || bolts.length || sparks.length) {
      requestAnimationFrame(tick);
    } else {
      running = false;
      ctx.clearRect(0, 0, W, H);
    }
  }

  if (elapsed >= next) spawn();
})();
