/* Page chrome: scrolled header state, scroll-progress bar, mobile menu,
   current-section highlighting in the nav, and theme persistence. */

const nav = document.querySelector<HTMLElement>('.nav');
const progress = document.querySelector<HTMLElement>('.nav-progress');
const toggle = document.querySelector<HTMLElement>('.nav-toggle');
const menu = document.querySelector<HTMLElement>('.mobile-menu');

function setMenu(open: boolean) {
  menu?.classList.toggle('is-open', open);
  toggle?.setAttribute('aria-expanded', String(open));
}

/* --- scrolled state + progress --- */
let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const y = window.scrollY;
    nav?.classList.toggle('is-scrolled', y > 12);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.scale = `${max > 0 ? y / max : 0} 1`;
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* --- mobile menu --- */
toggle?.addEventListener('click', () => {
  setMenu(!menu?.classList.contains('is-open'));
});

menu?.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => setMenu(false)),
);

/* --- current section in nav --- */
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-link[href^="#"]'));
const sections = links
  .map((a) => document.querySelector<HTMLElement>(a.hash))
  .filter((s): s is HTMLElement => s !== null);

if (sections.length > 0) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a) =>
          a.classList.toggle('is-current', a.hash === `#${entry.target.id}`),
        );
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}

/* --- theme: mode toggle + persistence (preset comes from the server) --- */
const MODE_KEY = 'console-mode';

function applyMode(mode: string) {
  document.documentElement.dataset.mode = mode;
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* private mode — fine */
  }
}

document.addEventListener('console:toggle-theme', () => {
  applyMode(document.documentElement.dataset.mode === 'light' ? 'dark' : 'light');
});

document.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach((btn) =>
  btn.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('console:toggle-theme'));
  }),
);

/* --- toasts --- */
const region = document.querySelector<HTMLElement>('.toast-region');

document.addEventListener('console:toast', (e) => {
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = String((e as CustomEvent).detail ?? '');
  region.append(toast);
  requestAnimationFrame(() => toast.classList.add('is-show'));
  setTimeout(() => {
    toast.classList.remove('is-show');
    setTimeout(() => toast.remove(), 400);
  }, 2400);
});
