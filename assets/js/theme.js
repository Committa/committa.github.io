(function () {
  'use strict';

  // Language toggle — persist choice to localStorage
  var langBtns = document.querySelectorAll('.lang-toggle__btn');
  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('hreflang');
      if (lang) localStorage.setItem('lang', lang);
    });
  });

  // Mobile nav drawer
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navDrawer = document.querySelector('[data-nav-drawer]');
  var navClose = document.querySelector('[data-nav-close]');

  function setDrawer(open) {
    if (!navDrawer || !navToggle) return;
    if (open) {
      navDrawer.hidden = false;
      requestAnimationFrame(function () { navDrawer.classList.add('is-open'); });
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Chiudi menu');
      document.body.style.overflow = 'hidden';
    } else {
      navDrawer.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Apri menu');
      document.body.style.overflow = '';
      setTimeout(function () { navDrawer.hidden = true; }, 250);
    }
  }

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      setDrawer(!open);
    });
    if (navClose) navClose.addEventListener('click', function () { setDrawer(false); });
    navDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setDrawer(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setDrawer(false);
        navToggle.focus();
      }
    });
  }

  // Header background on scroll
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
