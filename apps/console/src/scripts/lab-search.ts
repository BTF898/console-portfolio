/* Lab search: filters .lab-item cards against the query as you type and
   keeps the "n of m" counter honest. */

const input = document.querySelector<HTMLInputElement>('.lab-search');
const grid = document.querySelector<HTMLElement>('.lab-grid');
const count = document.querySelector<HTMLElement>('.lab-count');
const empty = document.querySelector<HTMLElement>('.lab-empty');

if (input && grid) {
  const items = Array.from(grid.querySelectorAll<HTMLElement>('.lab-item'));
  const total = items.length;

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;

    for (const item of items) {
      const haystack = (
        item.querySelector('.lab-name')?.textContent +
        ' ' +
        item.querySelector('.lab-note')?.textContent
      )
        .toLowerCase()
        .trim();
      const match = q === '' || haystack.includes(q);
      item.hidden = !match;
      if (match) shown++;
    }

    if (count) count.textContent = `${shown} / ${total}`;
    if (empty) empty.hidden = shown > 0;
    grid.hidden = shown === 0;
  };

  input.addEventListener('input', apply);
}
