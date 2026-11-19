// Mobile menu, contact form, donate button, visit and player counts, footer year.
(function () {
  const cfg = window.IG4U_CONFIG || {};

  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // No backend: open the visitor's email app with the message filled in.
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const subject = encodeURIComponent('Enquiry from ' + d.get('name') + ' (' + d.get('role') + ')');
    const body = encodeURIComponent(d.get('message') + '\n\n' + d.get('name') + '\n' + d.get('email'));
    window.location.href = 'mailto:intelligentgames4u@gmail.com?subject=' + subject + '&body=' + body;
    document.getElementById('form-note').textContent = 'Thank you! Your email app should open so you can send your message.';
  });

  // Donate button uses the Paystack link from config.js when one is set.
  if (cfg.donateLink) {
    const btn = document.getElementById('donate-btn');
    btn.href = cfg.donateLink;
    btn.target = '_blank';
    btn.rel = 'noopener';
  } else {
    document.getElementById('donate-note').textContent = 'Online donations are coming soon. Get in touch below to give today.';
  }

  // Counts (GoatCounter): visits to this page, and each game's player tally, which the game
  // itself adds to once per device. No cookies and no personal data.
  if (cfg.goatcounter) {
    const base = 'https://' + cfg.goatcounter + '.goatcounter.com';
    const gc = document.createElement('script');
    gc.async = true;
    gc.src = 'https://gc.zgo.at/count.js';   // skips localhost by itself
    gc.dataset.goatcounter = base + '/count';
    document.body.appendChild(gc);

    document.querySelectorAll('.players[data-game]').forEach((el) => {
      fetch(base + '/counter/' + encodeURIComponent('/' + el.dataset.game) + '.json')
        .then((r) => (r.status === 404 ? { count: 0 } : r.ok ? r.json() : null))   // 404 = nobody yet
        .then((d) => {
          if (!d) return;
          const n = typeof d.count === 'number' ? d.count : parseInt(String(d.count).replace(/[^0-9]/g, ''), 10) || 0;
          el.textContent = n > 0 ? '\u{1F465} ' + n.toLocaleString('en-NG') + (n === 1 ? ' player' : ' players') : '✨ New — be one of the first players';
          el.hidden = false;
        })
        .catch(() => { /* counter unavailable: keep it hidden */ });
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
