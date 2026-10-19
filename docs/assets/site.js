// Home-page category filter. Cards are real links; this only shows/hides them.
(function () {
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-filter]');
    if (!chip) return;
    var key = chip.getAttribute('data-filter');
    document.querySelectorAll('[data-filter]').forEach(function (c) {
      c.classList.toggle('is-active', c.getAttribute('data-filter') === key);
    });
    document.querySelectorAll('[data-group]').forEach(function (card) {
      var show = key === 'all' || card.getAttribute('data-group') === key;
      card.style.display = show ? '' : 'none';
    });
  });
})();

// Preview carousel: crossfade through every platform's frames — 5s hold + 0.5s fade.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  document.querySelectorAll('.carousel').forEach(function (box) {
    var slides = box.querySelectorAll('.cslide');
    if (slides.length < 2) return;
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove('is-active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-active');
    }, 5500);
  });
})();

// Fantastic hero video: play muted while on screen (never with reduced motion);
// chapter / "Watch" buttons and #t=SECONDS links seek it.
(function () {
  var video = document.querySelector('[data-autoplay]');
  if (!video) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var userPaused = false;
  video.addEventListener('pause', function () { if (video.dataset.auto !== '1') userPaused = true; video.dataset.auto = ''; });
  video.addEventListener('play', function () { userPaused = false; });
  if (!reduce && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !userPaused) { video.play().catch(function () {}); }
        else if (!e.isIntersecting && !video.paused) { video.dataset.auto = '1'; video.pause(); }
      });
    }, { threshold: 0.35 }).observe(video);
  }
  var chapters = document.querySelectorAll('.fx-chapter');
  function mark() {
    var t = video.currentTime, cur = null;
    chapters.forEach(function (c) { if (parseFloat(c.dataset.seek) <= t + 0.05) cur = c; });
    chapters.forEach(function (c) { c.classList.toggle('is-active', c === cur); });
  }
  video.addEventListener('timeupdate', mark);
  function seek(t, scroll) {
    var go = function () { video.currentTime = t; mark(); video.play().catch(function () {}); };
    if (video.readyState >= 1) go(); else { video.preload = 'auto'; video.addEventListener('loadedmetadata', go, { once: true }); video.load(); }
    if (scroll) video.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-seek]');
    if (b) seek(parseFloat(b.dataset.seek), !b.classList.contains('fx-chapter'));
  });
  var m = /^#t=(\d+(?:\.\d+)?)$/.exec(location.hash);
  if (m) seek(parseFloat(m[1]), true);
})();

// Copy buttons.
(function () {
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b || !navigator.clipboard) return;
    navigator.clipboard.writeText(b.dataset.copy).then(function () {
      b.textContent = 'Copied';
      setTimeout(function () { b.textContent = 'Copy'; }, 1600);
    });
  });
})();

// /fantastic/ reel: a tabbed carousel. Each tab's bar fills over 6.5s and its
// animationend advances the reel, so hover, keyboard focus, the pause button and
// scrolling it off screen pause it simply by pausing the bar. No autoplay with
// reduced motion.
(function () {
  var reel = document.querySelector('[data-reel]');
  if (!reel) return;
  var slides = reel.querySelectorAll('.fl-reel__slide');
  var tabs = reel.querySelectorAll('[role="tab"]');
  var pause = reel.querySelector('[data-reel-pause]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0;
  function show(i, focus) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === cur); });
    tabs.forEach(function (t, k) {
      var on = k === cur;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tabs[cur].focus();
  }
  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () { show(k); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show(cur + (e.key === 'ArrowRight' ? 1 : -1), true); }
    });
    t.querySelector('.fl-reel__fill').addEventListener('animationend', function () { if (k === cur) show(cur + 1); });
  });
  var stage = reel.querySelector('.fl-reel__stage');
  var x0 = null;
  // Swipe on touch and pen only; a mouse drag keeps selecting text as usual.
  stage.addEventListener('pointerdown', function (e) { x0 = e.pointerType === 'mouse' ? null : e.clientX; });
  stage.addEventListener('pointerup', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  });
  if (reduce) return;
  reel.classList.add('is-autoplay', 'is-playing');
  pause.addEventListener('click', function () {
    var p = reel.classList.toggle('is-paused');
    pause.setAttribute('aria-label', p ? 'Play the slideshow' : 'Pause the slideshow');
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { reel.classList.toggle('is-offscreen', !e.isIntersecting); });
    }, { threshold: 0.3 }).observe(reel);
  }
})();

// Scroll reveal: only what starts below the fold fades in, so nothing on screen
// at load ever flashes or shifts. No JS or reduced motion: everything is visible.
(function () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.remove('is-pending');
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) {
    if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add('is-pending');
    io.observe(el);
  });
})();

// Bento tiles: a soft spotlight follows the pointer.
(function () {
  document.addEventListener('pointermove', function (e) {
    var t = e.target.closest && e.target.closest('.fl-tile');
    if (!t) return;
    var r = t.getBoundingClientRect();
    t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    t.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });
})();
