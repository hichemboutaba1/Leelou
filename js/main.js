/* =============================================
   LEELOU BISTROT — JavaScript principal
   ============================================= */

// ---------- RGPD — CONSENTEMENT COOKIES ----------
(function() {
  const banner  = document.getElementById('cookie-banner');
  if (!banner) return;

  function loadMap() {
    document.querySelectorAll('.map-placeholder').forEach(placeholder => {
      const src = placeholder.dataset.src;
      if (!src) return;
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.width = '100%';
      iframe.height = '350';
      iframe.style.cssText = 'border:0;border-radius:var(--radius);';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.title = 'Leelou — 9 rue Gambetta, Sète';
      placeholder.replaceWith(iframe);
    });
  }

  const consent = localStorage.getItem('cookie-consent');
  if (consent === 'accepted') { loadMap(); return; }
  if (consent === 'refused')  { return; }

  // Première visite : afficher le bandeau
  setTimeout(() => banner.classList.add('visible'), 600);

  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    banner.classList.remove('visible');
    loadMap();
  });
  document.getElementById('cookie-refuse').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'refused');
    banner.classList.remove('visible');
  });

  // Bouton "Afficher la carte" dans le placeholder
  document.querySelectorAll('.btn-map-load').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      banner.classList.remove('visible');
      loadMap();
    });
  });
})();

// ---------- PROCHAIN BRUNCH (dernier dimanche du mois) ----------
(function() {
  const el = document.getElementById('prochain-brunch-date');
  if (!el) return;

  function lastSundayOf(year, month) {
    const lastDay = new Date(year, month + 1, 0);
    const dayOfWeek = lastDay.getDay(); // 0 = Sunday
    return new Date(year, month, lastDay.getDate() - dayOfWeek);
  }

  const now   = new Date();
  let brunch  = lastSundayOf(now.getFullYear(), now.getMonth());
  if (now > brunch) {
    const nm = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
    const ny = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    brunch   = lastSundayOf(ny, nm);
  }

  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  el.textContent = 'Dimanche ' + brunch.getDate() + ' ' + months[brunch.getMonth()];
})();

// ---------- INDICATEUR OUVERT / FERMÉ ----------
(function() {
  const now  = new Date();
  const day  = now.getDay(); // 0=dim, 1=lun, 2=mar, 3=mer, 4=jeu, 5=ven, 6=sam
  const h    = now.getHours() + now.getMinutes() / 60;

  const horaires = {
    0: { open: 9,  close: 15 },  // dimanche
    1: null,                      // lundi fermé
    2: null,                      // mardi fermé
    3: { open: 10, close: 18 },  // mercredi
    4: { open: 10, close: 18 },  // jeudi
    5: { open: 10, close: 18 },  // vendredi
    6: { open: 9,  close: 18 },  // samedi
  };

  const badge = document.getElementById('status-badge');
  if (!badge) return;
  const today = horaires[day];
  if (today && h >= today.open && h < today.close) {
    badge.textContent = '● Ouvert';
    badge.classList.add('open');
  } else {
    badge.textContent = '● Fermé';
    badge.classList.add('closed');
  }
})();

// ---------- INLINE SVG LOGOS (pour que les polices Google Fonts fonctionnent) ----------
document.querySelectorAll('.logo-inline').forEach(async (el) => {
  try {
    const res = await fetch(el.dataset.src);
    const svgText = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (svg) {
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.width = '100%';
      svg.style.height = '100%';
      el.appendChild(svg);
    }
  } catch (e) {
    console.warn('Logo SVG non chargé', e);
  }
});

// ---------- NAV MOBILE + HAMBURGER ANIMÉ ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// ---------- HEADER SCROLL ----------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  header.style.boxShadow    = scrolled ? '0 2px 16px rgba(0,0,0,0.10)' : 'none';
  header.style.background   = scrolled ? 'rgba(250,247,245,0.98)' : 'rgba(250,247,245,0.95)';
  header.style.borderBottom = scrolled ? '1px solid #d4b8a0' : '1px solid #e8d8cc';
}, { passive: true });

// ---------- NAV ACTIVE AU SCROLL ----------
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ---------- BOUTON RETOUR EN HAUT ----------
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- MENU TABS ----------
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

// ---------- ANIMATIONS AU SCROLL ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '#apropos, #menu, #brunch, #galerie, #horaires, #contact, ' +
  '#ateliers, #cantine, #galerie-at, #horaires-at, #contact-at, ' +
  '.horaires-card, .menu-category, .galerie-item, .contact-item, ' +
  '.activite-card, .cantine-at-grid, .brunch-next-badge, .brunch-menu-col'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ---------- SMOOTH SCROLL (fallback navigateurs) ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

// ---------- GALERIE LIGHTBOX SIMPLE ----------
document.querySelectorAll('.galerie-item img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.9);
      display:flex;align-items:center;justify-content:center;cursor:zoom-out;
    `;
    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.alt = img.alt;
    bigImg.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,0.6);';
    overlay.appendChild(bigImg);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

// ---------- GALERIES — boucle infinie CSS (Atelier + Bistrot) ----------
document.querySelectorAll('.galerie-strip-at').forEach(strip => {
  const track = strip.querySelector('.gstrack');
  if (!track) return;

  Array.from(track.querySelectorAll('img')).forEach(img => {
    track.appendChild(img.cloneNode(true));
  });

  strip.addEventListener('touchstart', () => {
    strip.classList.add('touch-paused');
  }, { passive: true });
  strip.addEventListener('touchend', () => {
    setTimeout(() => strip.classList.remove('touch-paused'), 2000);
  }, { passive: true });
});
