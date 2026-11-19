// Mini-game engine. Each type renders into a container and calls done() once solved.
// Every control is a real button, so all mini-games work by keyboard and screen reader.
(function () {
  'use strict';

  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(c => n.append(c));
    return n;
  }

  function shuffle(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  // Shuffle, but never hand back the solved order.
  function scramble(a) {
    if (a.length < 2) return a.slice();
    let b;
    do { b = shuffle(a); } while (b.every((x, i) => x === a[i]));
    return b;
  }

  const reduceMotion = () =>
    document.documentElement.classList.contains('calm') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shared frame: prompt, body, feedback line, and hint/check buttons.
  function frame(root, cfg, opts) {
    root.innerHTML = '';
    const prompt = el('p', { class: 'mg-prompt', text: cfg.prompt });
    const body = el('div');
    const fb = el('p', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
    const actions = el('div', { class: 'row' });
    if (cfg.hint) {
      actions.append(el('button', { class: 'btn ghost small', text: '💡 Hint', onclick: () => say(fb, cfg.hint, '') }));
    }
    let check = null;
    if (opts.check) {
      check = el('button', { class: 'btn', text: opts.checkLabel || 'Check', onclick: opts.check });
      actions.append(check);
    }
    root.append(prompt, body, fb, actions);
    return { body, fb, actions, check };
  }

  function say(fb, msg, kind) {
    fb.textContent = msg;
    fb.className = 'feedback' + (kind ? ' ' + kind : '');
  }

  function win(f, done, msg) {
    say(f.fb, msg || '✦ Well done o! Mission complete.', 'ok');
    f.actions.querySelectorAll('button').forEach(b => (b.disabled = true));
    setTimeout(() => done(true), reduceMotion() ? 200 : 900);
  }

  const types = {};

  types.order = function (root, cfg, done) {
    let cur = scramble(cfg.items);
    const f = frame(root, cfg, {
      check() {
        const right = cur.filter((x, i) => x === cfg.items[i]).length;
        if (right === cfg.items.length) win(f, done);
        else say(f.fb, `${right} of ${cfg.items.length} are in the right place. Keep going!`, 'bad');
      }
    });
    const list = el('ol', { class: 'order-list', 'aria-label': 'Steps to put in order' });
    f.body.append(list);
    function move(i, d) {
      const j = i + d;
      if (j < 0 || j >= cur.length) return;
      [cur[i], cur[j]] = [cur[j], cur[i]];
      draw(j, d < 0 ? 'up' : 'down');
    }
    function draw(focusIdx, dir) {
      list.innerHTML = '';
      cur.forEach((t, i) => {
        list.append(el('li', {}, [
          el('span', { class: 'n', text: String(i + 1), 'aria-hidden': 'true' }),
          el('span', { class: 'txt', text: t }),
          el('button', { class: 'iconbtn', 'data-i': i, 'data-d': 'up', 'aria-label': `Move "${t}" up`, text: '▲', onclick: () => move(i, -1) }),
          el('button', { class: 'iconbtn', 'data-i': i, 'data-d': 'down', 'aria-label': `Move "${t}" down`, text: '▼', onclick: () => move(i, 1) })
        ]));
      });
      if (focusIdx != null) {
        const b = list.querySelector(`[data-i="${focusIdx}"][data-d="${dir}"]`) || list.querySelector(`[data-i="${focusIdx}"]`);
        if (b) b.focus();
      }
    }
    draw();
  };

  types.sort = function (root, cfg, done) {
    const items = shuffle(cfg.items);
    const picks = new Map();
    const rows = [];
    const f = frame(root, cfg, {
      check() {
        if (picks.size < items.length) return say(f.fb, 'Choose a group for every item first.', 'bad');
        let wrong = 0;
        rows.forEach(({ it, row }) => {
          const ok = picks.get(it) === it.bin;
          row.classList.toggle('right', ok);
          row.classList.toggle('wrong', !ok);
          if (!ok) wrong++;
        });
        if (!wrong) win(f, done);
        else say(f.fb, `${wrong} item${wrong > 1 ? 's are' : ' is'} in the wrong group (outlined in red). Try again!`, 'bad');
      }
    });
    items.forEach((it, idx) => {
      const bins = el('div', { class: 'bins', role: 'group', 'aria-label': `Group for: ${it.t}` });
      cfg.bins.forEach(b => {
        const btn = el('button', {
          class: 'bin-btn', 'aria-pressed': 'false', text: b,
          onclick() {
            picks.set(it, b);
            bins.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === btn)));
            row.classList.remove('wrong', 'right');
          }
        });
        bins.append(btn);
      });
      const row = el('div', { class: 'sort-item' }, [el('div', { text: it.t }), bins]);
      rows.push({ it, row });
      f.body.append(row);
    });
  };

  types.grid = function (root, cfg, done) {
    const f = frame(root, cfg, {});
    const rows = cfg.cells.length, cols = cfg.cells[0].length;
    const flat = cfg.cells.flat();
    const lo = Math.min(...flat), hi = Math.max(...flat);
    const g = el('div', { class: 'grid-map', role: 'grid', 'aria-label': 'Survey map' });
    g.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = cfg.cells[r][c];
        const t = (v - lo) / (hi - lo || 1);
        const name = String.fromCharCode(65 + c) + (r + 1);
        const b = el('button', {
          'aria-label': `${name}: ${v}`,
          onclick() {
            g.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
            b.setAttribute('aria-pressed', 'true');
            if (r === cfg.answer[0] && c === cfg.answer[1]) {
              g.querySelectorAll('button').forEach(x => (x.disabled = true));
              win(f, done, `✦ Yes! ${name} is the spot.`);
            } else say(f.fb, `${name} reads ${v}. Not the best spot. Look again!`, 'bad');
          }
        }, [document.createTextNode(String(v)), el('span', { class: 'lbl', text: name })]);
        b.style.background = `hsl(${30 + t * 170}, 45%, ${22 + t * 18}%)`;
        g.append(b);
      }
    }
    f.body.append(g);
  };

  function choiceList(f, options, answer, why, done) {
    const box = el('div', { class: 'choices' });
    options.forEach((o, i) => {
      const b = el('button', {
        class: 'choice-btn', text: o,
        onclick() {
          if (i === answer) {
            b.classList.add('right');
            box.querySelectorAll('button').forEach(x => (x.disabled = true));
            win(f, done, '✦ Correct! ' + (why || ''));
          } else {
            b.classList.add('wrong');
            b.disabled = true;
            say(f.fb, 'Not quite. Try another answer.', 'bad');
          }
        }
      });
      box.append(b);
    });
    f.body.append(box);
  }

  types.choice = function (root, cfg, done) {
    const f = frame(root, cfg, {});
    choiceList(f, cfg.options, cfg.a, cfg.why, done);
  };

  types.chart = function (root, cfg, done) {
    const f = frame(root, cfg, {});
    const max = Math.max(...cfg.bars.map(b => b.value));
    const chart = el('div', { class: 'chart', role: 'img', 'aria-label': 'Bar chart: ' + cfg.bars.map(b => `${b.label} ${b.value.toLocaleString()}`).join(', ') });
    cfg.bars.forEach(b => {
      const fill = el('div', { class: 'fill' });
      fill.style.height = (b.value / max) * 80 + '%';
      chart.append(el('div', { class: 'bar' }, [
        el('span', { class: 'v', text: b.value.toLocaleString() }), fill, el('span', { class: 'l', text: b.label })
      ]));
    });
    f.body.append(chart, el('p', { class: 'mg-prompt', text: cfg.question }));
    choiceList(f, cfg.options, cfg.a, cfg.why, done);
  };

  types.numeric = function (root, cfg, done) {
    const id = 'n' + Math.random().toString(36).slice(2);
    const input = el('input', { type: 'number', inputmode: 'decimal', id, step: 'any' });
    const f = frame(root, cfg, {
      check() {
        const v = parseFloat(String(input.value).replace(/,/g, ''));
        if (isNaN(v)) return say(f.fb, 'Type a number first.', 'bad');
        if (Math.abs(v - cfg.answer) <= (cfg.tolerance || 0)) {
          input.disabled = true;
          win(f, done, `✦ Correct: ${cfg.answer.toLocaleString()}${cfg.unit ? ' ' + cfg.unit : ''}!`);
        } else say(f.fb, v > cfg.answer ? 'A bit too high. Try again!' : 'A bit too low. Try again!', 'bad');
      }
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') f.check.click(); });
    f.body.append(el('div', { class: 'row' }, [
      el('label', { for: id, class: 'sr', text: 'Your answer' }), input, el('span', { class: 'muted', text: cfg.unit || '' })
    ]));
  };

  types.binary = function (root, cfg, done) {
    const f = frame(root, cfg, {});
    const vals = [128, 64, 32, 16, 8, 4, 2, 1];
    const on = vals.map(() => false);
    const total = el('p', { class: 'bin-total', 'aria-live': 'polite' });
    const wrap = el('div', { class: 'bits', role: 'group', 'aria-label': 'Eight bit switches' });
    let solved = false;
    function update() {
      const sum = vals.reduce((s, v, i) => s + (on[i] ? v : 0), 0);
      const bits = on.map(b => (b ? 1 : 0)).join('');
      total.textContent = `${bits} = ${sum}` + (cfg.mode === 'letter' && sum >= 32 && sum < 127 ? `  →  "${String.fromCharCode(sum)}"` : '');
      if (sum === cfg.target && !solved) {
        solved = true;
        wrap.querySelectorAll('button').forEach(b => (b.disabled = true));
        win(f, done, cfg.letter ? `✦ "${cfg.letter}" sent as ${bits}!` : `✦ ${bits} = ${sum}. You speak binary!`);
      }
    }
    vals.forEach((v, i) => {
      const bitLabel = el('span', { class: 'b', text: '0' });
      const b = el('button', {
        class: 'bit', 'aria-pressed': 'false', 'aria-label': `Switch worth ${v}`,
        onclick() {
          on[i] = !on[i];
          b.setAttribute('aria-pressed', String(on[i]));
          bitLabel.textContent = on[i] ? '1' : '0';
          update();
        }
      }, [el('span', { class: 'val', text: String(v) }), bitLabel]);
      wrap.append(b);
    });
    f.body.append(wrap, total);
    update();
  };

  types.cipher = function (root, cfg, done) {
    const f = frame(root, cfg, {});
    let shift = 0;
    const plain = el('div', { class: 'plain', 'aria-live': 'polite' });
    const shiftLbl = el('span', { class: 'muted' });
    const decode = s => cfg.text.replace(/[A-Z]/g, ch => String.fromCharCode(((ch.charCodeAt(0) - 65 - s + 26 * 2) % 26) + 65));
    let solved = false;
    function update() {
      const p = decode(shift);
      plain.textContent = p;
      shiftLbl.textContent = `Shift: ${shift}`;
      if (p === cfg.answer && !solved) {
        solved = true;
        f.body.querySelectorAll('button').forEach(b => (b.disabled = true));
        win(f, done, `✦ Decoded: ${cfg.answer}! The key was ${shift}.`);
      }
    }
    f.body.append(el('div', { class: 'cipher' }, [
      el('div', { class: 'muted small', text: 'Secret code' }),
      el('div', { class: 'code', text: cfg.text }),
      el('div', { class: 'row', style: 'justify-content:center' }, [
        el('button', { class: 'iconbtn', 'aria-label': 'Shift back one', text: '◀', onclick: () => { shift = (shift + 25) % 26; update(); } }),
        shiftLbl,
        el('button', { class: 'iconbtn', 'aria-label': 'Shift forward one', text: '▶', onclick: () => { shift = (shift + 1) % 26; update(); } })
      ]),
      el('div', { class: 'muted small', text: 'Decoded message' }),
      plain
    ]));
    update();
  };

  types.robot = function (root, cfg, done) {
    const dirs = ['N', 'E', 'S', 'W'];
    const arrow = { N: '⬆', E: '➡', S: '⬇', W: '⬅' };
    const angels = cfg.angels || [];
    const isAngel = (x, y) => angels.some(a => a[0] === x && a[1] === y);
    const isWall = (x, y) => isAngel(x, y) || (cfg.walls || []).some(w => w[0] === x && w[1] === y);
    let program = [];
    let running = false;
    const f = frame(root, cfg, { check: run, checkLabel: '▶ Run' });
    const gridEl = el('div', { class: 'robot-grid', role: 'img' });
    gridEl.style.gridTemplateColumns = `repeat(${cfg.w}, 1fr)`;
    const prog = el('div', { class: 'program', 'aria-label': 'Your program', 'aria-live': 'polite' });
    const count = el('span', { class: 'muted small' });
    const cmdName = { F: 'Forward', L: 'Turn left', R: 'Turn right' };
    function draw(pos) {
      gridEl.innerHTML = '';
      for (let y = 0; y < cfg.h; y++) for (let x = 0; x < cfg.w; x++) {
        const c = el('div', { class: 'c' });
        if (isAngel(x, y)) { c.classList.add('angel'); c.textContent = '✦'; }
        else if (isWall(x, y)) { c.classList.add('wall'); c.textContent = cfg.wallIcon || '▦'; }
        if (x === cfg.goal.x && y === cfg.goal.y) { c.classList.add('goal'); c.textContent = '⚑'; }
        if (pos && pos.x === x && pos.y === y) c.textContent = arrow[pos.d];
        gridEl.append(c);
      }
      gridEl.setAttribute('aria-label', `Map ${cfg.w} by ${cfg.h}. Robot at column ${pos.x + 1}, row ${pos.y + 1}, facing ${pos.d}. Gate at column ${cfg.goal.x + 1}, row ${cfg.goal.y + 1}.`);
    }
    function drawProg() {
      prog.innerHTML = '';
      if (!program.length) prog.append(el('span', { class: 'muted small', text: 'Tap commands below to build your program…' }));
      program.forEach(c => prog.append(el('span', { class: 'cmd', text: cmdName[c] })));
      count.textContent = `${program.length} / ${cfg.maxSteps} steps`;
    }
    function add(c) {
      if (running) return;
      if (program.length >= cfg.maxSteps) return say(f.fb, `Only ${cfg.maxSteps} steps allowed.`, 'bad');
      program.push(c); drawProg(); say(f.fb, '', '');
    }
    const palette = el('div', { class: 'palette' }, [
      el('button', { class: 'btn small', text: '⬆ Forward', onclick: () => add('F') }),
      el('button', { class: 'btn small', text: '↺ Turn left', onclick: () => add('L') }),
      el('button', { class: 'btn small', text: '↻ Turn right', onclick: () => add('R') }),
      el('button', { class: 'btn ghost small', text: '⌫ Undo', onclick: () => { if (!running) { program.pop(); drawProg(); } } }),
      el('button', { class: 'btn ghost small', text: 'Clear', onclick: () => { if (!running) { program = []; drawProg(); draw({ ...cfg.start }); } } })
    ]);
    f.body.append(gridEl, el('div', { class: 'row' }, [el('strong', { text: 'Program' }), count]), prog, palette);
    draw({ ...cfg.start });
    drawProg();

    function run() {
      if (running || !program.length) return say(f.fb, 'Add some commands first.', 'bad');
      running = true;
      const p = { ...cfg.start };
      let i = 0;
      const delay = reduceMotion() ? 0 : 380;
      (function step() {
        if (p.x === cfg.goal.x && p.y === cfg.goal.y) { running = false; return win(f, done, '✦ The robot reached the gate safely!'); }
        if (i >= program.length) { running = false; draw({ ...cfg.start }); return say(f.fb, 'The program ended before the gate. Add or change steps.', 'bad'); }
        const c = program[i++];
        if (c === 'L') p.d = dirs[(dirs.indexOf(p.d) + 3) % 4];
        else if (c === 'R') p.d = dirs[(dirs.indexOf(p.d) + 1) % 4];
        else {
          const nx = p.x + (p.d === 'E') - (p.d === 'W');
          const ny = p.y + (p.d === 'S') - (p.d === 'N');
          if (nx < 0 || ny < 0 || nx >= cfg.w || ny >= cfg.h || isWall(nx, ny)) {
            running = false;
            draw(p);
            return say(f.fb, `Bump! Step ${i} hits ${isWall(nx, ny) ? 'something in the way' : 'the edge'}. Sensors would have warned you. Fix your program.`, 'bad');
          }
          p.x = nx; p.y = ny;
        }
        draw(p);
        setTimeout(step, delay);
      })();
    }
  };

  window.MG = {
    render(root, cfg, done) {
      const fn = types[cfg.type];
      if (!fn) { root.textContent = 'Unknown mini-game: ' + cfg.type; return; }
      fn(root, cfg, done);
    },
    types: Object.keys(types)
  };
})();
