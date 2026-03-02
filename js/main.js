/* ═══════════════════════════════════════════════════
   MAIN.JS — Navigation, scroll effects, tabs,
   cursor glow, and scroll-reveal animations.
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM References ───
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const cursorGlow = document.getElementById('cursorGlow');
  const scrollElements = document.querySelectorAll('.animate-on-scroll');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const themeToggle = document.getElementById('themeToggleFixed');
  const scrollTopBtn = document.getElementById('scrollTop');

  // ─── Theme Toggle ───
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Load saved theme (default: dark)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ─── Navbar Scroll Effect & Scroll-to-Top Visibility ───
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Add/remove scrolled class
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Show/hide scroll-to-top button
    if (scrollTopBtn) {
      if (currentScroll > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    lastScroll = currentScroll;
  });

  // ─── Scroll to Top ───
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Mobile Menu Toggle ───
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ─── Smooth Scroll for Nav Links ───
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ─── Active Nav Link Highlight ───
  const sections = document.querySelectorAll('.section, .hero');
  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -60% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // ─── Scroll Reveal Animation ───
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1,
    }
  );

  scrollElements.forEach((el) => revealObserver.observe(el));

  // ─── Experience Tabs ───
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');

      // Update buttons
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panels
      tabPanels.forEach((panel) => {
        panel.classList.remove('active');
        if (panel.id === tabId) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ─── Cursor Glow (Desktop Only) ───
  if (window.matchMedia('(min-width: 769px)').matches && cursorGlow) {
    let glowVisible = false;

    document.addEventListener('mousemove', (e) => {
      if (!glowVisible) {
        cursorGlow.style.opacity = '1';
        glowVisible = true;
      }
      requestAnimationFrame(() => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
      glowVisible = false;
    });
  }

  // ─── Tilt Effect on Skill Cards ───
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

      // Move glow with cursor
      const glow = card.querySelector('.skill-card-glow');
      if (glow) {
        glow.style.left = `${x - rect.width}px`;
        glow.style.top = `${y - rect.height}px`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  });

  // ─── Jello / Scroll Inertia (spring physics) ───
  (function initJello() {
    if (window.matchMedia('(max-width: 768px)').matches) return; // skip on mobile

    const SPRING   = 0.08;  // stiffness (lower = more wobbly)
    const DAMPING  = 0.65;  // friction  (lower = more bouncy)
    const STRENGTH = 0.35;  // max skew/translate multiplier

    // Collect elements that should jello
    const jelloSelectors = [
      '.skill-card', '.project-card', '.timeline-card',
      '.featured-project', '.project-description',
      '.section-heading', '.hero-content', '.contact-content',
      '.about-text', '.about-image', '.experience-tabs',
      '.tab-panel'
    ];
    const jellos = document.querySelectorAll(jelloSelectors.join(','));
    jellos.forEach(el => el.classList.add('jello-element'));

    // Per-element spring state
    const state = new Map();
    jellos.forEach(el => state.set(el, { y: 0, vy: 0 }));

    let prevScroll = window.scrollY;
    let scrollDelta = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      const now = window.scrollY;
      scrollDelta = now - prevScroll;
      prevScroll = now;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(tick);
      }
    }, { passive: true });

    function tick() {
      let anyMoving = false;

      jellos.forEach(el => {
        const s = state.get(el);
        // Push by scroll delta
        s.vy += scrollDelta * STRENGTH;
        // Spring back toward 0
        s.vy += -SPRING * s.y;
        // Dampen
        s.vy *= DAMPING;
        s.y += s.vy;

        // Clamp to avoid wild values
        if (Math.abs(s.y) > 30) s.y = 30 * Math.sign(s.y);

        const skew = s.y * 0.06;   // subtle skew
        const ty   = s.y * 0.4;    // subtle translateY offset
        const sc   = 1 + Math.abs(s.y) * 0.0008; // micro scale squish

        el.style.transform = `translateY(${ty}px) skewY(${skew}deg) scaleY(${1/sc}) scaleX(${sc})`;

        if (Math.abs(s.vy) > 0.05 || Math.abs(s.y) > 0.05) {
          anyMoving = true;
        } else {
          s.y = 0;
          s.vy = 0;
          el.style.transform = '';
        }
      });

      scrollDelta = 0; // consume delta

      if (anyMoving) {
        requestAnimationFrame(tick);
      } else {
        ticking = false;
      }
    }
  })();

  // ─── Universal Image Tilt ───
  (function initImageTilt() {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const images = document.querySelectorAll('.image-wrapper img, .project-image img');

    images.forEach(img => {
      img.classList.add('tilt-image');
      const container = img.closest('.image-wrapper') || img.closest('.project-image');
      if (!container) return;

      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rotX = ((y - cy) / cy) * -8;   // tilt up to 8°
        const rotY = ((x - cx) / cx) * 8;
        const shine = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;

        img.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
        img.style.backgroundPosition = shine; // for potential shine overlay
      });

      container.addEventListener('mouseleave', () => {
        img.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        img.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
        setTimeout(() => { img.style.transition = 'transform 0.15s ease-out'; }, 500);
      });
    });
  })();

  // ─── Year in Footer ───
  const yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ─── Console Easter Egg ───
  console.log(
    '%c🛡️ Felipe\'s Portfolio',
    'color: #06b6d4; font-size: 20px; font-weight: bold;'
  );
  console.log(
    '%cBuilt with passion & vanilla code. No frameworks harmed in the making of this site.',
    'color: #94a3b8; font-size: 12px;'
  );
})();
