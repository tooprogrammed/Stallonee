(function () {
  'use strict';

  var root = document.documentElement;
  var maxBlur = 14; // px
  var maxDark = 0.72;
  var fadeDistance = window.innerHeight * 1.1;
  var ticking = false;

  function updateScrollLayer() {
    var y = window.scrollY || window.pageYOffset;
    var progress = Math.min(y / fadeDistance, 1);
    root.style.setProperty('--scroll-blur', (progress * maxBlur).toFixed(2) + 'px');
    root.style.setProperty('--scroll-dark', (progress * maxDark).toFixed(3));
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollLayer);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    fadeDistance = window.innerHeight * 1.1;
  });
  updateScrollLayer();

  // reveal-on-scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
