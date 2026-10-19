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

// Fantastic family carousel: scroll-snap does the sliding (works without JS);
// this wires the tabs and arrows and marks the slide in view.
(function () {
  var root = document.querySelector('.fx-ads');
  if (!root) return;
  var track = root.querySelector('.fx-ads__track');
  var slides = root.querySelectorAll('.fx-ad');
  var tabs = root.querySelectorAll('[data-slide]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = 0;
  function mark(i) {
    current = i;
    tabs.forEach(function (t, k) {
      t.classList.toggle('is-active', k === i);
      if (k === i) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
  }
  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
    mark(i);
  }
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-slide]');
    if (t) return go(parseInt(t.dataset.slide, 10));
    var s = e.target.closest('[data-step]');
    if (s) go(current + parseInt(s.dataset.step, 10));
  });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) mark(Array.prototype.indexOf.call(slides, en.target));
      });
    }, { root: track, threshold: 0.6 });
    slides.forEach(function (s) { io.observe(s); });
  }
})();
