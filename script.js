const body = document.body;
const toggleButton = document.querySelector('.theme-toggle');
const toggleIcon = document.querySelector('.toggle-icon');
const yearSpan = document.getElementById('year');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  body.classList.add('dark');
  if (toggleIcon) toggleIcon.textContent = '🌙';
}

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (toggleIcon) {
      toggleIcon.textContent = isDark ? '🌙' : '☀️';
    }
  });
}

window.addEventListener('load', () => {
  window.setTimeout(() => {
    body.classList.add('loaded');
  }, 40);
});

const header = document.querySelector('.site-header');
const backToTop = document.querySelector('.back-to-top');
const navLinks = [...document.querySelectorAll('.nav-link')];

const updateHeaderState = () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 12);
  }
  if (backToTop) {
    const visible = window.scrollY > 420;
    backToTop.classList.toggle('visible', visible);
    backToTop.setAttribute('aria-hidden', String(!visible));
    backToTop.tabIndex = visible ? 0 : -1;
  }
};

window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  });
}

const copyEmailButton = document.querySelector('.copy-email');
if (copyEmailButton) {
  const copyStatus = copyEmailButton.querySelector('.copy-status');
  copyEmailButton.addEventListener('click', async () => {
    if (!navigator.clipboard || !copyStatus) {
      if (copyStatus) copyStatus.textContent = 'Clipboard unavailable';
      return;
    }

    try {
      await navigator.clipboard.writeText(copyEmailButton.dataset.email || '');
      copyStatus.textContent = 'Copied!';
      window.setTimeout(() => {
        copyStatus.textContent = '';
      }, 1800);
    } catch (error) {
      copyStatus.textContent = 'Copy failed';
      console.error('Unable to copy email address to clipboard.', error);
    }
  });
}

