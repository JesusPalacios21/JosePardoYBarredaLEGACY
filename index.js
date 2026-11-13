(function () {
  var CFG = {
    wa: "51922328324", 
    hero: "img/head.jpg",
    photos: [
      { p: "img/grupalpardo1.jpg", t: "Nuestra promoción", d: "I.E.E. José Pardo y Barreda" },
      { p: "img/grupalpardo2.jpg", t: "Legacy", d: "Lo que dejamos, perdura" },
      { p: "img/grupalpardo3.jpg", t: "Un nuevo comienzo", d: "Promoción 2026" },
      { p: "img/grupalpardo4.jpg", t: "Por siempre juntos", d: "Una historia, mil recuerdos y una amistad para toda la vida" },
    ],
  };

  var MUSIC_SRC = "music/countonme.mp3"; 
  var MUSIC_VOL = 1; 

  var T = new Date("2026-12-05T20:00:00-05:00").getTime(),
    $ = function (i) {
      return document.getElementById(i);
    },
    MS = 5000,
    RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* foto de portada con degradado de respaldo */
  if (CFG.hero) {
    $("hbg").style.backgroundImage = "url('" + CFG.hero + "'), linear-gradient(170deg,#5fbf88,#2a9a58 55%,#0a3320)";
  }

  /* reveal */
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".rv").forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 100 + "ms";
    io.observe(el);
  });

  /* cuenta regresiva */
  var last = {},
    cdTitle = $("d").closest("section").querySelector("h2"),
    cdDone = false;
  function tick() {
    var x = Math.max(0, T - Date.now()),
      v = {
        d: Math.floor(x / 864e5),
        h: Math.floor((x % 864e5) / 36e5),
        m: Math.floor((x % 36e5) / 6e4),
        s: Math.floor((x % 6e4) / 1e3),
      };
    for (var k in v) {
      var el = $(k),
        s = String(v[k]);
      if (last[k] !== s) {
        el.textContent = s;
        el.classList.remove("pop");
        void el.offsetWidth;
        el.classList.add("pop");
        last[k] = s;
      }
    }
    if (x === 0 && !cdDone) {
      cdTitle.textContent = "¡Hoy es el gran día!";
      cdDone = true;
    }
  }
  tick();
  setInterval(tick, 1000);

  /* galería de fotos grupales */
  var P = CFG.photos,
    gs = $("gstage"),
    th = $("thumbs"),
    lb = $("lb"),
    i = 0,
    tm,
    sx = null,
    lastSw = 0,
    E = function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    };
  P.forEach(function (s, k) {
    var d = document.createElement("div");
    d.className = "gs";
    d.innerHTML =
      (s.p
        ? '<div class="bgb" style="background-image:url(\'' + s.p + '\')"></div><img alt="' + E(s.t) + '" src="' + s.p + '" onerror="this.remove()">'
        : '<div class="ph2">📷</div>') +
      '<div class="gc"><p class="scr">' + E(s.t) + '</p><p class="cap">' + E(s.d || "Promoción 2026") + "</p></div>";
    gs.appendChild(d);
    var b = document.createElement("button");
    b.className = "th";
    b.setAttribute("aria-label", "Ver foto " + (k + 1));
    b.innerHTML = s.p ? '<img alt="" src="' + s.p + '" onerror="this.remove()">' : "";
    b.onclick = function () {
      go(k);
      auto();
    };
    th.appendChild(b);
  });
  var sl = gs.querySelectorAll(".gs"),
    tb = th.children;
  function go(j, first) {
    var o = sl[i];
    i = (j + sl.length) % sl.length;
    if (!first && o !== sl[i]) {
      o.classList.remove("on");
      o.classList.add("out");
      setTimeout(function () {
        o.classList.remove("out");
      }, 1600);
    }
    sl[i].classList.add("on");
    [].forEach.call(tb, function (t, n) {
      t.classList.toggle("on", n === i);
    });
    $("cnt").textContent = i + 1 + " / " + sl.length;
    var p = $("pbi");
    p.classList.remove("run");
    void p.offsetWidth;
    p.style.setProperty("--ms", MS + "ms");
    if (!RM) p.classList.add("run");
  }
  function auto() {
    clearInterval(tm);
    if (RM) return;
    tm = setInterval(function () {
      go(i + 1);
    }, MS);
  }
  $("pv").onclick = function () {
    go(i - 1);
    auto();
  };
  $("nx").onclick = function () {
    go(i + 1);
    auto();
  };
  gs.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  gs.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) {
      lastSw = Date.now();
      go(i + (dx < 0 ? 1 : -1));
      auto();
    }
    sx = null;
  });
  gs.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { go(i + 1); auto(); }
    if (e.key === "ArrowLeft") { go(i - 1); auto(); }
  });
  /* ampliar foto */
  function showLb() {
    $("lbi").src = P[i].p;
    $("lbi").alt = P[i].t;
  }
  gs.addEventListener("click", function () {
    if (Date.now() - lastSw < 400 || !P[i].p) return;
    showLb();
    lb.classList.add("on");
    clearInterval(tm);
  });
  function closeLb() {
    lb.classList.remove("on");
    auto();
  }
  lb.onclick = closeLb;
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") { go(i + 1); showLb(); }
    if (e.key === "ArrowLeft") { go(i - 1); showLb(); }
  });
  if (sl.length) {
    go(0, true);
    auto();
  }

  /* ===== Enciende tu legado ===== */
  var scene = $("scene"),
    NS = "http://www.w3.org/2000/svg",
    stage = 0,
    busy = false,
    N = 6,
    letters = document.querySelectorAll(".lt");

  // corona de laurel: 2 hojas por lado en cada etapa
  (function () {
    var R = 118, CX = 150, CY = 190, h = "";
    for (var s = 1; s <= N; s++) {
      for (var side = 1; side >= -1; side -= 2) {
        for (var j = 0; j < 2; j++) {
          var t = (s - 1) * 22 + j * 10,
            rad = (t * Math.PI) / 180,
            px = CX + side * R * Math.sin(rad),
            py = CY + R * Math.cos(rad),
            a = (side > 0 ? -t : t - 180) + (j ? 26 : -26);
          h +=
            '<g class="lf" data-s="' + s + '" transform="translate(' + px.toFixed(1) + " " + py.toFixed(1) + ") rotate(" + a.toFixed(1) +
            ')"><ellipse class="lv" rx="15" ry="6.5" fill="url(#leafG)"/></g>';
        }
      }
    }
    $("laurel").innerHTML = h;
  })();

  function sparks(n) {
    var g = $("sparks"), x = +letters[n].getAttribute("x");
    for (var k = 0; k < 6; k++) {
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("class", "spark");
      c.setAttribute("r", 1.8 + Math.random() * 1.6);
      c.setAttribute("cx", x + Math.random() * 20 - 10);
      c.setAttribute("cy", 190 + Math.random() * 8);
      c.style.setProperty("--dx", Math.random() * 30 - 15 + "px");
      c.addEventListener("animationend", function () { this.remove(); });
      g.appendChild(c);
    }
  }
  function gset() {
    [].forEach.call(letters, function (l, n) {
      l.classList.toggle("on", n < stage);
    });
    [].forEach.call(document.querySelectorAll(".lf"), function (e) {
      e.classList.toggle("on", +e.getAttribute("data-s") <= stage);
    });
    $("halo").style.opacity = stage / N;
    [].forEach.call(document.querySelectorAll(".wd"), function (d, n) {
      d.classList.toggle("on", n < stage);
    });
    var done = stage >= N,
      cap = $("cap");
    cap.classList.toggle("on", done);
    if (!done) cap.classList.remove("fly");
    scene.classList.toggle("done", done);
    $("gdone").classList.toggle("on", done);
    $("water").hidden = done;
    $("again").hidden = !done;
    $("ghint").textContent = done
      ? "¡Tu legado brilla! Gracias por ser parte de esta historia"
      : stage === 0
        ? "Toca la tarjeta y enciende cada letra"
        : "Sigue encendiendo… ¡ya casi!";
  }
  function light() {
    if (busy || stage >= N) return;
    busy = true;
    sparks(stage);
    stage++;
    gset();
    if (stage >= N) {
      setTimeout(function () {
        $("cap").classList.add("fly");
        burst();
      }, 700);
    }
    setTimeout(function () { busy = false; }, 450);
  }
  scene.addEventListener("click", light);
  $("water").onclick = light;
  $("again").onclick = function () {
    stage = 0;
    busy = false;
    gset();
  };
  gset();

  /* WhatsApp */
  function wa(ok) {
    var nm = $("nm").value.trim();
    if (!nm) {
      $("nm").focus();
      $("nm").placeholder = "Escribe tu nombre primero";
      return;
    }
    var m = ok
      ? "¡Hola! Soy " + nm + " y confirmo mi asistencia a la promoción “Legacy 2026” (5 de diciembre). Asistiremos " + $("ng").value + " persona(s). 🎓"
      : "Hola, soy " + nm + ". Lamentablemente no podré asistir a la promoción “Legacy 2026”. ¡Les deseo lo mejor! 💚";
    window.open("https://wa.me/" + CFG.wa + "?text=" + encodeURIComponent(m), "_blank");
  }
  $("yes").onclick = function () { wa(true); };
  $("no").onclick = function () { wa(false); };
  $("sh").onclick = function () {
    var d = { title: "Legacy 2026", text: "Estás invitado a la promoción “Legacy 2026” 🎓", url: location.href };
    if (navigator.share) {
      navigator.share(d).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(location.href).then(
        function () { $("sh").textContent = "¡Enlace copiado!"; },
        function () { prompt("Copia el enlace", location.href); },
      );
    } else {
      prompt("Copia el enlace", location.href);
    }
  };

  /* ====== MÚSICA (archivo mp3) ====== */
  var audio = new Audio(MUSIC_SRC),
    on = false;
  audio.loop = true;
  audio.volume = MUSIC_VOL;
  audio.preload = "none";
  function paintM() {
    $("mus").textContent = on ? "🔊" : "🔇";
    $("mus").className = on ? "" : "off";
  }
  function setM(v) {
    on = v;
    paintM();
    if (v) {
      var p = audio.play();
      if (p && p.catch)
        p.catch(function () {
          on = false;
          paintM();
        });
    } else {
      audio.pause();
    }
  }
  audio.addEventListener("error", function () { on = false; paintM(); });
  $("mus").onclick = function () { setM(!on); };
  $("open").onclick = function () {
    var gate = $("gate");
    gate.classList.add("open");
    gate.setAttribute("aria-hidden", "true");
    gate.setAttribute("inert", "");
    document.body.classList.add("go");
    setM(true);
    burst();
  };
  document.addEventListener("visibilitychange", function () {
    if (!on) return;
    if (document.hidden) audio.pause();
    else {
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    }
  });

  /* destellos y confeti */
  var cv = $("fx"),
    cx = cv.getContext("2d"),
    F = [],
    B = [],
    W,
    H,
    dpr = Math.min(devicePixelRatio || 1, 2),
    cl = ["#fff", "#d9f0e2", "#7fcf9f", "#4fb67c"];
  function rs() {
    W = innerWidth;
    H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  rs();
  addEventListener("resize", rs);
  function mk(y) {
    return { x: Math.random() * W, y: y === undefined ? Math.random() * H : y, r: Math.random() * 2.2 + 0.8, v: Math.random() * 0.5 + 0.2, w: Math.random() * 6 };
  }
  if (!RM) for (var q = 0; q < Math.min(60, W / 12); q++) F.push(mk());
  function burst() {
    if (RM) return;
    for (var q = 0; q < 130; q++) {
      var a = Math.random() * Math.PI * 2,
        s = Math.random() * 10 + 3;
      B.push({ x: W / 2, y: H / 2, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 5, c: cl[q % 4], l: 1, z: Math.random() * 6 + 3 });
    }
  }
  function dr() {
    if (RM) return;
    cx.clearRect(0, 0, W, H);
    F.forEach(function (p) {
      p.y += p.v;
      p.w += 0.03;
      p.x += Math.sin(p.w) * 0.4;
      if (p.y > H + 6) Object.assign(p, mk(-6));
      cx.globalAlpha = 0.35 + 0.35 * Math.sin(p.w * 2);
      cx.fillStyle = "#fff";
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, 7);
      cx.fill();
    });
    B = B.filter(function (c) { return c.l > 0; });
    B.forEach(function (c) {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.22;
      c.vx *= 0.985;
      c.l -= 0.012;
      cx.globalAlpha = Math.max(c.l, 0);
      cx.fillStyle = c.c;
      cx.fillRect(c.x, c.y, c.z, c.z * 0.6);
    });
    cx.globalAlpha = 1;
    requestAnimationFrame(dr);
  }
  dr();
})();