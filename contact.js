/* Strider contact form.
   Posts to the application, because this site is static hosting and cannot
   take a POST itself. The endpoint accepts this origin only; see
   CONTACT_ORIGINS in app.py. Nothing is stored — the message is emailed. */
(() => {
  const ENDPOINT = 'https://app.getstrider.co.uk/contact';

  function formMarkup() {
    return `<form class="contact-form" novalidate>
      <label>Your name (optional)<input name="name" autocomplete="name" maxlength="100"></label>
      <label>Your email address<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"></label>
      <label>Subject<input name="subject" required maxlength="150"></label>
      <label>Your message<textarea name="message" required maxlength="5000" rows="5"></textarea></label>
      <p class="contact-note">We’ll use your email address to reply. <a href="privacy-policy.html">Privacy policy</a>.</p>
      <button class="contact-submit" type="submit">Send message</button>
      <p class="contact-result" role="status" aria-live="polite"></p>
    </form>`;
  }

  function prepare(container, subject) {
    container.innerHTML = formMarkup();
    const form = container.querySelector('form');
    const result = form.querySelector('.contact-result');
    const button = form.querySelector('.contact-submit');
    if (subject) form.elements.subject.value = subject;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = form.elements.email.value.trim();
      const subjectValue = form.elements.subject.value.trim();
      const message = form.elements.message.value.trim();

      if (!email || !email.includes('@') || email.includes(' ')) {
        result.textContent = 'Please check your email address.';
        return;
      }
      if (!subjectValue || !message) {
        result.textContent = 'Please fill in every box.';
        return;
      }

      button.disabled = true;
      result.textContent = 'Sending…';
      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.elements.name.value.trim(),
            email, subject: subjectValue, message
          })
        });
        const data = await response.json().catch(() => ({}));
        result.textContent = data.message
          || (response.ok ? 'Thank you — your message is on its way.'
                          : 'Sorry, that did not send. Please email hello@getstrider.co.uk instead.');
        if (response.ok) form.reset();
      } catch (error) {
        result.textContent = 'Sorry, that did not send. Please email hello@getstrider.co.uk instead.';
      } finally {
        button.disabled = false;
      }
    });
    return form;
  }

  const page = document.getElementById('contact-page-form');
  if (page) prepare(page, new URLSearchParams(location.search).get('subject'));

  const dialog = document.createElement('dialog');
  dialog.className = 'contact-dialog';
  dialog.setAttribute('aria-labelledby', 'contact-dialog-title');
  dialog.innerHTML = '<button type="button" class="contact-close" aria-label="Close contact form">×</button>'
    + '<h2 id="contact-dialog-title">Contact Strider</h2>'
    + '<p>Leave your details and we’ll get back to you.</p>'
    + '<div class="contact-form-host"></div>';
  document.body.append(dialog);
  dialog.querySelector('.contact-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => dialog.querySelector('.contact-form-host').replaceChildren());

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('/contact.html')) return;
    event.preventDefault();
    prepare(dialog.querySelector('.contact-form-host'), url.searchParams.get('subject'));
    dialog.showModal();
  });
})();
