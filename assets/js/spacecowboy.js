// Country J — Space Cowboy interactions (Bootstrap 5 + vanilla JS)
document.addEventListener('DOMContentLoaded', () => {
  // Active nav link
  const navLinks = document.querySelectorAll('.navbar .nav-link[href]');
  const current = (window.location.pathname || '').split('/').pop() || 'index.html';
  navLinks.forEach((a) => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    const isActive = href === current;
    a.classList.toggle('active', isActive);
    if (isActive) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  // Reveal on scroll
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.sc-card, .sc-section-title, .sc-hero-frame');
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // Simple hero parallax (background position)
  const heroBg = document.querySelector('.sc-hero-bg');
  if (heroBg && !prefersReducedMotion) {
    const onScroll = () => {
      const y = Math.min(80, Math.max(10, 40 + window.scrollY * 0.04));
      heroBg.style.backgroundPosition = `center ${y}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});

