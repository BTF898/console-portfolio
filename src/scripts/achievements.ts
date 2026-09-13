/* Exploration achievements — the little reward loop that makes visitors
   actually look around. Definitions live in src/config/achievements.ts.

   How it works:
   - progress persists in localStorage (`console-achievements`) per browser
   - an unlock fires a toast and fills a cell in the footer meter
   - detectors either live here (scroll, boot, konami) or other islands
     dispatch `console:achieve` with the achievement id */

import { ACHIEVEMENTS } from '../config/achievements';

const KEY = 'console-achievements';
const META = new Set(['all']); // unlocks itself when every other one is done

const ids = ACHIEVEMENTS.map((a) => a.id);
const cells = new Map<string, HTMLElement>();
document.querySelectorAll<HTMLElement>('[data-ach]').forEach((el) => {
  const id = el.dataset.ach!;
  if (ids.includes(id)) cells.set(id, el);
});
const counter = document.querySelector<HTMLElement>('[data-ach-count]');

function load(): Set<string> {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return new Set(Array.isArray(saved) ? saved.filter((id) => ids.includes(id)) : []);
  } catch {
    return new Set();
  }
}

const done = load();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...done]));
  } catch {
    /* private mode — session-only progress is fine */
  }
}

function refresh() {
  for (const [id, cell] of cells) cell.classList.toggle('is-unlocked', done.has(id));
  if (counter) counter.textContent = `${done.size}/${ACHIEVEMENTS.length}`;
}

function toast(text: string) {
  document.dispatchEvent(new CustomEvent('console:toast', { detail: text }));
}

function unlock(id: string) {
  const meta = ACHIEVEMENTS.find((a) => a.id === id);
  if (!meta || done.has(id)) return;

  done.add(id);
  save();
  refresh();
  toast(`Achievement unlocked — ${meta.label}`);

  /* Completionist: everything except the meta achievement itself. */
  if (ids.filter((i) => !META.has(i)).every((i) => done.has(i))) {
    setTimeout(() => unlock('all'), 1200); // let the previous toast breathe
  }
}

refresh();

/* Other islands announce their triggers; anything unknown is ignored. */
document.addEventListener('console:achieve', (e) => unlock(String((e as CustomEvent).detail)));

/* --- boot: welcome + proof the system exists --- */
setTimeout(() => unlock('boot'), 900);

/* --- tour: every <section> of the page has been on screen --- */
const sections = Array.from(document.querySelectorAll<HTMLElement>('main section'));
const seen = new Set<HTMLElement>();
if (sections.length > 0) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        seen.add(entry.target as HTMLElement);
        if (seen.size === sections.length) {
          io.disconnect();
          unlock('tour');
        }
      }
    },
    { rootMargin: '0px 0px -15% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}

/* --- depth: the footer itself is on screen --- */
const footer = document.querySelector<HTMLElement>('.site-footer');
if (footer) {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        unlock('depth');
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  io.observe(footer);
}

/* --- theme: any toggle path dispatches the same event (chrome.ts) --- */
document.addEventListener('console:toggle-theme', () => unlock('theme'));

/* --- search: the lab filter was used --- */
document.querySelector<HTMLInputElement>('.lab-search')?.addEventListener('input', (e) => {
  if ((e.target as HTMLInputElement).value.trim() !== '') unlock('search');
});

/* --- konami code --- */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let ki = 0;
document.addEventListener('keydown', (e) => {
  const expected = KONAMI[ki];
  const got = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  ki = got === expected ? ki + 1 : got === KONAMI[0] ? 1 : 0;
  if (ki === KONAMI.length) unlock('konami');
});