const sections = [...document.querySelectorAll('section[id]')];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isActive);
        });
      }
    });
  },
  {
    threshold: 0.4,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealElements = document.querySelectorAll('.reveal, .reveal-card, .reveal-section');
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 0.06, 0.36)}s`;
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const skillTags = document.querySelectorAll('.skill-tag');
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tag = entry.target;
          const delay = Number(tag.dataset.delay || 0);
          window.setTimeout(() => tag.classList.add('visible'), delay);
          skillObserver.unobserve(tag);
        }
      });
    },
    { threshold: 0.2 }
  );

  skillTags.forEach((tag, index) => {
    tag.dataset.delay = String(index * 70);
    skillObserver.observe(tag);
  });
} else {
  skillTags.forEach((tag) => tag.classList.add('visible'));
}

const typingText = document.querySelector('.typing-text');
if (typingText) {
  const phrases = ['Web Developer', 'AI/ML Learner', 'Researcher'];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    const currentPhrase = phrases[phraseIndex];

    if (!deleting) {
      charIndex += 1;
      typingText.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        deleting = true;
        window.setTimeout(typeLoop, 1200);
        return;
      }
    } else {
      charIndex -= 1;
      typingText.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const hero = document.querySelector('.hero');
    const particleCanvas = hero?.querySelector('.particle-canvas');
    const particleContext = particleCanvas?.getContext('2d');

    if (hero && particleCanvas && particleContext) {
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const pointer = { x: null, y: null };
      let particles = [];
      let width = 0;
      let height = 0;
      let pixelRatio = 1;
      let animationFrame = 0;
      let heroIsVisible = false;
      let slowMobileFrames = 0;
      let previousFrameTime = 0;
      const mobileQuery = window.matchMedia('(max-width: 640px)');

      const getAccentRgb = () => {
        const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim();
        const hex = accent.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (hex) {
          const value = hex[1].length === 3
            ? hex[1].split('').map((digit) => digit + digit).join('')
            : hex[1];
          return [
            Number.parseInt(value.slice(0, 2), 16),
            Number.parseInt(value.slice(2, 4), 16),
            Number.parseInt(value.slice(4, 6), 16),
          ];
        }

        const rgb = accent.match(/[\d.]+/g);
        return rgb ? rgb.slice(0, 3).map(Number) : [28, 122, 227];
      };

      const createParticles = () => {
        const count = mobileQuery.matches ? 25 : 60;
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
        }));
      };

      const resizeCanvas = () => {
        const bounds = hero.getBoundingClientRect();
        width = bounds.width;
        height = bounds.height;
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        particleCanvas.width = Math.round(width * pixelRatio);
        particleCanvas.height = Math.round(height * pixelRatio);
        particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        createParticles();
        drawParticles(false);
      };

      const drawParticles = (moveParticles) => {
        const [red, green, blue] = getAccentRgb();
        const maxDistance = mobileQuery.matches ? 86 : 118;
        const skipLines = mobileQuery.matches && slowMobileFrames > 8;

        particleContext.clearRect(0, 0, width, height);

        particles.forEach((particle, index) => {
          if (moveParticles) {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;

            if (pointer.x !== null && pointer.y !== null) {
              const dx = particle.x - pointer.x;
              const dy = particle.y - pointer.y;
              const distance = Math.hypot(dx, dy);
              if (distance > 0 && distance < 110) {
                const force = (110 - distance) / 110 * 0.002;
                particle.vx += dx / distance * force;
                particle.vy += dy / distance * force;
              }
            }

            particle.vx *= 0.999;
            particle.vy *= 0.999;
          }

          if (!skipLines) {
            for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
              const other = particles[otherIndex];
              const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
              if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.13;
                particleContext.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
                particleContext.lineWidth = 0.7;
                particleContext.beginPath();
                particleContext.moveTo(particle.x, particle.y);
                particleContext.lineTo(other.x, other.y);
                particleContext.stroke();
              }
            }
          }

          particleContext.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.32)`;
          particleContext.beginPath();
          particleContext.arc(particle.x, particle.y, 1.7, 0, Math.PI * 2);
          particleContext.fill();
        });
      };

      const stopAnimation = () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
        previousFrameTime = 0;
      };

      const animate = (time) => {
        animationFrame = 0;
        if (!heroIsVisible || document.hidden || reducedMotionQuery.matches) return;

        if (previousFrameTime && mobileQuery.matches) {
          const frameDuration = time - previousFrameTime;
          if (frameDuration > 28) {
            slowMobileFrames = Math.min(slowMobileFrames + 1, 20);
          } else {
            slowMobileFrames = Math.max(slowMobileFrames - 1, 0);
          }
        }
        previousFrameTime = time;
        drawParticles(true);
        animationFrame = requestAnimationFrame(animate);
      };

      const updateAnimation = () => {
        stopAnimation();
        if (reducedMotionQuery.matches) {
          drawParticles(false);
        } else if (heroIsVisible && !document.hidden) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      hero.addEventListener('pointermove', (event) => {
        const bounds = hero.getBoundingClientRect();
        pointer.x = event.clientX - bounds.left;
        pointer.y = event.clientY - bounds.top;
      });
      hero.addEventListener('pointerleave', () => {
        pointer.x = null;
        pointer.y = null;
      });

      document.addEventListener('visibilitychange', updateAnimation);
      window.addEventListener('resize', resizeCanvas);
      mobileQuery.addEventListener('change', resizeCanvas);
      reducedMotionQuery.addEventListener('change', updateAnimation);

      const heroObserver = new IntersectionObserver(([entry]) => {
        heroIsVisible = entry.isIntersecting;
        updateAnimation();
      });
      heroObserver.observe(hero);

      const themeObserver = new MutationObserver(() => {
        drawParticles(!reducedMotionQuery.matches && heroIsVisible && !document.hidden);
      });
      themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

      resizeCanvas();
    }

    const delay = deleting ? 42 : 90;
    window.setTimeout(typeLoop, delay);
  };

  if (prefersReducedMotion) {
    typingText.textContent = phrases[0];
  } else {
    typingText.textContent = '';
    window.setTimeout(typeLoop, 400);
  }
}
