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
      '.tab-panel', '.beyond-card'
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

    const images = document.querySelectorAll('.image-wrapper img, .project-image img, .photo-card img');

    images.forEach(img => {
      img.classList.add('tilt-image');
      const container = img.closest('.image-wrapper') || img.closest('.project-image') || img.closest('.photo-card');
      if (!container) return;

      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) * 8;

        img.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      });

      container.addEventListener('mouseleave', () => {
        img.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        img.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
        setTimeout(() => { img.style.transition = 'transform 0.15s ease-out'; }, 500);
      });
    });
  })();

  // ─── Photo Stack (drag to cycle) ───
  (function initPhotoStack() {
    const stack = document.getElementById('photoStack');
    if (!stack) return;

    const cards = Array.from(stack.querySelectorAll('.photo-card'));
    if (cards.length === 0) return;

    let order = cards.map((_, i) => i); // indices in display order (0 = top)

    function applyPositions() {
      const rotations = [0, 3, -2];
      const scales    = [1, 0.95, 0.90];
      const offX      = [0, 8, -6];
      const offY      = [0, 8, 16];
      const opacities = [1, 0.7, 0.4];

      order.forEach((cardIdx, pos) => {
        const card = cards[cardIdx];
        card.setAttribute('data-position', pos);
        card.style.zIndex = cards.length - pos;
        if (!card.classList.contains('dragging')) {
          card.style.transform = `rotate(${rotations[pos] || 0}deg) scale(${scales[pos] || 0.85}) translateX(${offX[pos] || 0}px) translateY(${offY[pos] || 20}px)`;
          card.style.opacity = opacities[pos] !== undefined ? opacities[pos] : 0.3;
        }
      });
    }

    applyPositions();

    // Drag handling (mouse + touch)
    let dragging = null;
    let startX = 0;
    let currentX = 0;

    function onStart(e) {
      const card = e.target.closest('.photo-card');
      if (!card || card.getAttribute('data-position') !== '0') return; // only top card
      dragging = card;
      dragging.classList.add('dragging');
      startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      currentX = 0;
    }

    function onMove(e) {
      if (!dragging) return;
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      currentX = clientX - startX;
      const rotate = currentX * 0.08;
      const opacity = Math.max(0.5, 1 - Math.abs(currentX) / 400);
      dragging.style.transform = `translateX(${currentX}px) rotate(${rotate}deg) scale(1)`;
      dragging.style.opacity = opacity;
    }

    function onEnd() {
      if (!dragging) return;
      const threshold = 80;
      dragging.classList.remove('dragging');

      if (Math.abs(currentX) > threshold) {
        // Animate off-screen in drag direction, then send to back
        const direction = currentX > 0 ? 1 : -1;
        dragging.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
        dragging.style.transform = `translateX(${direction * 500}px) rotate(${direction * 20}deg) scale(0.8)`;
        dragging.style.opacity = '0';

        setTimeout(() => {
          // Cycle: move top card to back of order
          const topCardIdx = order.shift();
          order.push(topCardIdx);
          // Reset transition and apply new positions
          cards.forEach(c => { c.style.transition = ''; });
          applyPositions();
          // Re-enable smooth transition after a frame
          requestAnimationFrame(() => {
            cards.forEach(c => {
              c.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
            });
            applyPositions();
          });
        }, 350);
      } else {
        // Snap back
        dragging.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
        applyPositions();
        setTimeout(() => {
          cards.forEach(c => {
            c.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
          });
        }, 500);
      }

      dragging = null;
      currentX = 0;
    }

    stack.addEventListener('mousedown', onStart);
    stack.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  })();

  // ─── Year in Footer ───
  const yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ─── Footer Easter Egg ───
  (function initEasterEgg() {
    const credit = document.getElementById('footerCredit');
    if (!credit) return;

    const messages = [
      'Designed & Built by <strong>Felipe</strong>',
      '☕ Fuelled by caffeine & curiosity',
      '🎵 Coded to lo-fi beats',
      '🐧 btw, I use Arch',
      '🧠 No frameworks were harmed',
      '🎹 Piano breaks between commits',
      '⚽ git push origin main && go play soccer',
      '🔐 Encrypted with love',
    ];
    let msgIndex = 0;
    let clickCount = 0;

    function spawnConfetti() {
      const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];
      const count = 40;
      for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.top = `${-10 + Math.random() * 20}px`;
        piece.style.width = `${6 + Math.random() * 6}px`;
        piece.style.height = `${6 + Math.random() * 6}px`;
        piece.style.setProperty('--fall-duration', `${1.8 + Math.random() * 1.5}s`);
        piece.style.setProperty('--confetti-rot', `${360 + Math.random() * 720}deg`);
        piece.style.animationDelay = `${Math.random() * 0.4}s`;
        document.body.appendChild(piece);
        piece.addEventListener('animationend', () => piece.remove());
      }
    }

    credit.addEventListener('click', () => {
      clickCount++;
      msgIndex = clickCount % messages.length;
      credit.innerHTML = messages[msgIndex];

      // Confetti on every 3rd click
      if (clickCount % 3 === 0) {
        spawnConfetti();
      }

      // Special: barrel roll on 10th click
      if (clickCount === 10) {
        document.body.style.transition = 'transform 1s ease';
        document.body.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          document.body.style.transform = '';
          setTimeout(() => { document.body.style.transition = ''; }, 1000);
        }, 1000);
      }
    });
  })();

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
