// Progressive enhancement for the contact form: JSON POST to /api/contact.
const form = document.querySelector<HTMLFormElement>('form[data-contact]');

if (form) {
  const renderedAt = Date.now();
  const status = form.querySelector<HTMLParagraphElement>('.form-status');

  const setStatus = (text: string, kind: 'ok' | 'err') => {
    if (status) {
      status.textContent = text;
      status.className = `form-status ${kind}`;
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
      elapsed: Date.now() - renderedAt,
    };

    setStatus('Sending…', 'ok');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const out = (await res.json()) as { ok?: boolean; error?: string };

      if (res.ok && out.ok) {
        setStatus('Message sent — thank you. I usually reply within two days.', 'ok');
        form.reset();
      } else {
        setStatus(out.error ?? 'Something went wrong — please email me directly.', 'err');
      }
    } catch {
      setStatus('Network error — please email me directly.', 'err');
    }
  });
}
