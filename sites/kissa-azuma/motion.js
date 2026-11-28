'use strict';

(() => {
  if (typeof window.IntersectionObserver !== 'function' ||
      typeof window.matchMedia !== 'function' ||
      typeof Element.prototype.animate !== 'function') return;

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) return;

  const active = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      if (preference.matches) continue;

      const effect = target.animate(
        [{ opacity: 0.78, transform: 'translateY(10px)' },
         { opacity: 1, transform: 'translateY(0)' }],
        { duration: 380, easing: 'cubic-bezier(.2,.7,.25,1)' }
      );
      active.add(effect);
      effect.onfinish = effect.oncancel = () => active.delete(effect);
    }
  }, { threshold: 0.22 });

  // Already visible text stays still. Without JS, no content is hidden.
  for (const item of document.querySelectorAll('[data-arrival]')) {
    if (item.getBoundingClientRect().top >= window.innerHeight) observer.observe(item);
  }
  preference.addEventListener?.('change', ({ matches }) => {
    if (!matches) return;
    observer.disconnect();
    for (const effect of active) effect.cancel();
    active.clear();
  });
})();
