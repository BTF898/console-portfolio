/* Magnetic hover: buttons with .magnetic lean toward the cursor.
   Desktop pointers only; resets with the house expo-out easing. */

const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (fine && !reduced) {
  const STRENGTH = 0.22;

  document.querySelectorAll<HTMLElement>('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}
