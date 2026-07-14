/* ============================================================
   SmartSwan — script.js
   Nav · scroll reveal · counters · FAQ · mobile menu · typewriter
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shadow ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile hamburger ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  hamburger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger children slightly by adding a delay based on index within parent
          var target = entry.target;
          target.classList.add('visible');
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    // Add staggered delay to grouped reveals for a nicer cascade
    document.querySelectorAll('.services-grid .reveal, .solutions-grid .reveal, .features-grid .reveal, .tech-groups .reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i * 60) + 'ms';
    });

    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.stat-num');
  if ('IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObs.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Single-open FAQ (details/summary) ---------- */
  var faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqs.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Typewriter for AI console (retriggers on view) ---------- */
  var typeEl = document.getElementById('typewriter');
  if (typeEl) {
    var fullText = typeEl.textContent;
    typeEl.textContent = '';
    function typeIt() {
      typeEl.textContent = '';
      var i = 0;
      function next() {
        if (i <= fullText.length) {
          typeEl.textContent = fullText.slice(0, i);
          i++;
          setTimeout(next, 18);
        }
      }
      next();
    }
    if ('IntersectionObserver' in window) {
      var typeObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { typeIt(); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      typeObs.observe(typeEl);
    } else {
      typeEl.textContent = fullText;
    }
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name, email = form.email, message = form.message;
      var ok = true;
      [name, email, message].forEach(function (f) { f.classList.remove('invalid'); });
      if (!name.value.trim())          { name.classList.add('invalid'); ok = false; }
      if (!isEmail(email.value.trim())){ email.classList.add('invalid'); ok = false; }
      if (!message.value.trim())       { message.classList.add('invalid'); ok = false; }
      if (!ok) {
        note.textContent = 'Please complete the required fields with a valid work email.';
        note.className = 'form-note err';
        return;
      }
      note.textContent = 'Thanks — a senior engineer will reply within one business day.';
      note.className = 'form-note ok';
      form.reset();
    });
  }
})();
