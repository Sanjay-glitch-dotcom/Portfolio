function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html') ||
        (path === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// === NAV TOGGLE ===
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.querySelectorAll('span').forEach((s, i) => {
      if (links.classList.contains('open')) {
        if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        s.style.transform = ''; s.style.opacity = '';
      }
    });
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// === PARTICLE BACKGROUND ===
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const count = Math.min(80, Math.floor(window.innerWidth / 18));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 6;
      ctx.fill();

      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// === TYPING ANIMATION ===
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const texts = el.getAttribute('data-texts').split('|');
  let ti = 0, ci = 0, deleting = false;

  function type() {
    const current = texts[ti];
    if (!deleting) {
      el.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        ti = (ti + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
}

// === SCROLL FADE IN ===
function initScrollFade() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// === XP BAR ANIMATION ===
function initXpBar() {
  const fill = document.querySelector('.xp-fill');
  if (!fill) return;
  const target = fill.getAttribute('data-width') || '72';
  setTimeout(() => { fill.style.width = target + '%'; }, 300);
}

// === SKILL BARS ===
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(cat => observer.observe(cat));
}

// === COUNTER ANIMATION ===
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = Math.ceil(target / 50);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 40);
}

function initCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, parseInt(el.getAttribute('data-counter')), el.getAttribute('data-suffix') || '');
        observer.unobserve(el);
      }
    });
    observer.observe(el);
  });
}

// === MODAL SYSTEM ===
function initModals() {
  const overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;
  const closeBtn = overlay.querySelector('.modal-close');

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-modal');
      const content = document.getElementById(targetId);
      if (!content) return;
      overlay.querySelector('.modal-body').innerHTML = content.innerHTML;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// === CERT MODAL ===
function initCertModal() {
  const overlay = document.getElementById('cert-modal');
  if (!overlay) return;

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.getAttribute('data-cert-name');
      const issuer = card.getAttribute('data-cert-issuer');
      const date = card.getAttribute('data-cert-date');
      const img = card.getAttribute('data-cert-img');
      const link = card.getAttribute('data-cert-link');
      const download = card.getAttribute('data-cert-download');

      overlay.querySelector('.modal-cert-info h3').textContent = name;
      overlay.querySelector('.modal-cert-info .cert-issuer-text').textContent = issuer;
      overlay.querySelector('.modal-cert-info .cert-date-text').textContent = date;

      const imgEl = overlay.querySelector('.modal-cert-img');
      if (img) { 
        imgEl.src = img; 
        imgEl.style.display = 'block'; 
      } else { 
        imgEl.style.display = 'none'; 
      }

      const linkEl = overlay.querySelector('.modal-cert-link');
      if (link && link !== '#') { 
        linkEl.href = link; 
        linkEl.style.display = 'inline-flex'; 
      } else { 
        linkEl.style.display = 'none'; 
      }

      const viewEl = overlay.querySelector('.modal-cert-view');
      if (download && download !== '#') { 
        viewEl.href = download; 
        viewEl.style.display = 'inline-flex'; 
      } else { 
        viewEl.style.display = 'none'; 
      }

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  overlay.querySelector('.modal-close').addEventListener('click', () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// === CONTACT FORM ===
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      status.textContent = '⚠ All fields required, Hunter.';
      status.className = 'form-status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = '⚠ Invalid email address.';
      status.className = 'form-status error';
      return;
    }

    status.textContent = '✓ Message transmitted. I will respond shortly.';
    status.className = 'form-status success';
    form.reset();
    setTimeout(() => { status.className = 'form-status'; }, 5000);
  });
}

// === CURSOR GLOW ===
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position:fixed;width:20px;height:20px;border-radius:50%;
    background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.5);
    pointer-events:none;z-index:99999;transform:translate(-50%,-50%);
    transition:width 0.2s,height 0.2s,opacity 0.2s;
    box-shadow:0 0 10px rgba(0,212,255,0.4);
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a,button,.btn,.cert-card,.project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '40px'; cursor.style.height = '40px';
      cursor.style.background = 'rgba(0,212,255,0.1)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px'; cursor.style.height = '20px';
      cursor.style.background = 'rgba(0,212,255,0.15)';
    });
  });
}

// === INIT ALL ===
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initNavToggle();
  initParticles();
  initTyping();
  initScrollFade();
  initXpBar();
  initSkillBars();
  initCounters();
  initModals();
  initCertModal();
  initContactForm();
  initCursorGlow();
});
