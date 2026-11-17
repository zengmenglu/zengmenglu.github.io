'use strict';

const sectionStateKey = 'dream-space:home-return';
const home = document.body.classList.contains('home');
const strips = [...document.querySelectorAll('.strip')];

for (const strip of strips) {
  const buttons = [...document.querySelectorAll(`[aria-controls="${strip.id}"]`)];
  const sync = () => {
    const last = strip.scrollWidth - strip.clientWidth;
    for (const button of buttons) {
      button.disabled = Number(button.dataset.move) < 0
        ? strip.scrollLeft < 2
        : strip.scrollLeft >= last - 2;
    }
  };
  const scroll = direction => {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const firstBook = strip.querySelector('.book');
    const gap = parseFloat(getComputedStyle(strip).gap) || 0;
    strip.scrollBy({
      left: direction * ((firstBook?.getBoundingClientRect().width || 150) + gap),
      behavior: reducedMotion ? 'instant' : 'smooth'
    });
  };
  for (const button of buttons) {
    button.addEventListener('click', () => scroll(Number(button.dataset.move)));
  }
  strip.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    scroll(event.key === 'ArrowLeft' ? -1 : 1);
  });
  strip.addEventListener('scroll', sync, { passive: true });
  new ResizeObserver(sync).observe(strip);
  sync();
}

if (home) {
  document.addEventListener('click', event => {
    const book = event.target.closest('a.book');
    if (!book || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const offsets = Object.fromEntries(strips.map(strip => [strip.id, strip.scrollLeft]));
    try {
      sessionStorage.setItem(sectionStateKey, JSON.stringify({ id: book.id, offsets, y: window.scrollY }));
    } catch {}
  });

  window.addEventListener('pageshow', event => {
    const hash = new URL(window.location.href).hash.slice(1);
    const isBack = event.persisted
      || performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
    if (!hash && !isBack) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(sectionStateKey));
      if (!saved || (hash && saved.id !== hash)) return;
      requestAnimationFrame(() => {
        for (const strip of strips) {
          if (Object.hasOwn(saved.offsets, strip.id)) {
            strip.scrollTo({ left: saved.offsets[strip.id], behavior: 'instant' });
          }
        }
        window.scrollTo({ top: saved.y, behavior: 'instant' });
      });
    } catch {}
  });
}
