(function () {
  'use strict';
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  var revealAll = function () {
    els.forEach(function (el) { el.classList.add('is-revealed'); });
  };
  if (!('IntersectionObserver' in window)) { revealAll(); return; }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { revealAll(); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function (el) { io.observe(el); });
})();