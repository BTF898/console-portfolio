/* Scroll-reveal engine: elements with [data-reveal] animate in when they
   enter the viewport. Stagger siblings with data-reveal-delay="0..7". */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const els = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (reduced) {
  els.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );

  els.forEach((el) => {
    const delay = Number(el.dataset.revealDelay ?? '0');
    el.style.setProperty('--reveal-delay', `${delay * 70}ms`);
    io.observe(el);
  });
}
