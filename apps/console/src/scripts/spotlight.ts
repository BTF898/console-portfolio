/* Spotlight cards: .spot elements get --mx/--my custom properties that a
   radial-gradient in components.css turns into a cursor-tracked glow. */

const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (fine) {
  document.querySelectorAll<HTMLElement>('.spot').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}
