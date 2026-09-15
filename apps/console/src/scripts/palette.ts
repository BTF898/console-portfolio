/* ⌘K command palette. Items are declared in CommandPalette.astro as plain
   DOM (so they are server-rendered and filterable) with data-action:

     <li class="cmdk-item" data-action="scroll:#projects">…   jump to section
     <li class="cmdk-item" data-action="link:https://…">…     open URL
     <li class="cmdk-item" data-action="copy:hello@…">…       copy to clipboard
     <li class="cmdk-item" data-action="theme">…              toggle color mode

   Keyboard: ⌘K / Ctrl-K opens, arrows move, Enter runs, Escape closes. */

const overlay = document.querySelector<HTMLElement>('.cmdk-overlay');
const input = overlay?.querySelector<HTMLInputElement>('.cmdk-input');
const list = overlay?.querySelector<HTMLElement>('.cmdk-list');
const empty = overlay?.querySelector<HTMLElement>('.cmdk-empty');
const items = Array.from(overlay?.querySelectorAll<HTMLLIElement>('.cmdk-item') ?? []);

let selected = 0;
let lastFocus: HTMLElement | null = null;

function visibleItems() {
  return items.filter((li) => !li.hidden);
}

function open() {
  if (!overlay) return;
  lastFocus = document.activeElement as HTMLElement;
  overlay.hidden = false;
  if (input) input.value = '';
  filter('');
  select(0);
  input?.focus();
  document.dispatchEvent(new CustomEvent('console:achieve', { detail: 'palette' }));
}

function close() {
  if (!overlay) return;
  overlay.hidden = true;
  lastFocus?.focus();
}

function filter(query: string) {
  const q = query.trim().toLowerCase();
  for (const li of items) {
    li.hidden = q !== '' && !(li.dataset.label ?? li.textContent ?? '').toLowerCase().includes(q);
  }
  const vis = visibleItems();
  if (empty) empty.hidden = vis.length > 0;
  select(vis.length > 0 ? 0 : -1);
}

function select(i: number) {
  selected = i;
  visibleItems().forEach((li, j) => li.setAttribute('aria-selected', String(j === i)));
  const current = visibleItems()[i];
  current?.scrollIntoView({ block: 'nearest' });
}

async function run(li: HTMLLIElement) {
  const [action, ...rest] = (li.dataset.action ?? '').split(':');
  const arg = rest.join(':');

  switch (action) {
    case 'scroll':
      document.querySelector(arg)?.scrollIntoView({ behavior: 'smooth' });
      close();
      break;
    case 'link':
      window.open(arg, '_blank', 'noopener');
      close();
      break;
    case 'copy':
      try {
        await navigator.clipboard.writeText(arg);
        document.dispatchEvent(new CustomEvent('console:toast', { detail: 'Copied to clipboard' }));
        document.dispatchEvent(new CustomEvent('console:achieve', { detail: 'copy' }));
      } catch {
        /* clipboard unavailable (http, permissions) — silently ignore */
      }
      close();
      break;
    case 'theme':
      document.dispatchEvent(new CustomEvent('console:toggle-theme'));
      close();
      break;
  }
}

/* --- wiring --- */

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    overlay?.hidden ? open() : close();
    return;
  }

  if (overlay?.hidden) return;

  if (e.key === 'Escape') close();

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const vis = visibleItems();
    select(vis.length ? (selected + 1) % vis.length : -1);
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    const vis = visibleItems();
    select(vis.length ? (selected - 1 + vis.length) % vis.length : -1);
  }

  if (e.key === 'Enter') {
    const current = visibleItems()[selected];
    if (current) {
      e.preventDefault();
      void run(current);
    }
  }
});

document.querySelectorAll<HTMLElement>('[data-cmdk-open]').forEach((btn) => {
  btn.addEventListener('click', open);
});

overlay?.addEventListener('click', (e) => {
  if (e.target === overlay) close();
});

items.forEach((li) => {
  li.addEventListener('click', () => void run(li));
  li.addEventListener('mousemove', () => select(visibleItems().indexOf(li)));
});

input?.addEventListener('input', () => filter(input.value));

/* Item labels live in data-label (exact text) so filtering ignores icons. */
items.forEach((li) => {
  if (!li.dataset.label) li.dataset.label = li.textContent?.trim() ?? '';
});
