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

  /* ---------- Mobile fullscreen menu (v0.22 rebuild) ----------
     #mobile-menu is a standalone overlay living directly under <body>
     (see index.html) - completely independent from .site-header and its
     backdrop-filter, which was the root cause of the previous version's
     "hero visible through menu" bug. */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  function openMenu() {
    mobileMenu.hidden = false;
    // Force layout so the browser registers the un-hidden state before
    // the opacity/transform transition starts (otherwise it can skip it).
    void mobileMenu.offsetHeight;
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open'); // lock background scroll
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open'); // re-enable background scroll
    // Wait for the closing transition to finish before fully hiding
    // (hidden removes it from the accessibility tree / tab order).
    window.setTimeout(() => {
      if (!mobileMenu.classList.contains('open')) mobileMenu.hidden = true;
    }, 300);
  }

  function toggleMenu() {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMenu);

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMenu);
    }

    // Close menu after clicking a nav link or the "Zavolať" button, then
    // let the normal smooth-scroll handler (below) take over for anchors.
    mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-menu-cta').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
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

  /* ---------- Gallery lightbox (prepared for future real photos) ----------
     A gallery card only becomes clickable once it actually contains an
     <img> (i.e. once a real photo has been added, see
     assets/images/gallery/README.txt). Placeholder cards with just an
     emoji icon are left exactly as they are - no click behaviour, no
     broken images. */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  let lastFocusedEl = null;

  function openLightbox(imgEl, captionText) {
    if (!lightbox || !lightboxImage) return;
    lastFocusedEl = document.activeElement;
    lightboxImage.src = imgEl.currentSrc || imgEl.src;
    lightboxImage.alt = imgEl.alt || '';
    if (lightboxCaption) lightboxCaption.textContent = captionText || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  if (lightbox) {
    lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => {
      el.addEventListener('click', closeLightbox);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  document.querySelectorAll('.gallery-card').forEach((card) => {
    const img = card.querySelector('.gallery-media img');
    if (!img) return; // still a placeholder - stays inactive

    card.classList.add('has-photo');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const caption = card.querySelector('figcaption');
    const captionText = caption ? caption.textContent : '';

    card.addEventListener('click', () => openLightbox(img, captionText));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img, captionText);
      }
    });
  });

  /* ---------- Pricing (Cenník) lightbox ----------
     Self-contained, separate from the gallery lightbox above (own ids/
     classes/state) so it can't interfere with it, and separate from the
     v0.22 mobile menu's scroll-lock (that uses a body class; this one
     mirrors the gallery lightbox's own inline-style approach so both
     lightboxes behave identically). */
  const pricingTrigger = document.getElementById('pricing-trigger');
  const pricingLightbox = document.getElementById('pricing-lightbox');
  let pricingLastFocusedEl = null;

  function openPricingLightbox() {
    if (!pricingLightbox) return;
    pricingLastFocusedEl = document.activeElement;
    pricingLightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = pricingLightbox.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.focus();
  }

  function closePricingLightbox() {
    if (!pricingLightbox) return;
    pricingLightbox.hidden = true;
    document.body.style.overflow = '';
    if (pricingLastFocusedEl) pricingLastFocusedEl.focus();
  }

  if (pricingTrigger && pricingLightbox) {
    pricingTrigger.addEventListener('click', openPricingLightbox);

    pricingLightbox.querySelectorAll('[data-pricing-lightbox-close]').forEach((el) => {
      el.addEventListener('click', closePricingLightbox);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !pricingLightbox.hidden) closePricingLightbox();
    });
  }

});
