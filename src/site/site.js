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
