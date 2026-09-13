/* Experience timeline: fills the vertical rail as the reader scrolls and
   marks entries "done" once their card passes the viewport center. */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const wrap = document.querySelector<HTMLElement>('.xp-wrap');
const fill = document.querySelector<HTMLElement>('.xp-rail-fill');

if (wrap && fill && !reduced) {
  const items = Array.from(wrap.querySelectorAll<HTMLElement>('.xp-item'));
  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = wrap.getBoundingClientRect();
    const center = window.innerHeight * 0.55;
    const progress = Math.min(1, Math.max(0, (center - rect.top) / rect.height));
    fill.style.height = `${progress * 100}%`;

    for (const item of items) {
      const r = item.getBoundingClientRect();
      item.classList.toggle('is-done', r.top + 20 < center);
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
