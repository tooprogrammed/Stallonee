(function () {
  'use strict';

  // reveal-on-scroll: alternate slide-in direction (left, right, left...)
  var revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(function (el, i) {
    if (i % 2 === 1) el.classList.add('from-right');
  });
  if ('IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // tab nav: smooth scroll to rail + active state
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
  var rails = tabBtns
    .map(function (btn) { return document.getElementById(btn.dataset.target); })
    .filter(Boolean);

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (rails.length) {
    var setActive = function (id) {
      tabBtns.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.target === id);
      });
    };
    var spyTicking = false;
    var updateActiveOnScroll = function () {
      var threshold = 120;
      var current = rails[0];
      rails.forEach(function (rail) {
        if (rail.getBoundingClientRect().top <= threshold) current = rail;
      });
      setActive(current.id);
      spyTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (!spyTicking) {
        window.requestAnimationFrame(updateActiveOnScroll);
        spyTicking = true;
      }
    }, { passive: true });
    updateActiveOnScroll();
  }

  // rail arrows: horizontal scroll
  document.querySelectorAll('.rail-arrows').forEach(function (arrowGroup) {
    var trackId = arrowGroup.dataset.for;
    var track = document.getElementById(trackId);
    if (!track) return;
    arrowGroup.querySelectorAll('.rail-arrow').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = parseInt(btn.dataset.dir, 10) || 1;
        var amount = Math.min(track.clientWidth * 0.8, 320) * dir;
        track.scrollBy({ left: amount, behavior: 'smooth' });
      });
    });
  });

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
