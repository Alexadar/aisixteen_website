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
