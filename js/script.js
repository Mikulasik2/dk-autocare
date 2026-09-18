/* =====================================================
   D&K AutoCARE — script.js
   Vanilla JS: mobile menu, sticky header, smooth scroll,
   scroll-reveal animations, dynamic footer year.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Dynamic footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Sticky header background on scroll ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');

  function closeMenu() {
    hamburger.classList.remove('open');
    mainNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', toggleMenu);

    // Close menu after clicking a nav link (mobile)
    mainNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Smooth scroll for in-page anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 72;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- Scroll-reveal animation ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    // Only hide elements (via .reveal-init) once we know JS can reveal them again.
    revealEls.forEach((el) => {
      el.classList.add('reveal-init');
      observer.observe(el);
    });
  }
  // If IntersectionObserver isn't supported, elements simply stay visible
  // (no .reveal-init class added), which is the safe default.

});
