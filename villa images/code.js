/* ==========================================================================
   Villa Magna Ciwidey — code.js
   Vanilla JS: navbar on scroll, smooth scroll, mobile menu, scroll-reveal,
   gallery lightbox, and WhatsApp reservation redirect.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Config                                                             */
  /* ------------------------------------------------------------------ */
  var WHATSAPP_NUMBER = '6282115144744'; // 082115144744 in international format
  var WHATSAPP_MESSAGE =
    'Halo Villa Magna Ciwidey, saya ingin menanyakan ketersediaan (availability) ' +
    'villa untuk acara keluarga kami. Bisa dibantu informasi jadwal dan harga sewanya? ' +
    'Terima kasih.';
  var MAPS_QUERY = 'Saladengung, Sukawening, Kec. Ciwidey, Kabupaten Bandung, Jawa Barat 40973';

  /* ------------------------------------------------------------------ */
  /*  WhatsApp redirect                                                  */
  /* ------------------------------------------------------------------ */
  function openWhatsApp() {
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(url, '_blank', 'noopener');
  }

  function openGoogleMaps() {
    var url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(MAPS_QUERY);
    window.open(url, '_blank', 'noopener');
  }

  document.querySelectorAll('[data-whatsapp-trigger]').forEach(function (btn) {
    btn.addEventListener('click', openWhatsApp);
  });

  document.querySelectorAll('[data-maps-trigger]').forEach(function (btn) {
    btn.addEventListener('click', openGoogleMaps);
  });

  /* ------------------------------------------------------------------ */
  /*  Navbar: transparent -> blurred on scroll                           */
  /* ------------------------------------------------------------------ */
  var navbar = document.getElementById('navbar');
  var SCROLL_THRESHOLD = 40;
  var ticking = false;

  function updateNavbar() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });
  updateNavbar();

  /* ------------------------------------------------------------------ */
  /*  Mobile menu toggle                                                  */
  /* ------------------------------------------------------------------ */
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuBars = menuToggle ? menuToggle.querySelectorAll('.menu-bar') : [];

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (menuBars.length === 3) {
      menuBars[0].style.transform = '';
      menuBars[1].style.opacity = '1';
      menuBars[2].style.transform = '';
    }
  }

  function toggleMobileMenu() {
    var isOpen = mobileMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    if (menuBars.length === 3) {
      if (isOpen) {
        menuBars[0].style.transform = 'translateY(7px) rotate(45deg)';
        menuBars[1].style.opacity = '0';
        menuBars[2].style.transform = 'translateY(-7px) rotate(-45deg) scaleX(1.4)';
      } else {
        menuBars[0].style.transform = '';
        menuBars[1].style.opacity = '1';
        menuBars[2].style.transform = '';
      }
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }

  /* ------------------------------------------------------------------ */
  /*  Smooth scroll to sections                                          */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('a[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (!targetId || targetId.charAt(0) !== '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      closeMobileMenu();

      var navHeight = navbar.offsetHeight;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ------------------------------------------------------------------ */
  /*  Scroll-reveal via IntersectionObserver                             */
  /* ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Gallery lightbox                                                   */
  /* ------------------------------------------------------------------ */
  var lightboxSources = [];
  document.querySelectorAll('[data-lightbox]').forEach(function (el) {
    lightboxSources.push({
      src: el.getAttribute('data-src') || el.querySelector('img').getAttribute('src'),
      caption: el.getAttribute('data-caption') || el.querySelector('img').getAttribute('alt')
    });
  });

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    var img = item.querySelector('img');
    var caption = item.querySelector('figcaption');
    lightboxSources.push({
      src: img.getAttribute('src'),
      caption: caption ? caption.textContent : img.getAttribute('alt')
    });
  });

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentIndex = 0;

  function renderLightbox() {
    var item = lightboxSources[currentIndex];
    if (!item) return;
    lightboxImg.setAttribute('src', item.src);
    lightboxImg.setAttribute('alt', item.caption);
    lightboxCaption.textContent = item.caption;
  }

  function openLightbox(index) {
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add('is-open');
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % lightboxSources.length;
    renderLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + lightboxSources.length) % lightboxSources.length;
    renderLightbox();
  }

  var clickableIndex = 0;
  document.querySelectorAll('[data-lightbox], .gallery-item').forEach(function (el) {
    var idx = clickableIndex;
    el.addEventListener('click', function () {
      openLightbox(idx);
    });
    clickableIndex++;
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  /* ------------------------------------------------------------------ */
  /*  Footer year                                                        */
  /* ------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
