/* Rotating headline: cycles the words inside .rotator (from SITE.roles).
   Server-renders the first word; this script slides the rest through. */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const window2 = document.querySelector<HTMLElement>('.rotator-window');
const words = window2?.querySelectorAll<HTMLElement>('.rotator-word');

if (window2 && words && words.length > 1 && !reduced) {
  let index = 0;

  setInterval(() => {
    index = (index + 1) % words.length;
    window2.style.translate = `0 ${-index * 1.4}em`;
  }, 2600);
}
