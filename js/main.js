/* =============================================
   LEELOU BISTROT — JavaScript principal
   ============================================= */

// ---------- INDICATEUR OUVERT / FERMÉ ----------
(function() {
  const now  = new Date();
  const day  = now.getDay(); // 0=dim, 1=lun, 2=mar, 3=mer, 4=jeu, 5=ven, 6=sam
  const h    = now.getHours() + now.getMinutes() / 60;

  const horaires = {
    0: { open: 9,  close: 15 },  // dimanche
    1: null,                      // lundi fermé
    2: { open: 10, close: 18 },  // mardi
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

// ---------- CARROUSEL GALERIE MOBILE ----------
(function() {
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !dotsContainer) return;

  const slides = track.querySelectorAll('.carousel-slide');
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Photo ' + (i + 1));
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  track.addEventListener('scroll', () => {
    const idx = Math.round(track.scrollLeft / track.offsetWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }, { passive: true });
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
  header.style.boxShadow = window.scrollY > 40
    ? '0 2px 16px rgba(0,0,0,0.10)'
    : 'none';
});

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
  '#apropos, #menu, #galerie, #horaires, #contact, .horaires-card, .menu-category, .galerie-item, .contact-item'
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
