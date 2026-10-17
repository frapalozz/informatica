/* Neve leggera su <canvas>, attiva da dicembre a febbraio. */
(function () {
  "use strict";

  var month = new Date().getMonth() + 1;
  if (!(month > 11 || month < 3)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.getElementById("snow-canvas");
  if (!canvas) return;
  canvas.classList.remove("hidden");
  var ctx = canvas.getContext("2d");
  var flakes = [], W = 0, H = 0;

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var target = Math.min(150, Math.round(W / 10));
    while (flakes.length < target) flakes.push(make(true));
    flakes.length = target;
  }

  function make(anywhere) {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : -10,
      r: 1 + Math.random() * 3,
      vy: 0.6 + Math.random() * 1.2,
      drift: Math.random() * Math.PI * 2,
      o: 0.5 + Math.random() * 0.5
    };
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.vy;
      f.drift += 0.01;
      f.x += Math.sin(f.drift) * 0.5;
      if (f.y > H + 10) flakes[i] = f = make(false);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + f.o + ")";
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();
})();
