/* =============================================
   LEELOU BISTROT — JavaScript principal
   ============================================= */

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

// ---------- NAV MOBILE ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Fermer le menu au clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- HEADER SCROLL ----------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 40
    ? '0 2px 16px rgba(0,0,0,0.10)'
    : 'none';
});

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
