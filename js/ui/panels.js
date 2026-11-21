/* Full-screen panels: codex, shop, settings, day summary. */
HC.panels = (function () {
  const scr = () => document.getElementById('screen');
  let open = false, closeCb = null;

  function openBox(title, solid) {
    const s = scr(); s.className = solid ? 'solid' : ''; s.innerHTML = '';
    const box = HC.el('div', 'box panel');
    const h = HC.el('h2', '', '<span>' + HC.esc(title) + '</span>');
    box.appendChild(h);
    const body = HC.el('div', 'body'); box.appendChild(body);
    s.appendChild(box); open = true;
    return { box, h, body };
  }
  function close() {
    const s = scr(); s.className = 'hide'; s.innerHTML = ''; open = false;
    if (closeCb) { const c = closeCb; closeCb = null; c(); }
  }
  function addClose(h) { const b = HC.el('button', 'btn', 'X'); b.style.padding = '.1rem .6rem'; b.onclick = () => { HC.audio.click(); close(); }; h.appendChild(b); }
  function tabs(body, names, cur, onPick) {
    const t = HC.el('div', 'tabs');
    names.forEach(n => { const b = HC.el('button', 'tab' + (n === cur ? ' on' : ''), HC.esc(HC.t('tab_' + n))); b.onclick = () => { HC.audio.click(); onPick(n); }; t.appendChild(b); });
    body.appendChild(t);
  }

  /* ---------------- Codex ---------------- */
  function codex(tab) {
    if (open) return; tab = tab || 'deaths';
    const { box, h, body } = openBox(HC.t('codex')); addClose(h);
    const draw = t => {
      body.innerHTML = ''; tabs(body, ['deaths', 'people', 'lore', 'ach', 'stats'], t, draw);
      const s = HC.store.get(), C = s.codex, lang = HC.i18n.lang, P = HC.i18n.pair.bind(HC.i18n);
      const wrap = HC.el('div'); body.appendChild(wrap);
      if (t === 'deaths') {
        const fams = HC.data.deathFamilies.map(f => f.id);
        const found = fams.filter(f => C.families[f]).length;
        wrap.innerHTML = '<div class="card">' + HC.t('cx_fams', { a: found, b: fams.length }) + '<br>' + fams.map(f => '<span class="chip" style="' + (C.families[f] ? 'color:#ffe9cf' : 'opacity:.4') + '">' + HC.esc(HC.t('fam_' + f)) + (C.families[f] ? ' ×' + C.families[f] : ' ?') + '</span>').join('') + '</div>' +
          '<div class="d-sec"><h4>' + HC.t('cx_log') + ' (' + C.log.length + ')</h4></div>' +
          (C.log.slice().reverse().map(e => '<div class="logline"><b>' + HC.esc(e.n) + '</b> — ' + HC.esc(HC.gen.death.render(e.d, lang)) + '</div>').join('') || '<div class="card">' + HC.t('cx_empty') + '</div>');
      } else if (t === 'people') {
        const found = HC.data.specials.filter(x => C.specials[x.id]).length;
        wrap.innerHTML = '<div class="card">' + HC.t('cx_people', { a: found, b: HC.data.specials.length }) + '</div>' +
          HC.data.specials.map(sp => C.specials[sp.id]
            ? '<div class="card new"><b>' + HC.esc(sp.name) + '</b> — ' + HC.esc(P(sp.job)) + '<br>' + HC.esc(P(sp.death)) + '</div>'
            : '<div class="card" style="opacity:.5">??? — ' + HC.t('cx_unmet') + '</div>').join('');
      } else if (t === 'lore') {
        const found = HC.data.lore.filter(x => C.lore[x.id]).length;
        wrap.innerHTML = '<div class="card">' + HC.t('cx_lore', { a: found, b: HC.data.lore.length }) + '</div>' +
          HC.data.lore.map(l => C.lore[l.id]
            ? '<div class="card new">' + HC.esc(P(l.t)) + '</div>'
            : '<div class="card" style="opacity:.5">??? — ' + (l.rank ? HC.t('cx_lore_rank', { r: HC.game.rankName(l.rank) }) : HC.t('cx_lore_soul')) + '</div>').join('');
      } else if (t === 'ach') {
        const n = HC.ach.defs.filter(d => s.ach[d.id]).length;
        wrap.innerHTML = '<div class="card">' + HC.t('cx_ach', { a: n, b: HC.ach.defs.length }) + '</div>' +
          HC.ach.defs.map(d => '<div class="row ' + (s.ach[d.id] ? '' : 'locked') + '"><div class="nm">' + (s.ach[d.id] ? '🏆 ' : '🔒 ') + HC.esc(HC.t('ach_' + d.id)) + '<small>' + HC.esc(HC.t('ach_' + d.id + '_d')) + '</small></div></div>').join('');
      } else {
        const st = s.stats, tot = st.perfect + st.near + st.wrong;
        const R = (k, v) => '<div class="row"><span>' + HC.t(k) + '</span><span class="nm">' + v + '</span></div>';
        wrap.innerHTML = R('st_total', s.total) + R('st_perfect', st.perfect) + R('st_near', st.near) + R('st_wrong', st.wrong) +
          R('st_acc', tot ? Math.round(st.perfect / tot * 100) + '%' : '-') + R('st_streak', st.bestStreak) + R('st_hired', st.hired) + R('st_xu', st.xuEarned) + R('st_cycle', s.cycle) + R('st_day', s.day);
      }
    };
    draw(tab);
  }

  /* ---------------- Shop ---------------- */
  function shop() {
    if (open) return;
    const { box, h, body } = openBox(HC.t('shop')); addClose(h);
    const draw = () => {
      body.innerHTML = '<div class="card" style="border-color:#f0c020">🪙 <b>' + HC.store.get().xu + '</b> Xu</div>';
      HC.shop.defs.forEach(d => {
        const lv = HC.shop.lv(d.id), maxed = lv >= d.max, cost = HC.shop.cost(d);
        const row = HC.el('div', 'row');
        row.innerHTML = '<div class="nm">' + HC.esc(HC.t('shop_' + d.id)) + (d.max > 1 ? ' <span class="chip">' + lv + '/' + d.max + '</span>' : (lv ? ' <span class="chip">✓</span>' : '')) + '<small>' + HC.esc(HC.t('shop_' + d.id + '_d')) + '</small></div>';
        const b = HC.el('button', 'btn gold', maxed ? HC.t('shop_max') : '🪙 ' + cost);
        b.disabled = maxed || HC.store.get().xu < cost;
        b.onclick = () => { if (HC.shop.buy(d.id)) { HC.audio.good(); draw(); } };
        row.appendChild(b); body.appendChild(row);
      });
    };
    draw();
  }

  /* ---------------- Settings ---------------- */
  function settings() {
    if (open) return;
    const { box, h, body } = openBox(HC.t('settings')); addClose(h);
    const draw = () => {
      const s = HC.store.get();
      body.innerHTML = '';
      const row = (label, el) => { const r = HC.el('div', 'row'); r.appendChild(HC.el('span', 'nm', HC.esc(label))); r.appendChild(el); body.appendChild(r); };
      const lg = HC.el('div', 'tabs'); lg.style.margin = 0;
      ['en', 'vi'].forEach(l => { const b = HC.el('button', 'tab' + (HC.i18n.lang === l ? ' on' : ''), l === 'en' ? 'English' : 'Tiếng Việt'); b.onclick = () => { HC.i18n.set(l); close(); settings(); }; lg.appendChild(b); });
      row(HC.t('set_lang'), lg);
      const snd = HC.el('button', 'btn', s.settings.sound !== false ? HC.t('on') : HC.t('off')); snd.onclick = () => { s.settings.sound = s.settings.sound === false; HC.store.save(); HC.audio.click(); draw(); }; row(HC.t('set_sound'), snd);
      const fs = HC.el('button', 'btn', HC.t('set_fs_btn')); fs.onclick = () => HC.fullscreen(); row(HC.t('set_fs'), fs);
      const rs = HC.el('button', 'btn', HC.t('set_reset_btn')); let armed = false;
      rs.onclick = () => { if (!armed) { armed = true; rs.textContent = HC.t('set_reset_sure'); rs.style.borderColor = '#ff4a4a'; setTimeout(() => { armed = false; rs.textContent = HC.t('set_reset_btn'); rs.style.borderColor = ''; }, 4000); } else { HC.store.reset(); location.reload(); } };
      row(HC.t('set_reset'), rs);
      body.appendChild(HC.el('div', 'card', HC.esc(HC.CONFIG.name + ' v' + HC.CONFIG.version) + '<br>' + HC.t('set_about')));
    };
    draw();
  }

  /* ---------------- Day summary ---------------- */
  function summary(sum) {
    return new Promise(res => {
      const { box, body, h } = openBox(HC.t('sum_title', { n: sum.day }), true);
      const st = sum.stats, tot = st.ok + st.near + st.bad;
      const R = (k, v) => '<div class="row"><span>' + HC.t(k) + '</span><span class="nm">' + v + '</span></div>';
      const rate = tot ? st.ok / tot : 0;
      const mark = rate >= 0.85 ? 'sum_great' : rate >= 0.55 ? 'sum_ok' : 'sum_bad';
      body.innerHTML = R('sum_souls', tot) + R('sum_perfect', st.ok) + R('sum_near', st.near) + R('sum_wrong', st.bad) + R('sum_kpi', (st.kpi >= 0 ? '+' : '') + st.kpi) + R('sum_xu', '+' + st.xu) + R('sum_salary', '+' + sum.salary) +
        '<div class="card new">😈 ' + HC.esc(HC.t(mark)) + '</div>' +
        (HC.store.get().event && HC.store.get().event !== 'normal' ? '<div class="card">' + HC.esc(HC.t('sum_tomorrow', { e: HC.t('ev_' + HC.store.get().event) })) + '</div>' : '');
      const b = HC.el('button', 'btn gold', HC.t('sum_next')); b.style.marginTop = '.6rem'; b.onclick = () => { HC.audio.click(); close(); res(); };
      box.appendChild(b);
    });
  }

  function isOpen() { return open; }
  function init() { document.addEventListener('keydown', e => { if (e.key === 'Escape' && open && !closeCb) close(); else if (!open && !HC.dialogue.active() && HC.scenes.name === 'office') { if (e.key === 'c' || e.key === 'C') codex(); if (e.key === 's' || e.key === 'S') shop(); } }); }
  return { init, codex, shop, settings, summary, isOpen, close };
})();

HC.fullscreen = function () {
  const d = document, el = d.documentElement;
  try {
    if (!d.fullscreenElement) {
      (el.requestFullscreen ? el.requestFullscreen() : (el.webkitRequestFullscreen && el.webkitRequestFullscreen()));
      if (screen.orientation && screen.orientation.lock) setTimeout(() => screen.orientation.lock('landscape').catch(() => { }), 300);
    } else if (d.exitFullscreen) d.exitFullscreen();
  } catch (e) { }
};
