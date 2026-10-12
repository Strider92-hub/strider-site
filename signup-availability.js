/* Public capacity status contains only availability, never member data. */
(() => {
  const banner = document.createElement('div');
  banner.setAttribute('role', 'status');
  banner.hidden = true;
  banner.style.cssText = 'padding:18px 24px;text-align:center;background:#f4ffcc;color:#21182b;font-weight:600';
  document.body.prepend(banner);
  const links = [...document.querySelectorAll('a[href]')].filter(a => {
    const url = new URL(a.href, location.href);
    return url.hash === '#get-started' || url.hostname === 'app.getstrider.co.uk' && ['/signup','/auth/google/start','/auth/facebook/start'].includes(url.pathname);
  });
  const original = links.map(a => ({a, href:a.getAttribute('href'), text:a.textContent, display:a.style.display}));
  const openBar = document.querySelector('.preview-bar');
  const check = async () => {
    try {
      const response = await fetch('https://app.getstrider.co.uk/api/signup-availability', {cache:'no-store', credentials:'omit'});
      const data = await response.json();
      if (typeof data.available !== 'boolean') return;
      banner.textContent = data.message || 'Signup is temporarily unavailable. Please try again later.';
      banner.hidden = data.available;
      if (openBar) openBar.hidden = !data.available;
      original.forEach(({a, href, display}) => {
        if (data.available) {a.setAttribute('href',href);a.style.display=display;}
        else {a.removeAttribute('href');a.style.display='none';}
      });
      document.querySelectorAll('.signup-card h2,.signup-card .card-kicker,.qs-terms').forEach(el => {el.hidden=!data.available;});
      let note = document.getElementById('signup-full-note');
      if (!note) {note=document.createElement('p');note.id='signup-full-note';document.querySelector('.signup-card')?.prepend(note);}
      note.textContent=data.message || 'Signup is temporarily unavailable. Please try again later.';
      note.hidden=data.available;
    } catch (_) { /* The authoritative server-side gate still checks every signup. */ }
  };
  check();
  setInterval(check, 60000);
})();
