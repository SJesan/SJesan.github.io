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
const navLinks = [...document.querySelectorAll('.nav-link')];

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 12);
};

window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

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
  const phrases = ['CSE Student', 'Web Developer', 'AI/ML Learner'];
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
