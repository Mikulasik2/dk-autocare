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
    document.body.classList.remove('nav-open'); // re-enable background scroll
    header.classList.remove('menu-open'); // restore header's backdrop blur
  }

  function toggleMenu() {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // Prevent the hero/page behind the menu from scrolling while it's open
    document.body.classList.toggle('nav-open', isOpen);
    // Drop the header's backdrop-filter while open (see CSS comment on
    // .site-header.menu-open) so the fixed nav positions against the
    // viewport, not the header.
    header.classList.toggle('menu-open', isOpen);
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

});
