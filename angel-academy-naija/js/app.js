// Angel Academy Naija: STEM Quest. Screens, progress, narration and the grown-ups area.
(function () {
  'use strict';

  const CFG = window.AAN_CONFIG || {};
  const KEY = 'aan.v1';
  const app = document.getElementById('app');
  const captions = document.getElementById('captions');
  let DATA = null;

  // ---------- storage (always guarded: private mode can throw) ----------
  const blank = () => ({
    profiles: {}, current: null,
    settings: { narrate: false, captions: true, dyslexic: false, big: false, contrast: false, calm: false, adult: false, deutero: false }
  });
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.profiles) return Object.assign(blank(), s, { settings: Object.assign(blank().settings, s.settings) }); } catch (e) { /* ignore */ }
    return blank();
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable: progress lasts this visit only */ } }
  const me = () => S.profiles[S.current] || null;

  function newProfile(name) {
    const id = 'p' + Date.now().toString(36);
    S.profiles[id] = { name: name.slice(0, 20), light: 0, lessons: 0, levels: {}, badges: [], halos: ['default'], halo: 'default', created: new Date().toISOString().slice(0, 10) };
    S.current = id; save();
  }

  // ---------- helpers ----------
  function h(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content; }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const realmOf = id => DATA.realms.find(r => r.id === id);
  const levelById = id => DATA.levels.find(l => l.id === id);
  const visibleLevels = () => DATA.levels.filter(l => S.settings.deutero || l.canon !== 'deuterocanonical');
  const today = () => new Date().toISOString().slice(0, 10);
  const activeEvent = () => (CFG.events || []).find(e => today() >= e.start && today() <= e.end) || null;

  function applySettings() {
    const c = document.documentElement.classList;
    ['dyslexic', 'big', 'contrast', 'calm'].forEach(k => c.toggle(k, !!S.settings[k]));
    const p = me();
    document.documentElement.dataset.halo = p ? p.halo : 'default';
    document.getElementById('lightPill').textContent = p ? `✦ ${p.light} Light · ${esc(p.name)}` : '';
    document.getElementById('publisherLine').textContent = CFG.publisherName ? `© ${new Date().getFullYear()} ${CFG.publisherName}` : '';
  }

  // ---------- narration + captions ----------
  function speak(text) {
    if (S.settings.captions) { captions.textContent = text; captions.hidden = false; }
    if (!('speechSynthesis' in window)) { setTimeout(() => (captions.hidden = true), 6000); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.onend = () => (captions.hidden = true);
    speechSynthesis.speak(u);
  }
  function stopSpeech() { if ('speechSynthesis' in window) speechSynthesis.cancel(); captions.hidden = true; }
  const readBtn = text => `<button class="btn ghost small" data-say="${esc(text)}">🔊 Read aloud</button>`;

  // ---------- art: an original, dignified messenger of light ----------
  function angelSVG() {
    const rays = Array.from({ length: 16 }, (_, i) => `<line x1="100" y1="100" x2="${100 + 95 * Math.cos(i * Math.PI / 8)}" y2="${100 + 95 * Math.sin(i * Math.PI / 8)}" />`).join('');
    return `<svg class="angel-art" viewBox="0 0 200 200" aria-hidden="true">
      <defs><radialGradient id="g1"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#f5dd84" stop-opacity=".6"/><stop offset="1" stop-color="#e6c84f" stop-opacity="0"/></radialGradient></defs>
      <g class="rays" stroke="#f5dd84" stroke-opacity=".35" stroke-width="2">${rays}</g>
      <circle class="glow" cx="100" cy="100" r="70" fill="url(#g1)"/>
      <path d="M100 70 C60 60 30 85 22 125 C50 110 70 108 92 112 Z" fill="#fffbe6" opacity=".85"/>
      <path d="M100 70 C140 60 170 85 178 125 C150 110 130 108 108 112 Z" fill="#fffbe6" opacity=".85"/>
      <path d="M100 74 L82 160 L118 160 Z" fill="#fffdf3"/>
      <circle cx="100" cy="62" r="12" fill="#fffdf3"/>
      <ellipse cx="100" cy="46" rx="16" ry="4" fill="none" stroke="#e6c84f" stroke-width="3"/>
    </svg>`;
  }

  // ---------- router ----------
  function go(route) { if (location.hash !== '#' + route) location.hash = route; else render(); }
  window.addEventListener('hashchange', render);
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.dataset.go); }
    const s = e.target.closest('[data-say]');
    if (s) speak(s.dataset.say);
  });

  function render() {
    stopSpeech();
    applySettings();
    const [route, arg] = (location.hash.slice(1) || 'map').split('/');
    document.querySelectorAll('.topnav button').forEach(b => { if (b.dataset.go === route) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    if (!me() && route !== 'grownups' && route !== 'settings') return viewHome();
    ({ map: viewMap, level: () => viewLevel(arg), scrolls: viewScrolls, careers: viewCareers, give: viewGive, settings: viewSettings, grownups: viewGrownups, home: viewHome }[route] || viewMap)();
    app.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  // ---------- home / profiles ----------
  function viewHome() {
    const list = Object.entries(S.profiles).map(([id, p]) => `<button class="profile-btn" data-pick="${id}">✦ ${esc(p.name)}<br><span class="muted small">${p.light} Light</span></button>`).join('');
    app.innerHTML = '';
    app.append(h(`
      <section class="hero fade-in">
        ${angelSVG()}
        <p class="greet">Sannu · Ẹ kú àbọ̀ · Nnọọ · Welcome!</p>
        <h1>Angel Academy Naija</h1>
        <p class="muted">STEM Quest: angels from the Bible bring you missions in coding, data, AI, cybersecurity, solar power, engineering and more, all set right here in Nigeria.</p>
      </section>
      ${list ? `<section class="panel"><h2>Who is playing?</h2><div class="profile-list">${list}</div></section>` : ''}
      <section class="panel">
        <h2>New player</h2>
        <p class="muted small">Use a nickname, not your full name. Progress stays on this device only.</p>
        <form id="np" class="row"><label class="sr" for="nick">Nickname</label><input id="nick" type="text" maxlength="20" placeholder="Nickname" autocomplete="off" required>
        <button class="btn" type="submit">Oya, start the climb ✦</button></form>
      </section>`));
    app.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => { S.current = b.dataset.pick; save(); go('map'); });
    app.querySelector('#np').onsubmit = e => { e.preventDefault(); const n = app.querySelector('#nick').value.trim(); if (n) { newProfile(n); go('map'); } };
  }

  // ---------- ladder map ----------
  function starStr(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
  function viewMap() {
    const p = me();
    const ev = activeEvent();
    let html = `<h1>The Ladder</h1><p class="muted">"Behold a ladder set up on the earth, and the top of it reached to heaven" (Genesis 28:12). Choose a rung to meet a messenger.</p>`;
    if (ev) html += `<div class="notice">✦ <strong>${esc(ev.name)}</strong> is on! Every lesson you finish now adds to the community event and earns the ${esc(ev.name)} halo. <button class="linklike" data-go="give">See the goal →</button></div>`;
    DATA.realms.forEach(r => {
      const lv = visibleLevels().filter(l => l.realm === r.id);
      if (!lv.length) return;
      html += `<section class="realm"><div class="realm-head"><span class="dot" style="background:${r.color}"></span><h2>${esc(r.name)}</h2><span class="muted small">${esc(r.books)}</span></div><div class="rungs">`;
      lv.forEach(l => {
        const st = (p.levels[l.id] || {}).stars || 0;
        const dt = l.canon === 'deuterocanonical' ? '<span class="tag">Deuterocanonical</span>' : '';
        html += l.stub
          ? `<button class="rung" disabled style="--realm:${r.color}"><span class="t">${esc(l.title)} ${dt}<span class="tag">Coming soon</span></span><span class="s">${esc(l.ref)} · ${esc(l.skill)}</span><span class="stars" aria-hidden="true"></span></button>`
          : `<button class="rung" data-go="level/${l.id}" style="--realm:${r.color}" aria-label="${esc(l.title)}, ${esc(l.ref)}, ${esc(l.skill)}, ${st} of 3 stars"><span class="t">${esc(l.title)} ${dt}</span><span class="s">${esc(l.ref)} · ${esc(l.skill)}</span><span class="stars" aria-hidden="true">${starStr(st)}</span></button>`;
      });
      html += `</div></section>`;
    });
    app.innerHTML = html;
  }

  // ---------- level player ----------
  const STEPS = ['Story', 'Mission brief', 'Mission', 'Challenge', 'Quiz', 'Why it matters', 'Reward'];

  function viewLevel(id) {
    const L = levelById(id);
    if (!L || L.stub) return go('map');
    const run = { step: 0, mission: false, tiers: [false, false, false], quiz: 0, quizIdx: 0, light: 0 };
    const realm = realmOf(L.realm);

    function shell(inner) {
      app.innerHTML = '';
      const bar = STEPS.map((s, i) => `<span class="${i === run.step ? 'on' : i < run.step ? 'done' : ''}">${s}</span>`).join('');
      app.append(h(`<div class="row"><button class="btn ghost small" data-go="map">← Ladder</button><span class="muted small">${esc(realm.name)}</span></div>
        <h1>${esc(L.title)}</h1><div class="steps" aria-label="Level progress">${bar}</div><div id="stage" class="fade-in"></div>`));
      const stage = app.querySelector('#stage');
      stage.append(typeof inner === 'string' ? h(inner) : inner);
      return stage;
    }
    function next() { run.step++; draw(); }

    function draw() {
      const s = run.step;
      if (s === 0) {
        const stage = shell(`<div class="scene">${angelSVG()}
          <div class="story"><p>${esc(L.story)}</p><p class="ref">${esc(L.ref)}</p></div>
          <p class="angel-line">“${esc(L.angelLine)}”</p></div>
          <div class="row end" style="margin-top:12px">${readBtn(L.story + ' ' + L.angelLine)}<button class="btn" id="nx">Accept the mission →</button></div>`);
        stage.querySelector('#nx').onclick = next;
        if (S.settings.narrate) speak(L.story + ' ' + L.angelLine);
      } else if (s === 1) {
        const chips = (L.careers || []).map(c => `<span class="career-chip">${esc(c)}</span>`).join('');
        const stage = shell(`<section class="panel brief"><h2>Mission brief: ${esc(L.skill)}</h2><p>${esc(L.brief)}</p>
          <p><strong>Real jobs that use this:</strong><br>${chips}</p>
          ${S.settings.adult && L.deeper ? `<div class="notice"><strong>Go deeper (Adult Learner):</strong> ${esc(L.deeper)}</div>` : ''}</section>
          <div class="row end">${readBtn(L.brief)}<button class="btn" id="nx">Begin →</button></div>`);
        stage.querySelector('#nx').onclick = next;
        if (S.settings.narrate) speak(L.brief);
      } else if (s === 2) {
        const stage = shell(`<section class="panel" id="mg"></section>`);
        MG.render(stage.querySelector('#mg'), L.mission, () => { if (!run.mission) { run.mission = true; run.light += 10; } next(); });
      } else if (s === 3) {
        drawTier(0);
      } else if (s === 4) {
        drawQuiz();
      } else if (s === 5) {
        const b = L.benefits;
        const stage = shell(`<h2>Why this matters to YOU</h2><div class="cards">
          <div class="bcard faith"><h3>✝ Faith lesson</h3><p>${esc(b.faith)}</p></div>
          <div class="bcard personal"><h3>♥ Personal benefit</h3><p>${esc(b.personal)}</p></div>
          <div class="bcard pro"><h3>⚙ Career benefit</h3><p>${esc(b.professional)}</p></div></div>
          <div class="row end" style="margin-top:12px">${readBtn(`Faith lesson: ${b.faith} Personal benefit: ${b.personal} Career benefit: ${b.professional}`)}<button class="btn" id="nx">Collect reward →</button></div>`);
        stage.querySelector('#nx').onclick = () => { finish(); next(); };
      } else {
        const stars = run.tiers.filter(Boolean).length;
        const p = me();
        const ev = activeEvent();
        shell(`<section class="panel" style="text-align:center">
          <p style="font-size:2em;color:var(--gold);margin:0" aria-label="${stars} of 3 stars">${starStr(stars)}</p>
          <h2>+${run.light} Light</h2>
          <p>Badge earned: <span class="badge">✦ ${esc(L.badge)}</span></p>
          <div class="scroll-card" style="max-width:520px;margin:12px auto;text-align:left"><strong>Scroll collected</strong><p style="margin:.4em 0">“${esc(L.verse)}”</p><div class="vr">${esc(L.verseRef)}</div></div>
          <p class="muted small">Lesson complete! You've finished ${p.lessons} lesson${p.lessons === 1 ? '' : 's'}. Each one adds to the community Light Goal.${ev ? ` It also counts for ${esc(ev.name)}.` : ''}</p>
          <div class="row" style="justify-content:center"><button class="btn ghost" data-go="careers">See careers</button><button class="btn" data-go="map">Back to the Ladder</button></div></section>`);
      }
    }

    function drawTier(t) {
      const stage = shell(`<p class="muted">Challenge round: tier ${t + 1} of 3 <span aria-hidden="true">${'★'.repeat(t + 1)}</span></p><section class="panel" id="mg"></section>
        <div class="row end"><button class="btn ghost small" id="skip">Skip this tier (no star)</button></div>`);
      const advance = () => (t < 2 ? drawTier(t + 1) : next());
      stage.querySelector('#skip').onclick = advance;
      MG.render(stage.querySelector('#mg'), L.challenges[t], () => { if (!run.tiers[t]) { run.tiers[t] = true; run.light += 10; } advance(); });
    }

    function drawQuiz() {
      const i = run.quizIdx;
      const Q = L.quiz[i];
      const stage = shell(`<p class="muted">Quiz: question ${i + 1} of ${L.quiz.length}</p><section class="panel"><p class="mg-prompt">${esc(Q.q)}</p><div class="choices" id="ch"></div><p class="feedback" id="fb" role="status"></p><div class="row end"><button class="btn" id="nx" hidden>Next →</button></div></section>`);
      const ch = stage.querySelector('#ch'), fb = stage.querySelector('#fb'), nx = stage.querySelector('#nx');
      let first = true;
      Q.options.forEach((o, k) => {
        const b = document.createElement('button');
        b.className = 'choice-btn'; b.textContent = o;
        b.onclick = () => {
          if (k === Q.a) {
            b.classList.add('right');
            if (first) { run.quiz++; run.light += 5; }
            fb.className = 'feedback ok'; fb.textContent = (first ? '✦ Correct! ' : 'That\'s it. ') + Q.why;
            ch.querySelectorAll('button').forEach(x => (x.disabled = true));
            nx.hidden = false; nx.focus();
          } else {
            first = false; b.classList.add('wrong'); b.disabled = true;
            fb.className = 'feedback bad'; fb.textContent = 'Not quite. Try again!';
          }
        };
        ch.append(b);
      });
      nx.onclick = () => { if (run.quizIdx < L.quiz.length - 1) { run.quizIdx++; drawQuiz(); } else next(); };
    }

    function finish() {
      const p = me();
      const rec = p.levels[L.id] || { stars: 0, quizBest: 0, plays: 0 };
      rec.stars = Math.max(rec.stars, run.tiers.filter(Boolean).length);
      rec.quizBest = Math.max(rec.quizBest, run.quiz);
      rec.plays++;
      rec.last = today();
      p.levels[L.id] = rec;
      p.light += run.light;
      p.lessons++;
      if (!p.badges.includes(L.id)) p.badges.push(L.id);
      const ev = activeEvent();
      if (ev && !p.halos.includes(ev.halo)) p.halos.push(ev.halo);
      save();
      applySettings();
    }

    draw();
  }

  // ---------- scrolls, badges, halos ----------
  const HALO_NAMES = { default: 'Morning Star (default)', christmas: 'Christmas Light', easter: 'Easter Dawn', childrens: "Children's Day Glow", school: 'Back-to-School Light', independence: 'Independence Green', supporter: 'Supporter Glow' };
  function viewScrolls() {
    const p = me();
    const lv = visibleLevels().filter(l => !l.stub);
    const cards = lv.map(l => p.levels[l.id]
      ? `<div class="scroll-card"><strong>${esc(l.title)}</strong><p style="margin:.4em 0">“${esc(l.verse)}”</p><div class="vr">${esc(l.verseRef)}</div></div>`
      : `<div class="scroll-card locked"><strong>Sealed scroll</strong><p class="small">Finish “${esc(l.title)}” to open it.</p></div>`).join('');
    const badges = p.badges.map(id => levelById(id)).filter(Boolean).map(l => `<span class="badge">✦ ${esc(l.badge)}</span>`).join('') || '<span class="muted">No badges yet. Climb a rung!</span>';
    const halos = p.halos.map(k => `<button class="bin-btn" data-halo="${k}" aria-pressed="${p.halo === k}">${esc(HALO_NAMES[k] || k)}</button>`).join(' ');
    app.innerHTML = `<h1>Scrolls & Badges</h1>
      <section class="panel"><h2>Badges</h2>${badges}</section>
      <section class="panel"><h2>Halo trail</h2><p class="muted small">Halos only change how things look. Earn them by playing during seasonal events.</p><div class="row">${halos}</div></section>
      <h2>Scroll collection (${p.badges.length}/${lv.length})</h2><div class="grid2">${cards}</div>`;
    app.querySelectorAll('[data-halo]').forEach(b => b.onclick = () => { p.halo = b.dataset.halo; save(); viewScrolls(); applySettings(); });
  }

  // ---------- career gallery ----------
  function viewCareers() {
    const p = me();
    const earned = new Set();
    Object.keys(p.levels).forEach(id => (levelById(id)?.careers || []).forEach(c => earned.add(c)));
    const all = [];
    visibleLevels().filter(l => !l.stub).forEach(l => (l.careers || []).forEach(c => { if (!all.find(a => a.c === c)) all.push({ c, l }); }));
    const rows = all.map(({ c, l }) => {
      const info = DATA.careers[c] || {};
      const got = earned.has(c);
      return `<div class="panel" style="${got ? '' : 'opacity:.6'}"><h3>${got ? '✦' : '🔒'} ${esc(c)}</h3>
        <p class="small muted">Skill: ${esc(l.skill)} · from “${esc(l.title)}”</p>
        ${got ? `<p><strong>How to start:</strong> ${esc(info.start || '')}<br><strong>Where people work:</strong> ${esc(info.where || '')}</p>` : '<p class="small">Finish the level to unlock this career card.</p>'}</div>`;
    }).join('');
    app.innerHTML = `<h1>Career Gallery</h1><p class="muted">Every skill you learn opens doors in Nigeria and beyond. Here are real careers that use the skills you've earned.</p>
      <p class="notice small">${esc(DATA.careerNote)}</p><div class="grid2">${rows}</div>`;
  }

  // ---------- Light Goal (child-safe: no money, no prompts) ----------
  function viewGive() {
    const p = me();
    const c = CFG.community || {};
    const total = (c.totalLessons || 0);
    const pct = Math.min(100, (total / (c.goalLessons || 1)) * 100);
    const ev = activeEvent();
    const t = CFG.transparency || {};
    app.innerHTML = `<h1>The Light Goal</h1>
      <section class="panel"><h2>Play = Give</h2>
      ${c.sponsored
        ? `<p>Thanks to <strong>${esc(c.sponsorName || 'our sponsor')}</strong>, every ${c.lessonsPerUnit} lessons completed = <strong>${esc(c.unitLabel)}</strong>. Learning is how you give!</p>`
        : `<p>Soon, every ${c.lessonsPerUnit} lessons completed by our players will fund <strong>${esc(c.unitLabel)}</strong>. We are still looking for a sponsor, so no money is being raised by lessons yet.</p>`}
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${c.goalLessons}" aria-valuenow="${total}"><div style="width:${pct}%"></div></div>
      <p class="small muted">${total.toLocaleString()} of ${(c.goalLessons || 0).toLocaleString()} community lessons${c.updated ? ` (updated ${esc(c.updated)})` : ''}.</p>
      <p>You have finished <strong>${p.lessons}</strong> lesson${p.lessons === 1 ? '' : 's'} on this device. ✦</p></section>
      ${ev ? `<section class="panel"><h2>✦ ${esc(ev.name)}</h2><p>Runs until ${esc(ev.end)}. Finish lessons to earn the ${esc(ev.name)} halo. Church and school teams can count lessons together.</p></section>` : ''}
      <section class="panel"><h2>Where the Light Goes</h2>
      ${t.raised || (t.items || []).length
        ? `<p>Raised so far: <strong>${esc(t.raised)}</strong></p><table class="data"><tr><th>What it funded</th><th>Amount</th><th>Story</th></tr>${(t.items || []).map(i => `<tr><td>${esc(i.label)}</td><td>${esc(i.amount)}</td><td>${esc(i.note || '')}</td></tr>`).join('')}</table>${t.reportUrl ? `<p><a href="${esc(t.reportUrl)}" target="_blank" rel="noopener">Read the full report</a></p>` : ''}`
        : '<p class="muted">Nothing has been raised yet. When it is, every amount and what it paid for will be shown here.</p>'}
      </section>
      <p class="small muted">Grown-ups: see the <button class="linklike" data-go="grownups">Grown-ups area</button> to learn how to support the game.</p>`;
  }

  // ---------- settings ----------
  function viewSettings() {
    const opts = [
      ['narrate', 'Read stories aloud automatically'], ['captions', 'Show captions when reading aloud'],
      ['dyslexic', 'Dyslexia-friendly text'], ['big', 'Larger text'], ['contrast', 'High contrast'],
      ['calm', 'Reduce motion'], ['adult', 'Adult Learner mode ("Go deeper" notes)'],
      ['deutero', 'Include deuterocanonical stories (e.g. Tobit)']
    ];
    app.innerHTML = `<h1>Settings</h1><section class="panel">${opts.map(([k, t]) => `<label class="row" style="margin:8px 0"><input type="checkbox" data-k="${k}" ${S.settings[k] ? 'checked' : ''} style="width:22px;height:22px"> ${esc(t)}</label>`).join('')}</section>
      <section class="panel"><h2>Player</h2><p>${me() ? `Playing as <strong>${esc(me().name)}</strong>.` : 'No player selected.'}</p><button class="btn ghost" id="sw">Switch player</button></section>`;
    app.querySelectorAll('[data-k]').forEach(i => i.onchange = () => { S.settings[i.dataset.k] = i.checked; save(); applySettings(); });
    app.querySelector('#sw').onclick = () => { S.current = null; save(); go('home'); };
  }

  // ---------- grown-ups: parent gate, support, dashboard ----------
  let gateOpen = false;
  function viewGrownups() {
    if (!gateOpen) return gate();
    const word = CFG.donateLabel || 'Donate';
    const funds = CFG.funds || ['Keep the game free', 'Data & devices for learners'];
    const hasCharity = !!CFG.charityName;
    app.innerHTML = `<h1>Grown-ups</h1>
      <section class="panel"><h2>${esc(word)}</h2>
      <p>Angel Academy Naija is free, and every lesson stays free. Giving is optional and only grown-ups can give. Whether you are at home or abroad, thank you!</p>
      <p class="small muted">${esc(CFG.donateNote || '')}${hasCharity ? ` To give to ${esc(CFG.charityName)} directly, use its own link below.` : ''}</p>
      <h3>Choose your split</h3>
      <label for="s1">${esc(funds[0])}: <strong id="v1">50</strong>%</label><input id="s1" type="range" min="0" max="100" value="50">
      <label for="s2">${esc(funds[1])}: <strong id="v2">50</strong>%</label><input id="s2" type="range" min="0" max="100" value="50" disabled>
      <p class="small muted">Please add your split to the note at checkout, e.g. "<span id="splitTxt"></span>". We honour it and show it in the published report.</p>
      <div class="row">
        ${CFG.donateLink ? `<a class="btn" id="pay" href="#" rel="noopener">${esc(word)} (secure Paystack checkout)</a>` : `<button class="btn" disabled>Online giving opens soon</button>`}
        ${hasCharity && CFG.charityUrl ? `<a class="btn ghost" href="${esc(CFG.charityUrl)}" target="_blank" rel="noopener">Give to ${esc(CFG.charityName)}</a>` : ''}
      </div>
      ${CFG.donateLink ? '' : `<p class="small muted">To give today, email <a href="mailto:${esc(CFG.contactEmail)}">${esc(CFG.contactEmail)}</a>.</p>`}
      <p class="small muted">Checkout is hosted by Paystack. This game never sees or stores card details.</p>
      ${CFG.supporterCode ? `<h3>Supporter thank-you</h3><form id="sc" class="row"><label class="sr" for="code">Supporter code</label><input id="code" type="text" placeholder="Code from your receipt"><button class="btn ghost small">Unlock Supporter Glow halo</button></form><p class="small muted" id="scm"></p>` : ''}
      </section>
      <section class="panel"><h2>Progress dashboard</h2><div id="dash"></div>
      <div class="row"><button class="btn ghost small" id="csv">Export progress (CSV)</button></div></section>
      <section class="panel"><h2>Guides</h2><p><a href="guides/parent-guide.html">Parent guide</a> · <a href="guides/teacher-guide.html">Teacher guide</a> · <a href="privacy.html">Privacy</a></p></section>
      <button class="btn ghost" id="lock">Close grown-ups area</button>`;
    const s1 = app.querySelector('#s1'), s2 = app.querySelector('#s2');
    const sync = () => {
      s2.value = 100 - s1.value;
      app.querySelector('#v1').textContent = s1.value;
      app.querySelector('#v2').textContent = s2.value;
      app.querySelector('#splitTxt').textContent = `Split: ${s1.value}% ${funds[0]}, ${s2.value}% ${funds[1]}`;
    };
    s1.oninput = sync; sync();
    const pay = app.querySelector('#pay');
    if (pay) pay.onclick = e => { e.preventDefault(); window.open(CFG.donateLink, '_blank', 'noopener'); };
    const sc = app.querySelector('#sc');
    if (sc) sc.onsubmit = e => {
      e.preventDefault();
      const ok = app.querySelector('#code').value.trim().toUpperCase() === String(CFG.supporterCode).toUpperCase();
      const p = me();
      if (ok && p && !p.halos.includes('supporter')) { p.halos.push('supporter'); save(); }
      app.querySelector('#scm').textContent = ok ? (p ? 'Thank you! The Supporter Glow halo is unlocked in Scrolls & Badges.' : 'Thank you! Pick a player first, then enter the code again.') : 'That code doesn\'t match. Check your receipt.';
    };
    drawDash();
    app.querySelector('#csv').onclick = exportCSV;
    app.querySelector('#lock').onclick = () => { gateOpen = false; go('map'); };
  }

  function drawDash() {
    const launch = DATA.levels.filter(l => !l.stub);
    const rows = Object.entries(S.profiles).map(([id, p]) => {
      const done = launch.filter(l => p.levels[l.id]).length;
      const stars = launch.reduce((s, l) => s + ((p.levels[l.id] || {}).stars || 0), 0);
      return `<tr><td>${esc(p.name)}</td><td>${done}/${launch.length}</td><td>${stars}</td><td>${p.light}</td><td>${p.lessons}</td><td><button class="linklike" data-del="${id}">Delete</button></td></tr>`;
    }).join('');
    const d = app.querySelector('#dash');
    d.innerHTML = rows ? `<table class="data"><tr><th>Player</th><th>Levels</th><th>Stars</th><th>Light</th><th>Lessons</th><th></th></tr>${rows}</table>` : '<p class="muted">No players on this device yet.</p>';
    d.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      if (!confirm(`Delete ${S.profiles[b.dataset.del].name}'s progress on this device? This cannot be undone.`)) return;
      delete S.profiles[b.dataset.del];
      if (S.current === b.dataset.del) S.current = null;
      save(); drawDash();
    });
  }

  function exportCSV() {
    const launch = DATA.levels.filter(l => !l.stub);
    const head = ['player', 'level', 'skill', 'stars', 'quiz_best_of_5', 'plays', 'last_played'];
    const lines = [head.join(',')];
    Object.values(S.profiles).forEach(p => launch.forEach(l => {
      const r = p.levels[l.id];
      lines.push([p.name, l.title, l.skill, r ? r.stars : 0, r ? r.quizBest : 0, r ? r.plays : 0, r ? r.last : ''].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    }));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/csv' }));
    a.download = `angel-academy-naija-progress-${today()}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function gate() {
    const a = 6 + Math.floor(Math.random() * 7), b = 6 + Math.floor(Math.random() * 7);
    const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    app.innerHTML = `<h1>Grown-ups only</h1><section class="panel">
      <p>This area has settings, progress reports and ways to support the game. Please ask a parent, carer or teacher.</p>
      <form id="g"><label for="ga">What is <strong>${words[a]} times ${words[b]}</strong>? (type the number)</label><br>
      <input id="ga" type="number" inputmode="numeric" style="margin:8px 0"><br>
      <label class="row"><input type="checkbox" id="gc" style="width:22px;height:22px"> I am a parent, carer or teacher</label>
      <p class="feedback bad" id="gf" role="status"></p><button class="btn">Continue</button> <button class="btn ghost" type="button" data-go="map">Back to the game</button></form></section>`;
    app.querySelector('#g').onsubmit = e => {
      e.preventDefault();
      if (+app.querySelector('#ga').value === a * b && app.querySelector('#gc').checked) { gateOpen = true; viewGrownups(); }
      else app.querySelector('#gf').textContent = 'That isn\'t right. Please ask a grown-up.';
    };
  }

  // ---------- boot ----------
  fetch('levels.json').then(r => r.json()).then(d => { DATA = d; render(); }).catch(() => {
    app.innerHTML = '<section class="panel"><h1>Could not load the levels</h1><p>Open the game from a web address (not by double-clicking the file), or check your connection the first time you play.</p></section>';
  });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
