/* Self-typing console. The script (commands + output) is inlined in the
   component as JSON; this module plays it back like a live terminal.

   Behavior:
   - types each command character by character, then prints output lines
   - pauses while the tab is hidden or the console is off-screen
   - renders everything instantly under prefers-reduced-motion
   - the animated layer is aria-hidden; a static copy is server-rendered
     for screen readers and no-JS visitors. */

interface Step {
  cmd: string;
  out: string[];
}

interface TerminalData {
  user: string;
  host: string;
  path: string;
  steps: Step[];
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function mount(root: HTMLElement, data: TerminalData) {
  const live = root.querySelector<HTMLElement>('.t-live');
  if (!live) return;

  const prompt = (path = true) => {
    const p = document.createElement('span');
    p.className = 't-prompt';
    p.textContent = `${data.user}@${data.host}`;
    const sep = document.createElement('span');
    sep.className = 't-dim';
    sep.textContent = ':';
    const pa = document.createElement('span');
    pa.className = 't-path';
    pa.textContent = data.path;
    const dollar = document.createElement('span');
    dollar.className = 't-dim';
    dollar.textContent = '$ ';
    const wrap = document.createElement('span');
    wrap.append(p, sep, pa, dollar);
    return wrap;
  };

  const line = () => {
    const l = document.createElement('div');
    l.className = 't-line';
    return l;
  };

  const out = (text: string) => {
    const l = line();
    l.className = 't-line t-out';
    l.textContent = text;
    return l;
  };

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  /* Wait while the page is hidden or the console is scrolled away. */
  let visible = false;
  const io = new IntersectionObserver((es) => {
    visible = es[0]?.isIntersecting ?? false;
  });
  io.observe(root);

  async function gate() {
    while (document.hidden || !visible) await sleep(300);
  }

  async function typeCommand(cmd: string) {
    const l = line();
    l.append(prompt());
    const span = document.createElement('span');
    span.className = 't-cmd';
    l.append(span);
    live!.append(l);

    for (const ch of cmd) {
      span.textContent += ch;
      await sleep(34 + Math.random() * 60);
    }
    await sleep(260);
  }

  async function loop() {
    if (reduced) {
      /* Instant render: every step, no caret, no timers. */
      for (const step of data.steps) {
        const l = line();
        l.append(prompt(), Object.assign(document.createElement('span'), { className: 't-cmd', textContent: step.cmd }));
        live!.append(l);
        step.out.forEach((o) => live!.append(out(o)));
      }
      document.dispatchEvent(new CustomEvent('console:achieve', { detail: 'terminal' }));
      return;
    }

    /* The caret is one persistent node — append() moves it to the end,
       so the loop explicitly parks it on its own line after each step. */
    const caretLine = line();
    caretLine.append(prompt(), Object.assign(document.createElement('span'), { className: 't-caret' }));

    for (;;) {
      for (const step of data.steps) {
        await gate();
        await typeCommand(step.cmd);
        for (const o of step.out) {
          await sleep(140 + Math.random() * 120);
          live!.append(out(o));
        }
        await sleep(1500 + Math.random() * 900);
      }
      document.dispatchEvent(new CustomEvent('console:achieve', { detail: 'terminal' }));
      await sleep(2600);
      live!.replaceChildren(); // loop the script
      live!.append(caretLine);
    }
  }

  void loop();
}

document.querySelectorAll<HTMLElement>('.term[data-terminal]').forEach((el) => {
  try {
    mount(el, JSON.parse(el.dataset.terminal!) as TerminalData);
  } catch {
    /* malformed inline JSON — leave the static copy in place */
  }
});
