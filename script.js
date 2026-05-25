// ===== REVEAL ON SCROLL =====
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 70);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

// ===== ACTIVE NAV =====
function initNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // Hamburger con animación
  const burger = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      // Animate spans
      const spans = burger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    document.addEventListener('click', e => {
      if (!burger.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 24px rgba(0,0,0,0.22)'
        : '0 2px 20px rgba(0,0,0,0.18)';
    }, { passive: true });
  }
}

// ===== ACCORDION =====
function initAccordion() {
  document.querySelectorAll('.acc-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('open');
      // Close all
      document.querySelectorAll('.acc-header').forEach(h => {
        h.classList.remove('open');
        if (h.nextElementSibling) h.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        header.classList.add('open');
        body.classList.add('open');
        // Smooth scroll to make sure it's visible
        setTimeout(() => header.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      }
    });
  });
}

// ===== TOAST =====
function showToast(msg = '¡Copiado al portapapeles!', type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  toast.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
  toast.style.background = type === 'success' ? 'var(--success)' : 'var(--danger)';
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== COPY TO CLIPBOARD =====
function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('¡Copiado al portapapeles!'))
      .catch(() => copyFallback(text));
  } else {
    copyFallback(text);
  }
}

function copyFallback(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('¡Copiado al portapapeles!');
  } catch {
    showToast('No se pudo copiar', 'error');
  }
  document.body.removeChild(ta);
}

// ===== FORMAT DATE =====
function formatDate(val) {
  if (!val) return '';
  const [y, m, d] = val.split('-');
  return `${d}/${m}/${y}`;
}

// ===== KEYBOARD ACCESSIBILITY =====
function initA11y() {
  // Skip link
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
  });
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initNav();
  initAccordion();
  initA11y();
});
