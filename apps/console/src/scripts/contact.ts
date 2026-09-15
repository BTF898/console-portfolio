/* Contact form: posts to the endpoint from SITE.contact.formEndpoint
   (Formspree/Web3Forms/Basin all accept a plain POST) and reports through
   the toast system. Validation is native HTML5 + a gentle inline error. */

const form = document.querySelector<HTMLFormElement>('.compose');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const error = form.querySelector<HTMLElement>('.field-error');
    const submit = form.querySelector<HTMLButtonElement>('.compose-submit');
    const data = new FormData(form);

    if (!String(data.get('email') ?? '').includes('@')) {
      if (error) error.textContent = 'That email address looks off.';
      return;
    }
    if (error) error.textContent = '';

    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending…';
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      document.dispatchEvent(
        new CustomEvent('console:toast', {
          detail: res.ok ? 'Message sent — thank you!' : 'Could not send. Email me directly?',
        }),
      );
      if (res.ok) form.reset();
    } catch {
      document.dispatchEvent(
        new CustomEvent('console:toast', { detail: 'Network hiccup — email me directly?' }),
      );
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = 'Send message';
      }
    }
  });
}
